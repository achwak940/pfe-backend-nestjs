// src/message/message.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // ==================== ENVOI DE MESSAGES ====================
  
  @Post('send')
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  // ==================== RÉCUPÉRATION DE MESSAGES ====================
  
  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.messageService.findAllByUser(+userId);
  }

  @Get('received/:userId')
  getReceivedMessages(@Param('userId') userId: string) {
    return this.messageService.getReceivedMessages(+userId);
  }

  @Get('sent/:userId')
  getSentMessages(@Param('userId') userId: string) {
    return this.messageService.getSentMessages(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  // ==================== CONVERSATIONS ====================
  
  @Get('conversations/:userId')
  getConversations(@Param('userId') userId: string) {
    return this.messageService.getConversations(+userId);
  }

  @Get('conversation/:userId1/:userId2')
  getConversation(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
  ) {
    return this.messageService.getConversation(+userId1, +userId2);
  }

  // ==================== MARQUAGE / LECTURE ====================
  
  @Patch('read/:id')
  markAsRead(@Param('id') id: string) {
    return this.messageService.markAsRead(+id);
  }

  @Patch('conversation/read/:userId/:interlocuteurId')
  markConversationAsRead(
    @Param('userId') userId: string,
    @Param('interlocuteurId') interlocuteurId: string,
  ) {
    return this.messageService.markConversationAsRead(+userId, +interlocuteurId);
  }

  @Get('unread/:userId')
  getUnreadCount(@Param('userId') userId: string) {
    return this.messageService.getUnreadCount(+userId);
  }

  // ==================== MISES À JOUR ====================
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  // ==================== SUPPRESSION ====================
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }

  @Delete('conversation/:userId/:interlocuteurId')
  deleteConversation(
    @Param('userId') userId: string,
    @Param('interlocuteurId') interlocuteurId: string,
  ) {
    return this.messageService.deleteConversation(+userId, +interlocuteurId);
  }
}