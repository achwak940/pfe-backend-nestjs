import { StatusEnquete } from "../entities/status.enum";

export class CreateEnqueteDto {
    titre: string;
    description?: string;
    statut?: StatusEnquete = StatusEnquete.Brouillon;
    createAt?: Date;  
    dateFin?: Date;   
    userId: number;
}