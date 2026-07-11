/**
 * @fileoverview api/customers/route.ts
 * @description YYC³ API路由 — 认证守卫 + 数据验证 + Redis缓存
 * @author YYC³
 * @version 3.0.0
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { CustomerRepository } from '@/lib/db/repositories/customer.repository'
import { checkDatabaseConnection } from '@/lib/db/client'
import { customerSchema } from '@/lib/validations/schemas'
import { withCache, invalidateResourceCache, buildCacheKey } from '@/lib/db/cache'

const customerRepository = new CustomerRepository()

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
    const level = searchParams.get('level') || ''
    const status = searchParams.get('status') || ''

    const queryParams = { page, limit, search, level, status }
    const cacheKey = buildCacheKey('customers', queryParams)

    const result = await withCache(cacheKey, () => customerRepository.findAll(queryParams), 300)

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    })
  } catch (error: unknown) {
    console.error('获取客户列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取客户列表失败' },
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

    const validation = customerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: '数据验证失败', details: validation.error.errors },
        { status: 400 }
      )
    }

    const customer = await customerRepository.create(validation.data)
    await invalidateResourceCache('customers')

    return NextResponse.json({
      success: true,
      data: customer,
    }, { status: 201 })
  } catch (error: unknown) {
    console.error('创建客户失败:', error)
    
    if ((error as { code?: string }).code === '23505') {
      return NextResponse.json(
        { success: false, error: '客户邮箱已存在' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, error: '创建客户失败' },
      { status: 400 }
    )
  }
}
