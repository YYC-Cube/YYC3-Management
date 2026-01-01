/**
 * @fileoverview data-analytics.tsx
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
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
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, BarChart3, PieChartIcon, Activity, Download } from "lucide-react"

export function DataAnalytics({ showTitle = true }: { showTitle?: boolean }) {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedMetric, setSelectedMetric] = useState("sales")

  // 销售数据分析
  const salesData = [
    { month: "1月", sales: 2200000, orders: 156, customers: 89 },
    { month: "2月", sales: 2400000, orders: 178, customers: 95 },
    { month: "3月", sales: 2600000, orders: 189, customers: 102 },
    { month: "4月", sales: 2750000, orders: 201, customers: 108 },
    { month: "5月", sales: 2800000, orders: 195, customers: 112 },
    { month: "6月", sales: 2847392, orders: 203, customers: 118 },
  ]

  // 客户分析数据
  const customerData = [
    { segment: "新客户", count: 45, revenue: 680000, color: "#3b82f6" },
    { segment: "老客户", count: 73, revenue: 1567392, color: "#10b981" },
    { segment: "VIP客户", count: 12, revenue: 600000, color: "#f59e0b" },
  ]

  // 产品销售分析
  const productData = [
    { product: "沙发系列", sales: 1200000, quantity: 89, profit: 360000 },
    { product: "床具系列", sales: 850000, quantity: 67, profit: 255000 },
    { product: "餐桌系列", sales: 650000, quantity: 45, profit: 195000 },
    { product: "衣柜系列", sales: 147392, quantity: 12, profit: 44218 },
  ]

  // 地区销售分析
  const regionData = [
    { region: "华南", sales: 1200000, growth: 15.2 },
    { region: "华东", sales: 980000, growth: 12.8 },
    { region: "华北", sales: 667392, growth: 8.5 },
  ]

  // 员工绩效数据
  const performanceData = [
    { month: "1月", efficiency: 85, satisfaction: 4.1, training: 78 },
    { month: "2月", efficiency: 87, satisfaction: 4.2, training: 82 },
    { month: "3月", efficiency: 89, satisfaction: 4.0, training: 85 },
    { month: "4月", efficiency: 91, satisfaction: 4.3, training: 88 },
    { month: "5月", efficiency: 88, satisfaction: 4.1, training: 90 },
    { month: "6月", efficiency: 92, satisfaction: 4.2, training: 92 },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 - 统一风格 */}
      <div className="flex items-center justify-between">
        <div>
          {showTitle && (
            <h1 className="text-2xl font-bold text-gray-900">数据分析中心</h1>
          )}
          <p className="text-gray-600 mt-1">深度业务数据分析与洞察</p>
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
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-r-4 border-r-cyan-500 shadow-[4px_0_12px_rgba(6,182,212,0.15)]">
            <Download className="w-4 h-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      {/* 统计卡片区域 - 严格执行统一规范 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-r-[5px] border-r-cyan-500 hover:border-r-cyan-600 shadow-[4px_0_12px_rgba(6,182,212,0.15)] transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总收入</p>
                <p className="text-3xl font-bold text-cyan-600">¥2,847,392</p>
                <p className="text-xs text-gray-500 mt-1">+12.5% 较上月</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-blue-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">订单数量</p>
                <p className="text-3xl font-bold text-blue-600">203</p>
                <p className="text-xs text-gray-500 mt-1">+4.1% 较上月</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-blue-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">客户��量</p>
                <p className="text-3xl font-bold text-blue-600">118</p>
                <p className="text-xs text-gray-500 mt-1">+5.4% 较上月</p>
              </div>
              <PieChartIcon className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-purple-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均订单价值</p>
                <p className="text-3xl font-bold text-purple-600">¥14,025</p>
                <p className="text-xs text-gray-500 mt-1">+8.2% 较上月</p>
              </div>
              <Activity className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 详细分析 */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sales">销售分析</TabsTrigger>
          <TabsTrigger value="customer">客户分析</TabsTrigger>
          <TabsTrigger value="product">产品分析</TabsTrigger>
          <TabsTrigger value="region">地区分析</TabsTrigger>
          <TabsTrigger value="performance">绩效分析</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle>销售趋势分析</CardTitle>
                <CardDescription>近6个月销售收入变化</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`¥${(value ?? 0).toLocaleString()}`, "销售额"]} />
                    <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle>订单与客户趋势</CardTitle>
                <CardDescription>订单数量和客户数量变化</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="orders" stroke="#10b981" name="订单数量" />
                    <Line type="monotone" dataKey="customers" stroke="#f59e0b" name="客户数量" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>销售关键指标</CardTitle>
              <CardDescription>重要销售数据汇总</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">¥14,025</div>
                  <p className="text-sm text-muted-foreground">平均订单价值</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-800">+8.2%</Badge>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">1.72</div>
                  <p className="text-sm text-muted-foreground">日均订单数</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">+4.1%</Badge>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">24.1%</div>
                  <p className="text-sm text-muted-foreground">客户转化率</p>
                  <Badge className="mt-2 bg-purple-100 text-purple-800">+2.3%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle>客户分布分析</CardTitle>
                <CardDescription>不同客户群体的收入贡献</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="revenue"
                      label={({ name, value }) => `${name}: ¥${value.toLocaleString()}`}
                    >
                      {customerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `¥${(value ?? 0).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle>客户价值分析</CardTitle>
                <CardDescription>各客户群体详细数据</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerData.map((segment, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }}></div>
                        <div>
                          <p className="font-medium">{segment.segment}</p>
                          <p className="text-sm text-muted-foreground">{segment.count} 位客户</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">¥{segment.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          平均: ¥{Math.round(segment.revenue / segment.count).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="product" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>产品销售排行</CardTitle>
              <CardDescription>各产品系列销售表现</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={productData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="product" type="category" width={80} />
                  <Tooltip formatter={(value) => `¥${(value ?? 0).toLocaleString()}`} />
                  <Bar dataKey="sales" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {productData.map((product, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{product.product}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">销售额</span>
                      <span className="font-medium">¥{product.sales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">销量</span>
                      <span className="font-medium">{product.quantity} 件</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">利润</span>
                      <span className="font-medium text-green-600">¥{product.profit.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="region" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>地区销售分析</CardTitle>
              <CardDescription>各地区销售业绩和增长情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionData.map((region, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 border border-sky-200 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      <h4 className="font-medium">{region.region}</h4>
                      <p className="text-sm text-muted-foreground">销售区域</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">¥{region.sales.toLocaleString()}</p>
                      <div className="flex items-center text-sm text-green-600">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>+{region.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>员工绩效趋势</CardTitle>
              <CardDescription>工作效率、满意度和培训完成度</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" name="工作效率" />
                  <Line type="monotone" dataKey="satisfaction" stroke="#10b981" name="满意度" />
                  <Line type="monotone" dataKey="training" stroke="#f59e0b" name="培训完成度" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
