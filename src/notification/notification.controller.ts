import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationType } from './entities/notification.entity';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // ==================== CRÉATION ====================
  
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Post('user/:userId')
  createForUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('titre') titre: string,
    @Body('contenu') contenu: string,
    @Body('type') type: NotificationType,
    @Body('messageId') messageId?: number,
  ) {
    return this.notificationService.createForUser(userId, titre, contenu, type, messageId);
  }

  @Post('all-users')
  createForAllUsers(
    @Body('titre') titre: string,
    @Body('contenu') contenu: string,
    @Body('type') type: NotificationType,
  ) {
    return this.notificationService.createForAllUsers(titre, contenu, type);
  }

  // ==================== RÉCUPÉRATION ====================
  
  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    if (page && limit) {
      return this.notificationService.findAllWithPagination(+page, +limit);
    }
    return this.notificationService.findAll();
  }

  @Get('stats')
  getStats(@Query('userId') userId?: string) {
    const id = userId ? parseInt(userId) : undefined;
    return this.notificationService.getStats(id);
  }

  @Get('user/:userId')
  findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit') limit?: string,
  ) {
    const limitNumber = limit ? parseInt(limit) : undefined;
    return this.notificationService.findByUser(userId, limitNumber);
  }

  @Get('user/:userId/unread')
  getUnread(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationService.getUnreadNotifications(userId);
  }

  @Get('user/:userId/unread/count')
  countUnread(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationService.countUnread(userId);
  }

  @Get('user/:userId/recent')
  getRecent(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('days') days?: string,
  ) {
    const daysNumber = days ? parseInt(days) : 7;
    return this.notificationService.getRecentNotifications(userId, daysNumber);
  }

  @Get('type/:type')
  findByType(
    @Param('type') type: NotificationType,
    @Query('userId') userId?: string,
  ) {
    const id = userId ? parseInt(userId) : undefined;
    return this.notificationService.findByType(type, id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.findOne(id);
  }

  // ==================== MISES À JOUR ====================
  
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.markAsRead(id);
  }

  @Patch('user/:userId/read-all')
  markAllAsRead(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationService.markAllAsRead(userId);
  }

  // ==================== SUPPRESSION ====================
  
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.remove(id);
  }

  @Delete('user/:userId/all')
  removeAllByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationService.removeAllByUser(userId);
  }

  @Delete('old/:days')
  removeOld(@Param('days', ParseIntPipe) days: number) {
    return this.notificationService.removeOldNotifications(days);
  }

  // ==================== NOTIFICATIONS AUTOMATIQUES ====================
  
  @Post('enquete/created')
  notifyNewSurvey(
    @Body('userId') userId: number,
    @Body('surveyTitle') surveyTitle: string,
  ) {
    return this.notificationService.notifyNewSurvey(userId, surveyTitle);
  }

  @Post('enquete/published')
  notifySurveyPublished(
    @Body('userId') userId: number,
    @Body('surveyTitle') surveyTitle: string,
  ) {
    return this.notificationService.notifySurveyPublished(userId, surveyTitle);
  }

  @Post('reponse/new')
  notifyNewResponse(
    @Body('adminId') adminId: number,
    @Body('surveyTitle') surveyTitle: string,
    @Body('userName') userName: string,
  ) {
    return this.notificationService.notifyNewResponse(adminId, surveyTitle, userName);
  }

  @Post('reclamation/new')
  notifyNewReclamation(
    @Body('adminId') adminId: number,
    @Body('reclamationTitle') reclamationTitle: string,
  ) {
    return this.notificationService.notifyNewReclamation(adminId, reclamationTitle);
  }

  @Post('reclamation/resolved')
  notifyReclamationResolved(
    @Body('userId') userId: number,
    @Body('reclamationTitle') reclamationTitle: string,
  ) {
    return this.notificationService.notifyReclamationResolved(userId, reclamationTitle);
  }

  @Post('message/new')
  notifyNewMessage(
    @Body('userId') userId: number,
    @Body('fromUserName') fromUserName: string,
  ) {
    return this.notificationService.notifyNewMessage(userId, fromUserName);
  }

  @Post('enquete/reminder')
  notifySurveyReminder(
    @Body('userId') userId: number,
    @Body('surveyTitle') surveyTitle: string,
    @Body('daysLeft') daysLeft: number,
  ) {
    return this.notificationService.notifySurveyReminder(userId, surveyTitle, daysLeft);
  }
  
}