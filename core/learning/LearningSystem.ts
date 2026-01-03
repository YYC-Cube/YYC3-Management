// @ts-ignore - TypeScript module resolution issue
import {
  LearningConfig,
  KnowledgeBase,
  PatternRecognizer,
  FeedbackAnalyzer,
  UserMessage,
  AIResponse,
  InteractionRecord,
  PatternAnalysis,
  LearningInsight,
  PerformanceMetric,
  UserFeedback,
  FeedbackAnalysis,
  UserPreferences
} from './types.ts';
import { KnowledgeBaseImpl } from './KnowledgeBaseImpl';
import { PatternRecognizerImpl } from './PatternRecognizerImpl';
import { FeedbackAnalyzerImpl } from './FeedbackAnalyzerImpl';

export class LearningSystem {
  private config: LearningConfig;
  private knowledgeBase: KnowledgeBase;
  private patternRecognizer: PatternRecognizer;
  private feedbackAnalyzer: FeedbackAnalyzer;

  constructor(config: LearningConfig) {
    this.config = config;
    this.knowledgeBase = new KnowledgeBaseImpl();
    this.patternRecognizer = new PatternRecognizerImpl();
    this.feedbackAnalyzer = new FeedbackAnalyzerImpl();
  }

  async recordInteraction(userMessage: UserMessage, aiResponse: AIResponse): Promise<void> {
    // 1. 存储交互记录
    await this.knowledgeBase.storeInteraction({
      timestamp: new Date(),
      userMessage,
      aiResponse,
      context: await this.getCurrentContext()
    });

    // 2. 模式识别
    const patterns = await this.patternRecognizer.analyzePatterns(userMessage, aiResponse);
    if (patterns.insights.length > 0) {
      await this.knowledgeBase.storeInsights(patterns.insights);
    }

    // 3. 性能评估
    const performance = await this.evaluatePerformance(userMessage, aiResponse);
    await this.knowledgeBase.recordPerformance(performance);
  }

  async learnFromFeedback(feedback: UserFeedback): Promise<void> {
    const analysis = await this.feedbackAnalyzer.analyze(feedback);

    // 基于反馈调整行为
    if (analysis.suggestedImprovements.length > 0) {
      await this.applyImprovements(analysis.suggestedImprovements);
    }

    // 更新用户偏好
    if (analysis.preferenceUpdates) {
      await this.knowledgeBase.updateUserPreferences(analysis.preferenceUpdates);
    }
  }

  async generateInsights(): Promise<LearningInsight[]> {
    const recentInteractions = await this.knowledgeBase.getRecentInteractions(100);
    const performanceHistory = await this.knowledgeBase.getPerformanceHistory();
    const userPreferences = await this.knowledgeBase.getUserPreferences();

    return await this.patternRecognizer.generateInsights(
      recentInteractions,
      performanceHistory,
      userPreferences
    );
  }

  private async evaluatePerformance(
    userMessage: UserMessage,
    aiResponse: AIResponse
  ): Promise<PerformanceMetric> {
    return {
      responseTime: aiResponse.responseTime,
      relevance: await this.calculateRelevance(userMessage, aiResponse),
      usefulness: await this.calculateUsefulness(userMessage, aiResponse),
      userSatisfaction: 0
    };
  }

  private async getCurrentContext(): Promise<any> {
    return {
      timestamp: new Date(),
      session: this.config
    };
  }

  private async applyImprovements(improvements: string[]): Promise<void> {
    for (const improvement of improvements) {
      await this.knowledgeBase.storeInsights([{
        id: `improvement-${Date.now()}`,
        type: 'improvement',
        description: improvement,
        confidence: 0.8,
        actionable: true,
        timestamp: new Date()
      }]);
    }
  }

  private async calculateRelevance(userMessage: UserMessage, aiResponse: AIResponse): Promise<number> {
    const keywords = userMessage.content.split(' ').filter(word => word.length > 3);
    const responseWords = aiResponse.content.split(' ');
    const matchCount = keywords.filter(keyword => 
      responseWords.some(word => word.toLowerCase().includes(keyword.toLowerCase()))
    ).length;
    return keywords.length > 0 ? matchCount / keywords.length : 0;
  }

  private async calculateUsefulness(userMessage: UserMessage, aiResponse: AIResponse): Promise<number> {
    const responseLength = aiResponse.content.length;
    const messageLength = userMessage.content.length;
    const ratio = responseLength / messageLength;
    
    if (ratio < 0.5) return 0.5;
    if (ratio > 3) return 0.7;
    return 0.9;
  }
}
