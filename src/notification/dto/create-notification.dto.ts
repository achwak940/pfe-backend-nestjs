import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsString()
  titre: string;

  @IsString()
  contenu: string;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @IsNumber()
  utilisateurId?: number;

  @IsOptional()
  @IsNumber()
  messageId?: number;

  @IsOptional()
  @IsBoolean()
  lu?: boolean;
}