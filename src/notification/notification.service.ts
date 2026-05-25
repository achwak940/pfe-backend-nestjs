import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification, NotificationType } from './entities/notification.entity';
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
  ) {}

  // ==================== CRÉATION ====================
  
  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create({
      titre: createNotificationDto.titre,
      contenu: createNotificationDto.contenu,
      type: createNotificationDto.type || NotificationType.SYSTEME,
      utilisateur: createNotificationDto.utilisateurId ? { id: createNotificationDto.utilisateurId } as Utilisateur : undefined,
      message: createNotificationDto.messageId ? { id: createNotificationDto.messageId } as any : undefined,
      lu: false,
    });
    
    return this.notificationRepository.save(notification);
  }

  async createForUser(
    userId: number,
    titre: string,
    contenu: string,
    type: NotificationType = NotificationType.SYSTEME,
    messageId?: number
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      titre,
      contenu,
      type,
      utilisateur: { id: userId } as Utilisateur,
      message: messageId ? { id: messageId } as any : undefined,
      lu: false,
    });
    
    return this.notificationRepository.save(notification);
  }

  async createForAllUsers(
    titre: string,
    contenu: string,
    type: NotificationType = NotificationType.SYSTEME
  ): Promise<Notification[]> {
    const users = await this.utilisateurRepository.find({ select: ['id'] });
    
    const notifications: Notification[] = [];
    for (const user of users) {
      const notification = this.notificationRepository.create({
        titre,
        contenu,
        type,
        utilisateur: { id: user.id } as Utilisateur,
        lu: false,
      });
      notifications.push(await this.notificationRepository.save(notification));
    }
    
    return notifications;
  }

  // ==================== RÉCUPÉRATION ====================
  
  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.find({
      order: { dateCreation: 'DESC' },
      relations: ['utilisateur', 'message'],
    });
  }

  async findAllWithPagination(page: number = 1, limit: number = 10): Promise<{
    data: Notification[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const [data, total] = await this.notificationRepository.findAndCount({
      order: { dateCreation: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['utilisateur', 'message'],
    });
    
    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['utilisateur', 'message'],
    });
    
    if (!notification) {
      throw new NotFoundException(`Notification avec l'ID ${id} non trouvée`);
    }
    
    return notification;
  }

  async findByUser(userId: number, limit?: number): Promise<Notification[]> {
    const query = this.notificationRepository
      .createQueryBuilder('n')
      .leftJoinAndSelect('n.utilisateur', 'u')
      .leftJoinAndSelect('n.message', 'm')
      .where('u.id = :userId', { userId })
      .orderBy('n.dateCreation', 'DESC');
    
    if (limit) {
      query.limit(limit);
    }
    
    return query.getMany();
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { utilisateur: { id: userId }, lu: false },
      order: { dateCreation: 'DESC' },
      relations: ['utilisateur', 'message'],
    });
  }

  async countUnread(userId: number): Promise<number> {
    return this.notificationRepository.count({
      where: { utilisateur: { id: userId }, lu: false },
    });
  }

  async getRecentNotifications(userId: number, days: number = 7): Promise<Notification[]> {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);
    
    return this.notificationRepository.find({
      where: {
        utilisateur: { id: userId },
        dateCreation: MoreThan(dateLimit),
      },
      order: { dateCreation: 'DESC' },
      relations: ['utilisateur', 'message'],
    });
  }

  async findByType(type: NotificationType, userId?: number): Promise<Notification[]> {
    const query = this.notificationRepository
      .createQueryBuilder('n')
      .leftJoinAndSelect('n.utilisateur', 'u')
      .where('n.type = :type', { type })
      .orderBy('n.dateCreation', 'DESC');
    
    if (userId) {
      query.andWhere('u.id = :userId', { userId });
    }
    
    return query.getMany();
  }

  async getStats(userId?: number): Promise<{
    total: number;
    nonLues: number;
    parType: Record<string, number>;
    dernieresNotifications: Notification[];
  }> {
    const whereCondition: any = {};
    if (userId) {
      whereCondition.utilisateur = { id: userId };
    }
    
    const [total, nonLues, notifications, typeStats] = await Promise.all([
      this.notificationRepository.count({ where: whereCondition }),
      this.notificationRepository.count({ where: { ...whereCondition, lu: false } }),
      this.notificationRepository.find({
        where: whereCondition,
        order: { dateCreation: 'DESC' },
        take: 10,
        relations: ['utilisateur', 'message'],
      }),
      this.notificationRepository
        .createQueryBuilder('n')
        .select('n.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .where(userId ? 'n.utilisateurId = :userId' : '1=1', userId ? { userId } : {})
        .groupBy('n.type')
        .getRawMany(),
    ]);
    
    const parType: Record<string, number> = {};
    typeStats.forEach(ts => {
      parType[ts.type] = parseInt(ts.count);
    });
    
    return {
      total,
      nonLues,
      parType,
      dernieresNotifications: notifications,
    };
  }

  // ==================== MISES À JOUR ====================
  
  async update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);
    
    if (updateNotificationDto.titre) notification.titre = updateNotificationDto.titre;
    if (updateNotificationDto.contenu) notification.contenu = updateNotificationDto.contenu;
    if (updateNotificationDto.type) notification.type = updateNotificationDto.type;
    if (updateNotificationDto.lu !== undefined) notification.lu = updateNotificationDto.lu;
    
    return this.notificationRepository.save(notification);
  }

  async markAsRead(id: number): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.lu = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: number): Promise<{ count: number }> {
    const result = await this.notificationRepository.update(
      { utilisateur: { id: userId }, lu: false },
      { lu: true }
    );
    
    return { count: result.affected || 0 };
  }

  // ==================== SUPPRESSION ====================
  
  async remove(id: number): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationRepository.remove(notification);
  }

  async removeAllByUser(userId: number): Promise<{ count: number }> {
    const result = await this.notificationRepository.delete({ utilisateur: { id: userId } });
    return { count: result.affected || 0 };
  }

  async removeOldNotifications(days: number = 30): Promise<{ count: number }> {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);
    
    const result = await this.notificationRepository.delete({
      dateCreation: LessThan(dateLimit),
    });
    
    return { count: result.affected || 0 };
  }

  // ==================== NOTIFICATIONS AUTOMATIQUES ====================
  
  async notifyNewSurvey(userId: number, surveyTitle: string): Promise<Notification> {
    return this.createForUser(
      userId,
      '📋 Nouvelle enquête créée',
      `Votre enquête "${surveyTitle}" a été créée avec succès.`,
      NotificationType.ENQUETE
    );
  }

  async notifySurveyPublished(userId: number, surveyTitle: string): Promise<Notification> {
    return this.createForUser(
      userId,
      '✅ Enquête publiée',
      `Votre enquête "${surveyTitle}" est maintenant publiée et accessible aux utilisateurs.`,
      NotificationType.ENQUETE
    );
  }

  async notifyNewResponse(adminId: number, surveyTitle: string, userName: string): Promise<Notification> {
    return this.createForUser(
      adminId,
      '📊 Nouvelle réponse',
      `${userName} a répondu à votre enquête "${surveyTitle}".`,
      NotificationType.ENQUETE
    );
  }

  async notifyNewReclamation(adminId: number, reclamationTitle: string): Promise<Notification> {
    return this.createForUser(
      adminId,
      '⚠️ Nouvelle réclamation',
      `Une nouvelle réclamation "${reclamationTitle}" a été soumise.`,
      NotificationType.RECLAMATION
    );
  }

  async notifyReclamationResolved(userId: number, reclamationTitle: string): Promise<Notification> {
    return this.createForUser(
      userId,
      '✅ Réclamation résolue',
      `Votre réclamation "${reclamationTitle}" a été résolue.`,
      NotificationType.RECLAMATION
    );
  }

  async notifyNewMessage(userId: number, fromUserName: string): Promise<Notification> {
    return this.createForUser(
      userId,
      '💬 Nouveau message',
      `Vous avez reçu un nouveau message de ${fromUserName}.`,
      NotificationType.MESSAGE
    );
  }

  async notifySurveyReminder(userId: number, surveyTitle: string, daysLeft: number): Promise<Notification> {
    return this.createForUser(
      userId,
      '⏰ Rappel enquête',
      `Votre enquête "${surveyTitle}" se termine dans ${daysLeft} jours.`,
      NotificationType.ENQUETE
    );
  }
}