import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  findAll(): Promise<Feedback[]> {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Feedback> {
    return this.feedbackService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    return this.feedbackService.update(+id, updateFeedbackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.feedbackService.remove(+id);
  }

  // CORRECTION: Endpoint pour les feedbacks admin
  @Get('admin/:adminId')
  async getFeedbacksForAdmin(
    @Param('adminId') adminId: string,
    @Query('enqueteId') enqueteId?: string,
  ): Promise<Feedback[]> {
    return this.feedbackService.getFeedbacksForAdmin(+adminId, enqueteId ? +enqueteId : undefined);
  }

  // Nouvel endpoint pour les statistiques admin
  @Get('stats/admin/:adminId')
  async getStatsForAdmin(@Param('adminId') adminId: string): Promise<any> {
    return this.feedbackService.getStatsForAdmin(+adminId);
  }
}