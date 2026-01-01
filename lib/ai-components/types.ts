/**
 * @fileoverview AI Components 通用类型定义
 * @description YYC³ AI浮窗系统8大核心组件的统一类型定义
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-28
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// ============================================
// 通用类型
// ============================================

export type ComponentStatus = 'idle' | 'initializing' | 'ready' | 'running' | 'paused' | 'error' | 'destroyed';

export interface ComponentMetrics {
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  errorRate: number;
  uptime: number;
  requestCount: number;
}

export interface ComponentConfig {
  id: string;
  name: string;
  enabled: boolean;
  autoStart: boolean;
  dependencies: string[];
  priority: number;
  timeout: number;
  retryPolicy: RetryPolicy;
  metrics: MetricsConfig;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffMultiplier: number;
  initialDelay: number;
  maxDelay: number;
}

export interface MetricsConfig {
  enabled: boolean;
  interval: number;
  retention: number;
}

// ============================================
// 事件系统类型
// ============================================

export interface ComponentEvent<T = any> {
  id: string;
  type: string;
  source: string;
  timestamp: number;
  data: T;
  metadata?: Record<string, any>;
  channel?: string;
}

export interface EventListener<T = any> {
  (event: ComponentEvent<T>): void | Promise<void>;
}

export interface Subscription {
  unsubscribe: () => void;
}

// ============================================
// ChatInterface 类型
// ============================================

export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'file' | 'code' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type MessageSender = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  sessionId: string;
  type: MessageType;
  content: string;
  sender: MessageSender;
  status: MessageStatus;
  timestamp: number;
  metadata?: {
    edited?: boolean;
    editedAt?: number;
    replyTo?: string;
    mentions?: string[];
    attachments?: Attachment[];
  };
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
}

export interface ChatSession {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
  unreadCount: number;
  metadata?: Record<string, any>;
}

// ============================================
// ToolboxPanel 类型
// ============================================

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  version: string;
  tags: string[];
  parameters: ToolParameter[];
  execute: (params: any) => Promise<any>;
  validate?: (params: any) => ValidationResult;
}

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  default?: any;
  description?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: any[];
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ToolExecutionResult {
  success: boolean;
  data?: any;
  error?: Error;
  metrics: {
    startTime: number;
    endTime: number;
    duration: number;
  };
}

// ============================================
// InsightsDashboard 类型
// ============================================

export interface DataSource {
  id: string;
  type: 'rest' | 'websocket' | 'graphql' | 'database';
  endpoint: string;
  authentication?: {
    type: 'bearer' | 'basic' | 'apikey';
    credentials: Record<string, string>;
  };
  refreshInterval?: number;
}

export interface WidgetDefinition {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'map' | 'custom';
  title: string;
  dataSource: string;
  config: WidgetConfig;
  position: WidgetPosition;
  size: WidgetSize;
}

export interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'pie' | 'scatter' | 'area';
  metrics?: string[];
  dimensions?: string[];
  filters?: Filter[];
  aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
  timeframe?: Timeframe;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetSize {
  width: number;
  height: number;
}

export interface Filter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
  value: any;
}

export interface Timeframe {
  start: number | string;
  end: number | string;
  granularity?: 'minute' | 'hour' | 'day' | 'week' | 'month';
}

// ============================================
// WorkflowDesigner 类型
// ============================================

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  variables: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface WorkflowNode {
  id: string;
  type: 'start' | 'end' | 'action' | 'condition' | 'loop' | 'parallel' | 'custom';
  label: string;
  position: { x: number; y: number };
  config: Record<string, any>;
  inputs: NodePort[];
  outputs: NodePort[];
}

export interface NodePort {
  id: string;
  name: string;
  type: string;
  required: boolean;
}

export interface WorkflowConnection {
  id: string;
  source: { nodeId: string; portId: string };
  target: { nodeId: string; portId: string };
  condition?: string;
  metadata?: Record<string, any>;
}

export interface ExecutionResult {
  success: boolean;
  startTime: number;
  endTime: number;
  duration: number;
  output?: any;
  error?: Error;
  trace: ExecutionTrace[];
}

export interface ExecutionTrace {
  nodeId: string;
  timestamp: number;
  input: any;
  output: any;
  status: 'success' | 'error' | 'skipped';
}

// ============================================
// KnowledgeBase 类型
// ============================================

export interface KnowledgeSource {
  id: string;
  type: 'document' | 'url' | 'api' | 'database' | 'stream';
  location: string;
  format?: 'text' | 'markdown' | 'html' | 'pdf' | 'json';
  metadata?: Record<string, any>;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  embedding?: number[];
  metadata: {
    source: string;
    createdAt: number;
    updatedAt: number;
    tags: string[];
    category: string;
    author?: string;
    [key: string]: any;
  };
}

export interface RetrievalQuery {
  text: string;
  filters?: Filter[];
  limit?: number;
  threshold?: number;
  strategy?: 'vector' | 'keyword' | 'hybrid';
}

export interface RetrievalResult {
  documents: KnowledgeDocument[];
  scores: number[];
  totalCount: number;
  query: string;
  strategy: string;
}

// ============================================
// AIActionsManager 类型
// ============================================

export interface ActionDecision {
  action: Action;
  confidence: number;
  reasoning: string;
  alternatives: Action[];
  ethicsCheck: EthicsCheckResult;
}

export interface Action {
  id: string;
  type: string;
  parameters: Record<string, any>;
  priority: number;
  timeout?: number;
}

export interface EthicsCheckResult {
  approved: boolean;
  concerns: string[];
  recommendations: string[];
}

export interface DecisionContext {
  currentState: Record<string, any>;
  userIntent: string;
  history: Action[];
  constraints: Constraint[];
}

export interface Constraint {
  type: 'resource' | 'time' | 'permission' | 'safety';
  value: any;
  priority: number;
}

// ============================================
// StreamProcessor 类型
// ============================================

export interface DataStream<T = any> {
  id: string;
  source: string;
  type: 'events' | 'metrics' | 'logs' | 'realtime';
  format: string;
  schema?: Record<string, any>;
  subscribe: (handler: StreamHandler<T>) => Subscription;
}

export interface StreamHandler<T = any> {
  (data: T): void | Promise<void>;
}

export interface ProcessedStream<T = any> {
  id: string;
  sourceStream: string;
  data: T[];
  metadata: {
    processedCount: number;
    errorCount: number;
    startTime: number;
    endTime: number;
  };
}

export interface StreamWindow {
  type: 'tumbling' | 'sliding' | 'session';
  size: number;
  slide?: number;
  timeout?: number;
}

// ============================================
// ContextManager 类型
// ============================================

export interface Context {
  id: string;
  type: 'conversation' | 'task' | 'session' | 'global';
  data: Record<string, any>;
  metadata: {
    createdAt: number;
    updatedAt: number;
    accessCount: number;
    importance: number;
    ttl?: number;
  };
}

export interface ContextQuery {
  types?: string[];
  timeRange?: { start: number; end: number };
  filters?: Filter[];
  limit?: number;
  sortBy?: 'relevance' | 'time' | 'importance';
}

export interface Memory {
  shortTerm: Context[];
  longTerm: Context[];
  working: Context[];
  episodic: Context[];
}

// ============================================
// 导出所有类型
// ============================================

// 所有接口已在定义时导出
