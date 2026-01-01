/**
 * @fileoverview system-performance-metrics.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { useState, useEffect } from "react"

interface SystemMetrics {
  cpu: {
    usage: number
    cores: number
    temperature: number
    status: "normal" | "warning" | "critical"
  }
  memory: {
    used: number
    total: number
    usage: number
    status: "normal" | "warning" | "critical"
  }
  disk: {
    used: number
    total: number
    usage: number
    status: "normal" | "warning" | "critical"
  }
  network: {
    inbound: number
    outbound: number
    status: "normal" | "warning" | "critical"
  }
  uptime: number
  responseTime: number
}

export function SystemPerformanceMetrics() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: { usage: 45, cores: 8, temperature: 65, status: "normal" },
    memory: { used: 12.5, total: 32, usage: 39, status: "normal" },
    disk: { used: 450, total: 1000, usage: 45, status: "normal" },
    network: { inbound: 125, outbound: 89, status: "normal" },
    uptime: 2847392,
    responseTime: 245,
  })
  const [isLoading, setIsLoading] = useState(false)

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          usage: Math.max(10, Math.min(90, prev.cpu.usage + Math.floor(Math.random() * 10 - 5))),
          temperature: Math.max(40, Math.min(80, prev.cpu.temperature + Math.floor(Math.random() * 4 - 2))),
        },
        memory: {
          ...prev.memory,
          usage: Math.max(20, Math.min(85, prev.memory.usage + Math.floor(Math.random() * 6 - 3))),
        },
        network: {
          ...prev.network,
          inbound: Math.max(50, prev.network.inbound + Math.floor(Math.random() * 20 - 10)),
          outbound: Math.max(30, prev.network.outbound + Math.floor(Math.random() * 15 - 7)),
        },
        responseTime: Math.max(100, Math.min(500, prev.responseTime + Math.floor(Math.random() * 40 - 20))),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setMetrics({
      cpu: {
        usage: Math.floor(Math.random() * 60) + 20,
        cores: 8,
        temperature: Math.floor(Math.random() * 30) + 50,
        status: "normal",
      },
      memory: {
        used: Math.floor(Math.random() * 20) + 10,
        total: 32,
        usage: Math.floor(Math.random() * 50) + 30,
        status: "normal",
      },
      disk: {
        used: Math.floor(Math.random() * 300) + 400,
        total: 1000,
        usage: Math.floor(Math.random() * 30) + 40,
        status: "normal",
      },
      network: {
        inbound: Math.floor(Math.random() * 100) + 80,
        outbound: Math.floor(Math.random() * 80) + 60,
        status: "normal",
      },
      uptime: 2847392 + Math.floor(Math.random() * 1000),
      responseTime: Math.floor(Math.random() * 200) + 150,
    })
    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600 bg-green-100"
      case "warning":
        return "text-yellow-600 bg-yellow-100"
      case "critical":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="w-4 h-4" />
      case "warning":
        return <AlertTriangle className="w-4 h-4" />
      case "critical":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}天 ${hours}小时 ${minutes}分钟`
  }

  return (
    <div className="space-y-6">
      {/* 系统性能头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">系统性能监控</h3>
          <p className="text-sm text-slate-600">实时监控系统资源使用情况</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 bg-transparent"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          刷新
        </Button>
      </div>

      {/* 系统状态概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU 使用率 */}
        <Card className="border-r-[5px] border-r-blue-400 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">CPU</span>
              </div>
              <Badge className={getStatusColor(metrics.cpu.status)}>
                {getStatusIcon(metrics.cpu.status)}
                正常
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>使用率</span>
                <span className="font-medium">{metrics.cpu.usage}%</span>
              </div>
              <Progress value={metrics.cpu.usage} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{metrics.cpu.cores} 核心</span>
                <span>{metrics.cpu.temperature}°C</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 内存使用率 */}
        <Card className="border-r-[5px] border-r-green-400 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MemoryStick className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">内存</span>
              </div>
              <Badge className={getStatusColor(metrics.memory.status)}>
                {getStatusIcon(metrics.memory.status)}
                正常
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>使用率</span>
                <span className="font-medium">{metrics.memory.usage}%</span>
              </div>
              <Progress value={metrics.memory.usage} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{metrics.memory.used}GB 已用</span>
                <span>{metrics.memory.total}GB 总计</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 磁盘使用率 */}
        <Card className="border-r-[5px] border-r-orange-400 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium">磁盘</span>
              </div>
              <Badge className={getStatusColor(metrics.disk.status)}>
                {getStatusIcon(metrics.disk.status)}
                正常
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>使用率</span>
                <span className="font-medium">{metrics.disk.usage}%</span>
              </div>
              <Progress value={metrics.disk.usage} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{metrics.disk.used}GB 已用</span>
                <span>{metrics.disk.total}GB 总计</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 网络流量 */}
        <Card className="border-r-[5px] border-r-purple-400 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">网络</span>
              </div>
              <Badge className={getStatusColor(metrics.network.status)}>
                {getStatusIcon(metrics.network.status)}
                正常
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-green-500" />
                  <span>入站</span>
                </div>
                <span className="font-medium">{metrics.network.inbound} MB/s</span>
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-blue-500" />
                  <span>出站</span>
                </div>
                <span className="font-medium">{metrics.network.outbound} MB/s</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 系统信息 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              系统信息
            </CardTitle>
            <CardDescription>服务器运行状态和基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">系统运行时间</span>
              <span className="text-sm font-medium">{formatUptime(metrics.uptime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">平均响应时间</span>
              <span className="text-sm font-medium">{metrics.responseTime}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">服务器状态</span>
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                运行正常
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">负载均衡</span>
              <Badge className="bg-blue-100 text-blue-700">
                <Activity className="w-3 h-3 mr-1" />
                已启用
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              性能趋势
            </CardTitle>
            <CardDescription>过去24小时的系统性能趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              性能趋势图表区域
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SystemPerformanceMetrics
