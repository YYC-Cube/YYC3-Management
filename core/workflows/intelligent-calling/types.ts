import { Customer, Campaign, CallingResult } from '../types';

export interface AIOrchestrator {
  id: string;
  model: string;
  capabilities: string[];
  generateStrategy?(params: any): Promise<any>;
}

export interface RealTimeAnalyzer {
  id: string;
  model: string;
  capabilities: string[];
}

export interface Customer360 {
  id: string;
  segment: string;
  profile: any;
  behavior: any;
  value: any;
  sentiment: any;
}

export interface ConversationStrategy {
  script: string;
  talkingPoints: string[];
  tone: string;
  pacing: string;
  valueProposition: string;
}

export interface CallPreparation {
  customerInsights: Customer360;
  recommendedScript: string;
  keyTalkingPoints: string[];
  objectionResponses: any;
  optimalTiming: any;
  sentimentAnalysis: any;
}

export interface CallSession {
  id: string;
  customerId: string;
  campaignId: string;
  startTime: Date;
  endTime?: Date;
  status: string;
  transcript?: string;
  sentiment?: any;
  outcome?: any;
  audioStream?: any;
  context?: any;
}

export interface PostCallProcessing {
  callSummary: any;
  customerFeedback: any;
  outcomeAnalysis: any;
  nextActions: any;
  insights: any;
}

export interface CallInsights {
  performance: any;
  recommendations: any;
  learningData: any;
  optimization: any;
}

export interface IntelligentCallingResult {
  preparation: CallPreparation;
  callSession: CallSession;
  postCallProcessing: PostCallProcessing;
  insights: CallInsights;
}

export interface JourneyMapper {
  id: string;
  model: string;
  capabilities: string[];
}

export interface TouchpointOptimizer {
  id: string;
  model: string;
  capabilities: string[];
}

export interface CustomerJourney {
  acquisition: AcquisitionWorkflow;
  activation: ActivationWorkflow;
  retention: RetentionWorkflow;
  growth: GrowthWorkflow;
  recovery: RecoveryWorkflow;
}

export interface AcquisitionWorkflow {
  leadGeneration: LeadGeneration;
  initialEngagement: InitialEngagement;
  conversion: Conversion;
}

export interface ActivationWorkflow {
  onboarding: Onboarding;
  firstPurchase: FirstPurchase;
  engagement: Engagement;
}

export interface RetentionWorkflow {
  proactiveService: ProactiveService;
  engagementOptimization: EngagementOptimization;
  loyaltyBuilding: LoyaltyBuilding;
}

export interface GrowthWorkflow {
  crossSelling: CrossSelling;
  upSelling: UpSelling;
  referralProgram: ReferralProgram;
}

export interface RecoveryWorkflow {
  churnPrediction: ChurnPrediction;
  retentionCampaigns: RetentionCampaigns;
  winBack: WinBack;
}

export interface LeadGeneration {
  multiChannelLeads: any;
  leadScoring: any;
  priorityRouting: any;
}

export interface InitialEngagement {
  personalizedOutreach: any;
  intelligentCalling: any;
  followUpAutomation: any;
}

export interface Conversion {
  needsAnalysis: any;
  solutionMatching: any;
  dealClosing: any;
}

export interface Onboarding {
  welcomeSequence: any;
  productTraining: any;
  supportSetup: any;
}

export interface FirstPurchase {
  purchaseGuidance: any;
  paymentSetup: any;
  orderConfirmation: any;
}

export interface Engagement {
  contentDelivery: any;
  usageTracking: any;
  feedbackCollection: any;
}

export interface ProactiveService {
  healthMonitoring: any;
  issuePrevention: any;
  valueReinforcement: any;
}

export interface EngagementOptimization {
  communicationTiming: any;
  contentPersonalization: any;
  channelOptimization: any;
}

export interface LoyaltyBuilding {
  rewardPersonalization: any;
  exclusiveBenefits: any;
  communityBuilding: any;
}

export interface CrossSelling {
  productRecommendations: any;
  bundleOffers: any;
  timingOptimization: any;
}

export interface UpSelling {
  premiumFeatures: any;
  upgradeOpportunities: any;
  valueDemonstration: any;
}

export interface ReferralProgram {
  referralTracking: any;
  incentiveManagement: any;
  socialSharing: any;
}

export interface ChurnPrediction {
  riskAssessment: any;
  earlyWarning: any;
  interventionStrategy: any;
}

export interface RetentionCampaigns {
  personalizedOffers: any;
  reEngagement: any;
  loyaltyIncentives: any;
}

export interface WinBack {
  outreachStrategy: any;
  incentiveOffers: any;
  feedbackAnalysis: any;
}

export interface SpeechRecognizer {
  id: string;
  model: string;
  capabilities: string[];
  transcribeRealtime?(audioStream: any): Promise<any>;
}

export interface SentimentAnalyzer {
  id: string;
  model: string;
  capabilities: string[];
  analyzeRealtime?(transcript: any): Promise<any>;
}

export interface IntentClassifier {
  id: string;
  model: string;
  capabilities: string[];
  classifyIntent?(transcript: any): Promise<any>;
}

export interface ResponseGenerator {
  id: string;
  model: string;
  capabilities: string[];
  generateResponse?(context: any): Promise<any>;
}

export interface RealTimeAssistance {
  transcript: any;
  sentimentScore: any;
  detectedIntent: any;
  realTimeSuggestions: RealTimeSuggestion[];
  warningAlerts: any;
  opportunityFlags: any;
}

export interface RealTimeContext {
  transcript: any;
  sentiment: any;
  detectedIntent: any;
  callContext: any;
}

export interface RealTimeSuggestion {
  type: string;
  message: string;
  suggestedPhrase: string;
  urgency: string;
}
