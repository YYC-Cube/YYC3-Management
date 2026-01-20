"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { useMemo } from "react"

export function OKRAnalyticsCharts() {
  const departmentProgress = useMemo(() => [
    { department: "技术部", progress: 72, target: 80, okrCount: 5 },
    { department: "销售部", progress: 85, target: 80, okrCount: 4 },
    { department: "客服部", progress: 78, target: 80, okrCount: 3 },
    { department: "市场部", progress: 65, target: 80, okrCount: 3 },
    { department: "财务部", progress: 90, target: 80, okrCount: 2 },
  ], [])

  const quarterlyTrend = useMemo(() => [
    { quarter: "2024-Q3", completed: 12, inProgress: 8, atRisk: 3 },
    { quarter: "2024-Q4", completed: 15, inProgress: 6, atRisk: 2 },
    { quarter: "2025-Q1", completed: 18, inProgress: 7, atRisk: 1 },
    { quarter: "2025-Q2", completed: 14, inProgress: 9, atRisk: 2 },
  ], [])

  const priorityDistribution = useMemo(() => [
    { name: "高优先级", value: 8, color: "#ef4444" },
    { name: "中优先级", value: 12, color: "#f59e0b" },
    { name: "低优先级", value: 5, color: "#22c55e" },
  ], [])

  const teamPerformance = useMemo(() => [
    { member: "张经理", efficiency: 85, quality: 90, collaboration: 88 },
    { member: "李工程师", efficiency: 78, quality: 85, collaboration: 82 },
    { member: "王主管", efficiency: 92, quality: 88, collaboration: 95 },
    { member: "陈专员", efficiency: 70, quality: 75, collaboration: 80 },
  ], [])

  const milestoneCompletion = useMemo(() => [
    { month: "1月", planned: 20, completed: 18 },
    { month: "2月", planned: 25, completed: 23 },
    { month: "3月", planned: 30, completed: 28 },
    { month: "4月", planned: 22, completed: 20 },
    { month: "5月", planned: 28, completed: 26 },
    { month: "6月", planned: 24, completed: 22 },
  ], [])

  return (
    <div className="space-y-6">
      {/* 第一行：部门进度和季度趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-sky-800">部门OKR完成情况</CardTitle>
            <CardDescription>各部门目标达成率对比分析</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                progress: {
                  label: "完成率",
                  color: "hsl(var(--chart-1))",
                },
                target: {
                  label: "目标值",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-80"
            >
              <ResponsiveContainer>
                <BarChart data={departmentProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="department" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="progress" fill="url(#progressGradient)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" fill="url(#targetGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                    <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-sky-800">季度OKR趋势</CardTitle>
            <CardDescription>目标完成状态的时间趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                completed: {
                  label: "已完成",
                  color: "hsl(var(--chart-1))",
                },
                inProgress: {
                  label: "进行中",
                  color: "hsl(var(--chart-2))",
                },
                atRisk: {
                  label: "有风险",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-80"
            >
              <ResponsiveContainer>
                <AreaChart data={quarterlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="quarter" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stackId="1"
                    stroke="#10b981"
                    fill="url(#completedGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="inProgress"
                    stackId="1"
                    stroke="#0ea5e9"
                    fill="url(#inProgressGradient)"
                  />
                  <Area type="monotone" dataKey="atRisk" stackId="1" stroke="#ef4444" fill="url(#atRiskGradient)" />
                  <defs>
                    <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="inProgressGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="atRiskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* 第二行：优先级分布和团队表现 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-sky-800">OKR优先级分布</CardTitle>
            <CardDescription>目标优先级的分布情况</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "数量",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-80"
            >
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={priorityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {priorityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-sky-800">团队成员表现雷达图</CardTitle>
            <CardDescription>多维度评估团队成员能力</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                efficiency: {
                  label: "执行效率",
                  color: "hsl(var(--chart-1))",
                },
                quality: {
                  label: "质量水平",
                  color: "hsl(var(--chart-2))",
                },
                collaboration: {
                  label: "协作能力",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-80"
            >
              <ResponsiveContainer>
                <RadarChart data={teamPerformance}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="member" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} />
                  <Radar
                    name="执行效率"
                    dataKey="efficiency"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="质量水平"
                    dataKey="quality"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="协作能力"
                    dataKey="collaboration"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* 第三行：里程碑完成情况 */}
      <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-sky-800">里程碑完成趋势</CardTitle>
          <CardDescription>计划与实际完成里程碑对比</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              planned: {
                label: "计划完成",
                color: "hsl(var(--chart-1))",
              },
              completed: {
                label: "实际完成",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-80"
          >
            <ResponsiveContainer>
              <LineChart data={milestoneCompletion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="planned"
                  stroke="#94a3b8"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ fill: "#94a3b8", strokeWidth: 2, r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="url(#completedLineGradient)"
                  strokeWidth={3}
                  dot={{ fill: "#0ea5e9", strokeWidth: 2, r: 6 }}
                />
                <defs>
                  <linearGradient id="completedLineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
