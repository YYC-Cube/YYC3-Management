/**
 * @fileoverview Dashboard 聚合统计 Hook — 单次 API 调用获取全部统计数据
 * @description 替代全量数据加载，使用服务端预聚合 API + SWR 缓存
 * @author YYC³ @version 3.1.0 @license MIT
 */

import useSWR from 'swr'

interface DashboardStats {
  users: {
    total: number
    active: number
    online: number
    new_today: number
  }
  customers: {
    total: number
    active: number
    vip: number
    new_today: number
  }
  tasks: {
    total: number
    completed: number
    in_progress: number
    pending: number
  }
  projects: {
    total: number
    completed: number
    in_progress: number
    avg_progress: number
  }
}

interface DashboardStatsResponse {
  success: boolean
  data: DashboardStats
  error?: string
}

const fetcher = async (url: string): Promise<DashboardStats> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('获取仪表板统计失败')
  const json: DashboardStatsResponse = await res.json()
  if (!json.success) throw new Error(json.error || '获取仪表板统计失败')
  return json.data
}

export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    '/api/dashboard/stats',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30秒内不重复请求
      errorRetryCount: 3,
    }
  )

  return {
    stats: data,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  }
}