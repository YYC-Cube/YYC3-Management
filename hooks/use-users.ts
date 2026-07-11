import { useSWRResource } from './use-swr-resource'
import type { User } from '@/lib/db/models/user'

export function useUsers(params?: { page?: number; limit?: number; search?: string }) {
  const swr = useSWRResource<User>('/api/users', params)

  return {
    users: swr.items,
    pagination: swr.pagination,
    loading: swr.isLoading,
    error: swr.isError,
    fetchUsers: swr.mutate,
    createUser: swr.create,
    updateUser: swr.update,
    deleteUser: swr.remove,
  }
}
