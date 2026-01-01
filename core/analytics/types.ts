export interface PredictiveModel {
  modelId: string;
  version: string;
  accuracy: number;
  lastTrained: Date;
}

export interface AnomalyDetector {
  threshold: number;
  sensitivity: 'low' | 'medium' | 'high';
}

export interface InsightGenerator {
  enabled: boolean;
  confidenceThreshold: number;
}

export interface BusinessIntelligence {
  predictions: PredictionResult[];
  anomalies: Anomaly[];
  insights: AnalyticsInsight[];
  recommendations: OptimizationRecommendation[];
  visualization: AIVisualization;
}

export interface ProcessedData {
  customerData: CustomerData;
  campaignData: CampaignData;
  operationalData: OperationalData;
  marketData: MarketData;
}

export interface CustomerData {
  profiles: any[];
  behaviors: any[];
  transactions: any[];
}

export interface CampaignData {
  campaigns: any[];
  performance: any[];
  engagement: any[];
}

export interface OperationalData {
  metrics: any[];
  efficiency: any[];
  quality: any[];
}

export interface MarketData {
  trends: any[];
  competitors: any[];
  opportunities: any[];
}

export interface PredictionResult {
  metric: string;
  predicted: number;
  confidence: number;
  timeframe: string;
}

export interface Anomaly {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  description: string;
  value: number;
  expected: number;
  deviation: number;
}

export interface AnalyticsInsight {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  actionable: boolean;
  recommendations: string[];
  metrics: {
    current: number;
    target: number;
    gap: number;
  };
}

export interface OptimizationRecommendation {
  id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description: string;
  expectedImpact: {
    metric: string;
    improvement: number;
    timeframe: string;
  };
  effort: 'low' | 'medium' | 'high';
  dependencies: string[];
}

export interface AIVisualization {
  charts: ChartConfig[];
  dashboards: DashboardConfig[];
  reports: ReportConfig[];
}

export interface ChartConfig {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap';
  title: string;
  data: any[];
  options: any;
}

export interface DashboardConfig {
  id: string;
  title: string;
  layout: any[];
  widgets: WidgetConfig[];
}

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  data: any;
  options: any;
}

export interface ReportConfig {
  id: string;
  title: string;
  sections: ReportSection[];
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
  };
}

export interface ReportSection {
  title: string;
  content: string;
  charts: ChartConfig[];
}

export interface RecommendationEngine {
  enabled: boolean;
  confidenceThreshold: number;
}

export interface ScenarioSimulator {
  enabled: boolean;
  iterations: number;
}

export interface IntelligentRecommendations {
  strategicRecommendations: StrategicRecommendations;
  operationalRecommendations: OperationalRecommendations;
  tacticalRecommendations: TacticalRecommendations;
  predictiveRecommendations: PredictiveRecommendations;
}

export interface StrategicRecommendations {
  marketStrategy: StrategyRecommendation;
  productStrategy: StrategyRecommendation;
  pricingStrategy: StrategyRecommendation;
}

export interface OperationalRecommendations {
  processOptimization: ProcessRecommendation;
  resourceAllocation: ResourceRecommendation;
  qualityImprovement: QualityRecommendation;
}

export interface TacticalRecommendations {
  campaignOptimization: CampaignRecommendation;
  customerEngagement: EngagementRecommendation;
  salesEffectiveness: SalesRecommendation;
}

export interface PredictiveRecommendations {
  riskMitigation: RiskRecommendation;
  opportunityPursuit: OpportunityRecommendation;
  investmentAllocation: InvestmentRecommendation;
}

export interface StrategyRecommendation {
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  expectedImpact: string;
  timeframe: string;
  actions: string[];
}

export interface ProcessRecommendation {
  priority: 'low' | 'medium' | 'high';
  description: string;
  currentEfficiency: number;
  targetEfficiency: number;
  actions: string[];
}

export interface ResourceRecommendation {
  priority: 'low' | 'medium' | 'high';
  description: string;
  resources: {
    type: string;
    current: number;
    recommended: number;
    reason: string;
  }[];
}

export interface QualityRecommendation {
  priority: 'low' | 'medium' | 'high';
  description: string;
  currentQuality: number;
  targetQuality: number;
  actions: string[];
}

export interface CampaignRecommendation {
  priority: 'low' | 'medium' | 'high';
  description: string;
  expectedROI: number;
  actions: string[];
}

export interface EngagementRecommendation {
  priority: 'low' | 'medium' | 'high';
  description: string;
  currentEngagement: number;
  targetEngagement: number;
  actions: string[];
}

export interface SalesRecommendation {
  priority: 'low' | 'medium' | 'high';
  description: string;
  expectedIncrease: number;
  actions: string[];
}

export interface RiskRecommendation {
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  probability: number;
  impact: string;
  mitigationActions: string[];
}

export interface OpportunityRecommendation {
  priority: 'low' | 'medium' | 'high';
  description: string;
  potentialValue: number;
  timeframe: string;
  actions: string[];
}

