/**
 * @fileoverview task-management-enhanced.tsx
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { PageContainer } from "@/components/layout/page-container"
import { commonStyles } from "@/lib/design-system"
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  MoreHorizontal,
  Flag,
  MessageSquare,
  Paperclip,
  TrendingUp,
  Target,
  Timer,
  BarChart3,
} from "lucide-react"
import { getProgressColor } from "@/lib/design-system"

const tasks = [
  {
    id: 1,
    title: "Q4销售报告制作",
    description: "整理Q4季度销售数据，制作详细分析报告",
    status: "进行中",
    priority: "高",
    assignee: "张经理",
    dueDate: "2025-06-25",
    progress: 75,
    tags: ["销售", "报告"],
    comments: 5,
    attachments: 3,
    timeSpent: "12h 30m",
    estimatedTime: "16h",
  },
  {
    id: 2,
    title: "客户满意度调研",
    description: "对重点客户进行满意度调研，收集反馈意见",
    status: "待开始",
    priority: "中",
    assignee: "李专员",
    dueDate: "2025-06-28",
    progress: 0,
    tags: ["客户", "调研"],
    comments: 2,
    attachments: 1,
    timeSpent: "0h",
    estimatedTime: "8h",
  },
  {
    id: 3,
    title: "产品库存盘点",
    description: "对仓库所有产品进行全面盘点，更新库存数据",
    status: "已完成",
    priority: "高",
    assignee: "王主管",
    dueDate: "2025-06-20",
    progress: 100,
    tags: ["库存", "盘点"],
    comments: 8,
    attachments: 5,
    timeSpent: "24h 15m",
    estimatedTime: "20h",
  },
]

const taskStats = [
  { label: "总任务数", value: "156", change: "+12", icon: Target, color: "from-blue-400 to-sky-500" },
  { label: "进行中", value: "42", change: "+8", icon: PlayCircle, color: "from-emerald-400 to-teal-500" },
  { label: "已完成", value: "98", change: "+15", icon: CheckCircle, color: "from-purple-400 to-indigo-500" },
  { label: "完成率", value: "87.5%", change: "+5.2%", icon: BarChart3, color: "from-orange-400 to-red-500" },
]

export function TaskManagementEnhanced() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTask, setSelectedTask] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("kanban")

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成":
        return commonStyles.badge.success
      case "进行中":
        return commonStyles.badge.primary
      case "待开始":
        return commonStyles.badge.warning
      default:
        return commonStyles.badge.secondary
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "高":
        return "border-red-200 text-red-700 bg-red-50"
      case "中":
        return "border-yellow-200 text-yellow-700 bg-yellow-50"
      case "低":
        return "border-green-200 text-green-700 bg-green-50"
      default:
        return commonStyles.badge.secondary
    }
  }

  return (
    <PageContainer title="任务管理" description="高效管理团队任务，提升工作协作效率">
      {/* 统计卡片 */}
      <div className={commonStyles.layout.grid + " grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}>
        {taskStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <EnhancedCard key={index} variant="glass" className="border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(249,115,22,0.15)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                    <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
                    <span className="text-xs text-slate-500 ml-1">vs 上周</span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </EnhancedCard>
          )
        })}
      </div>

      {/* 主要内容区域 */}
      <EnhancedCard variant="gradient">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-sky-100/50 border border-sky-200">
              <TabsTrigger value="kanban" className="data-[state=active]:bg-white data-[state=active]:text-sky-700">
                看板视图
              </TabsTrigger>
              <TabsTrigger value="list" className="data-[state=active]:bg-white data-[state=active]:text-sky-700">
                列表视图
              </TabsTrigger>
              <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:text-sky-700">
                日历视图
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-sky-700">
                数据分析
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4" />
                <Input
                  placeholder="搜索任务..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={commonStyles.input + " pl-10 w-64"}
                />
              </div>
              <EnhancedButton variant="secondary" icon={Filter}>
                筛选
              </EnhancedButton>
              <EnhancedButton icon={Plus} className="border-r-4 border-r-orange-500 shadow-[4px_0_12px_rgba(249,115,22,0.15)]">新建任务</EnhancedButton>
            </div>
          </div>

          <TabsContent value="kanban" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 待开始 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                    待开始
                  </h3>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {filteredTasks.filter((t) => t.status === "待开始").length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {filteredTasks
                    .filter((task) => task.status === "待开始")
                    .map((task) => (
                      <div key={task.id} className={`${commonStyles.card} p-4 hover:scale-[1.02] cursor-pointer`}>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-slate-800 text-sm leading-tight">{task.title}</h4>
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-2">{task.description}</p>

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center text-slate-500">
                                <Users className="w-3 h-3 mr-1" />
                                {task.assignee}
                              </div>
                            </div>
                            <div className="flex items-center text-slate-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {task.dueDate}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-sky-100">
                            <div className="flex items-center space-x-3 text-xs text-slate-500">
                              <div className="flex items-center">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                {task.comments}
                              </div>
                              <div className="flex items-center">
                                <Paperclip className="w-3 h-3 mr-1" />
                                {task.attachments}
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              {task.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs px-2 py-0 bg-sky-50 text-sky-600 border-sky-200"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* 进行中 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 flex items-center">
                    <PlayCircle className="w-5 h-5 mr-2 text-blue-500" />
                    进行中
                  </h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {filteredTasks.filter((t) => t.status === "进行中").length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {filteredTasks
                    .filter((task) => task.status === "进行中")
                    .map((task) => (
                      <div
                        key={task.id}
                        className={`${commonStyles.card} p-4 hover:scale-[1.02] cursor-pointer border-r-[5px] border-r-blue-400`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-slate-800 text-sm leading-tight">{task.title}</h4>
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-2">{task.description}</p>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-600">进度</span>
                              <span className="font-medium text-blue-600">{task.progress}%</span>
                            </div>
                            <div className="w-full bg-sky-100 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(task.progress, task.status)}`}
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center text-slate-500">
                                <Users className="w-3 h-3 mr-1" />
                                {task.assignee}
                              </div>
                              <div className="flex items-center text-slate-500">
                                <Timer className="w-3 h-3 mr-1" />
                                {task.timeSpent}
                              </div>
                            </div>
                            <div className="flex items-center text-slate-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {task.dueDate}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-sky-100">
                            <div className="flex items-center space-x-3 text-xs text-slate-500">
                              <div className="flex items-center">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                {task.comments}
                              </div>
                              <div className="flex items-center">
                                <Paperclip className="w-3 h-3 mr-1" />
                                {task.attachments}
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              {task.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs px-2 py-0 bg-sky-50 text-sky-600 border-sky-200"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* 已完成 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
                    已完成
                  </h3>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {filteredTasks.filter((t) => t.status === "已完成").length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {filteredTasks
                    .filter((task) => task.status === "已完成")
                    .map((task) => (
                      <div
                        key={task.id}
                        className={`${commonStyles.card} p-4 hover:scale-[1.02] cursor-pointer bg-emerald-50/30 border-emerald-200`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-slate-800 text-sm leading-tight line-through decoration-emerald-400">
                              {task.title}
                            </h4>
                            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-2">{task.description}</p>

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center text-slate-500">
                                <Users className="w-3 h-3 mr-1" />
                                {task.assignee}
                              </div>
                              <div className="flex items-center text-emerald-600">
                                <Timer className="w-3 h-3 mr-1" />
                                {task.timeSpent}
                              </div>
                            </div>
                            <div className="flex items-center text-slate-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {task.dueDate}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-emerald-200">
                            <div className="flex items-center space-x-3 text-xs text-slate-500">
                              <div className="flex items-center">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                {task.comments}
                              </div>
                              <div className="flex items-center">
                                <Paperclip className="w-3 h-3 mr-1" />
                                {task.attachments}
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              {task.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs px-2 py-0 bg-emerald-50 text-emerald-600 border-emerald-200"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div key={task.id} className={`${commonStyles.card} p-6 hover:scale-[1.01] cursor-pointer`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          task.status === "已完成"
                            ? "bg-emerald-400"
                            : task.status === "进行中"
                              ? "bg-blue-400"
                              : "bg-orange-400"
                        }`}
                      />

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3
                            className={`font-semibold text-slate-800 ${task.status === "已完成" ? "line-through decoration-emerald-400" : ""}`}
                          >
                            {task.title}
                          </h3>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                        </div>

                        <p className="text-sm text-slate-600 mb-3">{task.description}</p>

                        <div className="flex items-center space-x-6 text-sm text-slate-500">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1 text-sky-500" />
                            {task.assignee}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-sky-500" />
                            {task.dueDate}
                          </div>
                          <div className="flex items-center">
                            <Timer className="w-4 h-4 mr-1 text-sky-500" />
                            {task.timeSpent} / {task.estimatedTime}
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1 text-sky-500" />
                            {task.comments} 条评论
                          </div>
                          <div className="flex items-center">
                            <Paperclip className="w-4 h-4 mr-1 text-sky-500" />
                            {task.attachments} 个附件
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {task.status === "进行中" && (
                        <div className="text-right">
                          <p className="text-sm text-slate-600 mb-1">完成进度</p>
                          <div className="flex items-center">
                            <div className="w-20 bg-sky-100 rounded-full h-2 mr-2">
                              <div
                                className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-blue-600">{task.progress}%</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <EnhancedButton variant="ghost" size="sm" icon={PlayCircle}>
                          开始
                        </EnhancedButton>
                        <EnhancedButton variant="ghost" size="sm" icon={MessageSquare}>
                          评论
                        </EnhancedButton>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-sky-100 flex items-center justify-between">
                    <div className="flex space-x-2">
                      {task.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-sky-50 text-sky-600 border-sky-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500">预计时间: {task.estimatedTime}</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <EnhancedCard title="任务日历" description="按时间线查看任务安排">
              <div className="h-96 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-sky-300" />
                  <p className="text-lg font-medium">日历视图</p>
                  <p className="text-sm">任务时间线和截止日期管理</p>
                </div>
              </div>
            </EnhancedCard>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EnhancedCard title="任务完成趋势" description="团队任务完成情况分析">
                <div className="h-64 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-sky-300" />
                    <p>任务趋势图表区域</p>
                  </div>
                </div>
              </EnhancedCard>

              <EnhancedCard title="团队效率分析" description="成员工作效率和负载分析">
                <div className="h-64 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-sky-300" />
                    <p>效率分析图表区域</p>
                  </div>
                </div>
              </EnhancedCard>
            </div>

            <EnhancedCard title="任务分布统计" description="按状态、优先级、负责人统计任务分布">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-sky-50/50 rounded-xl border border-sky-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">按状态分布</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">待开始</span>
                      <span className="font-medium text-orange-600">16</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">进行中</span>
                      <span className="font-medium text-blue-600">42</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">已完成</span>
                      <span className="font-medium text-emerald-600">98</span>
                    </div>
                  </div>
                </div>

                <div className="text-center p-6 bg-sky-50/50 rounded-xl border border-sky-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Flag className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">按优先级分布</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">高优先级</span>
                      <span className="font-medium text-red-600">28</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">中优先级</span>
                      <span className="font-medium text-yellow-600">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">低优先级</span>
                      <span className="font-medium text-green-600">39</span>
                    </div>
                  </div>
                </div>

                <div className="text-center p-6 bg-sky-50/50 rounded-xl border border-sky-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">团队负载</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">张经理</span>
                      <span className="font-medium text-blue-600">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">李专员</span>
                      <span className="font-medium text-blue-600">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">王主管</span>
                      <span className="font-medium text-blue-600">15</span>
                    </div>
                  </div>
                </div>
              </div>
            </EnhancedCard>
          </TabsContent>
        </Tabs>
      </EnhancedCard>
    </PageContainer>
  )
}
