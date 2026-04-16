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
          'good',
          'great',
          'excellent',
          'happy',
          'satisfied',
          'love',
          'like',
          'amazing',
          'wonderful',
          'fantastic',
          'perfect',
          'awesome',
          'super',
          'bien',
          'bon',
          'génial',
          'satisfait',
          'parfait',
          'cool',
          'nice',
          'content',
          'heureux',
          'merci',
          'bravo',
        ],
        weight: 1.5,
      },
      negative: {
        keywords: [
          'bad',
          'poor',
          'dissatisfied',
          'unhappy',
          'terrible',
          'hate',
          'dislike',
          'awful',
          'worst',
          'horrible',
          'mauvais',
          'mécontent',
          'déçu',
          'horrible',
          'frustrated',
          'angry',
          'disappointed',
          'lent',
          'crash',
          'bug',
          'problème',
          'difficile',
          'nul',
        ],
        weight: 1.5,
      },
      confused: {
        keywords: [
          '?',
          'help',
          'confused',
          'not sure',
          'maybe',
          'perhaps',
          'peut-être',
          'je sais pas',
          'incertain',
          'flou',
          'comprends pas',
          'explique',
          'clarification',
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

      // Bonus pour les émojis
      if (text.match(/[😊😍👍🎉✨]/) && emotion === 'positive') score += 2;
      if (text.match(/[😢😡👎💔]/) && emotion === 'negative') score += 2;
      if (text.match(/[😕🤔❓]/) && emotion === 'confused') score += 2;

      // Bonus pour la longueur
      if (emotion === 'confused' && text.length < 15) score += 1;

      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion;
        detectedKeywords = foundKeywords;
      }
    }

    const confidence = Math.min(maxScore / 5, 0.95);

    return {
      emotion: detectedEmotion,
      confidence,
      keywords: detectedKeywords,
    };
  }

  // Construction du prompt dynamique complet
  private buildDynamicAdaptivePrompt(
    theme: string,
    history: string,
    lastAnswer: string,
    emotionAnalysis: {
      emotion: string;
      confidence: number;
      keywords: string[];
    },
    userLanguage: string,
    previousQuestions: string[] = [],
  ): string {
    const languageInstruction = this.getLanguageInstruction(userLanguage);

    // Construire l'historique formaté
    const formattedHistory = history || 'Aucune réponse précédente';

    // Suggestions basées sur l'émotion
    let emotionGuidance = '';
    let suggestedIntents = '';

    switch (emotionAnalysis.emotion) {
      case 'positive':
        emotionGuidance = `L'utilisateur est TRÈS SATISFAIT (confiance: ${(emotionAnalysis.confidence * 100).toFixed(0)}%). 
          Mots-clés détectés: ${emotionAnalysis.keywords.join(', ')}.
          → Générer une question sur: ce qu'il/elle a le plus aimé, les fonctionnalités préférées, ce qui pourrait être encore amélioré.`;
        suggestedIntents = 'satisfaction, improvement_suggestion';
        break;
      case 'negative':
        emotionGuidance = `L'utilisateur est MÉCONTENT ou FRUSTRÉ (confiance: ${(emotionAnalysis.confidence * 100).toFixed(0)}%). 
          Mots-clés détectés: ${emotionAnalysis.keywords.join(', ')}.
          → Générer une question sur: les problèmes rencontrés, les points de friction, ce qui pourrait être amélioré.`;
        suggestedIntents = 'problem, frustration, improvement_needed';
        break;
      case 'confused':
        emotionGuidance = `L'utilisateur est PERDU ou INCERTAIN (confiance: ${(emotionAnalysis.confidence * 100).toFixed(0)}%). 
          → Générer une question pour: clarifier sa pensée, reformuler, proposer des options, aider à comprendre.`;
        suggestedIntents = 'clarification, help, guidance';
        break;
      default:
        emotionGuidance = `L'utilisateur est NEUTRE (confiance: ${(emotionAnalysis.confidence * 100).toFixed(0)}%).
          → Générer une question pour: explorer plus profondément, découvrir ses besoins, comprendre ses attentes.`;
        suggestedIntents = 'explore, discover, understand';
    }

    // Éviter la répétition
    const avoidQuestions =
      previousQuestions.length > 0
        ? `ÉVITER de répéter ces questions: ${previousQuestions.map((q) => `"${q}"`).join(', ')}`
        : 'Aucune question précédente à éviter.';

    return `
${languageInstruction}

Tu es un EXPERT en création de sondages adaptatifs et en analyse émotionnelle.

### CONTEXTE COMPLET:
Thème du sondage: "${theme}"
Historique des réponses:
${formattedHistory}

DERNIÈRE RÉPONSE DE L'UTILISATEUR: "${lastAnswer}"

### ANALYSE ÉMOTIONNELLE AUTOMATIQUE:
${emotionGuidance}

### RÈGLES STRICTES:
1. 🎯 Générer UNE SEULE question courte (max 20 mots)
2. 🧠 Adapter la question à l'émotion détectée
3. 💬 Être naturel et conversationnel
4. 🚫 ${avoidQuestions}
5. 📊 Aller PLUS PROFOND dans l'opinion de l'utilisateur
6. 🎨 Proposer un type de question adapté (text, single_choice, rating, scale)

### FORMAT DE SORTIE (JSON UNIQUEMENT - sans markdown):
{
  "question": "ta question générée ici",
  "emotion": "${emotionAnalysis.emotion}",
  "intent": "satisfaction|problem|clarification|explore",
  "suggestedQuestionType": "text|single_choice|rating|scale",
  "confidence": ${emotionAnalysis.confidence}
}

### EXEMPLES DYNAMIQUES:
Dernière réponse: "J'adore l'application, elle est super rapide !" (émotion: positive)
→ {"question": "Quelle fonctionnalité utilisez-vous le plus souvent ?", "emotion": "positive", "intent": "satisfaction", "suggestedQuestionType": "single_choice", "confidence": 0.9}

Dernière réponse: "L'appli rame beaucoup et plante tout le temps" (émotion: negative)
→ {"question": "À quel moment précis rencontrez-vous ces lenteurs ?", "emotion": "negative", "intent": "problem", "suggestedQuestionType": "text", "confidence": 0.85}

Dernière réponse: "Je sais pas trop quoi dire..." (émotion: confused)
→ {"question": "Qu'est-ce qui vous semble le plus important pour vous ?", "emotion": "confused", "intent": "clarification", "suggestedQuestionType": "single_choice", "confidence": 0.75}

Génère MAINTENANT la question adaptée (JSON uniquement):
`;
  }

  private getLanguageInstruction(lang: string): string {
    const instructions = {
      tn: `إنت خبير في الاستبيانات الذكية. تحكي باللهجة التونسية (دارجة). 
      أسئلتك تكون واضحة وقصيرة ومفهومة بالدارجة التونسية.`,

      ar: `أنت خبير في إنشاء استبيانات ذكية. أجب باللغة العربية الفصحى.
      أسئلتك واضحة ومباشرة وتتناسب مع مشاعر المستخدم.`,

      fr: `Tu es un expert en création de sondages intelligents. Réponds en français.
      Tes questions sont courtes, claires et adaptées à l'émotion de l'utilisateur.`,

      en: `You are an expert in intelligent survey creation. Respond in English.
      Your questions are short, clear, and adapted to the user's emotion.`,
    };

    return (
      instructions[lang as keyof typeof instructions] || instructions['en']
    );
  }

  // Méthode principale dynamique
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
    this.logger.log(
      `📊 Émotion détectée: ${emotionAnalysis.emotion} (confiance: ${emotionAnalysis.confidence})`,
    );
    this.logger.log(`🌐 Langue: ${detectedLang}`);

    const prompt = this.buildDynamicAdaptivePrompt(
      theme,
      history,
      lastAnswer,
      emotionAnalysis,
      detectedLang,
      previousQuestions,
    );

    try {
      const response = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content:
              "Tu es un moteur d'IA pour sondages adaptatifs. Retourne UNIQUEMENT du JSON valide. Pas de markdown, pas d'explications.",
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' },
      });

      let content = response.choices?.[0]?.message?.content ?? '';
      content = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) content = jsonMatch[0];

      const parsed = JSON.parse(content);

      // Validation et enrichissement
      const result: AdaptiveQuestionResponse = {
        question:
          parsed.question ||
          this.getFallbackQuestion(emotionAnalysis.emotion, theme),
        emotion: (parsed.emotion as any) || emotionAnalysis.emotion,
        intent:
          (parsed.intent as any) ||
          this.mapEmotionToIntent(emotionAnalysis.emotion),
        confidence: parsed.confidence || emotionAnalysis.confidence,
        suggestedQuestionType:
          parsed.suggestedQuestionType ||
          this.suggestQuestionType(emotionAnalysis.emotion),
      };

      this.logger.log(`✅ Question générée: ${result.question}`);
      this.logger.log(
        `🎯 Intent: ${result.intent}, Type suggéré: ${result.suggestedQuestionType}`,
      );

      return result;
    } catch (error: any) {
      this.logger.error(`❌ Erreur génération: ${error.message}`);

      return {
        question: this.getFallbackQuestion(emotionAnalysis.emotion, theme),
        emotion: emotionAnalysis.emotion as any,
        intent: this.mapEmotionToIntent(emotionAnalysis.emotion),
        confidence: emotionAnalysis.confidence,
        suggestedQuestionType: this.suggestQuestionType(
          emotionAnalysis.emotion,
        ),
      };
    }
  }

  private mapEmotionToIntent(
    emotion: string,
  ): 'satisfaction' | 'problem' | 'clarification' | 'explore' {
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
      case 'positive':
        return 'text';
      case 'negative':
        return 'text';
      case 'confused':
        return 'single_choice';
      default:
        return 'text';
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

  // Méthodes legacy (gardées pour compatibilité)
  async generateQuestion(
    prompt: string,
    id?: string,
    questionType?: QuestionType,
    lang?: string,
  ): Promise<any[]> {
    // ... garder l'implémentation existante
    const generationId = id || this.generateId();
    const detectedLanguage = lang || this.detectLanguage(prompt);

    // Simuler une réponse pour l'exemple
    return [
      {
        id: Date.now().toString(),
        type: questionType || 'text',
        title: prompt,
        required: true,
        options: [],
      },
    ];
  }

  async generateTextQuestion(prompt: string, lang?: string): Promise<string> {
    return prompt;
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
