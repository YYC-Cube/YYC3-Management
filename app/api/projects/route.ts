/**
 * @fileoverview api/projects/route.ts
 * @description YYC³ API路由 — 认证守卫 + 数据验证 + Redis缓存
 * @author YYC³
 * @version 3.0.0
 * @license MIT
 */

import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { buildCacheKey, invalidateResourceCache, withCache } from '@/lib/db/cache'
import { checkDatabaseConnection } from '@/lib/db/client'
import { ProjectRepository } from '@/lib/db/repositories/project.repository'
import { projectSchema } from '@/lib/validations/schemas'
import { NextRequest, NextResponse } from 'next/server'

const projectRepository = new ProjectRepository()

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
    const manager_id = searchParams.get('manager_id')
    const type = searchParams.get('type')

    const queryParams = {
      page,
      limit,
      search,
      status,
      priority,
      manager_id: manager_id ? parseInt(manager_id) : undefined,
      type,
    }
    const cacheKey = buildCacheKey('projects', queryParams as any)

    const result = await withCache(cacheKey, () => projectRepository.findAll(queryParams as any), 300)

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    })
  } catch (error: unknown) {
    console.error('获取项目列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取项目列表失败' },
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

    const validation = projectSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: '数据验证失败', details: validation.error.issues },
        { status: 400 }
      )
    }

    const project = await projectRepository.create(validation.data as any)
    await invalidateResourceCache('projects')

    return NextResponse.json({
      success: true,
      data: project,
    }, { status: 201 })
  } catch (error: unknown) {
    console.error('创建项目失败:', error)

    if ((error as { code?: string }).code === '23503') {
      return NextResponse.json(
        { success: false, error: '指定的用户不存在' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: '创建项目失败' },
      { status: 400 }
    )
  }
}
