import { IsString, IsOptional, IsNumber, Min, Max, IsEnum } from 'class-validator';

export class CreateReclamationDto {
  @IsString()
  titre: string;

  @IsString()
  description: string;

  @IsString()
  typeDommage: string;

  @IsNumber()
  totalSeverite: number;

  @IsNumber()
  dommagesDetectes: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  gravite: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  confiance: number;

  @IsOptional()
  @IsString()
  statut?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  imageName?: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  reponseAdmin?: string;
}

export class UpdateReclamationDto {
  @IsOptional()
  @IsString()
  titre?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  typeDommage?: string;

  @IsOptional()
  @IsNumber()
  totalSeverite?: number;

  @IsOptional()
  @IsNumber()
  dommagesDetectes?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  gravite?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confiance?: number;

  @IsOptional()
  @IsString()
  statut?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  imageName?: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  reponseAdmin?: string;
}

export class ReponseReclamationDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  priority?: string;

  @IsOptional()
  sendEmail?: boolean;

  @IsOptional()
  sendSMS?: boolean;
}

export class FiltreReclamationDto {
  @IsOptional()
  @IsString()
  statut?: string;

  @IsOptional()
  @IsNumber()
  graviteMin?: number;

  @IsOptional()
  @IsNumber()
  graviteMax?: number;

  @IsOptional()
  @IsString()
  dateDebut?: string;

  @IsOptional()
  @IsString()
  dateFin?: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  search?: string;
}