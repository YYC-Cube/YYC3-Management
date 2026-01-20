/**
 * @fileoverview customers.tsx
 * @description 客户管理组件 - 集成真实API
 * @author YYC³
 * @version 2.0.0
 * @created 2025-01-19
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { useState } from "react"
import { PageContainer } from "@/components/layout/page-container"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
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
  Search,
  Filter,
  TrendingUp,
  Star,
  Phone,
  Mail,
  Edit,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useCustomers } from "@/hooks/use-customers"
import type { Customer } from "@/store/customer-store"

export default function CustomersPage() {
  const { customers, loading, fetchCustomers, createCustomer, updateCustomer, deleteCustomer } = useCustomers({ page: 1, limit: 100 })
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
    activeCustomers: customers.filter((c) => c.status === "active").length,
    vipCustomers: customers.filter((c) => c.level === "VIP").length,
    newCustomers: customers.filter((c) => {
      const today = new Date().toDateString()
      return new Date(c.created_at).toDateString() === today
    }).length,
  }

  const handleCreateCustomer = async () => {
    setDialogLoading(true)
    try {
      const result = await createCustomer(formData)
      if (result.success) {
        toast({
          title: "创建成功",
          description: "客户已成功创建",
        })
        setShowCustomerDialog(false)
        resetForm()
      } else {
        toast({
          title: "创建失败",
          description: result.error || "无法创建客户，请稍后重试",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "创建失败",
        description: "网络错误，请稍后重试",
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
      const result = await updateCustomer(editingCustomer.id, formData)
      if (result.success) {
        toast({
          title: "更新成功",
          description: "客户信息已成功更新",
        })
        setShowCustomerDialog(false)
        setEditingCustomer(null)
        resetForm()
      } else {
        toast({
          title: "更新失败",
          description: result.error || "无法更新客户，请稍后重试",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "更新失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setDialogLoading(false)
    }
  }

  const handleDeleteCustomer = async (customerId: number) => {
    const result = await deleteCustomer(customerId)
    if (result.success) {
      toast({
        title: "删除成功",
        description: "客户已成功删除",
      })
    } else {
      toast({
        title: "删除失败",
        description: result.error || "无法删除客户，请稍后重试",
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
      company: customer.company,
      email: customer.email,
      phone: customer.phone,
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
        return "text-green-600 bg-green-50"
      case "潜在":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
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

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "active" && customer.status === "active") ||
      (selectedFilter === "inactive" && customer.status === "inactive") ||
      (selectedFilter === "VIP" && customer.level === "VIP") ||
      (selectedFilter === "普通" && customer.level === "普通")
    return matchesSearch && matchesFilter
  })

  if (loading && customers.length === 0) {
    return (
      <PageContainer title="客户管理" description="管理和维护客户关系">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="客户管理" description="管理和维护客户关系">
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <EnhancedButton onClick={openCreateDialog} className="bg-green-600 hover:bg-green-700 border-r-4 border-r-green-500 shadow-[4px_0_12px_rgba(34,197,94,0.15)]">
            <UserPlus className="w-4 h-4 mr-2 text-white" />
            新增客户
          </EnhancedButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedCard className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(34,197,94,0.15)] hover:border-r-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">总客户数</p>
                <p className="text-2xl font-bold text-slate-800">{customerStats.totalCustomers}</p>
                <p className="text-xs text-green-600 mt-1">系统注册客户</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(34,197,94,0.15)] hover:border-r-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">活跃客户</p>
                <p className="text-2xl font-bold text-slate-800">{customerStats.activeCustomers}</p>
                <p className="text-xs text-green-600 mt-1">当前活跃</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(34,197,94,0.15)] hover:border-r-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">VIP客户</p>
                <p className="text-2xl font-bold text-slate-800">{customerStats.vipCustomers}</p>
                <p className="text-xs text-yellow-600 mt-1">重要客户</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(34,197,94,0.15)] hover:border-r-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">新增客户</p>
                <p className="text-2xl font-bold text-slate-800">{customerStats.newCustomers}</p>
                <p className="text-xs text-green-600 mt-1">今日新增</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </EnhancedCard>
        </div>

        <EnhancedCard>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="customer-search" className="sr-only">搜索客户</Label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
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
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors border-r-4 border-r-green-500 shadow-[2px_0_8px_rgba(34,197,94,0.1)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-800">{customer.name}</h3>
                        <Badge className={getLevelColor(customer.level)}>
                          {customer.level}
                        </Badge>
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status === "active" ? "活跃" : "非活跃"}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{customer.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-sm text-slate-600">
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
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </EnhancedButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </EnhancedCard>
      </div>

      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="sm:max-w-[500px]">
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
