/**
 * @fileoverview api/ai/models/[id]/route.ts — 模型更新/删除
 * @author YYC³ @version 3.0.0 @license MIT
 */
import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { AIModelRepository } from '@/lib/db/repositories/ai-model.repository'
import { checkDatabaseConnection } from '@/lib/db/client'
import { writeAuditLog } from '@/lib/audit/logger'

const repo = new AIModelRepository()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = authenticateApiRequest(request)
    if (!auth.authenticated) return auth.response

    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json({ success: false, error: '数据库不可用' }, { status: 503 })
    }

    const id = parseInt(params.id)
    const body = await request.json()
    const model = await repo.update(id, body)

    if (!model) {
      return NextResponse.json({ success: false, error: '模型不存在' }, { status: 404 })
    }

    await writeAuditLog({
      userId: auth.payload.userId,
      action: 'update',
      module: 'system',
      description: `更新AI模型: ${model.name}`,
      targetId: model.id,
    })

    return NextResponse.json({ success: true, data: model })
  } catch (error: unknown) {
    console.error('更新模型失败:', error)
    return NextResponse.json({ success: false, error: '更新模型失败' }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = authenticateApiRequest(request)
    if (!auth.authenticated) return auth.response

    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json({ success: false, error: '数据库不可用' }, { status: 503 })
    }

    const id = parseInt(params.id)
    const model = await repo.findById(id)
    if (!model) {
      return NextResponse.json({ success: false, error: '模型不存在' }, { status: 404 })
    }

    await repo.delete(id)

    await writeAuditLog({
      userId: auth.payload.userId,
      action: 'delete',
      module: 'system',
      description: `删除AI模型: ${model.name}`,
      targetId: id,
    })

    return NextResponse.json({ success: true, message: '模型已删除' })
  } catch (error: unknown) {
    console.error('删除模型失败:', error)
    return NextResponse.json({ success: false, error: '删除模型失败' }, { status: 400 })
  }
}
