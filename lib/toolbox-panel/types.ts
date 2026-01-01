/**
 * ToolboxPanel 组件类型定义
 * 
 * 提供工具箱面板的完整类型系统：
 * - 工具定义和配置
 * - 工具执行和结果
 * - 工具分类和搜索
 * - 工具推荐系统
 * - 使用统计和学习
 * 
 * @module ToolboxPanel/Types
 */

import type { MetricsConfig } from '../ai-components/types';
import type { ValidationResult } from '../ai-components/types';
import type { ChatMessage } from '../chat-interface/types';

/**
 * 工具统计信息
 */
export interface ToolStats {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  lastExecuted: number;
  usageCount: number;
}


// ================================================
// 工具定义
// ================================================

/**
 * 工具元数据
 */
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon?: string;
  version: string;
  author?: string;
  tags: string[];
  
  // 功能配置
  inputs: ToolParameter[];
  outputs: ToolParameter[];
  
  // 执行配置
  executor: ToolExecutor;
  timeout?: number;
  retryable?: boolean;
  maxRetries?: number;
  
  // 权限和限制
  requiresAuth?: boolean;
  permissions?: string[];
  rateLimit?: RateLimitConfig;
  
  // UI 配置
  ui?: ToolUIConfig;
  
  // 元数据
  createdAt?: Date;
  updatedAt?: Date;
  deprecated?: boolean;
  replacedBy?: string;
  enabled?: boolean;
}

/**
 * 工具类别
 */
export type ToolCategory =
  | 'data-processing'
  | 'ai-assistant'
  | 'automation'
  | 'analysis'
  | 'visualization'
  | 'integration'
  | 'utility'
  | 'custom';

/**
 * 工具参数定义
 */
export interface ToolParameter {
  name: string;
  type: ParameterType;
  description: string;
  required?: boolean;
  default?: any;
  validation?: ValidationRule;
  options?: ParameterOption[];
}

export type ParameterType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'file'
  | 'date'
  | 'enum';

export interface ValidationRule {
  min?: number;
  max?: number;
  pattern?: string | RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ParameterOption {
  label: string;
  value: any;
  description?: string;
}

/**
 * 工具执行器
 */
export interface ToolExecutor {
  type: 'function' | 'api' | 'workflow' | 'plugin';
  handler: ToolHandler;
  config?: Record<string, any>;
}

export type ToolHandler = (
  inputs: Record<string, any>,
  context: ToolExecutionContext
) => Promise<ToolExecutionResult>;

/**
 * 速率限制配置
 */
export interface RateLimitConfig {
  maxCalls: number;
  windowMs: number;
  message?: string;
}

/**
 * 工具 UI 配置
 */
export interface ToolUIConfig {
  layout?: 'form' | 'wizard' | 'custom';
  width?: number;
  height?: number;
  resizable?: boolean;
  draggable?: boolean;
  customComponent?: string;
}

// ================================================
// 工具执行
// ================================================

/**
 * 工具执行上下文
 */
export interface ToolExecutionContext {
  userId: string;
  sessionId: string;
  executionId: string;
  timestamp: Date;
  environment: 'development' | 'staging' | 'production';
  metadata?: Record<string, any>;
}

/**
 * 工具执行结果
 */
export interface ToolExecutionResult {
  success: boolean;
  data?: any;
  error?: ToolError;
  metadata?: ExecutionMetadata;
  logs?: LogEntry[];
}

export interface ToolError {
  code: string;
  message: string;
  details?: any;
  recoverable?: boolean;
  retryAfter?: number;
}

export interface ExecutionMetadata {
  duration: number;
  resourceUsage?: ResourceUsage;
  warnings?: string[];
  suggestions?: string[];
}

export interface ResourceUsage {
  cpu?: number;
  memory?: number;
  network?: number;
  storage?: number;
}

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  timestamp: Date;
  message: string;
  data?: any;
}

// ================================================
// 工具搜索和发现
// ================================================

/**
 * 工具搜索选项
 */
export interface ToolSearchOptions {
  query?: string;
  categories?: ToolCategory[];
  tags?: string[];
  sortBy?: 'relevance' | 'popularity' | 'recent' | 'name';
  limit?: number;
  offset?: number;
}

/**
 * 工具搜索结果
 */
export interface ToolSearchResult {
  tool: Tool;
  score: number;
  matchedFields: string[];
  highlights?: Record<string, string>;
}

// ================================================
// 工具推荐
// ================================================

/**
 * 工具推荐请求
 */
export interface ToolRecommendationRequest {
  userId: string;
  context?: RecommendationContext;
  limit?: number;
  includeReasons?: boolean;
}

export interface RecommendationContext {
  currentTask?: string;
  recentTools?: string[];
  userPreferences?: UserPreferences;
  workflowContext?: WorkflowContext;
}

export interface UserPreferences {
  favoriteCategories?: ToolCategory[];
  frequentlyUsed?: string[];
  ratings?: Record<string, number>;
  customSettings?: Record<string, any>;
}

export interface WorkflowContext {
  workflowId?: string;
  currentStep?: string;
  previousTools?: string[];
  expectedOutputs?: string[];
}

/**
 * 工具推荐结果
 */
export interface ToolRecommendation {
  tool: Tool;
  confidence: number;
  reasons: RecommendationReason[];
  suggestedInputs?: Record<string, any>;
}

export interface RecommendationReason {
  type: 'usage-pattern' | 'context-match' | 'collaborative-filtering' | 'content-based';
  score: number;
  explanation: string;
}

// ================================================
// 工具链
// ================================================

/**
 * 工具链定义
 */
export interface ToolChain {
  id: string;
  name: string;
  description: string;
  steps: ToolChainStep[];
  metadata?: Record<string, any>;
}

