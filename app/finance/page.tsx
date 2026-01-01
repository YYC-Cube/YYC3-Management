"use client"

import { PageContainer } from "@/components/layout/page-container"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { FinanceChart } from "@/components/charts/finance-chart"
import { DollarSign, TrendingUp, TrendingDown, Wallet, Receipt, Plus } from "lucide-react"

export default function FinancePage() {
  return (
    <PageContainer title="财务管理" description="管理企业财务收支和预算">
      <div className="space-y-6">
        {/* 页面操作区 */}
        <div className="flex items-center justify-between">
          <div></div>
          <div className="flex gap-2">
            <EnhancedButton variant="outline">
              <Receipt className="w-4 h-4 mr-2" />
              生成报表
            </EnhancedButton>
            <EnhancedButton className="bg-emerald-600 hover:bg-emerald-700 border-r-4 border-r-emerald-500 shadow-[4px_0_12px_rgba(16,185,129,0.15)]">
              <Plus className="w-4 h-4 mr-2 text-white" />
              新增记录
            </EnhancedButton>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedCard className="border-r-[5px] border-r-emerald-500 shadow-[4px_0_12px_rgba(16,185,129,0.15)] hover:border-r-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">总收入</p>
                <p className="text-2xl font-bold text-slate-800">¥2,456,789</p>
                <p className="text-xs text-emerald-600 mt-1">↑ 12% 较上月</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-emerald-500 shadow-[4px_0_12px_rgba(16,185,129,0.15)] hover:border-r-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">总支出</p>
                <p className="text-2xl font-bold text-slate-800">¥1,234,567</p>
                <p className="text-xs text-red-600 mt-1">↑ 8% 较上月</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-emerald-500 shadow-[4px_0_12px_rgba(16,185,129,0.15)] hover:border-r-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">净利润</p>
                <p className="text-2xl font-bold text-slate-800">¥1,222,222</p>
                <p className="text-xs text-emerald-600 mt-1">↑ 15% 较上月</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-emerald-500 shadow-[4px_0_12px_rgba(16,185,129,0.15)] hover:border-r-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">账户余额</p>
                <p className="text-2xl font-bold text-slate-800">¥3,456,789</p>
                <p className="text-xs text-emerald-600 mt-1">可用资金</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* 财务图表 */}
        <EnhancedCard className="border-r-[5px] border-r-emerald-500 shadow-[4px_0_12px_rgba(16,185,129,0.15)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">收支趋势</h2>
            <div className="flex gap-2">
              <EnhancedButton variant="outline" size="sm">
                月度
              </EnhancedButton>
              <EnhancedButton variant="outline" size="sm">
                季度
              </EnhancedButton>
              <EnhancedButton variant="outline" size="sm">
                年度
              </EnhancedButton>
            </div>
          </div>
          <FinanceChart />
        </EnhancedCard>

        {/* 最近交易 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnhancedCard className="border-r-[5px] border-r-emerald-500 shadow-[4px_0_12px_rgba(16,185,129,0.15)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">最近收入</h2>
              <EnhancedButton variant="outline" size="sm">
                查看全部
              </EnhancedButton>
            </div>
            <div className="space-y-3">
              {[
                { description: "产品销售收入", amount: "+¥45,600", date: "2024-01-15", type: "销售" },
                { description: "服务费收入", amount: "+¥12,300", date: "2024-01-14", type: "服务" },
                { description: "投资收益", amount: "+¥8,900", date: "2024-01-13", type: "投资" },
                { description: "其他收入", amount: "+¥3,200", date: "2024-01-12", type: "其他" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{item.description}</p>
                      <p className="text-sm text-slate-600">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{item.amount}</p>
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </EnhancedCard>

          <EnhancedCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">最近支出</h2>
              <EnhancedButton variant="outline" size="sm">
                查看全部
              </EnhancedButton>
            </div>
            <div className="space-y-3">
              {[
                { description: "办公用品采购", amount: "-¥5,600", date: "2024-01-15", type: "采购" },
                { description: "员工工资", amount: "-¥89,000", date: "2024-01-14", type: "人力" },
                { description: "租金费用", amount: "-¥15,000", date: "2024-01-13", type: "租金" },
                { description: "营销推广", amount: "-¥12,300", date: "2024-01-12", type: "营销" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{item.description}</p>
                      <p className="text-sm text-slate-600">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">{item.amount}</p>
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </EnhancedCard>
        </div>

        {/* 预算概览 */}
        <EnhancedCard>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">预算执行情况</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { category: "营销费用", budget: 50000, spent: 32000, percentage: 64 },
              { category: "人力成本", budget: 200000, spent: 180000, percentage: 90 },
              { category: "运营费用", budget: 80000, spent: 45000, percentage: 56 },
            ].map((item, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-800">{item.category}</h3>
                  <Badge
                    variant={item.percentage > 80 ? "destructive" : item.percentage > 60 ? "secondary" : "default"}
                  >
                    {item.percentage}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">已用: ¥{item.spent.toLocaleString()}</span>
                    <span className="text-slate-600">预算: ¥{item.budget.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.percentage > 80 ? "bg-red-500" : item.percentage > 60 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </EnhancedCard>
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
