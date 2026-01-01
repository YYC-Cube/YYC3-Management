// core/adapters/ModelAdapter.ts
import {
  AutonomousAIConfig,
  AITool,
  ModelResponse,
  ModelInfo
} from '../autonomous-ai-widget/types';

export abstract class ModelAdapter {
  protected config: AutonomousAIConfig;

  constructor(config: AutonomousAIConfig) {
    this.config = config;
  }

  abstract generate(prompt: string, tools?: AITool[]): Promise<ModelResponse>;
  abstract streamGenerate(prompt: string, onChunk: (chunk: string) => void): Promise<void>;
  abstract getModelInfo(): ModelInfo;
}

// Mock OpenAI types for type checking
interface OpenAI {
  chat: {
    completions: {
      create(params: any): Promise<any>;
    };
  };
  constructor(options: any): void;
}

namespace OpenAI {
  export interface ChatCompletionCreateParams {
    model: string;
    messages: Array<{ role: string; content: string }>;
    max_tokens?: number;
    temperature?: number;
    tools?: any[];
  }

  export interface ChatCompletion {
    choices: Array<{
      message?: {
        content?: string;
        tool_calls?: any[];
      };
      delta?: {
        content?: string;
      };
    }>;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    model: string;
  }

  export interface ChatCompletionCreateParamsNonStreaming {
    model: string;
    messages: Array<{ role: string; content: string }>;
    stream?: false;
    max_tokens?: number;
    temperature?: number;
    tools?: any[];
  }

  export interface ChatCompletionCreateParamsStreaming {
    model: string;
    messages: Array<{ role: string; content: string }>;
    stream: true;
    max_tokens?: number;
    temperature?: number;
  }
}

// core/adapters/OpenAIModelAdapter.ts
export class OpenAIModelAdapter extends ModelAdapter {
  private client: any;

  constructor(config: AutonomousAIConfig) {
    super(config);
    this.client = {
      chat: {
        completions: {
          create: async (params: any) => {
            return {
              choices: [{
                message: {
                  content: 'Mock OpenAI response',
                  tool_calls: []
                }
              }],
              usage: {
                prompt_tokens: 0,
                completion_tokens: 0,
                total_tokens: 0
              },
              model: params.model
            };
          }
        }
      }
    };
  }

  async generate(prompt: string, tools?: AITool[]): Promise<ModelResponse> {
    const request: OpenAI.ChatCompletionCreateParams = {
      model: this.config.modelName,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      tools: tools ? this.formatTools(tools) : undefined
    };

    const response = await this.client.chat.completions.create(request);

    return {
      content: response.choices[0]?.message?.content || '',
      toolCalls: response.choices[0]?.message?.tool_calls,
      usage: response.usage,
      model: response.model
    };
  }

  async streamGenerate(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    const stream = await this.client.chat.completions.create({
      model: this.config.modelName,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        onChunk(content);
      }
    }
  }

  getModelInfo(): ModelInfo {
    return {
      id: `openai-${this.config.modelName}`,
      name: this.config.modelName,
      provider: 'OpenAI',
      capabilities: ['chat', 'streaming', 'function-calling'],
      maxTokens: this.config.maxTokens,
      version: 'latest',
      description: 'OpenAI GPT model adapter'
    };
  }

  private formatTools(tools: AITool[]): any[] {
    return tools.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
      }
    }));
  }
}

// core/adapters/InternalModelAdapter.ts
export class InternalModelAdapter extends ModelAdapter {
  async generate(prompt: string, tools?: AITool[]): Promise<ModelResponse> {
    // 调用项目内部的大模型服务
    const response = await fetch('/api/internal-ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        tools,
        config: {
          model: this.config.modelName,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature
        }
      })
    });

    return await response.json();
  }

  async streamGenerate(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    const response = await fetch('/api/internal-ai/stream-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, config: this.config })
    });

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              onChunk(parsed.content);
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  }

  getModelInfo(): ModelInfo {
    return {
      id: `internal-${this.config.modelName}`,
      name: this.config.modelName,
      provider: 'Internal',
      capabilities: ['chat', 'streaming', 'function-calling'],
      maxTokens: this.config.maxTokens,
      version: 'latest',
      description: 'Internal AI model adapter'
    };
  }
}
