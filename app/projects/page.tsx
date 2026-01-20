/**
 * @fileoverview projects.tsx
 * @description 项目管理组件 - 集成真实API
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
import { Progress } from "@/components/ui/progress"
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
  Briefcase,
  Plus,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useProjects } from "@/hooks/use-projects"
import type { Project } from "@/store/project-store"

export default function ProjectsPage() {
  const { projects, loading, fetchProjects, createProject, updateProject, deleteProject } = useProjects({ page: 1, limit: 100 })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [showProjectDialog, setShowProjectDialog] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager_id: 1,
    manager_name: "",
    team_size: 1,
    priority: "medium",
    status: "planning",
    progress: 0,
    start_date: "",
    end_date: "",
    budget: 0,
  })

  const projectStats = {
    totalProjects: projects.length,
    completedProjects: projects.filter((p) => p.status === "completed").length,
    inProgressProjects: projects.filter((p) => p.status === "in_progress").length,
    delayedProjects: projects.filter((p) => {
      const today = new Date()
      const endDate = new Date(p.end_date)
      return endDate < today && p.status !== "completed"
    }).length,
  }

  const handleCreateProject = async () => {
    setDialogLoading(true)
    try {
      const result = await createProject(formData)
      if (result.success) {
        toast({
          title: "创建成功",
          description: "项目已成功创建",
        })
        setShowProjectDialog(false)
        resetForm()
      } else {
        toast({
          title: "创建失败",
          description: result.error || "无法创建项目，请稍后重试",
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

  const handleUpdateProject = async () => {
    if (!editingProject) return

    setDialogLoading(true)
    try {
      const result = await updateProject(editingProject.id, formData)
      if (result.success) {
        toast({
          title: "更新成功",
          description: "项目信息已成功更新",
        })
        setShowProjectDialog(false)
        setEditingProject(null)
        resetForm()
      } else {
        toast({
          title: "更新失败",
          description: result.error || "无法更新项目，请稍后重试",
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

  const handleDeleteProject = async (projectId: number) => {
    const result = await deleteProject(projectId)
    if (result.success) {
      toast({
        title: "删除成功",
        description: "项目已成功删除",
      })
    } else {
      toast({
        title: "删除失败",
        description: result.error || "无法删除项目，请稍后重试",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      manager_id: 1,
      manager_name: "",
      team_size: 1,
      priority: "medium",
      status: "planning",
      progress: 0,
      start_date: "",
      end_date: "",
      budget: 0,
    })
  }

  const openCreateDialog = () => {
    resetForm()
    setEditingProject(null)
    setShowProjectDialog(true)
  }

  const openEditDialog = (project: Project) => {
    setFormData({
      name: project.name,
      description: project.description,
      manager_id: project.manager_id,
      manager_name: project.manager_name,
      team_size: project.team_size,
      priority: project.priority,
      status: project.status,
      progress: project.progress,
      start_date: project.start_date.split("T")[0],
      end_date: project.end_date.split("T")[0],
      budget: project.budget,
    })
    setEditingProject(project)
    setShowProjectDialog(true)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-50"
      case "high":
        return "text-orange-600 bg-orange-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50"
      case "in_progress":
        return "text-blue-600 bg-blue-50"
      case "planning":
        return "text-gray-600 bg-gray-50"
      case "on_hold":
        return "text-orange-600 bg-orange-50"
      case "cancelled":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
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
      case "planning":
        return "规划中"
      case "on_hold":
        return "暂停"
      case "cancelled":
        return "已取消"
      default:
        return "规划中"
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "completed" && project.status === "completed") ||
      (selectedFilter === "in_progress" && project.status === "in_progress") ||
      (selectedFilter === "planning" && project.status === "planning")
    return matchesSearch && matchesFilter
  })

  if (loading && projects.length === 0) {
    return (
      <PageContainer title="项目管理" description="跟踪和管理项目进度">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="项目管理" description="跟踪和管理项目进度">
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <EnhancedButton onClick={openCreateDialog} className="bg-orange-600 hover:bg-orange-700 border-r-4 border-r-orange-500 shadow-[4px_0_12px_rgba(249,115,22,0.15)]">
            <Plus className="w-4 h-4 mr-2 text-white" />
            新建项目
          </EnhancedButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedCard className="border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(249,115,22,0.15)] hover:border-r-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">总项目数</p>
                <p className="text-2xl font-bold text-slate-800">{projectStats.totalProjects}</p>
                <p className="text-xs text-orange-600 mt-1">活跃项目</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(249,115,22,0.15)] hover:border-r-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">已完成</p>
                <p className="text-2xl font-bold text-slate-800">{projectStats.completedProjects}</p>
                <p className="text-xs text-green-600 mt-1">
                  完成率 {projectStats.totalProjects > 0 ? Math.round((projectStats.completedProjects / projectStats.totalProjects) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(249,115,22,0.15)] hover:border-r-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">进行中</p>
                <p className="text-2xl font-bold text-slate-800">{projectStats.inProgressProjects}</p>
                <p className="text-xs text-orange-600 mt-1">正在执行</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(249,115,22,0.15)] hover:border-r-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">延期项目</p>
                <p className="text-2xl font-bold text-slate-800">{projectStats.delayedProjects}</p>
                <p className="text-xs text-red-600 mt-1">需要关注</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </EnhancedCard>
        </div>

        <EnhancedCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">项目列表</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="搜索项目..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">全部项目</option>
                <option value="planning">规划中</option>
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
            {filteredProjects.map((project) => (
              <div key={project.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors border-r-4 border-r-orange-500 shadow-[2px_0_8px_rgba(249,115,22,0.1)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-800">{project.name}</h3>
                    <Badge className={getPriorityColor(project.priority)}>
                      {getPriorityLabel(project.priority)}优先级
                    </Badge>
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusLabel(project.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <EnhancedButton size="sm" variant="outline" onClick={() => openEditDialog(project)}>
                      <Edit className="w-4 h-4" />
                    </EnhancedButton>
                    <EnhancedButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </EnhancedButton>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    项目经理: {project.manager_name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    团队人数: {project.team_size}人
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    开始: {project.start_date.split("T")[0]}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    结束: {project.end_date.split("T")[0]}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600">项目进度</span>
                    <span className="font-medium text-slate-800">{project.progress}%</span>
                  </div>
                  <div className="text-sm text-slate-600">预算: ¥{project.budget.toLocaleString()}</div>
                </div>

                <Progress value={project.progress} className="h-2" />
              </div>
            ))}
          </div>
        </EnhancedCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnhancedCard>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">项目状态分布</h3>
            <div className="space-y-3">
              {[
                { status: "进行中", count: projectStats.inProgressProjects, percentage: projectStats.totalProjects > 0 ? Math.round((projectStats.inProgressProjects / projectStats.totalProjects) * 100) : 0, color: "bg-blue-500" },
                { status: "已完成", count: projectStats.completedProjects, percentage: projectStats.totalProjects > 0 ? Math.round((projectStats.completedProjects / projectStats.totalProjects) * 100) : 0, color: "bg-green-500" },
                { status: "规划中", count: projects.filter((p) => p.status === "planning").length, percentage: projectStats.totalProjects > 0 ? Math.round((projects.filter((p) => p.status === "planning").length / projectStats.totalProjects) * 100) : 0, color: "bg-gray-500" },
                { status: "暂停", count: projects.filter((p) => p.status === "on_hold").length, percentage: projectStats.totalProjects > 0 ? Math.round((projects.filter((p) => p.status === "on_hold").length / projectStats.totalProjects) * 100) : 0, color: "bg-orange-500" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-slate-800">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-slate-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                    </div>
                    <span className="font-medium text-slate-800 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </EnhancedCard>

          <EnhancedCard>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">项目优先级分布</h3>
            <div className="space-y-3">
              {[
                { priority: "紧急", count: projects.filter((p) => p.priority === "urgent").length, percentage: projectStats.totalProjects > 0 ? Math.round((projects.filter((p) => p.priority === "urgent").length / projectStats.totalProjects) * 100) : 0, color: "bg-red-500" },
                { priority: "高", count: projects.filter((p) => p.priority === "high").length, percentage: projectStats.totalProjects > 0 ? Math.round((projects.filter((p) => p.priority === "high").length / projectStats.totalProjects) * 100) : 0, color: "bg-orange-500" },
                { priority: "中", count: projects.filter((p) => p.priority === "medium").length, percentage: projectStats.totalProjects > 0 ? Math.round((projects.filter((p) => p.priority === "medium").length / projectStats.totalProjects) * 100) : 0, color: "bg-yellow-500" },
                { priority: "低", count: projects.filter((p) => p.priority === "low").length, percentage: projectStats.totalProjects > 0 ? Math.round((projects.filter((p) => p.priority === "low").length / projectStats.totalProjects) * 100) : 0, color: "bg-green-500" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-slate-800">{item.priority}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-slate-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                    </div>
                    <span className="font-medium text-slate-800 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </EnhancedCard>
        </div>
      </div>

      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingProject ? "编辑项目" : "新建项目"}</DialogTitle>
            <DialogDescription>
              {editingProject ? "编辑项目信息" : "创建新项目并设置相关信息"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                项目名称
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                项目描述
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="manager_name" className="text-right">
                项目经理
              </Label>
              <Input
                id="manager_name"
                value={formData.manager_name}
                onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team_size" className="text-right">
                团队人数
              </Label>
              <Input
                id="team_size"
                type="number"
                min="1"
                value={formData.team_size}
                onChange={(e) => setFormData({ ...formData, team_size: parseInt(e.target.value) || 1 })}
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
                  <SelectItem value="planning">规划中</SelectItem>
                  <SelectItem value="in_progress">进行中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="on_hold">暂停</SelectItem>
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
              <Label htmlFor="start_date" className="text-right">
                开始日期
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end_date" className="text-right">
                结束日期
              </Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget" className="text-right">
                预算
              </Label>
              <Input
                id="budget"
                type="number"
                min="0"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <EnhancedButton variant="outline" onClick={() => setShowProjectDialog(false)}>
              取消
            </EnhancedButton>
            <EnhancedButton onClick={editingProject ? handleUpdateProject : handleCreateProject} disabled={dialogLoading}>
              {dialogLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingProject ? "更新中..." : "创建中..."}
                </>
              ) : (
                editingProject ? "更新" : "创建"
              )}
            </EnhancedButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FloatingNavButtons />
    </PageContainer>
  )
}
