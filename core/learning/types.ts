/**
 * @fileoverview 学习系统类型定义
 * @remarks 部分类型已迁移到 core/shared-types.ts 的 Learning 命名空间
 */

// @ts-ignore - TypeScript module resolution issue
import type { UUID, Timestamp, JsonObject } from '../shared-types.ts';
// @ts-ignore - TypeScript module resolution issue
import type { Learning as SharedLearning } from '../shared-types.ts';

// 重新导出共享类型以保持向后兼容
export type { Learning as SharedLearningTypes };
export type PerformanceMetric = SharedLearning.PerformanceMetric;
export type UserFeedback = SharedLearning.UserFeedback;
export type UserPreferences = SharedLearning.UserPreferences;

export interface LearningConfig {
  maxInteractions: number;
  retentionDays: number;
  enablePatternRecognition: boolean;
  enableFeedbackAnalysis: boolean;
}

export interface KnowledgeBase {
  storeInteraction(interaction: InteractionRecord): Promise<void>;
  storeInsights(insights: LearningInsight[]): Promise<void>;
  recordPerformance(metric: PerformanceMetric): Promise<void>;
  getRecentInteractions(count: number): Promise<InteractionRecord[]>;
  getPerformanceHistory(): Promise<PerformanceMetric[]>;
  getUserPreferences(): Promise<UserPreferences>;
  updateUserPreferences(preferences: UserPreferences): Promise<void>;
}

export interface PatternRecognizer {
  analyzePatterns(userMessage: UserMessage, aiResponse: AIResponse): Promise<PatternAnalysis>;
  generateInsights(
    interactions: InteractionRecord[],
    performance: PerformanceMetric[],
    preferences: UserPreferences
  ): Promise<LearningInsight[]>;
}

export interface FeedbackAnalyzer {
  analyze(feedback: UserFeedback): Promise<FeedbackAnalysis>;
}

export interface UserMessage {
  id: UUID;
  content: string;
  timestamp: Timestamp;
  userId: UUID;
  context?: JsonObject;
}

export interface AIResponse {
  id: UUID;
  content: string;
  timestamp: Timestamp;
  responseTime: number;
  confidence?: number;
  metadata?: JsonObject;
}

export interface InteractionRecord {
  timestamp: Timestamp;
  userMessage: UserMessage;
  aiResponse: AIResponse;
  context: JsonObject;
}

export interface PatternAnalysis {
  insights: LearningInsight[];
  patterns: string[];
  confidence: number;
}

export interface LearningInsight {
  id: UUID;
  type: 'pattern' | 'preference' | 'performance' | 'improvement';
  description: string;
  confidence: number;
  actionable: boolean;
  timestamp: Timestamp;
  metadata?: JsonObject;
}

export interface FeedbackAnalysis {
  suggestedImprovements: string[];
  preferenceUpdates?: UserPreferences;
  sentiment: 'positive' | 'neutral' | 'negative';
}

// Memory System Types
export interface LearningRecord {
  id: UUID;
  timestamp: Timestamp;
  query: string;
  answer: string;
  context?: JsonObject;
  confidence?: number;
  tags?: string[];
}

export interface PatternRecognitionResult {
  id: UUID;
  pattern: string;
  description: string;
  confidence: number;
  occurrences: number;
  firstSeen: Timestamp;
  lastSeen: Timestamp;
  metadata?: JsonObject;
}

export interface PerformanceEvaluation {
  id: UUID;
  timestamp: Timestamp;
  metrics: {
    accuracy: number;
    relevance: number;
    usefulness: number;
    responseTime: number;
    userSatisfaction?: number;
  };
  context?: JsonObject;
  notes?: string;
}
