/**
 * @fileoverview system-management-overview.tsx
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
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Database,
  Shield,
  Zap,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Settings,
  RefreshCw,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface SystemStatus {
  category: string
  status: "good" | "warning" | "critical"
  score: number
  description: string
  lastCheck: Date
  icon: any
  route: string
  colorTheme: string
  borderColor: string
  progressColor: string
}

export function SystemManagementOverview() {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const systemStatuses: SystemStatus[] = [
    {
      category: "系统测试",
      status: "good",
      score: 92,
      description: "所有核心功能测试通过",
      lastCheck: new Date(Date.now() - 5 * 60 * 1000),
      icon: Activity,
      route: "/system-testing",
      colorTheme: "blue",
      borderColor: "border-l-blue-500",
      progressColor: "bg-gradient-to-r from-blue-400 to-blue-500",
    },
    {
      category: "性能优化",
      status: "warning",
      score: 78,
      description: "部分模块需要优化",
      lastCheck: new Date(Date.now() - 10 * 60 * 1000),
      icon: Zap,
      route: "/performance",
      colorTheme: "green",
      borderColor: "border-l-green-500",
      progressColor: "bg-gradient-to-r from-green-400 to-green-500",
    },
    {
      category: "数据集成",
      status: "good",
      score: 88,
      description: "数据源连接正常",
      lastCheck: new Date(Date.now() - 2 * 60 * 1000),
      icon: Database,
      route: "/data-integration",
      colorTheme: "purple",
      borderColor: "border-l-purple-500",
      progressColor: "bg-gradient-to-r from-purple-400 to-purple-500",
    },
    {
      category: "用户培训",
      status: "good",
      score: 85,
      description: "培训完成率良好",
      lastCheck: new Date(Date.now() - 15 * 60 * 1000),
      icon: BookOpen,
      route: "/training",
      colorTheme: "orange",
      borderColor: "border-l-orange-500",
      progressColor: "bg-gradient-to-r from-orange-400 to-orange-500",
    },
    {
      category: "安全防护",
      status: "good",
      score: 95,
      description: "安全状态优秀",
      lastCheck: new Date(Date.now() - 1 * 60 * 1000),
      icon: Shield,
      route: "/security",
      colorTheme: "orange",
      borderColor: "border-l-orange-500",
      progressColor: "bg-gradient-to-r from-orange-400 to-orange-500",
    },
  ]

  const quickActions = [
    {
      name: "运行全面测试",
      description: "执行完整的系统功能测试",
      icon: Activity,
      action: () => router.push("/system-testing"),
      colorTheme: "blue",
      borderColor: "border-l-blue-500",
      bgColor: "bg-blue-500",
    },
    {
      name: "性能优化",
      description: "启动系统性能优化流程",
      icon: Zap,
      action: () => router.push("/performance"),
      colorTheme: "green",
      borderColor: "border-l-green-500",
      bgColor: "bg-green-500",
    },
    {
      name: "数据同步",
      description: "检查并同步所有数据源",
      icon: Database,
      action: () => router.push("/data-integration"),
      colorTheme: "purple",
      borderColor: "border-l-purple-500",
      bgColor: "bg-purple-500",
    },
    {
      name: "安全扫描",
      description: "执行安全漏洞扫描",
      icon: Shield,
      action: () => router.push("/security"),
      colorTheme: "orange",
      borderColor: "border-l-orange-500",
      bgColor: "bg-orange-500",
    },
  ]

  const recentActivities = [
    {
      id: "1",
      type: "test",
      message: "AI智能助手功能测试完成",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: "success",
      colorTheme: "blue",
      borderColor: "border-l-blue-500",
    },
    {
      id: "2",
      type: "optimization",
      message: "代码分割优化已启用",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: "success",
      colorTheme: "green",
      borderColor: "border-l-green-500",
    },
    {
      id: "3",
      type: "sync",
      message: "客户数据同步完成",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: "success",
      colorTheme: "purple",
      borderColor: "border-l-purple-500",
    },
    {
      id: "4",
      type: "training",
      message: "新用户培训模块上线",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "info",
      colorTheme: "orange",
      borderColor: "border-l-orange-500",
    },
    {
      id: "5",
      type: "security",
      message: "检测到异常登录尝试",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      status: "warning",
      colorTheme: "orange",
      borderColor: "border-l-orange-500",
    },
  ]

  const refreshSystemStatus = async () => {
    setIsRefreshing(true)
    // 模拟刷新过程
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100"
      case "warning":
        return "bg-yellow-100"
      case "critical":
        return "bg-red-100"
      default:
        return "bg-gray-100"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "test":
        return <Activity className="w-4 h-4" />
      case "optimization":
        return <Zap className="w-4 h-4" />
      case "sync":
        return <Database className="w-4 h-4" />
      case "training":
        return <BookOpen className="w-4 h-4" />
      case "security":
        return <Shield className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100"
      case "warning":
        return "text-yellow-600 bg-yellow-100"
      case "error":
        return "text-red-600 bg-red-100"
      default:
        return "text-blue-600 bg-blue-100"
    }
  }

  const overallScore = Math.round(systemStatuses.reduce((sum, status) => sum + status.score, 0) / systemStatuses.length)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">系统管理总览</h1>
          <p className="text-slate-600 mt-2">系统状态监控和管理中心</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshSystemStatus} disabled={isRefreshing}>
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            刷新状态
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Settings className="w-4 h-4 mr-2" />
            系统设置
          </Button>
        </div>
      </div>

      {/* 系统健康度总览 */}
      <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-blue-500 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">系统健康度</h2>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-green-600">{overallScore}</span>
            <span className="text-slate-600">/100</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${overallScore}%` }}
          ></div>
        </div>
        <p className="text-sm text-slate-600">系统整体运行状况良好，建议定期进行维护和优化</p>
      </Card>

      {/* 系统状态卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemStatuses.map((status, index) => (
          <Card
            key={index}
            className={`bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 cursor-pointer border-r-[5px] ${status.borderColor.replace('border-l-', 'border-r-')} shadow-[4px_0_12px_rgba(0,0,0,0.1)] p-4 group`}
            onClick={() => router.push(status.route)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusBg(status.status)}`}>
                  <status.icon className={`w-5 h-5 ${getStatusColor(status.status)}`} />
                </div>
                <h3 className="font-semibold text-slate-900">{status.category}</h3>
              </div>
              <span className={`text-xl font-bold ${getStatusColor(status.status)}`}>{status.score}</span>
            </div>
            <p className="text-sm text-slate-600 mb-3">{status.description}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className={`${status.progressColor} h-2 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${status.score}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500">最后检查: {status.lastCheck.toLocaleString()}</p>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">系统概览</TabsTrigger>
          <TabsTrigger value="actions">快捷操作</TabsTrigger>
          <TabsTrigger value="activities">活动日志</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-blue-500 p-6">
              <h3 className="text-lg font-semibold mb-4">系统指标</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">CPU使用率</span>
                  <span className="font-semibold text-blue-600">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">内存使用率</span>
                  <span className="font-semibold text-green-600">68%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">磁盘使用率</span>
                  <span className="font-semibold text-purple-600">32%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">网络延迟</span>
                  <span className="font-semibold text-orange-600">85ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">在线用户</span>
                  <span className="font-semibold text-red-600">24</span>
                </div>
              </div>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-green-500 p-6">
              <h3 className="text-lg font-semibold mb-4">功能状态</h3>
              <div className="space-y-3">
                {[
                  { name: "AI智能助手", status: "正常", color: "text-green-600" },
                  { name: "多租户管理", status: "正常", color: "text-green-600" },
                  { name: "BI分析系统", status: "正常", color: "text-green-600" },
                  { name: "移动端应用", status: "维护中", color: "text-yellow-600" },
                  { name: "安全中心", status: "正常", color: "text-green-600" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{item.name}</span>
                    <span className={`text-sm font-medium ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className={`bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 cursor-pointer border-r-[5px] ${action.borderColor.replace('border-l-', 'border-r-')} shadow-[4px_0_12px_rgba(0,0,0,0.1)] p-4 group`}
                onClick={action.action}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 ${action.bgColor} rounded-lg`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:translate-x-1 transition-transform duration-300">
                      {action.name}
                    </h3>
                    <p className="text-sm text-slate-600">{action.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <Card
                key={activity.id}
                className={`bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] ${activity.borderColor.replace('border-l-', 'border-r-')} shadow-[4px_0_12px_rgba(0,0,0,0.1)] p-4`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                    <p className="text-xs text-slate-500">{activity.timestamp.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {activity.status === "success" && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {activity.status === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                    {activity.status === "info" && <TrendingUp className="w-4 h-4 text-blue-600" />}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
