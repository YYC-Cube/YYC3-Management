/**
 * @fileoverview advanced-bi-reports.tsx
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, PieChart, TrendingUp, Download, Filter, Eye, Settings, Plus, Brain, Zap } from "lucide-react"
import {
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Pie,
} from "recharts"

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: "sales" | "finance" | "customer" | "operation"
  lastUpdated: Date
  isCustom: boolean
}

// 销售趋势图数据接口
interface SalesTrendData {
  name: string
  sales: number
  target: number
  growth: number
}

// 产品分类数据接口
interface CategoryData {
  name: string
  value: number
  sales: number
  growth: number
  color: string
}

// 客户满意度数据接口
interface SatisfactionData {
  subject: string
  A: number
  B: number
  fullMark: number
}

// 财务数据接口
interface FinanceData {
  name: string
  revenue: number
  cost: number
  profit: number
}

// 通用图表数据接口
interface ChartData {
  name: string
  value: number
  [key: string]: any
}

export function AdvancedBIReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedReport, setSelectedReport] = useState("overview")

  const reportTemplates: ReportTemplate[] = [
    {
      id: "1",
      name: "销售业绩分析",
      description: "全面分析销售数据和趋势",
      type: "sales",
      lastUpdated: new Date(),
      isCustom: false,
    },
    {
      id: "2",
      name: "财务状况报告",
      description: "收入、支出和利润分析",
      type: "finance",
      lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isCustom: false,
    },
    {
      id: "3",
      name: "客户行为分析",
      description: "客户购买模式和偏好分析",
      type: "customer",
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isCustom: true,
    },
    {
      id: "4",
      name: "运营效率报告",
      description: "业务流程和效率指标",
      type: "operation",
      lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isCustom: false,
    },
  ]

  // 销售数据
  const salesData: SalesTrendData[] = [
    { name: "1月", sales: 65000, target: 60000, growth: 8.3 },
    { name: "2月", sales: 72000, target: 65000, growth: 10.8 },
    { name: "3月", sales: 68000, target: 70000, growth: -2.9 },
    { name: "4月", sales: 78000, target: 75000, growth: 14.7 },
    { name: "5月", sales: 85000, target: 80000, growth: 9.0 },
    { name: "6月", sales: 92000, target: 85000, growth: 8.2 },
  ]

  // 产品分类数据
  const categoryData: ChartData[] = [
    { name: "沙发", value: 35, color: "#8884d8" },
    { name: "床具", value: 28, color: "#82ca9d" },
    { name: "餐桌", value: 20, color: "#ffc658" },
    { name: "储物", value: 12, color: "#ff7300" },
    { name: "装饰", value: 5, color: "#00ff88" },
  ]

  // 客户满意度数据
  const satisfactionData: SatisfactionData[] = [
    { subject: "产品质量", A: 85, B: 90, fullMark: 100 },
    { subject: "服务态度", A: 92, B: 88, fullMark: 100 },
    { subject: "配送速度", A: 78, B: 85, fullMark: 100 },
    { subject: "价格合理", A: 80, B: 82, fullMark: 100 },
    { subject: "售后服务", A: 88, B: 90, fullMark: 100 },
    { subject: "整体体验", A: 86, B: 89, fullMark: 100 },
  ]

  // 财务数据
  const financeData: FinanceData[] = [
    { name: "1月", revenue: 850000, cost: 620000, profit: 230000 },
    { name: "2月", revenue: 920000, cost: 680000, profit: 240000 },
    { name: "3月", revenue: 880000, cost: 650000, profit: 230000 },
    { name: "4月", revenue: 980000, cost: 720000, profit: 260000 },
    { name: "5月", revenue: 1050000, cost: 780000, profit: 270000 },
    { name: "6月", revenue: 1120000, cost: 820000, profit: 300000 },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "sales":
        return "bg-blue-100 text-blue-800"
      case "finance":
        return "bg-green-100 text-green-800"
      case "customer":
        return "bg-purple-100 text-purple-800"
      case "operation":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case "sales":
        return "销售"
      case "finance":
        return "财务"
      case "customer":
        return "客户"
      case "operation":
        return "运营"
      default:
        return "其他"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">高级BI分析</h1>
          <p className="text-slate-600 mt-2">商业智能分析和自定义报表系统</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            新建报表
          </Button>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics">智能分析</TabsTrigger>
          <TabsTrigger value="reports">报表中心</TabsTrigger>
          <TabsTrigger value="builder">报表构建器</TabsTrigger>
          <TabsTrigger value="predictions">���测分析</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">本周</SelectItem>
                <SelectItem value="month">本月</SelectItem>
                <SelectItem value="quarter">本季度</SelectItem>
                <SelectItem value="year">本年</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 销售趋势图 */}
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  销售趋势分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} name="实际销售" />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="目标销售"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 产品分类占比 */}
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-green-600" />
                  产品分类占比
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 财务概览 */}
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  财务概览
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={financeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" name="收入" />
                    <Area type="monotone" dataKey="cost" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="成本" />
                    <Area type="monotone" dataKey="profit" stackId="3" stroke="#ffc658" fill="#ffc658" name="利润" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 客户满意度雷达图 */}
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-orange-600" />
                  客户满意度分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={satisfactionData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="本月" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="上月" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{template.name}</h3>
                      <p className="text-sm text-slate-600">{template.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getTypeColor(template.type)}>{getTypeName(template.type)}</Badge>
                        {template.isCustom && <Badge variant="outline">自定义</Badge>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                      <p className="text-sm text-slate-600">最后更新: {template.lastUpdated.toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      查看
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder" className="space-y-4">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>拖拽式报表构建器</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">数据源</h3>
                  <div className="space-y-2">
                    {["销售数据", "客户数据", "财务数据", "库存数据"].map((source) => (
                      <div key={source} className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                        {source}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">图表类型</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: "柱状图", icon: BarChart3 },
                      { name: "折线图", icon: TrendingUp },
                      { name: "饼图", icon: PieChart },
                      { name: "雷达图", icon: Brain },
                    ].map((chart) => (
                      <div
                        key={chart.name}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50 text-center"
                      >
                        <chart.icon className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-sm">{chart.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">报表预览</h3>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg h-64 flex items-center justify-center">
                    <p className="text-slate-500">拖拽组件到此处构建报表</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-6">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  AI预测分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">销售预测</h4>
                    <p className="text-2xl font-bold text-blue-600 mt-2">↗ 15.2%</p>
                    <p className="text-sm text-blue-700">下月预计增长</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">客户增长</h4>
                    <p className="text-2xl font-bold text-green-600 mt-2">+234</p>
                    <p className="text-sm text-green-700">预计新增客户</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900">库存优化</h4>
                    <p className="text-2xl font-bold text-purple-600 mt-2">-8.5%</p>
                    <p className="text-sm text-purple-700">建议减少库存</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
