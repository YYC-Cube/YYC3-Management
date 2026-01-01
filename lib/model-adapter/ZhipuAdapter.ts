/**
 * @fileoverview 智谱GLM模型适配器
 * @description 智谱AI GLM系列模型的统一适配实现（新架构）
 * @author YYC³
 * @version 2.0.0
 * @created 2025-12-09
 * @modified 2025-12-28
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

'use client';

import {
  BaseModelAdapter,
  type ModelConfig,
  type CompletionRequest,
  type CompletionResponse,
  type ChatRequest,
  type ChatResponse,
  type ChatMessage,
  type EmbeddingRequest,
  type EmbeddingResponse,
  type StreamChunk,
  type ChatChunk,
  type ModelInfo,
  type HealthStatus
} from './ModelAdapter';
import {
  ModelProvider,
  ModelAdapterError
} from './types';

/**
 * 智谱AI模型适配器（新架构）
 */
export class ZhipuAdapter extends BaseModelAdapter {
  private baseURL: string;
  private apiKey: string;
  private modelId: string;

  constructor(config: ModelConfig) {
    super(config);
    this.baseURL = config.baseURL || 'https://open.bigmodel.cn/api/paas/v4';
    this.apiKey = config.apiKey || process.env.ZHIPU_API_KEY || '';
    this.modelId = config.modelName;
  }

  /**
   * 验证配置
   */
  protected validateConfig(config: ModelConfig): ModelConfig {
    if (!config.apiKey && !process.env.ZHIPU_API_KEY) {
      throw new Error('Zhipu API key is required');
    }
    if (!config.modelName) {
      throw new Error('Model name is required');
    }
    return config;
  }

  /**
   * 获取模型信息
   */
  getModelInfo(): ModelInfo {
    const modelMap: Record<string, Partial<ModelInfo>> = {
      'glm-4-flash': {
        name: 'GLM-4-Flash',
        maxTokens: 128000,
        capabilities: ['text-chat', 'text-generation', 'function-calling', 'streaming']
      },
      'glm-4-plus': {
        name: 'GLM-4-Plus',
        maxTokens: 128000,
        capabilities: ['text-chat', 'text-generation', 'image-understanding', 'function-calling', 'streaming']
      },
      'glm-4v': {
        name: 'GLM-4V',
        maxTokens: 8192,
        capabilities: ['text-chat', 'image-understanding', 'streaming']
      }
    };

    const modelData = modelMap[this.modelId] || {};

    return {
      id: this.modelId,
      name: modelData.name || this.modelId,
      provider: 'Zhipu',
      version: '1.0',
      capabilities: modelData.capabilities || ['text-chat'],
      maxTokens: modelData.maxTokens || 8192,
      supportedLanguages: ['zh', 'en']
    };
  }

