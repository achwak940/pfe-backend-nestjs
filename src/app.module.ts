import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilisateur } from './utilisateur/entities/utilisateur.entity';
import { AuthentificationModule } from './authentification/authentification.module';
import { EnqueteModule } from './enquete/enquete.module';
import { Enquete } from './enquete/entities/enquete.entity';
import { QuestionModule } from './question/question.module';
import { Question } from './question/entities/question.entity';
import { OptionModule } from './option/option.module';
import { Option } from './option/entities/option.entity';
import { ReponseModule } from './reponse/reponse.module';
import { Reponse } from './reponse/entities/reponse.entity';
import { YoloModule } from './yolo/yolo.module';
import { FeedbackModule } from './feedback/feedback.module';
import { Feedback } from './feedback/entities/feedback.entity';
import { AiQuestionsModule } from './GenerationQuestions/ai-questions/ai-questions.module';
import { ReclamationModule } from './reclamation/reclamation.module';
import { Reclamation } from './reclamation/entities/reclamation.entity';
import { Message } from './message/entities/message.entity';
import { MessageModule } from './message/message.module';

@Module({
  imports: [  
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(ConfigService :ConfigService)=>({
        type:'postgres',
        host:ConfigService.get('DB_HOST'),
        prot:ConfigService.get('DB_PORT'),
        username:ConfigService.get("DB_USERNAME"),
        password:ConfigService.get("DB_PASSWORD"),
        database:ConfigService.get("DB_NAME"),
        entities:[Utilisateur,Enquete,Question,Option,Reponse,Feedback,Reclamation,Message],
        synchronize:true,//creation auto de table si n'existe pas 
      })
    }),
    UtilisateurModule,
    AuthentificationModule,
    EnqueteModule,
    QuestionModule,
    OptionModule,
    ReponseModule,
    YoloModule,
    FeedbackModule,
    AiQuestionsModule,
    ReclamationModule,
    MessageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
