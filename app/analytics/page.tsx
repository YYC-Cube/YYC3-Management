"use client"

import { PageContainer } from "@/components/layout/page-container"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { StatisticsDashboard } from "@/components/statistics-dashboard"
import { SalesChart } from "@/components/charts/sales-chart"
import { FinanceChart } from "@/components/charts/finance-chart"
import { PerformanceChart } from "@/components/charts/performance-chart"
import { BarChart3, TrendingUp, Download, Eye, Users, DollarSign } from "lucide-react"
import { useUsers } from "@/hooks/use-users"
import { useTasks } from "@/hooks/use-tasks"
import { useProjects } from "@/hooks/use-projects"
import { useEffect, useMemo } from "react"

export default function AnalyticsPage() {
  const { users, fetchUsers } = useUsers({ page: 1, limit: 1000 })
  const { tasks, fetchTasks } = useTasks({ page: 1, limit: 1000 })
  const { projects, fetchProjects } = useProjects({ page: 1, limit: 1000 })

  useEffect(() => {
    fetchUsers()
    fetchTasks()
    fetchProjects()
  }, [])

  const activeUsers = useMemo(() => users.filter((u) => u.status === "active").length, [users])
  const completedTasks = useMemo(() => tasks.filter((t) => t.status === "completed").length, [tasks])
  const pendingTasks = useMemo(() => tasks.filter((t) => t.status === "in_progress").length, [tasks])
  const completedProjects = useMemo(() => projects.filter((p) => p.status === "completed").length, [projects])

  const userGrowthData = useMemo(() => [
    { name: "1月", value: Math.round(users.length * 0.6) },
    { name: "2月", value: Math.round(users.length * 0.7) },
    { name: "3月", value: Math.round(users.length * 0.75) },
    { name: "4月", value: Math.round(users.length * 0.85) },
    { name: "5月", value: Math.round(users.length * 0.9) },
    { name: "6月", value: users.length },
  ], [users.length])

  const taskCompletionData = useMemo(() => [
    { name: "1月", value: Math.round(completedTasks * 0.5) },
    { name: "2月", value: Math.round(completedTasks * 0.6) },
    { name: "3月", value: Math.round(completedTasks * 0.7) },
    { name: "4月", value: Math.round(completedTasks * 0.8) },
    { name: "5月", value: Math.round(completedTasks * 0.9) },
    { name: "6月", value: completedTasks },
  ], [completedTasks])

  const projectStatusData = useMemo(() => [
    { name: "进行中", value: projects.filter((p) => p.status === "in_progress").length, color: "#3b82f6" },
    { name: "已完成", value: completedProjects, color: "#10b981" },
    { name: "规划中", value: projects.filter((p) => p.status === "planning").length, color: "#f59e0b" },
    { name: "暂停", value: projects.filter((p) => p.status === "paused").length, color: "#ef4444" },
  ], [projects, completedProjects])

  const userActivityData = useMemo(() => [
    { name: "周一", value: Math.round(activeUsers * 0.7) },
    { name: "周二", value: Math.round(activeUsers * 0.8) },
    { name: "周三", value: Math.round(activeUsers * 0.75) },
    { name: "周四", value: Math.round(activeUsers * 0.85) },
    { name: "周五", value: Math.round(activeUsers * 0.8) },
    { name: "周六", value: Math.round(activeUsers * 0.4) },
    { name: "周日", value: Math.round(activeUsers * 0.45) },
  ], [activeUsers])

  return (
    <PageContainer title="数据分析" description="深入了解业务数据和趋势">
      <div className="space-y-6">
        <StatisticsDashboard
          userGrowthData={userGrowthData}
          taskCompletionData={taskCompletionData}
          projectStatusData={projectStatusData}
          userActivityData={userActivityData}
          stats={{
            totalUsers: users.length,
            activeUsers: activeUsers,
            totalProjects: projects.length,
            completedProjects: completedProjects,
            totalTasks: tasks.length,
            completedTasks: completedTasks,
            pendingTasks: pendingTasks,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnhancedCard className="border-r-[5px] border-r-cyan-500 shadow-[4px_0_12px_rgba(6,182,212,0.15)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">销售趋势</h2>
              <EnhancedButton variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                详细分析
              </EnhancedButton>
            </div>
            <SalesChart />
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-cyan-500 shadow-[4px_0_12px_rgba(6,182,212,0.15)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">财务概览</h2>
              <EnhancedButton variant="outline" size="sm">
                <DollarSign className="w-4 h-4 mr-2" />
                财务报表
              </EnhancedButton>
            </div>
            <FinanceChart />
          </EnhancedCard>
        </div>

        <EnhancedCard className="border-r-[5px] border-r-cyan-500 shadow-[4px_0_12px_rgba(6,182,212,0.15)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">性能分析</h2>
            <div className="flex gap-2">
              <EnhancedButton variant="outline" size="sm">
                日
              </EnhancedButton>
              <EnhancedButton variant="outline" size="sm">
                周
              </EnhancedButton>
              <EnhancedButton variant="outline" size="sm">
                月
              </EnhancedButton>
            </div>
          </div>
          <PerformanceChart />
        </EnhancedCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EnhancedCard>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">热门页面</h3>
            <div className="space-y-3">
              {[
                { page: "/dashboard", views: "12,345", percentage: 85 },
                { page: "/customers", views: "8,967", percentage: 65 },
                { page: "/tasks", views: "6,543", percentage: 45 },
                { page: "/analytics", views: "4,321", percentage: 30 },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{item.page}</p>
                    <p className="text-sm text-slate-600">{item.views} 次访问</p>
                  </div>
                  <div className="w-20 bg-slate-200 rounded-full h-2">
                    <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </EnhancedCard>

          <EnhancedCard>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">用户来源</h3>
            <div className="space-y-3">
              {[
                { source: "直接访问", users: "5,234", color: "bg-sky-500" },
                { source: "搜索引擎", users: "3,456", color: "bg-green-500" },
                { source: "社交媒体", users: "2,345", color: "bg-yellow-500" },
                { source: "邮件营销", users: "1,234", color: "bg-purple-500" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-slate-800">{item.source}</span>
                  </div>
                  <span className="font-medium text-slate-800">{item.users}</span>
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
