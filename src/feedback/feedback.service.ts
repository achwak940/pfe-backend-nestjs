import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = this.feedbackRepository.create(createFeedbackDto);
    return this.feedbackRepository.save(feedback);
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      relations: ['utilisateur', 'enquete'],
      order: { date_creation: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
      relations: ['utilisateur', 'enquete'],
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback avec id ${id} non trouvé`);
    }

    return feedback;
  }

  async update(id: number, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    const feedback = await this.findOne(id);
    Object.assign(feedback, updateFeedbackDto);
    return this.feedbackRepository.save(feedback);
  }

  async remove(id: number): Promise<void> {
    const feedback = await this.findOne(id);
    await this.feedbackRepository.remove(feedback);
  }

  // CORRECTION IMPORTANTE: Récupérer les feedbacks pour un admin
  async getFeedbacksForAdmin(adminId: number, enqueteId?: number): Promise<Feedback[]> {
    const query = this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.utilisateur', 'utilisateur')
      .leftJoinAndSelect('feedback.enquete', 'enquete')
      .where('enquete.userId = :adminId', { adminId });

    if (enqueteId) {
      query.andWhere('enquete.id = :enqueteId', { enqueteId });
    }

    return query.orderBy('feedback.date_creation', 'DESC').getMany();
  }

  // Nouvelle méthode pour obtenir les statistiques
  async getStatsForAdmin(adminId: number): Promise<any> {
    const feedbacks = await this.getFeedbacksForAdmin(adminId);
    
    const total = feedbacks.length;
    const nouveaux = feedbacks.filter(f => f.statut === 'nouveau').length;
    const enCours = feedbacks.filter(f => f.statut === 'en_cours').length;
    const resolus = feedbacks.filter(f => f.statut === 'resolu').length;
    
    const suggestions = feedbacks.filter(f => f.type === 'suggestion').length;
    const problemes = feedbacks.filter(f => f.type === 'probleme_technique').length;
    const questions = feedbacks.filter(f => f.type === 'question').length;
    
    return {
      total,
      nouveaux,
      enCours,
      resolus,
      suggestions,
      problemes,
      questions,
      tauxResolution: total > 0 ? Math.round((resolus / total) * 100) : 0
    };
  }
}