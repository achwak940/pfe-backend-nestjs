// src/enquete/enquete.service.ts
import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateEnqueteDto } from './dto/create-enquete.dto';
import { UpdateEnqueteDto } from './dto/update-enquete.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enquete } from './entities/enquete.entity';
import { Repository, DataSource } from 'typeorm';
import { StatusEnquete } from './entities/status.enum';
import { TypeParticipation } from './entities/TypeParticipation.enum';
import { Question } from 'src/question/entities/question.entity';
import { Reponse } from 'src/reponse/entities/reponse.entity';

@Injectable()
export class EnqueteService {
  private readonly logger = new Logger(EnqueteService.name);

  constructor(
    @InjectRepository(Enquete) private enqueteRepo: Repository<Enquete>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Reponse) private reponseRepo: Repository<Reponse>,
    private dataSource: DataSource,
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

  // ============================================================
// REMPLACE ENTIÈREMENT la méthode update() dans enquete.service.ts
// La cause : Object.assign() colle `questions` sur l'entité Enquete,
// TypeORM tente un cascade-save → INSERT (enqueteId, null) car les
// nouvelles questions n'ont pas encore d'id.
// Fix : extraire `questions` AVANT Object.assign, puis les traiter
// manuellement via queryBuilder (comme create() le fait déjà).
// ============================================================

