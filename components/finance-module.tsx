/**
 * @fileoverview finance-module.tsx
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
import { EnhancedProgress } from "@/components/ui/enhanced-progress"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PieChart,
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Download,
  Upload,
} from "lucide-react"

export function FinanceModule() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // 财务数据
  const financeData = {
    revenue: 2847392,
    expenses: 1856234,
    profit: 991158,
    growth: 12.5,
    budgetUsage: 78.5,
    cashFlow: 1234567,
  }

  const budgetCategories = [
    { name: "人力成本", budget: 500000, spent: 420000, percentage: 84 },
    { name: "运营费用", budget: 300000, spent: 245000, percentage: 82 },
    { name: "市场推广", budget: 200000, spent: 156000, percentage: 78 },
    { name: "技术投入", budget: 150000, spent: 98000, percentage: 65 },
    { name: "办公费用", budget: 100000, spent: 67000, percentage: 67 },
  ]

  const recentTransactions = [
    {
      id: "1",
      type: "income",
      description: "客户付款 - 华润集团",
      amount: 150000,
      date: "2025-06-20",
      status: "completed",
    },
    {
      id: "2",
      type: "expense",
      description: "办公用品采购",
      amount: 3500,
      date: "2025-06-19",
      status: "pending",
    },
    {
      id: "3",
      type: "income",
      description: "服务费收入 - 万科地产",
      amount: 85000,
      date: "2025-06-18",
      status: "completed",
    },
    {
      id: "4",
      type: "expense",
      description: "员工工资发放",
      amount: 280000,
      date: "2025-06-15",
      status: "completed",
    },
  ]

  const getTransactionIcon = (type: string) => {
    return type === "income" ? (
      <TrendingUp className="w-4 h-4 text-emerald-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">已完成</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">待处理</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 border-red-200">失败</Badge>
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">财务管理</h1>
          <p className="text-slate-600 mt-1">企业财务数据分析与管理</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-sky-200 text-sky-700 hover:bg-sky-50">
            <Download className="w-4 h-4 mr-2" />
            导出报表
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-r-4 border-r-emerald-500 shadow-[4px_0_12px_rgba(16,185,129,0.15)]">
            <Plus className="w-4 h-4 mr-2" />
            新增记录
          </Button>
        </div>
      </div>

      {/* 财务概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-r-[5px] border-r-emerald-500 hover:border-r-emerald-600 shadow-[4px_0_12px_rgba(16,185,129,0.15)] transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">总收入</p>
                <p className="text-3xl font-bold text-emerald-600">¥{financeData.revenue.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 mt-1">+{financeData.growth}% vs 上月</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-emerald-500 hover:border-r-emerald-600 shadow-[4px_0_12px_rgba(16,185,129,0.15)] transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">总支出</p>
                <p className="text-3xl font-bold text-red-600">¥{financeData.expenses.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">运营成本</p>
              </div>
              <CreditCard className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-sky-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">净利润</p>
                <p className="text-3xl font-bold text-sky-600">¥{financeData.profit.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">利润率 34.8%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-sky-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-purple-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">现金流</p>
                <p className="text-3xl font-bold text-purple-600">¥{financeData.cashFlow.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">可用资金</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容区域 */}
      <div className="border-t-4 border-t-sky-400 pt-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">财务概览</TabsTrigger>
            <TabsTrigger value="budget">预算管理</TabsTrigger>
            <TabsTrigger value="transactions">交易记录</TabsTrigger>
            <TabsTrigger value="reports">财务报表</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-t-4 border-t-sky-400">
                <CardHeader>
                  <CardTitle className="text-slate-800">收支趋势</CardTitle>
                  <CardDescription>近6个月收支变化趋势</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-slate-500">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4 text-sky-300" />
                      <p className="text-lg font-medium">收支趋势图表</p>
                      <p className="text-sm">财务数据可视化分析</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-sky-400">
                <CardHeader>
                  <CardTitle className="text-slate-800">支出分布</CardTitle>
                  <CardDescription>各类别支出占比分析</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-slate-500">
                    <div className="text-center">
                      <PieChart className="w-16 h-16 mx-auto mb-4 text-sky-300" />
                      <p className="text-lg font-medium">支出分布图表</p>
                      <p className="text-sm">成本结构分析</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <Card className="border-t-4 border-t-sky-400">
              <CardHeader>
                <CardTitle className="text-slate-800">预算执行情况</CardTitle>
                <CardDescription>各部门预算使用情况监控</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {budgetCategories.map((category, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-slate-800">{category.name}</h4>
                          <p className="text-sm text-slate-600">
                            已使用 ¥{category.spent.toLocaleString()} / 预算 ¥{category.budget.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-slate-800">{category.percentage}%</span>
                          <div className="flex items-center mt-1">
                            {category.percentage > 90 && <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />}
                            {category.percentage <= 90 && category.percentage > 80 && (
                              <Clock className="w-4 h-4 text-amber-500 mr-1" />
                            )}
                            {category.percentage <= 80 && <CheckCircle className="w-4 h-4 text-emerald-500 mr-1" />}
                          </div>
                        </div>
                      </div>
                      <EnhancedProgress
                        value={category.percentage}
                        status={
                          category.percentage > 90 ? "critical" : category.percentage > 80 ? "warning" : "excellent"
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="border-t-4 border-t-sky-400">
              <CardHeader>
                <CardTitle className="text-slate-800">最近交易记录</CardTitle>
                <CardDescription>最新的收支交易明细</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-sky-200 rounded-lg bg-sky-50/30"
                    >
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <h4 className="font-medium text-slate-800">{transaction.description}</h4>
                          <p className="text-sm text-slate-600">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              transaction.type === "income" ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}¥{transaction.amount.toLocaleString()}
                          </p>
                        </div>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="border-t-4 border-t-sky-400">
              <CardHeader>
                <CardTitle className="text-slate-800">财务报表</CardTitle>
                <CardDescription>生成和下载各类财务报表</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex-col border-sky-200 hover:bg-sky-50">
                    <FileText className="w-6 h-6 mb-2 text-sky-600" />
                    <span className="text-sm text-slate-700">损益表</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col border-sky-200 hover:bg-sky-50">
                    <BarChart3 className="w-6 h-6 mb-2 text-sky-600" />
                    <span className="text-sm text-slate-700">资产负债表</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col border-sky-200 hover:bg-sky-50">
                    <TrendingUp className="w-6 h-6 mb-2 text-sky-600" />
                    <span className="text-sm text-slate-700">现金流量表</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col border-sky-200 hover:bg-sky-50">
                    <PieChart className="w-6 h-6 mb-2 text-sky-600" />
                    <span className="text-sm text-slate-700">成本分析报告</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col border-sky-200 hover:bg-sky-50">
                    <DollarSign className="w-6 h-6 mb-2 text-sky-600" />
                    <span className="text-sm text-slate-700">预算执行报告</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col border-sky-200 hover:bg-sky-50">
                    <Upload className="w-6 h-6 mb-2 text-sky-600" />
                    <span className="text-sm text-slate-700">自定义报表</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
