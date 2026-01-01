export interface DataHub {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface AIOrchestrator {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface WorkflowEngine {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface Ecosystem {
  dataFoundation: DataFoundation;
  aiCapabilities: AICapabilities;
  applicationLayer: ApplicationLayer;
  integrationLayer: IntegrationLayer;
  governanceLayer: GovernanceLayer;
}

export interface DataFoundation {
  customerDataPlatform: CustomerDataPlatform;
  operationalData: OperationalData;
  externalData: ExternalData;
}

export interface CustomerDataPlatform {
  unifiedProfile: any;
  realTimeData: any;
  behavioralAnalytics: any;
  predictiveModeling: any;
}

export interface OperationalData {
  callData: any;
  performanceMetrics: any;
  businessIntelligence: any;
}

export interface ExternalData {
  marketData: any;
  socialData: any;
  competitiveData: any;
}

export interface AICapabilities {
  conversationalAI: ConversationalAI;
  predictiveAI: PredictiveAI;
  operationalAI: OperationalAI;
}

export interface ConversationalAI {
  voiceAI: any;
  nlpEngine: any;
  sentimentAnalysis: any;
  intentRecognition: any;
}

export interface PredictiveAI {
  leadScoring: any;
  churnPrediction: any;
  recommendationEngine: any;
  forecasting: any;
}

export interface OperationalAI {
  routingOptimization: any;
  workloadBalancing: any;
  qualityMonitoring: any;
  performanceCoaching: any;
}

export interface ApplicationLayer {
  customerEngagement: any;
  businessIntelligence: any;
  operationalExcellence: any;
}

export interface IntegrationLayer {
  apiGateway: any;
  eventBus: any;
  messageQueue: any;
}

export interface GovernanceLayer {
  security: any;
  compliance: any;
  monitoring: any;
}