  async update(id: number, updateEnqueteDto: UpdateEnqueteDto & { questions?: any[]; userId?: number }) {

    // 1. Vérifier l'existence
    const enquete = await this.enqueteRepo.findOne({
      where: { id },
      relations: ['questions'],
    });
    if (!enquete) {
      throw new NotFoundException(`Enquête avec id ${id} non trouvée`);
    }

    // 2. Valider description
    if (updateEnqueteDto.description && updateEnqueteDto.description.length < 10) {
      throw new BadRequestException('Description doit avoir au moins 10 caractères');
    }

    // 3. Isoler questions et userId avant Object.assign
    //    CRITIQUE : si on laisse `questions` dans le DTO, TypeORM
    //    tentera un cascade INSERT avec questionId = null.
    const questions: any[] | undefined = updateEnqueteDto.questions;
    const incomingUserId: number | undefined = updateEnqueteDto.userId;

    // Construire l'objet scalaire pur (sans questions ni userId)
    const scalarUpdate: Partial<Enquete> = {};
    if (updateEnqueteDto.titre       !== undefined) scalarUpdate.titre            = updateEnqueteDto.titre;
    if (updateEnqueteDto.description !== undefined) scalarUpdate.description      = updateEnqueteDto.description;
    if (updateEnqueteDto.dateFin     !== undefined) scalarUpdate.dateFin          = updateEnqueteDto.dateFin;
    if ((updateEnqueteDto as any).typeParticipation !== undefined)
      (scalarUpdate as any).typeParticipation = (updateEnqueteDto as any).typeParticipation;
    if (incomingUserId)
      (scalarUpdate as any).user = { id: incomingUserId };

    // 4. Mettre à jour UNIQUEMENT les champs scalaires via QueryBuilder
    //    (évite tout comportement cascade de TypeORM sur les relations)
    if (Object.keys(scalarUpdate).length > 0) {
      const setClause: Record<string, any> = {};
      if (scalarUpdate.titre)       setClause['titre']       = scalarUpdate.titre;
      if (scalarUpdate.description !== undefined) setClause['description'] = scalarUpdate.description;
      if (scalarUpdate.dateFin     !== undefined) setClause['dateFin']     = scalarUpdate.dateFin;
      if ((scalarUpdate as any).typeParticipation)
        setClause['typeParticipation'] = (scalarUpdate as any).typeParticipation;
      if ((scalarUpdate as any).user)
        setClause['user'] = (scalarUpdate as any).user;

      await this.enqueteRepo
        .createQueryBuilder()
        .update(Enquete)
        .set(setClause)
        .where('id = :id', { id })
        .execute();
    }

    // 5. Gérer les questions si le payload en contient
    if (Array.isArray(questions) && questions.length > 0) {
      this.logger.log(`Traitement de ${questions.length} question(s) pour l'enquête ${id}`);

      for (const q of questions) {
        const questionId: number | null | undefined = q.id;

        if (questionId && questionId > 0) {
          // ── Question EXISTANTE : mettre à jour son contenu ──────
          await this.enqueteRepo.query(
            `UPDATE question
             SET texte = $1,
                 type  = $2,
                 "update_at" = NOW()
             WHERE id = $3`,
            [q.texte, q.type || 'TEXTE', questionId]
          );

          // Mettre à jour les options si la table option existe
          // (on supprime + reinsère pour rester simple)
          if (Array.isArray(q.options) && q.options.length > 0) {
            await this.enqueteRepo.query(
              `DELETE FROM option WHERE question_id = $1`,
              [questionId]
            );
            for (const optText of q.options) {
              if (!optText || optText.trim() === '') continue;
              await this.enqueteRepo.query(
                `INSERT INTO option (texte, question_id) VALUES ($1, $2)`,
                [optText.trim(), questionId]
              );
            }
          }

          // S'assurer que la liaison existe (idempotent)
          const linkExists = await this.enqueteRepo.query(
            `SELECT 1 FROM enquete_questions_question
             WHERE "enqueteId" = $1 AND "questionId" = $2`,
            [id, questionId]
          );
          if (!linkExists || linkExists.length === 0) {
            await this.enqueteRepo.query(
              `INSERT INTO enquete_questions_question ("enqueteId", "questionId") VALUES ($1, $2)`,
              [id, questionId]
            );
          }

          this.logger.log(`Question existante ${questionId} mise à jour`);

        } else {
          // ── Nouvelle question : INSERT puis ASSOCIATE ───────────
          if (!q.texte || q.texte.trim() === '') {
            this.logger.warn('Question sans texte ignorée');
            continue;
          }

          // Insérer la question et récupérer son id
          const newQResult = await this.enqueteRepo.query(
            `INSERT INTO question (texte, type, obligatoire, active, create_at)
             VALUES ($1, $2, $3, $4, NOW())
             RETURNING id`,
            [
              q.texte.substring(0, 500),
              q.type || 'TEXTE',
              q.obligatoire !== false,
              true,
            ]
          );

          const newQId: number = newQResult[0]?.id;
          if (!newQId) {
            this.logger.error('Impossible de récupérer l\'id de la nouvelle question');
            continue;
          }

          // Insérer les options si nécessaire
          if (Array.isArray(q.options) && q.options.length > 0) {
            for (const optText of q.options) {
              if (!optText || optText.trim() === '') continue;
              await this.enqueteRepo.query(
                `INSERT INTO option (texte, question_id) VALUES ($1, $2)`,
                [optText.trim(), newQId]
              );
            }
          }

          // Lier la nouvelle question à l'enquête
          await this.enqueteRepo.query(
            `INSERT INTO enquete_questions_question ("enqueteId", "questionId") VALUES ($1, $2)`,
            [id, newQId]
          );

          this.logger.log(`Nouvelle question ${newQId} créée et liée à l'enquête ${id}`);
        }
      }
    }

    // 6. Retourner l'enquête à jour avec ses questions
    const finalEnquete = await this.enqueteRepo.findOne({
      where: { id },
      relations: ['user', 'questions'],
    });

    return {
      message: 'Enquête mise à jour avec succès',
      data: finalEnquete,
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

    try {
      this.logger.log(`Calcul du taux de réponse pour l'admin ${userId}`);

      const repondeursResult = await this.dataSource.query(`
        SELECT COUNT(DISTINCT r.utilisateur_id) as repondeurs
        FROM reponse r
        JOIN enquete e ON r.enquete_id = e.id
        WHERE e."userId" = $1
      `, [userId]);
      const repondeurs = parseInt(repondeursResult[0]?.repondeurs || '0');

      const totalUsersResult = await this.dataSource.query(`
        SELECT COUNT(*) as total FROM utilisateur
      `);
      const totalUtilisateurs = parseInt(totalUsersResult[0]?.total || '0');

      if (totalUtilisateurs === 0) {
        return 0;
      }

      const taux = (repondeurs / totalUtilisateurs) * 100;
      this.logger.log(`Taux de réponse calculé: ${taux}% (${repondeurs}/${totalUtilisateurs})`);
      return parseFloat(taux.toFixed(2));

    } catch (error) {
      this.logger.error(`Erreur getTauxReponseByAdmin: ${error.message}`);
      return 0;
    }
  }

  async getEnqueteStats(id: number) {
    const enquete = await this.enqueteRepo.findOne({
      where: { id },
      relations: ['questions']
    });
    if (!enquete) {
      throw new NotFoundException(`Enquête avec id ${id} non trouvée`);
    }

    const participantsResult = await this.dataSource.query(
      `SELECT COUNT(DISTINCT r.utilisateur_id) as total
       FROM reponse r
       WHERE r.enquete_id = $1`,
      [id]
    );
    const totalParticipants = parseInt(participantsResult[0]?.total || '0');

    const tempsResult = await this.dataSource.query(
      `SELECT AVG(EXTRACT(EPOCH FROM (r."dateReponse" - e."createAt")) / 60) as avg_time
       FROM reponse r
       JOIN enquete e ON r.enquete_id = e.id
       WHERE r.enquete_id = $1
       AND r."dateReponse" > e."createAt"`,
      [id]
    );
    let tempsMoyen = Math.round(tempsResult[0]?.avg_time || 0);
    if (tempsMoyen > 1440) tempsMoyen = 0;

    const questionsStats = await Promise.all(
      (enquete.questions || []).map(async (q) => {
        const countResult = await this.dataSource.query(
          `SELECT COUNT(*) as count FROM reponse WHERE enquete_id = $1 AND question_id = $2`,
          [id, q.id]
        );
        return {
          questionId: q.id,
          questionText: q.texte,
          reponsesCount: parseInt(countResult[0]?.count || '0')
        };
      })
    );

    return {
      totalReponses: totalParticipants,
      tauxReponse: totalParticipants > 0 ? 100 : 0,
      tempsMoyenReponse: tempsMoyen,
      questionsStats
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

  async submitEnquete(enqueteId: number, answers: any[]) {
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      throw new BadRequestException('Aucune réponse à soumettre');
    }

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
          const newQuestion = await this.enqueteRepo.query(
            `INSERT INTO question (texte, type, obligatoire, active, create_at)
             VALUES ($1, $2, $3, $4, NOW())
             RETURNING id`,
            [questionTexte.substring(0, 255), ans.type || 'text', false, true]
          );
          
          questionId = newQuestion[0].id;
          
          await this.enqueteRepo.query(
            `INSERT INTO enquete_questions_question ("enqueteId", "questionId")
             VALUES ($1, $2)`,
            [enqueteId, questionId]
          );
        }
      } else {
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

  // ============================================
  // MÉTHODES POUR HISTORIQUE UTILISATEUR
  // ============================================

  async getUserEnquetesWithStatus(userId: number, filters?: { statut?: string; categorie?: string }) {
    try {
      this.logger.log(`📊 getUserEnquetesWithStatus pour userId: ${userId}`);
      
      const toutesEnquetes = await this.enqueteRepo
        .createQueryBuilder('enquete')
        .leftJoinAndSelect('enquete.questions', 'questions')
        .where('enquete.statut = :statut', { statut: StatusEnquete.Publiee })
        .orderBy('enquete.createAt', 'DESC')
        .getMany();

      this.logger.log(`📋 ${toutesEnquetes.length} enquêtes publiées trouvées`);

      const enquetesAvecReponses = await Promise.all(
        toutesEnquetes.map(async (enquete) => {
          const reponsesCount = await this.reponseRepo
            .createQueryBuilder('r')
            .where('r.enquete_id = :enqueteId', { enqueteId: enquete.id })
            .andWhere('r.utilisateur_id = :userId', { userId })
            .getCount();

          const aRepondu = reponsesCount > 0;
          
          let questionsReponses: any[] = [];
          
          if (aRepondu) {
            questionsReponses = await this.getQuestionsWithUserResponses(enquete.id, userId);
          }

          return {
            id: enquete.id,
            titre: enquete.titre,
            message: enquete.description || '',
            reponse: aRepondu ? (questionsReponses[0]?.reponse || 'Merci pour votre participation') : '',
            date: this.formatDate(enquete.createAt),
            dateEnvoi: this.formatDateTime(enquete.createAt),
            dateReponse: aRepondu ? this.formatDateTime(new Date()) : '',
            statut: aRepondu ? 'repondu' : 'en_attente',
            categorie: this.detectCategorie(enquete),
            questionsReponses: questionsReponses,
          };
        })
      );

      let resultData = enquetesAvecReponses;
      if (filters?.statut) {
        resultData = enquetesAvecReponses.filter(e => e.statut === filters.statut);
      }
      if (filters?.categorie) {
        resultData = resultData.filter(e => e.categorie === filters.categorie);
      }

      return {
        success: true,
        data: resultData,
        total: resultData.length,
        stats: {
          total: resultData.length,
          repondues: resultData.filter(e => e.statut === 'repondu').length,
          enAttente: resultData.filter(e => e.statut === 'en_attente').length
        }
      };
    } catch (error) {
      this.logger.error(`❌ Erreur getUserEnquetesWithStatus: ${error.message}`);
      throw new BadRequestException(`Erreur: ${error.message}`);
    }
  }

  async getQuestionsWithUserResponses(enqueteId: number, userId: number) {
    const enquete = await this.enqueteRepo.findOne({
      where: { id: enqueteId },
      relations: ['questions']
    });

    if (!enquete || !enquete.questions) return [];

    const questionsAvecReponses = await Promise.all(
      enquete.questions.map(async (question) => {
        const reponse = await this.reponseRepo
          .createQueryBuilder('r')
          .where('r.enquete_id = :enqueteId', { enqueteId })
          .andWhere('r.question_id = :questionId', { questionId: question.id })
          .andWhere('r.utilisateur_id = :userId', { userId })
          .getOne();

        return {
          questionId: question.id,
          question: question.texte,
          type: question.type || 'text',
          options: question.options || [],
          reponse: reponse?.reponseTexte || '',
        };
      })
    );

    return questionsAvecReponses;
  }

  async getUserResponsesHistory(userId: number) {
    try {
      this.logger.log(`📊 getUserResponsesHistory pour userId: ${userId}`);
      
      const reponses = await this.reponseRepo
        .createQueryBuilder('r')
        .leftJoinAndSelect('r.enquete', 'enquete')
        .leftJoinAndSelect('r.question', 'question')
        .where('r.utilisateur_id = :userId', { userId })
        .orderBy('r.dateReponse', 'DESC')
        .getMany();

      const enquetesMap = new Map<number, any>();
      
      for (const reponse of reponses) {
        if (!enquetesMap.has(reponse.enquete.id)) {
          enquetesMap.set(reponse.enquete.id, {
            id: reponse.enquete.id,
            titre: reponse.enquete.titre,
            message: reponse.enquete.description || '',
            date: this.formatDate(reponse.enquete.createAt),
            dateEnvoi: this.formatDateTime(reponse.enquete.createAt),
            dateReponse: this.formatDateTime(reponse.dateReponse),
            statut: 'repondu',
            categorie: this.detectCategorie(reponse.enquete),
            questionsReponses: [],
          });
        }
        
        enquetesMap.get(reponse.enquete.id).questionsReponses.push({
          questionId: reponse.question.id,
          question: reponse.question.texte,
          reponse: reponse.reponseTexte,
          type: reponse.question.type,
          dateReponse: this.formatDateTime(reponse.dateReponse),
        });
      }

      const result = Array.from(enquetesMap.values());
      
      return {
        success: true,
        data: result,
        total: result.length,
        stats: {
          total: result.length,
          repondues: result.length,
          enAttente: 0
        }
      };
    } catch (error) {
      this.logger.error(`❌ Erreur getUserResponsesHistory: ${error.message}`);
      throw new BadRequestException(`Erreur: ${error.message}`);
    }
  }

  async getUserEnqueteWithResponses(enqueteId: number, userId: number) {
    const enquete = await this.enqueteRepo.findOne({
      where: { id: enqueteId },
      relations: ['questions']
    });

    if (!enquete) {
      throw new NotFoundException('Enquête non trouvée');
    }

    const questionsAvecReponses = await this.getQuestionsWithUserResponses(enqueteId, userId);
    const aRepondu = questionsAvecReponses.some(q => q.reponse && q.reponse.length > 0);

    return {
      id: enquete.id,
      titre: enquete.titre,
      message: enquete.description || '',
      date: this.formatDate(enquete.createAt),
      dateEnvoi: this.formatDateTime(enquete.createAt),
      dateReponse: aRepondu ? this.formatDateTime(new Date()) : '',
      statut: aRepondu ? 'repondu' : 'en_attente',
      categorie: this.detectCategorie(enquete),
      questionsReponses: questionsAvecReponses,
      totalQuestions: enquete.questions?.length || 0,
      reponsesCount: questionsAvecReponses.filter(q => q.reponse.length > 0).length,
    };
  }

  async hasUserRespondedToEnquete(enqueteId: number, userId: number): Promise<boolean> {
    const count = await this.reponseRepo
      .createQueryBuilder('r')
      .where('r.enquete_id = :enqueteId', { enqueteId })
      .andWhere('r.utilisateur_id = :userId', { userId })
      .getCount();
    
    return count > 0;
  }

  async getUserResponsesCountByEnquete(userId: number) {
    const results = await this.reponseRepo
      .createQueryBuilder('r')
      .select('r.enquete_id', 'enqueteId')
      .addSelect('COUNT(*)', 'count')
      .where('r.utilisateur_id = :userId', { userId })
      .groupBy('r.enquete_id')
      .getRawMany();

    return results;
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  private formatDateTime(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return `${this.formatDate(d)} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  private detectCategorie(enquete: Enquete): string {
    const titre = enquete.titre?.toLowerCase() || '';
    const description = enquete.description?.toLowerCase() || '';
    
    if (titre.includes('satisfaction') || description.includes('satisfaction')) return 'Satisfaction';
    if (titre.includes('feedback') || titre.includes('employé')) return 'Feedback';
    if (titre.includes('produit') || titre.includes('nouveau')) return 'Produit';
    if (titre.includes('api') || titre.includes('technique')) return 'Technique';
    return 'Questionnaire';
  }

  async getTotalParticipationRateByAdmin(adminId: number): Promise<number> {
    try {
      this.logger.log(`📊 Calcul du taux de participation pour l'admin ${adminId}`);

      const totalUsersResult = await this.dataSource.query(`
        SELECT COUNT(*) as total FROM utilisateur
      `);
      const totalUtilisateurs = parseInt(totalUsersResult[0]?.total || '0');

      if (totalUtilisateurs === 0) {
        return 0;
      }

      const participantsResult = await this.dataSource.query(`
        SELECT COUNT(DISTINCT r.utilisateur_id) as total
        FROM reponse r
        INNER JOIN enquete e ON r.enquete_id = e.id
        WHERE e."userId" = $1
      `, [adminId]);

      const totalParticipants = parseInt(participantsResult[0]?.total || '0');

      const tauxParticipation = (totalParticipants / totalUtilisateurs) * 100;

      this.logger.log(`📈 Taux de participation: ${tauxParticipation.toFixed(2)}% (${totalParticipants}/${totalUtilisateurs})`);

      return parseFloat(tauxParticipation.toFixed(2));

    } catch (error) {
      this.logger.error(`❌ Erreur: ${error.message}`);
      return 0;
    }
  }

  async getTotalEnquetesCount(): Promise<number> {
    try {
      this.logger.log(`📊 Calcul du nombre total d'enquêtes dans la plateforme`);
      const count = await this.enqueteRepo.count();
      this.logger.log(`📈 Nombre total d'enquêtes: ${count}`);
      return count;
    } catch (error) {
      this.logger.error(`❌ Erreur getTotalEnquetesCount: ${error.message}`);
      return 0;
    }
  }

  async getEnqueteStatsForChart(adminId?: number): Promise<{
    total: number;
    parStatut: {
      brouillon: number;
      publiee: number;
      fermee: number;
      archive: number;
    };
  }> {
    try {
      this.logger.log(`📊 Récupération des statistiques des enquêtes ${adminId ? `pour l'admin ${adminId}` : 'totales'}`);

      let query = this.enqueteRepo.createQueryBuilder('enquete');
      
      if (adminId) {
        query = query.where('enquete.userId = :adminId', { adminId });
      }
      
      const enquetes = await query.getMany();
      
      const parStatut = {
        brouillon: enquetes.filter(e => e.statut === StatusEnquete.Brouillon).length,
        publiee: enquetes.filter(e => e.statut === StatusEnquete.Publiee).length,
        fermee: enquetes.filter(e => e.statut === StatusEnquete.Fermee).length,
        archive: enquetes.filter(e => e.statut === StatusEnquete.archive).length
      };
      
      return {
        total: enquetes.length,
        parStatut
      };
      
    } catch (error) {
      this.logger.error(`❌ Erreur getEnqueteStatsForChart: ${error.message}`);
      return {
        total: 0,
        parStatut: { brouillon: 0, publiee: 0, fermee: 0, archive: 0 }
      };
    }
  }

  async getEnqueteDistribution(adminId?: number): Promise<{
    categories: Array<{ label: string; count: number; color: string; percentage: number }>;
    total: number;
  }> {
    try {
      this.logger.log(`📊 Récupération de la distribution des enquêtes ${adminId ? `pour l'admin ${adminId}` : 'totale'}`);

      let query = this.enqueteRepo.createQueryBuilder('enquete');
      
      if (adminId) {
        query = query.where('enquete.userId = :adminId', { adminId });
      }
      
      const enquetes = await query.getMany();
      const total = enquetes.length;
      
      const brouillon = enquetes.filter(e => e.statut === StatusEnquete.Brouillon).length;
      const publiee = enquetes.filter(e => e.statut === StatusEnquete.Publiee).length;
      const fermee = enquetes.filter(e => e.statut === StatusEnquete.Fermee).length;
      const archive = enquetes.filter(e => e.statut === StatusEnquete.archive).length;
      
      const categories = [
        {
          label: 'Brouillon',
          count: brouillon,
          color: '#f59e0b',
          percentage: total > 0 ? (brouillon / total) * 100 : 0
        },
        {
          label: 'Publiée',
          count: publiee,
          color: '#10b981',
          percentage: total > 0 ? (publiee / total) * 100 : 0
        },
        {
          label: 'Fermée',
          count: fermee,
          color: '#ef4444',
          percentage: total > 0 ? (fermee / total) * 100 : 0
        },
        {
          label: 'Archivée',
          count: archive,
          color: '#6b7280',
          percentage: total > 0 ? (archive / total) * 100 : 0
        }
      ];
      
      const filteredCategories = categories.filter(c => c.count > 0);
      
      return {
        categories: filteredCategories,
        total
      };
      
    } catch (error) {
      this.logger.error(`❌ Erreur getEnqueteDistribution: ${error.message}`);
      return {
        categories: [],
        total: 0
      };
    }
  }

  // ============================================
  // MÉTHODES DE PARTAGE
  // ============================================

  async generateShareLinks(enqueteId: number, userId?: number): Promise<{
    url: string;
    encodedUrl: string;
    titre: string;
    description: string;
    shareLinks: {
      whatsapp: string;
      facebook: string;
      facebookMessenger: string;
      instagram: string;
      email: string;
    };
  }> {
    const enquete = await this.enqueteRepo.findOne({
      where: { id: enqueteId }
    });

    if (!enquete) {
      throw new NotFoundException(`Enquête avec id ${enqueteId} non trouvée`);
    }

    let url = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/repondre/${enqueteId}`;
    if (userId) {
      url += `?ref=${userId}&utm_source=share`;
    }

    const encodedUrl = encodeURIComponent(url);
    const titre = encodeURIComponent(`📊 ${enquete.titre}`);
    const description = encodeURIComponent(enquete.description || `Participez à notre enquête - Cela ne prend que 2 minutes !`);

    return {
      url,
      encodedUrl,
      titre: enquete.titre,
      description: enquete.description || '',
      shareLinks: {
        whatsapp: `https://wa.me/?text=${titre}%0A%0A${description}%0A%0A🔗 ${encodedUrl}%0A%0AMerci pour votre participation !`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${titre}`,
        facebookMessenger: `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=YOUR_APP_ID&redirect_uri=${encodedUrl}`,
        instagram: `instagram://library?AssetPath=${encodedUrl}`,
        email: `mailto:?subject=${titre}&body=${encodeURIComponent(`
Bonjour,

Je vous invite à participer à l'enquête "${enquete.titre}".

${enquete.description || 'Votre avis est précieux pour nous améliorer.'}

🔗 Lien direct : ${url}

⏱️ Temps estimé : 2-3 minutes
🔒 Vos réponses sont anonymes et confidentielles

Merci d'avance pour votre participation !

Cordialement,
L'équipe
        `)}`
      }
    };
  }

  generateShareMessage(enqueteId: number, destinataire?: string): Promise<{
    sujet: string;
    message: string;
    messageCourt: string;
  }> {
    return this.enqueteRepo.findOne({ where: { id: enqueteId } }).then(enquete => {
      if (!enquete) {
        throw new NotFoundException(`Enquête non trouvée`);
      }

      const url = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/repondre/${enqueteId}`;
      const prenom = destinataire?.split(' ')[0] || 'Cher participant';

      return {
        sujet: `📊 Invitation à l'enquête : ${enquete.titre}`,
        message: `${prenom},

Je vous invite à participer à notre enquête "${enquete.titre}".

📝 ${enquete.description || 'Nous souhaitons recueillir votre avis pour améliorer nos services.'}

🔗 Accédez à l'enquête : ${url}


🔒 Toutes vos réponses restent confidentielles.

Merci infiniment pour votre contribution !

Cordialement,
L'équipe`,
        messageCourt: `📊 Enquête: ${enquete.titre}\n${url}`
      };
    });
  }

  async generateQRCodeForEnquete(enqueteId: number): Promise<{ qrCodeDataUrl: string; url: string }> {
    const enquete = await this.findEnqueteByid(enqueteId);
    
    if (!enquete) {
      throw new NotFoundException(`Enquête avec id ${enqueteId} non trouvée`);
    }

    const url = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/repondre/${enqueteId}`;
    const QRCode = require('qrcode');
    
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#764ba2',
        light: '#FFFFFF'
      }
    });

    return {
      qrCodeDataUrl,
      url
    };
  }

  async getAllShareInfo(enqueteId: number, userId?: number): Promise<any> {
    const [shareLinks, qrCode, message] = await Promise.all([
      this.generateShareLinks(enqueteId, userId),
      this.generateQRCodeForEnquete(enqueteId),
      this.generateShareMessage(enqueteId)
    ]);

    return {
      ...shareLinks,
      qrCodeDataUrl: qrCode.qrCodeDataUrl,
      messages: message
    };
  }

  // ============================================
  // MÉTHODES D'ENVOI D'EMAIL
  // ============================================

  private async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'belliliachwek@gmail.com',
          pass: process.env.EMAIL_PASS || 'votre-mot-de-passe-applicatif',
        },
      });

      const mailOptions = {
        from: `"Service Enquête" <${process.env.EMAIL_USER || 'belliliachwek@gmail.com'}>`,
        to,
        subject,
        html,
      };
      
      await transporter.sendMail(mailOptions);
      this.logger.log(`✅ Email envoyé à ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email à ${to}:`, error);
      return false;
    }
  }

  private generateEnqueteEmailTemplate(
    titre: string,
    description: string,
    lien: string,
    dateLimite?: string,
    customMessage?: string,
    color: string = '#764ba2'
  ): string {
    const dateLimitText = dateLimite 
      ? `<li>📅 Date limite : ${new Date(dateLimite).toLocaleDateString('fr-FR')}</li>` 
      : '';
    
    const customMessageHtml = customMessage 
      ? `<p style="background: #f0fdf4; padding: 15px; border-radius: 10px; border-left: 4px solid #22c55e;">${this.escapeHtml(customMessage)}</p>` 
      : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitation à l'enquête: ${titre}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, ${color} 100%);
            padding: 40px 20px;
            min-height: 100vh;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 24px; 
            overflow: hidden; 
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
            animation: slideUp 0.5s ease;
          }
          @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, ${color} 100%); 
            padding: 40px 30px; 
            text-align: center;
          }
          .header h1 { 
            color: white; 
            margin: 0; 
            font-size: 28px; 
            font-weight: 600;
            word-break: break-word;
          }
          .header p { 
            color: rgba(255,255,255,0.9); 
            margin-top: 10px; 
            font-size: 14px; 
          }
          .content { 
            padding: 40px 30px; 
            background: white;
          }
          .content p { 
            color: #4a5568; 
            line-height: 1.6; 
            margin-bottom: 20px; 
          }
          .info-box { 
            background: #f9fafb; 
            padding: 20px; 
            border-radius: 12px; 
            margin: 25px 0; 
            border-left: 4px solid ${color};
          }
          .info-box ul {
            margin-top: 10px;
            padding-left: 20px;
          }
          .info-box li {
            margin: 8px 0;
            color: #4a5568;
          }
          .info-box strong { 
            color: #1f2937; 
            display: block; 
            margin-bottom: 10px;
            font-size: 16px;
          }
          .btn { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, ${color} 100%); 
            color: white !important; 
            padding: 14px 35px; 
            text-decoration: none; 
            border-radius: 50px; 
            margin: 20px 0; 
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
          .btn:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }
          .footer { 
            background: #f9fafb; 
            padding: 25px; 
            text-align: center; 
            font-size: 12px; 
            color: #6b7280; 
            border-top: 1px solid #e5e7eb;
          }
          .footer a { 
            color: ${color}; 
            text-decoration: none; 
          }
          .lien-direct {
            background: #f3f4f6;
            padding: 12px;
            border-radius: 8px;
            font-size: 12px;
            word-break: break-all;
            margin-top: 15px;
          }
          @media (max-width: 600px) { 
            .content { padding: 25px 20px; } 
            .header { padding: 30px 20px; }
            .header h1 { font-size: 22px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 ${this.escapeHtml(titre)}</h1>
            <p>Nous avons besoin de votre avis !</p>
          </div>
          <div class="content">
            <p>Bonjour,</p>
            
            ${customMessageHtml}
            
            <p>${this.escapeHtml(description) || 'Nous vous invitons à participer à notre enquête pour nous aider à améliorer nos services.'}</p>
            
            <div class="info-box">
              <strong>📋 Détails de l'enquête :</strong>
              <ul>
                <li>⏱️ Durée estimée : 2-3 minutes</li>
                ${dateLimitText}
                <li>🔒 Vos réponses sont anonymes et confidentielles</li>
                <li>📱 Accessible sur tous les appareils</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${lien}" class="btn">🔗 Accéder à l'enquête</a>
            </div>
            
            <div class="lien-direct">
              <strong>🔗 Lien direct :</strong><br>
              <a href="${lien}" style="color: ${color};">${lien}</a>
            </div>
            
            <p style="margin-top: 25px;">Merci d'avance pour votre participation précieuse !</p>
            <p>Cordialement,<br><strong>L'équipe</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} - Plateforme d'enquêtes</p>
            <p>Cet email est un message automatique, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private escapeHtml(text: string): string {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async sendEnqueteByEmailWithTemplate(
    enqueteId: number,
    emails: string[],
    customMessage?: string
  ): Promise<{
    success: boolean;
    message: string;
    envoyes: string[];
    echoues: string[];
  }> {
    const enquete = await this.enqueteRepo.findOne({
      where: { id: enqueteId }
    });

    if (!enquete) {
      throw new NotFoundException(`Enquête avec id ${enqueteId} non trouvée`);
    }

    const url = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/repondre/${enqueteId}`;
    
    let dateLimiteStr: string | undefined = undefined;
    if (enquete.dateFin) {
      const dateFin = new Date(enquete.dateFin);
      if (!isNaN(dateFin.getTime())) {
        dateLimiteStr = dateFin.toISOString();
      }
    }
    
    const subject = `📊 Invitation à l'enquête : ${enquete.titre}`;
    const html = this.generateEnqueteEmailTemplate(
      enquete.titre,
      enquete.description || '',
      url,
      dateLimiteStr,
      customMessage
    );

    const envoyes: string[] = [];
    const echoues: string[] = [];

    for (const email of emails) {
      const success = await this.sendEmail(email, subject, html);
      if (success) {
        envoyes.push(email);
      } else {
        echoues.push(email);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.logger.log(`📧 Résultat envoi: ${envoyes.length} succès, ${echoues.length} échecs`);

    return {
      success: echoues.length === 0,
      message: `Email envoyé à ${envoyes.length} destinataire(s) sur ${emails.length}`,
      envoyes,
      echoues
    };
  }

  async sendEnqueteToUsers(
    enqueteId: number,
    userIds: number[],
    customMessage?: string
  ): Promise<any> {
    const users = await this.dataSource.query(`
      SELECT id, email, nom, prenom FROM utilisateur WHERE id = ANY($1)
    `, [userIds]);

    if (!users || users.length === 0) {
      throw new BadRequestException('Aucun utilisateur trouvé avec ces IDs');
    }

    const emails = users.map(u => u.email).filter(e => e && e !== '');
    
    if (emails.length === 0) {
      throw new BadRequestException('Aucun email valide trouvé pour ces utilisateurs');
    }
    
    const result = await this.sendEnqueteByEmailWithTemplate(
      enqueteId,
      emails, 
      customMessage
    );

    return {
      success: result.success,
      message: result.message,
      totalDestinataires: emails.length,
      envoyes: result.envoyes,
      echoues: result.echoues,
      utilisateurs: users.map(u => ({
        id: u.id,
        email: u.email,
        nom: `${u.prenom} ${u.nom}`
      }))
    };
  }

  async sendEnqueteByWhatsApp(enqueteId: number, phoneNumbers: string[], customMessage?: string): Promise<any> {
    const enquete = await this.findEnqueteByid(enqueteId);

    if (!enquete) {
      throw new NotFoundException(`Enquête avec id ${enqueteId} non trouvée`);
    }

    const url = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/repondre/${enqueteId}`;

    const messageTexte = customMessage
      ? customMessage.replace(/{{URL}}/g, url)
      : `📊 *${enquete.titre}*\n\n${enquete.description || 'Participez à notre enquête.'}\n\n🔗 ${url}\n\nMerci pour votre participation !`;

    const encoded = encodeURIComponent(messageTexte);

    const whatsappLinks = phoneNumbers.map(phone => {
      let cleanPhone = phone.replace(/[^0-9+]/g, '');
      if (cleanPhone.startsWith('0') && !cleanPhone.startsWith('+')) {
        cleanPhone = '33' + cleanPhone.substring(1);
      }
      if (!cleanPhone.startsWith('+')) {
        cleanPhone = '+' + cleanPhone;
      }
      return {
        phone: cleanPhone,
        link: `https://wa.me/${cleanPhone}?text=${encoded}`,
        originalPhone: phone
      };
    });

    this.logger.log(`📱 Liens WhatsApp générés pour l'enquête "${enquete.titre}" — ${phoneNumbers.length} numéro(s)`);

    return {
      success: true,
      message: `Liens WhatsApp générés pour ${phoneNumbers.length} destinataire(s)`,
      data: {
        enqueteId,
        enqueteTitre: enquete.titre,
        whatsappLinks,
        messageOriginal: messageTexte
      }
    };
  }

