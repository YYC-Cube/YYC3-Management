/**
 * @fileoverview statistics-dashboard.tsx
 * @description 统计仪表板组件
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomLineChart, CustomBarChart, CustomPieChart, CustomAreaChart } from "@/components/ui/charts"
import { TrendingUp, Users, Briefcase, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { useMemo } from "react"

interface StatisticsDashboardProps {
  userGrowthData?: { name: string; value: number }[]
  taskCompletionData?: { name: string; value: number }[]
  projectStatusData?: { name: string; value: number; color: string }[]
  userActivityData?: { name: string; value: number }[]
  stats?: {
    totalUsers?: number
    activeUsers?: number
    totalProjects?: number
    completedProjects?: number
    totalTasks?: number
    completedTasks?: number
    pendingTasks?: number
  }
}

export function StatisticsDashboard({
  userGrowthData,
  taskCompletionData,
  projectStatusData,
  userActivityData,
  stats,
}: StatisticsDashboardProps) {
  const defaultUserGrowthData = useMemo(() => [
    { name: "1月", value: 120 },
    { name: "2月", value: 150 },
    { name: "3月", value: 180 },
    { name: "4月", value: 220 },
    { name: "5月", value: 280 },
    { name: "6月", value: 350 },
  ], [])

  const defaultTaskCompletionData = useMemo(() => [
    { name: "1月", value: 45 },
    { name: "2月", value: 52 },
    { name: "3月", value: 48 },
    { name: "4月", value: 61 },
    { name: "5月", value: 55 },
    { name: "6月", value: 67 },
  ], [])

  const defaultProjectStatusData = useMemo(() => [
    { name: "进行中", value: 5, color: "#3b82f6" },
    { name: "已完成", value: 12, color: "#10b981" },
    { name: "规划中", value: 3, color: "#f59e0b" },
    { name: "暂停", value: 1, color: "#ef4444" },
  ], [])

  const defaultUserActivityData = useMemo(() => [
    { name: "周一", value: 45 },
    { name: "周二", value: 52 },
    { name: "周三", value: 48 },
    { name: "周四", value: 61 },
    { name: "周五", value: 55 },
    { name: "周六", value: 28 },
    { name: "周日", value: 32 },
  ], [])

  const defaultStats = useMemo(() => ({
    totalUsers: 350,
    activeUsers: 280,
    totalProjects: 21,
    completedProjects: 12,
    totalTasks: 156,
    completedTasks: 89,
    pendingTasks: 45,
  }), [])

  const finalUserGrowthData = userGrowthData ?? defaultUserGrowthData
  const finalTaskCompletionData = taskCompletionData ?? defaultTaskCompletionData
  const finalProjectStatusData = projectStatusData ?? defaultProjectStatusData
  const finalUserActivityData = userActivityData ?? defaultUserActivityData
  const finalStats = stats ?? defaultStats
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(59,130,246,0.15)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">总用户数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900">{finalStats.totalUsers}</p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+12.5%</span>
                  <span className="text-slate-500 ml-1">较上月</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(16,185,129,0.15)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">活跃用户</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900">{finalStats.activeUsers}</p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+8.3%</span>
                  <span className="text-slate-500 ml-1">较上月</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(249,115,22,0.15)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">项目总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900">{finalStats.totalProjects}</p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+15.2%</span>
                  <span className="text-slate-500 ml-1">较上月</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(139,92,246,0.15)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">任务完成率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {finalStats.totalTasks > 0 ? Math.round((finalStats.completedTasks / finalStats.totalTasks) * 100) : 0}%
                </p>
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+5.7%</span>
                  <span className="text-slate-500 ml-1">较上月</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>用户增长趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomLineChart data={finalUserGrowthData} height={300} color="#3b82f6" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>任务完成情况</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomBarChart data={finalTaskCompletionData} height={300} color="#10b981" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>项目状态分布</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomPieChart data={finalProjectStatusData} height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>用户活跃度</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomAreaChart data={finalUserActivityData} height={300} color="#8b5cf6" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>任务统计概览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-700">{finalStats.completedTasks}</p>
              <p className="text-sm text-green-600 mt-2">已完成任务</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-orange-700">{finalStats.pendingTasks}</p>
              <p className="text-sm text-orange-600 mt-2">进行中任务</p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-700">
                {finalStats.totalTasks - finalStats.completedTasks - finalStats.pendingTasks}
              </p>
              <p className="text-sm text-red-600 mt-2">逾期任务</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
