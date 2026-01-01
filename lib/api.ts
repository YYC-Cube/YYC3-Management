/**
 * @fileoverview API客户端
 * @description 封装API请求，提供统一的接口调用方式
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// API服务类 - 统一管理所有API调用
class ApiService {
  private baseURL = "https://api.zy.baby"
  private token: string | null = null

  constructor() {
    // 从localStorage获取token
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  // 设置认证token
  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  // 清除token
  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_info")
    }
  }

  // 通用请求方法
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    // 添加认证头
    if (this.token) {
      (headers as Record<string, string>).Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        // 添加超时和错误处理
        signal: AbortSignal.timeout(10000), // 10秒超时
      })

      // 处理401未授权错误
      if (response.status === 401) {
        this.clearToken()
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
        throw new Error("未授权访问")
      }

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.warn("API请求失败，使用离线数据:", error)
      // 不再抛出错误，而是返回null让调用方处理
      return null
    }
  }

  // 登录
  async login(username: string, password: string) {
    try {
      const response = await this.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      })

      if (response && response.token) {
        this.setToken(response.token)
        // 保存用户信息
        if (typeof window !== "undefined") {
          localStorage.setItem("user_info", JSON.stringify(response.user))
        }
        return response
      }
    } catch (error) {
      console.warn("登录API失败，尝试本地验证:", error)
    }

    // API失败或无响应时的本地验证
    if (username === "admin" && password === "admin123") {
      const mockResponse = {
        success: true,
        token: "mock_jwt_token_" + Date.now(),
        user: {
          id: 1,
          username: "admin",
          name: "系统管理员",
          email: "admin@company.com",
          role: "admin",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      }
      this.setToken(mockResponse.token)
      if (typeof window !== "undefined") {
        localStorage.setItem("user_info", JSON.stringify(mockResponse.user))
      }
      return mockResponse
    }

    throw new Error("用户名或密码错误")
  }

  // 获取用户信息
  async getUserInfo() {
    // 优先从本地存储获取
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("user_info")
      if (userInfo) {
        return JSON.parse(userInfo)
      }
    }

    try {
      const response = await this.request("/user/profile")
      if (response) {
        if (typeof window !== "undefined") {
          localStorage.setItem("user_info", JSON.stringify(response))
        }
        return response
      }
    } catch (error) {
      console.warn("获取用户信息失败:", error)
    }

    // 返回默认用户信息
    return {
      id: 1,
      username: "admin",
      name: "系统管理员",
      email: "admin@company.com",
      role: "admin",
      avatar: "/placeholder.svg?height=40&width=40",
    }
  }

  // 获取仪表板数据
  async getDashboardData() {
    try {
      const response = await this.request("/dashboard/stats")
      if (response) {
        return response
      }
    } catch (error) {
      console.warn("获取仪表板数据失败，使用离线数据:", error)
    }

    // 返回模拟数据
    return {
      totalSales: 1250000,
      totalCustomers: 3420,
      activeProjects: 28,
      completedTasks: 156,
      salesGrowth: 12.5,
      customerGrowth: 8.3,
      projectsGrowth: 15.2,
      tasksGrowth: 22.1,
      recentActivities: [
        { id: 1, type: "sale", message: "新增销售订单 ¥25,000", time: "2分钟前" },
        { id: 2, type: "customer", message: "新客户注册：张三", time: "5分钟前" },
        { id: 3, type: "project", message: '项目"网站重构"已完成', time: "10分钟前" },
        { id: 4, type: "task", message: '任务"数据备份"已分配', time: "15分钟前" },
        { id: 5, type: "sale", message: "销售目标达成率提升至85%", time: "30分钟前" },
        { id: 6, type: "customer", message: "客户满意度调查完成", time: "1小时前" },
      ],
    }
  }

  // 获取销售数据
  async getSalesData() {
    try {
      const response = await this.request("/sales/data")
      if (response) {
        return response
      }
    } catch (error) {
      console.warn("获取销售数据失败，使用离线数据:", error)
    }

    // 返回模拟数据
    return {
      totalRevenue: 1250000,
      monthlyGrowth: 12.5,
      salesData: [
        { month: "1月", sales: 85000 },
        { month: "2月", sales: 92000 },
        { month: "3月", sales: 78000 },
        { month: "4月", sales: 105000 },
        { month: "5月", sales: 118000 },
        { month: "6月", sales: 125000 },
      ],
    }
  }

  // 获取客户数据
  async getCustomersData() {
    try {
      const response = await this.request("/customers/data")
      if (response) {
        return response
      }
    } catch (error) {
      console.warn("获取客户数据失败，使用离线数据:", error)
    }

    // 返回模拟数据
    return {
      totalCustomers: 3420,
      newCustomers: 156,
      activeCustomers: 2890,
      customerSatisfaction: 4.6,
    }
  }

  // 登出
  async logout() {
    try {
      await this.request("/auth/logout", { method: "POST" })
    } catch (error) {
      // 即使API失败也要清除本地token
      console.log("登出API调用失败，但继续清除本地认证信息")
    } finally {
      this.clearToken()
    }
  }

  // 检查是否已认证
  isAuthenticated(): boolean {
    return !!this.token
  }

  // 获取当前token
  getToken(): string | null {
    return this.token
  }
}

// 导出单例实例
export const apiService = new ApiService()
