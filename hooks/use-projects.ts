import { useProjectStore } from '@/store/project-store'
import { useEffect, useState, useMemo } from 'react'

interface ApiResponse<T> {
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

export function useProjects(params?: { page?: number; limit?: number; search?: string; status?: string }) {
  const { projects, setProjects, setLoading, setError } = useProjectStore()
  const [isFetching, setIsFetching] = useState(false)

  const paramsString = useMemo(() => {
    return JSON.stringify(params)
  }, [params?.page, params?.limit, params?.search, params?.status])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setIsFetching(true)

      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.status) queryParams.append('status', params.status)

      const response = await fetch(`/api/projects?${queryParams.toString()}`)
      const data: ApiResponse<typeof projects[0]> = await response.json()

      if (data.success) {
        setProjects(data.data)
        setError(null)
      } else {
        setError(data.error || '获取项目列表失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('获取项目列表失败:', error)
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }

  const createProject = async (projectData: Partial<typeof projects[0]>) => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      })
      const data = await response.json()

      if (data.success) {
        await fetchProjects()
        return { success: true, data: data.data }
      } else {
        setError(data.error || '创建项目失败')
        return { success: false, error: data.error }
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('创建项目失败:', error)
      return { success: false, error: '网络错误' }
    } finally {
      setLoading(false)
    }
  }

  const updateProject = async (id: number, projectData: Partial<typeof projects[0]>) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      })
      const data = await response.json()

      if (data.success) {
        await fetchProjects()
        return { success: true, data: data.data }
      } else {
        setError(data.error || '更新项目失败')
        return { success: false, error: data.error }
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('更新项目失败:', error)
      return { success: false, error: '网络错误' }
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        await fetchProjects()
        return { success: true }
      } else {
        setError(data.error || '删除项目失败')
        return { success: false, error: data.error }
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('删除项目失败:', error)
      return { success: false, error: '网络错误' }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [paramsString])

  return {
    projects,
    loading: isFetching,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  }
}
