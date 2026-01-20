import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { UserRepository } from '@/lib/db/repositories/user.repository'
import { CustomerRepository } from '@/lib/db/repositories/customer.repository'
import { TaskRepository } from '@/lib/db/repositories/task.repository'
import { ProjectRepository } from '@/lib/db/repositories/project.repository'
import { NotificationRepository } from '@/lib/db/repositories/notification.repository'
import { SystemRepository } from '@/lib/db/repositories/system.repository'

describe('UserRepository', () => {
  let userRepository: UserRepository

  beforeAll(() => {
    userRepository = new UserRepository()
  })

  it('should create a user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      real_name: '测试用户',
      role: 'user',
      department: '技术部',
      status: 'active' as const,
    }

    const user = await userRepository.create(userData)
    expect(user).toBeDefined()
    expect(user.username).toBe(userData.username)
    expect(user.email).toBe(userData.email)
  })

  it('should find user by id', async () => {
    const user = await userRepository.findById(1)
    expect(user).toBeDefined()
    expect(user?.id).toBe(1)
  })

  it('should find all users with pagination', async () => {
    const result = await userRepository.findAll({ page: 1, limit: 10 })
    expect(result.data).toBeInstanceOf(Array)
    expect(result.pagination).toBeDefined()
    expect(result.pagination.page).toBe(1)
    expect(result.pagination.limit).toBe(10)
  })

  it('should update user', async () => {
    const updatedUser = await userRepository.update(1, { real_name: '更新后的姓名' })
    expect(updatedUser).toBeDefined()
    expect(updatedUser?.real_name).toBe('更新后的姓名')
  })

  it('should get user stats', async () => {
    const stats = await userRepository.getStats()
    expect(stats).toBeDefined()
    expect(typeof stats.total).toBe('number')
    expect(typeof stats.active).toBe('number')
    expect(typeof stats.online).toBe('number')
    expect(typeof stats.newToday).toBe('number')
  })
})

describe('CustomerRepository', () => {
  let customerRepository: CustomerRepository

  beforeAll(() => {
    customerRepository = new CustomerRepository()
  })

  it('should create a customer', async () => {
    const customerData = {
      name: '测试客户',
      company: '测试公司',
      phone: '13800138000',
      email: 'customer@example.com',
      level: '普通' as const,
      status: '活跃' as const,
    }

    const customer = await customerRepository.create(customerData)
    expect(customer).toBeDefined()
    expect(customer.name).toBe(customerData.name)
  })

  it('should find customer by id', async () => {
    const customer = await customerRepository.findById(1)
    expect(customer).toBeDefined()
    expect(customer?.id).toBe(1)
  })

  it('should find all customers with pagination', async () => {
    const result = await customerRepository.findAll({ page: 1, limit: 10 })
    expect(result.data).toBeInstanceOf(Array)
    expect(result.pagination).toBeDefined()
  })

  it('should update customer', async () => {
    const updatedCustomer = await customerRepository.update(1, { level: 'VIP' as const })
    expect(updatedCustomer).toBeDefined()
    expect(updatedCustomer?.level).toBe('VIP')
  })

  it('should get customer stats', async () => {
    const stats = await customerRepository.getStats()
    expect(stats).toBeDefined()
    expect(typeof stats.total).toBe('number')
    expect(typeof stats.active).toBe('number')
    expect(typeof stats.vip).toBe('number')
  })
})

describe('TaskRepository', () => {
  let taskRepository: TaskRepository

  beforeAll(() => {
    taskRepository = new TaskRepository()
  })

  it('should create a task', async () => {
    const taskData = {
      title: '测试任务',
      description: '任务描述',
      assignee_id: 1,
      priority: '中' as const,
      status: '待处理' as const,
      progress: 0,
    }

    const task = await taskRepository.create(taskData)
    expect(task).toBeDefined()
    expect(task.title).toBe(taskData.title)
  })

  it('should find task by id', async () => {
    const task = await taskRepository.findById(1)
    expect(task).toBeDefined()
    expect(task?.id).toBe(1)
  })

  it('should find all tasks with pagination', async () => {
    const result = await taskRepository.findAll({ page: 1, limit: 10 })
    expect(result.data).toBeInstanceOf(Array)
    expect(result.pagination).toBeDefined()
  })

  it('should update task status', async () => {
    const updatedTask = await taskRepository.updateStatus(1, '进行中', 30)
    expect(updatedTask).toBeDefined()
    expect(updatedTask?.status).toBe('进行中')
    expect(updatedTask?.progress).toBe(30)
  })

  it('should get task stats', async () => {
    const stats = await taskRepository.getStats()
    expect(stats).toBeDefined()
    expect(typeof stats.total).toBe('number')
    expect(typeof stats.completed).toBe('number')
    expect(typeof stats.inProgress).toBe('number')
  })
})

