/**
 * @fileoverview customers.tsx
 * @description 客户管理组件 - 集成真实API
 * @author YYC³
 * @version 3.0.0
 * @created 2025-01-19
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { PageContainer } from "@/components/layout/page-container"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card } from "@/components/ui/card"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCustomers } from "@/hooks/use-customers"
import { toast } from "@/hooks/use-toast"
import type { Customer } from "@/lib/db/models/customer"
import {
  Edit,
  Filter,
  Loader2,
  Mail,
  Phone,
  Search,
  Star,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react"
import { useState } from "react"

export default function CustomersPage() {
  const { customers, loading, fetchCustomers: _fetchCustomers, createCustomer, updateCustomer, deleteCustomer } = useCustomers({ page: 1, limit: 100 })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    level: "普通",
    status: "active",
  })

  const customerStats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter((c) => c.status === "活跃").length,
    vipCustomers: customers.filter((c) => c.level === "VIP").length,
    newCustomers: customers.filter((c) => {
      const today = new Date().toDateString()
      return new Date(c.created_at).toDateString() === today
    }).length,
  }

  const handleCreateCustomer = async () => {
    setDialogLoading(true)
    try {
      await createCustomer(formData as any)
      toast({
        title: "创建成功",
        description: "客户已成功创建",
      })
      setShowCustomerDialog(false)
      resetForm()
    } catch (error) {
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : "无法创建客户，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setDialogLoading(false)
    }
  }

  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return

    setDialogLoading(true)
    try {
      await updateCustomer(editingCustomer.id, formData as any)
      toast({
        title: "更新成功",
        description: "客户信息已成功更新",
      })
      setShowCustomerDialog(false)
      setEditingCustomer(null)
      resetForm()
    } catch (error) {
      toast({
        title: "更新失败",
        description: error instanceof Error ? error.message : "无法更新客户，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setDialogLoading(false)
    }
  }

  const handleDeleteCustomer = async (customerId: number) => {
    try {
      await deleteCustomer(customerId)
      toast({
        title: "删除成功",
        description: "客户已成功删除",
      })
    } catch (error) {
      toast({
        title: "删除失败",
        description: error instanceof Error ? error.message : "无法删除客户，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      level: "普通",
      status: "active",
    })
  }

  const openCreateDialog = () => {
    resetForm()
    setEditingCustomer(null)
    setShowCustomerDialog(true)
  }

  const openEditDialog = (customer: Customer) => {
    setFormData({
      name: customer.name,
      company: customer.company || "",
      email: customer.email || "",
      phone: customer.phone || "",
      level: customer.level,
      status: customer.status,
    })
    setEditingCustomer(customer)
    setShowCustomerDialog(true)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "VIP":
        return "text-yellow-600 bg-yellow-50"
      case "重要":
        return "text-blue-600 bg-blue-50"
      case "普通":
        return "text-success bg-success/10"
      case "潜在":
        return "text-muted-foreground bg-muted"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-success bg-success/10"
      case "inactive":
        return "text-muted-foreground bg-muted"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "active" && customer.status === "活跃") ||
      (selectedFilter === "inactive" && customer.status === "休眠") ||
      (selectedFilter === "VIP" && customer.level === "VIP") ||
      (selectedFilter === "普通" && customer.level === "普通")
    return matchesSearch && matchesFilter
  })

  if (loading && customers.length === 0) {
    return (
      <PageContainer title="客户管理" description="管理和维护客户关系">
        <div className="flex items-center justify-center min-h-100">
          <Loader2 className="w-8 h-8 animate-spin text-success" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="客户管理" description="管理和维护客户关系">
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <EnhancedButton onClick={openCreateDialog} className="bg-success/10 hover:bg-success/20 border-r-4 border-r-success shadow-md">
            <UserPlus className="w-4 h-4 mr-2 text-white" />
            新增客户
          </EnhancedButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-r-[5px] border-r-success shadow-md hover:border-r-success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总客户数</p>
                <p className="text-2xl font-bold text-foreground">{customerStats.totalCustomers}</p>
                <p className="text-xs text-success mt-1">系统注册客户</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="border-r-[5px] border-r-success shadow-md hover:border-r-success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">活跃客户</p>
                <p className="text-2xl font-bold text-foreground">{customerStats.activeCustomers}</p>
                <p className="text-xs text-success mt-1">当前活跃</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="border-r-[5px] border-r-success shadow-md hover:border-r-success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">VIP客户</p>
                <p className="text-2xl font-bold text-foreground">{customerStats.vipCustomers}</p>
                <p className="text-xs text-yellow-600 mt-1">重要客户</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="border-r-[5px] border-r-success shadow-md hover:border-r-success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">新增客户</p>
                <p className="text-2xl font-bold text-foreground">{customerStats.newCustomers}</p>
                <p className="text-xs text-success mt-1">今日新增</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="customer-search" className="sr-only">搜索客户</Label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="customer-search"
                    placeholder="搜索客户姓名、公司或联系方式..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-success"
              >
                <option value="all">全部客户</option>
                <option value="active">活跃客户</option>
                <option value="inactive">非活跃客户</option>
                <option value="VIP">VIP客户</option>
                <option value="普通">普通客户</option>
              </select>
              <EnhancedButton variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </EnhancedButton>
            </div>

            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors border-r-4 border-r-success shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-primary-foreground font-medium">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-card-foreground">{customer.name}</h3>
                        <Badge className={getLevelColor(customer.level)}>
                          {customer.level}
                        </Badge>
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status === "活跃" ? "活跃" : "非活跃"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{customer.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <EnhancedButton size="sm" variant="outline" onClick={() => openEditDialog(customer)}>
                        <Edit className="w-4 h-4" />
                      </EnhancedButton>
                      <EnhancedButton
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </EnhancedButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? "编辑客户" : "新增客户"}</DialogTitle>
            <DialogDescription>
              {editingCustomer ? "编辑客户信息" : "创建新客户并设置相关信息"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                客户姓名
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                公司名称
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                邮箱
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                电话
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level" className="text-right">
                客户级别
              </Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择客户级别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="重要">重要</SelectItem>
                  <SelectItem value="普通">普通</SelectItem>
                  <SelectItem value="潜在">潜在</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                状态
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">活跃</SelectItem>
                  <SelectItem value="inactive">非活跃</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <EnhancedButton variant="outline" onClick={() => setShowCustomerDialog(false)}>
              取消
            </EnhancedButton>
            <EnhancedButton onClick={editingCustomer ? handleUpdateCustomer : handleCreateCustomer} disabled={dialogLoading}>
              {dialogLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingCustomer ? "更新中..." : "创建中..."}
                </>
              ) : (
                editingCustomer ? "更新" : "创建"
              )}
            </EnhancedButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FloatingNavButtons />
    </PageContainer>
  )
}
