/**
 * @fileoverview api/ai/chat/route.ts
 * @description YYC³ API路由 — 认证守卫 + 数据验证 + Redis缓存
 * @author YYC³
 * @version 3.0.0
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateApiRequest(request)
    if (!auth.authenticated) return auth.response

    const body = await request.json()
    const { messages, model } = body as { messages: ChatMessage[]; model?: string }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: '消息内容不能为空' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ZHIPU_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'AI服务未配置，请设置 ZHIPU_API_KEY 环境变量' },
        { status: 503 }
      )
    }

    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'glm-4-flash',
        messages,
        stream: false,
        temperature: 0.7,
        max_tokens: 2000,
      }),
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || `AI服务响应错误 (${response.status})`,
        },
        { status: 502 }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: {
        content: data.choices?.[0]?.message?.content || '',
        model: data.model || model,
        usage: data.usage || null,
      },
    })
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { success: false, error: 'AI服务响应超时，请稍后重试' },
        { status: 504 }
      )
    }
    console.error('AI对话失败:', error)
    return NextResponse.json(
      { success: false, error: 'AI服务暂时不可用' },
      { status: 500 }
    )
  }
}
