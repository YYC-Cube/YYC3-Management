import { useUserStore } from '@/store/user-store'
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

export function useUsers(params?: { page?: number; limit?: number; search?: string }) {
  const { users, setUsers, setLoading, setError } = useUserStore()
  const [isFetching, setIsFetching] = useState(false)

  const paramsString = useMemo(() => {
    return JSON.stringify(params)
  }, [params?.page, params?.limit, params?.search])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setIsFetching(true)

      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)

      const response = await fetch(`/api/users?${queryParams.toString()}`)
      const data: ApiResponse<typeof users[0]> = await response.json()

      if (data.success) {
        setUsers(data.data)
        setError(null)
      } else {
        setError(data.error || '获取用户列表失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('获取用户列表失败:', error)
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }

  const createUser = async (userData: Partial<typeof users[0]>) => {
    try {
      setLoading(true)
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      const data = await response.json()

      if (data.success) {
        await fetchUsers()
        return { success: true, data: data.data }
      } else {
        setError(data.error || '创建用户失败')
        return { success: false, error: data.error }
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('创建用户失败:', error)
      return { success: false, error: '网络错误' }
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (id: number, userData: Partial<typeof users[0]>) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      const data = await response.json()

      if (data.success) {
        await fetchUsers()
        return { success: true, data: data.data }
      } else {
        setError(data.error || '更新用户失败')
        return { success: false, error: data.error }
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('更新用户失败:', error)
      return { success: false, error: '网络错误' }
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        await fetchUsers()
        return { success: true }
      } else {
        setError(data.error || '删除用户失败')
        return { success: false, error: data.error }
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('删除用户失败:', error)
      return { success: false, error: '网络错误' }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [paramsString])

  return {
    users,
    loading: isFetching,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}
