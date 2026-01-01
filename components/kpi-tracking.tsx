/**
 * @fileoverview kpi-tracking.tsx
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { getProgressColor } from "@/lib/design-system"

interface KPI {
  id: string
  name: string
  category: string
  currentValue: number
  targetValue: number
  unit: string
  trend: "up" | "down" | "stable"
  status: "excellent" | "good" | "warning" | "critical"
  description: string
  owner: string
  updateFrequency: string
  lastUpdated: string
}

export function KPITracking() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // 模拟KPI数据
  const kpis: KPI[] = [
    {
      id: "1",
      name: "月度销售额",
      category: "销售",
      currentValue: 2847392,
      targetValue: 3000000,
      unit: "元",
      trend: "up",
      status: "good",
      description: "当月总销售收入",
      owner: "王总监",
      updateFrequency: "每日",
      lastUpdated: "2025-06-21",
    },
    {
      id: "2",
      name: "客户满意度",
      category: "服务",
      currentValue: 4.2,
      targetValue: 4.5,
      unit: "分",
      trend: "up",
      status: "warning",
      description: "客户满意度评分",
      owner: "张经理",
      updateFrequency: "每周",
      lastUpdated: "2025-06-20",
    },
    {
      id: "3",
      name: "员工出勤率",
      category: "人力资源",
      currentValue: 98.5,
      targetValue: 95,
      unit: "%",
      trend: "stable",
      status: "excellent",
      description: "员工按时出勤比例",
      owner: "李主管",
      updateFrequency: "每日",
      lastUpdated: "2025-06-21",
    },
    {
      id: "4",
      name: "库存周转率",
      category: "运营",
      currentValue: 4.2,
      targetValue: 5.0,
      unit: "次",
      trend: "down",
      status: "warning",
      description: "库存周转效率",
      owner: "陈经理",
      updateFrequency: "每月",
      lastUpdated: "2025-06-15",
    },
    {
      id: "5",
      name: "新客户获取",
      category: "销售",
      currentValue: 28,
      targetValue: 50,
      unit: "个",
      trend: "up",
      status: "critical",
      description: "本月新增客户数量",
      owner: "王总监",
      updateFrequency: "每日",
      lastUpdated: "2025-06-21",
    },
    {
      id: "6",
      name: "系统可用性",
      category: "技术",
      currentValue: 99.9,
      targetValue: 99.5,
      unit: "%",
      trend: "stable",
      status: "excellent",
      description: "系统正常运行时间比例",
      owner: "技术部",
      updateFrequency: "实时",
      lastUpdated: "2025-06-21",
    },
  ]

  // 趋势数据
  const trendData = [
    { month: "1月", sales: 2200000, satisfaction: 4.0, attendance: 97.8 },
    { month: "2月", sales: 2400000, satisfaction: 4.1, attendance: 98.2 },
    { month: "3月", sales: 2600000, satisfaction: 4.0, attendance: 98.0 },
    { month: "4月", sales: 2750000, satisfaction: 4.2, attendance: 98.5 },
    { month: "5月", sales: 2800000, satisfaction: 4.1, attendance: 98.3 },
    { month: "6月", sales: 2847392, satisfaction: 4.2, attendance: 98.5 },
  ]

  // 分类分布数据
  const categoryData = [
    { name: "销售", value: 35, color: "#3b82f6" },
    { name: "服务", value: 25, color: "#10b981" },
    { name: "运营", value: 20, color: "#f59e0b" },
    { name: "人力资源", value: 15, color: "#ef4444" },
    { name: "技术", value: 5, color: "#8b5cf6" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "excellent":
        return "优秀"
      case "good":
        return "良好"
      case "warning":
        return "警告"
      case "critical":
        return "紧急"
      default:
        return "未知"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "good":
        return <CheckCircle className="w-4 h-4 text-blue-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Target className="w-4 h-4 text-gray-600" />
    }
  }

  const filteredKPIs = kpis.filter((kpi) => {
    if (selectedCategory !== "all" && kpi.category !== selectedCategory) return false
    return true
  })

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 - 统一风格 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KPI绩效跟踪</h1>
          <p className="text-gray-600 mt-1">关键绩效指标监控与分析</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
              <SelectItem value="year">本年度</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white">
            导出报告
          </Button>
        </div>
      </div>

      {/* 统计卡片区域 - 严格执行统一规范 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-r-[5px] border-r-blue-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总KPI数量</p>
                <p className="text-3xl font-bold text-blue-600">{filteredKPIs.length}</p>
                <p className="text-xs text-gray-500 mt-1">正在跟踪的指标</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-green-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">达标率</p>
                <p className="text-3xl font-bold text-green-600">
                  {Math.round(
                    (filteredKPIs.filter((kpi) => kpi.status === "excellent" || kpi.status === "good").length /
                      filteredKPIs.length) *
                      100,
                  )}
                  %
                </p>
                <p className="text-xs text-gray-500 mt-1">指标达标比例</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-orange-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">预警指标</p>
                <p className="text-3xl font-bold text-orange-600">
                  {filteredKPIs.filter((kpi) => kpi.status === "warning" || kpi.status === "critical").length}
                </p>
                <p className="text-xs text-gray-500 mt-1">需要关注的指标</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-green-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">上升趋势</p>
                <p className="text-3xl font-bold text-green-600">
                  {filteredKPIs.filter((kpi) => kpi.trend === "up").length}
                </p>
                <p className="text-xs text-gray-500 mt-1">呈上升趋势的指标</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 数据可视化 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle>关键指标趋势</CardTitle>
            <CardDescription>近6个月主要KPI变化趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="satisfaction" stroke="#3b82f6" name="客户满意度" />
                <Line type="monotone" dataKey="attendance" stroke="#10b981" name="出勤率" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle>KPI分类分布</CardTitle>
            <CardDescription>各类别KPI数量占比</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* KPI详细列表 */}
      <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle>KPI详细监控</CardTitle>
          <CardDescription>所有关键绩效指标的实时状态</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredKPIs.map((kpi) => (
              <div
                key={kpi.id}
                className="border border-sky-200 rounded-xl p-4 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{kpi.name}</h4>
                      <Badge variant="outline">{kpi.category}</Badge>
                      <Badge className={getStatusColor(kpi.status)}>{getStatusText(kpi.status)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{kpi.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>负责人: {kpi.owner}</span>
                      <span>更新频率: {kpi.updateFrequency}</span>
                      <span>最后更新: {kpi.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(kpi.status)}
                    {getTrendIcon(kpi.trend)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>当前值</span>
                      <span className="font-medium">
                        {kpi.currentValue.toLocaleString()} {kpi.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>目标值</span>
                      <span className="font-medium">
                        {kpi.targetValue.toLocaleString()} {kpi.unit}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>完成度</span>
                      <span className="font-medium">
                        {Math.round(calculateProgress(kpi.currentValue, kpi.targetValue))}%
                      </span>
                    </div>
                    <Progress
                      value={calculateProgress(kpi.currentValue, kpi.targetValue)}
                      className="h-2"
                      style={{ background: "rgb(226 232 240)" }}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                          calculateProgress(kpi.currentValue, kpi.targetValue),
                          kpi.status,
                        )}`}
                        style={{ width: `${calculateProgress(kpi.currentValue, kpi.targetValue)}%` }}
                      />
                    </Progress>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      查看详情
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
                    >
                      更新数据
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
