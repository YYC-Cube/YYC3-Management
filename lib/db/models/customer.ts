export interface Customer {
  id: number
  name: string
  company?: string
  phone?: string
  email?: string
  level: '普通' | '重要' | 'VIP'
  status: '活跃' | '潜在' | '休眠'
  address?: string
  notes?: string
  created_by?: number
  created_at: Date
  updated_at: Date
}

export interface CreateCustomerData {
  name: string
  company?: string
  phone?: string
  email?: string
  level?: '普通' | '重要' | 'VIP'
  status?: '活跃' | '潜在' | '休眠'
  address?: string
  notes?: string
}

export interface UpdateCustomerData {
  name?: string
  company?: string
  phone?: string
  email?: string
  level?: '普通' | '重要' | 'VIP'
  status?: '活跃' | '潜在' | '休眠'
  address?: string
  notes?: string
}

export interface CustomerSearchParams {
  page?: number
  limit?: number
  search?: string
  level?: string
  status?: string
}

export interface CustomerListResponse {
  data: Customer[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