  async sendEnqueteByEmailProfessional(
    enqueteId: number, 
    emails: string[], 
    customMessage?: string
  ): Promise<any> {
    return this.sendEnqueteByEmailWithTemplate(enqueteId, emails, customMessage);
  }

  // ========== MÉTHODES POUR LE DASHBOARD ADMIN ==========

  async getSurveyStatusStatsByAdmin(adminId: number) {
    const enquetes = await this.enqueteRepo.find({
      where: { user: { id: adminId } },
    });

    const total = enquetes.length || 1;
    const actives = enquetes.filter(e => e.statut === StatusEnquete.Publiee).length;
    const brouillons = enquetes.filter(e => e.statut === StatusEnquete.Brouillon).length;
    const terminees = enquetes.filter(e => e.statut === StatusEnquete.Fermee).length;
    const archivees = enquetes.filter(e => e.statut === StatusEnquete.archive).length;

    return {
      actives: Math.round((actives / total) * 100),
      brouillons: Math.round((brouillons / total) * 100),
      terminees: Math.round((terminees / total) * 100),
      archivees: Math.round((archivees / total) * 100),
      counts: { actives, brouillons, terminees, archivees, total },
    };
  }

  async getParticipationParEnqueteByAdmin(adminId: number) {
    const enquetes = await this.enqueteRepo.find({
      where: { user: { id: adminId } },
      relations: ['reponses'],
    });

    const totalReponsesAll = enquetes.reduce((sum, e) => sum + (e.reponses?.length || 0), 0);

    return enquetes.map((e, idx) => {
      const reponsesCount = e.reponses?.length || 0;
      const pourcentage = totalReponsesAll === 0 ? 0 : (reponsesCount / totalReponsesAll) * 100;
      return {
        label: e.titre.substring(0, 30),
        value: Math.round(pourcentage),
        color: this.getColorForIndex(idx),
      };
    }).slice(0, 5);
  }

