import { useSWRResource } from './use-swr-resource'
import type { Task } from '@/lib/db/models/task'

export function useTasks(params?: { page?: number; limit?: number; search?: string; status?: string }) {
  const swr = useSWRResource<Task>('/api/tasks', params)

  return {
    tasks: swr.items,
    pagination: swr.pagination,
    loading: swr.isLoading,
    error: swr.isError,
    fetchTasks: swr.mutate,
    createTask: swr.create,
    updateTask: swr.update,
    deleteTask: swr.remove,
  }
}
