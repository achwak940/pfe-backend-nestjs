import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Utilisateur]),  // ← Ajoutez Utilisateur ici
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}