/**
 * @fileoverview OpenAI模型适配器
 * @description 适配OpenAI GPT系列模型（GPT-4, GPT-3.5等）
 * @author YYC³
 * @version 2.0.0
 */

'use client';

import {
  BaseModelAdapter,
  ModelInfo,
  ModelConfig,
  CompletionRequest,
  CompletionResponse,
  EmbeddingRequest,
  EmbeddingResponse
} from './ModelAdapter';

export interface OpenAIConfig extends ModelConfig {
  apiKey: string;
  organization?: string;
  baseURL?: string;
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'gpt-4-turbo' | string;
}

export class OpenAIAdapter extends BaseModelAdapter {
  private apiKey: string;
  private organization?: string;
  private baseURL: string;
  private model: string;
  
  constructor(config: OpenAIConfig) {
    super(config);
    this.apiKey = config.apiKey;
    this.organization = config.organization;
    this.baseURL = config.baseURL || 'https://api.openai.com/v1';
    this.model = config.model;
  }
  
  getModelInfo(): ModelInfo {
    return {
      id: this.model,
      name: `OpenAI ${this.model}`,
      provider: 'OpenAI',
      version: '1.0',
      capabilities: ['text-generation', 'chat', 'embeddings'],
      maxTokens: this.getMaxTokens(this.model),
      supportedLanguages: ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko']
    };
  }
  
  protected async callModelAPI(request: CompletionRequest): Promise<any> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...(this.organization && { 'OpenAI-Organization': this.organization })
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: request.prompt }],
        temperature: request.parameters?.temperature || 0.7,
        max_tokens: request.parameters?.maxTokens || 1000,
        top_p: request.parameters?.topP || 1,
        frequency_penalty: request.parameters?.frequencyPenalty || 0,
        presence_penalty: request.parameters?.presencePenalty || 0,
        stop: request.parameters?.stop
      }),
      signal: AbortSignal.timeout(this.config.timeout)
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
  
  protected async *callModelStream(request: any): AsyncIterable<any> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...(this.organization && { 'OpenAI-Organization': this.organization })
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: request.prompt }],
        temperature: request.parameters?.temperature || 0.7,
        max_tokens: request.parameters?.maxTokens || 1000,
        stream: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
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
  
  protected async postprocess(rawResponse: any): Promise<CompletionResponse> {
    const choice = rawResponse.choices[0];
    
    return {
      id: rawResponse.id,
      text: choice.message.content,
      finishReason: choice.finish_reason === 'stop' ? 'stop' : 'length',
      usage: {
        promptTokens: rawResponse.usage.prompt_tokens,
        completionTokens: rawResponse.usage.completion_tokens,
        totalTokens: rawResponse.usage.total_tokens
      },
      metadata: {
        modelId: rawResponse.model,
        processingTime: 0,
        timestamp: new Date()
      }
    };
  }
  
  protected parseStreamChunk(chunk: any): { text: string; finished: boolean; metadata?: any } {
    if (!chunk.choices || chunk.choices.length === 0) {
      return { text: '', finished: false };
    }
    
    const choice = chunk.choices[0];
    const content = choice.delta?.content || '';
    const finished = choice.finish_reason !== null;
    
    return {
      text: content,
      finished,
      metadata: { finishReason: choice.finish_reason }
    };
  }
  
  async generateEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const response = await fetch(`${this.baseURL}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...(this.organization && { 'OpenAI-Organization': this.organization })
      },
      body: JSON.stringify({
        model: request.model || 'text-embedding-ada-002',
        input: request.input
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI embedding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      embeddings: data.data.map((item: any) => item.embedding),
      usage: {
        totalTokens: data.usage.total_tokens
      },
      metadata: {
        modelId: data.model,
        dimensions: data.data[0].embedding.length,
        timestamp: new Date()
      }
    };
  }
  
  private getMaxTokens(model: string): number {
    const tokenLimits: Record<string, number> = {
      'gpt-4': 8192,
      'gpt-4-32k': 32768,
      'gpt-4-turbo': 128000,
      'gpt-3.5-turbo': 4096,
      'gpt-3.5-turbo-16k': 16384
    };
    
    return tokenLimits[model] || 4096;
  }
}
