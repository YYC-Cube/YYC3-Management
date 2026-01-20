"use client"

import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const performanceData = [
  { week: "第1周", performance: 85, efficiency: 78 },
  { week: "第2周", performance: 88, efficiency: 82 },
  { week: "第3周", performance: 92, efficiency: 85 },
  { week: "第4周", performance: 89, efficiency: 88 },
]

export function PerformanceChart() {
  return (
    <ChartContainer
      config={{
        performance: {
          label: "绩效指标",
          color: "hsl(var(--chart-1))",
        },
        efficiency: {
          label: "效率指标",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer>
        <AreaChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="performance"
            stackId="1"
            stroke="var(--color-performance)"
            fill="var(--color-performance)"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="efficiency"
            stackId="2"
            stroke="var(--color-efficiency)"
            fill="var(--color-efficiency)"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
