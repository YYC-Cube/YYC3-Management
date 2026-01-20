import { describe, it, expect } from 'vitest'

describe('API Integration Tests', () => {
  const API_BASE_URL = 'http://localhost:3223/api'

  it('should get health status', async () => {
    const response = await fetch(`${API_BASE_URL}/health`)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.status).toBe('ok')
  })

  describe('Users API', () => {
    it('should get users list', async () => {
      const response = await fetch(`${API_BASE_URL}/users?page=1&limit=10`)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.pagination).toBeDefined()
    })

    it('should create a user', async () => {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: `testuser_${Date.now()}`,
          email: `test${Date.now()}@example.com`,
          real_name: '测试用户',
          role: 'user',
          status: 'active',
        }),
      })
      const data = await response.json()
      
      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
    })

    it('should get user by id', async () => {
      const response = await fetch(`${API_BASE_URL}/users/1`)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(data.data.id).toBe(1)
    })

    it('should update user', async () => {
      const response = await fetch(`${API_BASE_URL}/users/1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          real_name: '更新后的姓名',
        }),
      })
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('Customers API', () => {
    it('should get customers list', async () => {
      const response = await fetch(`${API_BASE_URL}/customers?page=1&limit=10`)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
    })

    it('should create a customer', async () => {
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '测试客户',
          company: '测试公司',
          phone: '13800138000',
          email: 'customer@example.com',
          level: '普通',
          status: '活跃',
        }),
      })
      const data = await response.json()
      
      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
    })
  })

  describe('Tasks API', () => {
    it('should get tasks list', async () => {
      const response = await fetch(`${API_BASE_URL}/tasks?page=1&limit=10`)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
    })

    it('should create a task', async () => {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '测试任务',
          description: '任务描述',
          assignee_id: 1,
          priority: '中',
          status: '待处理',
          progress: 0,
        }),
      })
      const data = await response.json()
      
      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
    })
  })

  describe('Projects API', () => {
    it('should get projects list', async () => {
      const response = await fetch(`${API_BASE_URL}/projects?page=1&limit=10`)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
    })

    it('should create a project', async () => {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '测试项目',
          description: '项目描述',
          manager_id: 1,
          team_size: 5,
          progress: 0,
          status: '计划中',
          priority: '中',
        }),
      })
      const data = await response.json()
      
      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
    })
  })

  describe('Notifications API', () => {
    it('should get notifications list', async () => {
      const response = await fetch(`${API_BASE_URL}/notifications?page=1&limit=10`)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
    })

    it('should create a notification', async () => {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '测试通知',
          message: '通知内容',
          type: 'system',
          priority: '普通',
          user_id: 1,
        }),
      })
      const data = await response.json()
      
      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
    })
  })

  describe('System Settings API', () => {
    it('should get system settings', async () => {
      const response = await fetch(`${API_BASE_URL}/system/settings`)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
    })

    it('should update system setting', async () => {
      const response = await fetch(`${API_BASE_URL}/system/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'test_key',
          value: 'test_value',
          category: 'test',
          description: '测试设置',
        }),
      })
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
})
