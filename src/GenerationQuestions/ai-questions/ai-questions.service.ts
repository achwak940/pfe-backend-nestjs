import { Injectable, Logger } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import OpenAI from 'openai';

export type QuestionType =
  | 'text'
  | 'single_choice'
  | 'multiple_choice'
  | 'rating'
  | 'scale'
  | 'date'
  | 'email'
  | 'number';

export interface QuestionGenerationEvent {
  id: string;
  prompt: string;
  status: 'generating' | 'completed' | 'error';
  result?: any;
  timestamp: Date;
  detectedLanguage?: string;
}

export interface AdaptiveQuestionResponse {
  question: string;
  emotion: 'positive' | 'negative' | 'neutral' | 'confused';
  intent: 'satisfaction' | 'problem' | 'clarification' | 'explore';
  confidence?: number;
  suggestedQuestionType?: QuestionType;
}

@Injectable()
export class AiQuestionsService {
  private readonly logger = new Logger(AiQuestionsService.name);
  private activeGenerations: Map<string, QuestionGenerationEvent> = new Map();
  private generationEvents: Subject<QuestionGenerationEvent> = new Subject();

  private groq = new OpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
  });

  // Détection avancée de la langue
  private detectLanguage(text: string): string {
    const arabicPattern = /[\u0600-\u06FF]/;
    const tunisianPattern = /(باش|شنو|علاش|هاذا|هاذي|كيفاش|برشا|شكون)/i;
    const frenchPattern = /[éèêàçùôœ]/i;

    if (tunisianPattern.test(text)) return 'tn';
    if (arabicPattern.test(text)) return 'ar';
    if (frenchPattern.test(text)) return 'fr';
    return 'en';
  }

  // Analyse avancée de l'émotion
  private analyzeEmotion(text: string): {
    emotion: string;
    confidence: number;
    keywords: string[];
  } {
    const lowerText = text.toLowerCase();

    const emotionPatterns = {
      positive: {
        keywords: [
          'good', 'great', 'excellent', 'happy', 'satisfied', 'love', 'like',
          'amazing', 'wonderful', 'fantastic', 'perfect', 'awesome', 'super',
          'bien', 'bon', 'génial', 'satisfait', 'parfait', 'cool', 'nice',
          'content', 'heureux', 'merci', 'bravo'
        ],
        weight: 1.5,
      },
      negative: {
        keywords: [
          'bad', 'poor', 'dissatisfied', 'unhappy', 'terrible', 'hate', 'dislike',
          'awful', 'worst', 'horrible', 'mauvais', 'mécontent', 'déçu',
          'frustrated', 'angry', 'disappointed', 'lent', 'crash', 'bug',
          'problème', 'difficile', 'nul'
        ],
        weight: 1.5,
      },
      confused: {
        keywords: [
          '?', 'help', 'confused', 'not sure', 'maybe', 'perhaps', 'peut-être',
          'je sais pas', 'incertain', 'flou', 'comprends pas', 'explique', 'clarification'
        ],
        weight: 1.2,
      },
    };

    let maxScore = 0;
    let detectedEmotion = 'neutral';
    let detectedKeywords: string[] = [];

    for (const [emotion, data] of Object.entries(emotionPatterns)) {
      let score = 0;
      const foundKeywords: string[] = [];

      for (const keyword of data.keywords) {
        if (lowerText.includes(keyword)) {
          score += data.weight;
          foundKeywords.push(keyword);
        }
      }

      if (text.match(/[😊😍👍🎉✨]/) && emotion === 'positive') score += 2;
      if (text.match(/[😢😡👎💔]/) && emotion === 'negative') score += 2;
      if (text.match(/[😕🤔❓]/) && emotion === 'confused') score += 2;
      if (emotion === 'confused' && text.length < 15) score += 1;

      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion;
        detectedKeywords = foundKeywords;
      }
    }

    const confidence = Math.min(maxScore / 5, 0.95);
    return { emotion: detectedEmotion, confidence, keywords: detectedKeywords };
  }

  // ✅ MÉTHODE PRINCIPALE CORRIGÉE - Génération de texte
  async generateTextQuestion(prompt: string, lang?: string): Promise<string> {
    this.logger.log(`📝 Generating question for: ${prompt}`);
    
    const language = lang || this.detectLanguage(prompt);
    
    const languageInstruction = {
      fr: "Génère une question de sondage en français. La question doit être claire, précise et pertinente. Retourne UNIQUEMENT la question, sans explication.",
      en: "Generate a survey question in English. The question must be clear, precise and relevant. Return ONLY the question, no explanation.",
      ar: "قم بإنشاء سؤال استبيان باللغة العربية. يجب أن يكون السؤال واضحًا ودقيقًا وذو صلة. قم بإرجاع السؤال فقط، بدون تفسير.",
      tn: "Generate a survey question in Tunisian dialect. The question must be clear and relevant. Return ONLY the question, no explanation."
    };
    
    try {
      const completion = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: languageInstruction[language] || languageInstruction['fr']
          },
          {
            role: 'user',
            content: `Sujet: ${prompt}\n\nGénère une question de sondage professionnelle sur ce sujet.`
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      let question = completion.choices[0]?.message?.content || '';
      
      question = question
        .replace(/^["']|["']$/g, '')
        .replace(/^Question: /i, '')
        .replace(/^Sondage: /i, '')
        .trim();
      
      if (!question) {
        question = this.getFallbackQuestionText(prompt, language);
      }
      
      this.logger.log(`✅ Generated: ${question.substring(0, 100)}...`);
      return question;
      
    } catch (error) {
      this.logger.error(`❌ Generation error: ${error.message}`);
      return this.getFallbackQuestionText(prompt, language);
    }
  }

  private getFallbackQuestionText(prompt: string, language: string): string {
    const fallbacks = {
      fr: `Comment évaluez-vous votre expérience avec ${prompt} ?`,
      en: `How do you rate your experience with ${prompt}?`,
      ar: `كيف تقيم تجربتك مع ${prompt}؟`,
      tn: `شنو رايك في ${prompt}؟`
    };
    return fallbacks[language] || fallbacks['fr'];
  }

  // ✅ MÉTHODE POUR LE CHATBOT
  async simpleChat(
    message: string,
    language: string = 'fr'
  ): Promise<{ response: string; emotion: string; confidence: number }> {
    this.logger.log(`💬 Chat request: ${message}`);
    
    const detectedLang = language || this.detectLanguage(message);
    const emotionAnalysis = this.analyzeEmotion(message);
    
    const systemPrompt = {
      fr: `Tu es un assistant expert en création de sondages. 
      Tu aides les utilisateurs à générer des questions pour leurs enquêtes.
      Réponds de manière amicale et professionnelle en français.
      Propose des suggestions pertinentes basées sur le message de l'utilisateur.
      Si l'utilisateur demande de générer une question, fais-le immédiatement.`,
      
      en: `You are an expert survey creation assistant.
      You help users generate questions for their surveys.
      Respond in a friendly and professional manner in English.
      Provide relevant suggestions based on the user's message.
      If the user asks to generate a question, do it immediately.`,
      
      ar: `أنت مساعد خبير في إنشاء الاستبيانات.
      تساعد المستخدمين في إنشاء أسئلة لاستبياناتهم.
      رد بطريقة ودية ومهنية باللغة العربية.
      قدم اقتراحات ذات صلة بناءً على رسالة المستخدم.
      إذا طلب المستخدم إنشاء سؤال، قم بذلك فورًا.`,
      
      tn: `You are an expert survey creation assistant speaking Tunisian dialect.
      Help users generate survey questions.
      Respond in Tunisian dialect in a friendly and professional manner.`
    };
    
    try {
      const completion = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: systemPrompt[detectedLang] || systemPrompt['fr']
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content || 
        this.getDefaultChatResponse(detectedLang);

      return {
        response: response,
        emotion: emotionAnalysis.emotion,
        confidence: emotionAnalysis.confidence
      };
      
    } catch (error) {
      this.logger.error(`Chat error: ${error.message}`);
      return {
        response: this.getDefaultChatResponse(detectedLang),
        emotion: emotionAnalysis.emotion,
        confidence: emotionAnalysis.confidence
      };
    }
  }

  private getDefaultChatResponse(language: string): string {
    const responses = {
      fr: "Je suis là pour vous aider à créer des questions de sondage. Quel sujet souhaitez-vous explorer ?",
      en: "I'm here to help you create survey questions. What topic would you like to explore?",
      ar: "أنا هنا لمساعدتك في إنشاء أسئلة الاستبيان. ما الموضوع الذي تريد استكشافه؟",
      tn: "Je suis là pour t'aider à créer des questions de sondage. Quel sujet tu veux explorer ?"
    };
    return responses[language] || responses['fr'];
  }

  // ✅ GÉNÉRATION ADAPTATIVE
  async generateAdaptiveQuestion(
    theme: string,
    history: string,
    lastAnswer: string,
    language?: string,
    previousQuestions: string[] = [],
  ): Promise<AdaptiveQuestionResponse> {
    const detectedLang = language || this.detectLanguage(lastAnswer);
    const emotionAnalysis = this.analyzeEmotion(lastAnswer);

    this.logger.log(`🎯 Génération adaptative - Thème: ${theme}`);
    this.logger.log(`📊 Émotion: ${emotionAnalysis.emotion} (${(emotionAnalysis.confidence * 100).toFixed(0)}%)`);

    const prompt = this.buildDynamicAdaptivePrompt(
      theme, history, lastAnswer, emotionAnalysis, detectedLang, previousQuestions
    );

    try {
      const response = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: "Tu es un moteur d'IA pour sondages adaptatifs. Retourne UNIQUEMENT du JSON valide."
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' },
      });

      let content = response.choices?.[0]?.message?.content ?? '';
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) content = jsonMatch[0];

      const parsed = JSON.parse(content);

      return {
        question: parsed.question || this.getFallbackQuestion(emotionAnalysis.emotion, theme),
        emotion: parsed.emotion || emotionAnalysis.emotion,
        intent: parsed.intent || this.mapEmotionToIntent(emotionAnalysis.emotion),
        confidence: parsed.confidence || emotionAnalysis.confidence,
        suggestedQuestionType: parsed.suggestedQuestionType || this.suggestQuestionType(emotionAnalysis.emotion),
      };
    } catch (error) {
      this.logger.error(`❌ Erreur génération: ${error.message}`);
      return {
        question: this.getFallbackQuestion(emotionAnalysis.emotion, theme),
        emotion: emotionAnalysis.emotion as any,
        intent: this.mapEmotionToIntent(emotionAnalysis.emotion),
        confidence: emotionAnalysis.confidence,
        suggestedQuestionType: this.suggestQuestionType(emotionAnalysis.emotion),
      };
    }
  }

  // ✅ GÉNÉRATION DE QUESTION SIMPLE (legacy)
  async generateQuestion(
    prompt: string,
    id?: string,
    questionType?: QuestionType,
    lang?: string,
  ): Promise<any[]> {
    const question = await this.generateTextQuestion(prompt, lang);
    return [{
      id: Date.now().toString(),
      type: questionType || 'text',
      title: question,
      required: true,
      options: [],
    }];
  }

  // ✅ GÉNÉRATION DE QUESTION DE SONDAGE
  async generateSurveyQuestion(
    topic: string,
    questionType: string = 'open',
    language: string = 'fr'
  ): Promise<string> {
    return this.generateTextQuestion(`${topic} - type: ${questionType}`, language);
  }

  // ✅ ANALYSE DE RÉPONSE
  async analyzeUserResponse(
    question: string,
    answer: string,
    language: string = 'fr'
  ): Promise<{
    sentiment: string;
    followUpQuestion: string;
    keywords: string[];
  }> {
    const emotionAnalysis = this.analyzeEmotion(answer);
    const followUp = await this.generateTextQuestion(
      `Question de suivi basée sur: ${answer}`,
      language
    );
    
    return {
      sentiment: emotionAnalysis.emotion,
      followUpQuestion: followUp,
      keywords: emotionAnalysis.keywords
    };
  }

  // ✅ TRADUCTION
  async translateQuestion(question: string, targetLanguage: string): Promise<string> {
    return this.generateTextQuestion(`Traduis cette question en ${targetLanguage}: ${question}`, targetLanguage);
  }

  // ✅ CONSTRUCTION DU PROMPT DYNAMIQUE
  private buildDynamicAdaptivePrompt(
    theme: string,
    history: string,
    lastAnswer: string,
    emotionAnalysis: any,
    userLanguage: string,
    previousQuestions: string[] = [],
  ): string {
    const languageInstruction = this.getLanguageInstruction(userLanguage);
    const formattedHistory = history || 'Aucune réponse précédente';
    
    let emotionGuidance = '';
    switch (emotionAnalysis.emotion) {
      case 'positive':
        emotionGuidance = `L'utilisateur est SATISFAIT. Génère une question sur ce qu'il/elle a le plus aimé.`;
        break;
      case 'negative':
        emotionGuidance = `L'utilisateur est MÉCONTENT. Génère une question sur les problèmes rencontrés.`;
        break;
      case 'confused':
        emotionGuidance = `L'utilisateur est PERDU. Génère une question pour clarifier.`;
        break;
      default:
        emotionGuidance = `L'utilisateur est NEUTRE. Génère une question pour explorer ses besoins.`;
    }

    const avoidQuestions = previousQuestions.length > 0 
      ? `Évite: ${previousQuestions.map(q => `"${q}"`).join(', ')}`
      : '';

    return `${languageInstruction}

Thème: "${theme}"
Historique: ${formattedHistory}
Dernière réponse: "${lastAnswer}"
${emotionGuidance}
${avoidQuestions}

Génère UNE question courte en JSON:
{
  "question": "...",
  "emotion": "${emotionAnalysis.emotion}",
  "intent": "satisfaction|problem|clarification|explore",
  "suggestedQuestionType": "text|single_choice|rating|scale"
}`;
  }

  private getLanguageInstruction(lang: string): string {
    const instructions = {
      tn: `تحكي بالدارجة التونسية. أسئلتك تكون واضحة وقصيرة.`,
      ar: `أجب باللغة العربية الفصحى. أسئلتك واضحة ومباشرة.`,
      fr: `Réponds en français. Tes questions sont courtes et claires.`,
      en: `Respond in English. Your questions are short and clear.`,
    };
    return instructions[lang as keyof typeof instructions] || instructions['en'];
  }

  private mapEmotionToIntent(emotion: string): 'satisfaction' | 'problem' | 'clarification' | 'explore' {
    const mapping: Record<string, any> = {
      positive: 'satisfaction',
      negative: 'problem',
      confused: 'clarification',
      neutral: 'explore',
    };
    return mapping[emotion] || 'explore';
  }

  private suggestQuestionType(emotion: string): QuestionType {
    switch (emotion) {
      case 'positive': return 'text';
      case 'negative': return 'text';
      case 'confused': return 'single_choice';
      default: return 'text';
    }
  }

  private getFallbackQuestion(emotion: string, theme: string): string {
    const fallbacks: Record<string, string> = {
      positive: `Qu'est-ce qui vous a le plus plu dans cette expérience ?`,
      negative: `Qu'est-ce qui pourrait être amélioré selon vous ?`,
      confused: `Pouvez-vous nous en dire plus sur votre expérience ?`,
      neutral: `Que pensez-vous de cette expérience sur "${theme}" ?`,
    };
    return fallbacks[emotion] || fallbacks['neutral'];
  }

  getAllGenerations(): QuestionGenerationEvent[] {
    return Array.from(this.activeGenerations.values());
  }

  getGenerationById(id: string) {
    return this.activeGenerations.get(id);
  }

  subscribeToEvents(): Observable<QuestionGenerationEvent> {
    return this.generationEvents.asObservable();
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  }
}