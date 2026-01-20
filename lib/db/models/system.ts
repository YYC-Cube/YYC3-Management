export interface SystemSetting {
  id: number
  key: string
  value?: string
  category?: string
  description?: string
  updated_by?: number
  updated_at: Date
}

export interface UpdateSystemSettingData {
  key: string
  value: string
  category?: string
  description?: string
}

export interface SystemLog {
  id: number
  level: 'info' | 'warning' | 'error' | 'debug'
  action: string
  module?: string
  user_id?: number
  ip_address?: string
  user_agent?: string
  request_data?: any
  response_data?: any
  error_message?: string
  stack_trace?: string
  duration?: number
  created_at: Date
}

export interface SystemMonitorData {
  cpu: number
  memory: number
  disk: number
  network: number
  uptime: number
}

export interface FinanceRecord {
  id: number
  type: 'income' | 'expense'
  category: string
  amount: number
  description?: string
  reference_id?: string
  reference_type?: string
  created_by?: number
  created_at: Date
}

export interface CreateFinanceRecordData {
  type: 'income' | 'expense'
  category: string
  amount: number
  description?: string
  reference_id?: string
  reference_type?: string
}

export interface OKRObjective {
  id: number
  title: string
  description?: string
  owner_id?: number
  department?: string
  period: string
  status: '计划中' | '进行中' | '已完成' | '已延期'
  progress: number
  start_date?: Date
  end_date?: Date
  created_by?: number
  created_at: Date
  updated_at: Date
}

export interface OKRKeyResult {
  id: number
  objective_id: number
  title: string
  description?: string
  target_value?: number
  current_value: number
  unit?: string
  status: '进行中' | '已完成' | '未达成'
  due_date?: Date
  assignee_id?: number
  created_at: Date
  updated_at: Date
}
