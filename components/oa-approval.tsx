/**
 * @fileoverview oa-approval.tsx
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { commonStyles, getStatusStyle } from "@/lib/design-system"
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Calendar,
  User,
  Building,
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  TrendingUp,
} from "lucide-react"

interface ApprovalItem {
  id: string
  title: string
  type: string
  applicant: string
  department: string
  amount?: number
  status: "pending" | "approved" | "rejected" | "draft"
  priority: "low" | "medium" | "high"
  submitDate: string
  description: string
  attachments?: string[]
  approvers: string[]
  currentApprover?: string
  comments?: Comment[]
}

interface Comment {
  id: string
  author: string
  content: string
  date: string
  type: "approve" | "reject" | "comment"
}

export function OAApproval() {
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // 模拟审批数据
  const approvals: ApprovalItem[] = [
    {
      id: "1",
      title: "差旅费报销申请",
      type: "expense",
      applicant: "张三",
      department: "销售部",
      amount: 3500,
      status: "pending",
      priority: "medium",
      submitDate: "2025-06-20",
      description: "北京出差3天，包含交通费、住宿费、餐费等",
      attachments: ["发票1.pdf", "发票2.pdf"],
      approvers: ["李经理", "财务总监"],
      currentApprover: "李经理",
      comments: [
        {
          id: "c1",
          author: "张三",
          content: "请审批我的差旅费报销申请，所有发票已上传",
          date: "2025-06-20",
          type: "comment",
        },
      ],
    },
    {
      id: "2",
      title: "年假申请",
      type: "leave",
      applicant: "李四",
      department: "技术部",
      status: "approved",
      priority: "low",
      submitDate: "2025-06-18",
      description: "申请7月1日-7月7日年假，共7天",
      approvers: ["王主管", "HR经理"],
      comments: [
        {
          id: "c2",
          author: "王主管",
          content: "同意申请，注意工作交接",
          date: "2025-06-19",
          type: "approve",
        },
      ],
    },
    {
      id: "3",
      title: "设备采购申请",
      type: "purchase",
      applicant: "王五",
      department: "IT部",
      amount: 15000,
      status: "rejected",
      priority: "high",
      submitDate: "2025-06-15",
      description: "申请采购10台笔记本电脑用于新员工",
      attachments: ["报价单.xlsx"],
      approvers: ["IT经理", "采购总监"],
      comments: [
        {
          id: "c3",
          author: "采购总监",
          content: "预算超支，请重新评估需求",
          date: "2025-06-17",
          type: "reject",
        },
      ],
    },
    {
      id: "4",
      title: "培训费用申请",
      type: "training",
      applicant: "赵六",
      department: "人力资源部",
      amount: 8000,
      status: "pending",
      priority: "medium",
      submitDate: "2025-06-21",
      description: "参加外部管理培训课程",
      approvers: ["HR总监"],
      currentApprover: "HR总监",
    },
  ]

  // 统计数据
  const stats = [
    {
      label: "待审批",
      value: approvals.filter((item) => item.status === "pending").length,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      label: "已通过",
      value: approvals.filter((item) => item.status === "approved").length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "已拒绝",
      value: approvals.filter((item) => item.status === "rejected").length,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      label: "总申请",
      value: approvals.length,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ]

  // 筛选数据
  const filteredApprovals = approvals.filter((item) => {
    if (selectedType !== "all" && item.type !== selectedType) return false
    if (selectedStatus !== "all" && item.status !== selectedStatus) return false
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "expense":
        return DollarSign
      case "leave":
        return Calendar
      case "purchase":
        return ShoppingCart
      case "training":
        return Users
      default:
        return FileText
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "expense":
        return "费用报销"
      case "leave":
        return "请假申请"
      case "purchase":
        return "采购申请"
      case "training":
        return "培训申请"
      default:
        return "其他"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "高优先级"
      case "medium":
        return "中优先级"
      case "low":
        return "低优先级"
      default:
        return "普通"
    }
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-r-[5px] border-r-sky-400 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                      <span className="text-sm text-emerald-600">+12%</span>
                      <span className="text-xs text-slate-500 ml-1">vs 上月</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 主要内容区域 */}
      <Card className={commonStyles.card.base}>
        <CardHeader className="border-b border-sky-100 bg-gradient-to-r from-sky-50/50 to-blue-50/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-slate-800">审批管理</CardTitle>
              <CardDescription className="text-slate-600">管理和处理各类审批申请</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className={commonStyles.button.primary}>
                  <Plus className="w-4 h-4 mr-2" />
                  新建申请
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>创建新申请</DialogTitle>
                  <DialogDescription>填写申请信息并提交审批</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">申请类型</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="选择申请类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="expense">费用报销</SelectItem>
                          <SelectItem value="leave">请假申请</SelectItem>
                          <SelectItem value="purchase">采购申请</SelectItem>
                          <SelectItem value="training">培训申请</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">优先级</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="选择优先级" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">低优先级</SelectItem>
                          <SelectItem value="medium">中优先级</SelectItem>
                          <SelectItem value="high">高优先级</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="title">申请标题</Label>
                    <Input id="title" placeholder="输入申请标题" />
                  </div>
                  <div>
                    <Label htmlFor="description">申请描述</Label>
                    <Textarea id="description" placeholder="详细描述申请内容" rows={4} />
                  </div>
                  <div>
                    <Label htmlFor="amount">金额（如适用）</Label>
                    <Input id="amount" type="number" placeholder="输入金额" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      取消
                    </Button>
                    <Button className={commonStyles.button.primary}>提交申请</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="list" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-sky-100/50 border border-sky-200">
                <TabsTrigger value="list" className="data-[state=active]:bg-white data-[state=active]:text-sky-700">
                  列表视图
                </TabsTrigger>
                <TabsTrigger value="board" className="data-[state=active]:bg-white data-[state=active]:text-sky-700">
                  看板视图
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-white data-[state=active]:text-sky-700"
                >
                  数据分析
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4" />
                  <Input
                    placeholder="搜索申请..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="expense">费用报销</SelectItem>
                    <SelectItem value="leave">请假申请</SelectItem>
                    <SelectItem value="purchase">采购申请</SelectItem>
                    <SelectItem value="training">培训申请</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="pending">待审批</SelectItem>
                    <SelectItem value="approved">已通过</SelectItem>
                    <SelectItem value="rejected">已拒绝</SelectItem>
                    <SelectItem value="draft">草稿</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  筛选
                </Button>
              </div>
            </div>

            <TabsContent value="list" className="space-y-4">
              {filteredApprovals.map((item) => {
                const TypeIcon = getTypeIcon(item.type)
                const statusStyle = getStatusStyle("approval", item.status)

                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                            <TypeIcon className="w-6 h-6 text-sky-600" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-slate-800">{item.title}</h3>
                              <Badge variant="outline" className={getPriorityColor(item.priority)}>
                                {getPriorityLabel(item.priority)}
                              </Badge>
                              <Badge className={statusStyle.color}>
                                {statusStyle.label}
                              </Badge>
                            </div>

                            <p className="text-sm text-slate-600 mb-3">{item.description}</p>

                            <div className="flex items-center space-x-6 text-sm text-slate-500">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {item.applicant}
                              </div>
                              <div className="flex items-center">
                                <Building className="w-4 h-4 mr-1" />
                                {item.department}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {item.submitDate}
                              </div>
                              {item.amount && (
                                <div className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1" />¥{item.amount.toLocaleString()}
                                </div>
                              )}
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-1" />
                                {getTypeLabel(item.type)}
                              </div>
                            </div>

                            {item.currentApprover && (
                              <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                <div className="flex items-center">
                                  <AlertTriangle className="w-4 h-4 text-amber-600 mr-2" />
                                  <span className="text-sm text-amber-800">
                                    等待 <strong>{item.currentApprover}</strong> 审批
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            查看
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            评论
                          </Button>
                          {item.status === "pending" && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                通过
                              </Button>
                              <Button size="sm" variant="destructive">
                                <XCircle className="w-4 h-4 mr-2" />
                                拒绝
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {item.attachments && item.attachments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <p className="text-sm text-slate-600 mb-2">附件:</p>
                          <div className="flex space-x-2">
                            {item.attachments.map((attachment, index) => (
                              <Badge key={index} variant="outline" className="bg-slate-50">
                                {attachment}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.comments && item.comments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <p className="text-sm text-slate-600 mb-2">最新评论:</p>
                          <div className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-slate-800">
                                {item.comments[item.comments.length - 1].author}
                              </span>
                              <span className="text-xs text-slate-500">
                                {item.comments[item.comments.length - 1].date}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">{item.comments[item.comments.length - 1].content}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>

            <TabsContent value="board" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {["pending", "approved", "rejected", "draft"].map((status) => {
                  const statusItems = filteredApprovals.filter((item) => item.status === status)
                  const statusStyle = getStatusStyle("approval", status as "pending" | "approved" | "rejected" | "cancelled" | "draft")

                  return (
                    <div key={status} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-800 flex items-center">
                          <div className={`w-3 h-3 rounded-full ${statusStyle.bgColor} mr-2`} />
                          {statusStyle.label}
                        </h3>
                        <Badge variant="outline" className={`${statusStyle.bgColor} ${statusStyle.color}`}>
                          {statusItems.length}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {statusItems.map((item) => {
                          const TypeIcon = getTypeIcon(item.type)
                          return (
                            <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                                    <TypeIcon className="w-4 h-4 text-sky-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-slate-800 text-sm leading-tight">{item.title}</h4>
                                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{item.description}</p>
                                    <div className="flex items-center justify-between mt-3">
                                      <span className="text-xs text-slate-500">{item.applicant}</span>
                                      <Badge variant="outline" className={getPriorityColor(item.priority)}>
                                        {getPriorityLabel(item.priority)}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>审批趋势</CardTitle>
                    <CardDescription>近30天审批数量变化</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-slate-500">
                      <div className="text-center">
                        <TrendingUp className="w-16 h-16 mx-auto mb-4 text-sky-300" />
                        <p>审批趋势图表区域</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>类型分布</CardTitle>
                    <CardDescription>各类型申请数量占比</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-slate-500">
                      <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-sky-300" />
                        <p>类型分布图表区域</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>部门统计</CardTitle>
                  <CardDescription>各部门申请数量和通过率</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["销售部", "技术部", "IT部", "人力资源部"].map((dept, index) => (
                      <div key={dept} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Building className="w-5 h-5 text-slate-600" />
                          <span className="font-medium text-slate-800">{dept}</span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <p className="font-medium text-slate-800">{Math.floor(Math.random() * 20) + 5}</p>
                            <p className="text-slate-500">申请数</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-green-600">{Math.floor(Math.random() * 30) + 70}%</p>
                            <p className="text-slate-500">通过率</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
