/**
 * @fileoverview performance-optimization.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Zap,
  Activity,
  Database,
  Code,
  Monitor,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Clock,
  TrendingUp,
  Settings,
  RefreshCw,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  status: "good" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  description: string
}

interface OptimizationFeature {
  id: string
  name: string
  description: string
  enabled: boolean
  impact: "high" | "medium" | "low"
  category: "loading" | "caching" | "bundling" | "runtime"
}

interface PerformanceData {
  timestamp: string
  loadTime: number
  memoryUsage: number
  cpuUsage: number
  networkLatency: number
}

export function PerformanceOptimization() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])

  const performanceMetrics: PerformanceMetric[] = [
    {
      name: "页面加载时间",
      value: 1.2,
      unit: "秒",
      status: "good",
      trend: "down",
      description: "首次内容绘制时间",
    },
    {
      name: "内存使用率",
      value: 68,
      unit: "%",
      status: "warning",
      trend: "up",
      description: "当前内存占用情况",
    },
    {
      name: "CPU使用率",
      value: 45,
      unit: "%",
      status: "good",
      trend: "stable",
      description: "处理器负载情况",
    },
    {
      name: "网络延迟",
      value: 85,
      unit: "ms",
      status: "good",
      trend: "down",
      description: "API响应时间",
    },
    {
      name: "缓存命中率",
      value: 92,
      unit: "%",
      status: "good",
      trend: "up",
      description: "缓存有效性",
    },
    {
      name: "包大小",
      value: 2.8,
      unit: "MB",
      status: "warning",
      trend: "up",
      description: "JavaScript包总大小",
    },
  ]

  const optimizationFeatures: OptimizationFeature[] = [
    {
      id: "lazy-loading",
      name: "懒加载",
      description: "按需加载组件和资源",
      enabled: true,
      impact: "high",
      category: "loading",
    },
    {
      id: "code-splitting",
      name: "代码分割",
      description: "将代码拆分为更小的块",
      enabled: true,
      impact: "high",
      category: "bundling",
    },
    {
      id: "image-optimization",
      name: "图片优化",
      description: "自动压缩和格式转换",
      enabled: true,
      impact: "medium",
      category: "loading",
    },
    {
      id: "service-worker",
      name: "Service Worker",
      description: "离线缓存和后台同步",
      enabled: true,
      impact: "high",
      category: "caching",
    },
    {
      id: "memory-optimization",
      name: "内存优化",
      description: "自动垃圾回收和内存清理",
      enabled: false,
      impact: "medium",
      category: "runtime",
    },
    {
      id: "prefetching",
      name: "预加载",
      description: "预先加载可能需要的资源",
      enabled: false,
      impact: "medium",
      category: "loading",
    },
    {
      id: "compression",
      name: "Gzip压缩",
      description: "启用资源压缩传输",
      enabled: true,
      impact: "high",
      category: "loading",
    },
    {
      id: "cdn-optimization",
      name: "CDN优化",
      description: "使用内容分发网络",
      enabled: true,
      impact: "high",
      category: "loading",
    },
  ]

  useEffect(() => {
    const generateData = () => {
      const now = new Date()
      const data: PerformanceData[] = []

      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
        data.push({
          timestamp: timestamp.toLocaleTimeString(),
          loadTime: Math.random() * 2 + 0.5,
          memoryUsage: Math.random() * 30 + 50,
          cpuUsage: Math.random() * 40 + 20,
          networkLatency: Math.random() * 50 + 50,
        })
      }

      setPerformanceData(data)
    }

    generateData()
    const interval = setInterval(generateData, 60000)

    return () => clearInterval(interval)
  }, [])

  const runOptimization = useCallback(async () => {
    setIsOptimizing(true)
    setOptimizationProgress(0)

    const steps = [
      "分析代码结构",
      "识别性能瓶颈",
      "优化资源加载",
      "压缩静态资源",
      "配置缓存策略",
      "清理无用代码",
      "更新配置文件",
      "验证优化效果",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setOptimizationProgress(((i + 1) / steps.length) * 100)
    }

    setIsOptimizing(false)
  }, [])

  const getMetricStatusColor = (status: string) => {
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

  const getMetricStatusBg = (status: string) => {
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-red-500" />
      case "down":
        return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "loading":
        return <Zap className="w-4 h-4" />
      case "caching":
        return <Database className="w-4 h-4" />
      case "bundling":
        return <Code className="w-4 h-4" />
      case "runtime":
        return <Activity className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Monitor className="w-4 h-4 mr-2" />
            性能报告
          </Button>
          <Button onClick={runOptimization} disabled={isOptimizing} className="bg-green-600 hover:bg-green-700">
            {isOptimizing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                优化中...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                开始优化
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 优化进度 */}
      {isOptimizing && (
        <Card className="bg-green-50 border-green-200 border-r-[5px] border-r-green-500 p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-green-900">正在优化系统性能</h3>
              <span className="text-sm text-green-700">{Math.round(optimizationProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${optimizationProgress}%` }}
              ></div>
            </div>
          </div>
        </Card>
      )}

      {/* 性能指标概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card
            key={index}
            className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-green-500 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-900">{metric.name}</h3>
              {getTrendIcon(metric.trend)}
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className={`text-2xl font-bold ${getMetricStatusColor(metric.status)}`}>{metric.value}</span>
              <span className="text-sm text-slate-600">{metric.unit}</span>
            </div>
            <p className="text-xs text-slate-600">{metric.description}</p>
            <div className={`mt-2 px-2 py-1 rounded text-xs ${getMetricStatusBg(metric.status)}`}>
              {metric.status === "good" ? "良好" : metric.status === "warning" ? "警告" : "严重"}
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">性能指标</TabsTrigger>
          <TabsTrigger value="optimization">优化配置</TabsTrigger>
          <TabsTrigger value="monitoring">实时监控</TabsTrigger>
          <TabsTrigger value="analysis">性能分析</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-green-500 p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  加载时间趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="loadTime" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-green-500 p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MemoryStick className="w-5 h-5 text-green-600" />
                  资源使用情况
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="memoryUsage" stackId="1" stroke="#22c55e" fill="#22c55e" />
                    <Area type="monotone" dataKey="cpuUsage" stackId="2" stroke="#16a34a" fill="#16a34a" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-green-500 p-4 text-center">
              <Cpu className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold">CPU使用率</h3>
              <p className="text-2xl font-bold text-green-600">45%</p>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-green-500 p-4 text-center">
              <MemoryStick className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold">内存使用</h3>
              <p className="text-2xl font-bold text-green-600">68%</p>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-green-500 p-4 text-center">
              <HardDrive className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold">磁盘使用</h3>
              <p className="text-2xl font-bold text-green-600">32%</p>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-green-500 p-4 text-center">
              <Wifi className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold">网络延迟</h3>
              <p className="text-2xl font-bold text-green-600">85ms</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <div className="grid gap-4">
            {optimizationFeatures.map((feature) => (
              <Card
                key={feature.id}
                className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-green-500 p-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">{getCategoryIcon(feature.category)}</div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:translate-x-1 transition-transform duration-300">
                        {feature.name}
                      </h3>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getImpactColor(feature.impact)}>
                          {feature.impact === "high" ? "高影响" : feature.impact === "medium" ? "中影响" : "低影响"}
                        </Badge>
                        <Badge variant="outline">{feature.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <Switch checked={feature.enabled} />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-green-500 p-6">
              <h3 className="text-lg font-semibold mb-4">实时性能监控</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">页面响应时间</span>
                  <span className="font-semibold text-green-600">1.2s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API响应时间</span>
                  <span className="font-semibold text-green-600">85ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">数据库查询时间</span>
                  <span className="font-semibold text-green-600">45ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">缓存命中率</span>
                  <span className="font-semibold text-green-600">92%</span>
                </div>
              </div>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-green-500 p-6">
              <h3 className="text-lg font-semibold mb-4">错误监控</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">JavaScript错误</span>
                  <span className="font-semibold text-red-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">网络错误</span>
                  <span className="font-semibold text-yellow-600">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API错误</span>
                  <span className="font-semibold text-green-600">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">错误率</span>
                  <span className="font-semibold text-green-600">0.02%</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-6">
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-green-500 p-6">
              <h3 className="text-lg font-semibold mb-4">性能分析报告</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900">优化建议</h4>
                  <ul className="mt-2 space-y-1 text-sm text-green-800">
                    <li>• 启用图片懒加载可减少初始加载时间30%</li>
                    <li>• 使用代码分割可减少包大小40%</li>
                    <li>• 启用Service Worker可提升缓存命中率15%</li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-900">性能瓶颈</h4>
                  <ul className="mt-2 space-y-1 text-sm text-yellow-800">
                    <li>• 大型图片资源影响加载速度</li>
                    <li>• 未使用的JavaScript代码占用空间</li>
                    <li>• 数据库查询可进一步优化</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900">优化成果</h4>
                  <ul className="mt-2 space-y-1 text-sm text-blue-800">
                    <li>• 页面加载时间减少25%</li>
                    <li>• 内存使用优化20%</li>
                    <li>• 网络请求减少35%</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