  async getTopEnquetesByAdmin(adminId: number, periode: string, limit: number) {
    let startDate: Date;
    const now = new Date();

    switch (periode) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const enquetes = await this.enqueteRepo
      .createQueryBuilder('e')
      .leftJoin('e.reponses', 'r')
      .where('e.userId = :adminId', { adminId })
      .andWhere('r.dateReponse >= :startDate', { startDate })
      .groupBy('e.id')
      .select('e.titre', 'titre')
      .addSelect('COUNT(r.id)', 'reponsesCount')
      .orderBy('reponsesCount', 'DESC')
      .limit(limit)
      .getRawMany();

    return enquetes.map(e => ({
      nom: e.titre,
      valeur: `${e.reponsesCount} réponse${e.reponsesCount > 1 ? 's' : ''}`,
    }));
  }

  async getRecentEnquetesByAdmin(adminId: number, limit: number) {
    return this.enqueteRepo.find({
      where: { user: { id: adminId } },
      order: { createAt: 'DESC' },
      take: limit,
      relations: ['reponses'],
    });
  }

  async getRecentActivitiesByAdmin(adminId: number, limit: number) {
    const reponses = await this.reponseRepo
      .createQueryBuilder('r')
      .innerJoinAndSelect('r.enquete', 'e')
      .innerJoinAndSelect('r.utilisateur', 'u')
      .where('e.userId = :adminId', { adminId })
      .orderBy('r.dateReponse', 'DESC')
      .take(limit)
      .getMany();

    return reponses.map(r => ({
      type: 'reponse',
      message: `${r.utilisateur.prenom} ${r.utilisateur.nom} a répondu à l'enquête "${r.enquete.titre}"`,
      time: this.formatRelativeTime(r.dateReponse),
      icon: 'fa-reply',
      background: '#e8f0fe',
    }));
  }