export interface InvestmentRecommendation {
  priority: 'low' | 'medium' | 'high';
  description: string;
  amount: number;
  expectedReturn: number;
  timeframe: string;
  risk: 'low' | 'medium' | 'high';
}

export interface ScenarioAnalysis {
  bestCaseScenario: Scenario;
  worstCaseScenario: Scenario;
  mostLikelyScenario: Scenario;
}

export interface Scenario {
  assumptions: ScenarioAssumption[];
  outcomes: ScenarioOutcome[];
  actionPlan?: ActionPlan;
  contingencyPlan?: ContingencyPlan;
}

export interface ScenarioAssumption {
  variable: string;
  value: number;
  description: string;
  confidence: number;
}

export interface ScenarioOutcome {
  metric: string;
  value: number;
  change: number;
  confidence: number;
}

export interface ActionPlan {
  steps: ActionStep[];
  timeline: string;
  resources: string[];
  risks: string[];
}

export interface ActionStep {
  id: string;
  description: string;
  owner: string;
  deadline: Date;
  dependencies: string[];
}

export interface ContingencyPlan {
  triggers: string[];
  actions: ActionStep[];
  timeline: string;
}

export interface OutlierDetector {
  method: 'zscore' | 'iqr' | 'isolation' | 'local';
  threshold: number;
}

export interface PatternAnalyzer {
  windowSize: number;
  sensitivity: number;
}

