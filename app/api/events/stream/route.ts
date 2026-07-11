/**
 * @fileoverview api/events/stream/route.ts
 * @description YYC³ API路由 — 认证守卫 + 数据验证 + Redis缓存
 * @author YYC³
 * @version 3.0.0
 * @license MIT
 */

import { NextRequest } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'

export const dynamic = 'force-dynamic'

type Subscriber = (event: string, data: unknown) => void

const subscribers = new Map<string, Subscriber>()

export function broadcast(userId: string, event: string, data: unknown) {
  const sub = subscribers.get(userId)
  if (sub) sub(event, data)
}

export function broadcastAll(event: string, data: unknown) {
  for (const sub of subscribers.values()) {
    sub(event, data)
  }
}

export async function GET(request: NextRequest) {
  const auth = authenticateApiRequest(request)
  if (!auth.authenticated) return auth.response

  const userId = String(auth.payload.userId)

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      const send: Subscriber = (event: string, data: unknown) => {
        const message = `data: ${JSON.stringify({ event, data, timestamp: Date.now() })}\n\n`
        controller.enqueue(encoder.encode(message))
      }

      subscribers.set(userId, send)

      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ event: 'connected', data: { userId } })}\n\n`)
      )

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'))
        } catch {
          clearInterval(heartbeat)
        }
      }, 30000)

      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat)
        subscribers.delete(userId)
        try {
          controller.close()
        } catch {
          // already closed
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
