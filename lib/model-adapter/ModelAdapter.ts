/**
 * @fileoverview 模型适配器 - 统一AI模型接口
 * @description 实现"一次编码，多模型运行"的适配器模式
 * @author YYC³
 * @version 2.0.0
 * @created 2025-12-28
 * @modified 2025-12-28
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 * @pattern 适配器模式 + 工厂模式 + 策略模式
 */

'use client';

// ================================================
// 类型定义
// ================================================

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  version: string;
  capabilities: string[];
  maxTokens: number;
  supportedLanguages: string[];
}

export interface HealthStatus {
  healthy: boolean;
  latency: number;
  lastCheck: Date;
  errorRate: number;
  details?: Record<string, any>;
}

export interface CompletionRequest {
  prompt: string;
  parameters?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    stop?: string[];
  };
  context?: any;
}

export interface CompletionResponse {
  id: string;
  text: string;
  finishReason: 'stop' | 'length' | 'error';
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata: {
    modelId: string;
    processingTime: number;
    timestamp: Date;
  };
}

export interface ChatRequest {
  messages: ChatMessage[];
  parameters?: CompletionRequest['parameters'];
  context?: any;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

export interface ChatResponse extends CompletionResponse {
  message: ChatMessage;
}

export interface EmbeddingRequest {
  input: string | string[];
  model?: string;
}

export interface EmbeddingResponse {
  embeddings: number[][];
  usage: {
    totalTokens: number;
  };
  metadata: {
    modelId: string;
    dimensions: number;
    timestamp: Date;
  };
}

export interface StreamChunk {
  text: string;
  finished: boolean;
  index: number;
  metadata?: Record<string, any>;
}

export interface ChatChunk extends StreamChunk {
  delta: ChatMessage;
}

export interface ModelConfig {
  modelName: string;
  provider: string;
  apiKey?: string;
  baseURL?: string;
  maxInputLength: number;
  maxOutputLength: number;
  timeout: number;
  cacheEnabled: boolean;
  cacheConfig?: {
    ttl: number;
    maxSize: number;
  };
  warmupOnCreate?: boolean;
}

// ================================================
// 统一模型接口
// ================================================

export interface IModelAdapter {
  // ============ 模型管理 ============
  getModelInfo(): ModelInfo;
  isAvailable(): Promise<boolean>;
  healthCheck(): Promise<HealthStatus>;
  
  // ============ 核心推理 ============
  generateCompletion(request: CompletionRequest): Promise<CompletionResponse>;
  generateChatCompletion(request: ChatRequest): Promise<ChatResponse>;
  generateEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse>;
  
  // ============ 流式处理 ============
  streamCompletion(request: CompletionRequest): AsyncIterable<StreamChunk>;
  streamChat(request: ChatRequest): AsyncIterable<ChatChunk>;
  
  // ============ 批量处理 ============
  batchComplete(requests: CompletionRequest[]): Promise<CompletionResponse[]>;
  
  // ============ 模型配置 ============
  updateConfig(config: Partial<ModelConfig>): Promise<void>;
  getConfig(): ModelConfig;
  
  // ============ 性能优化 ============
  warmup(): Promise<void>;
  clearCache(): Promise<void>;
  optimizeFor(batchSize: number): Promise<void>;
}

// ================================================
// 抽象适配器基类
// ================================================

export abstract class BaseModelAdapter implements IModelAdapter {
  protected config: ModelConfig;
  protected cache: Map<string, CompletionResponse>;
  protected metrics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    totalProcessingTime: number;
    cacheHits: number;
  };
  protected lastUsed: Date;
  
