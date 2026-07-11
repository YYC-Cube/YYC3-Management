/**
 * @fileoverview api/notifications/route.ts
 * @description 通知列表获取与创建 — 认证守卫 + 真实数据库
 * @author YYC³
 * @version 3.0.0
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { NotificationRepository } from '@/lib/db/repositories/notification.repository'
import { checkDatabaseConnection } from '@/lib/db/client'

const notificationRepository = new NotificationRepository()

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const isRead = searchParams.get('read')

    const result = await notificationRepository.findAll({
      user_id: Number(auth.payload.userId),
      page,
      limit,
      is_read: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
    })

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    })
  } catch (error: unknown) {
    console.error('获取通知列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取通知列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()

    if (!body.title || !body.message) {
      return NextResponse.json(
        { success: false, error: '标题和内容为必填' },
        { status: 400 }
      )
    }

    const notification = await notificationRepository.create({
      title: body.title,
      message: body.message,
      type: body.type || 'info',
      priority: body.priority,
      user_id: body.user_id || Number(auth.payload.userId),
      from_user: body.from_user || null,
    })

    return NextResponse.json({
      success: true,
      data: notification,
    }, { status: 201 })
  } catch (error: unknown) {
    console.error('创建通知失败:', error)
    return NextResponse.json(
      { success: false, error: '创建通知失败' },
      { status: 400 }
    )
  }
}
