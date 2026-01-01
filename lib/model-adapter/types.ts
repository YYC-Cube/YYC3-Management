/**
 * @fileoverview AI模型适配器类型定义
 * @description 统一的AI模型接口和类型定义
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-09
 * @modified 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// ====================================
// 模型提供商
// ====================================

export enum ModelProvider {
  BAIDU = 'baidu',           // 百度文心一言
  ALIBABA = 'alibaba',       // 阿里通义千问
  ZHIPU = 'zhipu',          // 智谱GLM
  OLLAMA = 'ollama',        // Ollama本地模型
  LM_STUDIO = 'lm_studio',  // LM Studio
  OPENAI = 'openai',        // OpenAI (兼容)
  ANTHROPIC = 'anthropic',  // Anthropic (兼容)
  CUSTOM = 'custom'         // 自定义
}

// ====================================
// 模型能力
// ====================================

export enum ModelCapability {
  TEXT_GENERATION = 'text_generation',
  TEXT_CHAT = 'text_chat',
  IMAGE_UNDERSTANDING = 'image_understanding',
  IMAGE_GENERATION = 'image_generation',
  CODE_GENERATION = 'code_generation',
  EMBEDDING = 'embedding',
  FUNCTION_CALLING = 'function_calling',
  STREAMING = 'streaming'
}

// ====================================
// 消息类型
// ====================================

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string | MessageContent[];
  name?: string;
  function_call?: FunctionCall;
}

export interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
    detail?: 'low' | 'high' | 'auto';
  };
}

export interface FunctionCall {
  name: string;
  arguments: string;
}

// ====================================
// 模型配置
// ====================================

export interface ModelConfig {
  provider: ModelProvider;
  modelId: string;
  apiKey?: string;
  baseURL?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  stop?: string[];
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

// ====================================
// 聊天请求/响应
// ====================================

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  stop?: string[];
  stream?: boolean;
  functions?: FunctionDefinition[];
  function_call?: 'none' | 'auto' | { name: string };
  user?: string;
  metadata?: Record<string, unknown>;
}

export interface ChatResponse {
  id: string;
  model: string;
  created: number;
  choices: ChatChoice[];
  usage: TokenUsage;
  metadata?: Record<string, unknown>;
}

export interface ChatChoice {
  index: number;
  message: ChatMessage;
  finish_reason: 'stop' | 'length' | 'function_call' | 'content_filter' | null;
  delta?: Partial<ChatMessage>;
}

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// ====================================
// 函数调用
// ====================================

export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, FunctionParameter>;
    required?: string[];
  };
}

export interface FunctionParameter {
  type: string;
  description: string;
  enum?: string[];
  items?: FunctionParameter;
  properties?: Record<string, FunctionParameter>;
}

// ====================================
// 流式响应
// ====================================

export interface StreamChunk {
  id: string;
  model: string;
  created: number;
  choices: {
    index: number;
    delta: Partial<ChatMessage>;
    finish_reason: string | null;
  }[];
}

export type StreamCallback = (chunk: StreamChunk) => void;

// ====================================
// 模型信息
// ====================================

export interface ModelInfo {
  id: string;
  name: string;
  provider: ModelProvider;
  capabilities: ModelCapability[];
  maxTokens: number;
  costPer1kTokens: {
    input: number;
    output: number;
  };
  status: 'online' | 'offline' | 'maintenance';
  version?: string;
  description?: string;
  tags?: string[];
}

// ====================================
// 适配器接口
// ====================================

export interface IModelAdapter {
  provider: ModelProvider;
  config: ModelConfig;
  
  // 基础方法
  chat(request: ChatRequest): Promise<ChatResponse>;
  chatStream(request: ChatRequest, callback: StreamCallback): Promise<void>;
  
  // 工具方法
  getModelInfo(): Promise<ModelInfo>;
  validateConfig(): boolean;
  estimateTokens(text: string): number;
}

// 类型别名以兼容新架构
export type LegacyModelAdapter = IModelAdapter;

// ====================================
// 错误类型
// ====================================

export class ModelAdapterError extends Error {
  constructor(
    message: string,
    public provider: ModelProvider,
    public code: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ModelAdapterError';
  }
}
