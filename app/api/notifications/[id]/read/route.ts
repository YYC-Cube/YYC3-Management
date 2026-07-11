/**
 * @fileoverview api/notifications/[id]/read/route.ts
 * @description 标记通知已读 — 认证守卫 + 真实数据库
 * @author YYC³
 * @version 3.0.0
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { NotificationRepository } from '@/lib/db/repositories/notification.repository'
import { checkDatabaseConnection } from '@/lib/db/client'

const notificationRepository = new NotificationRepository()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = authenticateApiRequest(request)
    if (!auth.authenticated) return auth.response

    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: '数据库连接失败' },
        { status: 503 }
      )
    }

    const notificationId = parseInt(params.id)
    await notificationRepository.markAsRead(notificationId)

    return NextResponse.json({
      success: true,
      message: '通知已标记为已读',
    })
  } catch (error: unknown) {
    console.error('标记通知失败:', error)
    return NextResponse.json(
      { success: false, error: '标记通知失败' },
      { status: 400 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return PATCH(request, { params })
}