describe('ProjectRepository', () => {
  let projectRepository: ProjectRepository

  beforeAll(() => {
    projectRepository = new ProjectRepository()
  })

  it('should create a project', async () => {
    const projectData = {
      name: '测试项目',
      description: '项目描述',
      manager_id: 1,
      team_size: 5,
      progress: 0,
      status: '计划中' as const,
      priority: '中' as const,
    }

    const project = await projectRepository.create(projectData)
    expect(project).toBeDefined()
    expect(project.name).toBe(projectData.name)
  })

  it('should find project by id', async () => {
    const project = await projectRepository.findById(1)
    expect(project).toBeDefined()
    expect(project?.id).toBe(1)
  })

  it('should find all projects with pagination', async () => {
    const result = await projectRepository.findAll({ page: 1, limit: 10 })
    expect(result.data).toBeInstanceOf(Array)
    expect(result.pagination).toBeDefined()
  })

  it('should update project', async () => {
    const updatedProject = await projectRepository.update(1, { progress: 50 })
    expect(updatedProject).toBeDefined()
    expect(updatedProject?.progress).toBe(50)
  })

  it('should get project stats', async () => {
    const stats = await projectRepository.getStats()
    expect(stats).toBeDefined()
    expect(typeof stats.total).toBe('number')
    expect(typeof stats.completed).toBe('number')
    expect(typeof stats.inProgress).toBe('number')
  })
})

describe('NotificationRepository', () => {
  let notificationRepository: NotificationRepository

  beforeAll(() => {
    notificationRepository = new NotificationRepository()
  })

  it('should create a notification', async () => {
    const notificationData = {
      title: '测试通知',
      message: '通知内容',
      type: 'system',
      priority: '普通' as const,
      user_id: 1,
    }

    const notification = await notificationRepository.create(notificationData)
    expect(notification).toBeDefined()
    expect(notification.title).toBe(notificationData.title)
  })

  it('should find notification by id', async () => {
    const notification = await notificationRepository.findById(1)
    expect(notification).toBeDefined()
    expect(notification?.id).toBe(1)
  })

  it('should mark notification as read', async () => {
    const updatedNotification = await notificationRepository.markAsRead(1)
    expect(updatedNotification).toBeDefined()
    expect(updatedNotification?.is_read).toBe(true)
    expect(updatedNotification?.read_at).toBeDefined()
  })

  it('should get unread count', async () => {
    const count = await notificationRepository.getUnreadCount(1)
    expect(typeof count).toBe('number')
    expect(count).toBeGreaterThanOrEqual(0)
  })
})

describe('SystemRepository', () => {
  let systemRepository: SystemRepository

  beforeAll(() => {
    systemRepository = new SystemRepository()
  })

  it('should get system setting', async () => {
    const setting = await systemRepository.getSetting('site_name')
    expect(setting).toBeDefined()
    expect(setting?.key).toBe('site_name')
  })

  it('should get all system settings', async () => {
    const settings = await systemRepository.getAllSettings()
    expect(settings).toBeInstanceOf(Array)
    expect(settings.length).toBeGreaterThan(0)
  })

  it('should update system setting', async () => {
    const updatedSetting = await systemRepository.updateSetting({
      key: 'test_key',
      value: 'test_value',
      category: 'test',
      description: '测试设置',
    })
    expect(updatedSetting).toBeDefined()
    expect(updatedSetting?.value).toBe('test_value')
  })

  it('should create finance record', async () => {
    const financeData = {
      type: 'income' as const,
      category: '服务费',
      amount: 10000,
      description: '测试收入',
    }

    const record = await systemRepository.createFinanceRecord(financeData)
    expect(record).toBeDefined()
    expect(record.amount).toBe(financeData.amount)
  })
})
