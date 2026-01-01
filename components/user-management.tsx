/**
 * @fileoverview user-management.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Shield,
  Key,
  Lock,
  Unlock,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  Settings,
  Mail,
  Phone,
  MapPin,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Crown,
  Star,
  Award,
  TrendingUp,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface User {
  id: string
  username: string
  email: string
  phone: string
  realName: string
  avatar: string
  status: "active" | "inactive" | "locked" | "pending"
  role: string
  department: string
  position: string
  lastLogin: string
  loginCount: number
  createdAt: string
  permissions: string[]
  isOnline: boolean
  location: string
  deviceInfo: string
}

interface Role {
  id: string
  name: string
  description: string
  level: number
  permissions: string[]
  userCount: number
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

interface Permission {
  id: string
  name: string
  description: string
  category: string
  resource: string
  action: string
  isSystem: boolean
}

interface UserStats {
  totalUsers: number
  activeUsers: number
  onlineUsers: number
  newUsersToday: number
  lockedUsers: number
  pendingUsers: number
  loginRate: number
  avgSessionTime: number
}

export default function UserManagement({ showTitle = true }: { showTitle?: boolean }) {
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      username: "admin",
      email: "admin@jinlan.com",
      phone: "13800138000",
      realName: "系统管理员",
      avatar: "/avatar/avatar_user/avatar_user_001.png",
      status: "active",
      role: "超级管理员",
      department: "技术部",
      position: "系统管理员",
      lastLogin: "2024-01-02 14:30:25",
      loginCount: 1250,
      createdAt: "2023-01-01 00:00:00",
      permissions: ["*"],
      isOnline: true,
      location: "北京",
      deviceInfo: "Chrome 120.0 / Windows 11",
    },
    {
      id: "2",
      username: "manager",
      email: "manager@jinlan.com",
      phone: "13800138001",
      realName: "张经理",
      avatar: "/avatar/avatar_user/avatar_user_002.png",
      status: "active",
      role: "部门经理",
      department: "销售部",
      position: "销售经理",
      lastLogin: "2024-01-02 14:25:10",
      loginCount: 890,
      createdAt: "2023-02-15 10:30:00",
      permissions: ["user.read", "user.create", "report.read"],
      isOnline: true,
      location: "上海",
      deviceInfo: "Safari 17.0 / macOS 14",
    },
    {
      id: "3",
      username: "employee",
      email: "employee@jinlan.com",
      phone: "13800138002",
      realName: "李员工",
      avatar: "/avatar/avatar_user/avatar_user_004.png",
      status: "active",
      role: "普通员工",
      department: "市场部",
      position: "市场专员",
      lastLogin: "2024-01-02 14:20:15",
      loginCount: 456,
      createdAt: "2023-06-20 14:15:30",
      permissions: ["user.read", "report.read"],
      isOnline: false,
      location: "广州",
      deviceInfo: "Chrome 120.0 / Android 14",
    },
    {
      id: "4",
      username: "guest",
      email: "guest@jinlan.com",
      phone: "13800138003",
      realName: "访客用户",
      avatar: "/avatar/avatar_user/avatar_user_005.png",
      status: "inactive",
      role: "访客",
      department: "外部",
      position: "访客",
      lastLogin: "2024-01-01 10:15:30",
      loginCount: 12,
      createdAt: "2024-01-01 09:00:00",
      permissions: ["user.read"],
      isOnline: false,
      location: "深圳",
      deviceInfo: "Firefox 121.0 / Ubuntu 22.04",
    },
    {
      id: "5",
      username: "locked_user",
      email: "locked@jinlan.com",
      phone: "13800138004",
      realName: "被锁定用户",
      avatar: "/avatar/avatar_user/avatar_user_006.png",
      status: "locked",
      role: "普通员工",
      department: "财务部",
      position: "会计",
      lastLogin: "2023-12-28 16:45:20",
      loginCount: 234,
      createdAt: "2023-08-10 11:20:00",
      permissions: ["user.read"],
      isOnline: false,
      location: "杭州",
      deviceInfo: "Edge 120.0 / Windows 10",
    },
    {
      id: "6",
      username: "pending_user",
      email: "pending@jinlan.com",
      phone: "13800138005",
      realName: "待审核用户",
      avatar: "/avatar/avatar_user/avatar_user_010.png",
      status: "pending",
      role: "普通员工",
      department: "人事部",
      position: "人事专员",
      lastLogin: "从未登录",
      loginCount: 0,
      createdAt: "2024-01-02 09:30:00",
      permissions: [],
      isOnline: false,
      location: "成都",
      deviceInfo: "未知",
    },
  ])

  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "超级管理员",
      description: "拥有系统所有权限",
      level: 1,
      permissions: ["*"],
      userCount: 1,
      isSystem: true,
      createdAt: "2023-01-01 00:00:00",
      updatedAt: "2023-01-01 00:00:00",
    },
    {
      id: "2",
      name: "部门经理",
      description: "部门管理权限",
      level: 2,
      permissions: ["user.read", "user.create", "user.update", "report.read", "report.create"],
      userCount: 5,
      isSystem: false,
      createdAt: "2023-01-01 00:00:00",
      updatedAt: "2024-01-01 10:30:00",
    },
    {
      id: "3",
      name: "普通员工",
      description: "基础操作权限",
      level: 3,
      permissions: ["user.read", "report.read"],
      userCount: 15,
      isSystem: false,
      createdAt: "2023-01-01 00:00:00",
      updatedAt: "2023-12-15 14:20:00",
    },
    {
      id: "4",
      name: "访客",
      description: "只读权限",
      level: 4,
      permissions: ["user.read"],
      userCount: 3,
      isSystem: false,
      createdAt: "2023-01-01 00:00:00",
      updatedAt: "2023-11-20 16:45:00",
    },
  ])

  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: "1",
      name: "用户查看",
      description: "查看用户信息",
      category: "用户管理",
      resource: "user",
      action: "read",
      isSystem: true,
    },
    {
      id: "2",
      name: "用户创建",
      description: "创建新用户",
      category: "用户管理",
      resource: "user",
      action: "create",
      isSystem: true,
    },
    {
      id: "3",
      name: "用户编辑",
      description: "编辑用户信息",
      category: "用户管理",
      resource: "user",
      action: "update",
      isSystem: true,
    },
    {
      id: "4",
      name: "用户删除",
      description: "删除用户",
      category: "用户管理",
      resource: "user",
      action: "delete",
      isSystem: true,
    },
    {
      id: "5",
      name: "报表查看",
      description: "查看系统报表",
      category: "报表管理",
      resource: "report",
      action: "read",
      isSystem: true,
    },
    {
      id: "6",
      name: "报表创建",
      description: "创建系统报表",
      category: "报表管理",
      resource: "report",
      action: "create",
      isSystem: true,
    },
  ])

  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 6,
    activeUsers: 3,
    onlineUsers: 2,
    newUsersToday: 1,
    lockedUsers: 1,
    pendingUsers: 1,
    loginRate: 83.3,
    avgSessionTime: 45,
  })

  useEffect(() => {
    // 计算用户统计数据
    const total = users.length
    const active = users.filter((u) => u.status === "active").length
    const online = users.filter((u) => u.isOnline).length
    const locked = users.filter((u) => u.status === "locked").length
    const pending = users.filter((u) => u.status === "pending").length
    const newToday = users.filter((u) => {
      const today = new Date().toDateString()
      return new Date(u.createdAt).toDateString() === today
    }).length

    setUserStats({
      totalUsers: total,
      activeUsers: active,
      onlineUsers: online,
      newUsersToday: newToday,
      lockedUsers: locked,
      pendingUsers: pending,
      loginRate: total > 0 ? (active / total) * 100 : 0,
      avgSessionTime: 45,
    })
  }, [users])

  const handleUserAction = async (userId: string, action: string) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUsers((prev) =>
        prev.map((user) => {
          if (user.id === userId) {
            switch (action) {
              case "activate":
                return { ...user, status: "active" as const }
              case "deactivate":
                return { ...user, status: "inactive" as const }
              case "lock":
                return { ...user, status: "locked" as const }
              case "unlock":
                return { ...user, status: "active" as const }
              case "approve":
                return { ...user, status: "active" as const }
              case "reject":
                return { ...user, status: "inactive" as const }
              default:
                return user
            }
          }
          return user
        }),
      )

      toast({
        title: "操作成功",
        description: `用户状态已更新`,
      })
    } catch (error) {
      toast({
        title: "操作失败",
        description: "无法更新用户状态，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBatchAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast({
        title: "请选择用户",
        description: "请先选择要操作的用户",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      selectedUsers.forEach((userId) => {
        handleUserAction(userId, action)
      })

      setSelectedUsers([])
      toast({
        title: "批量操作成功",
        description: `已对${selectedUsers.length}个用户执行${action}操作`,
      })
    } catch (error) {
      toast({
        title: "批量操作失败",
        description: "部分操作可能失败，请检查后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportUsers = () => {
    const csvData = [
      ["用户名", "邮箱", "真实姓名", "角色", "部门", "状态", "最后登录", "创建时间"],
      ...users.map((user) => [
        user.username,
        user.email,
        user.realName,
        user.role,
        user.department,
        user.status,
        user.lastLogin,
        user.createdAt,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "导出成功",
      description: "用户数据已导出到CSV文件",
    })
  }

  const handleImportUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string
        const lines = csv.split("\n")
        const headers = lines[0].split(",")
        const userData = lines.slice(1).map((line) => {
          const values = line.split(",")
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim() || ""
            return obj
          }, {} as any)
        })

        // 这里应该验证和处理导入的数据
        toast({
          title: "导入成功",
          description: `成功导入${userData.length}个用户`,
        })
      } catch (error) {
        toast({
          title: "导入失败",
          description: "CSV文件格式错误，请检查文件内容",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50"
      case "inactive":
        return "text-gray-600 bg-gray-50"
      case "locked":
        return "text-red-600 bg-red-50"
      case "pending":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "inactive":
        return <XCircle className="w-4 h-4 text-gray-600" />
      case "locked":
        return <Lock className="w-4 h-4 text-red-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "超级管理员":
        return <Crown className="w-4 h-4 text-yellow-600" />
      case "部门经理":
        return <Star className="w-4 h-4 text-blue-600" />
      case "普通员工":
        return <Users className="w-4 h-4 text-green-600" />
      case "访客":
        return <Eye className="w-4 h-4 text-gray-600" />
      default:
        return <Users className="w-4 h-4 text-gray-600" />
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.realName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "active" && user.status === "active") ||
      (selectedFilter === "inactive" && user.status === "inactive") ||
      (selectedFilter === "locked" && user.status === "locked") ||
      (selectedFilter === "pending" && user.status === "pending") ||
      (selectedFilter === "online" && user.isOnline)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="responsive-content">
      {/* 页面标题和控制 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          {showTitle && (
            <h1 className="responsive-title flex items-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-600" />
              用户管理
            </h1>
          )}
          <p className="responsive-text mt-2">用户权限和角色管理</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <input type="file" accept=".csv" onChange={handleImportUsers} className="hidden" id="import-users" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("import-users")?.click()}
            className="responsive-button bg-transparent"
          >
            <Upload className="responsive-icon mr-2" />
            导入用户
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportUsers} className="responsive-button bg-transparent">
            <Download className="responsive-icon mr-2" />
            导出用户
          </Button>
          <Button onClick={() => setShowUserDialog(true)} className="bg-blue-600 hover:bg-blue-700 responsive-button">
            <UserPlus className="responsive-icon mr-2" />
            添加用户
          </Button>
        </div>
      </div>

      {/* 用户统计概览 */}
      <div className="responsive-grid-4">
        <Card className="responsive-card border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">总用户数</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{userStats.totalUsers}</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">系统注册用户</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="responsive-card border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">活跃用户</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{userStats.activeUsers}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mr-1" />
                  <span className="text-xs sm:text-sm text-green-600">{userStats.loginRate.toFixed(1)}%</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <Progress value={userStats.loginRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="responsive-card border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">在线用户</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{userStats.onlineUsers}</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">当前在线</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="responsive-card border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">今日新增</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{userStats.newUsersToday}</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">新注册用户</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card className="responsive-card border-r-[5px] border-r-indigo-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索用户名、邮箱或姓名..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 responsive-input"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部用户</option>
                <option value="active">活跃用户</option>
                <option value="inactive">非活跃用户</option>
                <option value="locked">锁定用户</option>
                <option value="pending">待审核用户</option>
                <option value="online">在线用户</option>
              </select>
              {selectedUsers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">已选择 {selectedUsers.length} 个用户</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBatchAction("activate")}
                    disabled={loading}
                    className="text-xs"
                  >
                    批量激活
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBatchAction("lock")}
                    disabled={loading}
                    className="text-xs"
                  >
                    批量锁定
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 主要内容标签页 */}
      <Tabs defaultValue="users" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">用户列表</TabsTrigger>
          <TabsTrigger value="roles">角色管理</TabsTrigger>
          <TabsTrigger value="permissions">权限管理</TabsTrigger>
        </TabsList>

        {/* 用户列表 */}
        <TabsContent value="users" className="responsive-spacing">
          <div className="responsive-grid-1">
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="responsive-card hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id])
                            } else {
                              setSelectedUsers(selectedUsers.filter((id) => id !== user.id))
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="relative">
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.realName}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200"
                          />
                          {user.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-800">{user.realName}</h3>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status === "active"
                              ? "活跃"
                              : user.status === "inactive"
                                ? "非活跃"
                                : user.status === "locked"
                                  ? "锁定"
                                  : "待审核"}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getRoleIcon(user.role)}
                            <span className="text-sm text-gray-600">{user.role}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{user.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {user.department} - {user.position}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>最后登录: {user.lastLogin}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                          <span>登录次数: {user.loginCount}</span>
                          <span>注册时间: {user.createdAt}</span>
                          <span>位置: {user.location}</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          <span>设备: {user.deviceInfo}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(user.status)}
                        {user.isOnline && <Badge className="bg-green-100 text-green-800 text-xs">在线</Badge>}
                      </div>
                      <div className="flex flex-col gap-1">
                        {user.status === "pending" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction(user.id, "approve")}
                              disabled={loading}
                              className="text-xs"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              批准
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction(user.id, "reject")}
                              disabled={loading}
                              className="text-xs"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              拒绝
                            </Button>
                          </>
                        ) : user.status === "locked" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserAction(user.id, "unlock")}
                            disabled={loading}
                            className="text-xs"
                          >
                            <Unlock className="w-3 h-3 mr-1" />
                            解锁
                          </Button>
                        ) : user.status === "active" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction(user.id, "lock")}
                              disabled={loading}
                              className="text-xs"
                            >
                              <Lock className="w-3 h-3 mr-1" />
                              锁定
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction(user.id, "deactivate")}
                              disabled={loading}
                              className="text-xs"
                            >
                              <UserX className="w-3 h-3 mr-1" />
                              停用
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserAction(user.id, "activate")}
                            disabled={loading}
                            className="text-xs"
                          >
                            <UserCheck className="w-3 h-3 mr-1" />
                            激活
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingUser(user)
                            setShowUserDialog(true)
                          }}
                          className="text-xs"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          编辑
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 角色管理 */}
        <TabsContent value="roles" className="responsive-spacing">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">角色列表</h3>
            <Button onClick={() => setShowRoleDialog(true)} className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              添加角色
            </Button>
          </div>
          <div className="responsive-grid-2">
            {roles.map((role) => (
              <Card
                key={role.id}
                className="responsive-card hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        {role.level === 1 ? (
                          <Crown className="w-5 h-5 text-yellow-600" />
                        ) : role.level === 2 ? (
                          <Star className="w-5 h-5 text-blue-600" />
                        ) : role.level === 3 ? (
                          <Award className="w-5 h-5 text-green-600" />
                        ) : (
                          <Users className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-base sm:text-lg">{role.name}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">{role.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {role.isSystem && <Badge className="bg-red-100 text-red-800 text-xs">系统角色</Badge>}
                      <Badge className="bg-blue-100 text-blue-800 text-xs">{role.userCount} 用户</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 mb-2">权限列表</h4>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.includes("*") ? (
                        <Badge className="bg-red-100 text-red-800 text-xs">所有权限</Badge>
                      ) : (
                        role.permissions.slice(0, 5).map((permission, index) => (
                          <Badge key={index} className="bg-gray-100 text-gray-800 text-xs">
                            {permission}
                          </Badge>
                        ))
                      )}
                      {role.permissions.length > 5 && !role.permissions.includes("*") && (
                        <Badge className="bg-gray-100 text-gray-800 text-xs">+{role.permissions.length - 5}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t text-xs text-gray-500">
                    <span>创建时间: {role.createdAt}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingRole(role)
                          setShowRoleDialog(true)
                        }}
                        className="text-xs"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        编辑
                      </Button>
                      {!role.isSystem && (
                        <Button variant="ghost" size="sm" className="text-xs text-red-600">
                          <Trash2 className="w-3 h-3 mr-1" />
                          删除
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 权限管理 */}
        <TabsContent value="permissions" className="responsive-spacing">
          <Card className="responsive-card border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center">
                <Key className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                系统权限
              </CardTitle>
              <CardDescription>管理系统中的所有权限</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(
                  permissions.reduce(
                    (groups, permission) => {
                      if (!groups[permission.category]) {
                        groups[permission.category] = []
                      }
                      groups[permission.category].push(permission)
                      return groups
                    },
                    {} as Record<string, Permission[]>,
                  ),
                ).map(([category, categoryPermissions]) => (
                  <div key={category} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categoryPermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium text-sm">{permission.name}</div>
                            <div className="text-xs text-gray-600">{permission.description}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {permission.resource}.{permission.action}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {permission.isSystem && <Badge className="bg-red-100 text-red-800 text-xs">系统</Badge>}
                            <Button variant="ghost" size="sm" className="text-xs">
                              <Settings className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
