import useSWR from 'swr'
import { useCallback } from 'react'
import { fetcher } from './use-swr-resource'
import type { Notification } from '@/lib/db/models/notification'

export function useNotifications(params?: { page?: number; limit?: number; read?: boolean }) {
  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', String(params.page))
  if (params?.limit) queryParams.append('limit', String(params.limit))
  if (params?.read !== undefined) queryParams.append('read', String(params.read))

  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean
    data: Notification[]
    pagination: { page: number; limit: number; total: number; totalPages: number }
  }>(`/api/notifications?${queryParams.toString()}`, fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 10000,
  })

  const notifications = data?.data ?? []

  const markAsRead = useCallback(
    async (id: number) => {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
      await mutate()
    },
    [mutate]
  )

  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.is_read)
    await Promise.all(
      unread.map((n) =>
        fetch(`/api/notifications/${n.id}/read`, { method: 'PATCH' })
      )
    )
    await mutate()
  }, [notifications, mutate])

  return {
    notifications,
    pagination: data?.pagination,
    loading: isLoading,
    error,
    mutate,
    markAsRead,
    markAllAsRead,
  }
}
