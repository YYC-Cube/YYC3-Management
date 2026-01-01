"use client"

import { PageContainer } from "@/components/layout/page-container"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Briefcase, Plus, Users, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react"

export default function ProjectsPage() {
  return (
    <PageContainer title="项目管理" description="跟踪和管理项目进度">
      <div className="space-y-6">
        {/* 页面操作区 */}
        <div className="flex items-center justify-end">
          <EnhancedButton className="bg-orange-600 hover:bg-orange-700 border-r-4 border-r-orange-500 shadow-[4px_0_12px_rgba(249,115,22,0.15)]">
            <Plus className="w-4 h-4 mr-2 text-white" />
            新建项目
          </EnhancedButton>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedCard className="border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(249,115,22,0.15)] hover:border-r-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">总项目数</p>
                <p className="text-2xl font-bold text-slate-800">18</p>
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
                <p className="text-2xl font-bold text-slate-800">12</p>
                <p className="text-xs text-green-600 mt-1">完成率 67%</p>
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
                <p className="text-2xl font-bold text-slate-800">5</p>
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
                <p className="text-2xl font-bold text-slate-800">1</p>
                <p className="text-xs text-red-600 mt-1">需要关注</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* 项目列表 */}
        <EnhancedCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">项目列表</h2>
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
                name: "企业管理系统升级",
                manager: "张三",
                team: 8,
                progress: 75,
                status: "进行中",
                priority: "高",
                startDate: "2024-01-01",
                endDate: "2024-03-31",
                budget: "¥500,000",
              },
              {
                name: "移动端APP开发",
                manager: "李四",
                team: 6,
                progress: 45,
                status: "进行中",
                priority: "中",
                startDate: "2024-01-15",
                endDate: "2024-04-15",
                budget: "¥300,000",
              },
              {
                name: "数据分析平台",
                manager: "王五",
                team: 5,
                progress: 100,
                status: "已完成",
                priority: "高",
                startDate: "2023-10-01",
                endDate: "2023-12-31",
                budget: "¥400,000",
              },
              {
                name: "客户服务系统优化",
                manager: "赵六",
                team: 4,
                progress: 20,
                status: "进行中",
                priority: "低",
                startDate: "2024-02-01",
                endDate: "2024-05-31",
                budget: "¥200,000",
              },
            ].map((project, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors border-r-4 border-r-orange-500 shadow-[2px_0_8px_rgba(249,115,22,0.1)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-800">{project.name}</h3>
                    <Badge
                      variant={
                        project.priority === "高" ? "destructive" : project.priority === "中" ? "default" : "secondary"
                      }
                    >
                      {project.priority}优先级
                    </Badge>
                    <Badge
                      variant={
                        project.status === "已完成"
                          ? "default"
                          : project.status === "延期"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <EnhancedButton variant="outline" size="sm">
                    查看详情
                  </EnhancedButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    项目经理: {project.manager}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    团队人数: {project.team}人
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    开始: {project.startDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    结束: {project.endDate}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600">项目进度</span>
                    <span className="font-medium text-slate-800">{project.progress}%</span>
                  </div>
                  <div className="text-sm text-slate-600">预算: {project.budget}</div>
                </div>

                <Progress value={project.progress} className="h-2" />
              </div>
            ))}
          </div>
        </EnhancedCard>

        {/* 项目统计 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnhancedCard>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">项目类型分布</h3>
            <div className="space-y-3">
              {[
                { type: "系统开发", count: 8, percentage: 44, color: "bg-sky-500" },
                { type: "系统升级", count: 4, percentage: 22, color: "bg-green-500" },
                { type: "数据分析", count: 3, percentage: 17, color: "bg-yellow-500" },
                { type: "移动应用", count: 2, percentage: 11, color: "bg-purple-500" },
                { type: "其他项目", count: 1, percentage: 6, color: "bg-gray-500" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-slate-800">{item.type}</span>
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
            <h3 className="text-lg font-semibold text-slate-800 mb-4">项目里程碑</h3>
            <div className="space-y-3">
              {[
                { milestone: "需求分析完成", project: "企业管理系统升级", date: "2024-01-15", status: "已完成" },
                { milestone: "UI设计评审", project: "移动端APP开发", date: "2024-01-20", status: "进行中" },
                { milestone: "后端开发完成", project: "企业管理系统升级", date: "2024-02-28", status: "计划中" },
                { milestone: "测试阶段开始", project: "客户服务系统优化", date: "2024-03-15", status: "计划中" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">{item.milestone}</p>
                    <p className="text-sm text-slate-600">{item.project}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        item.status === "已完成" ? "default" : item.status === "进行中" ? "secondary" : "outline"
                      }
                    >
                      {item.status}
                    </Badge>
                    <p className="text-sm text-slate-600 mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </EnhancedCard>
        </div>
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
