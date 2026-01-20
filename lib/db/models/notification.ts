export interface Notification {
  id: number
  title: string
  message: string
  type: string
  priority: '低' | '普通' | '高' | '紧急'
  user_id?: number
  from_user?: string
  is_read: boolean
  read_at?: Date
  created_at: Date
}

export interface CreateNotificationData {
  title: string
  message: string
  type: string
  priority?: '低' | '普通' | '高' | '紧急'
  user_id?: number
  from_user?: string
}

export interface NotificationSearchParams {
  page?: number
  limit?: number
  user_id?: number
  is_read?: boolean
  type?: string
  priority?: string
}

export interface NotificationListResponse {
  data: Notification[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
