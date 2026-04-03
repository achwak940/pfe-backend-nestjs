import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question) private questionrepo: Repository<Question>,
  ) {}
  
  create(createQuestionDto: CreateQuestionDto) {
    // Cette méthode n'est pas utilisée, on utilise ajoutQuestionAvecOption
  }
  
  async getAllQuestions() {
    const questions = await this.questionrepo.find({
      relations: ['options']
    });
    if (questions.length === 0) {
      return {
        message: 'aucun question trouvée',
        data: [],
      };
    }
    return {
      message: 'voici liste des questions',
      data: questions,
    };
  }
  
  findOne(id: number) {
    return `This action returns a #${id} question`;
  }
  
  async getQuestionUser(userId: number) {
    const questions = await this.questionrepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.options', 'option')
      .leftJoin('question.enquetes', 'enquete')
      .leftJoin('enquete.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();

    if (questions.length === 0) {
      return {
        message: 'Aucune question trouvée pour cet utilisateur',
        data: [],
      };
    }

    return {
      message: "Voici les questions de l'utilisateur",
      data: questions,
    };
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  async remove(id: number) {
    const questionAsupprimer = await this.questionrepo.delete(id);
    if (questionAsupprimer.affected === 0) {
      return {
        message: 'Question non trouvée',
      };
    }
    return {
      message: 'Question supprimée avec succès',
      data: questionAsupprimer,
    };
  }
  
  async ajoutQuestionAvecOption(dto: CreateQuestionDto) {
    // Préparer les données de base
    const questionData: any = {
      texte: dto.texte,
      type: dto.type,
      obligatoire: dto.obligatoire,
      active: dto.active,
    };

    // Gérer les options selon le type
    if (dto.type === 'multiple' || dto.type === 'unique') {
      questionData.options = dto.options || [];
    } else {
      questionData.options = [];
    }

    // Ajouter la configuration pour le type rating (étoiles)
    if (dto.type === 'rating') {
      questionData.ratingConfig = dto.ratingConfig || {
        maxStars: 5,
        minValue: 1,
        maxValue: 5
      };
      questionData.scaleConfig = null;
    }
    
    // Ajouter la configuration pour le type scale (échelle)
    else if (dto.type === 'scale') {
      questionData.scaleConfig = dto.scaleConfig || {
        minLabel: 'Pas satisfait',
        maxLabel: 'Très satisfait',
        steps: 5
      };
      questionData.ratingConfig = null;
    }
    
    // Pour les autres types, supprimer les configurations
    else {
      questionData.ratingConfig = null;
      questionData.scaleConfig = null;
    }

    const question = this.questionrepo.create(questionData);
    const saveQuestion = await this.questionrepo.save(question);
    
    return {
      message: 'Question ajoutée avec succès',
      data: saveQuestion,
    };
  }
  
  async modifierQuestion(dto: UpdateQuestionDto, id: number) {
    // Récupérer la question existante
    const existingQuestion = await this.questionrepo.findOne({
      where: { id },
      relations: ['options']
    });
    
    if (!existingQuestion) {
      return {
        message: 'Question non trouvée',
      };
    }
    
    // Préparer les données de mise à jour
    const updateData: any = {
      id,
      texte: dto.texte !== undefined ? dto.texte : existingQuestion.texte,
      type: dto.type !== undefined ? dto.type : existingQuestion.type,
      obligatoire: dto.obligatoire !== undefined ? dto.obligatoire : existingQuestion.obligatoire,
      active: dto.active !== undefined ? dto.active : existingQuestion.active,
      update_at: new Date(),
    };

    // Déterminer le type final
    const finalType = updateData.type;
    
    // Gérer les options selon le type
    if (finalType === 'multiple' || finalType === 'unique') {
      if (dto.options !== undefined) {
        updateData.options = dto.options;
      } else {
        updateData.options = existingQuestion.options;
      }
    } else {
      updateData.options = [];
    }
    
    // Gérer les configurations selon le type
    if (finalType === 'rating') {
      updateData.ratingConfig = dto.ratingConfig !== undefined 
        ? dto.ratingConfig 
        : (existingQuestion.ratingConfig || { maxStars: 5, minValue: 1, maxValue: 5 });
      updateData.scaleConfig = null;
    } 
    else if (finalType === 'scale') {
      updateData.scaleConfig = dto.scaleConfig !== undefined 
        ? dto.scaleConfig 
        : (existingQuestion.scaleConfig || { minLabel: 'Pas satisfait', maxLabel: 'Très satisfait', steps: 5 });
      updateData.ratingConfig = null;
    }
    else {
      updateData.ratingConfig = null;
      updateData.scaleConfig = null;
    }
    
    // Appliquer la mise à jour
    const question = await this.questionrepo.preload(updateData);
    
    if (!question) {
      return {
        message: 'Question non trouvée',
      };
    }
    
    const saveQuestion = await this.questionrepo.save(question);
    
    return {
      message: 'Question modifiée avec succès',
      data: saveQuestion,
    };
  }
}