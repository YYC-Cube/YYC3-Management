import useSWR from 'swr'
import { useSWRResource } from './use-swr-resource'
import { fetcher, type PaginatedResponse } from './use-swr-resource'
import type { FinanceRecord, FinanceSummary } from '@/lib/db/models/finance'

export function useFinance(params?: {
  page?: number
  limit?: number
  type?: string
  category?: string
  startDate?: string
  endDate?: string
}) {
  const swr = useSWRResource<FinanceRecord>('/api/finance', params)

  return {
    records: swr.items,
    pagination: swr.pagination,
    loading: swr.isLoading,
    error: swr.isError,
    fetchFinance: swr.mutate,
    createRecord: swr.create,
    updateRecord: swr.update,
    deleteRecord: swr.remove,
  }
}

export function useFinanceSummary(startDate?: string, endDate?: string) {
  const params = new URLSearchParams()
  if (startDate) params.append('startDate', startDate)
  if (endDate) params.append('endDate', endDate)

  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: FinanceSummary }>(
    `/api/finance/summary${params.toString() ? '?' + params.toString() : ''}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  )

  return {
    summary: data?.data,
    loading: isLoading,
    error,
    mutate,
  }
}
