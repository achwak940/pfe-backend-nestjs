import { Module } from '@nestjs/common';
import { AiQuestionsController } from './ai-questions.controller';
import { AiQuestionsService } from './ai-questions.service';

@Module({
  controllers: [AiQuestionsController],
  providers: [AiQuestionsService],
})
export class AiQuestionsModule {}