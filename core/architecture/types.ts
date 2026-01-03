/**
 * @fileoverview 系统架构类型定义
 * @remarks 使用共享基础类型以提高类型安全性
 */

// @ts-ignore - TypeScript module resolution issue
import type { UUID, JsonObject } from '../shared-types.ts';

export interface DataHub {
  id: UUID;
  name: string;
  status: 'active' | 'inactive';
}

export interface AIOrchestrator {
  id: UUID;
  name: string;
  status: 'active' | 'inactive';
}

export interface WorkflowEngine {
  id: UUID;
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
  unifiedProfile: CustomerProfile;
  realTimeData: RealTimeData;
  behavioralAnalytics: BehavioralAnalytics;
  predictiveModeling: PredictiveModeling;
}

export interface CustomerProfile {
  customerId: UUID;
  segments: string[];
  lifetimeValue: number;
  preferences: Record<string, string | number | boolean>;
  attributes: JsonObject;
}

export interface RealTimeData {
  currentSession?: SessionData;
  recentInteractions: InteractionData[];
  liveContext: JsonObject;
}

export interface SessionData {
  sessionId: UUID;
  startTime: Date;
  activities: Activity[];
  context: JsonObject;
}

export interface InteractionData {
  type: string;
  timestamp: Date;
  channel: string;
  details: JsonObject;
}

export interface Activity {
  action: string;
  timestamp: Date;
  metadata?: JsonObject;
}

export interface BehavioralAnalytics {
  patterns: BehaviorPattern[];
  preferences: PreferenceData[];
  insights: Insight[];
}

export interface BehaviorPattern {
  id: UUID;
  patternType: string;
  frequency: number;
  confidence: number;
  lastObserved: Date;
}

export interface PreferenceData {
  category: string;
  value: string | number | boolean;
  confidence: number;
}

export interface Insight {
  id: UUID;
  type: string;
  description: string;
  confidence: number;
  timestamp: Date;
}

export interface PredictiveModeling {
  models: ModelInfo[];
  predictions: Prediction[];
  accuracy: number;
}

export interface ModelInfo {
  name: string;
  version: string;
  type: string;
  accuracy: number;
  lastTrained: Date;
}

export interface Prediction {
  id: UUID;
  modelId: UUID;
  predictionType: string;
  result: JsonObject;
  confidence: number;
  timestamp: Date;
}

export interface OperationalData {
  callData: CallDataMetrics;
  performanceMetrics: PerformanceData;
  businessIntelligence: BusinessIntelligence;
}

export interface CallDataMetrics {
  totalCalls: number;
  averageDuration: number;
  successRate: number;
  peakHours: string[];
}

export interface PerformanceData {
  responseTime: number;
  throughput: number;
  errorRate: number;
  capacity: number;
}

export interface BusinessIntelligence {
  reports: Report[];
  dashboards: Dashboard[];
  kpis: KPI[];
}

export interface Report {
  id: UUID;
  name: string;
  type: string;
  generatedAt: Date;
  data: JsonObject;
}

export interface Dashboard {
  id: UUID;
  name: string;
  widgets: Widget[];
  lastUpdated: Date;
}

export interface Widget {
  id: UUID;
  type: string;
  title: string;
  data: JsonObject;
}

