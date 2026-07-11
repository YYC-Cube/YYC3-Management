/**
 * @fileoverview api/users/route.ts
 * @description YYC³ API路由 — 认证守卫 + 数据验证 + Redis缓存
 * @author YYC³
 * @version 3.0.0
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { UserRepository } from '@/lib/db/repositories/user.repository'
import { checkDatabaseConnection } from '@/lib/db/client'
import { userSchema } from '@/lib/validations/schemas'

const userRepository = new UserRepository()

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
    const department = searchParams.get('department') || ''
    const role = searchParams.get('role') || ''

    const result = await userRepository.findAll({
      page,
      limit,
      search,
      status,
      department,
      role,
    })

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    })
  } catch (error: unknown) {
    console.error('获取用户列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取用户列表失败' },
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

    const validation = userSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: '数据验证失败', details: validation.error.errors },
        { status: 400 }
      )
    }

    const user = await userRepository.create(validation.data)

    return NextResponse.json({
      success: true,
      data: user,
    }, { status: 201 })
  } catch (error: unknown) {
    console.error('创建用户失败:', error)
    
    if ((error as { code?: string }).code === '23505') {
      return NextResponse.json(
        { success: false, error: '用户名或邮箱已存在' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, error: '创建用户失败' },
      { status: 400 }
    )
  }
}
