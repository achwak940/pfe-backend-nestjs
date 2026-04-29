import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Sse,
  Headers,
  Logger,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import {
  AiQuestionsService,
  QuestionGenerationEvent,
  AdaptiveQuestionResponse,
} from './ai-questions.service';

@Controller('ai-questions')
export class AiQuestionsController {
  private readonly logger = new Logger(AiQuestionsController.name);

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
    this.logger.log(`Adaptive generation - Theme: ${theme}`);
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
    this.logger.log(`Emotion analysis for: ${text?.substring(0, 50)}`);
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
    this.logger.log(`Contextual generation - Theme: ${body.theme}`);
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
    this.logger.log(`Simple generation: ${question}`);
    const result = await this.aiService.generateTextQuestion(question, lang);
    return { result, timestamp: new Date() };
  }

  // 🔥 STREAMING
  @Get('stream/:prompt')
  @Sse()
  streamGeneration(@Param('prompt') prompt: string): Observable<MessageEvent> {
    this.logger.log(`Stream generation for: ${prompt}`);
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
    this.logger.log('SSE events subscription');
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

  // ✅ Endpoint simple pour le chatbot
  @Post('chat')
  async chat(@Body() body: { message: string; language?: string }) {
    this.logger.log(`Chat request: ${body.message}`);
    
    const result = await this.aiService.simpleChat(
      body.message,
      body.language || 'fr'
    );
    
    return {
      success: true,
      data: result
    };
  }

  // ✅ Endpoint pour générer une question de sondage
  @Post('generate-survey-question')
  async generateSurveyQuestion(
    @Body() body: {
      topic: string;
      questionType?: string;
      language?: string;
    }
  ) {
    this.logger.log(`Generate survey question - Topic: ${body.topic}`);
    
    const question = await this.aiService.generateSurveyQuestion(
      body.topic,
      body.questionType || 'open',
      body.language || 'fr'
    );
    
    return {
      success: true,
      question: question,
      topic: body.topic,
      type: body.questionType || 'open'
    };
  }

  // ✅ Endpoint pour analyser une réponse utilisateur
  @Post('analyze-response')
  async analyzeResponse(
    @Body() body: {
      question: string;
      answer: string;
      language?: string;
    }
  ) {
    this.logger.log(`Analyze response for question: ${body.question}`);
    
    const analysis = await this.aiService.analyzeUserResponse(
      body.question,
      body.answer,
      body.language || 'fr'
    );
    
    return {
      success: true,
      analysis: analysis
    };
  }

  // ✅ Endpoint pour traduire une question
  @Post('translate')
  async translateQuestion(
    @Body() body: {
      question: string;
      targetLanguage: string;
    }
  ) {
    this.logger.log(`Translate question to: ${body.targetLanguage}`);
    
    const translated = await this.aiService.translateQuestion(
      body.question,
      body.targetLanguage
    );
    
    return {
      success: true,
      original: body.question,
      translated: translated,
      targetLanguage: body.targetLanguage
    };
  }

  // ✅ Endpoint pour générer plusieurs questions (CORRIGÉ)
  @Post('generate-batch')
  async generateBatchQuestions(
    @Body() body: {
      topic: string;
      count: number;
      questionTypes?: string[];
      language?: string;
    }
  ) {
    this.logger.log(`Generate batch of ${body.count} questions about: ${body.topic}`);
    
    const types = body.questionTypes || ['open', 'closed', 'rating'];
    
    // ✅ Correction : Type explicite pour le tableau
    const questions: Array<{
      id: number;
      type: string;
      question: string;
    }> = [];
    
    for (let i = 0; i < body.count; i++) {
      const type = types[i % types.length];
      const question = await this.aiService.generateSurveyQuestion(
        body.topic,
        type,
        body.language || 'fr'
      );
      questions.push({
        id: i + 1,
        type: type,
        question: question
      });
    }
    
    return {
      success: true,
      topic: body.topic,
      count: body.count,
      questions: questions
    };
  }

  // ✅ Endpoint pour conversation complète (avec historique)
  @Post('conversation')
  async conversation(
    @Body() body: {
      messages: Array<{ role: string; content: string }>;
      language?: string;
    }
  ) {
    this.logger.log(`Conversation with ${body.messages.length} messages`);
    
    // Prendre le dernier message utilisateur
    const lastUserMessage = body.messages.filter(m => m.role === 'user').pop();
    
    if (!lastUserMessage) {
      return {
        success: false,
        error: "No user message found"
      };
    }
    
    const result = await this.aiService.simpleChat(
      lastUserMessage.content,
      body.language || 'fr'
    );
    
    return {
      success: true,
      response: result.response,
      emotion: result.emotion,
      confidence: result.confidence
    };
  }
}