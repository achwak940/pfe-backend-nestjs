// create-enquete.dto.ts
import { StatusEnquete } from "../entities/status.enum";
import { TypeParticipation } from "../entities/TypeParticipation.enum";

export class CreateEnqueteDto {
    titre: string;
    description?: string;
    statut?: StatusEnquete = StatusEnquete.Brouillon;
    typeParticipation?: TypeParticipation = TypeParticipation.connecte; // Ajouter cette ligne
    createAt?: Date;  
    dateFin?: Date;   
    userId: number;
    questions?: any[];
}