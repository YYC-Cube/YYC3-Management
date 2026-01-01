// marketing/types.ts

export interface CampaignBrief {
  id: string;
  name: string;
  objectives: string[];
  budget: number;
  timeline: {
    startDate: Date;
    endDate: Date;
  };
  targetKPIs: {
    reach: number;
    engagement: number;
    conversion: number;
  };
  channels: string[];
}

export interface TargetAudience {
  segments: AudienceSegment[];
  exclusionCriteria: ExclusionCriteria[];
  prioritization: SegmentPrioritization;
  personalizationLevel: 'low' | 'medium' | 'high';
}

export interface AudienceSegment {
  id: string;
  name: string;
  criteria: any;
  estimatedSize: number;
  expectedResponseRate: number;
}

export interface ExclusionCriteria {
  type: string;
  description: string;
  criteria: any;
}

export interface SegmentPrioritization {
  segments: {
    segmentId: string;
    priority: number;
    budgetAllocation: number;
  }[];
}

export interface CampaignContent {
  scripts: CallScript[];
  emailTemplates: EmailTemplate[];
  smsMessages: SMSMessage[];
  valuePropositions: ValueProposition[];
  objectionHandling: ObjectionResponse[];
}

export interface CallScript {
  scenario: string;
  script: string;
  variations: string[];
  successMetrics: string[];
}

export interface EmailTemplate {
  subject: string;
  body: string;
  personalizationFields: string[];
  timing: any;
}

export interface SMSMessage {
  template: string;
  maxLength: number;
  callToAction: string;
  timing: any;
}

export interface ValueProposition {
  key: string;
  message: string;
  supportingPoints: string[];
  targetSegments: string[];
}

export interface ObjectionResponse {
  objection: string;
  response: string;
  supportingEvidence: string[];
  confidenceLevel: number;
}

export interface AICampaign {
  brief: CampaignBrief;
  targetAudience: TargetAudience;
  content: CampaignContent;
  deliveryStrategy: DeliveryStrategy;
  performancePredictions: PerformancePredictions;
  optimizationPlan: OptimizationPlan;
}

export interface DeliveryStrategy {
  channels: ChannelStrategy[];
  timing: TimingStrategy;
  frequency: FrequencyStrategy;
  budgetAllocation: BudgetAllocation;
}

export interface ChannelStrategy {
  channel: string;
  weight: number;
  sequence: number;
  triggers: any[];
}

export interface TimingStrategy {
  bestTimes: any[];
  frequency: string;
  duration: string;
}

export interface FrequencyStrategy {
  minimum: number;
  maximum: number;
  optimal: number;
  adaptationRules: any[];
}

export interface BudgetAllocation {
  total: number;
  byChannel: {
    channel: string;
    amount: number;
    percentage: number;
  }[];
  bySegment: {
    segmentId: string;
    amount: number;
    percentage: number;
  }[];
}

export interface PerformancePredictions {
  reach: number;
  engagement: number;
  conversion: number;
  roi: number;
  confidence: number;
}

export interface OptimizationPlan {
  optimizationPoints: OptimizationPoint[];
  triggers: OptimizationTrigger[];
  metrics: string[];
}

export interface OptimizationPoint {
  type: string;
  condition: any;
  action: any;
  expectedImpact: number;
}

export interface OptimizationTrigger {
  metric: string;
  threshold: number;
  direction: 'above' | 'below';
  action: string;
}

export interface CampaignPerformance {
  campaignId: string;
  metrics: {
    reach: number;
    engagement: number;
    conversion: number;
    roi: number;
  };
  byChannel: any;
  bySegment: any;
  timeline: any;
}

export interface CampaignOptimization {
  audienceAdjustments: any;
  contentOptimizations: any;
  deliveryOptimizations: any;
  budgetReallocations: any;
}

export interface CampaignOptimizer {
  optimize(campaign: AICampaign): Promise<CampaignOptimization>;
}

export interface AudienceSelector {
  select(brief: CampaignBrief): Promise<TargetAudience>;
}

export interface ContentGenerator {
  generate(brief: CampaignBrief, audience: TargetAudience): Promise<CampaignContent>;
}

export interface PerformanceAnalysis {
  overall: any;
  byChannel: any;
  bySegment: any;
  insights: any;
  recommendations: any;
}

// Mobile Workbench Types
export interface Agent {
  id: string;
  name: string;
  role: string;
  skills: string[];
}

