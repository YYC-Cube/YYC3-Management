/**
 * @fileoverview 统一的共享类型定义
 * @description 避免跨模块的类型冲突和重复定义，提供类型安全的基础类型
 * @author YYC³
 * @version 1.0.0
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// ================================================
// 基础类型定义
// ================================================

/**
 * UUID 类型别名
 */
export type UUID = string;

/**
 * 时间戳类型 - 支持 Date 或 ISO 字符串
 */
export type Timestamp = Date | string;

/**
 * JSON 原始类型
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * JSON 对象类型
 */
export interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * JSON 数组类型
 */
export interface JsonArray extends Array<JsonValue> {}

/**
 * JSON 任意值类型
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

// ================================================
// 实体基础接口
// ================================================

/**
 * 基础实体接口 - 所有实体的公共属性
 */
export interface Entity {
  id: UUID;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * 具名实体 - 扩展基础实体，添加名称和描述
 */
export interface NamedEntity extends Entity {
  name: string;
  description?: string;
}

// ================================================
// 优先级类型
// ================================================

/**
 * 标准优先级级别
 */
export type Priority = 'high' | 'medium' | 'low';

/**
 * 扩展优先级级别（包含critical）
 */
export type PriorityWithCritical = 'high' | 'medium' | 'low' | 'critical';

// ================================================
// 状态类型
// ================================================

/**
 * 任务或项目状态
 */
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';

/**
 * 部署状态
 */
export type DeploymentStatus = 'pending' | 'deploying' | 'deployed' | 'failed' | 'rolled_back';

/**
 * 健康状态
 */
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

// ================================================
// 学习系统类型
// ================================================

export namespace Learning {
  /**
   * 学习系统性能指标
   */
  export interface PerformanceMetric {
    responseTime: number;
    relevance: number;
    usefulness: number;
    userSatisfaction: number;
    timestamp?: Timestamp;
  }

  /**
   * 用户反馈
   */
  export interface UserFeedback {
    interactionId: UUID;
    rating: number; // 1-5
    comment?: string;
    timestamp: Timestamp;
    userId: UUID;
  }

  /**
   * 用户偏好设置
   */
  export interface UserPreferences {
    communicationStyle: 'formal' | 'casual' | 'technical';
    responseLength: 'short' | 'medium' | 'long';
    topics: string[];
    avoidTopics: string[];
  }
}

// ================================================
// 教育系统类型
// ================================================

export namespace Education {
  /**
   * 教育系统性能指标
   */
  export interface PerformanceMetric {
    name: string;
    value: number;
    target: number;
    status: 'on_track' | 'needs_attention' | 'critical';
  }
}

// ================================================
// 通用指标类型
// ================================================

/**
 * 数值指标
 */
export interface Metric {
  name: string;
  value: number;
  unit?: string;
  timestamp?: Timestamp;
}

/**
 * 目标指标
 */
export interface GoalMetric extends Metric {
  target: number;
  status: 'on_track' | 'at_risk' | 'behind';
}

// ================================================
// 数据收集类型
// ================================================

/**
 * 数据收集器接口
 */
export interface DataCollector<T = unknown> {
  collectData(): Promise<T[]>;
  processData(data: T[]): Promise<T[]>;
  validateData(data: T[]): Promise<boolean>;
}

/**
 * 特征工程接口
 */
export interface FeatureEngineer<T = unknown, U = unknown> {
  extractFeatures(data: T[]): Promise<U[]>;
  selectFeatures(features: U[]): Promise<U[]>;
  transformFeatures(features: U[]): Promise<U[]>;
}

/**
 * 模型训练器接口
 */
export interface ModelTrainer<T = unknown, U = unknown, M = unknown> {
  trainModel(features: T[], labels: U[]): Promise<M>;
  evaluateModel(model: M, testData: T[]): Promise<ModelEvaluation>;
  optimizeModel(model: M): Promise<M>;
}

/**
 * 模型评估结果
 */
export interface ModelEvaluation {
  accuracy: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  confusionMatrix?: number[][];
  timestamp: Timestamp;
}

/**
 * 性能监控器接口
 */
export interface PerformanceMonitor {
  monitorMetrics(): Promise<Record<string, number>>;
  detectAnomalies(metrics: Record<string, number>): Promise<Anomaly[]>;
  generateAlerts(anomalies: Anomaly[]): Promise<Alert[]>;
}

/**
 * 异常检测
 */
export interface Anomaly {
  id: UUID;
  metricName: string;
  severity: PriorityWithCritical;
  description: string;
  detectedAt: Timestamp;
  value: number;
  expectedRange: [number, number];
}

/**
 * 告警
 */
export interface Alert {
  id: UUID;
  anomalyId: UUID;
  severity: PriorityWithCritical;
  message: string;
  createdAt: Timestamp;
  resolved: boolean;
}

/**
 * 优化周期记录
 */
export interface OptimizationCycle {
  id: UUID;
  timestamp: Timestamp;
  dataCollected: unknown[];
  featuresExtracted: unknown[];
  modelTrained: unknown;
  performanceMetrics: Record<string, number>;
  improvements: Improvement[];
}

/**
 * 改进建议
 */
export interface Improvement {
  id: UUID;
  type: 'bug_fix' | 'enhancement' | 'optimization' | 'feature';
  description: string;
  priority: Priority;
  estimatedImpact: number;
  status: TaskStatus;
}

// ================================================
// 用户相关类型
// ================================================

/**
 * 用户基础信息
 */
export interface User {
  id: UUID;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  createdAt: Timestamp;
}

/**
 * 会话信息
 */
export interface Session {
  id: UUID;
  userId: UUID;
  startedAt: Timestamp;
  lastActivity: Timestamp;
  metadata?: JsonObject;
}

// ================================================
// API 相关类型
// ================================================

/**
 * API 响应基础接口
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: Timestamp;
}

/**
 * API 错误
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ================================================
// 事件类型
// ================================================

/**
 * 事件基础接口
 */
export interface Event {
  id: UUID;
  type: string;
  timestamp: Timestamp;
  source: string;
  data?: JsonObject;
}

/**
 * 事件处理器
 */
export type EventHandler<T extends Event = Event> = (event: T) => void | Promise<void>;

// ================================================
// 配置类型
// ================================================

/**
 * 配置基础接口
 */
export interface Config {
  version: string;
  environment: 'development' | 'staging' | 'production';
  timestamp: Timestamp;
}

/**
 * AI 模型配置
 */
export interface AIModelConfig {
  modelName: string;
  version: string;
  parameters: Record<string, JsonValue>;
  capabilities: string[];
}

// ================================================
// 审计和日志类型
// ================================================

/**
 * 审计日志
 */
export interface AuditLog {
  id: UUID;
  userId: UUID;
  action: string;
  resource: string;
  timestamp: Timestamp;
  details?: JsonObject;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * 日志级别
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * 日志条目
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Timestamp;
  context?: JsonObject;
  source?: string;
}

// ================================================
// 类型工具函数
// ================================================

/**
 * 使所有属性可选（递归）
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * 使所有属性必选（递归）
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * 提取特定键的类型
 */
export type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

/**
 * 排除特定键的类型
 */
export type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};
