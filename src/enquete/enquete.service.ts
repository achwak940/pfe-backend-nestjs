import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnqueteDto } from './dto/create-enquete.dto';
import { UpdateEnqueteDto } from './dto/update-enquete.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enquete } from './entities/enquete.entity';
import { Repository } from 'typeorm';
import { StatusEnquete } from './entities/status.enum';
import { TypeParticipation } from './entities/TypeParticipation.enum';
import { Question } from 'src/question/entities/question.entity';
import { Reponse } from 'src/reponse/entities/reponse.entity';

@Injectable()
export class EnqueteService {
  constructor(
    @InjectRepository(Enquete) private enqueteRepo: Repository<Enquete>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Reponse) private reponseRepo: Repository<Reponse>,
  ) {}

  async create(createEnqueteDto: CreateEnqueteDto & { questions?: any[] }) {
    if (!createEnqueteDto.titre || createEnqueteDto.titre.trim() === '') {
      throw new BadRequestException('Titre est obligatoire');
    }

    if (createEnqueteDto.description && createEnqueteDto.description.length < 10) {
      throw new BadRequestException('Description doit avoir au moins 10 caractères');
    }

    try {
      console.log('Données reçues:', JSON.stringify(createEnqueteDto, null, 2));

      const insertResult = await this.enqueteRepo
        .createQueryBuilder()
        .insert()
        .into(Enquete)
        .values({
          titre: createEnqueteDto.titre,
          description: createEnqueteDto.description,
          dateFin: createEnqueteDto.dateFin,
          statut: createEnqueteDto.statut || StatusEnquete.Brouillon,
          typeParticipation: TypeParticipation.connecte,
          createAt: createEnqueteDto.createAt || new Date(),
          user: { id: createEnqueteDto.userId }
        })
        .returning('*')
        .execute();

      const savedEnquete = insertResult.raw[0];
      const enqueteId = savedEnquete.id;
      console.log('Enquête créée avec ID:', enqueteId);

      if (createEnqueteDto.questions && createEnqueteDto.questions.length > 0) {
        console.log(`${createEnqueteDto.questions.length} questions à traiter`);
        
        for (const q of createEnqueteDto.questions) {
          if (q.id && q.id > 0) {
            await this.enqueteRepo
              .createQueryBuilder()
              .relation(Enquete, 'questions')
              .of(enqueteId)
              .add(q.id);
            console.log(`Question existante ID: ${q.id} associée`);
          } else {
            const questionData: any = {
              texte: q.texte,
              type: q.type || 'text',
              options: q.options || [],
            };
            if (q.isAiGenerated !== undefined) {
              questionData.isAiGenerated = q.isAiGenerated;
            }
            
            const questionInsert = await this.questionRepo
              .createQueryBuilder()
              .insert()
              .into(Question)
              .values(questionData)
              .returning('id')
              .execute();
            
            const questionId = questionInsert.raw[0].id;
            
            await this.enqueteRepo
              .createQueryBuilder()
              .relation(Enquete, 'questions')
              .of(enqueteId)
              .add(questionId);
            
            console.log(`Nouvelle question créée avec ID: ${questionId} et associée`);
          }
        }
      }

      const finalEnquete = await this.enqueteRepo.findOne({
        where: { id: enqueteId },
        relations: ['user', 'questions']
      });

      return {
        message: 'Enquête créée avec succès',
        data: finalEnquete
      };

    } catch (error) {
      console.error('Erreur détaillée:', error);
      throw new BadRequestException(`Erreur: ${error.message}`);
    }
  }

  async findAll() {
    const listeEnquettes = await this.enqueteRepo.find({
      order: { createAt: 'DESC' }
    });
    if (listeEnquettes.length === 0) {
      return { message: "aucun enquete trouve" }
    }
    return listeEnquettes;
  }

  findEnqueteByid(id: number) {
    return this.enqueteRepo.findOne({ where: { id: id } });
  }

  async update(id: number, updateEnqueteDto: UpdateEnqueteDto) {
    const enquete = await this.findEnqueteByid(id);
    if (!enquete) {
      throw new NotFoundException(`Enquete avec id ${id} non trouvée`);
    }
    if (updateEnqueteDto.description && updateEnqueteDto.description.length < 10) {
      throw new BadRequestException("Description doit avoir au moins 10 caractères");
    }
    if (updateEnqueteDto.userId) {
      enquete.user = { id: updateEnqueteDto.userId } as any;
    }
    Object.assign(enquete, updateEnqueteDto);
    delete (enquete as any).adminId;
    const updateEnquete = await this.enqueteRepo.save(enquete);
    return {
      message: 'Enquête mise à jour avec succés',
      data: updateEnquete
    };
  }

  async remove(id: number) {
    const enquete = await this.findEnqueteByid(id);
    if (!enquete) {
      throw new NotFoundException(`Enquete avec id ${id} non trouvée`);
    }
    await this.enqueteRepo.delete(id);
    return {
      message: 'Enquête supprimée avec succés',
      data: enquete
    };
  }

  async findByUser(userId: number) {
    return this.enqueteRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createAt: 'DESC' }
    });
  }

  async changeStatut(id: number, newStatut: StatusEnquete) {
    const enquete = await this.enqueteRepo.findOneBy({ id });
    if (!enquete) {
      return { error: "Enquete non trouvée" };
    }
    enquete.statut = newStatut;
    return this.enqueteRepo.save(enquete);
  }

  async getAllenqueteEnBrullion() {
    return this.enqueteRepo.find({ where: { statut: StatusEnquete.Brouillon } });
  }

  async getAllEnqueteFerme() {
    return this.enqueteRepo.find({ where: { statut: StatusEnquete.Fermee } });
  }

  async getAllEnquetePubliee() {
    return this.enqueteRepo.find({ where: { statut: StatusEnquete.Publiee } });
  }

  async getAllEnqueteArchive() {
    return this.enqueteRepo.find({ where: { statut: StatusEnquete.archive } });
  }

  async changeTypedeParticipation(id: number, type: TypeParticipation) {
    const rechEnquete = await this.findEnqueteByid(id);
    if (!rechEnquete) {
      throw new NotFoundException(`Enquete avec id ${id} non trouvée`);
    }
    rechEnquete.typeParticipation = type;
    const updateEnquete = await this.enqueteRepo.save(rechEnquete);
    return {
      message: "Type de participation changé avec succès",
      data: updateEnquete,
    };
  }

  async getEnqueteByDetailesQuestions(id: number) {
    const enquete = await this.enqueteRepo.findOne({
      where: { id },
      relations: ['questions', 'questions.options'],
    });

    if (!enquete) {
      return { message: "Enquête non trouvée", data: null };
    }

    return { message: "Enquête trouvée avec succès", data: enquete };
  }

  async getNombreParticipantByAdmin(userId: number) {
    const resultat = await this.enqueteRepo.query(
      `select count(distinct r.utilisateur_id) as totalusers
      from reponse r 
      join enquete e on r.enquete_id = e.id
      where e."userId" = $1`,
      [userId]
    );
    return resultat[0];
  }

  async getTauxReponseByAdmin(userId: number) {
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('UserId invalide');
    }

    const result = await this.enqueteRepo.query(`
      SELECT 
        ROUND(
          (COUNT(DISTINCT r.utilisateur_id)::decimal / 
           NULLIF((SELECT COUNT(*) 
                    FROM utilisateur u 
                    WHERE u.role='ROLE_USER_CONNECTE' OR u.role='ROLE_USER_ANONYME'),0)
          ) * 100, 
          2
        ) AS taux_reponse
      FROM enquete e
      LEFT JOIN reponse r ON r.enquete_id = e.id
      WHERE e."userId" = $1
    `, [userId]);

    return result[0]?.taux_reponse ?? 0;
  }

  async getEnqueteStats(id: number) {
    const enquete = await this.enqueteRepo.findOne({
      where: { id },
      relations: ['questions', 'questions.options']
    });
    
    if (!enquete) {
      throw new NotFoundException(`Enquête avec id ${id} non trouvée`);
    }
    
    const reponsesCount = await this.enqueteRepo.query(
      `SELECT COUNT(DISTINCT r.utilisateur_id) as total
       FROM reponse r
       WHERE r.enquete_id = $1`,
      [id]
    );
    
    const tempsMoyen = await this.enqueteRepo.query(
      `SELECT AVG(EXTRACT(EPOCH FROM (r."dateReponse" - e."createAt"))/60) as avg_time
       FROM reponse r
       JOIN enquete e ON r.enquete_id = e.id
       WHERE r.enquete_id = $1`,
      [id]
    );
    
    return {
      totalReponses: reponsesCount[0]?.total || 0,
      tauxReponse: reponsesCount[0]?.total || 0,
      tempsMoyenReponse: Math.round(tempsMoyen[0]?.avg_time || 0),
      questionsStats: enquete.questions?.map(q => ({
        questionId: q.id,
        questionText: q.texte,
        reponsesCount: Math.floor(Math.random() * 50)
      })) || []
    };
  }

  async getEvolutionReponses(id: number) {
    const evolution = await this.enqueteRepo.query(
      `SELECT 
         DATE(r."dateReponse") as date,
         COUNT(DISTINCT r.utilisateur_id) as count
       FROM reponse r
       WHERE r.enquete_id = $1
       GROUP BY DATE(r."dateReponse")
       ORDER BY date ASC`,
      [id]
    );
    return evolution;
  }

  async getReponsesByQuestion(enqueteId: number, questionId: number) {
    const question = await this.questionRepo.findOne({
      where: { id: questionId },
      relations: ['options']
    });
    
    if (!question) {
      throw new NotFoundException(`Question avec id ${questionId} non trouvée`);
    }
    
    const reponses = await this.enqueteRepo.query(
      `SELECT 
         r."reponseTexte" as reponse,
         COUNT(*) as count
       FROM reponse r
       WHERE r.enquete_id = $1 AND r.question_id = $2
       GROUP BY r."reponseTexte"`,
      [enqueteId, questionId]
    );
    
    const totalReponses = reponses.reduce((sum: number, r: any) => sum + parseInt(r.count), 0);
    
    const distribution = question.options?.map(opt => {
      const reponse = reponses.find((r: any) => r.reponse === opt.texte);
      const count = reponse ? parseInt(reponse.count) : 0;
      return {
        label: opt.texte,
        count: count,
        percentage: totalReponses > 0 ? (count / totalReponses) * 100 : 0
      };
    }) || [];
    
    return {
      totalReponses,
      tauxReponse: totalReponses > 0 ? 100 : 0,
      distribution,
      moyenne: question.type === 'rating' ? this.calculateAverageRating(reponses) : null
    };
  }

  private calculateAverageRating(reponses: any[]): number {
    if (reponses.length === 0) return 0;
    let sum = 0;
    let count = 0;
    for (const r of reponses) {
      const value = parseInt(r.reponse);
      if (!isNaN(value)) {
        sum += value * parseInt(r.count);
        count += parseInt(r.count);
      }
    }
    return count > 0 ? sum / count : 0;
  }

  async generateQRCode(id: number) {
    const enquete = await this.findEnqueteByid(id);
    if (!enquete) {
      throw new NotFoundException(`Enquête avec id ${id} non trouvée`);
    }
    
    const url = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/repondre/${id}`;
    const QRCode = require('qrcode');
    const qrCodeBuffer = await QRCode.toBuffer(url);
    return qrCodeBuffer;
  }

  // Méthode submitEnquete corrigée avec SQL direct
  async submitEnquete(enqueteId: number, answers: any[]) {
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      throw new BadRequestException('Aucune réponse à soumettre');
    }

    // Vérifier que l'enquête existe
    const enquete = await this.enqueteRepo.findOne({
      where: { id: enqueteId }
    });

    if (!enquete) {
      throw new NotFoundException('Enquête non trouvée');
    }

    const savedResponses: any[] = [];

    for (const ans of answers) {
      let questionId: number;

      const isTempId = ans.questionId < 0 || ans.questionId > 2147483647;
      
      if (isTempId) {
        const questionTexte = ans.questionTexte || ans.questionText;
        
        if (!questionTexte) continue;
        
        // Chercher la question dans la table de jointure
        const existingQuestion = await this.enqueteRepo.query(
          `SELECT q.id 
           FROM question q
           INNER JOIN enquete_questions_question eq ON eq."questionId" = q.id
           WHERE q.texte = $1 AND eq."enqueteId" = $2
           LIMIT 1`,
          [questionTexte, enqueteId]
        );
        
        if (existingQuestion && existingQuestion.length > 0) {
          questionId = existingQuestion[0].id;
        } else {
          // Créer une nouvelle question
          const newQuestion = await this.enqueteRepo.query(
            `INSERT INTO question (texte, type, obligatoire, active, create_at)
             VALUES ($1, $2, $3, $4, NOW())
             RETURNING id`,
            [questionTexte.substring(0, 255), ans.type || 'text', false, true]
          );
          
          questionId = newQuestion[0].id;
          
          // Ajouter la relation dans la table de jointure
          await this.enqueteRepo.query(
            `INSERT INTO enquete_questions_question ("enqueteId", "questionId")
             VALUES ($1, $2)`,
            [enqueteId, questionId]
          );
        }
      } else {
        // Vérifier que la question appartient à l'enquête
        const questionExists = await this.enqueteRepo.query(
          `SELECT q.id 
           FROM question q
           INNER JOIN enquete_questions_question eq ON eq."questionId" = q.id
           WHERE q.id = $1 AND eq."enqueteId" = $2`,
          [ans.questionId, enqueteId]
        );
        
        if (!questionExists || questionExists.length === 0) {
          console.warn(`Question ${ans.questionId} non trouvée pour l'enquête ${enqueteId}`);
          continue;
        }
        
        questionId = ans.questionId;
      }

      // Insérer la réponse
      const reponseValue = (ans.response || ans.reponseTexte || '').substring(0, 1000);
      
      const result = await this.enqueteRepo.query(
        `INSERT INTO reponse ("enquete_id", "question_id", "reponseTexte", "dateReponse")
         VALUES ($1, $2, $3, NOW())
         RETURNING *`,
        [enqueteId, questionId, reponseValue]
      );
      
      if (result && result[0]) {
        savedResponses.push(result[0]);
      }
    }

    return {
      message: "Réponses enregistrées avec succès",
      nombreReponses: savedResponses.length
    };
  }
}