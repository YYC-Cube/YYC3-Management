/**
 * @fileoverview AI工具类型定义
 * @remarks 使用共享基础类型以提高类型安全性
 */

// @ts-ignore - TypeScript module resolution issue
import type { UUID, Timestamp, JsonObject, JsonValue } from '../shared-types.ts';

/**
 * AI工具参数
 */
export interface ToolParameters {
  type: string;
  properties: Record<string, ToolProperty>;
  required: string[];
}

/**
 * 工具属性定义
 */
export interface ToolProperty {
  type: string;
  description: string;
  default?: JsonValue;
  enum?: string[];
}

/**
 * AI工具接口
 */
export interface AITool<T extends JsonValue = JsonValue> {
  name: string;
  description: string;
  category?: string;
  parameters: ToolParameters;
  execute: (params: T) => Promise<ToolResult>;
}

/**
 * 工具执行结果
 */
export interface ToolResult<TData = unknown, TInsights = unknown, TDocument = unknown> {
  success: boolean;
  data?: TData;
  insights?: TInsights;
  document?: TDocument;
  error?: string;
}

/**
 * AI上下文信息
 */
export interface AIContext {
  query?: string;
  intent?: string;
  entities?: Record<string, AIEntity>;
  conversationHistory?: ConversationMessage[];
  userPreferences?: JsonObject;
  currentTask?: string;
  metadata?: JsonObject;
}

/**
 * AI实体
 */
export interface AIEntity {
  type: string;
  value: string;
  confidence: number;
  metadata?: JsonObject;
}

/**
 * 对话消息
 */
export interface ConversationMessage {
  id: UUID;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Timestamp;
  metadata?: JsonObject;
}

/**
 * 工具使用记录
 */
export interface ToolUsageRecord {
  toolName: string;
  timestamp: Timestamp;
  parameters: JsonValue;
  result: ToolResult;
  executionTime: number;
}

/**
 * 工具相关性评分
 */
export interface ToolRelevanceScore {
  toolName: string;
  score: number;
  reasons: string[];
}
