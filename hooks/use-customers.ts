import { useCustomerStore } from '@/store/customer-store'
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

export function useCustomers(params?: { page?: number; limit?: number; search?: string }) {
  const { customers, setCustomers, setLoading, setError } = useCustomerStore()
  const [isFetching, setIsFetching] = useState(false)

  const paramsString = useMemo(() => {
    return JSON.stringify(params)
  }, [params?.page, params?.limit, params?.search])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setIsFetching(true)

      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)

      const response = await fetch(`/api/customers?${queryParams.toString()}`)
      const data: ApiResponse<typeof customers[0]> = await response.json()

      if (data.success) {
        setCustomers(data.data)
        setError(null)
      } else {
        setError(data.error || '获取客户列表失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('获取客户列表失败:', error)
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }

  const createCustomer = async (customerData: Partial<typeof customers[0]>) => {
    try {
      setLoading(true)
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      })
      const data = await response.json()

      if (data.success) {
        await fetchCustomers()
        return { success: true, data: data.data }
      } else {
        setError(data.error || '创建客户失败')
        return { success: false, error: data.error }
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('创建客户失败:', error)
      return { success: false, error: '网络错误' }
    } finally {
      setLoading(false)
    }
  }

  const updateCustomer = async (id: number, customerData: Partial<typeof customers[0]>) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      })
      const data = await response.json()

      if (data.success) {
        await fetchCustomers()
        return { success: true, data: data.data }
      } else {
        setError(data.error || '更新客户失败')
        return { success: false, error: data.error }
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('更新客户失败:', error)
      return { success: false, error: '网络错误' }
    } finally {
      setLoading(false)
    }
  }

  const deleteCustomer = async (id: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (data.success) {
        await fetchCustomers()
        return { success: true }
      } else {
        setError(data.error || '删除客户失败')
        return { success: false, error: data.error }
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
      console.error('删除客户失败:', error)
      return { success: false, error: '网络错误' }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [paramsString])

  return {
    customers,
    loading: isFetching,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  }
}
