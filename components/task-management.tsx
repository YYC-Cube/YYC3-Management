/**
 * @fileoverview 任务管理组件
 * @description 任务创建、分配、进度跟踪等功能
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { CheckSquare, Plus, Search, Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { getProgressColor } from "@/lib/design-system"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "completed"
  priority: "low" | "medium" | "high" | "urgent"
  assignee: string
  assigneeAvatar: string
  dueDate: string
  progress: number
  tags: string[]
  project: string
  createdAt: string
  updatedAt: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  tasks: number
  completedTasks: number
}

export function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "产品原型设计",
      description: "完成新产品的原型设计和用户体验优化",
      status: "in-progress",
      priority: "high",
      assignee: "张设计师",
      assigneeAvatar: "/placeholder.svg?height=32&width=32",
      dueDate: "2025-06-25",
      progress: 65,
      tags: ["设计", "原型"],
      project: "新产品开发",
      createdAt: "2025-06-15",
      updatedAt: "2025-06-19",
    },
    {
      id: "2",
      title: "数据库优化",
      description: "优化数据库查询性能，提升系统响应速度",
      status: "todo",
      priority: "medium",
      assignee: "李工程师",
      assigneeAvatar: "/placeholder.svg?height=32&width=32",
      dueDate: "2025-06-30",
      progress: 0,
      tags: ["技术", "优化"],
      project: "系统维护",
      createdAt: "2025-06-18",
      updatedAt: "2025-06-18",
    },
    {
      id: "3",
      title: "市场调研报告",
      description: "完成Q2季度市场调研报告的撰写和分析",
      status: "completed",
      priority: "medium",
      assignee: "王分析师",
      assigneeAvatar: "/placeholder.svg?height=32&width=32",
      dueDate: "2025-06-20",
      progress: 100,
      tags: ["调研", "报告"],
      project: "市场分析",
      createdAt: "2025-06-10",
      updatedAt: "2025-06-19",
    },
    {
      id: "4",
      title: "客户需求分析",
      description: "分析重点客户的需求变化和市场趋势",
      status: "review",
      priority: "high",
      assignee: "陈经理",
      assigneeAvatar: "/placeholder.svg?height=32&width=32",
      dueDate: "2025-06-22",
      progress: 90,
      tags: ["客户", "分析"],
      project: "客户服务",
      createdAt: "2025-06-12",
      updatedAt: "2025-06-19",
    },
  ])

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "张设计师",
      role: "UI/UX设计师",
      avatar: "/placeholder.svg?height=40&width=40",
      tasks: 5,
      completedTasks: 3,
    },
    {
      id: "2",
      name: "李工程师",
      role: "后端开发",
      avatar: "/placeholder.svg?height=40&width=40",
      tasks: 8,
      completedTasks: 6,
    },
    {
      id: "3",
      name: "王分析师",
      role: "数据分析师",
      avatar: "/placeholder.svg?height=40&width=40",
      tasks: 4,
      completedTasks: 4,
    },
    {
      id: "4",
      name: "陈经理",
      role: "项目经理",
      avatar: "/placeholder.svg?height=40&width=40",
      tasks: 6,
      completedTasks: 4,
    },
  ])

  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "todo":
        return <Badge className="bg-gray-100 text-gray-800">待开始</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">进行中</Badge>
      case "review":
        return <Badge className="bg-yellow-100 text-yellow-800">待审核</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">已完成</Badge>
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">紧急</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">高优先级</Badge>
      case "medium":
        return <Badge variant="outline">中优先级</Badge>
      case "low":
        return <Badge variant="secondary">低优先级</Badge>
      default:
        return <Badge variant="secondary">普通</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <Clock className="w-4 h-4" />
      case "in-progress":
        return <AlertCircle className="w-4 h-4" />
      case "review":
        return <CheckCircle className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    review: tasks.filter((t) => t.status === "review").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">任务管理看板</h1>
          <p className="text-gray-600 mt-1">高效的团队任务协作平台</p>
        </div>
        <div className="flex items-center space-x-3">{/* 按钮组 */}</div>
      </div>

      {/* 任务统计卡片 - 严格执行统一规范 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-r-[5px] border-r-blue-400 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总任务数</p>
                <p className="text-3xl font-bold text-blue-600">{taskStats.total}</p>
                <p className="text-xs text-gray-500 mt-1">全部任务</p>
              </div>
              <CheckSquare className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-orange-400 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">待开始</p>
                <p className="text-3xl font-bold text-orange-600">{taskStats.todo}</p>
                <p className="text-xs text-gray-500 mt-1">等待开始的任务</p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-blue-400 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">进行中</p>
                <p className="text-3xl font-bold text-blue-600">{taskStats.inProgress}</p>
                <p className="text-xs text-gray-500 mt-1">正在执行的任务</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-yellow-400 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">待审核</p>
                <p className="text-3xl font-bold text-yellow-600">{taskStats.review}</p>
                <p className="text-xs text-gray-500 mt-1">等待审核的任务</p>
              </div>
              <CheckCircle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-green-400 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已完成</p>
                <p className="text-3xl font-bold text-green-600">{taskStats.completed}</p>
                <p className="text-xs text-gray-500 mt-1">已完成的任务</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-t-4 border-t-blue-400">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索任务..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="todo">待开始</SelectItem>
                <SelectItem value="in-progress">进行中</SelectItem>
                <SelectItem value="review">待审核</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  创建任务
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>创建新任务</DialogTitle>
                  <DialogDescription>填写任务详细信息</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="title">任务标题</Label>
                    <Input id="title" placeholder="请输入任务标题" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">任务描述</Label>
                    <Textarea id="description" placeholder="请输入任务描述" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignee">负责人</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择负责人" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name} - {member.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">优先级</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择优先级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">低优先级</SelectItem>
                        <SelectItem value="medium">中优先级</SelectItem>
                        <SelectItem value="high">高优先级</SelectItem>
                        <SelectItem value="urgent">紧急</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">截止日期</Label>
                    <Input id="dueDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project">所属项目</Label>
                    <Input id="project" placeholder="请输入项目名称" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>创建任务</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* 任务看板和团队成员 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="border-t-4 border-t-blue-400">
            <CardHeader>
              <CardTitle>任务看板</CardTitle>
              <CardDescription>拖拽任务卡片来更新状态</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 待开始列 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <h3 className="font-medium">待开始</h3>
                    <Badge variant="secondary">{taskStats.todo}</Badge>
                  </div>
                  <div className="space-y-2">
                    {filteredTasks
                      .filter((task) => task.status === "todo")
                      .map((task) => (
                        <Card
                          key={task.id}
                          className="hover:shadow-md transition-all duration-200 border-r-[5px] border-r-sky-200 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
                        >
                          <CardContent className="p-6">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{task.title}</h4>
                                {getPriorityBadge(task.priority)}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={task.assigneeAvatar || "/placeholder.svg"} />
                                    <AvatarFallback>{task.assignee[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{task.assignee}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {task.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* 进行中列 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    <h3 className="font-medium">进行中</h3>
                    <Badge variant="secondary">{taskStats.inProgress}</Badge>
                  </div>
                  <div className="space-y-2">
                    {filteredTasks
                      .filter((task) => task.status === "in-progress")
                      .map((task) => (
                        <Card
                          key={task.id}
                          className="hover:shadow-md transition-all duration-200 border-r-[5px] border-r-sky-200 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
                        >
                          <CardContent className="p-6">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{task.title}</h4>
                                {getPriorityBadge(task.priority)}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>进度</span>
                                  <span>{task.progress}%</span>
                                </div>
                                <div className="w-20 bg-sky-100 rounded-full h-2 mr-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(task.progress, task.status)}`}
                                    style={{ width: `${task.progress}%` }}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={task.assigneeAvatar || "/placeholder.svg"} />
                                    <AvatarFallback>{task.assignee[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{task.assignee}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {task.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* 待审核列 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-yellow-500" />
                    <h3 className="font-medium">待审核</h3>
                    <Badge variant="secondary">{taskStats.review}</Badge>
                  </div>
                  <div className="space-y-2">
                    {filteredTasks
                      .filter((task) => task.status === "review")
                      .map((task) => (
                        <Card
                          key={task.id}
                          className="hover:shadow-md transition-all duration-200 border-r-[5px] border-r-sky-200 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
                        >
                          <CardContent className="p-6">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{task.title}</h4>
                                {getPriorityBadge(task.priority)}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>进度</span>
                                  <span>{task.progress}%</span>
                                </div>
                                <div className="w-20 bg-sky-100 rounded-full h-2 mr-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(task.progress, task.status)}`}
                                    style={{ width: `${task.progress}%` }}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={task.assigneeAvatar || "/placeholder.svg"} />
                                    <AvatarFallback>{task.assignee[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{task.assignee}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {task.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* 已完成列 */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <h3 className="font-medium">已完成</h3>
                    <Badge variant="secondary">{taskStats.completed}</Badge>
                  </div>
                  <div className="space-y-2">
                    {filteredTasks
                      .filter((task) => task.status === "completed")
                      .map((task) => (
                        <Card
                          key={task.id}
                          className="hover:shadow-md transition-all duration-200 border-r-[5px] border-r-sky-200 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
                        >
                          <CardContent className="p-6">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{task.title}</h4>
                                {getPriorityBadge(task.priority)}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={task.assigneeAvatar || "/placeholder.svg"} />
                                    <AvatarFallback>{task.assignee[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{task.assignee}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <span className="text-xs text-green-600">已完成</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {task.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 团队成员分工 */}
        <div>
          <Card className="border-t-4 border-t-blue-400">
            <CardHeader>
              <CardTitle>团队成员</CardTitle>
              <CardDescription>成员分工情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{member.name}</h4>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs">任务: {member.tasks}</span>
                        <span className="text-xs text-green-600">完成: {member.completedTasks}</span>
                      </div>
                      <div className="w-24 bg-sky-100 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor((member.completedTasks / member.tasks) * 100)}`}
                          style={{ width: `${(member.completedTasks / member.tasks) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>项目进度</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>新产品开发</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" style={{ background: "rgb(226 232 240)" }}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(75)}`}
                      style={{ width: "75%" }}
                    />
                  </Progress>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>系统维护</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" style={{ background: "rgb(226 232 240)" }}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(45)}`}
                      style={{ width: "45%" }}
                    />
                  </Progress>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>市场分析</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-2" style={{ background: "rgb(226 232 240)" }}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(100)}`}
                      style={{ width: "100%" }}
                    />
                  </Progress>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>客户服务</span>
                    <span>90%</span>
                  </div>
                  <Progress value={90} className="h-2" style={{ background: "rgb(226 232 240)" }}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(90)}`}
                      style={{ width: "90%" }}
                    />
                  </Progress>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