export interface AlertManager {
  enabled: boolean;
  channels: string[];
  thresholds: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface AnomalyMonitoring {
  monitoring: {
    realTime: boolean;
    multiDimensional: boolean;
    adaptiveThresholds: boolean;
  };
  detection: {
    statisticalOutliers: boolean;
    patternDeviations: boolean;
    trendAnomalies: boolean;
  };
  response: {
    automatedAlerts: boolean;
    rootCauseAnalysis: boolean;
    correctiveActions: boolean;
  };
}

export interface AnomalyReport {
  timestamp: Date;
  anomalies: DetectedAnomaly[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: BusinessImpact;
  recommendations: string[];
  escalation: EscalationPath;
}

export interface DetectedAnomaly {
  id: string;
  type: string;
  metric: string;
  value: number;
  expected: number;
  deviation: number;
  timestamp: Date;
}

export interface BusinessImpact {
  financial: number;
  operational: number;
  reputational: number;
  customer: number;
}

export interface EscalationPath {
  level: 'team' | 'manager' | 'director' | 'executive';
  recipients: string[];
  timeframe: string;
}

export interface DataUnifier {
  sources: string[];
  transformations: string[];
}

export interface InsightGenerator2 {
  enabled: boolean;
  confidenceThreshold: number;
}

export interface UnifiedAnalytics {
  customer: CustomerAnalytics;
  operational: OperationalAnalytics;
  marketing: MarketingAnalytics;
  business: BusinessAnalytics;
}

export interface CustomerAnalytics {
  segmentation: SegmentationResult;
  lifetimeValue: LTVResult;
  behaviorPatterns: BehaviorPattern[];
  predictiveScores: PredictiveScore[];
}

export interface SegmentationResult {
  segments: CustomerSegment[];
  accuracy: number;
  lastUpdated: Date;
}

export interface CustomerSegment {
  id: string;
  name: string;
  size: number;
  characteristics: string[];
  value: number;
}

export interface LTVResult {
  averageLTV: number;
  segmentLTV: {
    segment: string;
    ltv: number;
  }[];
  confidence: number;
}

export interface BehaviorPattern {
  id: string;
  pattern: string;
  frequency: number;
  impact: number;
}

export interface PredictiveScore {
  customerId: string;
  score: number;
  category: string;
  confidence: number;
}

export interface OperationalAnalytics {
  efficiency: EfficiencyMetrics;
  resourceAllocation: ResourceAllocation;
  serviceQuality: QualityMetrics;
  costEffectiveness: CostMetrics;
}

export interface EfficiencyMetrics {
  overall: number;
  byProcess: {
    process: string;
    efficiency: number;
  }[];
}

export interface ResourceAllocation {
  utilization: number;
  byResource: {
    type: string;
    used: number;
    available: number;
    utilization: number;
  }[];
}

export interface QualityMetrics {
  overall: number;
  byMetric: {
    metric: string;
    score: number;
    target: number;
  }[];
}

export interface CostMetrics {
  totalCost: number;
  costPerUnit: number;
  savings: number;
  opportunities: CostSavingOpportunity[];
}

export interface CostSavingOpportunity {
  area: string;
  potentialSaving: number;
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
}

export interface MarketingAnalytics {
  campaignPerformance: CampaignPerformance[];
  channelEffectiveness: ChannelEffectiveness[];
  marketingROI: number;
  attribution: AttributionResult[];
}

export interface CampaignPerformance {
  campaignId: string;
  name: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  revenue: number;
  roi: number;
}

export interface ChannelEffectiveness {
  channel: string;
  reach: number;
  engagement: number;
  conversion: number;
  cost: number;
  roi: number;
}

export interface AttributionResult {
  touchpoint: string;
  contribution: number;
  value: number;
}

export interface BusinessAnalytics {
  demandForecast: DemandForecast;
  revenueProjection: RevenueProjection;
  marketShare: MarketShare;
  competitivePosition: CompetitivePosition;
}

export interface DemandForecast {
  period: string;
  forecast: number;
  confidence: number;
  factors: string[];
}

export interface RevenueProjection {
  period: string;
  projected: number;
  confidence: number;
  growthRate: number;
}

export interface MarketShare {
  current: number;
  projected: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface CompetitivePosition {
  rank: number;
  score: number;
  strengths: string[];
  weaknesses: string[];
}

// PredictiveAnalytics types
export interface TimeSeriesForecaster {
  model: string;
  accuracy: number;
}

export interface PatternRecognizer {
  enabled: boolean;
  sensitivity: number;
}

export interface BusinessForecast {
  sales: SalesForecast;
  customer: CustomerForecast;
  operations: OperationsForecast;
  risks: RiskAssessment;
}

export interface SalesForecast {
  revenue: number;
  volume: number;
  seasonality: SeasonalityPattern[];
}

export interface SeasonalityPattern {
  period: string;
  factor: number;
  confidence: number;
}

export interface CustomerForecast {
  acquisition: number;
  retention: number;
  churn: number;
}

export interface OperationsForecast {
  callVolume: number;
  staffing: number;
  efficiency: number;
}

export interface RiskAssessment {
  marketRisks: Risk[];
  operationalRisks: Risk[];
  financialRisks: Risk[];
}

export interface Risk {
  type: string;
  probability: number;
  impact: string;
  mitigation: string[];
}

export interface ScenarioPlanning {
  scenarioGeneration: ScenarioGeneration;
  impactAnalysis: ImpactAnalysis;
  contingencyPlanning: ContingencyPlanning;
}

export interface ScenarioGeneration {
  bestCase: ScenarioDefinition;
  worstCase: ScenarioDefinition;
  mostLikely: ScenarioDefinition;
}

export interface ScenarioDefinition {
  assumptions: ScenarioAssumption[];
  timeframe: string;
  confidence: number;
}

export interface ImpactAnalysis {
  financialImpact: boolean;
  operationalImpact: boolean;
  strategicImpact: boolean;
}

export interface ContingencyPlanning {
  riskMitigation: boolean;
  opportunityCapture: boolean;
  adaptiveStrategies: boolean;
}

// RealTimeAIDashboard types
export interface DataStream {
  getRealTimeData(): Promise<any>;
}

export interface AlertEngine {
  enabled: boolean;
  thresholds: any;
}

export interface KPITracker {
  metrics: any[];
}

export interface AIDashboard {
  kpiOverview: KPIOverview;
  realTimeMonitoring: RealTimeMonitoring;
  predictions: PredictionWidgets;
  intelligentAlerts: AlertDashboard;
  optimizationSuggestions: SuggestionWidgets;
}

export interface KPIOverview {
  revenue: RevenueKPI;
  conversion: ConversionKPI;
  customerSatisfaction: SatisfactionKPI;
  operationalEfficiency: EfficiencyKPI;
}

export interface RevenueKPI {
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  prediction: number;
}

export interface ConversionKPI {
  rate: number;
  trend: 'up' | 'down' | 'stable';
  breakdown: any[];
  optimization: string[];
}

export interface SatisfactionKPI {
  score: number;
  trend: 'up' | 'down' | 'stable';
  drivers: string[];
  improvement: string[];
}

export interface EfficiencyKPI {
  callsPerHour: number;
  averageHandleTime: number;
  firstCallResolution: number;
}

export interface RealTimeMonitoring {
  activeCalls: number;
  queueLength: number;
  agentStatus: any[];
  systemHealth: any;
}

export interface PredictionWidgets {
  demand: any[];
  churn: any[];
  revenue: any[];
}

export interface AlertDashboard {
  critical: any[];
  warning: any[];
  info: any[];
}

export interface SuggestionWidgets {
  immediate: any[];
  shortTerm: any[];
  longTerm: any[];
}

export interface AIMetrics {
  revenue: {
    current: number;
    target: number;
  };
  conversion: {
    rate: number;
    trend: 'up' | 'down' | 'stable';
  };
  satisfaction: {
    score: number;
    trend: 'up' | 'down' | 'stable';
  };
  efficiency: {
    callsPerHour: number;
    averageHandleTime: number;
    firstCallResolution: number;
  };
}

export interface RealTimeDashboard {
  executiveOverview: ExecutiveOverview;
  operationalMonitor: OperationalMonitor;
  customerInsights: CustomerInsights;
  predictiveAnalytics: PredictiveAnalytics2;
}

export interface ExecutiveOverview {
  kpiSummary: any[];
  performanceTrends: any[];
  alertSummary: any[];
}

export interface OperationalMonitor {
  callCenter: any;
  workforce: any;
  quality: any;
}

export interface CustomerInsights {
  sentiment: any;
  journey: any;
  feedback: any;
}

export interface PredictiveAnalytics2 {
  demand: any;
  churn: any;
  revenue: any;
}
