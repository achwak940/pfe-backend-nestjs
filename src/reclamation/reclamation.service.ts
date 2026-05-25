// src/reclamation/reclamation.service.ts
import { Repository, Between, Like, In, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Reclamation } from './entities/reclamation.entity';
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity';
import {
  CreateReclamationDto,
  UpdateReclamationDto,
  ReponseReclamationDto,
  FiltreReclamationDto,
  YoloAnalysisDto,
  StatutCountDto,
} from './dto/create-reclamation.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ReclamationService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'reclamations');
  private emailTransporter: nodemailer.Transporter;
  private readonly logger = new Logger(ReclamationService.name);

  constructor(
    @InjectRepository(Reclamation)
    private readonly reclamationRepo: Repository<Reclamation>,
    @InjectRepository(Utilisateur)
    private readonly utilisateurRepo: Repository<Utilisateur>,
  ) {
    this.ensureUploadDirectory();
    this.initEmailTransporter();
  }

  private initEmailTransporter(): void {
    this.emailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'belliliachwek@gmail.com',
        pass: 'ujgu vylh uuiz yhzh',
      },
    });
    this.logger.log('✅ Service email initialisé pour les réclamations');
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: '"Service Réclamation" <belliliachwek@gmail.com>',
        to,
        subject,
        html,
      };
      await this.emailTransporter.sendMail(mailOptions);
      this.logger.log(`✅ Email envoyé à ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email à ${to}:`, error);
      return false;
    }
  }

  private ensureUploadDirectory(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`✅ Dossier créé: ${this.uploadDir}`);
    } else {
      this.logger.log(`📁 Dossier uploads existe déjà: ${this.uploadDir}`);
    }
  }

  private generateEmailTemplate(
    title: string,
    content: string,
    buttonText: string,
    buttonLink: string,
    color: string = '#9D50BB',
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f3ff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 35px -10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
          .header p { color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 14px; }
          .content { padding: 40px 30px; }
          .content p { color: #4a5568; line-height: 1.6; margin-bottom: 20px; }
          .info-box { background: #f9fafb; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid ${color}; }
          .info-box strong { color: #1f2937; display: block; margin-bottom: 5px; }
          .btn { display: inline-block; background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 10px; margin: 20px 0; font-weight: 500; transition: transform 0.2s; }
          .btn:hover { transform: translateY(-2px); }
          .footer { background: #f9fafb; padding: 25px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
          .footer a { color: ${color}; text-decoration: none; }
          @media (max-width: 600px) { .content { padding: 25px 20px; } .header { padding: 30px 20px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
            <p>Service Client</p>
          </div>
          <div class="content">
            ${content}
            <div style="text-align: center;">
              <a href="${buttonLink}" class="btn">${buttonText}</a>
            </div>
          </div>
          <div class="footer">
            <p>Cet email est un message automatique, merci de ne pas y répondre.</p>
            <p>&copy; ${new Date().getFullYear()} - Service Client</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }


  async create(createReclamationDto: CreateReclamationDto): Promise<Reclamation> {
    this.logger.log(`📝 create - Début`);
    
    const reclamation = new Reclamation();

    reclamation.titre = createReclamationDto.titre ?? 'Sans titre';
    reclamation.description = createReclamationDto.description ?? null;
    reclamation.typeDommage = createReclamationDto.typeDommage ?? null;
    reclamation.totalSeverite = createReclamationDto.totalSeverite ?? 0;
    reclamation.dommagesDetectes = createReclamationDto.dommagesDetectes ?? 0;
    reclamation.gravite = createReclamationDto.gravite ?? 0;
    reclamation.confiance = createReclamationDto.confiance ?? 0;
    reclamation.statut = createReclamationDto.statut ?? 'DETECTE';
    reclamation.imageUrl = createReclamationDto.imageUrl ?? null;
    reclamation.imageName = createReclamationDto.imageName ?? null;
    reclamation.userId = createReclamationDto.userId ?? null;

    if (createReclamationDto.userId) {
      const user = await this.utilisateurRepo.findOne({ where: { id: createReclamationDto.userId } });
      if (user) {
        reclamation.user = user;
        this.logger.log(`👤 Utilisateur associé: ${user.email}`);
      }
    } 

    const savedReclamation = await this.reclamationRepo.save(reclamation);
    this.logger.log(`✅ Réclamation créée ID: ${savedReclamation.id}`);

    if (savedReclamation.user?.email) {
      const content = `
        <p>Bonjour <strong>${savedReclamation.user.prenom} ${savedReclamation.user.nom}</strong>,</p>
        <div class="info-box">
          <strong>Réclamation #${savedReclamation.id}</strong><br>
          <strong>Titre:</strong> ${savedReclamation.titre}<br>
          <strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}<br>
          <strong>Statut:</strong> En attente de traitement
        </div>
        <p>Nous vous confirmons la réception de votre réclamation. Notre équipe l'examine et vous tiendra informé de son évolution.</p>
      `;
      await this.sendEmail(
        savedReclamation.user.email,
        `Confirmation réclamation #${savedReclamation.id}`,
        this.generateEmailTemplate('Confirmation', content, 'Suivre ma réclamation', 'http://localhost:4200/dashboard/client/mes-reclamations', '#10b981'),
      );
    }

    return savedReclamation;
  }

  async createWithImage(
    createReclamationDto: CreateReclamationDto,
    file?: Express.Multer.File,
  ): Promise<Reclamation> {
    this.logger.log('🚀 createWithImage - Début');
    this.logger.log(`DTO: ${JSON.stringify(createReclamationDto)}`);
    this.logger.log(`Fichier: ${file ? file.originalname : 'AUCUN'}`);
    this.logger.log(`Buffer existe: ${file ? !!file.buffer : false}`);

    const reclamation = new Reclamation();

    reclamation.titre = createReclamationDto.titre ?? 'Sans titre';
    reclamation.description = createReclamationDto.description ?? null;
    reclamation.typeDommage = createReclamationDto.typeDommage ?? null;
    reclamation.totalSeverite = createReclamationDto.totalSeverite ?? 0;
    reclamation.dommagesDetectes = createReclamationDto.dommagesDetectes ?? 0;
    reclamation.gravite = createReclamationDto.gravite ?? 0;
    reclamation.confiance = createReclamationDto.confiance ?? 0;
    reclamation.statut = createReclamationDto.statut ?? 'DETECTE';

    if (file && file.buffer) {
      this.logger.log('📸 Sauvegarde du fichier...');
      try {
        const { imageUrl, imageName } = await this.saveImage(file);
        reclamation.imageUrl = imageUrl;
        reclamation.imageName = imageName;
        this.logger.log(`✅ Image sauvegardée: ${imageUrl}`);
      } catch (error) {
        this.logger.error(`❌ Erreur lors de la sauvegarde: ${error.message}`);
        throw error;
      }
    } else if (createReclamationDto.imageUrl) {
      this.logger.log(`📸 Utilisation URL existante: ${createReclamationDto.imageUrl}`);
      reclamation.imageUrl = createReclamationDto.imageUrl;
      reclamation.imageName = createReclamationDto.imageName ?? null;
    } else {
      this.logger.log('⚠️ Aucune image fournie');
      reclamation.imageUrl = null;
      reclamation.imageName = null;
    }

    if (createReclamationDto.userId) {
      reclamation.userId = createReclamationDto.userId;
      const user = await this.utilisateurRepo.findOne({ where: { id: createReclamationDto.userId } });
      if (user) {
        reclamation.user = user;
        this.logger.log(`👤 Utilisateur: ${user.email}`);
      }
    }

    const savedReclamation = await this.reclamationRepo.save(reclamation);
    this.logger.log(`✅ Réclamation créée ID: ${savedReclamation.id}, Image: ${savedReclamation.imageUrl || 'Aucune'}`);

    if (savedReclamation.user?.email) {
      const imageHtml = savedReclamation.imageUrl
        ? `<p><strong>Image jointe:</strong> <a href="http://localhost:3000${savedReclamation.imageUrl}" style="color: #9D50BB;">Voir l'image</a></p>`
        : '';
      const content = `
        <p>Bonjour <strong>${savedReclamation.user.prenom} ${savedReclamation.user.nom}</strong>,</p>
        <div class="info-box">
          <strong>Réclamation #${savedReclamation.id}</strong><br>
          <strong>Titre:</strong> ${savedReclamation.titre}<br>
          <strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}<br>
          ${imageHtml}
        </div>
        <p>Votre réclamation a été enregistrée avec succès. Nous la traiterons dans les plus brefs délais.</p>
      `;
      await this.sendEmail(
        savedReclamation.user.email,
        `Confirmation réclamation #${savedReclamation.id}`,
        this.generateEmailTemplate('Réclamation enregistrée', content, 'Voir mes réclamations', 'http://localhost:4200/dashboard/client/mes-reclamations', '#10b981'),
      );
    }

    return savedReclamation;
  }

  async createFromYolo(yoloResult: YoloAnalysisDto, userId: number): Promise<Reclamation> {
    const createDto: CreateReclamationDto = {
      titre: yoloResult.title || 'Détection IA',
      description: yoloResult.description || 'Détection automatique par YOLO',
      typeDommage: yoloResult.category || 'Non spécifié',
      totalSeverite: yoloResult.totalSeverity || yoloResult.averageGravity || 0,
      dommagesDetectes: yoloResult.damageCount || 1,
      gravite: yoloResult.averageGravity || 5,
      confiance: yoloResult.averageConfidence || 0.8,
      statut: 'DETECTE',
      userId: userId,
      imageUrl: yoloResult.image_url,
      imageName: yoloResult.imageName,
    };

    return this.create(createDto);
  }

  async findAll(
    filtres?: FiltreReclamationDto,
  ): Promise<{ data: Reclamation[]; total: number; page: number; limit: number; totalPages: number }> {
    const where: any = {};

    if (filtres) {
      if (filtres.statut) where.statut = filtres.statut;
      if (filtres.statuts?.length) where.statut = In(filtres.statuts);

      if (filtres.graviteMin !== undefined && filtres.graviteMax !== undefined) {
        where.gravite = Between(filtres.graviteMin, filtres.graviteMax);
      } else if (filtres.graviteMin !== undefined) {
        where.gravite = MoreThanOrEqual(filtres.graviteMin);
      } else if (filtres.graviteMax !== undefined) {
        where.gravite = LessThanOrEqual(filtres.graviteMax);
      }

      if (filtres.confianceMin !== undefined) where.confiance = MoreThanOrEqual(filtres.confianceMin);
      if (filtres.dateDebut && filtres.dateFin) {
        where.createdAt = Between(new Date(filtres.dateDebut), new Date(filtres.dateFin));
      } else if (filtres.dateDebut) {
        where.createdAt = MoreThanOrEqual(new Date(filtres.dateDebut));
      } else if (filtres.dateFin) {
        where.createdAt = LessThanOrEqual(new Date(filtres.dateFin));
      }
      if (filtres.userId) where.userId = filtres.userId;
      if (filtres.search) where.titre = Like(`%${filtres.search}%`);
    }

    const page = filtres?.page || 1;
    const limit = filtres?.limit || 100;
    const skip = (page - 1) * limit;

    const [data, total] = await this.reclamationRepo.findAndCount({
      where,
      relations: ['user'],
      order: { createdAt: filtres?.orderBy === 'ASC' ? 'ASC' : 'DESC' },
      skip,
      take: limit,
    });

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number): Promise<Reclamation> {
    const reclamation = await this.reclamationRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!reclamation) {
      throw new NotFoundException(`Réclamation #${id} non trouvée`);
    }
    return reclamation;
  }

  async update(id: number, updateReclamationDto: UpdateReclamationDto): Promise<Reclamation> {
    const reclamation = await this.findOne(id);
    const ancienStatut = reclamation.statut;

    Object.assign(reclamation, updateReclamationDto);

    if (updateReclamationDto.userId && updateReclamationDto.userId !== reclamation.userId) {
      const user = await this.utilisateurRepo.findOne({ where: { id: updateReclamationDto.userId } });
      if (user) reclamation.user = user;
    }

    const updatedReclamation = await this.reclamationRepo.save(reclamation);

    if (updateReclamationDto.statut && updateReclamationDto.statut !== ancienStatut && updatedReclamation.user?.email) {
      const statutColors: Record<string, string> = {
        DETECTE: '#f59e0b',
        EN_COURS: '#3b82f6',
        RESOLU: '#10b981',
        REJETE: '#ef4444',
      };
      const statutLabels: Record<string, string> = {
        DETECTE: 'Détectée',
        EN_COURS: 'En cours de traitement',
        RESOLU: 'Résolue',
        REJETE: 'Rejetée',
      };

      const content = `
        <p>Bonjour <strong>${updatedReclamation.user.prenom} ${updatedReclamation.user.nom}</strong>,</p>
        <div class="info-box">
          <strong>Réclamation #${updatedReclamation.id}</strong><br>
          <strong>Titre:</strong> ${updatedReclamation.titre}<br>
          <strong>Ancien statut:</strong> ${statutLabels[ancienStatut] || ancienStatut}<br>
          <strong>Nouveau statut:</strong> ${statutLabels[updateReclamationDto.statut] || updateReclamationDto.statut}
        </div>
        <p>Le statut de votre réclamation a été mis à jour.</p>
      `;
      await this.sendEmail(
        updatedReclamation.user.email,
        `Mise à jour réclamation #${updatedReclamation.id}`,
        this.generateEmailTemplate('Mise à jour', content, 'Voir mes réclamations', 'http://localhost:4200/dashboard/client/mes-reclamations', statutColors[updateReclamationDto.statut] || '#9D50BB'),
      );
    }

    return updatedReclamation;
  }

 

  async findByUser(userId: number): Promise<Reclamation[]> {
    return this.reclamationRepo.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatut(statut: string): Promise<Reclamation[]> {
    return this.reclamationRepo.find({
      where: { statut },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCountByStatut(): Promise<StatutCountDto[]> {
    const results = await this.reclamationRepo
      .createQueryBuilder('r')
      .select('r.statut', 'statut')
      .addSelect('COUNT(*)', 'count')
      .groupBy('r.statut')
      .getRawMany();
    return results.map((r) => ({ statut: r.statut, count: parseInt(r.count) }));
  }

  async getCountByGravite(): Promise<any> {
    return {
      faible: await this.reclamationRepo.count({ where: { gravite: Between(0, 3.9) } }),
      moyenne: await this.reclamationRepo.count({ where: { gravite: Between(4, 6.9) } }),
      elevee: await this.reclamationRepo.count({ where: { gravite: Between(7, 8.9) } }),
      critique: await this.reclamationRepo.count({ where: { gravite: Between(9, 10) } }),
    };
  }

  async changerStatut(id: number, statut: string): Promise<Reclamation> {
    const validStatuts = ['DETECTE', 'EN_COURS', 'RESOLU', 'REJETE'];
    if (!validStatuts.includes(statut)) {
      throw new BadRequestException(`Statut invalide. Valeurs acceptées: ${validStatuts.join(', ')}`);
    }

    const reclamation = await this.findOne(id);
    const ancienStatut = reclamation.statut;
    reclamation.statut = statut;
    if (statut === 'RESOLU') reclamation.dateReponse = new Date();

    const updatedReclamation = await this.reclamationRepo.save(reclamation);

    // Envoi d'email de notification de changement de statut
    if (updatedReclamation.user?.email) {
      const statutColors: Record<string, string> = {
        DETECTE: '#f59e0b',
        EN_COURS: '#3b82f6',
        RESOLU: '#10b981',
        REJETE: '#ef4444',
      };
      const statutLabels: Record<string, string> = {
        DETECTE: 'détectée',
        EN_COURS: 'en cours de traitement',
        RESOLU: 'résolue',
        REJETE: 'rejetée',
      };

      const content = `
        <p>Bonjour <strong>${updatedReclamation.user.prenom} ${updatedReclamation.user.nom}</strong>,</p>
        <div class="info-box">
          <strong>Réclamation #${updatedReclamation.id}</strong><br>
          <strong>Titre:</strong> ${updatedReclamation.titre}<br>
          <strong>Nouveau statut:</strong> ${statutLabels[statut] || statut}
        </div>
        <p>Le statut de votre réclamation a été mis à jour.</p>
      `;
      await this.sendEmail(
        updatedReclamation.user.email,
        `Mise à jour réclamation #${updatedReclamation.id}`,
        this.generateEmailTemplate('Mise à jour', content, 'Voir mes réclamations', 'http://localhost:4200/dashboard/client/mes-reclamations', statutColors[statut] || '#9D50BB'),
      );
    }

    return updatedReclamation;
  }

  async repondreReclamation(id: number, reponseDto: ReponseReclamationDto): Promise<Reclamation> {
    const reclamation = await this.findOne(id);

    reclamation.reponseAdmin = reponseDto.message;
    reclamation.dateReponse = new Date();
    if (reclamation.statut === 'DETECTE') reclamation.statut = 'EN_COURS';

    const updated = await this.reclamationRepo.save(reclamation);

    // Envoi d'email de réponse
    if (updated.user?.email) {
      const titreAffiche = updated.titre && updated.titre !== 'null' ? updated.titre : 'Sans titre';

      const content = `
        <p>Bonjour <strong>${updated.user.prenom} ${updated.user.nom}</strong>,</p>
        <div class="info-box">
          <strong>Réclamation #${updated.id}</strong><br>
          <strong>Titre:</strong> ${titreAffiche}<br>
          <strong>Date de création:</strong> ${new Date(updated.createdAt).toLocaleDateString('fr-FR')}
        </div>
        <p><strong>Réponse de notre service:</strong></p>
        <div class="info-box" style="border-left-color: #9D50BB;">
          ${reponseDto.message.replace(/\n/g, '<br>')}
        </div>
        <p>Nous restons à votre disposition pour toute information complémentaire.</p>
      `;
      await this.sendEmail(
        updated.user.email,
        `Réponse à votre réclamation #${updated.id}`,
        this.generateEmailTemplate('Réponse reçue', content, 'Voir ma réclamation', 'http://localhost:4200/dashboard/client/mes-reclamations', '#9D50BB'),
      );
      this.logger.log(`📧 Email envoyé à: ${updated.user.email}`);
    }

    // Simulation SMS (à implémenter avec un vrai service SMS)
    if (reponseDto.sendSMS && reclamation.user?.telephone) {
      this.logger.log(`📱 SMS envoyé à: ${reclamation.user.telephone}`);
    }

    return updated;
  }

  async getStats(): Promise<any> {
    const [total, enAttente, enCours, resolues, rejetees] = await Promise.all([
      this.reclamationRepo.count(),
      this.reclamationRepo.count({ where: { statut: 'DETECTE' } }),
      this.reclamationRepo.count({ where: { statut: 'EN_COURS' } }),
      this.reclamationRepo.count({ where: { statut: 'RESOLU' } }),
      this.reclamationRepo.count({ where: { statut: 'REJETE' } }),
    ]);

    const graviteResult = await this.reclamationRepo
      .createQueryBuilder('r')
      .select('AVG(r.gravite)', 'moyenne')
      .getRawOne();

    const evolutionParMois = await this.reclamationRepo
      .createQueryBuilder('r')
      .select("TO_CHAR(r.createdAt, 'YYYY-MM')", 'mois')
      .addSelect('COUNT(*)', 'total')
      .groupBy("TO_CHAR(r.createdAt, 'YYYY-MM')")
      .orderBy('mois', 'DESC')
      .limit(6)
      .getRawMany();

    return {
      total,
      enAttente,
      enCours,
      resolues,
      rejetees,
      graviteMoyenne: parseFloat(graviteResult?.moyenne || 0).toFixed(1),
      tauxResolution: total > 0 ? ((resolues / total) * 100).toFixed(1) : 0,
      evolutionParMois: evolutionParMois.map((item) => ({ mois: item.mois, total: parseInt(item.total) })),
      countByStatut: await this.getCountByStatut(),
      countByGravite: await this.getCountByGravite(),
    };
  }

  async supprimerMultiple(ids: number[]): Promise<{ deleted: number; message: string }> {
    let deleted = 0;
    for (const id of ids) {
      try {
        await this.remove(id);
        deleted++;
      } catch (error: any) {
        this.logger.error(`Erreur suppression ID ${id}:`, error.message);
      }
    }
    return { deleted, message: `${deleted} réclamation(s) supprimée(s) avec succès` };
  }

  async updateMultiple(
    ids: number[],
    updateData: Partial<UpdateReclamationDto>,
  ): Promise<{ updated: number; message: string }> {
    let updated = 0;
    for (const id of ids) {
      try {
        await this.update(id, updateData);
        updated++;
      } catch (error: any) {
        this.logger.error(`Erreur mise à jour ID ${id}:`, error.message);
      }
    }
    return { updated, message: `${updated} réclamation(s) mise(s) à jour avec succès` };
  }

  async exportToCsv(filtres?: FiltreReclamationDto): Promise<string> {
    const { data } = await this.findAll(filtres);
    const headers = [
      'ID',
      'Titre',
      'Description',
      'Type Dommage',
      'Gravité',
      'Confiance',
      'Statut',
      'Client',
      'Email',
      'Date Création',
      'Date Réponse',
    ];

    const rows = data.map((r) => [
      r.id,
      r.titre || '',
      (r.description || '').replace(/,/g, ';'),
      r.typeDommage || '',
      r.gravite || 0,
      `${(r.confiance || 0) * 100}%`,
      r.statut,
      r.user ? `${r.user.prenom || ''} ${r.user.nom || ''}`.trim() : 'Client inconnu',
      r.user?.email || '',
      r.createdAt?.toISOString().split('T')[0] || '',
      r.dateReponse?.toISOString().split('T')[0] || '',
    ]);

    return [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');
  }

  async getReclamationsAdministrateurs(): Promise<Reclamation[]> {
    return this.reclamationRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.user', 'u')
      .leftJoinAndSelect('u.role', 'ro')
      .where('ro.nom = :role', {
        role: 'Administrateur',
      })
      .orderBy('r.createdAt', 'DESC')
      .getMany();
  }
  // src/reclamation/reclamation.service.ts
// Seulement les méthodes modifiées sont présentées ici
// Le reste du fichier reste identique

// CORRECTION DE LA MÉTHODE saveImage
async saveImage(file: Express.Multer.File): Promise<{ imageUrl: string; imageName: string }> {
  this.logger.log(`📸 saveImage - Début`);
  this.logger.log(`📸 Fichier: ${file.originalname}, Taille: ${file.size} bytes`);
  
  this.ensureUploadDirectory();

  // Générer un nom de fichier unique mais lisible
  const originalName = file.originalname;
  const extension = path.extname(originalName);
  // Utiliser le nom original sans le chemin pour éviter les slashs
  const baseName = path.basename(originalName, extension);
  const safeBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
  const timestamp = Date.now();
  const filename = `${safeBaseName}_${timestamp}${extension}`;
  const filepath = path.join(this.uploadDir, filename);

  this.logger.log(`📁 Sauvegarde vers: ${filepath}`);

  try {
    if (!file.buffer) {
      throw new Error('file.buffer est undefined - le fichier n\'a pas été chargé correctement');
    }
    
    fs.writeFileSync(filepath, file.buffer);
    this.logger.log(`✅ Image sauvegardée: ${filepath}`);

    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      this.logger.log(`✅ Fichier vérifié - Taille: ${stats.size} bytes`);
    } else {
      this.logger.error(`❌ Fichier non trouvé après sauvegarde!`);
      throw new Error('Échec de la sauvegarde du fichier');
    }

    // URL correcte pour le serveur statique
    const imageUrl = `/uploads/reclamations/${filename}`;
    this.logger.log(`✅ Image URL: ${imageUrl}`);
    
    return {
      imageUrl: imageUrl,
      imageName: file.originalname,
    };
  } catch (error) {
    this.logger.error(`❌ Erreur sauvegarde image: ${error.message}`);
    throw error;
  }
}

// CORRECTION DE LA MÉTHODE updateImage
async updateImage(id: number, file: Express.Multer.File): Promise<Reclamation> {
  this.logger.log(`🖼️ updateImage - ID: ${id}`);
  const reclamation = await this.findOne(id);

  if (reclamation.imageUrl) {
    // Extraire le nom du fichier de l'URL
    const oldImageName = path.basename(reclamation.imageUrl);
    const oldImagePath = path.join(this.uploadDir, oldImageName);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
      this.logger.log(`🗑️ Ancienne image supprimée: ${oldImagePath}`);
    }
  }

  const { imageUrl, imageName } = await this.saveImage(file);
  reclamation.imageUrl = imageUrl;
  reclamation.imageName = imageName;

  const updated = await this.reclamationRepo.save(reclamation);
  this.logger.log(`✅ Image mise à jour pour réclamation ${id}`);
  
  return updated;
}

// CORRECTION DE LA MÉTHODE remove (suppression d'image)
async remove(id: number): Promise<void> {
  const reclamation = await this.findOne(id);
  if (reclamation.imageUrl) {
    // Extraire le nom du fichier de l'URL
    const imageName = path.basename(reclamation.imageUrl);
    const imagePath = path.join(this.uploadDir, imageName);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      this.logger.log(`🗑️ Image supprimée: ${imagePath}`);
    } else {
      // Essayer avec le chemin complet original (compatibilité)
      const oldImagePath = path.join(process.cwd(), reclamation.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        this.logger.log(`🗑️ Image supprimée (chemin ancien): ${oldImagePath}`);
      }
    }
  }
  await this.reclamationRepo.remove(reclamation);
  this.logger.log(`✅ Réclamation ${id} supprimée`);
}
  
}   