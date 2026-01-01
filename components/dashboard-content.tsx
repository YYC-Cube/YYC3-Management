/**
 * @fileoverview 仪表板内容组件
 * @description 展示业务数据、KPI指标和实时统计信息
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  CheckCircle,
  MessageSquare,
  FileText,
  BarChart3,
} from "lucide-react"
import { SalesChart } from "@/components/charts/sales-chart"
import { FinanceChart } from "@/components/charts/finance-chart"
import { PerformanceChart } from "@/components/charts/performance-chart"
import { usePathname } from "next/navigation"
import { getThemeForPath } from "@/lib/theme-colors"

export function DashboardContent({ showTitle = true }: { showTitle?: boolean }) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const pathname = usePathname()
  const theme = getThemeForPath(pathname)

  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      title: "总客户数",
      value: "2,847",
      change: "+12.5%",
      changeType: "increase" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      themeColor: "customers",
    },
    {
      title: "月收入",
      value: "¥458,920",
      change: "+8.2%",
      changeType: "increase" as const,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      themeColor: "finance",
    },
    {
      title: "订单数量",
      value: "1,234",
      change: "-2.4%",
      changeType: "decrease" as const,
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      themeColor: "tasks",
    },
    {
      title: "转化率",
      value: "24.8%",
      change: "+5.1%",
      changeType: "increase" as const,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      themeColor: "analytics",
    },
  ]

  const projects = [
    {
      name: "客户管理系统升级",
      progress: 85,
      status: "进行中",
      dueDate: "2024-01-15",
      team: 5,
      themeColor: "customers",
    },
    { name: "移动端应用开发", progress: 60, status: "进行中", dueDate: "2024-02-01", team: 8, themeColor: "mobileApp" },
    { name: "数据分析平台", progress: 95, status: "即将完成", dueDate: "2024-01-10", team: 3, themeColor: "analytics" },
    {
      name: "安全系统优化",
      progress: 40,
      status: "计划中",
      dueDate: "2024-02-15",
      team: 6,
      themeColor: "permissionManagement",
    },
  ]

  const recentActivities = [
    {
      user: "张三",
      action: "创建了新客户",
      target: "ABC公司",
      time: "5分钟前",
      avatar: "/avatar/avatar_user/avatar_user_001.png",
    },
    {
      user: "李四",
      action: "完成了任务",
      target: "系统测试报告",
      time: "15分钟前",
      avatar: "/avatar/avatar_user/avatar_user_002.png",
    },
    {
      user: "王五",
      action: "更新了项目进度",
      target: "移动端开发",
      time: "30分钟前",
      avatar: "/avatar/avatar_user/avatar_user_004.png",
    },
    {
      user: "赵六",
      action: "发布了公告",
      target: "系统维护通知",
      time: "1小时前",
      avatar: "/avatar/avatar_user/avatar_user_005.png",
    },
  ]

  const quickActions = [
    { name: "新建客户", icon: Users, color: "bg-blue-500 hover:bg-blue-600", themeColor: "customers" },
    { name: "创建任务", icon: CheckCircle, color: "bg-green-500 hover:bg-green-600", themeColor: "tasks" },
    { name: "发起会议", icon: MessageSquare, color: "bg-purple-500 hover:bg-purple-600", themeColor: "communication" },
    { name: "生成报告", icon: FileText, color: "bg-orange-500 hover:bg-orange-600", themeColor: "analytics" },
  ]

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* 页面标题和时间 */}
      <div className="flex items-center justify-between">
        <div>
          {showTitle && (
            <h1 className="text-3xl font-bold text-gray-900">运营中心</h1>
          )}
          <p className="text-gray-600 mt-1">欢迎回来，这里是您的企业管理控制台</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {currentTime ? currentTime.toLocaleTimeString("zh-CN", { hour12: false }) : "--:--:--"}
          </div>
          <div className="text-sm text-gray-500">
            {currentTime ? currentTime.toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            }) : "加载中..."}
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const cardTheme = getThemeForPath(`/${stat.themeColor}`)
          return (
            <Card
              key={stat.title}
              className="hover:shadow-lg transition-all duration-200 relative overflow-hidden"
              style={{
                borderLeft: `5px solid ${cardTheme.border}`,
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === "increase" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium ml-1 ${
                          stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs 上月</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          className="col-span-1 transition-all duration-200"
          style={{
            borderLeft: `5px solid ${getThemeForPath("/analytics").border}`,
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              销售趋势
            </CardTitle>
            <CardDescription>最近6个月的销售数据分析</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>

        <Card
          className="col-span-1 transition-all duration-200"
          style={{
            borderLeft: `5px solid ${getThemeForPath("/finance").border}`,
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              财务概览
            </CardTitle>
            <CardDescription>收入与支出对比分析</CardDescription>
          </CardHeader>
          <CardContent>
            <FinanceChart />
          </CardContent>
        </Card>
      </div>

      {/* 项目进度和活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 项目进度 */}
        <Card
          className="lg:col-span-2 transition-all duration-200"
          style={{
            borderLeft: `5px solid ${getThemeForPath("/projects").border}`,
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              项目进度
            </CardTitle>
            <CardDescription>当前进行中的项目状态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => {
                const projectTheme = getThemeForPath(`/${project.themeColor}`)
                return (
                  <div
                    key={project.name}
                    className="flex items-center justify-between p-4 rounded-lg transition-all duration-200 relative"
                    style={{
                      ['--project-border' as any]: projectTheme.border,
                      ['--project-bg' as any]: projectTheme.bg,
                      borderLeft: '4px solid var(--project-border)',
                      backgroundColor: 'var(--project-bg)',
                    } as React.CSSProperties}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        <Badge
                          variant={
                            project.status === "即将完成"
                              ? "default"
                              : project.status === "进行中"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {project.dueDate}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {project.team} 人
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>进度</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 最近活动 */}
        <Card
          className="transition-all duration-200"
          style={{
            borderLeft: `5px solid ${getThemeForPath("/collaboration").border}`,
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              最近活动
            </CardTitle>
            <CardDescription>团队成员的最新动态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.avatar || "/placeholder-user.jpg"} alt={activity.user} />
                    <AvatarFallback>{activity.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                      <span className="font-medium text-blue-600">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 快捷操作 */}
      <Card
        className="transition-all duration-200"
        style={{
          borderLeft: `5px solid ${theme.border}`,
        }}
      >
        <CardHeader>
          <CardTitle>快捷操作</CardTitle>
          <CardDescription>常用功能快速访问</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const actionTheme = getThemeForPath(`/${action.themeColor}`)
              return (
                <Button
                  key={action.name}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-all duration-200 border-2 relative overflow-hidden bg-transparent"
                  style={{
                    borderColor: actionTheme.border,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = actionTheme.bg
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent"
                  }}
                >
                  <action.icon className="h-6 w-6" style={{ color: actionTheme.primary }} />
                  <span className="text-sm font-medium">{action.name}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 性能监控 */}
      <Card
        className="transition-all duration-200"
        style={{
          borderLeft: `5px solid ${getThemeForPath("/system-monitor").border}`,
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            系统性能监控
          </CardTitle>
          <CardDescription>实时系统性能指标</CardDescription>
        </CardHeader>
        <CardContent>
          <PerformanceChart />
        </CardContent>
      </Card>
    </div>
  )
}