export interface KPI {
  id: UUID;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface ExternalData {
  marketData: MarketData;
  socialData: SocialData;
  competitiveData: CompetitiveData;
}

export interface MarketData {
  trends: MarketTrend[];
  opportunities: Opportunity[];
  threats: Threat[];
}

export interface MarketTrend {
  name: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  dateIdentified: Date;
}

export interface Opportunity {
  id: UUID;
  title: string;
  description: string;
  potentialValue: number;
  probability: number;
}

export interface Threat {
  id: UUID;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  likelihood: number;
}

export interface SocialData {
  mentions: SocialMention[];
  sentiment: SentimentData;
  engagement: EngagementMetrics;
}

export interface SocialMention {
  id: UUID;
  platform: string;
  content: string;
  timestamp: Date;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface SentimentData {
  overall: number;
  positive: number;
  neutral: number;
  negative: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface EngagementMetrics {
  likes: number;
  shares: number;
  comments: number;
  reach: number;
}

export interface CompetitiveData {
  competitors: Competitor[];
  marketPosition: MarketPosition;
  comparativeAnalysis: ComparativeAnalysis;
}

export interface Competitor {
  id: UUID;
  name: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
}

export interface MarketPosition {
  rank: number;
  share: number;
  growth: number;
}

export interface ComparativeAnalysis {
  metrics: ComparativeMetric[];
  advantages: string[];
  disadvantages: string[];
}

export interface ComparativeMetric {
  name: string;
  ourValue: number;
  competitorAverage: number;
  difference: number;
}

export interface AICapabilities {
  conversationalAI: ConversationalAI;
  predictiveAI: PredictiveAI;
  operationalAI: OperationalAI;
}

export interface ConversationalAI {
  voiceAI: VoiceAIConfig;
  nlpEngine: NLPEngineConfig;
  sentimentAnalysis: SentimentAnalysisConfig;
  intentRecognition: IntentRecognitionConfig;
}

export interface VoiceAIConfig {
  enabled: boolean;
  languages: string[];
  accuracy: number;
}

export interface NLPEngineConfig {
  model: string;
  version: string;
  languages: string[];
  capabilities: string[];
}

export interface SentimentAnalysisConfig {
  enabled: boolean;
  accuracy: number;
  granularity: 'document' | 'sentence' | 'aspect';
}

export interface IntentRecognitionConfig {
  enabled: boolean;
  model: string;
  accuracy: number;
  supportedIntents: string[];
}

export interface PredictiveAI {
  leadScoring: LeadScoringConfig;
  churnPrediction: ChurnPredictionConfig;
  recommendationEngine: RecommendationEngineConfig;
  forecasting: ForecastingConfig;
}

export interface LeadScoringConfig {
  enabled: boolean;
  model: string;
  accuracy: number;
  factors: string[];
}

export interface ChurnPredictionConfig {
  enabled: boolean;
  model: string;
  lookbackPeriod: number;
  threshold: number;
}

export interface RecommendationEngineConfig {
  enabled: boolean;
  algorithm: string;
  minConfidence: number;
  maxRecommendations: number;
}

export interface ForecastingConfig {
  enabled: boolean;
  models: ForecastModel[];
  horizon: number;
  accuracy: number;
}

export interface ForecastModel {
  name: string;
  type: string;
  accuracy: number;
}

export interface OperationalAI {
  routingOptimization: RoutingConfig;
  workloadBalancing: WorkloadConfig;
  qualityMonitoring: QualityMonitoringConfig;
  performanceCoaching: PerformanceCoachingConfig;
}

export interface RoutingConfig {
  enabled: boolean;
  algorithm: string;
  criteria: RoutingCriteria[];
}

export interface RoutingCriteria {
  name: string;
  weight: number;
  type: string;
}

export interface WorkloadConfig {
  enabled: boolean;
  algorithm: string;
  maxUtilization: number;
}

export interface QualityMonitoringConfig {
  enabled: boolean;
  metrics: string[];
  thresholds: Record<string, number>;
}

export interface PerformanceCoachingConfig {
  enabled: boolean;
  realtime: boolean;
  feedbackFrequency: number;
}

export interface ApplicationLayer {
  customerEngagement: EngagementApps;
  businessIntelligence: BIApps;
  operationalExcellence: OperationalApps;
}

export interface EngagementApps {
  enabled: boolean;
  apps: Application[];
}

export interface BIApps {
  enabled: boolean;
  apps: Application[];
}

export interface OperationalApps {
  enabled: boolean;
  apps: Application[];
}

export interface Application {
  id: UUID;
  name: string;
  type: string;
  status: 'active' | 'inactive';
  config: JsonObject;
}

export interface IntegrationLayer {
  apiGateway: APIGatewayConfig;
  eventBus: EventBusConfig;
  messageQueue: MessageQueueConfig;
}

export interface APIGatewayConfig {
  enabled: boolean;
  version: string;
  endpoints: Endpoint[];
}

export interface Endpoint {
  id: UUID;
  path: string;
  method: string;
  authenticated: boolean;
  rateLimit: number;
}

export interface EventBusConfig {
  enabled: boolean;
  provider: string;
  topics: string[];
}

export interface MessageQueueConfig {
  enabled: boolean;
  provider: string;
  queues: Queue[];
}

export interface Queue {
  name: string;
  maxSize: number;
  retention: number;
}

export interface GovernanceLayer {
  security: SecurityConfig;
  compliance: ComplianceConfig;
  monitoring: MonitoringConfig;
}

export interface SecurityConfig {
  authentication: AuthConfig;
  authorization: AuthzConfig;
  encryption: EncryptionConfig;
}

export interface AuthConfig {
  method: string;
  providers: string[];
  mfaEnabled: boolean;
}

export interface AuthzConfig {
  model: string;
  roles: Role[];
}

export interface Role {
  name: string;
  permissions: string[];
}

export interface EncryptionConfig {
  atRest: boolean;
  inTransit: boolean;
  algorithm: string;
}

export interface ComplianceConfig {
  frameworks: string[];
  controls: Control[];
}

export interface Control {
  id: UUID;
  framework: string;
  requirement: string;
  status: 'compliant' | 'non_compliant' | 'partial';
}

export interface MonitoringConfig {
  logging: LoggingConfig;
  metrics: MetricsConfig;
  alerts: AlertsConfig;
}

export interface LoggingConfig {
  level: string;
  retention: number;
  destinations: LogDestination[];
}

export interface LogDestination {
  type: string;
  config: JsonObject;
}

export interface MetricsConfig {
  enabled: boolean;
  collectors: string[];
  interval: number;
}

export interface AlertsConfig {
  enabled: boolean;
  channels: AlertChannel[];
}

export interface AlertChannel {
  type: string;
  config: JsonObject;
}
