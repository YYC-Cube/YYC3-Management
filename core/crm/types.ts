export interface BehavioralAnalytics {
  analyzePreferences(customerId: string): Promise<any>;
  analyzePatterns(customerId: string): Promise<any>;
  analyzeResponses(customerId: string): Promise<any>;
  analyzeChannelPerformance(customerId: string): Promise<any>;
}

export interface PredictiveScoring {
  predictChurnRisk(customerId: string): Promise<number>;
  predictLifetimeValue(customerId: string): Promise<number>;
  predictNextPurchase(customerId: string): Promise<any>;
  predictEngagementLevel(customerId: string): Promise<number>;
}

export interface JourneyMapper {
  mapCustomerJourney(customerId: string): Promise<any>;
  identifyTouchpoints(customerId: string): Promise<any[]>;
  analyzeJourneyStage(customerId: string): Promise<string>;
  optimizeJourney(customerId: string): Promise<any>;
}

export interface Customer360 {
  demographic: any;
  contact: any;
  behavioral: {
    communicationPreferences: any;
    engagementPatterns: any;
    responseHistory: any;
    channelEffectiveness: any;
  };
  value: {
    currentValue: number;
    potentialValue: number;
    loyaltyScore: number;
    churnRisk: number;
  };
  intelligentTags: AITag[];
  recommendations: {
    nextBestAction: any;
    productRecommendations: any[];
    communicationStrategy: any;
    engagementOptimization: any;
  };
}

export interface BehavioralData {
  preferences: any;
  patterns: any;
  responses: any;
  channelPerformance: any;
  engagementPatterns: {
    highFrequency: boolean;
  };
}

export interface PredictiveInsights {
  churnRisk: number;
  lifetimeValue?: number;
  nextPurchase?: any;
  engagementLevel?: number;
}

export interface AITag {
  type: 'behavioral' | 'predictive' | 'value' | 'demographic' | 'custom';
  name: string;
  confidence: number;
  source: string;
  expiration: string;
  metadata?: Record<string, any>;
}