  async getReclamationsCountByAdmin(adminId: number): Promise<number> {
    const result = await this.dataSource.query(`
      SELECT COUNT(*) as count FROM reclamation WHERE "adminId" = $1
    `, [adminId]);
    return parseInt(result[0]?.count || '0');
  }

  async getRiskAnalysisByAdmin(adminId: number) {
    const tauxReponse = await this.getTauxReponseGlobal(adminId);
    const reclamations = await this.getReclamationsCountByAdmin(adminId);

    let eleve = 0, moyen = 0, faible = 0;
    if (tauxReponse < 30 || reclamations > 10) {
      eleve = 20; moyen = 25; faible = 55;
    } else if (tauxReponse < 60 || reclamations > 5) {
      eleve = 10; moyen = 40; faible = 50;
    } else {
      eleve = 5; moyen = 20; faible = 75;
    }

    return { eleve, moyen, faible, details: { tauxReponse, reclamations } };
  }

  async getSatisfactionIndexByAdmin(adminId: number) {
    const reponses = await this.reponseRepo
      .createQueryBuilder('r')
      .innerJoin('r.enquete', 'e')
      .where('e.userId = :adminId', { adminId })
      .andWhere('r.reponseTexte IS NOT NULL')
      .getMany();

    const posWords = ['bien', 'bon', 'satisfait', 'excellent', 'super', 'génial'];
    const negWords = ['mauvais', 'insatisfait', 'problème', 'déçu', 'nul', 'médiocre'];

    let positives = 0, neutres = 0, negatives = 0;
    reponses.forEach(r => {
      const text = (r.reponseTexte || '').toLowerCase();
      const isPos = posWords.some(w => text.includes(w));
      const isNeg = negWords.some(w => text.includes(w));
      if (isPos && !isNeg) positives++;
      else if (isNeg && !isPos) negatives++;
      else neutres++;
    });

    const total = reponses.length || 1;
    return {
      positives: Math.round((positives / total) * 100),
      neutres: Math.round((neutres / total) * 100),
      negatives: Math.round((negatives / total) * 100),
      counts: { positives, neutres, negatives, total },
    };
  }

