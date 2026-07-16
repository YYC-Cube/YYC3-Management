/**
 * @fileoverview api/dashboard/stats/route.ts
 * @description YYC³ API路由 — 认证守卫 + 数据验证 + Redis缓存
 * @author YYC³
 * @version 3.1.0
 * @license MIT
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateApiRequest } from '@/lib/api/auth-guard'
import { checkDatabaseConnection, query } from '@/lib/db/client'
import { withCache, buildCacheKey } from '@/lib/db/cache'

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

    const cacheKey = buildCacheKey('dashboard:stats')

    const stats = await withCache(cacheKey, async () => {
      const [userStats, customerStats, taskStats, projectStats] = await Promise.all([
        query(`
          SELECT
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'active') as active,
            COUNT(*) FILTER (WHERE is_online = true) as online,
            COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as new_today
          FROM users
        `),
        query(`
          SELECT
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = '活跃') as active,
            COUNT(*) FILTER (WHERE level = 'VIP') as vip,
            COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as new_today
          FROM customers
        `),
        query(`
          SELECT
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = '已完成') as completed,
            COUNT(*) FILTER (WHERE status = '进行中') as in_progress,
            COUNT(*) FILTER (WHERE status = '待处理') as pending
          FROM tasks
        `),
        query(`
          SELECT
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = '已完成') as completed,
            COUNT(*) FILTER (WHERE status = '进行中') as in_progress,
            COALESCE(AVG(progress), 0) as avg_progress
          FROM projects
        `),
      ])

      const parse = (r: Record<string, unknown>) => {
        const result: Record<string, number> = {}
        for (const [k, v] of Object.entries(r)) {
          result[k] = typeof v === 'string' ? parseFloat(v) : (v as number) || 0
        }
        return result
      }

      return {
        users: parse(userStats[0]),
        customers: parse(customerStats[0]),
        tasks: parse(taskStats[0]),
        projects: parse(projectStats[0]),
      }
    }, 60)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error: unknown) {
    console.error('获取仪表板统计失败:', error)
    return NextResponse.json(
      { success: false, error: '获取仪表板统计失败' },
      { status: 500 }
    )
  }
}
