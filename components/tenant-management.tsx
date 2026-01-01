/**
 * @fileoverview tenant-management.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Plus, Search, MoreHorizontal, Crown, Star, Zap } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Tenant {
  id: string
  name: string
  domain: string
  plan: "basic" | "professional" | "enterprise"
  status: "active" | "suspended" | "trial"
  users: number
  maxUsers: number
  createdAt: Date
  lastActive: Date
  logo?: string
}

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "user"
  tenantId: string
  status: "active" | "inactive"
  lastLogin: Date
}

export function TenantManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const tenants: Tenant[] = [
    {
      id: "1",
      name: "锦澜家居总部",
      domain: "jinlan-hq.com",
      plan: "enterprise",
      status: "active",
      users: 45,
      maxUsers: 100,
      createdAt: new Date("2024-01-15"),
      lastActive: new Date(),
      logo: "/yyc3-logo-blue.png",
    },
    {
      id: "2",
      name: "锦澜家居华东分公司",
      domain: "jinlan-east.com",
      plan: "professional",
      status: "active",
      users: 28,
      maxUsers: 50,
      createdAt: new Date("2024-02-20"),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "3",
      name: "锦澜家居华南分公司",
      domain: "jinlan-south.com",
      plan: "professional",
      status: "active",
      users: 32,
      maxUsers: 50,
      createdAt: new Date("2024-03-10"),
      lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: "4",
      name: "合作伙伴A",
      domain: "partner-a.com",
      plan: "basic",
      status: "trial",
      users: 8,
      maxUsers: 10,
      createdAt: new Date("2024-06-01"),
      lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  ]

  const users: User[] = [
    {
      id: "1",
      name: "张总经理",
      email: "zhang@jinlan-hq.com",
      role: "admin",
      tenantId: "1",
      status: "active",
      lastLogin: new Date(),
    },
    {
      id: "2",
      name: "李部长",
      email: "li@jinlan-hq.com",
      role: "manager",
      tenantId: "1",
      status: "active",
      lastLogin: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: "3",
      name: "王主管",
      email: "wang@jinlan-east.com",
      role: "admin",
      tenantId: "2",
      status: "active",
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ]

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return <Crown className="w-4 h-4" />
      case "professional":
        return <Star className="w-4 h-4" />
      case "basic":
        return <Zap className="w-4 h-4" />
      default:
        return <Building2 className="w-4 h-4" />
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "professional":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "basic":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "trial":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.domain.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">多租户管理</h1>
          <p className="text-slate-600 mt-2">管理多个企业组织和用户权限</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              新建租户
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建新租户</DialogTitle>
              <DialogDescription>添加新的企业组织到系统中</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tenant-name">租户名称</Label>
                <Input id="tenant-name" placeholder="输入租户名称" />
              </div>
              <div>
                <Label htmlFor="tenant-domain">域名</Label>
                <Input id="tenant-domain" placeholder="example.com" />
              </div>
              <div>
                <Label htmlFor="tenant-plan">套餐类型</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择套餐" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">基础版</SelectItem>
                    <SelectItem value="professional">专业版</SelectItem>
                    <SelectItem value="enterprise">企业版</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>创建</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="tenants" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tenants">租户管理</TabsTrigger>
          <TabsTrigger value="users">用户权限</TabsTrigger>
          <TabsTrigger value="settings">系统配置</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索租户名称或域名..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredTenants.map((tenant) => (
              <Card key={tenant.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      {tenant.logo ? (
                        <AvatarImage src={tenant.logo || "/placeholder.svg"} alt={tenant.name} />
                      ) : (
                        <AvatarFallback className="bg-emerald-100 text-emerald-600">
                          <Building2 className="w-6 h-6" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900">{tenant.name}</h3>
                      <p className="text-sm text-slate-600">{tenant.domain}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getPlanColor(tenant.plan)}>
                          {getPlanIcon(tenant.plan)}
                          <span className="ml-1 capitalize">{tenant.plan}</span>
                        </Badge>
                        <Badge className={getStatusColor(tenant.status)}>
                          {tenant.status === "active" ? "活跃" : tenant.status === "trial" ? "试用" : "暂停"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">
                        {tenant.users}/{tenant.maxUsers} 用户
                      </p>
                      <p className="text-xs text-slate-600">最后活跃: {tenant.lastActive.toLocaleString()}</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>查看详情</DropdownMenuItem>
                        <DropdownMenuItem>编辑设置</DropdownMenuItem>
                        <DropdownMenuItem>管理用户</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">暂停服务</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-600">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900">{user.name}</h3>
                      <p className="text-sm text-slate-600">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          {user.role === "admin" ? "管理员" : user.role === "manager" ? "经理" : "用户"}
                        </Badge>
                        <Badge
                          className={
                            user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {user.status === "active" ? "活跃" : "非活跃"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-600">最后登录: {user.lastLogin.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">租户: {tenants.find((t) => t.id === user.tenantId)?.name}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">全局设置</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">自动备份</h4>
                    <p className="text-sm text-slate-600">每日自动备份所有租户数据</p>
                  </div>
                  <Button variant="outline">配置</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">安全策略</h4>
                    <p className="text-sm text-slate-600">配置密码策略和登录限制</p>
                  </div>
                  <Button variant="outline">设置</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">监控告警</h4>
                    <p className="text-sm text-slate-600">系统性能和异常监控</p>
                  </div>
                  <Button variant="outline">管理</Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
