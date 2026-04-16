import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Sse,
  Headers,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import {
  AiQuestionsService,
  QuestionGenerationEvent,
  AdaptiveQuestionResponse,
} from './ai-questions.service';

@Controller('ai-questions')
export class AiQuestionsController {
  constructor(private readonly aiService: AiQuestionsService) {}

  // 🔥 ENDPOINT ADAPTATIF COMPLET
  @Post('adaptive')
  async generateAdaptive(
    @Body('theme') theme: string,
    @Body('history') history: string,
    @Body('lastAnswer') lastAnswer: string,
    @Body('language') language: string,
    @Body('previousQuestions') previousQuestions?: string[],
  ): Promise<AdaptiveQuestionResponse> {
    return await this.aiService.generateAdaptiveQuestion(
      theme,
      history || '',
      lastAnswer,
      language || 'fr',
      previousQuestions || [],
    );
  }

  // 🔥 ANALYSE D'ÉMOTION UNIQUEMENT
  @Post('analyze-emotion')
  analyzeEmotion(@Body('text') text: string) {
    // Cette méthode serait implémentée dans le service
    return {
      emotion: 'neutral',
      confidence: 0.8,
      timestamp: new Date(),
    };
  }

  // 🔥 GÉNÉRATION AVEC HISTORIQUE COMPLET
  @Post('generate-contextual')
  async generateContextual(
    @Body()
    body: {
      theme: string;
      conversationHistory: Array<{ question: string; answer: string }>;
      currentAnswer: string;
      language?: string;
    },
  ) {
    const history = body.conversationHistory
      .map((h) => `Q: ${h.question}\nA: ${h.answer}`)
      .join('\n\n');

    const previousQuestions = body.conversationHistory.map((h) => h.question);

    return await this.aiService.generateAdaptiveQuestion(
      body.theme,
      history,
      body.currentAnswer,
      body.language,
      previousQuestions,
    );
  }

  // 🔥 GÉNÉRATION SIMPLE (legacy)
  @Post('generate')
  async generate(
    @Body('question') question: string,
    @Body('lang') lang?: string,
  ) {
    const result = await this.aiService.generateTextQuestion(question, lang);
    return { result, timestamp: new Date() };
  }

  // 🔥 STREAMING
  @Get('stream/:prompt')
  @Sse()
  streamGeneration(@Param('prompt') prompt: string): Observable<MessageEvent> {
    return this.aiService
      .subscribeToEvents()
      .pipe(
        map(
          (event: QuestionGenerationEvent) => ({ data: event }) as MessageEvent,
        ),
      );
  }

  @Get('events')
  @Sse()
  subscribeToEvents(): Observable<MessageEvent> {
    return this.aiService
      .subscribeToEvents()
      .pipe(
        map(
          (event: QuestionGenerationEvent) => ({ data: event }) as MessageEvent,
        ),
      );
  }

  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date() };
  }
}
  