/**
 * InsightsDashboard 组件类型定义
 * 
 * 提供数据洞察仪表板的完整类型系统：
 * - 部件（Widget）定义和配置
 * - 数据源连接和查询
 * - 可视化配置
 * - 趋势分析和异常检测
 * - 智能洞察生成
 * 
 * @module InsightsDashboard/Types
 */

// ================================================
// 部件定义
// ================================================

/**
 * 仪表板部件
 */
export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  position: WidgetPosition;
  size: WidgetSize;
  config: WidgetConfig;
  dataSource?: DataSourceConfig;
  refreshInterval?: number;
  visible?: boolean;
  locked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type WidgetType =
  | 'chart'
  | 'table'
  | 'metric'
  | 'gauge'
  | 'map'
  | 'timeline'
  | 'funnel'
  | 'heatmap'
  | 'text'
  | 'custom';

export interface WidgetPosition {
  x: number;
  y: number;
  z?: number;
}

export interface WidgetSize {
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface WidgetConfig {
  visualization?: VisualizationConfig;
  interaction?: InteractionConfig;
  styling?: StylingConfig;
  advanced?: Record<string, unknown>;
}

// ================================================
// 可视化配置
// ================================================

export interface VisualizationConfig {
  chartType?: ChartType;
  axes?: AxesConfig;
  series?: SeriesConfig[];
  legend?: LegendConfig;
  tooltip?: TooltipConfig;
  colors?: ColorConfig;
  animation?: AnimationConfig;
}

export type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'scatter'
  | 'area'
  | 'radar'
  | 'candlestick'
  | 'treemap'
  | 'sankey';

export interface AxesConfig {
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  secondaryYAxis?: AxisConfig;
}

export interface AxisConfig {
  label?: string;
  type?: 'category' | 'value' | 'time' | 'log';
  scale?: 'linear' | 'log' | 'sqrt' | 'pow';
  min?: number | 'auto';
  max?: number | 'auto';
  format?: string;
  gridLines?: boolean;
}

export interface SeriesConfig {
  name: string;
  dataKey: string;
  type?: ChartType;
  yAxisIndex?: 0 | 1;
  color?: string;
  lineStyle?: LineStyle;
  areaStyle?: AreaStyle;
  itemStyle?: ItemStyle;
}

export interface LineStyle {
  width?: number;
  type?: 'solid' | 'dashed' | 'dotted';
  opacity?: number;
}

export interface AreaStyle {
  opacity?: number;
  gradient?: boolean;
}

export interface ItemStyle {
  borderWidth?: number;
  borderColor?: string;
  shadowBlur?: number;
}

export interface LegendConfig {
  show?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  orient?: 'horizontal' | 'vertical';
}

export interface TooltipConfig {
  show?: boolean;
  trigger?: 'item' | 'axis' | 'none';
  formatter?: string | ((params: unknown) => string);
}

export interface ColorConfig {
  scheme?: ColorScheme;
  custom?: string[];
}

export type ColorScheme =
  | 'default'
  | 'pastel'
  | 'vibrant'
  | 'monochrome'
  | 'categorical';

export interface AnimationConfig {
  enabled?: boolean;
  duration?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

// ================================================
// 交互配置
// ================================================

export interface InteractionConfig {
  zoomable?: boolean;
  pannable?: boolean;
  selectable?: boolean;
  drilldown?: DrilldownConfig;
  filters?: FilterConfig[];
  crossFiltering?: boolean;
}

export interface DrilldownConfig {
  enabled: boolean;
  levels: DrilldownLevel[];
}

export interface DrilldownLevel {
  dimension: string;
  targetWidgetId?: string;
  targetView?: string;
}

export interface FilterConfig {
  field: string;
  operator: FilterOperator;
  value: unknown;
  editable?: boolean;
}

export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'contains'
  | 'starts_with'
  | 'ends_with'
  | 'in'
  | 'between';

// ================================================
// 样式配置
// ================================================

export interface StylingConfig {
  theme?: 'light' | 'dark' | 'auto';
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  font?: FontConfig;
  customCss?: string;
}

export interface FontConfig {
  family?: string;
  size?: number;
  weight?: 'normal' | 'bold' | 'bolder' | 'lighter';
  color?: string;
}

// ================================================
// 数据源
// ================================================

export interface DataSourceConfig {
  id: string;
  type: DataSourceType;
  connection: ConnectionConfig;
  query: QueryConfig;
  transform?: TransformConfig;
  cache?: CacheConfig;
}

export type DataSourceType =
  | 'api'
  | 'database'
  | 'file'
  | 'realtime'
  | 'static';

export interface ConnectionConfig {
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  auth?: AuthConfig;
  timeout?: number;
  retryPolicy?: RetryPolicy;
}

export interface AuthConfig {
  type: 'none' | 'basic' | 'bearer' | 'api-key' | 'oauth2';
  credentials?: Record<string, string>;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoff: 'fixed' | 'exponential' | 'linear';
  baseDelay: number;
}

export interface QueryConfig {
  raw?: string;
  params?: Record<string, unknown>;
  pagination?: PaginationConfig;
}

export interface PaginationConfig {
  enabled: boolean;
  page?: number;
  pageSize?: number;
  totalKey?: string;
}

export interface TransformConfig {
  operations: TransformOperation[];
}

export interface TransformOperation {
  type: 'map' | 'filter' | 'aggregate' | 'sort' | 'join';
  config: Record<string, unknown>;
}

export interface CacheConfig {
  enabled: boolean;
  ttl?: number;
  strategy?: 'memory' | 'disk' | 'distributed';
}

// ================================================
// 趋势分析
// ================================================

export interface TrendAnalysis {
  widgetId: string;
  period: TimePeriod;
  metrics: TrendMetric[];
  insights: TrendInsight[];
  predictions?: Prediction[];
}

export interface TimePeriod {
  start: Date;
  end: Date;
  granularity: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
}

export interface TrendMetric {
  name: string;
  values: DataPoint[];
  statistics: Statistics;
  trend: TrendDirection;
  significance: number;
}

export interface DataPoint {
  timestamp: Date;
  value: number;
  metadata?: Record<string, unknown>;
}

export interface Statistics {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  percentiles?: Record<number, number>;
}

export type TrendDirection = 'increasing' | 'decreasing' | 'stable' | 'volatile';

export interface TrendInsight {
  type: 'trend' | 'spike' | 'dip' | 'pattern' | 'correlation';
  description: string;
  confidence: number;
  importance: 'high' | 'medium' | 'low';
  affectedMetrics: string[];
  timeRange?: TimePeriod;
}

export interface Prediction {
  metric: string;
  timestamp: Date;
  predictedValue: number;
  confidence: number;
  confidenceInterval: [number, number];
  method: 'linear' | 'exponential' | 'arima' | 'ml';
}

// ================================================
// 异常检测
// ================================================

export interface AnomalyDetection {
  widgetId: string;
  anomalies: Anomaly[];
  threshold: AnomalyThreshold;
  detectionMethod: DetectionMethod;
}

export interface Anomaly {
  id: string;
  timestamp: Date;
  metric: string;
  value: number;
  expectedValue: number;
  deviation: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: AnomalyType;
  description?: string;
  relatedAnomalies?: string[];
}

export type AnomalyType =
  | 'spike'
  | 'dip'
  | 'trend_change'
  | 'missing_data'
  | 'outlier'
  | 'pattern_break';

export interface AnomalyThreshold {
  method: 'static' | 'dynamic' | 'statistical';
  value?: number;
  sigma?: number;
  percentile?: number;
}

export type DetectionMethod =
  | 'threshold'
  | 'zscore'
  | 'iqr'
  | 'isolation_forest'
  | 'lstm';

// ================================================
// 智能洞察
// ================================================

export interface SmartInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  confidence: number;
  importance: 'critical' | 'high' | 'medium' | 'low';
  category: InsightCategory;
  affectedWidgets: string[];
  recommendations?: Recommendation[];
  generatedAt: Date;
  metadata?: Record<string, unknown>;
}

export type InsightType =
  | 'trend'
  | 'anomaly'
  | 'correlation'
  | 'forecast'
  | 'opportunity'
  | 'risk';

export type InsightCategory =
  | 'performance'
  | 'quality'
  | 'efficiency'
  | 'cost'
  | 'user_behavior'
  | 'business_impact';

export interface Recommendation {
  action: string;
  description: string;
  expectedImpact: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
}

// ================================================
// 仪表板配置
// ================================================

export interface DashboardConfig {
  // 功能开关
  enableAutoRefresh?: boolean;
  enableRealtime?: boolean;
  enableExport?: boolean;
  enableSharing?: boolean;
  enableCollaboration?: boolean;
  
