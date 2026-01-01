export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferences: {
    language: string;
    timezone: string;
    preferredChannel: string;
  };
  history: {
    lastContact: Date;
    totalInteractions: number;
    satisfactionScore: number;
  };
}

export interface EngagementResult {
  voiceCall: VoiceEngagement;
  smsFollowUp: SMSFollowUp;
  emailCampaign: EmailCampaign;
  wechatEngagement: WechatEngagement;
  unifiedExperience: UnifiedExperience;
}

export interface EngagementStrategy {
  channels: string[];
  priority: 'high' | 'medium' | 'low';
  timing: {
    start: Date;
    end: Date;
    frequency: string;
  };
  content: {
    message: string;
    tone: string;
    personalization: any;
  };
}

export interface VoiceEngagement {
  optimalCallingTime: Date;
  personalizedGreeting: string;
  conversationFlow: ConversationFlow;
  realTimeAssistance: RealTimeAssistance;
  postCallActions: PostCallActions;
}

export interface ConversationFlow {
  steps: ConversationStep[];
  adaptive: boolean;
}

export interface ConversationStep {
  id: string;
  type: string;
  content: string;
  conditions?: any;
}

export interface RealTimeAssistance {
  enabled: boolean;
  suggestions: string[];
  sentimentAnalysis: boolean;
}

export interface PostCallActions {
  followUp: boolean;
  summary: boolean;
  survey: boolean;
}

export interface SMSFollowUp {
  sent: boolean;
  content: string;
  scheduled: Date;
}

export interface EmailCampaign {
  sent: boolean;
  subject: string;
  content: string;
  scheduled: Date;
}

export interface WechatEngagement {
  sent: boolean;
  content: string;
  scheduled: Date;
}

export interface UnifiedExperience {
  consistent: boolean;
  channels: string[];
  timeline: any[];
}

export interface VoiceBiometricSystem {
  speakerIdentification: {
    customerVerification: boolean;
    agentAuthentication: boolean;
    fraudDetection: boolean;
  };
  emotionRecognition: {
    realTimeSentiment: boolean;
    stressDetection: boolean;
    engagementLevel: boolean;
  };
  voiceAnalysis: {
    speakingRate: boolean;
    toneAnalysis: boolean;
    confidenceScoring: boolean;
  };
}

export interface MultiChannelCoordinator {
  coordinate(channels: string[]): Promise<any>;
  track(customerId: string): Promise<any>;
}

export interface VoiceBiometrics {
  verify(customerId: string, voiceSample: any): Promise<boolean>;
  analyze(voiceSample: any): Promise<any>;
}

export interface EmotionalAI {
  detectSentiment(audio: any): Promise<any>;
  generateResponse(sentiment: any): Promise<string>;
}