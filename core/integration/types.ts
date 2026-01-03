/**
 * @fileoverview 集成系统类型定义
 * @remarks 使用共享基础类型以提高类型安全性
 */

// @ts-ignore - TypeScript module resolution issue
import type { UUID, JsonObject } from '../shared-types.ts';

export interface AISystemDeployment {
  intelligentCalling: IntelligentCallingConfig;
  smartAnalytics: SmartAnalyticsConfig;
  aiEducation: AIEducationConfig;
  marketingAutomation: MarketingAutomationConfig;
  mobileAI: MobileAIConfig;
  workflowOrchestration: WorkflowOrchestration;
  dataPipeline: DataPipelineConfig;
  monitoring: MonitoringConfig;
  continuousLearning: ContinuousLearningConfig;
}

export interface IntelligentCallingConfig {
  enabled: boolean;
  features: string[];
  settings: JsonObject;
}

export interface SmartAnalyticsConfig {
  enabled: boolean;
  dashboards: Dashboard[];
  reports: Report[];
}

export interface AIEducationConfig {
  enabled: boolean;
  modules: LearningModule[];
  assessments: Assessment[];
}

export interface MarketingAutomationConfig {
  enabled: boolean;
  campaigns: Campaign[];
  automations: Automation[];
}

export interface MobileAIConfig {
  enabled: boolean;
  features: MobileFeature[];
}

export interface DataPipelineConfig {
  sources: DataSource[];
  transformations: Transformation[];
  destinations: DataDestination[];
}

export interface MonitoringConfig {
  enabled: boolean;
  metrics: Metric[];
  alerts: Alert[];
}

export interface ContinuousLearningConfig {
  enabled: boolean;
  models: ModelInfo[];
  feedback: FeedbackConfig;
}

export interface Dashboard {
  id: UUID;
  name: string;
  widgets: Widget[];
}

export interface Report {
  id: UUID;
  name: string;
  type: string;
  schedule: string;
}

export interface LearningModule {
  id: UUID;
  name: string;
  type: string;
  duration: number;
}

export interface Assessment {
  id: UUID;
  name: string;
  type: string;
  questions: Question[];
}

export interface Question {
  id: UUID;
  text: string;
  type: string;
  options?: string[];
  correctAnswer?: string | number;
}

export interface Campaign {
  id: UUID;
  name: string;
  status: string;
  startDate: Date;
  endDate: Date;
}

export interface Automation {
  id: UUID;
  name: string;
  trigger: Trigger;
  actions: Action[];
}

export interface Trigger {
  type: string;
  conditions: JsonObject;
}

export interface Action {
  type: string;
  parameters: JsonObject;
}

export interface MobileFeature {
  name: string;
  enabled: boolean;
  config: JsonObject;
}

export interface DataSource {
  id: UUID;
  name: string;
  type: string;
  connection: JsonObject;
}

export interface Transformation {
  id: UUID;
  name: string;
  type: string;
  config: JsonObject;
}

export interface DataDestination {
  id: UUID;
  name: string;
  type: string;
  connection: JsonObject;
}

export interface FeedbackConfig {
  enabled: boolean;
  channels: string[];
  frequency: string;
}

export interface WorkflowOrchestration {
  customerJourneyAI: CustomerJourneyAI;
  agentWorkflowAI: AgentWorkflowAI;
  campaignOrchestrationAI: CampaignOrchestrationAI;
  dataFlowAI: DataFlowAI;
}

export interface CustomerJourneyAI {
  enabled: boolean;
  stages: JourneyStage[];
  triggers: JourneyTrigger[];
}

export interface JourneyStage {
  id: UUID;
  name: string;
  actions: StageAction[];
}

export interface StageAction {
  type: string;
  parameters: JsonObject;
}

export interface JourneyTrigger {
  type: string;
  conditions: JsonObject;
}

export interface AgentWorkflowAI {
  enabled: boolean;
  workflows: AgentWorkflow[];
}

export interface AgentWorkflow {
  id: UUID;
  name: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id: UUID;
  name: string;
  type: string;
  config: JsonObject;
}

export interface CampaignOrchestrationAI {
  enabled: boolean;
  campaigns: OrchestratedCampaign[];
}

export interface OrchestratedCampaign {
  campaignId: UUID;
  segments: string[];
  channels: string[];
  schedule: Schedule;
}

export interface Schedule {
  startDate: Date;
  endDate: Date;
  frequency: string;
}

export interface DataFlowAI {
  enabled: boolean;
  flows: DataFlow[];
}

export interface DataFlow {
  id: UUID;
  name: string;
  source: UUID;
  destination: UUID;
  transformations: UUID[];
}

