// @ts-ignore - TypeScript module resolution issue
import {
  UserMessage,
  AIResponse,
  InteractionRecord,
  PerformanceMetric,
  UserPreferences,
  PatternAnalysis,
  LearningInsight
} from './types.ts';

export class PatternRecognizerImpl {
  async analyzePatterns(userMessage: UserMessage, aiResponse: AIResponse): Promise<PatternAnalysis> {
    const insights: LearningInsight[] = [];
    const patterns: string[] = [];

    const messageLength = userMessage.content.length;
    const responseLength = aiResponse.content.length;
    
    if (messageLength > 500 && responseLength < 100) {
      patterns.push('detailed_question_brief_answer');
      insights.push({
        id: `pattern-${Date.now()}`,
        type: 'pattern',
        description: '用户提出详细问题但收到简短回答',
        confidence: 0.8,
        actionable: true,
        timestamp: new Date()
      });
    }

    if (aiResponse.confidence && aiResponse.confidence < 0.6) {
      patterns.push('low_confidence_response');
    }

    return {
      insights,
      patterns,
      confidence: 0.75
    };
  }

  async generateInsights(
    interactions: InteractionRecord[],
    performance: PerformanceMetric[],
    preferences: UserPreferences
  ): Promise<LearningInsight[]> {
    const insights: LearningInsight[] = [];

    if (performance.length > 0) {
      const avgRelevance = performance.reduce((sum, p) => sum + p.relevance, 0) / performance.length;
      const avgUsefulness = performance.reduce((sum, p) => sum + p.usefulness, 0) / performance.length;

      if (avgRelevance < 0.6) {
        insights.push({
          id: `insight-${Date.now()}-1`,
          type: 'performance',
          description: `平均相关性较低 (${avgRelevance.toFixed(2)})，建议优化回答匹配度`,
          confidence: 0.85,
          actionable: true,
          timestamp: new Date()
        });
      }

      if (avgUsefulness < 0.7) {
        insights.push({
          id: `insight-${Date.now()}-2`,
          type: 'performance',
          description: `平均有用性较低 (${avgUsefulness.toFixed(2)})，建议提供更实用的回答`,
          confidence: 0.8,
          actionable: true,
          timestamp: new Date()
        });
      }
    }

    if (preferences.topics.length > 0) {
      insights.push({
        id: `insight-${Date.now()}-3`,
        type: 'preference',
        description: `用户偏好主题: ${preferences.topics.join(', ')}`,
        confidence: 0.9,
        actionable: false,
        timestamp: new Date()
      });
    }

    return insights;
  }
}
