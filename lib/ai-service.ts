/**
 * @fileoverview AI服务接口 — 统一的多模型调用引擎
 * @description 对接真实 OpenAI 兼容 API 和 Ollama 本地模型，支持多提供商切换
 * @author YYC³
 * @version 3.1.0
 * @created 2025-01-30
 * @modified 2026-07-17
 * @copyright Copyright (c) 2025-2026 YYC³
 * @license MIT
 */

// 标记为服务端专用 — 防止被客户端组件误导入（会导致 pg/fs 模块进入浏览器打包）
import 'server-only'

import { type AIModel, getModelById } from "./ai-models"

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: Date
}

export interface ChatRequest {
  modelId: string
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface ChatResponse {
  success: boolean
  content: string
  model?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  error?: string
}

/**
 * 从数据库获取活跃模型配置（替代硬编码列表）
 * 优先使用 DB 配置，回退到环境变量/内置配置
 */
async function getActiveModelConfig(modelId: string) {
  // 1. 尝试从数据库获取
  try {
    const { AIModelRepository } = await import("./db/repositories/ai-model.repository")
    const repo = new AIModelRepository()
    const activeModels = await repo.findActive()
    const dbModel = activeModels.find(
      (m) => m.model_id === modelId || m.name === modelId
    )
    if (dbModel) {
      const decryptedKey = repo.getDecryptedApiKey(dbModel)
      return {
        id: dbModel.model_id,
        name: dbModel.name,
        provider: dbModel.provider,
        type: dbModel.provider === 'ollama' ? 'local' as const : 'cloud' as const,
        endpoint: dbModel.base_url || '',
        apiKey: decryptedKey,
        maxTokens: dbModel.max_tokens,
        temperature: dbModel.temperature,
        description: (dbModel.metadata as Record<string, unknown>)?.description as string || '',
        capabilities: dbModel.capabilities || [],
        systemPrompt: dbModel.system_prompt,
      }
    }
  } catch {
    // DB 不可用时回退到内置配置
    console.warn('[AIService] 数据库不可用，使用内置模型配置')
  }

  // 2. 回退到内置模型配置
  const builtinModel = getModelById(modelId)
  if (builtinModel) return builtinModel

  // 3. 尝试作为通用 OpenAI 兼容模型处理
  return null
}

/**
 * 调用 OpenAI 兼容 API（支持所有 OpenAI-compatible 服务商）
 */
async function callOpenAICompatible(
  config: {
    endpoint: string
    apiKey: string
    modelId: string
    temperature: number
    maxTokens: number
  },
  messages: ChatMessage[],
  signal?: AbortSignal
): Promise<ChatResponse> {
  const { endpoint, apiKey, modelId, temperature, maxTokens } = config

  // 确保 endpoint 以 /chat/completions 结尾
  const url = endpoint.endsWith('/chat/completions')
    ? endpoint
    : endpoint.replace(/\/$/, '') + '/chat/completions'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature,
      max_tokens: maxTokens,
      stream: false,
    }),
    signal,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.error?.message || `API 错误 (${response.status})`
    return {
      success: false,
      content: '',
      error: errorMessage,
    }
  }

  const data = await response.json()
  return {
    success: true,
    content: data.choices?.[0]?.message?.content || '',
    model: data.model || modelId,
    usage: data.usage
      ? {
        promptTokens: data.usage.prompt_tokens || 0,
        completionTokens: data.usage.completion_tokens || 0,
        totalTokens: data.usage.total_tokens || 0,
      }
      : undefined,
  }
}

/**
 * 调用 Ollama 本地模型
 */
async function callOllama(
  config: {
    endpoint: string
    modelId: string
    temperature: number
    maxTokens: number
  },
  messages: ChatMessage[],
  signal?: AbortSignal
): Promise<ChatResponse> {
  const { endpoint, modelId, temperature, maxTokens } = config

  // Ollama API 地址格式: http://localhost:11434/api/chat
  const baseUrl = endpoint.replace(/\/$/, '')
  const url = baseUrl.endsWith('/api/chat') ? baseUrl : `${baseUrl}/api/chat`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelId,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: false,
      options: {
        temperature,
        num_predict: maxTokens,
      },
    }),
    signal,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    return {
      success: false,
      content: '',
      error: errorData.error || `Ollama 错误 (${response.status})`,
    }
  }

  const data = await response.json()
  return {
    success: true,
    content: data.message?.content || '',
    model: modelId,
    usage: {
      promptTokens: data.prompt_eval_count || 0,
      completionTokens: data.eval_count || 0,
      totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
    },
  }
}

export class AIService {
  private static instance: AIService

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const { modelId, messages, temperature, maxTokens } = request

    // 获取模型配置（数据库 → 内置 → 通用）
    const modelConfig = await getActiveModelConfig(modelId)

    if (!modelConfig) {
      // 尝试作为通用 OpenAI 兼容模型调用
      const defaultEndpoint = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
      const defaultApiKey = process.env.OPENAI_API_KEY || ''
      if (!defaultApiKey) {
        return {
          success: false,
          content: '',
          error: `模型 "${modelId}" 未配置，且未设置 OPENAI_API_KEY 环境变量`,
        }
      }
      return callOpenAICompatible(
        {
          endpoint: defaultEndpoint,
          apiKey: defaultApiKey,
          modelId,
          temperature: temperature ?? 0.7,
          maxTokens: maxTokens ?? 4096,
        },
        messages
      )
    }

    const timeout = 60000 // 60秒超时
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      if (modelConfig.type === 'local' || modelConfig.provider === 'ollama') {
        return await callOllama(
          {
            endpoint: modelConfig.endpoint,
            modelId: modelConfig.id,
            temperature: temperature ?? modelConfig.temperature,
            maxTokens: maxTokens ?? modelConfig.maxTokens,
          },
          messages,
          controller.signal
        )
      } else {
        const apiKey = modelConfig.apiKey ||
          process.env.OPENAI_API_KEY ||
          ''
        const endpoint = modelConfig.endpoint ||
          process.env.OPENAI_BASE_URL ||
          'https://api.openai.com/v1'

        if (!apiKey) {
          return {
            success: false,
            content: '',
            error: `模型 "${modelConfig.name}" 未配置 API Key`,
          }
        }

        return await callOpenAICompatible(
          {
            endpoint,
            apiKey,
            modelId: modelConfig.id,
            temperature: temperature ?? modelConfig.temperature,
            maxTokens: maxTokens ?? modelConfig.maxTokens,
          },
          messages,
          controller.signal
        )
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          content: '',
          error: 'AI 服务响应超时，请稍后重试',
        }
      }
      console.error('[AIService] 调用失败:', error)
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : 'AI 服务调用异常',
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }

  async getAvailableModels(): Promise<AIModel[]> {
    try {
      const { AIModelRepository } = await import("./db/repositories/ai-model.repository")
      const repo = new AIModelRepository()
      const activeModels = await repo.findActive()
      return activeModels.map((m) => {
        const decryptedKey = repo.getDecryptedApiKey(m)
        return {
          id: m.model_id,
          name: m.name,
          provider: m.provider,
          type: m.provider === 'ollama' ? 'local' as const : 'cloud' as const,
          endpoint: m.base_url || '',
          apiKey: decryptedKey,
          maxTokens: m.max_tokens,
          temperature: m.temperature,
          description: (m.metadata as Record<string, unknown>)?.description as string || '',
          capabilities: m.capabilities || [],
        }
      })
    } catch {
      // DB 不可用时回退到内置列表
      const { AI_MODELS } = await import("./ai-models")
      return AI_MODELS
    }
  }
}

export const aiService = AIService.getInstance()
