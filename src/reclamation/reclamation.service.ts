import { Repository, Between, Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { Reclamation } from "./entities/reclamation.entity";
import { Utilisateur } from "../utilisateur/entities/utilisateur.entity";
import { 
  CreateReclamationDto, 
  UpdateReclamationDto, 
  ReponseReclamationDto, 
  FiltreReclamationDto 
} from "./dto/create-reclamation.dto";

@Injectable()
export class ReclamationService {
  constructor(
    @InjectRepository(Reclamation)
    private readonly reclamationRepo: Repository<Reclamation>,
    @InjectRepository(Utilisateur)
    private readonly utilisateurRepo: Repository<Utilisateur>,
  ) {}

  async create(createReclamationDto: CreateReclamationDto): Promise<Reclamation> {
    const reclamation = new Reclamation();
    
    reclamation.titre = createReclamationDto.titre ?? null;
    reclamation.description = createReclamationDto.description ?? null;
    reclamation.typeDommage = createReclamationDto.typeDommage ?? null;
    reclamation.totalSeverite = createReclamationDto.totalSeverite ?? 0;
    reclamation.dommagesDetectes = createReclamationDto.dommagesDetectes ?? 0;
    reclamation.gravite = createReclamationDto.gravite ?? 0;
    reclamation.confiance = createReclamationDto.confiance ?? 0;
    reclamation.statut = createReclamationDto.statut ?? 'DETECTE';
    reclamation.imageUrl = createReclamationDto.imageUrl ?? null;
    reclamation.imageName = createReclamationDto.imageName ?? null;
    
    if (createReclamationDto.userId) {
      reclamation.userId = createReclamationDto.userId;
    }
    
    return this.reclamationRepo.save(reclamation);
  }

  async findAll(filtres?: FiltreReclamationDto): Promise<Reclamation[]> {
    const where: any = {};
    
    if (filtres) {
      if (filtres.statut) where.statut = filtres.statut;
      if (filtres.graviteMin !== undefined && filtres.graviteMax !== undefined) {
        where.gravite = Between(filtres.graviteMin, filtres.graviteMax);
      } else if (filtres.graviteMin !== undefined) {
        where.gravite = Between(filtres.graviteMin, 10);
      } else if (filtres.graviteMax !== undefined) {
        where.gravite = Between(0, filtres.graviteMax);
      }
      
      if (filtres.dateDebut && filtres.dateFin) {
        where.createdAt = Between(new Date(filtres.dateDebut), new Date(filtres.dateFin));
      }
      
      if (filtres.userId) {
        where.userId = filtres.userId;
      }
      
      if (filtres.search) {
        where.titre = Like(`%${filtres.search}%`);
      }
    }
    
    return this.reclamationRepo.find({
      where,
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Reclamation> {
    const reclamation = await this.reclamationRepo.findOne({ 
      where: { id }
    });
    if (!reclamation) {
      throw new NotFoundException(`Réclamation #${id} non trouvée`);
    }
    return reclamation;
  }

  async update(id: number, updateReclamationDto: UpdateReclamationDto): Promise<Reclamation> {
    const reclamation = await this.findOne(id);
    
    if (updateReclamationDto.titre !== undefined) reclamation.titre = updateReclamationDto.titre;
    if (updateReclamationDto.description !== undefined) reclamation.description = updateReclamationDto.description;
    if (updateReclamationDto.typeDommage !== undefined) reclamation.typeDommage = updateReclamationDto.typeDommage;
    if (updateReclamationDto.totalSeverite !== undefined) reclamation.totalSeverite = updateReclamationDto.totalSeverite;
    if (updateReclamationDto.dommagesDetectes !== undefined) reclamation.dommagesDetectes = updateReclamationDto.dommagesDetectes;
    if (updateReclamationDto.gravite !== undefined) reclamation.gravite = updateReclamationDto.gravite;
    if (updateReclamationDto.confiance !== undefined) reclamation.confiance = updateReclamationDto.confiance;
    if (updateReclamationDto.statut !== undefined) reclamation.statut = updateReclamationDto.statut;
    if (updateReclamationDto.imageUrl !== undefined) reclamation.imageUrl = updateReclamationDto.imageUrl;
    if (updateReclamationDto.imageName !== undefined) reclamation.imageName = updateReclamationDto.imageName;
    
    if (updateReclamationDto.userId !== undefined) {
      reclamation.userId = updateReclamationDto.userId;
    }
    
    return this.reclamationRepo.save(reclamation);
  }

  async remove(id: number): Promise<void> {
    const reclamation = await this.findOne(id);
    await this.reclamationRepo.remove(reclamation);
  }

  async findByUser(userId: number): Promise<Reclamation[]> {
    return this.reclamationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findByStatut(statut: string): Promise<Reclamation[]> {
    return this.reclamationRepo.find({
      where: { statut },
      order: { createdAt: 'DESC' }
    });
  }

  async changerStatut(id: number, statut: string): Promise<Reclamation> {
    const validStatuts = ['DETECTE', 'EN_COURS', 'RESOLU', 'REJETE'];
    if (!validStatuts.includes(statut)) {
      throw new BadRequestException(`Statut invalide. Valeurs acceptées: ${validStatuts.join(', ')}`);
    }
    
    const reclamation = await this.findOne(id);
    reclamation.statut = statut;
    
    return this.reclamationRepo.save(reclamation);
  }

  async repondreReclamation(id: number, reponseDto: ReponseReclamationDto): Promise<Reclamation> {
    const reclamation = await this.findOne(id);
    
    // Si les colonnes n'existent pas, commentez ces lignes
    // reclamation.reponseAdmin = reponseDto.message;
    // reclamation.dateReponse = new Date();
    reclamation.statut = 'EN_COURS';
    
    const updated = await this.reclamationRepo.save(reclamation);
    
    console.log(`Réponse envoyée pour la réclamation ${id}: ${reponseDto.message}`);
    
    return updated;
  }

  async getStats(): Promise<any> {
    const total = await this.reclamationRepo.count();
    const enAttente = await this.reclamationRepo.count({ where: { statut: 'DETECTE' } });
    const enCours = await this.reclamationRepo.count({ where: { statut: 'EN_COURS' } });
    const resolues = await this.reclamationRepo.count({ where: { statut: 'RESOLU' } });
    const rejetees = await this.reclamationRepo.count({ where: { statut: 'REJETE' } });
    
    const graviteMoyenne = await this.reclamationRepo
      .createQueryBuilder('r')
      .select('AVG(r.gravite)', 'moyenne')
      .getRawOne();
    
    return {
      total,
      enAttente,
      enCours,
      resolues,
      rejetees,
      graviteMoyenne: parseFloat(graviteMoyenne?.moyenne || 0).toFixed(1),
      tauxResolution: total > 0 ? ((resolues / total) * 100).toFixed(1) : 0
    };
  }

  async supprimerMultiple(ids: number[]): Promise<void> {
    for (const id of ids) {
      await this.remove(id);
    }
  }

  async updateMultiple(ids: number[], updateData: Partial<UpdateReclamationDto>): Promise<void> {
    for (const id of ids) {
      await this.update(id, updateData);
    }
  }
}