export interface EndToEndWorkflow {
  customerAcquisition: CustomerAcquisitionWorkflow;
  customerService: CustomerServiceWorkflow;
  salesConversion: SalesConversionWorkflow;
  customerRetention: CustomerRetentionWorkflow;
  dataAnalysis: DataAnalysisWorkflow;
}

export interface CustomerAcquisitionWorkflow {
  leadScoring: LeadScoringConfig;
  outreachOptimization: OutreachConfig;
  conversionPrediction: PredictionConfig;
}

export interface LeadScoringConfig {
  model: string;
  factors: Factor[];
  threshold: number;
}

export interface Factor {
  name: string;
  weight: number;
  type: string;
}

export interface OutreachConfig {
  channels: Channel[];
  templates: MessageTemplate[];
  schedule: OutreachSchedule;
}

export interface Channel {
  name: string;
  enabled: boolean;
  config: JsonObject;
}

export interface MessageTemplate {
  id: UUID;
  name: string;
  content: string;
  variables: string[];
}

export interface OutreachSchedule {
  frequency: string;
  timesOfDay: string[];
  daysOfWeek: string[];
}

export interface PredictionConfig {
  model: string;
  accuracy: number;
  confidence: number;
}

export interface CustomerServiceWorkflow {
  intelligentRouting: RoutingConfig;
  realTimeAssistance: AssistanceConfig;
  sentimentAnalysis: SentimentAnalysis;
}

export interface RoutingConfig {
  algorithm: string;
  criteria: RoutingCriteria[];
  fallback: string;
}

export interface AssistanceConfig {
  enabled: boolean;
  suggestions: boolean;
  automation: boolean;
}

export interface SentimentAnalysis {
  enabled: boolean;
  model: string;
  threshold: number;
}

export interface SalesConversionWorkflow {
  opportunityIdentification: OpportunityConfig;
  negotiationAssistance: NegotiationConfig;
  closingOptimization: ClosingConfig;
}

export interface OpportunityConfig {
  sources: string[];
  criteria: OpportunityCriteria[];
  scoring: boolean;
}

export interface OpportunityCriteria {
  field: string;
  operator: string;
  value: string | number;
}

export interface NegotiationConfig {
  enabled: boolean;
  suggestions: boolean;
  analysis: boolean;
}

export interface ClosingConfig {
  automation: boolean;
  reminders: boolean;
  templates: MessageTemplate[];
}

export interface CustomerRetentionWorkflow {
  churnPrediction: ChurnPredictionConfig;
  loyaltyOptimization: LoyaltyConfig;
  upsellingAutomation: UpsellingConfig;
}

export interface ChurnPredictionConfig {
  model: string;
  lookbackPeriod: number;
  threshold: number;
}

export interface LoyaltyConfig {
  program: string;
  tiers: LoyaltyTier[];
  rewards: Reward[];
}

export interface LoyaltyTier {
  name: string;
  threshold: number;
  benefits: string[];
}

export interface Reward {
  id: UUID;
  name: string;
  type: string;
  value: number;
}

export interface UpsellingConfig {
  enabled: boolean;
  model: string;
  products: ProductRecommendation[];
}

export interface ProductRecommendation {
  productId: UUID;
  confidence: number;
  reason: string;
}

export interface DataAnalysisWorkflow {
  realTimeDashboards: DashboardConfig[];
  predictiveModeling: ModelingConfig;
  insightGeneration: InsightConfig;
}

export interface DashboardConfig {
  id: UUID;
  name: string;
  refreshInterval: number;
  widgets: DashboardWidget[];
}

export interface DashboardWidget {
  id: UUID;
  type: string;
  dataSource: UUID;
  config: JsonObject;
}

export interface ModelingConfig {
  models: Model[];
  retraining: RetrainConfig;
}

export interface Model {
  id: UUID;
  name: string;
  type: string;
  target: string;
  features: string[];
}

export interface RetrainConfig {
  frequency: string;
  threshold: number;
  schedule: string;
}

export interface InsightConfig {
  enabled: boolean;
  algorithms: string[];
  delivery: DeliveryConfig;
}

export interface DeliveryConfig {
  channels: string[];
  frequency: string;
  format: string;
}

export interface AIConfiguration {
  callingWorkflow: CallingWorkflowConfig;
  analytics: AnalyticsConfiguration;
  education: EducationConfiguration;
}

export interface CallingWorkflowConfig {
  enabled: boolean;
  features: string[];
  settings: JsonObject;
}

export interface AnalyticsConfiguration {
  enabled: boolean;
  tracking: string[];
  reporting: string[];
}

export interface EducationConfiguration {
  enabled: boolean;
  modules: LearningModule[];
}

export interface SmartNotificationSystem {
  intelligentRouting: IntelligentRoutingConfig;
  personalization: PersonalizationConfig;
  automation: AutomationConfig;
  analytics: AnalyticsConfig;
}

