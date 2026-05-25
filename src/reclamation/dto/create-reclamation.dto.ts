// src/reclamation/dto/create-reclamation.dto.ts
import { IsString, IsOptional, IsNumber, Min, Max, IsEnum, IsBoolean, IsArray, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export enum StatutReclamation {
  DETECTE = 'DETECTE',
  EN_COURS = 'EN_COURS',
  RESOLU = 'RESOLU',
  REJETE = 'REJETE'
}

export class CreateReclamationDto {
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
  @IsNumber()
  @Min(0)
  coutEstime?: number;

  @IsOptional()
  @IsString()
  notesExpert?: string;
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
  @IsNumber()
  @Min(0)
  coutEstime?: number;

  @IsOptional()
  @IsString()
  notesExpert?: string;
}

export class ReponseReclamationDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  priority?: string;

  @IsOptional()
  @IsBoolean()
  sendEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  sendSMS?: boolean;
}

export class FiltreReclamationDto {
  @IsOptional()
  @IsString()
  statut?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  statuts?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  graviteMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  graviteMax?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confianceMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  coutMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  coutMax?: number;

  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @IsOptional()
  @IsDateString()
  dateFin?: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  orderBy?: 'ASC' | 'DESC';

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class BulkUpdateDto {
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];

  @Type(() => UpdateReclamationDto)
  data: Partial<UpdateReclamationDto>;
}

export class YoloAnalysisDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsNumber()
  @Min(0)
  damageCount: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  averageGravity: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  averageConfidence: number;

  @IsNumber()
  @Min(0)
  totalSeverity: number;

  @IsString()
  image_url: string;

  @IsString()
  imageName: string;

  @IsArray()
  damages: Array<{
    label: string;
    confidence: number;
    severity: number;
  }>;
}

export class StatutCountDto {
  @IsString()
  statut: string;

  @IsNumber()
  count: number;
}

export class PeriodFilterDto {
  @IsOptional()
  @IsEnum(['today', 'week', 'month', 'year'])
  period?: 'today' | 'week' | 'month' | 'year';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class StatsResponseDto {
  total: number;
  enAttente: number;
  enCours: number;
  resolues: number;
  rejetees: number;
  graviteMoyenne: string;
  tauxResolution: string;
  coutTotal?: number;
  evolutionParMois?: Array<{ mois: string; total: number }>;
  countByStatut?: StatutCountDto[];
  countByGravite?: {
    faible: number;
    moyenne: number;
    elevee: number;
    critique: number;
  };
}