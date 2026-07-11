/**
 * @fileoverview api/workflows/route.ts
 * @description YYC³ API路由 — 认证守卫 + 数据验证 + Redis缓存
 * @author YYC³
 * @version 3.0.0
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { getWorkflowList, startWorkflow } from '@/lib/workflow/engine'
import { writeAuditLog } from '@/lib/audit/logger'

export async function GET(request: NextRequest) {
  try {
    const auth = authenticateApiRequest(request)
    if (!auth.authenticated) return auth.response

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined
    const type = searchParams.get('type') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const result = await getWorkflowList({ status, type, page, limit })

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: { page, limit, total: result.total },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: '获取工作流列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateApiRequest(request)
    if (!auth.authenticated) return auth.response

    const body = await request.json()

    if (!body.type || !body.title) {
      return NextResponse.json(
        { success: false, error: '类型和标题为必填' },
        { status: 400 }
      )
    }

    const instance = await startWorkflow({
      type: body.type,
      title: body.title,
      description: body.description || '',
      submittedBy: Number(auth.payload.userId),
      submittedByName: body.submittedByName || '用户',
      data: body.data || {},
    })

    await writeAuditLog({
      userId: auth.payload.userId,
      action: 'create',
      module: 'system',
      description: `发起工作流: ${body.title}`,
      targetId: instance.id,
    })

    return NextResponse.json({
      success: true,
      data: instance,
    }, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '发起工作流失败'
    return NextResponse.json(
      { success: false, error: msg },
      { status: 400 }
    )
  }
}
