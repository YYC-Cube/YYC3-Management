import { useSWRResource } from './use-swr-resource'
import type { Project } from '@/lib/db/models/project'

export function useProjects(params?: { page?: number; limit?: number; search?: string; status?: string }) {
  const swr = useSWRResource<Project>('/api/projects', params)

  return {
    projects: swr.items,
    pagination: swr.pagination,
    loading: swr.isLoading,
    error: swr.isError,
    fetchProjects: swr.mutate,
    createProject: swr.create,
    updateProject: swr.update,
    deleteProject: swr.remove,
  }
}