export interface ToolChainStep {
  toolId: string;
  inputs: Record<string, any>;
  outputMapping?: Record<string, string>;
  condition?: ToolChainCondition;
  retryPolicy?: RetryPolicy;
}

export interface ToolChainCondition {
  type: 'always' | 'if' | 'unless';
  expression?: string;
  dependsOn?: string[];
}

// 与ai-components/types.ts中的RetryPolicy保持一致
export interface RetryPolicy {
  maxAttempts: number;
  backoffMultiplier: number;
  initialDelay: number;
  maxDelay: number;
}

/**
 * 工具链执行结果
 */
export interface ToolChainExecutionResult {
  chainId: string;
  success: boolean;
  steps: StepExecutionResult[];
  totalDuration: number;
  error?: ToolError;
}

export interface StepExecutionResult {
  stepIndex: number;
  toolId: string;
  success: boolean;
  result?: ToolExecutionResult;
  duration: number;
  skipped?: boolean;
  skipReason?: string;
}

// ================================================
// 工具统计和分析
// ================================================

/**
 * 工具使用统计
 */
export interface ToolUsageStats {
  toolId: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageDuration: number;
  lastUsed?: Date;
  popularInputs?: Record<string, any>;
  commonErrors?: ErrorStats[];
}

export interface ErrorStats {
  errorCode: string;
  count: number;
  lastOccurred: Date;
  affectedUsers?: number;
}

/**
 * 工具性能指标
 */
export interface ToolPerformanceMetrics {
  toolId: string;
  period: TimePeriod;
  executionCount: number;
  averageLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  errorRate: number;
  throughput: number;
}

export interface TimePeriod {
  start: Date;
  end: Date;
  granularity: 'minute' | 'hour' | 'day' | 'week' | 'month';
}

// 面板布局配置
export interface PanelLayout {
  type: 'default' | 'custom';
  columns?: number;
  rows?: number;
  spacing?: number;
  overflow?: 'auto' | 'hidden' | 'scroll';
}

// UI配置
export interface UIConfig {
  theme?: 'light' | 'dark' | 'auto';
  layout?: 'compact' | 'comfortable' | 'expanded';
  fontSize?: 'small' | 'medium' | 'large';
  showTooltips?: boolean;
  enableAnimations?: boolean;
  iconSize?: 'small' | 'medium' | 'large';
  colorScheme?: string;
}

// ================================================
// 工具箱配置
// ================================================

/**
 * 工具箱配置
 */
export interface ToolboxConfig {
  // 基本配置
  id?: string;
  enabled?: boolean;
  autoStart?: boolean;
  dependencies?: string[];
  priority?: number;
  timeout?: number;
  retryPolicy?: RetryPolicy;
  metrics?: MetricsConfig;
  
  // 功能开关
  enableRecommendations?: boolean;
  enableToolChains?: boolean;
  enableStatistics?: boolean;
  enableRateLimiting?: boolean;
  
  // 布局配置
  layout?: ToolboxLayout;
  displayMode?: 'grid' | 'list' | 'compact';
  itemsPerPage?: number;
  maxTools?: number;
  cacheEnabled?: boolean;
  defaultLayout?: PanelLayout;
  responsive?: boolean;
  
  // 搜索配置
  searchEngine?: 'simple' | 'fuzzy' | 'semantic';
  searchDebounce?: number;
  
  // 执行配置
  defaultTimeout?: number;
  executionTimeout?: number;
  maxConcurrentExecutions?: number;
  executionQueue?: QueueConfig;
  
  // 推荐配置
  recommendationAlgorithm?: 'collaborative' | 'content' | 'hybrid';
  maxRecommendations?: number;
  recommendationUpdateInterval?: number;
  
  // UI配置
  ui?: UIConfig;
  
  // 持久化
  persistence?: {
    enabled: boolean;
    storage: 'localStorage' | 'indexedDB' | 'remote';
    syncInterval?: number;
  };
}

export interface ToolboxLayout {
  showCategories?: boolean;
  showSearch?: boolean;
  showFavorites?: boolean;
  showRecent?: boolean;
  customSections?: LayoutSection[];
}

export interface LayoutSection {
  id: string;
  title: string;
  position: number;
  collapsed?: boolean;
  filter?: (tool: Tool) => boolean;
}

export interface QueueConfig {
  strategy: 'fifo' | 'lifo' | 'priority';
  maxSize?: number;
  timeout?: number;
}

// ================================================
// 事件类型
// ================================================

/**
 * 工具箱事件
 */
export type ToolboxEvent =
  | ToolRegisteredEvent
  | ToolExecutedEvent
  | ToolErrorEvent
  | ToolChainExecutedEvent
  | RecommendationGeneratedEvent;

export interface ToolRegisteredEvent {
  type: 'tool:registered';
  toolId: string;
  timestamp: Date;
}

export interface ToolExecutedEvent {
  type: 'tool:executed';
  toolId: string;
  executionId: string;
  success: boolean;
  duration: number;
  timestamp: Date;
}

export interface ToolErrorEvent {
  type: 'tool:error';
  toolId: string;
  executionId: string;
  error: ToolError;
  timestamp: Date;
}

export interface ToolChainExecutedEvent {
  type: 'toolchain:executed';
  chainId: string;
  success: boolean;
  stepsCompleted: number;
  totalSteps: number;
  timestamp: Date;
}

export interface RecommendationGeneratedEvent {
  type: 'recommendation:generated';
  userId: string;
  recommendations: ToolRecommendation[];
  timestamp: Date;
}

// ================================================
// 操作结果
// ================================================

export interface OperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}

export interface ToolRegistrationResult {
  success: boolean;
  toolId?: string;
  error?: string;
  errors?: string[];
  warnings?: string[];
}
