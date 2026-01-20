import { useTaskStore } from '@/store/task-store'
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

export function useTasks(params?: { page?: number; limit?: number; search?: string; status?: string }) {
  const { tasks, setTasks, setLoading, setError } = useTaskStore()
  const [isFetching, setIsFetching] = useState(false)

  const paramsString = useMemo(() => {
    return JSON.stringify(params)
  }, [params?.page, params?.limit, params?.search, params?.status])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setIsFetching(true)

      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      if (params?.status) queryParams.append('status', params.status)

      const response = await fetch(`/api/tasks?${queryParams.toString()}`)
      const data: ApiResponse<typeof tasks[0]> = await response.json()

      if (data.success) {
        setTasks(data.data)
        setError(null)
      } else {
        setError(data.error || '获取任务列表失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('获取任务列表失败:', error)
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }

  const createTask = async (taskData: Partial<typeof tasks[0]>) => {
    try {
      setLoading(true)
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })
      const data = await response.json()

      if (data.success) {
        await fetchTasks()
        return { success: true, data: data.data }
      } else {
        setError(data.error || '创建任务失败')
        return { success: false, error: data.error }
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('创建任务失败:', error)
      return { success: false, error: '网络错误' }
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async (id: number, taskData: Partial<typeof tasks[0]>) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })
      const data = await response.json()

      if (data.success) {
        await fetchTasks()
        return { success: true, data: data.data }
      } else {
        setError(data.error || '更新任务失败')
        return { success: false, error: data.error }
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('更新任务失败:', error)
      return { success: false, error: '网络错误' }
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (id: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        await fetchTasks()
        return { success: true }
      } else {
        setError(data.error || '删除任务失败')
        return { success: false, error: data.error }
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('删除任务失败:', error)
      return { success: false, error: '网络错误' }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [paramsString])

  return {
    tasks,
    loading: isFetching,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  }
}
