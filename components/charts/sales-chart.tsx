"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const salesData = [
  { month: "1月", sales: 186000, target: 200000 },
  { month: "2月", sales: 305000, target: 280000 },
  { month: "3月", sales: 237000, target: 250000 },
  { month: "4月", sales: 273000, target: 260000 },
  { month: "5月", sales: 209000, target: 240000 },
  { month: "6月", sales: 314000, target: 300000 },
]

export function SalesChart() {
  return (
    <ChartContainer
      config={{
        sales: {
          label: "实际销售",
          color: "hsl(var(--chart-1))",
        },
        target: {
          label: "销售目标",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="var(--color-sales)"
            strokeWidth={2}
            dot={{ fill: "var(--color-sales)" }}
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="var(--color-target)"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "var(--color-target)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