  // 数据配置
  defaultRefreshInterval?: number;
  maxDataPoints?: number;
  dataCacheEnabled?: boolean;
  
  // 分析配置
  enableTrendAnalysis?: boolean;
  enableAnomalyDetection?: boolean;
  enableSmartInsights?: boolean;
  
  // UI配置
  layout?: DashboardLayout;
  theme?: 'light' | 'dark' | 'auto';
  responsive?: boolean;
  gridSize?: number;
  
  // 性能配置
  lazyLoading?: boolean;
  virtualScrolling?: boolean;
  maxConcurrentQueries?: number;
}

export interface DashboardLayout {
  type: 'grid' | 'flex' | 'custom';
  columns?: number;
  rowHeight?: number;
  gap?: number;
  sections?: LayoutSection[];
}

export interface LayoutSection {
  id: string;
  title?: string;
  widgets: string[];
  collapsed?: boolean;
}

// ================================================
// 事件类型
// ================================================

export type DashboardEvent =
  | WidgetAddedEvent
  | WidgetRemovedEvent
  | WidgetUpdatedEvent
  | DataRefreshedEvent
  | InsightGeneratedEvent
  | AnomalyDetectedEvent;

export interface WidgetAddedEvent {
  type: 'widget:added';
  widgetId: string;
  widget: DashboardWidget;
  timestamp: Date;
}

export interface WidgetRemovedEvent {
  type: 'widget:removed';
  widgetId: string;
  timestamp: Date;
}

export interface WidgetUpdatedEvent {
  type: 'widget:updated';
  widgetId: string;
  changes: Partial<DashboardWidget>;
  timestamp: Date;
}

export interface DataRefreshedEvent {
  type: 'data:refreshed';
  widgetId: string;
  dataPoints: number;
  duration: number;
  timestamp: Date;
}

export interface InsightGeneratedEvent {
  type: 'insight:generated';
  insight: SmartInsight;
  timestamp: Date;
}

export interface AnomalyDetectedEvent {
  type: 'anomaly:detected';
  anomaly: Anomaly;
  timestamp: Date;
}

// ================================================
// 操作结果
// ================================================

export interface OperationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, unknown>;
}
