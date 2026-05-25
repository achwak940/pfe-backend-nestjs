import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from './entities/notification.entity';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification,Utilisateur])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}