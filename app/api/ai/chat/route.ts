/**
 * @fileoverview api/ai/chat/route.ts
 * @description YYC³ API路由 — 认证守卫 + 数据验证 + Redis缓存
 * @author YYC³
 * @version 3.1.0
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { aiService } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateApiRequest(request)
    if (!auth.authenticated) return auth.response

    const body = await request.json()
    const { messages, model, temperature, maxTokens, stream } = body as {
      messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
      model?: string
      temperature?: number
      maxTokens?: number
      stream?: boolean
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, content: '', error: '消息内容不能为空' },
        { status: 400 }
      )
    }

    // 统一调用 aiService（支持多提供商：OpenAI / Ollama / Zhipu / DB 配置）
    const response = await aiService.chat({
      modelId: model || 'glm-4-flash',
      messages,
      temperature: temperature ?? 0.7,
      maxTokens: maxTokens ?? 2000,
      stream: stream ?? false,
    })

    return NextResponse.json(response)
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { success: false, content: '', error: 'AI服务响应超时，请稍后重试' },
        { status: 504 }
      )
    }
    console.error('AI对话失败:', error)
    return NextResponse.json(
      { success: false, content: '', error: 'AI服务暂时不可用' },
      { status: 500 }
    )
  }
}
