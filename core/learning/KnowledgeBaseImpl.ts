// @ts-ignore - TypeScript module resolution issue
import {
  InteractionRecord,
  LearningInsight,
  PerformanceMetric,
  UserPreferences
} from './types.ts';

export class KnowledgeBaseImpl {
  private interactions: InteractionRecord[] = [];
  private insights: LearningInsight[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private userPreferences: UserPreferences | null = null;

  async storeInteraction(interaction: InteractionRecord): Promise<void> {
    this.interactions.push(interaction);
  }

  async storeInsights(insights: LearningInsight[]): Promise<void> {
    this.insights.push(...insights);
  }

  async recordPerformance(metric: PerformanceMetric): Promise<void> {
    this.performanceMetrics.push(metric);
  }

  async getRecentInteractions(count: number): Promise<InteractionRecord[]> {
    return this.interactions.slice(-count);
  }

  async getPerformanceHistory(): Promise<PerformanceMetric[]> {
    return this.performanceMetrics;
  }

  async getUserPreferences(): Promise<UserPreferences> {
    return this.userPreferences || {
      communicationStyle: 'casual',
      responseLength: 'medium',
      topics: [],
      avoidTopics: []
    };
  }

  async updateUserPreferences(preferences: UserPreferences): Promise<void> {
    this.userPreferences = preferences;
  }
}
