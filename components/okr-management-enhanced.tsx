/**
 * @fileoverview okr-management-enhanced.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EnhancedProgress } from "@/components/ui/enhanced-progress"
import { InteractiveProgress } from "@/components/ui/interactive-progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { OKRAnalyticsCharts } from "@/components/charts/okr-analytics-charts"
import { useToast } from "@/hooks/use-toast"
import {
  Target,
  TrendingUp,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  BarChart3,
  Lightbulb,
  PieChart,
  Save,
  RefreshCw,
  Zap,
  Bell,
  Share2,
  MessageSquare,
  Users,
} from "lucide-react"

interface OKR {
  id: string
  title: string
  description: string
  owner: string
  department: string
  quarter: string
  status: "draft" | "active" | "completed" | "cancelled"
  progress: number
  keyResults: KeyResult[]
  createdAt: string
  dueDate: string
  priority: "high" | "medium" | "low"
  tags: string[]
  sharedWith?: string[]
  notifications?: NotificationRule[]
}

interface KeyResult {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  progress: number
  status: "on-track" | "at-risk" | "off-track"
  lastUpdated: string
  milestones: Milestone[]
}

interface Milestone {
  id: string
  title: string
  date: string
  completed: boolean
}

interface NotificationRule {
  id: string
  type: "deadline" | "progress" | "milestone"
  enabled: boolean
  threshold?: number
  reminderDays?: number
}

export function OKRManagementEnhanced() {
  const [selectedQuarter, setSelectedQuarter] = useState("2025-Q2")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedOKR, setSelectedOKR] = useState<OKR | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isAutoRefresh, setIsAutoRefresh] = useState(false)
  const { toast } = useToast()

  // 模拟增强的OKR数据
  const [okrs, setOkrs] = useState<OKR[]>([
    {
      id: "1",
      title: "提升客户满意度和服务质量",
      description: "通过优化服务流程和提升团队能力，显著提高客户满意度",
      owner: "张经理",
      department: "客服部",
      quarter: "2025-Q2",
      status: "active",
      progress: 75,
      priority: "high",
      tags: ["客户体验", "服务优化"],
      createdAt: "2025-04-01",
      dueDate: "2025-06-30",
      sharedWith: ["李工程师", "王主管", "陈专员"],
      notifications: [
        { id: "n1", type: "deadline", enabled: true, reminderDays: 7 },
        { id: "n2", type: "progress", enabled: true, threshold: 20 },
      ],
      keyResults: [
        {
          id: "kr1",
          title: "客户满意度评分达到4.5分",
          description: "通过客户调研提升满意度评分",
          target: 4.5,
          current: 4.2,
          unit: "分",
          progress: 80,
          status: "on-track",
          lastUpdated: "2025-05-15",
          milestones: [
            { id: "m1", title: "完成客户调研系统", date: "2025-04-15", completed: true },
            { id: "m2", title: "实施服务改进计划", date: "2025-05-01", completed: true },
            { id: "m3", title: "达到4.3分评分", date: "2025-05-30", completed: false },
          ],
        },
        {
          id: "kr2",
          title: "客户投诉处理时间缩短至2小时内",
          description: "优化投诉处理流程，提升响应速度",
          target: 2,
          current: 3.5,
          unit: "小时",
          progress: 60,
          status: "at-risk",
          lastUpdated: "2025-05-10",
          milestones: [
            { id: "m4", title: "建立快速响应机制", date: "2025-04-20", completed: true },
            { id: "m5", title: "培训客服团队", date: "2025-05-15", completed: false },
          ],
        },
      ],
    },
    {
      id: "2",
      title: "数字化转型和系统优化",
      description: "推进企业数字化转型，提升运营效率",
      owner: "李总监",
      department: "技术部",
      quarter: "2025-Q2",
      status: "active",
      progress: 60,
      priority: "high",
      tags: ["数字化", "系统升级"],
      createdAt: "2025-04-01",
      dueDate: "2025-06-30",
      sharedWith: ["张经理", "王主管"],
      notifications: [
        { id: "n3", type: "deadline", enabled: true, reminderDays: 14 },
        { id: "n4", type: "milestone", enabled: true },
      ],
      keyResults: [
        {
          id: "kr3",
          title: "完成核心业务系统升级",
          description: "升级ERP和CRM系统，提升系统性能",
          target: 100,
          current: 65,
          unit: "%",
          progress: 65,
          status: "on-track",
          lastUpdated: "2025-05-12",
          milestones: [
            { id: "m6", title: "系统需求分析", date: "2025-04-10", completed: true },
            { id: "m7", title: "开发环境搭建", date: "2025-04-25", completed: true },
            { id: "m8", title: "核心功能开发", date: "2025-05-20", completed: false },
          ],
        },
      ],
    },
  ])

  // 交互式进度更新
  const handleProgressUpdate = useCallback(
    (okrId: string, krId: string, newProgress: number) => {
      setOkrs((prevOkrs) =>
        prevOkrs.map((okr) => {
          if (okr.id === okrId) {
            const updatedKeyResults = okr.keyResults.map((kr) => {
              if (kr.id === krId) {
                // 根据进度自动更新状态
                let newStatus: "on-track" | "at-risk" | "off-track" = "on-track"
                if (newProgress < 40) newStatus = "off-track"
                else if (newProgress < 70) newStatus = "at-risk"

                return {
                  ...kr,
                  progress: newProgress,
                  status: newStatus,
                  lastUpdated: new Date().toLocaleDateString("zh-CN"),
                }
              }
              return kr
            })

            // 重新计算OKR总进度
            const avgProgress = Math.round(
              updatedKeyResults.reduce((sum, kr) => sum + kr.progress, 0) / updatedKeyResults.length,
            )

            return {
              ...okr,
              keyResults: updatedKeyResults,
              progress: avgProgress,
            }
          }
          return okr
        }),
      )

      // 显示成功提示
      toast({
        title: "进度更新成功",
        description: `进度已更新为 ${newProgress}%`,
        duration: 2000,
      })

      // 检查是否需要发送通知
      checkProgressNotifications(okrId, newProgress)
    },
    [toast],
  )

  // 里程碑切换
  const handleMilestoneToggle = useCallback(
    (okrId: string, krId: string, milestoneId: string) => {
      setOkrs((prevOkrs) =>
        prevOkrs.map((okr) => {
          if (okr.id === okrId) {
            const updatedKeyResults = okr.keyResults.map((kr) => {
              if (kr.id === krId) {
                const updatedMilestones = kr.milestones.map((milestone) => {
                  if (milestone.id === milestoneId) {
                    return { ...milestone, completed: !milestone.completed }
                  }
                  return milestone
                })

                // 根据里程碑完成情况自动更新进度
                const completedCount = updatedMilestones.filter((m) => m.completed).length
                const newProgress = Math.round((completedCount / updatedMilestones.length) * 100)

                return {
                  ...kr,
                  milestones: updatedMilestones,
                  progress: newProgress,
                  lastUpdated: new Date().toLocaleDateString("zh-CN"),
                }
              }
              return kr
            })

            return { ...okr, keyResults: updatedKeyResults }
          }
          return okr
        }),
      )

      toast({
        title: "里程碑更新",
        description: "里程碑状态已更新",
        duration: 1500,
      })
    },
    [toast],
  )

  // 检查进度通知
  const checkProgressNotifications = (okrId: string, progress: number) => {
    const okr = okrs.find((o) => o.id === okrId)
    if (!okr) return

    const progressRule = okr.notifications?.find((n) => n.type === "progress" && n.enabled)
    if (progressRule && progressRule.threshold && progress < progressRule.threshold) {
      toast({
        title: "进度预警",
        description: `目标"${okr.title}"进度低于预期，请关注`,
        duration: 5000,
      })
    }
  }

  // 自动刷新功能
  const handleAutoRefresh = useCallback(() => {
    setIsAutoRefresh(!isAutoRefresh)
    if (!isAutoRefresh) {
      toast({
        title: "自动刷新已开启",
        description: "数据将每30秒自动更新",
        duration: 2000,
      })
    } else {
      toast({
        title: "自动刷新已关闭",
        description: "数据更新已停止",
        duration: 2000,
      })
    }
  }, [isAutoRefresh, toast])

  // 分享OKR
  const handleShareOKR = (okrId: string) => {
    toast({
      title: "OKR已分享",
      description: "目标已分享给团队成员，他们将收到通知",
      duration: 3000,
    })
  }

  // 设置通知规则
  const handleNotificationSettings = (okrId: string) => {
    toast({
      title: "通知设置",
      description: "通知规则已更新",
      duration: 2000,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "at-risk":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "off-track":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "on-track":
        return "进展顺利"
      case "at-risk":
        return "存在风险"
      case "off-track":
        return "进度滞后"
      default:
        return "未知状态"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "高优先级"
      case "medium":
        return "中优先级"
      case "low":
        return "低优先级"
      default:
        return "未设置"
    }
  }

  const filteredOKRs = okrs.filter((okr) => {
    if (selectedDepartment !== "all" && okr.department !== selectedDepartment) return false
    if (okr.quarter !== selectedQuarter) return false
    return true
  })

  // SMART目标设定向导
  const SMARTGuide = () => (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Lightbulb className="w-5 h-5" />
          SMART目标设定指南
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { letter: "S", word: "Specific", desc: "具体明确", color: "bg-red-100 text-red-800" },
            { letter: "M", word: "Measurable", desc: "可衡量", color: "bg-orange-100 text-orange-800" },
            { letter: "A", word: "Achievable", desc: "可实现", color: "bg-yellow-100 text-yellow-800" },
            { letter: "R", word: "Relevant", desc: "相关性", color: "bg-green-100 text-green-800" },
            { letter: "T", word: "Time-bound", desc: "有时限", color: "bg-blue-100 text-blue-800" },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div
                className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center font-bold text-lg mx-auto mb-2 transition-transform hover:scale-110`}
              >
                {item.letter}
              </div>
              <p className="font-medium text-slate-800">{item.word}</p>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      {/* 页面操作区 */}
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoRefresh}
            className={`${isAutoRefresh ? "bg-green-50 border-green-200 text-green-700" : ""}`}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isAutoRefresh ? "animate-spin" : ""}`} />
            {isAutoRefresh ? "自动刷新中" : "开启自动刷新"}
          </Button>
          <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-Q1">2025 Q1</SelectItem>
              <SelectItem value="2025-Q2">2025 Q2</SelectItem>
              <SelectItem value="2025-Q3">2025 Q3</SelectItem>
              <SelectItem value="2025-Q4">2025 Q4</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                创建OKR
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>创建新的OKR目标</DialogTitle>
                <DialogDescription>使用SMART原则设定您的目标和关键结果</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">目标标题</Label>
                  <Input id="title" placeholder="输入具体的目标标题" />
                </div>
                <div>
                  <Label htmlFor="description">目标描述</Label>
                  <Textarea id="description" placeholder="详细描述目标的背景和意义" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="owner">负责人</Label>
                    <Input id="owner" placeholder="指定负责人" />
                  </div>
                  <div>
                    <Label htmlFor="priority">优先级</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择优先级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">高优先级</SelectItem>
                        <SelectItem value="medium">中优先级</SelectItem>
                        <SelectItem value="low">低优先级</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    取消
                  </Button>
                  <Button className="bg-gradient-to-r from-sky-500 to-blue-600 text-white">创建目标</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 标签页导航 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-sky-100">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            目标概览
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            数据分析
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            智能协作
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* SMART指南 */}
          <SMARTGuide />

          {/* 统计卡片区域 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-r-[5px] border-r-purple-400 hover:shadow-md transition-all duration-200 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">总OKR数量</p>
                    <p className="text-3xl font-bold text-purple-600">{filteredOKRs.length}</p>
                    <p className="text-xs text-slate-500 mt-1">本季度活跃目标</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-[5px] border-r-sky-400 hover:shadow-md transition-all duration-200 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">平均完成度</p>
                    <p className="text-3xl font-bold text-sky-600">
                      {Math.round(filteredOKRs.reduce((acc, okr) => acc + okr.progress, 0) / filteredOKRs.length)}%
                    </p>
                    <p className="text-xs text-slate-500 mt-1">整体进展情况</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-sky-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-[5px] border-r-emerald-400 hover:shadow-md transition-all duration-200 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">协作目标</p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {filteredOKRs.filter((okr) => okr.sharedWith && okr.sharedWith.length > 0).length}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">团队共享中</p>
                  </div>
                  <Users className="w-8 h-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-r-[5px] border-r-amber-400 hover:shadow-md transition-all duration-200 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">活跃通知</p>
                    <p className="text-3xl font-bold text-amber-600">
                      {filteredOKRs.reduce(
                        (total, okr) => total + (okr.notifications?.filter((n) => n.enabled).length || 0),
                        0,
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">智能提醒中</p>
                  </div>
                  <Bell className="w-8 h-8 text-amber-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <OKRAnalyticsCharts />
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          {/* 智能协作OKR列表 */}
          <div className="space-y-6">
            {filteredOKRs.map((okr) => (
              <Card
                key={okr.id}
                className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <CardHeader className="border-b border-sky-100 bg-gradient-to-r from-sky-50/50 to-blue-50/30">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg text-slate-800 group-hover:text-sky-700 transition-colors">
                          {okr.title}
                        </CardTitle>
                        <Badge className={getPriorityColor(okr.priority)}>{getPriorityText(okr.priority)}</Badge>
                        {okr.sharedWith && okr.sharedWith.length > 0 && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            <Users className="w-3 h-3 mr-1" />
                            协作中
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-slate-600">{okr.description}</CardDescription>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-slate-500">
                        <span>负责人: {okr.owner}</span>
                        <span>部门: {okr.department}</span>
                        <span>截止: {okr.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {okr.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs hover:bg-sky-50 transition-colors">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {okr.sharedWith && okr.sharedWith.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-slate-600 mb-1">协作成员:</p>
                          <div className="flex items-center gap-1">
                            {okr.sharedWith.map((member, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                {member}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="border-sky-200 text-sky-700">
                        {okr.quarter}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-800">{okr.progress}%</div>
                        <div className="w-20 mt-1">
                          <EnhancedProgress value={okr.progress} size="sm" animated />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-slate-600 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-sky-500" />
                        智能协作关键结果
                      </h4>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNotificationSettings(okr.id)}
                          className="text-xs bg-transparent hover:bg-amber-50"
                        >
                          <Bell className="w-3 h-3 mr-1" />
                          通知设置
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs bg-transparent hover:bg-sky-50">
                          <Plus className="w-3 h-3 mr-1" />
                          添加KR
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {okr.keyResults.map((kr) => (
                        <div
                          key={kr.id}
                          className="border border-sky-200 rounded-lg p-4 bg-sky-50/30 hover:bg-sky-50/50 transition-all duration-200"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h5 className="font-medium text-slate-800">{kr.title}</h5>
                              <p className="text-sm text-slate-600 mt-1">{kr.description}</p>
                              <p className="text-xs text-slate-500 mt-1">最后更新: {kr.lastUpdated}</p>
                            </div>
                            <Badge className={getStatusColor(kr.status)}>{getStatusText(kr.status)}</Badge>
                          </div>

                          {/* 交互式里程碑 */}
                          <div className="mb-4">
                            <p className="text-xs text-slate-600 mb-2">智能里程碑跟踪:</p>
                            <div className="flex flex-wrap items-center gap-2">
                              {kr.milestones.map((milestone, index) => (
                                <button
                                  key={milestone.id}
                                  onClick={() => handleMilestoneToggle(okr.id, kr.id, milestone.id)}
                                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-sky-200 hover:border-sky-300 hover:bg-sky-50 transition-all duration-200 group"
                                >
                                  {milestone.completed ? (
                                    <CheckCircle className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
                                  )}
                                  <span
                                    className={`text-xs ${
                                      milestone.completed
                                        ? "text-green-600 line-through"
                                        : "text-slate-600 group-hover:text-sky-700"
                                    } transition-colors`}
                                  >
                                    {milestone.title}
                                  </span>
                                  {index < kr.milestones.length - 1 && <span className="text-slate-300 mx-1">→</span>}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 交互式进度条 */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="text-sm">
                                <span className="font-medium text-slate-800">{kr.current}</span>
                                <span className="text-slate-600">
                                  {" "}
                                  / {kr.target} {kr.unit}
                                </span>
                              </div>
                              <Badge className={getStatusColor(kr.status)} variant="outline">
                                {kr.progress}%
                              </Badge>
                            </div>
                            <InteractiveProgress
                              value={kr.progress}
                              status={kr.status}
                              size="md"
                              editable
                              animated
                              title="拖拽或点击调整进度，系统将自动发送通知"
                              onValueChange={(newValue) => handleProgressUpdate(okr.id, kr.id, newValue)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end space-x-2 pt-4 border-t border-sky-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShareOKR(okr.id)}
                        className="border-sky-200 text-sky-700 hover:bg-sky-50 bg-transparent transition-all duration-200 hover:scale-105"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        分享协作
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-sky-200 text-sky-700 hover:bg-sky-50 bg-transparent transition-all duration-200 hover:scale-105"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        团队讨论
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-sky-200 text-sky-700 hover:bg-sky-50 bg-transparent transition-all duration-200 hover:scale-105"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        查看详情
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white transition-all duration-200 hover:scale-105"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        保存更改
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
