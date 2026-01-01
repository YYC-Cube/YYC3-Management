/**
 * @fileoverview system-status-monitor.tsx
 * @description 自动生成的组件或模块
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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Square,
  RotateCcw,
  Eye,
  BarChart3,
  Users,
  Globe,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SystemMetric {
  name: string
  value: number
  unit: string
  status: "normal" | "warning" | "critical"
  trend: "up" | "down" | "stable"
}

interface SystemService {
  name: string
  status: "running" | "warning" | "stopped"
  port: number
  version: string
  uptime: string
  lastCheck: string
  description: string
}

interface SystemAlert {
  id: string
  level: "error" | "warning" | "info"
  title: string
  message: string
  timestamp: string
  resolved: boolean
}

export default function SystemStatusMonitor() {
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(5)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [loading, setLoading] = useState(false)

  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    { name: "CPU使用率", value: 45, unit: "%", status: "normal", trend: "stable" },
    { name: "内存使用率", value: 68, unit: "%", status: "warning", trend: "up" },
    { name: "磁盘使用率", value: 32, unit: "%", status: "normal", trend: "down" },
    { name: "网络流量", value: 156, unit: "MB/s", status: "normal", trend: "up" },
    { name: "在线用户", value: 1247, unit: "人", status: "normal", trend: "up" },
    { name: "活跃连接", value: 892, unit: "个", status: "normal", trend: "stable" },
    { name: "请求/秒", value: 2341, unit: "req/s", status: "normal", trend: "up" },
    { name: "错误率", value: 0.12, unit: "%", status: "normal", trend: "down" },
  ])

  const [systemServices, setSystemServices] = useState<SystemService[]>([
    {
      name: "Web服务器",
      status: "running",
      port: 80,
      version: "Nginx 1.20.2",
      uptime: "15天 8小时",
      lastCheck: "刚刚",
      description: "主要Web服务器，处理HTTP请求",
    },
    {
      name: "数据库服务",
      status: "running",
      port: 3306,
      version: "MySQL 8.0.28",
      uptime: "15天 8小时",
      lastCheck: "1分钟前",
      description: "主数据库服务器",
    },
    {
      name: "缓存服务",
      status: "warning",
      port: 6379,
      version: "Redis 6.2.6",
      uptime: "2天 14小时",
      lastCheck: "30秒前",
      description: "Redis缓存服务器，内存使用率较高",
    },
    {
      name: "消息队列",
      status: "running",
      port: 5672,
      version: "RabbitMQ 3.9.13",
      uptime: "15天 8小时",
      lastCheck: "2分钟前",
      description: "消息队列服务",
    },
    {
      name: "搜索引擎",
      status: "stopped",
      port: 9200,
      version: "Elasticsearch 7.16.2",
      uptime: "0天 0小时",
      lastCheck: "5分钟前",
      description: "全文搜索引擎服务已停止",
    },
  ])

  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([
    {
      id: "1",
      level: "warning",
      title: "内存使用率过高",
      message: "系统内存使用率达到68%，建议检查内存泄漏",
      timestamp: "2024-01-02 14:30:25",
      resolved: false,
    },
    {
      id: "2",
      level: "error",
      title: "搜索服务异常",
      message: "Elasticsearch服务已停止，影响搜索功能",
      timestamp: "2024-01-02 14:25:10",
      resolved: false,
    },
    {
      id: "3",
      level: "warning",
      title: "Redis内存警告",
      message: "Redis缓存服务内存使用率较高",
      timestamp: "2024-01-02 14:20:15",
      resolved: false,
    },
    {
      id: "4",
      level: "info",
      title: "系统备份完成",
      message: "定时数据备份任务执行成功",
      timestamp: "2024-01-02 14:00:00",
      resolved: true,
    },
  ])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(() => {
        refreshData()
      }, refreshInterval * 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  const refreshData = async () => {
    setLoading(true)
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 更新指标数据
      setSystemMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * 10,
        })),
      )

      setLastUpdate(new Date())
      toast({
        title: "数据已更新",
        description: "系统监控数据已刷新",
      })
    } catch (error) {
      toast({
        title: "更新失败",
        description: "无法获取最新数据",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleServiceAction = (serviceName: string, action: string) => {
    toast({
      title: `${action}服务`,
      description: `正在${action} ${serviceName}...`,
    })
  }

  const handleAlertAction = (alertId: string, action: string) => {
    if (action === "resolve") {
      setSystemAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, resolved: true } : alert)))
      toast({
        title: "告警已处理",
        description: "告警状态已更新为已解决",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
      case "normal":
        return "text-green-600 bg-green-50"
      case "warning":
        return "text-yellow-600 bg-yellow-50"
      case "stopped":
      case "critical":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
      case "normal":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "stopped":
      case "critical":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getAlertIcon = (level: string) => {
    switch (level) {
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "info":
        return <CheckCircle className="w-4 h-4 text-blue-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric, index) => (
          <Card
            key={index}
            className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {metric.value.toFixed(metric.name === "错误率" ? 2 : 0)}
                    <span className="text-sm text-slate-500 ml-1">{metric.unit}</span>
                  </p>
                  <div className="flex items-center mt-2">
                    <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(metric.status).split(" ")[1]}`} />
                    <span className={`text-sm font-medium ${getStatusColor(metric.status).split(" ")[0]}`}>
                      {metric.status === "normal" ? "正常" : metric.status === "warning" ? "警告" : "严重"}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  {index < 4
                    ? [
                        <Cpu key="cpu" />,
                        <MemoryStick key="memory" />,
                        <HardDrive key="disk" />,
                        <Wifi key="network" />,
                      ][index]
                    : [
                        <Users key="users" />,
                        <Globe key="globe" />,
                        <BarChart3 key="chart" />,
                        <AlertTriangle key="alert" />,
                      ][index - 4]}
                </div>
              </div>
              {metric.name.includes("使用率") && (
                <div className="mt-4">
                  <Progress value={metric.value} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 系统服务状态 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {systemServices.map((service, index) => (
          <Card
            key={index}
            className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Server className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(service.status)}
                  <Badge className={getStatusColor(service.status)}>
                    {service.status === "running" ? "运行中" : service.status === "warning" ? "警告" : "已停止"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">端口:</span>
                    <span className="ml-2 font-medium">{service.port}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">版本:</span>
                    <span className="ml-2 font-medium">{service.version}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">运行时间:</span>
                    <span className="ml-2 font-medium">{service.uptime}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">最后检查:</span>
                    <span className="ml-2 font-medium">{service.lastCheck}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleServiceAction(service.name, "启动")}
                      disabled={service.status === "running"}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      启动
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleServiceAction(service.name, "停止")}
                      disabled={service.status === "stopped"}
                    >
                      <Square className="w-4 h-4 mr-1" />
                      停止
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleServiceAction(service.name, "重启")}>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      重启
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    详情
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 系统告警 */}
      <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-red-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            系统告警
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemAlerts.map((alert) => (
              <Alert key={alert.id} className={`${alert.resolved ? "opacity-50" : ""}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.level)}
                    <div>
                      <h4 className="font-medium">{alert.title}</h4>
                      <AlertDescription className="mt-1">{alert.message}</AlertDescription>
                      <p className="text-xs text-gray-500 mt-2">{alert.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.resolved ? (
                      <Badge variant="secondary">已解决</Badge>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleAlertAction(alert.id, "resolve")}>
                          处理
                        </Button>
                        <Button variant="ghost" size="sm">
                          详情
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 同时提供命名导出以保持兼容性
export { SystemStatusMonitor }
