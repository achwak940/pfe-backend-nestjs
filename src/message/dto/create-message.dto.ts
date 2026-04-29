// src/message/dto/create-message.dto.ts
import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  expediteurId: number;

  @IsNumber()
  @IsNotEmpty()
  destinataireId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  sujet: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(2000)
  contenu: string;
}