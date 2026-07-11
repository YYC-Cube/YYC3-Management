/**
 * @fileoverview api/search/route.ts
 * @description YYC³ API路由 — 认证守卫 + 数据验证 + Redis缓存
 * @author YYC³
 * @version 3.0.0
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { checkDatabaseConnection } from '@/lib/db/client'
import { query } from '@/lib/db/client'

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

    const searchParam = request.nextUrl.searchParams.get('q') || ''
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '5')

    if (!searchParam.trim()) {
      return NextResponse.json({
        success: true,
        data: { users: [], customers: [], tasks: [], projects: [] },
      })
    }

    const pattern = `%${searchParam}%`

    const [users, customers, tasks, projects] = await Promise.all([
      query(
        `SELECT id, username, real_name as name, email, 'user' as type FROM users
         WHERE username ILIKE $1 OR real_name ILIKE $1 OR email ILIKE $1
         LIMIT $2`,
        [pattern, limit]
      ),
      query(
        `SELECT id, name, company, phone, 'customer' as type FROM customers
         WHERE name ILIKE $1 OR company ILIKE $1 OR phone ILIKE $1 OR email ILIKE $1
         LIMIT $2`,
        [pattern, limit]
      ),
      query(
        `SELECT id, title, status, priority, 'task' as type FROM tasks
         WHERE title ILIKE $1 OR description ILIKE $1
         LIMIT $2`,
        [pattern, limit]
      ),
      query(
        `SELECT id, name, status, progress, 'project' as type FROM projects
         WHERE name ILIKE $1 OR description ILIKE $1
         LIMIT $2`,
        [pattern, limit]
      ),
    ])

    return NextResponse.json({
      success: true,
      data: {
        users: users.map((u: Record<string, unknown>) => ({ ...u, href: `/user-management` })),
        customers: customers.map((c: Record<string, unknown>) => ({ ...c, href: `/customers` })),
        tasks: tasks.map((t: Record<string, unknown>) => ({ ...t, href: `/tasks` })),
        projects: projects.map((p: Record<string, unknown>) => ({ ...p, href: `/projects` })),
      },
    })
  } catch (error: unknown) {
    console.error('搜索失败:', error)
    return NextResponse.json(
      { success: false, error: '搜索失败' },
      { status: 500 }
    )
  }
}
