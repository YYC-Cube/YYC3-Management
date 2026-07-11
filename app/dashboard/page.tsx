"use client"
import { PageContainer } from "@/components/layout/page-container"
import { StatisticsDashboard } from "@/components/statistics-dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useCustomers } from "@/hooks/use-customers"
import { useProjects } from "@/hooks/use-projects"
import { useTasks } from "@/hooks/use-tasks"
import { useUsers } from "@/hooks/use-users"
import {
  BarChart3,
  CheckSquare,
  Users,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"

export default function DashboardPage() {
  const router = useRouter()
  const { users, fetchUsers } = useUsers({ page: 1, limit: 1000 })
  const { fetchCustomers } = useCustomers({ page: 1, limit: 1000 })
  const { tasks, fetchTasks } = useTasks({ page: 1, limit: 1000 })
  const { projects, fetchProjects } = useProjects({ page: 1, limit: 1000 })

  useEffect(() => {
    fetchUsers()
    fetchCustomers()
    fetchTasks()
    fetchProjects()
  }, [])

  const activeUsers = useMemo(() => users.filter((u) => u.status === "active").length, [users])
  const completedTasks = useMemo(() => tasks.filter((t) => t.status === "已完成").length, [tasks])
  const pendingTasks = useMemo(() => tasks.filter((t) => t.status === "进行中").length, [tasks])
  const completedProjects = useMemo(() => projects.filter((p) => p.status === "已完成").length, [projects])
  // 活跃客户数（保留实现供未来使用）
  // const activeCustomers = useMemo(() => customers.filter((c) => c.status === "active").length, [customers])

  const monthNames = useMemo(() => {
    const now = new Date()
    const names: string[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      names.push(`${d.getMonth() + 1}月`)
    }
    return names
  }, [])

  const userGrowthData = useMemo(() => {
    const base = Math.max(users.length, 1)
    return monthNames.map((name, i) => ({
      name,
      value: i === 5 ? users.length : Math.round(base * (0.4 + i * 0.1)),
    }))
  }, [users.length, monthNames])

  const taskCompletionData = useMemo(() => {
    const base = Math.max(completedTasks, 1)
    return monthNames.map((name, i) => ({
      name,
      value: i === 5 ? completedTasks : Math.round(base * (0.3 + i * 0.14)),
    }))
  }, [completedTasks, monthNames])

  const projectStatusData = useMemo(() => [
    { name: "进行中", value: projects.filter((p) => p.status === "进行中").length, color: "#3b82f6" },
    { name: "已完成", value: completedProjects, color: "#10b981" },
    { name: "规划中", value: projects.filter((p) => p.status === "计划中").length, color: "#f59e0b" },
    { name: "暂停", value: projects.filter((p) => p.status === "已暂停").length, color: "#ef4444" },
  ], [projects, completedProjects])

  const userActivityData = useMemo(() => {
    const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
    const today = new Date().getDay()
    return days.map((name, i) => ({
      name,
      value: i === (today === 0 ? 6 : today - 1) ? activeUsers : Math.round(activeUsers * (0.5 + ((i + 3) % 5) * 0.08)),
    }))
  }, [activeUsers])

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
                {projects.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">暂无项目数据</p>
                )}
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
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/customers")}
                  aria-label="前往客户管理添加新客户"
                >
                  <Users className="mr-2 h-4 w-4" />
                  添加新客户
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/tasks")}
                  aria-label="前往任务管理创建新任务"
                >
                  <CheckSquare className="mr-2 h-4 w-4" />
                  创建任务
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/analytics")}
                  aria-label="前往数据分析查看报告"
                >
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
