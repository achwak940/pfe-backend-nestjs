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

  // 🔹 Créer un nouveau feedback
  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = this.feedbackRepository.create(createFeedbackDto);
    return this.feedbackRepository.save(feedback);
  }

  // 🔹 Récupérer tous les feedbacks
  async findAll(): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      relations: ['utilisateur', 'enquete'],
      order: { date_creation: 'DESC' },
    });
  }

  // 🔹 Récupérer un feedback par son id
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

  // 🔹 Mettre à jour un feedback existant
  async update(id: number, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback avec id ${id} non trouvé`);
    }

    Object.assign(feedback, updateFeedbackDto); // applique les changements
    return this.feedbackRepository.save(feedback);
  }

  // 🔹 Supprimer un feedback
  async remove(id: number): Promise<void> {
    const feedback = await this.feedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new NotFoundException(`Feedback avec id ${id} non trouvé`);
    }
    await this.feedbackRepository.delete(id);
  }

  // 🔹 Récupérer les feedbacks pour un admin
  // Si enqueteId est fourni, filtre uniquement cette enquête
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
}