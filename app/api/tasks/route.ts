/**
 * @fileoverview api/tasks/route.ts
 * @description YYC³ API路由 — 认证守卫 + 数据验证 + Redis缓存
 * @author YYC³
 * @version 3.0.0
 * @license MIT
 */

import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { buildCacheKey, invalidateResourceCache, withCache } from '@/lib/db/cache'
import { checkDatabaseConnection } from '@/lib/db/client'
import { TaskRepository } from '@/lib/db/repositories/task.repository'
import { taskSchema } from '@/lib/validations/schemas'
import { NextRequest, NextResponse } from 'next/server'

const taskRepository = new TaskRepository()

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
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''
    const assignee_id = searchParams.get('assignee_id')
    const created_by = searchParams.get('created_by')

    const queryParams = {
      page,
      limit,
      search,
      status,
      priority,
      assignee_id: assignee_id ? parseInt(assignee_id) : undefined,
      created_by: created_by ? parseInt(created_by) : undefined,
    }
    const cacheKey = buildCacheKey('tasks', queryParams)

    const result = await withCache(cacheKey, () => taskRepository.findAll(queryParams), 300)

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    })
  } catch (error: unknown) {
    console.error('获取任务列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取任务列表失败' },
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

    const validation = taskSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: '数据验证失败', details: validation.error.issues },
        { status: 400 }
      )
    }

    const task = await taskRepository.create(validation.data as any)
    await invalidateResourceCache('tasks')

    return NextResponse.json({
      success: true,
      data: task,
    }, { status: 201 })
  } catch (error: unknown) {
    console.error('创建任务失败:', error)

    if ((error as { code?: string }).code === '23503') {
      return NextResponse.json(
        { success: false, error: '指定的用户不存在' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: '创建任务失败' },
      { status: 400 }
    )
  }
}
