"use client"

import { PageContainer } from "@/components/layout/page-container"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckSquare, Plus, Clock, AlertCircle, CheckCircle, User } from "lucide-react"

export default function TasksPage() {
  return (
    <PageContainer title="任务管理" description="跟踪和管理团队任务进度">
      <div className="space-y-6">
        {/* 页面操作区 */}
        <div className="flex items-center justify-end">
          <EnhancedButton className="bg-orange-600 hover:bg-orange-700 border-r-4 border-r-orange-500 shadow-[4px_0_12px_rgba(249,115,22,0.15)]">
            <Plus className="w-4 h-4 mr-2 text-white" />
            新建任务
          </EnhancedButton>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedCard className="border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(249,115,22,0.15)] hover:border-r-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">总任务数</p>
                <p className="text-2xl font-bold text-slate-800">156</p>
                <p className="text-xs text-orange-600 mt-1">本月任务</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(249,115,22,0.15)] hover:border-r-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">已完成</p>
                <p className="text-2xl font-bold text-slate-800">89</p>
                <p className="text-xs text-green-600 mt-1">完成率 57%</p>
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
                <p className="text-2xl font-bold text-slate-800">45</p>
                <p className="text-xs text-orange-600 mt-1">正在处理</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(249,115,22,0.15)] hover:border-r-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">逾期任务</p>
                <p className="text-2xl font-bold text-slate-800">12</p>
                <p className="text-xs text-red-600 mt-1">需要关注</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* 任务列表 */}
        <EnhancedCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">最近任务</h2>
            <div className="flex gap-2">
              <EnhancedButton variant="outline" size="sm">
                全部
              </EnhancedButton>
              <EnhancedButton variant="outline" size="sm">
                进行中
              </EnhancedButton>
              <EnhancedButton variant="outline" size="sm">
                已完成
              </EnhancedButton>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "完善客户管理系统",
                assignee: "张三",
                progress: 75,
                priority: "高",
                dueDate: "2024-01-15",
                status: "进行中",
              },
              {
                title: "优化数据分析报表",
                assignee: "李四",
                progress: 100,
                priority: "中",
                dueDate: "2024-01-12",
                status: "已完成",
              },
              {
                title: "更新用户界面设计",
                assignee: "王五",
                progress: 30,
                priority: "低",
                dueDate: "2024-01-20",
                status: "进行中",
              },
              {
                title: "修复系统安全漏洞",
                assignee: "赵六",
                progress: 0,
                priority: "紧急",
                dueDate: "2024-01-10",
                status: "逾期",
              },
            ].map((task, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors border-r-4 border-r-orange-500 shadow-[2px_0_8px_rgba(249,115,22,0.1)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-slate-800">{task.title}</h3>
                    <Badge
                      variant={
                        task.priority === "紧急"
                          ? "destructive"
                          : task.priority === "高"
                            ? "default"
                            : task.priority === "中"
                              ? "secondary"
                              : "outline"
                      }
                    >
                      {task.priority}
                    </Badge>
                    <Badge
                      variant={
                        task.status === "已完成" ? "default" : task.status === "逾期" ? "destructive" : "secondary"
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>
                  <EnhancedButton size="sm" variant="outline">
                    查看详情
                  </EnhancedButton>
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-600 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {task.assignee}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    截止: {task.dueDate}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">进度</span>
                      <span className="text-slate-800 font-medium">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </EnhancedCard>
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
