/**
 * @fileoverview user-management.tsx
 * @description 用户管理组件 - 集成真实API
 * @author YYC³
 * @version 2.0.1
 * @created 2025-01-19
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Loader2,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useUsers } from "@/hooks/use-users"
import { useFormValidation } from "@/hooks/use-form-validation"
import { userFormSchema } from "@/lib/utils/form-validation"
import { FormFieldError } from "@/components/ui/form-error"
import { DataImportExport } from "@/components/ui/data-import-export"
import { AdvancedSearchBar } from "@/components/ui/advanced-search-bar"
import { BatchOperationsPanel } from "@/components/ui/batch-operations-panel"
import { VirtualScroll } from "@/components/ui/virtual-scroll"
import type { User } from "@/store/user-store"

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
  const { users, loading, fetchUsers, createUser, updateUser, deleteUser } = useUsers({ page: 1, limit: 100 })
  const [searchResults, setSearchResults] = useState<User[] | null>(null)
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)

  const {
    values: formData,
    errors: formErrors,
    touched,
    isSubmitting: formSubmitting,
    isValid: isFormValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    clearErrors,
    resetForm,
    validateAll,
  } = useFormValidation({
    schema: userFormSchema,
    onSubmit: async (data: any) => {
      if (editingUser) {
        const result = await updateUser(editingUser.id, data)
        if (result.success) {
          toast({
            title: "更新成功",
            description: "用户信息已成功更新",
          })
          setShowUserDialog(false)
          setEditingUser(null)
          resetForm()
        } else {
          toast({
            title: "更新失败",
            description: result.error || "无法更新用户，请稍后重试",
            variant: "destructive",
          })
        }
      } else {
        const result = await createUser(data)
        if (result.success) {
          toast({
            title: "创建成功",
            description: "用户已成功创建",
          })
          setShowUserDialog(false)
          resetForm()
        } else {
          toast({
            title: "创建失败",
            description: result.error || "无法创建用户，请稍后重试",
            variant: "destructive",
          })
        }
      }
    },
    onSuccess: () => {
      clearErrors()
    },
    onError: (errors: any) => {
      console.error("Form validation errors:", errors)
    },
  })

  const [roles] = useState<Role[]>([
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

  const [permissions] = useState<Permission[]>([
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
    totalUsers: 0,
    activeUsers: 0,
    onlineUsers: 0,
    newUsersToday: 0,
    lockedUsers: 0,
    pendingUsers: 0,
    loginRate: 0,
    avgSessionTime: 45,
  })

  useEffect(() => {
    const total = users.length
    const active = users.filter((u: User) => u.status === "active").length
    const locked = users.filter((u: User) => u.status === "inactive").length
    const newToday = users.filter((u: User) => {
      const today = new Date().toDateString()
      return new Date(u.created_at).toDateString() === today
    }).length

    setUserStats({
      totalUsers: total,
      activeUsers: active,
      onlineUsers: active,
      newUsersToday: newToday,
      lockedUsers: locked,
      pendingUsers: 0,
      loginRate: total > 0 ? (active / total) * 100 : 0,
      avgSessionTime: 45,
    })
  }, [users])

  const handleUserAction = async (userId: number, action: string) => {
    const result = await updateUser(userId, { status: action === "activate" ? "active" : "inactive" })

    if (result.success) {
      toast({
        title: "操作成功",
        description: `用户状态已更新`,
      })
    } else {
      toast({
        title: "操作失败",
        description: result.error || "无法更新用户状态，请稍后重试",
        variant: "destructive",
      })
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

    let successCount = 0
    for (const userId of selectedUsers) {
      const result = await updateUser(userId, { status: action === "activate" ? "active" : "inactive" })
      if (result.success) successCount++
    }

    setSelectedUsers([])

    if (successCount > 0) {
      toast({
        title: "批量操作成功",
        description: `已对${successCount}个用户执行${action}操作`,
      })
    } else {
      toast({
        title: "批量操作失败",
        description: "操作可能失败，请检查后重试",
        variant: "destructive",
      })
    }
  }

  const handleImportUsers = async (importedUsers: User[]) => {
    for (const user of importedUsers) {
      const result = await createUser(user)
      if (!result.success) {
        toast({
          title: "导入失败",
          description: `用户 ${user.username} 导入失败: ${result.error}`,
          variant: "destructive",
        })
      }
    }
    await fetchUsers()
  }

  const handleDeleteUser = async (userId: number) => {
    const result = await deleteUser(userId)
    if (result.success) {
      toast({
        title: "删除成功",
        description: "用户已成功删除",
      })
    } else {
      toast({
        title: "删除失败",
        description: result.error || "无法删除用户，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const openCreateDialog = () => {
    resetForm()
    setEditingUser(null)
    setShowUserDialog(true)
  }

  const openEditDialog = (user: User) => {
    setFieldValue("username", user.username)
    setFieldValue("email", user.email)
    setFieldValue("real_name", user.real_name)
    setFieldValue("role", user.role)
    setFieldValue("department", user.department)
    setFieldValue("status", user.status)
    setEditingUser(user)
    setShowUserDialog(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50"
      case "inactive":
        return "text-gray-600 bg-gray-50"
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
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "admin":
        return <Crown className="w-4 h-4 text-yellow-600" />
      case "manager":
        return <Star className="w-4 h-4 text-blue-600" />
      case "user":
        return <Users className="w-4 h-4 text-green-600" />
      default:
        return <Users className="w-4 h-4 text-gray-600" />
    }
  }

  const filteredUsers = (() => {
    const dataToFilter = searchResults || users
    return dataToFilter.filter((user) => {
      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "active" && user.status === "active") ||
        (selectedFilter === "inactive" && user.status === "inactive")
      return matchesFilter
    })
  })()

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="responsive-content">
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
          <DataImportExport
            data={users}
            onImport={handleImportUsers}
            exportOptions={{
              filename: `users-${new Date().toISOString().split("T")[0]}`,
              sheetName: "用户数据",
            }}
            importOptions={{
              validateRow: (row: any) => {
                return row.username && row.email && row.real_name
              },
              transformRow: (row: any) => ({
                username: row.username || row["用户名"],
                email: row.email || row["邮箱"],
                real_name: row.real_name || row["真实姓名"],
                role: row.role || row["角色"] || "user",
                department: row.department || row["部门"] || "未分配",
                status: row.status || row["状态"] || "active",
              }),
            }}
          />
          <BatchOperationsPanel
            items={users.filter((user: User) => selectedUsers.includes(user.id))}
            onCreate={handleImportUsers}
            onUpdateStatus={async (ids: number[], status: string) => {
              let successCount = 0
              for (const userId of ids) {
                const result = await updateUser(userId, { status })
                if (result.success) successCount++
              }
              setSelectedUsers([])
              return successCount > 0
            }}
            onDelete={async (ids: number[]) => {
              let successCount = 0
              for (const userId of ids) {
                const result = await deleteUser(userId)
                if (result.success) successCount++
              }
              setSelectedUsers([])
              return successCount > 0
            }}
            getItemId={(user: User) => user.id}
            disabled={selectedUsers.length === 0}
          />
          <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700 responsive-button">
            <UserPlus className="responsive-icon mr-2" />
            添加用户
          </Button>
        </div>
      </div>

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

      <Card className="responsive-card border-r-[5px] border-r-indigo-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
        <CardContent className="p-4 sm:p-6">
          <AdvancedSearchBar
            data={users}
            onSearch={(results) => {
              const filtered = results.filter((user) => {
                const matchesFilter =
                  selectedFilter === "all" ||
                  (selectedFilter === "active" && user.status === "active") ||
                  (selectedFilter === "inactive" && user.status === "inactive")
                return matchesFilter
              })
              return filtered
            }}
            fields={[
              { value: "username", label: "用户名" },
              { value: "email", label: "邮箱" },
              { value: "real_name", label: "真实姓名" },
              { value: "role", label: "角色" },
              { value: "department", label: "部门" },
              { value: "status", label: "状态" },
            ]}
            placeholder="搜索用户名、邮箱或姓名..."
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="users" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">用户列表</TabsTrigger>
          <TabsTrigger value="roles">角色管理</TabsTrigger>
          <TabsTrigger value="permissions">权限管理</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="responsive-spacing">
          <div className="border rounded-lg overflow-hidden" style={{ height: "600px" }}>
            <VirtualScroll
              items={filteredUsers}
              itemHeight={200}
              containerHeight={600}
              renderItem={(user) => (
                <Card
                  key={user.id}
                  className="m-2 hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
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
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                              {user.real_name.charAt(0)}
                            </div>
                            {user.status === "active" && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900">{user.real_name}</h3>
                            <Badge className={getStatusColor(user.status)}>
                              {getStatusIcon(user.status)}
                              <span className="ml-1">{user.status === "active" ? "活跃" : "非活跃"}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">@{user.username}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-1">
                              {getRoleIcon(user.role)}
                              {user.role}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Shield className="w-4 h-4" />
                              {user.department}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(user.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUserAction(user.id, user.status === "active" ? "deactivate" : "activate")}
                          className={user.status === "active" ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                        >
                          {user.status === "active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="roles" className="responsive-spacing">
          <div className="responsive-grid-2">
            {roles.map((role) => (
              <Card
                key={role.id}
                className="responsive-card hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                        {role.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{role.name}</h3>
                          {role.isSystem && (
                            <Badge variant="secondary">系统角色</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{role.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {role.userCount} 用户
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            {role.permissions.length} 权限
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="responsive-spacing">
          <div className="responsive-grid-3">
            {permissions.map((permission) => (
              <Card
                key={permission.id}
                className="responsive-card hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                        {permission.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{permission.name}</h3>
                          {permission.isSystem && (
                            <Badge variant="secondary">系统权限</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{permission.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <Badge variant="outline">{permission.category}</Badge>
                          <span>{permission.resource}.{permission.action}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? "编辑用户" : "创建用户"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "编辑用户信息" : "创建新用户并设置权限"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                用户名
              </Label>
              <div className="col-span-3">
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  onBlur={() => handleBlur("username")}
                  className={formErrors.username ? "border-red-500" : ""}
                  disabled={!!editingUser}
                />
                <FormFieldError fieldName="username" errors={formErrors} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                邮箱
              </Label>
              <div className="col-span-3">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                <FormFieldError fieldName="email" errors={formErrors} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="real_name" className="text-right">
                真实姓名
              </Label>
              <div className="col-span-3">
                <Input
                  id="real_name"
                  value={formData.real_name}
                  onChange={(e) => handleChange("real_name", e.target.value)}
                  onBlur={() => handleBlur("real_name")}
                  className={formErrors.real_name ? "border-red-500" : ""}
                />
                <FormFieldError fieldName="real_name" errors={formErrors} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                角色
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleChange("role", value)}
                >
                  <SelectTrigger className={formErrors.role ? "border-red-500" : ""}>
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">超级管理员</SelectItem>
                    <SelectItem value="manager">部门经理</SelectItem>
                    <SelectItem value="user">普通员工</SelectItem>
                  </SelectContent>
                </Select>
                <FormFieldError fieldName="role" errors={formErrors} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                部门
              </Label>
              <div className="col-span-3">
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  onBlur={() => handleBlur("department")}
                  className={formErrors.department ? "border-red-500" : ""}
                />
                <FormFieldError fieldName="department" errors={formErrors} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                状态
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value as "active" | "inactive")}
                >
                  <SelectTrigger className={formErrors.status ? "border-red-500" : ""}>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">活跃</SelectItem>
                    <SelectItem value="inactive">非活跃</SelectItem>
                  </SelectContent>
                </Select>
                <FormFieldError fieldName="status" errors={formErrors} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit} disabled={formSubmitting || !isFormValid}>
              {formSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingUser ? "更新中..." : "创建中..."}
                </>
              ) : (
                editingUser ? "更新" : "创建"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
