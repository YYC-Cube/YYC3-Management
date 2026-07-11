/**
 * @fileoverview api/finance/summary/route.ts
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
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined

    const summary = await financeRepository.getSummary(startDate, endDate)

    return NextResponse.json({
      success: true,
      data: summary,
    })
  } catch (error: unknown) {
    console.error('获取财务汇总失败:', error)
    return NextResponse.json(
      { success: false, error: '获取财务汇总失败' },
      { status: 500 }
    )
  }
}
