export interface User {
  id: number
  username: string
  email: string
  phone?: string
  real_name?: string
  avatar?: string
  status: 'active' | 'inactive' | 'locked' | 'pending'
  role?: string
  department?: string
  position?: string
  last_login?: Date
  login_count: number
  is_online: boolean
  location?: string
  device_info?: string
  created_by?: number
  created_at: Date
  updated_at: Date
}

export interface CreateUserData {
  username: string
  email: string
  phone?: string
  real_name?: string
  avatar?: string
  role?: string
  department?: string
  position?: string
  status?: 'active' | 'inactive' | 'locked' | 'pending'
}

export interface UpdateUserData {
  username?: string
  email?: string
  phone?: string
  real_name?: string
  avatar?: string
  role?: string
  department?: string
  position?: string
  status?: 'active' | 'inactive' | 'locked' | 'pending'
  is_online?: boolean
  location?: string
  device_info?: string
}

export interface UserSearchParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  department?: string
  role?: string
}

export interface UserListResponse {
  data: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
