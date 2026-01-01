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
  id: string;
  content: string;
  timestamp: Date;
  userId: string;
  context?: any;
}

export interface AIResponse {
  id: string;
  content: string;
  timestamp: Date;
  responseTime: number;
  confidence?: number;
  metadata?: any;
}

export interface InteractionRecord {
  timestamp: Date;
  userMessage: UserMessage;
  aiResponse: AIResponse;
  context: any;
}

export interface PatternAnalysis {
  insights: LearningInsight[];
  patterns: string[];
  confidence: number;
}

export interface LearningInsight {
  id: string;
  type: 'pattern' | 'preference' | 'performance' | 'improvement';
  description: string;
  confidence: number;
  actionable: boolean;
  timestamp: Date;
  metadata?: any;
}

export interface PerformanceMetric {
  responseTime: number;
  relevance: number;
  usefulness: number;
  userSatisfaction: number;
  timestamp?: Date;
}

export interface UserFeedback {
  interactionId: string;
  rating: number;
  comment?: string;
  timestamp: Date;
  userId: string;
}

export interface FeedbackAnalysis {
  suggestedImprovements: string[];
  preferenceUpdates?: UserPreferences;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface UserPreferences {
  communicationStyle: 'formal' | 'casual' | 'technical';
  responseLength: 'short' | 'medium' | 'long';
  topics: string[];
  avoidTopics: string[];
}

// Memory System Types
export interface LearningRecord {
  id: string;
  timestamp: string;
  query: string;
  answer: string;
  context?: any;
  confidence?: number;
  tags?: string[];
}

export interface PatternRecognitionResult {
  id: string;
  pattern: string;
  description: string;
  confidence: number;
  occurrences: number;
  firstSeen: string;
  lastSeen: string;
  metadata?: any;
}

export interface PerformanceEvaluation {
  id: string;
  timestamp: string;
  metrics: {
    accuracy: number;
    relevance: number;
    usefulness: number;
    responseTime: number;
    userSatisfaction?: number;
  };
  context?: any;
  notes?: string;
}
