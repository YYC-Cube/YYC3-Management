"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const financeData = [
  { category: "销售收入", income: 450000, expense: 0 },
  { category: "运营成本", income: 0, expense: 180000 },
  { category: "人力成本", income: 0, expense: 120000 },
  { category: "营销费用", income: 0, expense: 80000 },
  { category: "其他收入", income: 25000, expense: 0 },
]

export function FinanceChart() {
  return (
    <ChartContainer
      config={{
        income: {
          label: "收入",
          color: "hsl(var(--chart-1))",
        },
        expense: {
          label: "支出",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer>
        <BarChart data={financeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="income" fill="var(--color-income)" />
          <Bar dataKey="expense" fill="var(--color-expense)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