  constructor(config: ModelConfig) {
    this.config = this.validateConfig(config);
    this.cache = new Map();
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalProcessingTime: 0,
      cacheHits: 0
    };
    this.lastUsed = new Date();
  }
  
  /**
   * 模板方法：标准生成流程
   */
  async generateCompletion(request: CompletionRequest): Promise<CompletionResponse> {
    const startTime = Date.now();
    this.lastUsed = new Date();
    this.metrics.totalRequests++;
    
    try {
      // 1. 验证请求
      const validated = await this.validateRequest(request);
      
      // 2. 检查缓存
      const cached = await this.checkCache(validated);
      if (cached) {
        this.metrics.cacheHits++;
        return cached;
      }
      
      // 3. 预处理
      const preprocessed = await this.preprocess(validated);
      
      // 4. 调用模型
      const rawResponse = await this.callModelAPI(preprocessed);
      
      // 5. 后处理
      const processed = await this.postprocess(rawResponse);
      
      // 6. 更新缓存
      if (this.config.cacheEnabled) {
        await this.updateCache(validated, processed);
      }
      
      // 7. 更新指标
      this.metrics.successfulRequests++;
      this.metrics.totalProcessingTime += Date.now() - startTime;
      
      return processed;
      
    } catch (error) {
      this.metrics.failedRequests++;
      throw error;
    }
  }
  
  /**
   * 流式生成实现
   */
  async *streamCompletion(request: CompletionRequest): AsyncIterable<StreamChunk> {
    const validated = await this.validateRequest(request);
    const preprocessed = await this.preprocess(validated);
    
    let index = 0;
    let buffer = '';
    
    try {
      for await (const chunk of this.callModelStream(preprocessed)) {
        const parsed = this.parseStreamChunk(chunk);
        buffer += parsed.text;
        
        yield {
          text: parsed.text,
          finished: parsed.finished,
          index: index++,
          metadata: parsed.metadata
        };
        
        if (parsed.finished) {
          break;
        }
      }
    } catch (error) {
      yield {
        text: '',
        finished: true,
        index: index++,
        metadata: { error: error instanceof Error ? error.message : String(error) }
      };
    }
  }
  
  /**
   * 聊天补全
   */
  async generateChatCompletion(request: ChatRequest): Promise<ChatResponse> {
    // 将聊天请求转换为补全请求
    const prompt = this.formatChatMessages(request.messages);
    const completionRequest: CompletionRequest = {
      prompt,
      parameters: request.parameters,
      context: request.context
    };
    
    const response = await this.generateCompletion(completionRequest);
    
    return {
      ...response,
      message: {
        role: 'assistant',
        content: response.text
      }
    };
  }
  
  /**
   * 流式聊天
   */
  async *streamChat(request: ChatRequest): AsyncIterable<ChatChunk> {
    const prompt = this.formatChatMessages(request.messages);
    const completionRequest: CompletionRequest = {
      prompt,
      parameters: request.parameters,
      context: request.context
    };
    
    for await (const chunk of this.streamCompletion(completionRequest)) {
      yield {
        ...chunk,
        delta: {
          role: 'assistant',
          content: chunk.text
        }
      };
    }
  }
  
  /**
   * 生成嵌入向量
   */
  async generateEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    // 默认实现：抛出未实现错误
    throw new Error('Embedding generation not implemented for this adapter');
  }
  
  /**
   * 批量处理
   */
  async batchComplete(requests: CompletionRequest[]): Promise<CompletionResponse[]> {
    return Promise.all(requests.map(req => this.generateCompletion(req)));
  }
  
  /**
   * 更新配置
   */
  async updateConfig(config: Partial<ModelConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * 获取配置
   */
  getConfig(): ModelConfig {
    return { ...this.config };
  }
  
  /**
   * 模型预热
   */
  async warmup(): Promise<void> {
    const warmupRequest: CompletionRequest = {
      prompt: 'Hello, world!',
      parameters: { maxTokens: 10 }
    };
    await this.generateCompletion(warmupRequest);
  }
  
  /**
   * 清除缓存
   */
  async clearCache(): Promise<void> {
    this.cache.clear();
  }
  
  /**
   * 为批量大小优化
   */
  async optimizeFor(batchSize: number): Promise<void> {
    // 默认实现：无操作
    console.log(`Optimizing for batch size: ${batchSize}`);
  }
  
  /**
   * 健康检查
   */
  async healthCheck(): Promise<HealthStatus> {
    const startTime = Date.now();
    
    try {
      await this.isAvailable();
      const latency = Date.now() - startTime;
      
      return {
        healthy: true,
        latency,
        lastCheck: new Date(),
        errorRate: this.calculateErrorRate()
      };
    } catch (error) {
      return {
        healthy: false,
        latency: Date.now() - startTime,
        lastCheck: new Date(),
        errorRate: this.calculateErrorRate(),
        details: { error: error instanceof Error ? error.message : String(error) }
      };
    }
  }
  
  /**
   * 检查可用性
   */
  async isAvailable(): Promise<boolean> {
    try {
      const health = await this.healthCheck();
      return health.healthy;
    } catch {
      return false;
    }
  }
  
  // ============ 抽象方法（由具体适配器实现）============
  
  abstract getModelInfo(): ModelInfo;
  protected abstract callModelAPI(request: any): Promise<any>;
  protected abstract callModelStream(request: any): AsyncIterable<any>;
  
  // ============ 通用实现 ============
  
  protected validateConfig(config: ModelConfig): ModelConfig {
    if (!config.modelName) {
      throw new Error('Model name is required');
    }
    if (!config.provider) {
      throw new Error('Provider is required');
    }
    return config;
  }
  
  protected async validateRequest(request: CompletionRequest): Promise<CompletionRequest> {
    if (!request.prompt?.trim()) {
      throw new Error('Prompt cannot be empty');
    }
    
    if (request.prompt.length > this.config.maxInputLength) {
      throw new Error(`Prompt too long, max length: ${this.config.maxInputLength}`);
    }
    
    return request;
  }
  
  protected async checkCache(request: CompletionRequest): Promise<CompletionResponse | null> {
    if (!this.config.cacheEnabled) {
      return null;
    }
    
    const cacheKey = this.generateCacheKey(request);
    return this.cache.get(cacheKey) || null;
  }
  
  protected async preprocess(request: CompletionRequest): Promise<any> {
    return request;
  }
  
  protected async postprocess(rawResponse: any): Promise<CompletionResponse> {
    return rawResponse;
  }
  
  protected async updateCache(request: CompletionRequest, response: CompletionResponse): Promise<void> {
    if (!this.config.cacheEnabled) {
      return;
    }
    
    const cacheKey = this.generateCacheKey(request);
    this.cache.set(cacheKey, response);
    
    // 简单的LRU：如果缓存超过限制，删除最旧的
    if (this.config.cacheConfig && this.cache.size > this.config.cacheConfig.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
  }
  
  protected generateCacheKey(request: CompletionRequest): string {
    return `${this.config.modelName}-${JSON.stringify(request)}`;
  }
  
  protected parseStreamChunk(chunk: any): { text: string; finished: boolean; metadata?: any } {
    return { text: '', finished: false };
  }
  
  protected formatChatMessages(messages: ChatMessage[]): string {
    return messages.map(m => `${m.role}: ${m.content}`).join('\n');
  }
  
  protected calculateErrorRate(): number {
    if (this.metrics.totalRequests === 0) {
      return 0;
    }
    return this.metrics.failedRequests / this.metrics.totalRequests;
  }
}

// ================================================
// 模型适配器工厂
// ================================================

export class ModelAdapterFactory {
  private static registry: Map<string, new (config: ModelConfig) => IModelAdapter> = new Map();
  
  static register(type: string, constructor: new (config: ModelConfig) => IModelAdapter): void {
    this.registry.set(type, constructor);
  }
  
  static async create(type: string, config: ModelConfig): Promise<IModelAdapter> {
    const Constructor = this.registry.get(type);
    if (!Constructor) {
      throw new Error(`Model adapter type not supported: ${type}`);
    }
    
    const adapter = new Constructor(config);
    
    // 预热（如果需要）
    if (config.warmupOnCreate) {
      await adapter.warmup();
    }
    
    return adapter;
  }
  
  static getSupportedTypes(): string[] {
    return Array.from(this.registry.keys());
  }
}
