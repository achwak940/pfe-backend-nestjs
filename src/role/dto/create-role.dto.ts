import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsHexColor } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsHexColor()
  @IsOptional()
  couleur?: string;

  @IsBoolean()
  @IsOptional()
  actif?: boolean;
}