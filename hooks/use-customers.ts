import { useSWRResource } from './use-swr-resource'
import type { Customer } from '@/lib/db/models/customer'

export function useCustomers(params?: { page?: number; limit?: number; search?: string }) {
  const swr = useSWRResource<Customer>('/api/customers', params)

  return {
    customers: swr.items,
    pagination: swr.pagination,
    loading: swr.isLoading,
    error: swr.isError,
    fetchCustomers: swr.mutate,
    createCustomer: swr.create,
    updateCustomer: swr.update,
    deleteCustomer: swr.remove,
  }
}
