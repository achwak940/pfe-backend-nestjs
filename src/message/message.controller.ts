// src/message/message.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // Envoyer un message
  @Post('send')
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  // Récupérer tous les messages d'un utilisateur
  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.messageService.findAllByUser(+userId);
  }

  // Récupérer les messages reçus
  @Get('received/:userId')
  getReceivedMessages(@Param('userId') userId: string) {
    return this.messageService.getReceivedMessages(+userId);
  }

  // Récupérer les messages envoyés
  @Get('sent/:userId')
  getSentMessages(@Param('userId') userId: string) {
    return this.messageService.getSentMessages(+userId);
  }

  // Récupérer les conversations d'un utilisateur
  @Get('conversations/:userId')
  getConversations(@Param('userId') userId: string) {
    return this.messageService.getConversations(+userId);
  }

  // Récupérer une conversation entre deux utilisateurs
  @Get('conversation/:userId1/:userId2')
  getConversation(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
  ) {
    return this.messageService.getConversation(+userId1, +userId2);
  }

  // Récupérer le nombre de messages non lus
  @Get('unread/:userId')
  getUnreadCount(@Param('userId') userId: string) {
    return this.messageService.getUnreadCount(+userId);
  }

  // Marquer un message comme lu
  @Patch('read/:id')
  markAsRead(@Param('id') id: string) {
    return this.messageService.markAsRead(+id);
  }

  // Récupérer un message spécifique
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  // Mettre à jour un message (général)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  // Supprimer un message
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}