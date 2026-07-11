export const mockUser = {
  id: 1,
  username: 'testadmin',
  email: 'admin@test.com',
  phone: '13800138000',
  real_name: '测试管理员',
  avatar: null,
  status: 'active',
  role: 'admin',
  department: '技术部',
  position: '工程师',
  is_online: true,
  login_count: 42,
  last_login: new Date('2026-01-15T10:00:00Z').toISOString(),
  created_at: new Date('2025-06-01T00:00:00Z').toISOString(),
  updated_at: new Date('2026-01-15T10:00:00Z').toISOString(),
}

export const mockCustomer = {
  id: 1,
  name: '张三',
  company: '测试科技有限公司',
  phone: '13900139000',
  email: 'zhangsan@test.com',
  level: 'VIP',
  status: '活跃',
  address: '北京市朝阳区测试路123号',
  notes: '重要客户',
  created_at: new Date('2025-09-01T00:00:00Z').toISOString(),
  updated_at: new Date('2026-01-10T00:00:00Z').toISOString(),
}

export const mockTask = {
  id: 1,
  title: '完成季度报告',
  description: '整理Q4数据并生成分析报告',
  assignee_id: 1,
  assignee_name: '测试管理员',
  priority: '高',
  status: '进行中',
  progress: 60,
  due_date: '2026-01-31',
  completed_at: null,
  created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
  updated_at: new Date('2026-01-15T00:00:00Z').toISOString(),
}

export const mockProject = {
  id: 1,
  name: '企业管理系统升级',
  description: 'Next.js 14迁移至16，升级全部依赖',
  manager_id: 1,
  manager_name: '测试管理员',
  team_size: 5,
  progress: 75,
  status: '进行中',
  priority: '高',
  start_date: '2025-12-01',
  end_date: '2026-03-31',
  budget: 500000,
  type: '内部项目',
  created_at: new Date('2025-12-01T00:00:00Z').toISOString(),
  updated_at: new Date('2026-01-15T00:00:00Z').toISOString(),
}

export const mockNotification = {
  id: 'notif_001',
  title: '新客户注册',
  message: '张三刚刚注册了账户',
  type: 'info',
  read: false,
  created_at: new Date().toISOString(),
}

export function createMockUserList(count: number = 5) {
  return Array.from({ length: count }, (_, i) => ({
    ...mockUser,
    id: i + 1,
    username: `user${i + 1}`,
    email: `user${i + 1}@test.com`,
    real_name: `用户${i + 1}`,
  }))
}

export function createMockCustomerList(count: number = 5) {
  const levels = ['普通', 'VIP', '银卡', '金卡']
  const statuses = ['活跃', ' inactive', '潜在']
  return Array.from({ length: count }, (_, i) => ({
    ...mockCustomer,
    id: i + 1,
    name: `客户${i + 1}`,
    company: `公司${i + 1}`,
    level: levels[i % levels.length],
    status: statuses[i % statuses.length],
  }))
}

export function createMockTaskList(count: number = 5) {
  const priorities = ['低', '中', '高', '紧急']
  const statuses = ['待处理', '进行中', '已完成', '已取消']
  return Array.from({ length: count }, (_, i) => ({
    ...mockTask,
    id: i + 1,
    title: `任务${i + 1}`,
    priority: priorities[i % priorities.length],
    status: statuses[i % statuses.length],
    progress: i * 20,
  }))
}

export function createMockProjectList(count: number = 5) {
  const statuses = ['进行中', '已完成', '延期', '暂停']
  return Array.from({ length: count }, (_, i) => ({
    ...mockProject,
    id: i + 1,
    name: `项目${i + 1}`,
    status: statuses[i % statuses.length],
    progress: i * 20,
  }))
}

export const mockApiResponses = {
  usersList: { success: true, data: createMockUserList(), pagination: { page: 1, limit: 10, total: 5, totalPages: 1 } },
  customersList: { success: true, data: createMockCustomerList(), pagination: { page: 1, limit: 10, total: 5, totalPages: 1 } },
  tasksList: { success: true, data: createMockTaskList(), pagination: { page: 1, limit: 10, total: 5, totalPages: 1 } },
  projectsList: { success: true, data: createMockProjectList(), pagination: { page: 1, limit: 10, total: 5, totalPages: 1 } },
  userCreated: { success: true, data: mockUser },
  customerCreated: { success: true, data: mockCustomer },
  taskCreated: { success: true, data: mockTask },
  projectCreated: { success: true, data: mockProject },
  healthOk: { status: 'ok', timestamp: new Date().toISOString() },
  unauthorized: { success: false, error: '未提供认证令牌', code: 'NO_TOKEN' },
  validationError: { success: false, error: '数据验证失败', details: [{ message: '必填字段' }] },
}
