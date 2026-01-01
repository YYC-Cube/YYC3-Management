"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import {
  Activity,
  Server,
  Database,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Share2,
  Filter,
  Play,
  Square,
  RotateCcw,
  Eye,
  Settings,
  Zap,
  FileText,
  BarChart3,
  Clock,
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

export default function SystemMonitorPage() {
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
    <>
      <div className="responsive-content">
        {/* 页面标题和控制 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="responsive-title flex items-center">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-600" />
              系统监控中心
            </h1>
            <p className="responsive-text mt-2">实时监控系统状态和性能指标</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>最后更新: {lastUpdate.toLocaleTimeString()}</span>
            </div>
            <Button variant="outline" size="sm" className="responsive-button bg-transparent">
              <Filter className="responsive-icon mr-2" />
              筛选
            </Button>
            <Button variant="outline" size="sm" className="responsive-button bg-transparent">
              <Download className="responsive-icon mr-2" />
              导出
            </Button>
            <Button variant="outline" size="sm" className="responsive-button bg-transparent">
              <Share2 className="responsive-icon mr-2" />
              分享
            </Button>
            <Button
              onClick={refreshData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 responsive-button"
            >
              <RefreshCw className={`responsive-icon mr-2 ${loading ? "animate-spin" : ""}`} />
              {loading ? "刷新中..." : "刷新数据"}
            </Button>
          </div>
        </div>

        {/* 核心指标卡片 */}
        <div className="responsive-grid-4">
          {systemMetrics.map((metric, index) => (
            <Card
              key={index}
              className="responsive-card hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-slate-600">{metric.name}</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">
                      {metric.value.toFixed(metric.name === "错误率" ? 2 : 0)}
                      <span className="text-xs sm:text-sm text-slate-500 ml-1">{metric.unit}</span>
                    </p>
                    <div className="flex items-center mt-2">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(metric.status).split(" ")[1]}`} />
                      <span className={`text-xs sm:text-sm font-medium ${getStatusColor(metric.status).split(" ")[0]}`}>
                        {metric.status === "normal" ? "正常" : metric.status === "warning" ? "警告" : "严重"}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    {index < 4
                      ? [
                          <Cpu key="cpu" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
                          <MemoryStick key="memory" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
                          <HardDrive key="disk" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
                          <Wifi key="network" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
                        ][index]
                      : [
                          <Users key="users" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
                          <Globe key="globe" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
                          <BarChart3 key="chart" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
                          <AlertTriangle key="alert" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
                        ][index - 4]}
                  </div>
                </div>
                {metric.name.includes("使用率") && (
                  <div className="mt-3 sm:mt-4">
                    <Progress value={metric.value} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 自动刷新控制 */}
        <Card className="responsive-card border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              监控设置
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoRefresh"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="autoRefresh" className="text-sm font-medium">
                    自动刷新
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">刷新间隔:</label>
                  <select
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5秒</option>
                    <option value={10}>10秒</option>
                    <option value={30}>30秒</option>
                    <option value={60}>1分钟</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600">
                <span>监控频率: 实时</span>
                <span>数据保留: 30天</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 主要内容标签页 */}
        <Tabs defaultValue="services" className="responsive-spacing">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="services">系统服务</TabsTrigger>
            <TabsTrigger value="performance">性能监控</TabsTrigger>
            <TabsTrigger value="security">安全状态</TabsTrigger>
            <TabsTrigger value="logs">系统日志</TabsTrigger>
            <TabsTrigger value="reports">监控报告</TabsTrigger>
          </TabsList>

          {/* 系统服务 */}
          <TabsContent value="services" className="responsive-spacing">
            <div className="responsive-grid-2">
              {systemServices.map((service, index) => (
                <Card
                  key={index}
                  className="responsive-card hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Server className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base sm:text-lg">{service.name}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm">{service.description}</CardDescription>
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
                      <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
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
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t gap-2">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleServiceAction(service.name, "启动")}
                            disabled={service.status === "running"}
                            className="text-xs"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            启动
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleServiceAction(service.name, "停止")}
                            disabled={service.status === "stopped"}
                            className="text-xs"
                          >
                            <Square className="w-3 h-3 mr-1" />
                            停止
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleServiceAction(service.name, "重启")}
                            className="text-xs"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            重启
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          详情
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 性能监控 */}
          <TabsContent value="performance" className="responsive-spacing">
            <div className="responsive-grid-2">
              <Card className="responsive-card border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <Cpu className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                    CPU性能
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">总体使用率</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div>用户进程: 28%</div>
                      <div>系统进程: 17%</div>
                      <div>空闲: 55%</div>
                      <div>I/O等待: 2%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="responsive-card border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <MemoryStick className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                    内存使用
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">内存使用率</span>
                      <span className="font-semibold">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div>已使用: 5.4GB</div>
                      <div>可用: 2.6GB</div>
                      <div>缓存: 1.2GB</div>
                      <div>缓冲: 0.8GB</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="responsive-card border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <HardDrive className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600" />
                    存储状态
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">磁盘使用率</span>
                      <span className="font-semibold">32%</span>
                    </div>
                    <Progress value={32} className="h-2" />
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div>已使用: 160GB</div>
                      <div>可用: 340GB</div>
                      <div>读取: 45MB/s</div>
                      <div>写入: 23MB/s</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="responsive-card border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <Wifi className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
                    网络流量
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">网络使用率</span>
                      <span className="font-semibold">156 MB/s</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div>入站: 98MB/s</div>
                      <div>出站: 58MB/s</div>
                      <div>连接数: 892</div>
                      <div>延迟: 12ms</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 安全状态 */}
          <TabsContent value="security" className="responsive-spacing">
            <div className="responsive-grid-3">
              <Card className="responsive-card border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                    防火墙状态
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">状态</span>
                      <Badge className="bg-green-100 text-green-800">运行中</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">规则数</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">阻止次数</span>
                      <span className="font-medium">23</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="responsive-card border-r-[5px] border-r-yellow-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-600" />
                    入侵检测
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">状态</span>
                      <Badge className="bg-yellow-100 text-yellow-800">监控中</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">威胁检测</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">最后扫描</span>
                      <span className="font-medium">5分钟前</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="responsive-card border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                    SSL证书
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">状态</span>
                      <Badge className="bg-blue-100 text-blue-800">有效</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">到期时间</span>
                      <span className="font-medium">89天</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">颁发机构</span>
                      <span className="font-medium">Let's Encrypt</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 系统日志 */}
          <TabsContent value="logs" className="responsive-spacing">
            <Card className="responsive-card border-r-[5px] border-r-indigo-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
                  系统日志
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    <Download className="w-3 h-3 mr-1" />
                    导出日志
                  </Button>
                  <select className="px-3 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>应用日志</option>
                    <option>错误日志</option>
                    <option>访问日志</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 sm:h-96">
                  <div className="space-y-2 font-mono text-xs sm:text-sm">
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="text-gray-500">[2024-01-02 14:30:25]</span>
                      <span className="text-blue-600 ml-2">[INFO]</span>
                      <span className="ml-2">用户登录成功 - admin@jinlan.com</span>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded">
                      <span className="text-gray-500">[2024-01-02 14:29:15]</span>
                      <span className="text-yellow-600 ml-2">[WARN]</span>
                      <span className="ml-2">内存使用率超过阈值 - 68%</span>
                    </div>
                    <div className="p-2 bg-red-50 rounded">
                      <span className="text-gray-500">[2024-01-02 14:25:10]</span>
                      <span className="text-red-600 ml-2">[ERROR]</span>
                      <span className="ml-2">Elasticsearch服务连接失败</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="text-gray-500">[2024-01-02 14:20:05]</span>
                      <span className="text-blue-600 ml-2">[INFO]</span>
                      <span className="ml-2">定时备份任务开始执行</span>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="text-gray-500">[2024-01-02 14:15:30]</span>
                      <span className="text-blue-600 ml-2">[INFO]</span>
                      <span className="ml-2">系统监控服务启动</span>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 监控报告 */}
          <TabsContent value="reports" className="responsive-spacing">
            <div className="responsive-grid-2">
              <Card className="responsive-card border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                    性能报告
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">日报告</span>
                      <Button variant="outline" size="sm" className="text-xs bg-transparent">
                        <Download className="w-3 h-3 mr-1" />
                        下载
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">周报告</span>
                      <Button variant="outline" size="sm" className="text-xs bg-transparent">
                        <Download className="w-3 h-3 mr-1" />
                        下载
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">月报告</span>
                      <Button variant="outline" size="sm" className="text-xs bg-transparent">
                        <Download className="w-3 h-3 mr-1" />
                        下载
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="responsive-card border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
                    快速操作
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-12 bg-transparent text-xs sm:text-sm">
                      <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      重启系统
                    </Button>
                    <Button variant="outline" className="h-12 bg-transparent text-xs sm:text-sm">
                      <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      备份数据
                    </Button>
                    <Button variant="outline" className="h-12 bg-transparent text-xs sm:text-sm">
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      安全扫描
                    </Button>
                    <Button variant="outline" className="h-12 bg-transparent text-xs sm:text-sm">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      性能优化
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* 告警信息 */}
        <Card className="responsive-card border-r-[5px] border-r-red-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600" />
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAlertAction(alert.id, "resolve")}
                            className="text-xs"
                          >
                            处理
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
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
      <FloatingNavButtons />
    </>
  )
}
