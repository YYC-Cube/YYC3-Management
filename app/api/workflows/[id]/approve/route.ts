/**
 * @fileoverview api/workflows/[id]/approve/route.ts
 * @description YYC³ API路由 — 认证守卫 + 数据验证 + Redis缓存
 * @author YYC³
 * @version 3.0.0
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { approveWorkflow, rejectWorkflow } from '@/lib/workflow/engine'
import { writeAuditLog } from '@/lib/audit/logger'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = authenticateApiRequest(request)
    if (!auth.authenticated) return auth.response

    const instanceId = parseInt(params.id)
    const body = await request.json()
    const action = body.action as 'approve' | 'reject'

    if (action === 'approve') {
      const instance = await approveWorkflow(
        instanceId,
        Number(auth.payload.userId),
        body.approverName || '审批人',
        body.comment
      )

      await writeAuditLog({
        userId: auth.payload.userId,
        action: 'update',
        module: 'system',
        description: `审批通过: 工作流 #${instanceId}`,
        targetId: instanceId,
      })

      return NextResponse.json({ success: true, data: instance })
    } else if (action === 'reject') {
      const instance = await rejectWorkflow(
        instanceId,
        Number(auth.payload.userId),
        body.rejecterName || '审批人',
        body.reason || '未提供原因'
      )

      await writeAuditLog({
        userId: auth.payload.userId,
        action: 'update',
        module: 'system',
        description: `审批驳回: 工作流 #${instanceId}`,
        targetId: instanceId,
      })

      return NextResponse.json({ success: true, data: instance })
    }

    return NextResponse.json(
      { success: false, error: '无效的审批操作' },
      { status: 400 }
    )
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '审批操作失败'
    return NextResponse.json(
      { success: false, error: msg },
      { status: 400 }
    )
  }
}
