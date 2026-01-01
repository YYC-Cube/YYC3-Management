/**
 * @fileoverview AI服务接口
 * @description 统一的AI模型调用接口，支持多种AI模型
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

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
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  error?: string
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
    const model = getModelById(request.modelId)
    if (!model) {
      return {
        success: false,
        content: "",
        error: `模型 ${request.modelId} 不存在`,
      }
    }

    try {
      if (model.type === "local") {
        return await this.callLocalModel(model, request)
      } else {
        return await this.callCloudModel(model, request)
      }
    } catch (error) {
      console.error("AI服务调用失败:", error)
      return {
        success: false,
        content: "",
        error: error instanceof Error ? error.message : "未知错误",
      }
    }
  }

  private async callLocalModel(model: AIModel, request: ChatRequest): Promise<ChatResponse> {
    const { messages, temperature = model.temperature, maxTokens = model.maxTokens } = request

    // 模拟本地模型调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      content: `这是来自${model.name}的模拟回复。您的问题是：${messages[messages.length - 1]?.content}`,
      usage: {
        promptTokens: 50,
        completionTokens: 30,
        totalTokens: 80,
      },
    }
  }

  private async callCloudModel(model: AIModel, request: ChatRequest): Promise<ChatResponse> {
    const { messages, temperature = model.temperature, maxTokens = model.maxTokens } = request

    // 模拟云端模型调用
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
      success: true,
      content: `这是来自${model.name}的模拟回复。根据您的问题"${messages[messages.length - 1]?.content}"，我为您提供以下建议和分析...`,
      usage: {
        promptTokens: 100,
        completionTokens: 80,
        totalTokens: 180,
      },
    }
  }

  async getAvailableModels(): Promise<AIModel[]> {
    // 模拟检查模型可用性
    const { AI_MODELS } = await import("./ai-models")
    return AI_MODELS
  }
}

export const aiService = AIService.getInstance()
