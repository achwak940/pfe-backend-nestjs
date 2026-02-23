import { PartialType } from '@nestjs/mapped-types';
import { CreateEnqueteDto } from './create-enquete.dto';
import { StatusEnquete } from '../entities/status.enum';

export class UpdateEnqueteDto extends PartialType(CreateEnqueteDto) {
       titre: string;
        description?: string;
        statut?: StatusEnquete = StatusEnquete.Brouillon;
        createAt?: Date;  
        dateFin?: Date;   
        userId: number;
}
