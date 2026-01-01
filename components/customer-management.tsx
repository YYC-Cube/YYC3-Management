/**
 * @fileoverview 客户管理组件
 * @description 客户信息管理、生命周期跟踪等功能
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  UserPlus,
  Edit,
  Eye,
  Download,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProgressColor } from "@/lib/design-system"

interface Customer {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  status: "active" | "inactive" | "potential"
  value: number
  lastContact: string
  assignedTo: string
  tags: string[]
  notes: string
  satisfaction?: number
}

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "张总",
      company: "华润集团",
      email: "zhang@huarun.com",
      phone: "138-0000-1234",
      address: "深圳市南山区",
      status: "active",
      value: 500000,
      lastContact: "2025-06-19",
      assignedTo: "李销售",
      tags: ["VIP", "大客户"],
      notes: "重要客户，需要定期维护",
      satisfaction: 95,
    },
    {
      id: "2",
      name: "王经理",
      company: "万科地产",
      email: "wang@vanke.com",
      phone: "139-0000-5678",
      address: "广州市天河区",
      status: "potential",
      value: 300000,
      lastContact: "2025-06-18",
      assignedTo: "陈销售",
      tags: ["潜在客户"],
      notes: "正在洽谈中，有合作意向",
      satisfaction: 78,
    },
    {
      id: "3",
      name: "刘总监",
      company: "碧桂园",
      email: "liu@bgy.com",
      phone: "137-0000-9012",
      address: "佛山市顺德区",
      status: "active",
      value: 800000,
      lastContact: "2025-06-17",
      assignedTo: "李销售",
      tags: ["VIP", "长期合作"],
      notes: "长期合作伙伴，信任度高",
      satisfaction: 88,
    },
  ])

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">活跃客户</Badge>
      case "potential":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">潜在客户</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">非活跃</Badge>
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.status === "active").length
  const potentialCustomers = customers.filter((c) => c.status === "potential").length
  const totalValue = customers.reduce((sum, c) => sum + c.value, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">客户管理系统</h1>
          <p className="text-gray-600 mt-1">全面的客户关系管理平台</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索客户..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-r-4 border-r-green-500 shadow-[4px_0_12px_rgba(34,197,94,0.15)]">
                <Plus className="w-4 h-4 mr-2" />
                添加客户
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>添加新客户</DialogTitle>
                <DialogDescription>填写客户基本信息</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">客户姓名</Label>
                  <Input id="name" placeholder="请输入客户姓名" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">公司名称</Label>
                  <Input id="company" placeholder="请输入公司名称" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱地址</Label>
                  <Input id="email" type="email" placeholder="请输入邮箱地址" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">联系电话</Label>
                  <Input id="phone" placeholder="请输入联系电话" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">联系地址</Label>
                  <Input id="address" placeholder="请输入联系地址" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">客户状态</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择客户状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">活跃客户</SelectItem>
                      <SelectItem value="potential">潜在客户</SelectItem>
                      <SelectItem value="inactive">非活跃</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">预估价值</Label>
                  <Input id="value" type="number" placeholder="请输入预估价值" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">备注信息</Label>
                  <Textarea id="notes" placeholder="请输入备注信息" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  取消
                </Button>
                <Button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
                >
                  保存客户
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 客户统计卡片 - 严格执行统一规范 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-r-[5px] border-r-green-500 hover:border-r-green-600 shadow-[4px_0_12px_rgba(34,197,94,0.15)] transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">客户总数</p>
                <p className="text-3xl font-bold text-green-600">{totalCustomers}</p>
                <p className="text-xs text-gray-500 mt-1">全部客户数量</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-green-500 hover:border-r-green-600 shadow-[4px_0_12px_rgba(34,197,94,0.15)] transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">活跃客户</p>
                <p className="text-3xl font-bold text-green-600">{activeCustomers}</p>
                <p className="text-xs text-gray-500 mt-1">正在合作的客户</p>
              </div>
              <UserPlus className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-green-500 hover:border-r-green-600 shadow-[4px_0_12px_rgba(34,197,94,0.15)] transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">潜在客户</p>
                <p className="text-3xl font-bold text-green-600">{potentialCustomers}</p>
                <p className="text-xs text-gray-500 mt-1">有合作意向的客户</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-green-500 hover:border-r-green-600 shadow-[4px_0_12px_rgba(34,197,94,0.15)] transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">客户总价值</p>
                <p className="text-3xl font-bold text-green-600">¥{totalValue.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">预估总价值</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 客户列表和详情 - 蓝色分区边线 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(34,197,94,0.15)]">
            <CardHeader>
              <CardTitle>客户列表</CardTitle>
              <CardDescription>管理您的客户信息</CardDescription>
            </CardHeader>
            <CardContent>
              <Card className="border-r-4 border-r-green-500 shadow-[2px_0_8px_rgba(34,197,94,0.1)] mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Select>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="客户状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="active">活跃客户</SelectItem>
                        <SelectItem value="potential">潜在客户</SelectItem>
                        <SelectItem value="inactive">非活跃</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      导出客户
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{customer.name}</h4>
                        <p className="text-sm text-muted-foreground">{customer.company}</p>
                      </div>
                      <div className="flex space-x-2">
                        {customer.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {getStatusBadge(customer.status)}
                      </div>
                    </div>

                    {/* 客户满意度进度条 */}
                    {customer.satisfaction && (
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">客户满意度</span>
                          <span className="text-sm font-medium">{customer.satisfaction}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(customer.satisfaction)}`}
                            style={{ width: `${customer.satisfaction}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {customer.email}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {customer.address}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />¥{customer.value.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-muted-foreground">负责人: {customer.assignedTo}</span>
                      <span className="text-sm text-muted-foreground">最后联系: {customer.lastContact}</span>
                    </div>
                    <div className="flex justify-end space-x-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-t-4 border-t-blue-400">
            <CardHeader>
              <CardTitle>客户详情</CardTitle>
              <CardDescription>查看和编辑客户信息</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedCustomer ? (
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">基本信息</TabsTrigger>
                    <TabsTrigger value="follow">跟进记录</TabsTrigger>
                    <TabsTrigger value="opportunities">销售机会</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{selectedCustomer.name}</h3>
                          <p className="text-muted-foreground">{selectedCustomer.company}</p>
                        </div>
                        {getStatusBadge(selectedCustomer.status)}
                      </div>

                      {/* 客户满意度详细显示 */}
                      {selectedCustomer.satisfaction && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">客户满意度</span>
                            <span className="text-sm font-bold">{selectedCustomer.satisfaction}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(selectedCustomer.satisfaction)}`}
                              style={{ width: `${selectedCustomer.satisfaction}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCustomer.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{selectedCustomer.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">¥{selectedCustomer.value.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">最后联系: {selectedCustomer.lastContact}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">标签</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCustomer.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">备注</h4>
                        <p className="text-sm text-muted-foreground">{selectedCustomer.notes}</p>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          编辑
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          详情
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="follow" className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">跟进记录</h4>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          添加跟进
                        </Button>
                      </div>
                      {/* 跟进记录列表 */}
                    </div>
                  </TabsContent>

                  <TabsContent value="opportunities" className="space-y-4">
                    {/* 销售机会内容 */}
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">请选择客户查看详情</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6 border-t-4 border-t-blue-400">
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  拨打电话
                </Button>
                <Button className="w-full" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  发送邮件
                </Button>
                <Button className="w-full" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  安排会议
                </Button>
                <Button className="w-full" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  添加跟进
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