export interface MobileAIExperience {
  callingInterface: AICallingInterface;
  offlineCapabilities: OfflineAICapabilities;
  voiceAssistant: VoiceAssistantIntegration;
  intelligentNotifications: SmartNotifications;
  mobileAnalytics: MobileAnalytics;
}

export interface AICallingInterface {
  realTimeAssistance: {
    scriptSuggestions: boolean;
    sentimentAnalysis: boolean;
    objectionHandling: boolean;
    nextBestAction: boolean;
  };
  callPreparation: {
    customerInsights: boolean;
    conversationStrategy: boolean;
    historicalContext: boolean;
  };
  postCallAutomation: {
    autoSummary: boolean;
    nextStepScheduling: boolean;
    crmUpdate: boolean;
  };
}

export interface OfflineAICapabilities {
  speechRecognition: SpeechModel;
  intentClassification: IntentModel;
  responseSuggestions: ResponseModel;
  customerInsights: CachedCustomerData;
  callScripts: ScriptLibrary;
}

export interface SpeechModel {
  modelId: string;
  version: string;
  size: number;
  languages: string[];
}

export interface IntentModel {
  modelId: string;
  version: string;
  supportedIntents: string[];
}

export interface ResponseModel {
  modelId: string;
  version: string;
  categories: string[];
}

export interface CachedCustomerData {
  customers: any[];
  lastUpdated: Date;
  size: number;
}

export interface ScriptLibrary {
  scripts: any[];
  categories: string[];
  lastUpdated: Date;
}

export interface VoiceAssistantIntegration {
  enabled: boolean;
  features: string[];
  commands: VoiceCommand[];
}

export interface VoiceCommand {
  command: string;
  action: string;
  parameters: any;
}

export interface SmartNotifications {
  enabled: boolean;
  types: string[];
  timing: any;
}

export interface MobileAnalytics {
  metrics: string[];
  dashboards: any[];
  realTimeUpdates: boolean;
}

export interface MobileCoaching {
  dailyTips: DailyTip[];
  skillExercises: Exercise[];
  performanceFeedback: Feedback;
  goalTracking: GoalTracking;
}

export interface DailyTip {
  id: string;
  title: string;
  content: string;
  category: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;
}

export interface Feedback {
  overall: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export interface GoalTracking {
  goals: Goal[];
  progress: any;
  achievements: Achievement[];
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: Date;
}

export interface OfflineManager {
  enableOfflineMode(): Promise<void>;
  syncData(): Promise<void>;
}

export interface PushOptimizer {
  optimize(notification: any): Promise<any>;
}

export interface VoiceAssistant {
  initialize(): Promise<void>;
  processCommand(command: string): Promise<any>;
}

// Advanced Automation Types
export interface JourneyOrchestrator {
  orchestrate(journey: DynamicJourney): Promise<void>;
}

export interface ContentPersonalizer {
  personalize(content: any, audience: TargetAudience): Promise<any>;
}

export interface PerformanceOptimizer {
  optimize(campaign: IntelligentCampaign): Promise<IntelligentCampaign>;
}

export interface Campaign {
  id: string;
  name: string;
  objectives: string[];
  budget: number;
  timeline: {
    startDate: Date;
    endDate: Date;
  };
}

export interface IntelligentCampaign {
  campaign: Campaign;
  audience: TargetAudience;
  content: any;
  journey: DynamicJourney;
  optimization: {
    realTimeOptimization: boolean;
    a_bTesting: boolean;
    predictiveScaling: boolean;
    budgetOptimization: boolean;
  };
  analytics: {
    realTimeTracking: boolean;
    multiTouchAttribution: boolean;
    roiCalculation: boolean;
    learningLoop: boolean;
  };
}

export interface DynamicJourney {
  entryPoints: any[];
  pathways: any[];
  triggers: any[];
  optimizations: any[];
  measurements: any[];
}

export interface LearningCampaignSystem {
  adaptiveAlgorithms: {
    reinforcementLearning: boolean;
    collaborativeFiltering: boolean;
    contextAwareOptimization: boolean;
  };
  feedbackLoops: {
    performanceFeedback: boolean;
    customerFeedback: boolean;
    marketFeedback: boolean;
  };
  continuousImprovement: {
    modelRetraining: boolean;
    strategyEvolution: boolean;
    contentOptimization: boolean;
  };
}
