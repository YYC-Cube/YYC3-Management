import useSWR, { type SWRConfiguration, type Key } from 'swr'
import { useCallback } from 'react'

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  error?: string
}

export interface SingleResponse<T> {
  success: boolean
  data: T
  error?: string
}

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new Error(error.error || `请求失败 (${res.status})`)
  }
  return res.json()
}

export function buildQuery(params?: Record<string, string | number | undefined>): string {
  if (!params) return ''
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  }
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ''
}

export function useSWRResource<T>(
  baseUrl: string,
  params?: Record<string, string | number | undefined>,
  options?: SWRConfiguration
) {
  const key: Key = `${baseUrl}${buildQuery(params)}`
  const { data, error, isLoading, mutate, isValidating } = useSWR<PaginatedResponse<T>>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      ...options,
    }
  )

  const items = data?.data ?? []

  const create = useCallback(
    async (newData: Partial<T>) => {
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      })
      const json: SingleResponse<T> = await res.json()
      if (!json.success) throw new Error(json.error || '创建失败')
      await mutate()
      return json.data
    },
    [baseUrl, mutate]
  )

  const update = useCallback(
    async (id: number | string, updateData: Partial<T>) => {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })
      const json: SingleResponse<T> = await res.json()
      if (!json.success) throw new Error(json.error || '更新失败')
      await mutate()
      return json.data
    },
    [baseUrl, mutate]
  )

  const remove = useCallback(
    async (id: number | string) => {
      const res = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || '删除失败')
      await mutate()
    },
    [baseUrl, mutate]
  )

  return {
    items,
    pagination: data?.pagination,
    isLoading,
    isError: error,
    isValidating,
    mutate,
    create,
    update,
    remove,
  }
}
