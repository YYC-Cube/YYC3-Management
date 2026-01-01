export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  profile?: any;
}

export interface Campaign {
  id: string;
  name: string;
  objective: string;
  targetAudience: string[];
  script?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface CallOrchestrator {
  id: string;
  status: string;
  metadata?: any;
}

export interface RealTimeAI {
  id: string;
  model: string;
  capabilities: string[];
}

export interface CustomerInsights {
  profile: any;
  behavior: any;
  sentiment: any;
  value: any;
}

export interface CallStrategy {
  optimalTiming: any;
  conversationStrategy: any;
  objectionHandling: any;
  goalAlignment: any;
}

export interface Readiness {
  systemCheck: any;
  agentPreparation: any;
  complianceVerification: any;
}

export interface CallPreparation {
  customerInsights: CustomerInsights;
  strategy: CallStrategy;
  readiness: Readiness;
}

export interface RealTimeAIAssistance {
  speechToText: any;
  sentimentAnalysis: any;
  intentRecognition: any;
  nextBestAction: any;
}

export interface AgentAssistance {
  scriptGuidance: any;
  knowledgeSupport: any;
  emotionCoaching: any;
}

export interface QualityAssurance {
  complianceMonitoring: any;
  qualityScoring: any;
  interventionTriggers: any;
}

export interface CallExecution {
  realTimeAI: RealTimeAIAssistance;
  agentAssistance: AgentAssistance;
  qualityAssurance: QualityAssurance;
}

export interface PostCallProcessing {
  callSummary: any;
  customerFeedback: any;
  outcomeAnalysis: any;
  nextActions: any;
}

export interface Optimization {
  insights: any;
  recommendations: any;
  performanceMetrics: any;
  learningData: any;
}

export interface BusinessOutcome {
  revenue: number;
  conversion: number;
  satisfaction: number;
  efficiency: number;
}

export interface CallingResult {
  preparation: CallPreparation;
  execution: CallExecution;
  postCall: PostCallProcessing;
  optimization: Optimization;
  businessOutcome: BusinessOutcome;
}