  async getParticipationTypeStats(adminId: number) {
    const enquetesParType = await this.enqueteRepo
      .createQueryBuilder('e')
      .select('e.typeParticipation', 'type')
      .addSelect('COUNT(e.id)', 'count')
      .where('e.userId = :adminId', { adminId })
      .groupBy('e.typeParticipation')
      .getRawMany();

    const anonymeCount = enquetesParType.find(t => t.type === 'ANONYME')?.count || 0;
    const connecteCount = enquetesParType.find(t => t.type === 'CONNECTE')?.count || 0;
    const totalEnquetes = anonymeCount + connecteCount;

    const reponsesParType = await this.dataSource.query(`
      SELECT 
        e."typeParticipation" as type,
        COUNT(DISTINCT r.id) as reponses
      FROM reponse r
      JOIN enquete e ON r.enquete_id = e.id
      WHERE e."userId" = $1
      GROUP BY e."typeParticipation"
    `, [adminId]);

    const reponsesAnonyme = reponsesParType.find((t: any) => t.type === 'ANONYME')?.reponses || 0;
    const reponsesConnecte = reponsesParType.find((t: any) => t.type === 'CONNECTE')?.reponses || 0;

    return {
      enquetes: {
        anonyme: anonymeCount,
        connecte: connecteCount,
        total: totalEnquetes,
        anonymePercentage: totalEnquetes ? (anonymeCount / totalEnquetes) * 100 : 0,
        connectePercentage: totalEnquetes ? (connecteCount / totalEnquetes) * 100 : 0,
      },
      reponses: {
        anonyme: reponsesAnonyme,
        connecte: reponsesConnecte,
        total: reponsesAnonyme + reponsesConnecte,
      }
    };
  }

