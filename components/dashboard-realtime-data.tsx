/**
 * @fileoverview dashboard-realtime-data.tsx
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, ShoppingCart, DollarSign, Eye } from "lucide-react"

interface ChartData {
  name: string
  value: number
  revenue?: number
  orders?: number
  customers?: number
  growth?: number
  [key: string]: any
}

export function DashboardRealtimeData() {
  const [activeTab, setActiveTab] = useState("overview")
  const [realtimeData, setRealtimeData] = useState<ChartData[]>([])
  const [salesData, setSalesData] = useState<ChartData[]>([])
  const [customerData, setCustomerData] = useState<ChartData[]>([])
  const [categoryData, setCategoryData] = useState<ChartData[]>([])

  // 模拟实时数据更新
  useEffect(() => {
    const generateRealtimeData = () => {
      const now = new Date()
      const data = []
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000)
        data.push({
          name: time.getHours().toString().padStart(2, "0") + ":00",
          value: Math.floor(Math.random() * 100) + 50,
          revenue: Math.floor(Math.random() * 50000) + 10000,
          orders: Math.floor(Math.random() * 20) + 5,
          customers: Math.floor(Math.random() * 30) + 10,
        })
      }
      return data
    }

    const generateSalesData = () => {
      const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
      return months.map((month) => ({
        name: month,
        value: Math.floor(Math.random() * 800000) + 200000,
        growth: (Math.random() - 0.5) * 40,
      }))
    }

    const generateCustomerData = () => {
      const weeks = ["第1周", "第2周", "第3周", "第4周"]
      return weeks.map((week) => ({
        name: week,
        value: Math.floor(Math.random() * 200) + 50,
        growth: (Math.random() - 0.3) * 30,
      }))
    }

    const generateCategoryData = () => {
      return [
        { name: "沙发", value: 35, revenue: 450000 },
        { name: "餐桌", value: 25, revenue: 320000 },
        { name: "床具", value: 20, revenue: 280000 },
        { name: "储物", value: 12, revenue: 150000 },
        { name: "其他", value: 8, revenue: 100000 },
      ]
    }

    setRealtimeData(generateRealtimeData())
    setSalesData(generateSalesData())
    setCustomerData(generateCustomerData())
    setCategoryData(generateCategoryData())

    // 每30秒更新一次实时数据
    const interval = setInterval(() => {
      setRealtimeData(generateRealtimeData())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ ['--entry-color' as any]: entry.color, color: 'var(--entry-color)' } as React.CSSProperties}>
              {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          实时数据分析
        </CardTitle>
        <CardDescription>业务关键指标实时监控</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="sales">销售</TabsTrigger>
            <TabsTrigger value="customers">客户</TabsTrigger>
            <TabsTrigger value="categories">分类</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">今日访问</p>
                    <p className="text-2xl font-bold text-blue-900">2,847</p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+12.5%</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">今日订单</p>
                    <p className="text-2xl font-bold text-green-900">156</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-green-500" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+8.3%</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">今日收入</p>
                    <p className="text-2xl font-bold text-orange-900">¥28.9万</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-orange-500" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+15.7%</span>
                </div>
              </div>
            </div>

            <div className="h-80 min-w-0">
              <ResponsiveContainer>
                <AreaChart data={realtimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.3}
                    name="访问量"
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                    name="订单数"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <div className="h-80 min-w-0">
              <ResponsiveContainer>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="value" fill="#0ea5e9" name="销售额(元)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {salesData.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">¥{(item.value / 10000).toFixed(1)}万</span>
                    <Badge variant={item.growth && item.growth > 0 ? "default" : "secondary"}>
                      {item.growth && item.growth > 0 ? "+" : ""}
                      {item.growth?.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <div className="h-80 min-w-0">
              <ResponsiveContainer>
                <LineChart data={customerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} name="新增客户" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">客户增长趋势</h4>
              {customerData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={(item.value / 250) * 100} className="w-20" />
                    <span className="text-sm w-12">{item.value}</span>
                    {item.growth && (
                      <Badge variant={item.growth > 0 ? "default" : "secondary"} className="text-xs">
                        {item.growth > 0 ? "+" : ""}
                        {item.growth.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 min-w-0">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">分类详情</h4>
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ ['--category-color' as any]: COLORS[index % COLORS.length], backgroundColor: 'var(--category-color)' } as React.CSSProperties}
                      ></div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">¥{(item.revenue! / 10000).toFixed(1)}万</div>
                      <div className="text-xs text-gray-500">{item.value}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