export interface IntelligentRoutingConfig {
  priorityCalculation: PriorityCalculation;
  channelSelection: ChannelSelection;
  timingOptimization: TimingOptimization;
}

export interface PriorityCalculation {
  algorithm: string;
  factors: PriorityFactor[];
  weights: Record<string, number>;
}

export interface PriorityFactor {
  name: string;
  type: string;
  impact: number;
}

export interface ChannelSelection {
  strategy: string;
  preferences: ChannelPreferences;
}

export interface ChannelPreferences {
  channels: Record<string, number>;
  fallbackOrder: string[];
}

export interface TimingOptimization {
  strategy: string;
  timeZone: string;
  schedule: NotificationSchedule;
}

export interface NotificationSchedule {
  allowedHours: { start: string; end: string }[];
  timezone: string;
  frequency: string;
}

export interface PersonalizationConfig {
  contentAdaptation: ContentAdaptation;
  toneAdjustment: ToneAdjustment;
  frequencyOptimization: FrequencyOptimization;
}

export interface ContentAdaptation {
  enabled: boolean;
  rules: AdaptationRule[];
}

export interface AdaptationRule {
  condition: string;
  adaptation: string;
}

export interface ToneAdjustment {
  enabled: boolean;
  profiles: ToneProfile[];
}

export interface ToneProfile {
  name: string;
  characteristics: string[];
}

export interface FrequencyOptimization {
  enabled: boolean;
  minInterval: number;
  maxPerDay: number;
}

export interface AutomationConfig {
  triggerDefinition: TriggerDefinition;
  workflowIntegration: WorkflowIntegration;
  escalationManagement: EscalationManagement;
}

export interface TriggerDefinition {
  events: EventType[];
  conditions: TriggerCondition[];
}

export interface EventType {
  name: string;
  source: string;
}

export interface TriggerCondition {
  field: string;
  operator: string;
  value: string | number | boolean;
}

export interface WorkflowIntegration {
  enabled: boolean;
  workflows: IntegratedWorkflow[];
}

export interface IntegratedWorkflow {
  workflowId: UUID;
  triggers: string[];
  mappings: FieldMapping[];
}

export interface FieldMapping {
  source: string;
  target: string;
  transformation?: string;
}

export interface EscalationManagement {
  enabled: boolean;
  rules: EscalationRule[];
}

export interface EscalationRule {
  condition: string;
  action: string;
  timeout: number;
}

export interface AnalyticsConfig {
  engagementTracking: EngagementTracking;
  effectivenessMeasurement: EffectivenessMeasurement;
  optimizationInsights: OptimizationInsights;
}

export interface EngagementTracking {
  metrics: EngagementMetric[];
  dimensions: string[];
}

export interface EngagementMetric {
  name: string;
  type: string;
  aggregation: string;
}

export interface EffectivenessMeasurement {
  kpis: KPI[];
  benchmarks: Benchmark[];
}

export interface Benchmark {
  name: string;
  value: number;
  comparison: string;
}

export interface OptimizationInsights {
  enabled: boolean;
  algorithms: string[];
  frequency: string;
}

export interface PriorityEngine {
  calculatePriority(notification: Notification): Promise<number>;
  comparePriorities(notifications: Notification[]): Promise<Notification[]>;
}

export interface Notification {
  id: UUID;
  type: string;
  priority: number;
  content: string;
  recipient: string;
  scheduledAt: Date;
  metadata?: JsonObject;
}

export interface PersonalizationEngine {
  personalizeContent(content: string, user: User): Promise<PersonalizedContent>;
  adjustTone(content: string, context: PersonalizationContext): Promise<string>;
  optimizeFrequency(user: User): Promise<string>;
}

export interface User {
  id: UUID;
  name: string;
  preferences: UserPreferences;
  history: UserHistory;
}

export interface UserHistory {
  interactions: Interaction[];
  engagement: EngagementData;
}

export interface Interaction {
  type: string;
  timestamp: Date;
  channel: string;
  outcome: string;
}

export interface EngagementData {
  openRate: number;
  clickRate: number;
  responseRate: number;
}

export interface PersonalizedContent {
  original: string;
  personalized: string;
  adaptations: Adaptation[];
}

export interface Adaptation {
  type: string;
  description: string;
}

export interface PersonalizationContext {
  channel: string;
  timeOfDay: string;
  userState: string;
  environment: JsonObject;
}

export interface Widget {
  id: UUID;
  type: string;
  title: string;
  data: JsonObject;
}

export interface Metric {
  id: UUID;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
}

export interface Alert {
  id: UUID;
  type: string;
  severity: string;
  message: string;
  timestamp: Date;
}
