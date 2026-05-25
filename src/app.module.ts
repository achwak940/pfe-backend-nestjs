import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';

// Entities
import { Utilisateur } from './utilisateur/entities/utilisateur.entity';
import { Role } from './role/entities/role.entity';
import { Enquete } from './enquete/entities/enquete.entity';
import { Question } from './question/entities/question.entity';
import { Option } from './option/entities/option.entity';
import { Reponse } from './reponse/entities/reponse.entity';
import { Feedback } from './feedback/entities/feedback.entity';
import { Reclamation } from './reclamation/entities/reclamation.entity';
import { Message } from './message/entities/message.entity';
import { Notification } from './notification/entities/notification.entity';

// Modules
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { AuthentificationModule } from './authentification/authentification.module';
import { EnqueteModule } from './enquete/enquete.module';
import { QuestionModule } from './question/question.module';
import { OptionModule } from './option/option.module';
import { ReponseModule } from './reponse/reponse.module';
import { YoloModule } from './yolo/yolo.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AiQuestionsModule } from './GenerationQuestions/ai-questions/ai-questions.module';
import { ReclamationModule } from './reclamation/reclamation.module';
import { MessageModule } from './message/message.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { NotificationModule } from './notification/notification.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    // ── Config (doit être en premier pour que les autres modules y accèdent) ──
    ConfigModule.forRoot({ isGlobal: true }),

  MailerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    transport: {
      host: config.get<string>('MAIL_HOST', 'smtp.gmail.com'), // ← smtp.gmail.com
      port: config.get<number>('MAIL_PORT', 587),
      secure: false,
      auth: {
        user: config.get<string>('MAIL_USER'),
        pass: config.get<string>('MAIL_PASS'),
      },
    },
    defaults: {
      from: `"${config.get<string>('MAIL_FROM_NAME', 'Admin')}" <${config.get<string>('MAIL_FROM_ADDRESS', 'no-reply@votreapp.com')}>`,
    },
  }),
}),

    // ── Base de données ──
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host:     config.get<string>('DB_HOST'),
        port:     config.get<number>('DB_PORT'),      // ← "port" (pas "prot")
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [
          Utilisateur,
          Role,
          Enquete,
          Question,
          Option,
          Reponse,
          Feedback,
          Reclamation,
          Message,
          Notification,
        ],
        synchronize: true,
      }),
    }),

    // ── Modules métier ──
    UtilisateurModule,
    RoleModule,
    AuthentificationModule,
    EnqueteModule,
    QuestionModule,
    OptionModule,
    ReponseModule,
    YoloModule,
    FeedbackModule,
    AiQuestionsModule,
    ReclamationModule,
    MessageModule,
    RecommendationModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}