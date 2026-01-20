export interface Project {
  id: number
  name: string
  description?: string
  manager_id?: number
  team_size: number
  progress: number
  status: '计划中' | '进行中' | '已完成' | '已暂停' | '延期'
  priority: '低' | '中' | '高'
  start_date?: Date
  end_date?: Date
  budget?: number
  type?: string
  created_by?: number
  created_at: Date
  updated_at: Date
}

export interface CreateProjectData {
  name: string
  description?: string
  manager_id?: number
  team_size?: number
  progress?: number
  status?: '计划中' | '进行中' | '已完成' | '已暂停' | '延期'
  priority?: '低' | '中' | '高'
  start_date?: Date
  end_date?: Date
  budget?: number
  type?: string
}

export interface UpdateProjectData {
  name?: string
  description?: string
  manager_id?: number
  team_size?: number
  progress?: number
  status?: '计划中' | '进行中' | '已完成' | '已暂停' | '延期'
  priority?: '低' | '中' | '高'
  start_date?: Date
  end_date?: Date
  budget?: number
  type?: string
}

export interface ProjectSearchParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  priority?: string
  manager_id?: number
  type?: string
}

export interface ProjectListResponse {
  data: Project[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
