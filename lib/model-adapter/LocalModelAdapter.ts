/**
 * @fileoverview 本地模型适配器
 * @description 适配本地部署的模型（Ollama, Qwen, GLM等）
 * @author YYC³
 * @version 3.0.0
 */

'use client';

import {
  BaseModelAdapter,
  CompletionRequest,
  CompletionResponse,
  ModelConfig,
  ModelInfo
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

  protected async callModelAPI(request: CompletionRequest): Promise<unknown> {
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

  protected async *callModelStream(request: CompletionRequest): AsyncIterable<Record<string, unknown>> {
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

  protected override async postprocess(rawResponse: unknown): Promise<CompletionResponse> {
    const response = rawResponse as { choices: Array<{ message?: { content: string }; text?: string; finish_reason?: string | null }>; id?: string; model?: string; usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number } }
    const choice = response.choices[0];

    return {
      id: response.id || `local-${Date.now()}`,
      text: choice.message?.content || choice.text || '',
      finishReason: choice.finish_reason === 'stop' ? 'stop' : 'length',
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0
      },
      metadata: {
        modelId: response.model || this.config.modelName,
        processingTime: 0,
        timestamp: new Date()
      }
    };
  }

  protected override parseStreamChunk(chunk: unknown): { text: string; finished: boolean; metadata?: Record<string, unknown> } {
    const data = chunk as { choices?: Array<{ delta?: { content?: string }; text?: string; finish_reason?: string | null }> }
    if (!data.choices || data.choices.length === 0) {
      return { text: '', finished: false };
    }

    const choice = data.choices[0];
    const content = choice.delta?.content || choice.text || '';
    const finished = choice.finish_reason !== null && choice.finish_reason !== undefined;

    return {
      text: content,
      finished,
      metadata: { finishReason: choice.finish_reason }
    };
  }
}