  /**
   * 检查模型是否可用
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<HealthStatus> {
    const startTime = Date.now();
    try {
      const available = await this.isAvailable();
      return {
        healthy: available,
        latency: Date.now() - startTime,
        lastCheck: new Date(),
        errorRate: this.metrics.failedRequests / (this.metrics.totalRequests || 1)
      };
    } catch (error) {
      return {
        healthy: false,
        latency: Date.now() - startTime,
        lastCheck: new Date(),
        errorRate: 1,
        details: { error: (error as Error).message }
      };
    }
  }

  /**
   * 生成聊天补全
   */
  async generateChatCompletion(request: ChatRequest): Promise<ChatResponse> {
    const completionRequest: CompletionRequest = {
      prompt: this.formatChatMessages(request.messages),
      parameters: request.parameters
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
   * 生成嵌入
   */
  async generateEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const inputs = Array.isArray(request.input) ? request.input : [request.input];

    try {
      const response = await fetch(`${this.baseURL}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.modelId,
          input: inputs
        }),
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(JSON.stringify(error));
      }

      const data = await response.json();

      return {
        embeddings: data.data.map((item: any) => item.embedding),
        usage: {
          totalTokens: data.usage?.total_tokens || 0
        },
        metadata: {
          modelId: this.modelId,
          dimensions: data.data?.[0]?.embedding?.length || 0,
          timestamp: new Date()
        }
      };
    } catch (error) {
      throw new ModelAdapterError(
        (error as Error).message || 'Embedding generation failed',
        ModelProvider.ZHIPU,
        'EMBEDDING_FAILED',
        undefined,
        error
      );
    }
  }

  /**
   * 流式聊天
   */
  async *streamChat(request: ChatRequest): AsyncIterable<ChatChunk> {
    const completionRequest: CompletionRequest = {
      prompt: this.formatChatMessages(request.messages),
      parameters: request.parameters
    };

    let index = 0;
    for await (const chunk of this.streamCompletion(completionRequest)) {
      yield {
        ...chunk,
        delta: {
          role: 'assistant',
          content: chunk.text
        }
      };
      index++;
    }
  }

  /**
   * 批量完成
   */
  async batchComplete(requests: CompletionRequest[]): Promise<CompletionResponse[]> {
    return Promise.all(requests.map(req => this.generateCompletion(req)));
  }

  /**
   * 更新配置
   */
  async updateConfig(config: Partial<ModelConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
    if (config.apiKey) {
      this.apiKey = config.apiKey;
    }
    if (config.baseURL) {
      this.baseURL = config.baseURL;
    }
    if (config.modelName) {
      this.modelId = config.modelName;
    }
  }

  /**
   * 获取配置
   */
  getConfig(): ModelConfig {
    return { ...this.config };
  }

  /**
   * 预热
   */
  async warmup(): Promise<void> {
    try {
      await this.generateCompletion({
        prompt: 'Hello',
        parameters: { maxTokens: 10 }
      });
    } catch (error) {
      console.warn('Zhipu adapter warmup failed:', error);
    }
  }

  /**
   * 清理缓存
   */
  async clearCache(): Promise<void> {
    this.cache.clear();
  }

  /**
   * 优化
   */
  async optimizeFor(batchSize: number): Promise<void> {
    console.log(`Optimizing Zhipu adapter for batch size: ${batchSize}`);
  }

  /**
   * 调用模型API
   */
  protected async callModelAPI(request: CompletionRequest): Promise<any> {
    let lastError: Error | null = null;
    const retryAttempts = 3;

    for (let i = 0; i < retryAttempts; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: this.modelId,
            messages: this.parseMessages(request.prompt),
            temperature: request.parameters?.temperature ?? 0.7,
            max_tokens: request.parameters?.maxTokens ?? 1000,
            top_p: request.parameters?.topP ?? 0.9
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await response.json().catch(() => ({ error: response.statusText }));
          throw new Error(JSON.stringify(error));
        }

        return await response.json();
      } catch (error) {
        lastError = error as Error;
        if (i < retryAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    throw lastError;
  }

  /**
   * 调用模型流式API
   */
  protected async *callModelStream(request: CompletionRequest): AsyncIterable<any> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.modelId,
        messages: this.parseMessages(request.prompt),
        temperature: request.parameters?.temperature ?? 0.7,
        max_tokens: request.parameters?.maxTokens ?? 1000,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`Stream error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }

            try {
              yield JSON.parse(data);
            } catch (e) {
              console.error('Failed to parse chunk:', e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * 后处理响应
   */
  protected async postprocess(rawResponse: any): Promise<CompletionResponse> {
    const choice = rawResponse.choices?.[0];

    return {
      id: rawResponse.id || `zhipu-${Date.now()}`,
      text: choice?.message?.content || choice?.text || '',
      finishReason: choice?.finish_reason === 'stop' ? 'stop' : 'length',
      usage: {
        promptTokens: rawResponse.usage?.prompt_tokens || 0,
        completionTokens: rawResponse.usage?.completion_tokens || 0,
        totalTokens: rawResponse.usage?.total_tokens || 0
      },
      metadata: {
        modelId: rawResponse.model || this.modelId,
        processingTime: 0,
        timestamp: new Date()
      }
    };
  }

  /**
   * 解析流式数据块
   */
  protected parseStreamChunk(chunk: any): { text: string; finished: boolean; metadata?: any } {
    if (!chunk.choices || chunk.choices.length === 0) {
      return { text: '', finished: false };
    }

    const choice = chunk.choices[0];
    const content = choice.delta?.content || choice.text || '';
    const finished = choice.finish_reason !== null && choice.finish_reason !== undefined;

    return {
      text: content,
      finished,
      metadata: { finishReason: choice.finish_reason }
    };
  }

  /**
   * 格式化聊天消息为提示词
   */
  protected formatChatMessages(messages: ChatMessage[]): string {
    return messages
      .map(msg => `${msg.role}: ${typeof msg.content === 'string' ? msg.content : '[multimodal content]'}`)
      .join('\n');
  }

  /**
   * 解析提示词为消息格式
   */
  private parseMessages(prompt: string): Array<{ role: string; content: string }> {
    const lines = prompt.split('\n');
    const messages: Array<{ role: string; content: string }> = [];

    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.*)$/);
      if (match) {
        messages.push({ role: match[1], content: match[2] });
      }
    }

    if (messages.length === 0) {
      messages.push({ role: 'user', content: prompt });
    }

    return messages;
  }
}

export default ZhipuAdapter;
