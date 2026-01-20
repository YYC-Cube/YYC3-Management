"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PageContainer } from "@/components/layout/page-container"
import { StatisticsDashboard } from "@/components/statistics-dashboard"
import {
  BarChart3,
  Users,
  DollarSign,
  Calendar,
  CheckSquare,
  MessageSquare,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from "lucide-react"
import { useUsers } from "@/hooks/use-users"
import { useCustomers } from "@/hooks/use-customers"
import { useTasks } from "@/hooks/use-tasks"
import { useProjects } from "@/hooks/use-projects"
import { useEffect, useMemo } from "react"

export default function DashboardPage() {
  const { users, fetchUsers } = useUsers({ page: 1, limit: 1000 })
  const { customers, fetchCustomers } = useCustomers({ page: 1, limit: 1000 })
  const { tasks, fetchTasks } = useTasks({ page: 1, limit: 1000 })
  const { projects, fetchProjects } = useProjects({ page: 1, limit: 1000 })

  useEffect(() => {
    fetchUsers()
    fetchCustomers()
    fetchTasks()
    fetchProjects()
  }, [])

  const activeUsers = useMemo(() => users.filter((u) => u.status === "active").length, [users])
  const completedTasks = useMemo(() => tasks.filter((t) => t.status === "completed").length, [tasks])
  const pendingTasks = useMemo(() => tasks.filter((t) => t.status === "in_progress").length, [tasks])
  const completedProjects = useMemo(() => projects.filter((p) => p.status === "completed").length, [projects])
  const activeCustomers = useMemo(() => customers.filter((c) => c.status === "active").length, [customers])

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
    <PageContainer title="数据中心" description="欢迎回到企业管理系统">
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

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>项目进度</CardTitle>
                <CardDescription>当前进行中的项目状态</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{project.name}</span>
                      <span className="text-sm text-muted-foreground">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
                <CardDescription>常用功能快捷入口</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="mr-2 h-4 w-4" />
                  添加新客户
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  创建任务
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  生成报告
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
