/**
 * @fileoverview log-management.tsx
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
import {
  Activity,
  AlertTriangle,
  Info,
  XCircle,
  User,
  Database,
  Shield,
  Zap,
  Server,
  Network,
  Calendar,
  Download,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface LogEntry {
  id: string
  timestamp: string
  level: "debug" | "info" | "warn" | "error" | "fatal"
  category: "system" | "security" | "user" | "api" | "database" | "network"
  message: string
  details: string
  userId?: string
  username?: string
  ip: string
  userAgent: string
  module: string
  action: string
  resource?: string
  duration?: number
  status: "success" | "failure" | "pending"
  tags: string[]
}

interface LogStats {
  totalLogs: number
  todayLogs: number
  errorLogs: number
  warningLogs: number
  errorRate: number
  avgResponseTime: number
  topUsers: Array<{ username: string; count: number }>
  topModules: Array<{ module: string; count: number }>
}

export default function LogManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [realTimeEnabled, setRealTimeEnabled] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [logsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: "2024-01-02 14:30:25",
      level: "error",
      category: "security",
      message: "检测到SQL注入攻击尝试",
      details: "用户尝试在登录表单中注入恶意SQL代码，已被系统拦截",
      userId: "unknown",
      username: "unknown",
      ip: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      module: "auth",
      action: "login",
      resource: "/api/auth/login",
      duration: 1250,
      status: "failure",
      tags: ["security", "attack", "sql-injection"],
    },
    {
      id: "2",
      timestamp: "2024-01-02 14:25:10",
      level: "warn",
      category: "user",
      message: "用户登录失败次数过多",
      details: "用户admin@jinlan.com在5分钟内尝试登录失败3次，账户已临时锁定",
      userId: "1",
      username: "admin@jinlan.com",
      ip: "203.208.60.1",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      module: "auth",
      action: "login",
      resource: "/api/auth/login",
      duration: 890,
      status: "failure",
      tags: ["auth", "failed-login", "rate-limit"],
    },
    {
      id: "3",
      timestamp: "2024-01-02 14:20:15",
      level: "info",
      category: "user",
      message: "用户成功登录系统",
      details: "用户manager@jinlan.com成功登录系统，来源IP: 114.114.114.114",
      userId: "2",
      username: "manager@jinlan.com",
      ip: "114.114.114.114",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      module: "auth",
      action: "login",
      resource: "/api/auth/login",
      duration: 456,
      status: "success",
      tags: ["auth", "login", "success"],
    },
    {
      id: "4",
      timestamp: "2024-01-02 14:15:30",
      level: "error",
      category: "database",
      message: "数据库连接超时",
      details: "连接到主数据库时发生超时，尝试连接备用数据库",
      ip: "127.0.0.1",
      userAgent: "System",
      module: "database",
      action: "connect",
      resource: "mysql://localhost:3306/jinlan_db",
      duration: 30000,
      status: "failure",
      tags: ["database", "timeout", "connection"],
    },
    {
      id: "5",
      timestamp: "2024-01-02 14:10:45",
      level: "info",
      category: "system",
      message: "系统定时任务执行完成",
      details: "数据备份任务执行成功，备份文件大小: 2.5GB",
      ip: "127.0.0.1",
      userAgent: "System Scheduler",
      module: "scheduler",
      action: "backup",
      resource: "/data/backup/",
      duration: 180000,
      status: "success",
      tags: ["system", "backup", "scheduled"],
    },
  ])

  const [logStats, setLogStats] = useState<LogStats>({
    totalLogs: 5,
    todayLogs: 5,
    errorLogs: 2,
    warningLogs: 1,
    errorRate: 40,
    avgResponseTime: 42519,
    topUsers: [
      { username: "admin@jinlan.com", count: 15 },
      { username: "manager@jinlan.com", count: 12 },
    ],
    topModules: [
      { module: "auth", count: 25 },
      { module: "database", count: 18 },
    ],
  })

  const filteredLogs = logs.filter((log) => {
    const searchMatch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm) ||
      log.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const levelMatch = selectedLevel === "all" || log.level === selectedLevel
    const categoryMatch = selectedCategory === "all" || log.category === selectedCategory
    return searchMatch && levelMatch && categoryMatch
  })

  const startIndex = (currentPage - 1) * logsPerPage
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + logsPerPage)
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage)

  useEffect(() => {
    const total = logs.length
    const today = new Date().toDateString()
    const todayCount = logs.filter((log) => new Date(log.timestamp).toDateString() === today).length
    const errorCount = logs.filter((log) => log.level === "error").length
    const warningCount = logs.filter((log) => log.level === "warn").length

    const validDurations = logs.filter((log) => log.duration !== undefined).map((log) => log.duration!)
    const avgResponseTime =
      validDurations.length > 0
        ? Math.round(validDurations.reduce((sum, duration) => sum + duration, 0) / validDurations.length)
        : 0

    setLogStats({
      totalLogs: total,
      todayLogs: todayCount,
      errorLogs: errorCount,
      warningLogs: warningCount,
      errorRate: total > 0 ? Math.round((errorCount / total) * 100) : 0,
      avgResponseTime: avgResponseTime,
      topUsers: logStats.topUsers,
      topModules: logStats.topModules,
    })
  }, [logs])

  useEffect(() => {
    if (realTimeEnabled && autoRefresh) {
      const interval = setInterval(() => {
        const levels: Array<"info" | "warn" | "error" | "debug"> = ["info", "warn", "error", "debug"]
        const categories: Array<"system" | "user" | "api" | "database" | "network" | "security"> = [
          "system",
          "user",
          "api",
          "database",
          "network",
          "security",
        ]
        const actions = ["request", "login", "query", "update", "delete", "create"]
        const statuses: Array<"success" | "failure"> = ["success", "failure"]

        const newLog: LogEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString(),
          level: levels[Math.floor(Math.random() * levels.length)],
          category: categories[Math.floor(Math.random() * categories.length)],
          message: `自动生成的实时日志 - ${actions[Math.floor(Math.random() * actions.length)]}`,
          details: "这是一条系统自动生成的实时监控日志，用于演示实时更新功能",
          ip: `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
          userAgent: "System Monitor",
          module: "realtime",
          action: actions[Math.floor(Math.random() * actions.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          tags: ["real-time", "auto-generated"],
        }

        setLogs((prev) => [newLog, ...prev.slice(0, 49)])
      }, 10000)

      return () => clearInterval(interval)
    }
  }, [realTimeEnabled, autoRefresh])

  const handleExportLogs = () => {
    toast({
      title: "导出成功",
      description: "日志已导出为CSV格式",
    })
  }

  const handleClearLogs = () => {
    setLogs([])
    toast({
      title: "清理完成",
      description: "所有日志已清理",
    })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "debug":
        return "text-gray-600 bg-gray-50"
      case "info":
        return "text-blue-600 bg-blue-50"
      case "warn":
        return "text-yellow-600 bg-yellow-50"
      case "error":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "security":
        return "text-red-600 bg-red-50"
      case "system":
        return "text-blue-600 bg-blue-50"
      case "user":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />
      case "warn":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "system":
        return <Server className="w-4 h-4" />
      case "security":
        return <Shield className="w-4 h-4" />
      case "user":
        return <User className="w-4 h-4" />
      case "api":
        return <Zap className="w-4 h-4" />
      case "database":
        return <Database className="w-4 h-4" />
      case "network":
        return <Network className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">日志管理</h2>
          <p className="text-muted-foreground">系统日志监控与分析</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="w-4 h-4 mr-2" />
            导出日志
          </Button>
          <Button variant="outline" onClick={handleClearLogs}>
            <Trash2 className="w-4 h-4 mr-2" />
            清理日志
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">总日志数</p>
              <p className="text-2xl font-bold">{logStats.totalLogs}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">今日日志</p>
              <p className="text-2xl font-bold">{logStats.todayLogs}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">错误日志</p>
              <p className="text-2xl font-bold">{logStats.errorLogs}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">警告日志</p>
              <p className="text-2xl font-bold">{logStats.warningLogs}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="搜索日志内容、IP、用户名或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">所有级别</option>
            <option value="info">信息</option>
            <option value="warn">警告</option>
            <option value="error">错误</option>
            <option value="debug">调试</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">所有分类</option>
            <option value="system">系统</option>
            <option value="security">安全</option>
            <option value="user">用户</option>
            <option value="api">API</option>
            <option value="database">数据库</option>
            <option value="network">网络</option>
          </select>
        </div>

        <div className="space-y-2">
          {paginatedLogs.map((log) => (
            <div key={log.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getLevelIcon(log.level)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge className={getLevelColor(log.level)}>{log.level.toUpperCase()}</Badge>
                      <Badge className={getCategoryColor(log.category)}>
                        {getCategoryIcon(log.category)}
                        <span className="ml-1">{log.category}</span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <p className="font-medium mb-1">{log.message}</p>
                    <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>IP: {log.ip}</span>
                      {log.username && <span>用户: {log.username}</span>}
                      <span>模块: {log.module}</span>
                      <span>操作: {log.action}</span>
                      {log.duration && <span>耗时: {log.duration}ms</span>}
                    </div>
                    {log.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {log.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>没有找到匹配的日志记录</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              上一页
            </Button>
            <span className="text-sm px-4">
              第 {currentPage} / {totalPages} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              下一页
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
