/**
 * @fileoverview tasks.tsx
 * @description 任务管理组件 - 集成真实API
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
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTasks } from "@/hooks/use-tasks"
import { toast } from "@/hooks/use-toast"
import type { Task } from "@/lib/db/models/task"
import {
  AlertCircle,
  CheckCircle,
  CheckSquare,
  Clock,
  Edit,
  Filter,
  Loader2,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react"
import { useState } from "react"

export default function TasksPage() {
  const { tasks, loading, fetchTasks: _fetchTasks, createTask, updateTask, deleteTask } = useTasks({ page: 1, limit: 100 })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    assignee_id: number;
    assignee_name: string;
    project_id: number | null;
    project_name: string;
    priority: string;
    status: string;
    progress: number;
    due_date: string;
  }>({
    title: "",
    description: "",
    assignee_id: 1,
    assignee_name: "",
    project_id: null,
    project_name: "",
    priority: "medium",
    status: "pending",
    progress: 0,
    due_date: "",
  })

  const taskStats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "已完成").length,
    inProgressTasks: tasks.filter((t) => t.status === "进行中").length,
    overdueTasks: tasks.filter((t) => {
      if (!t.due_date) return false
      const today = new Date()
      const dueDate = new Date(t.due_date)
      return dueDate < today && t.status !== "已完成"
    }).length,
  }

  const handleCreateTask = async () => {
    setDialogLoading(true)
    try {
      await createTask(formData as any)
      toast({
        title: "创建成功",
        description: "任务已成功创建",
      })
      setShowTaskDialog(false)
      resetForm()
    } catch (error) {
      toast({
        title: "创建失败",
        description: error instanceof Error ? error.message : "无法创建任务，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setDialogLoading(false)
    }
  }

  const handleUpdateTask = async () => {
    if (!editingTask) return

    setDialogLoading(true)
    try {
      await updateTask(editingTask.id, formData as any)
      toast({
        title: "更新成功",
        description: "任务信息已成功更新",
      })
      setShowTaskDialog(false)
      setEditingTask(null)
      resetForm()
    } catch (error) {
      toast({
        title: "更新失败",
        description: error instanceof Error ? error.message : "无法更新任务，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setDialogLoading(false)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId)
      toast({
        title: "删除成功",
        description: "任务已成功删除",
      })
    } catch (error) {
      toast({
        title: "删除失败",
        description: error instanceof Error ? error.message : "无法删除任务，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      assignee_id: 1,
      assignee_name: "",
      project_id: null,
      project_name: "",
      priority: "medium",
      status: "pending",
      progress: 0,
      due_date: "",
    })
  }

  const openCreateDialog = () => {
    resetForm()
    setEditingTask(null)
    setShowTaskDialog(true)
  }

  const openEditDialog = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description || "",
      assignee_id: task.assignee_id || 0,
      assignee_name: task.assignee_name || "",
      project_id: task.project_id ?? null,
      project_name: task.project_name || "",
      priority: task.priority,
      status: task.status,
      progress: task.progress,
      due_date: task.due_date ? new Date(task.due_date).toISOString().split("T")[0] : "",
    })
    setEditingTask(task)
    setShowTaskDialog(true)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-destructive bg-destructive/10"
      case "high":
        return "text-orange-600 bg-orange-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-success bg-success/10"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-success bg-success/10"
      case "in_progress":
        return "text-blue-600 bg-blue-50"
      case "pending":
        return "text-muted-foreground bg-muted"
      case "cancelled":
        return "text-destructive bg-destructive/10"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "紧急"
      case "high":
        return "高"
      case "medium":
        return "中"
      case "low":
        return "低"
      default:
        return "中"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "已完成"
      case "in_progress":
        return "进行中"
      case "pending":
        return "待处理"
      case "cancelled":
        return "已取消"
      default:
        return "待处理"
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "completed" && task.status === "已完成") ||
      (selectedFilter === "in_progress" && task.status === "进行中") ||
      (selectedFilter === "pending" && task.status === "待处理")
    return matchesSearch && matchesFilter
  })

  if (loading && tasks.length === 0) {
    return (
      <PageContainer title="任务管理" description="跟踪和管理团队任务进度">
        <div className="flex items-center justify-center min-h-100">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="任务管理" description="跟踪和管理团队任务进度">
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <EnhancedButton onClick={openCreateDialog} className="bg-orange-600 hover:bg-orange-700 border-r-4 border-r-orange-500 shadow-md">
            <Plus className="w-4 h-4 mr-2 text-white" />
            新建任务
          </EnhancedButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-r-[5px] border-r-orange-500 shadow-md hover:border-r-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总任务数</p>
                <p className="text-2xl font-bold text-card-foreground">{taskStats.totalTasks}</p>
                <p className="text-xs text-orange-600 mt-1">本月任务</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="border-r-[5px] border-r-orange-500 shadow-md hover:border-r-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已完成</p>
                <p className="text-2xl font-bold text-card-foreground">{taskStats.completedTasks}</p>
                <p className="text-xs text-success mt-1">
                  完成率 {taskStats.totalTasks > 0 ? Math.round((taskStats.completedTasks / taskStats.totalTasks) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="border-r-[5px] border-r-orange-500 shadow-md hover:border-r-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">进行中</p>
                <p className="text-2xl font-bold text-card-foreground">{taskStats.inProgressTasks}</p>
                <p className="text-xs text-orange-600 mt-1">正在处理</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="border-r-[5px] border-r-orange-500 shadow-md hover:border-r-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">逾期任务</p>
                <p className="text-2xl font-bold text-card-foreground">{taskStats.overdueTasks}</p>
                <p className="text-xs text-destructive mt-1">需要关注</p>
              </div>
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-card-foreground">任务列表</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索任务..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">全部任务</option>
                <option value="pending">待处理</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
              </select>
              <EnhancedButton variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </EnhancedButton>
            </div>
          </div>

          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="p-4 border border-border rounded-lg hover:bg-muted transition-colors border-r-4 border-r-orange-500 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-card-foreground">{task.title}</h3>
                    <Badge className={getPriorityColor(task.priority)}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                    <Badge className={getStatusColor(task.status)}>
                      {getStatusLabel(task.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <EnhancedButton size="sm" variant="outline" onClick={() => openEditDialog(task)}>
                      <Edit className="w-4 h-4" />
                    </EnhancedButton>
                    <EnhancedButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </EnhancedButton>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {task.assignee_name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    截止: {task.due_date ? new Date(task.due_date).toISOString().split("T")[0] : "-"}
                  </div>
                  {task.project_name && (
                    <div className="flex items-center gap-1">
                      <CheckSquare className="w-4 h-4" />
                      {task.project_name}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">进度</span>
                      <span className="text-card-foreground font-medium">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>{editingTask ? "编辑任务" : "新建任务"}</DialogTitle>
            <DialogDescription>
              {editingTask ? "编辑任务信息" : "创建新任务并设置相关信息"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                任务标题
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                任务描述
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignee_name" className="text-right">
                负责人
              </Label>
              <Input
                id="assignee_name"
                value={formData.assignee_name}
                onChange={(e) => setFormData({ ...formData, assignee_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                优先级
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">紧急</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                状态
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">待处理</SelectItem>
                  <SelectItem value="in_progress">进行中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="progress" className="text-right">
                进度
              </Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="due_date" className="text-right">
                截止日期
              </Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <EnhancedButton variant="outline" onClick={() => setShowTaskDialog(false)}>
              取消
            </EnhancedButton>
            <EnhancedButton onClick={editingTask ? handleUpdateTask : handleCreateTask} disabled={dialogLoading}>
              {dialogLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingTask ? "更新中..." : "创建中..."}
                </>
              ) : (
                editingTask ? "更新" : "创建"
              )}
            </EnhancedButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FloatingNavButtons />
    </PageContainer>
  )
}
