/**
 * @fileoverview 本地模型适配器
 * @description 适配本地部署的模型（Ollama, Qwen, GLM等）
 * @author YYC³
 * @version 2.0.0
 */

'use client';

import {
  BaseModelAdapter,
  ModelInfo,
  ModelConfig,
  CompletionRequest,
  CompletionResponse
} from './ModelAdapter';

export class LocalModelAdapter extends BaseModelAdapter {
  constructor(config: ModelConfig) {
    super(config);
  }
  
  getModelInfo(): ModelInfo {
    return {
      id: this.config.modelName,
      name: this.config.modelName,
      provider: this.config.provider,
      version: '1.0',
      capabilities: ['text-generation', 'chat'],
      maxTokens: this.config.maxOutputLength,
      supportedLanguages: ['zh', 'en']
    };
  }
  
  protected async callModelAPI(request: CompletionRequest): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }
    
    const response = await fetch(`${this.config.baseURL}/v1/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: this.config.modelName,
        messages: [{ role: 'user', content: request.prompt }],
        temperature: request.parameters?.temperature || 0.7,
        max_tokens: request.parameters?.maxTokens || 1000,
        top_p: request.parameters?.topP || 0.9
      }),
      signal: AbortSignal.timeout(this.config.timeout)
    });
    
    if (!response.ok) {
      throw new Error(`Local model API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
  
  protected async *callModelStream(request: any): AsyncIterable<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }
    
    const response = await fetch(`${this.config.baseURL}/v1/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: this.config.modelName,
        messages: [{ role: 'user', content: request.prompt }],
        temperature: request.parameters?.temperature || 0.7,
        max_tokens: request.parameters?.maxTokens || 1000,
        stream: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`Local model stream error: ${response.status}`);
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
      id: rawResponse.id || `local-${Date.now()}`,
      text: choice.message?.content || choice.text || '',
      finishReason: choice.finish_reason === 'stop' ? 'stop' : 'length',
      usage: {
        promptTokens: rawResponse.usage?.prompt_tokens || 0,
        completionTokens: rawResponse.usage?.completion_tokens || 0,
        totalTokens: rawResponse.usage?.total_tokens || 0
      },
      metadata: {
        modelId: rawResponse.model || this.config.modelName,
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
    const content = choice.delta?.content || choice.text || '';
    const finished = choice.finish_reason !== null && choice.finish_reason !== undefined;
    
    return {
      text: content,
      finished,
      metadata: { finishReason: choice.finish_reason }
    };
  }
}
