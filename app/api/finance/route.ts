/**
 * @fileoverview api/finance/route.ts
 * @description YYC³ API路由 — 认证守卫 + 数据验证 + Redis缓存
 * @author YYC³
 * @version 3.0.0
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { FinanceRepository } from '@/lib/db/repositories/finance.repository'
import { checkDatabaseConnection } from '@/lib/db/client'

const financeRepository = new FinanceRepository()

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
    const type = searchParams.get('type') || ''
    const category = searchParams.get('category') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''

    const result = await financeRepository.findAll({
      page, limit, type, category, startDate, endDate,
    })

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    })
  } catch (error: unknown) {
    console.error('获取财务记录失败:', error)
    return NextResponse.json(
      { success: false, error: '获取财务记录失败' },
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

    if (!body.type || !body.category || body.amount === undefined) {
      return NextResponse.json(
        { success: false, error: '数据验证失败: type, category, amount 为必填' },
        { status: 400 }
      )
    }

    const record = await financeRepository.create(body)

    return NextResponse.json({
      success: true,
      data: record,
    }, { status: 201 })
  } catch (error: unknown) {
    console.error('创建财务记录失败:', error)
    return NextResponse.json(
      { success: false, error: '创建财务记录失败' },
      { status: 400 }
    )
  }
}