  async getEvolutionReponsesByAdmin(adminId: number): Promise<any[]> {
    const evolution = await this.dataSource.query(`
      SELECT 
        DATE(r."dateReponse") as date,
        COUNT(DISTINCT r.id) as count
      FROM reponse r
      JOIN enquete e ON r.enquete_id = e.id
      WHERE e."userId" = $1
      GROUP BY DATE(r."dateReponse")
      ORDER BY date ASC
    `, [adminId]);
    
    return evolution;
  }

  // Helpers privés
  private getColorForIndex(i: number): string {
    const colors = ['#9D50BB', '#f39c12', '#2ecc71', '#e74c3c', '#3498db'];
    return colors[i % colors.length];
  }

  private formatRelativeTime(date: Date): string {
    const diff = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (diff < 60) return "à l'instant";
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
    return `il y a ${Math.floor(diff / 86400)} j`;
  }

  private async getTauxReponseGlobal(adminId: number): Promise<number> {
    const totalUtilisateurs = await this.dataSource.query(`SELECT COUNT(*) as count FROM utilisateur`);
    const total = parseInt(totalUtilisateurs[0]?.count || '0');
    if (total === 0) return 0;

    const repondeurs = await this.dataSource.query(`
      SELECT COUNT(DISTINCT r.utilisateur_id) as count
      FROM reponse r
      INNER JOIN enquete e ON r.enquete_id = e.id
      WHERE e."userId" = $1
    `, [adminId]);

    const count = parseInt(repondeurs[0]?.count || '0');
    return Math.round((count / total) * 100);
  }
  async remove(id:number){
    this.enqueteRepo.delete(id)
  }
}