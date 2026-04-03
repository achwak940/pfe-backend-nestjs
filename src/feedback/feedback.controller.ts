import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // 🔹 Créer un nouveau feedback
  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    return this.feedbackService.create(createFeedbackDto);
  }

  // 🔹 Récupérer tous les feedbacks
  @Get()
  findAll(): Promise<Feedback[]> {
    return this.feedbackService.findAll();
  }

  // 🔹 Récupérer un feedback par son id
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Feedback> {
    return this.feedbackService.findOne(+id);
  }

  // 🔹 Mettre à jour un feedback
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    return this.feedbackService.update(+id, updateFeedbackDto);
  }

  // 🔹 Supprimer un feedback
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.feedbackService.remove(+id);
  }

  // 🔹 Récupérer les feedbacks pour un admin
  // URL exemple: /feedback/admin/9?enqueteId=26
  @Get('admin/:adminId')
  getFeedbacksForAdmin(
    @Param('adminId') adminId: string,
    @Query('enqueteId') enqueteId?: string,
  ): Promise<Feedback[]> {
    return this.feedbackService.getFeedbacksForAdmin(
      +adminId,
      enqueteId ? +enqueteId : undefined,
    );
  }
}