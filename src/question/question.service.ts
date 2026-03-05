import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { type } from 'os';
@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question) private questionrepo: Repository<Question>,  
  ){
  }
  create(createQuestionDto: CreateQuestionDto) {
        
  }
  async getAllQuestions() {
    const questions = await this.questionrepo.find();
    if(questions.length===0){
      return{
        message:"aucun question touvée",
        data:[]
      }
    }
    return {
      message:"voici liste des questions",
      data:questions
    }
   

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
      message: "Aucune question trouvée pour cet utilisateur",
      data: []
    };
  }

  return {
    message: "Voici les questions de l'utilisateur",
    data: questions
  };
}

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
 async  ajoutQuestionAvecOption(dto:CreateQuestionDto){
    const question=this.questionrepo.create({
      texte:dto.texte,
      type:dto.type,
      obligatoire:dto.obligatoire,
      active:dto.active,
      options:dto.options}
    )
    const saveQuestion=await this.questionrepo.save(question)
    return {
      message:"Question ajoutée avec succès",
      data:saveQuestion
    }
  }
}

