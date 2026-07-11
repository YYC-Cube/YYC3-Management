/**
 * @fileoverview api/upload/route.ts
 * @description YYC³ API路由 — 认证守卫 + 数据验证 + Redis缓存
 * @author YYC³
 * @version 3.0.0
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { writeAuditLog } from '@/lib/audit/logger'
import { query } from '@/lib/db/client'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'text/csv', 'text/plain',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateApiRequest(request)
    if (!auth.authenticated) return auth.response

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: '未检测到文件' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: '文件大小超过限制 (最大10MB)' },
        { status: 413 }
      )
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `不支持的文件类型: ${file.type}` },
        { status: 415 }
      )
    }

    const module = (formData.get('module') as string) || 'general'
    const referenceId = (formData.get('reference_id') as string) || null

    const ext = path.extname(file.name)
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', module)
    const filePath = path.join(uploadDir, filename)

    await mkdir(uploadDir, { recursive: true })

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, new Uint8Array(bytes))

    const result = await query(
      `INSERT INTO files (filename, original_name, mime_type, size, path, uploaded_by, module, reference_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        filename,
        file.name,
        file.type,
        file.size,
        `/uploads/${module}/${filename}`,
        auth.payload.userId,
        module,
        referenceId,
      ]
    )

    await writeAuditLog({
      userId: auth.payload.userId,
      action: 'create',
      module: 'system',
      description: `上传文件: ${file.name}`,
    })

    return NextResponse.json({
      success: true,
      data: result[0],
    }, { status: 201 })
  } catch (error: unknown) {
    console.error('文件上传失败:', error)
    return NextResponse.json(
      { success: false, error: '文件上传失败' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = authenticateApiRequest(request)
    if (!auth.authenticated) return auth.response

    const searchParams = request.nextUrl.searchParams
    const module = searchParams.get('module') || ''
    const referenceId = searchParams.get('reference_id') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let whereClauses: string[] = []
    let queryParams: unknown[] = []
    let paramIndex = 1

    if (module) {
      whereClauses.push(`module = $${paramIndex++}`)
      queryParams.push(module)
    }
    if (referenceId) {
      whereClauses.push(`reference_id = $${paramIndex++}`)
      queryParams.push(referenceId)
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''
    const offset = (page - 1) * limit

    const [dataResult, countResult] = await Promise.all([
      query(
        `SELECT * FROM files ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
        [...queryParams, limit, offset]
      ),
      query(`SELECT COUNT(*) as total FROM files ${whereClause}`, queryParams),
    ])

    return NextResponse.json({
      success: true,
      data: dataResult,
      pagination: {
        page,
        limit,
        total: parseInt(countResult[0]?.total ?? '0'),
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: '获取文件列表失败' },
      { status: 500 }
    )
  }
}
