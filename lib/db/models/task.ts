export interface Task {
  id: number
  title: string
  description?: string
  assignee_id?: number
  priority: '低' | '中' | '高' | '紧急'
  status: '待处理' | '进行中' | '已完成' | '已取消' | '逾期'
  progress: number
  due_date?: Date
  completed_at?: Date
  created_by?: number
  created_at: Date
  updated_at: Date
}

export interface CreateTaskData {
  title: string
  description?: string
  assignee_id?: number
  priority?: '低' | '中' | '高' | '紧急'
  status?: '待处理' | '进行中' | '已完成' | '已取消' | '逾期'
  progress?: number
  due_date?: Date
}

export interface UpdateTaskData {
  title?: string
  description?: string
  assignee_id?: number
  priority?: '低' | '中' | '高' | '紧急'
  status?: '待处理' | '进行中' | '已完成' | '已取消' | '逾期'
  progress?: number
  due_date?: Date
  completed_at?: Date
}

export interface TaskSearchParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  priority?: string
  assignee_id?: number
  created_by?: number
}

export interface TaskListResponse {
  data: Task[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
