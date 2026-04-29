import { Module } from '@nestjs/common';
import { EnqueteService } from './enquete.service';
import { EnqueteController } from './enquete.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enquete } from './entities/enquete.entity';
import { Question } from 'src/question/entities/question.entity';
import { Reponse } from 'src/reponse/entities/reponse.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enquete, Question,Reponse])
  ],
  controllers: [EnqueteController],
  providers: [EnqueteService],
})
export class EnqueteModule {}