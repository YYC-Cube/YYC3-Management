"use client"

import { PageContainer } from "@/components/layout/page-container"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PerformanceChart } from "@/components/charts/performance-chart"
import { PerformanceOptimization } from "@/components/performance-optimization"
import { TrendingUp, Target, Award, Users, BarChart3, Star, Plus } from "lucide-react"

export default function PerformancePage() {
  return (
    <PageContainer title="绩效管理" description="员工绩效评估和跟踪管理">
      <PerformanceOptimization />
      <div className="space-y-6">
        {/* 页面操作区 */}
        <div className="flex items-center justify-end">
          <div className="flex gap-2">
            <EnhancedButton variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              生成报告
            </EnhancedButton>
            <EnhancedButton className="bg-sky-600 hover:bg-sky-700">
              <Plus className="w-4 h-4 mr-2" />
              新建评估
            </EnhancedButton>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedCard className="border-r-[5px] border-r-sky-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">平均绩效</p>
                <p className="text-2xl font-bold text-slate-800">4.2</p>
                <p className="text-xs text-sky-600 mt-1">满分5.0</p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-sky-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">优秀员工</p>
                <p className="text-2xl font-bold text-slate-800">12</p>
                <p className="text-xs text-green-600 mt-1">绩效≥4.5</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-yellow-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">目标达成率</p>
                <p className="text-2xl font-bold text-slate-800">87%</p>
                <p className="text-xs text-yellow-600 mt-1">本季度</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">参评人数</p>
                <p className="text-2xl font-bold text-slate-800">45</p>
                <p className="text-xs text-purple-600 mt-1">本期评估</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* 绩效图表 */}
        <EnhancedCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">绩效趋势分析</h2>
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
          <PerformanceChart />
        </EnhancedCard>

        {/* 员工绩效排名 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnhancedCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">绩效排行榜</h2>
              <EnhancedButton variant="outline" size="sm">
                查看全部
              </EnhancedButton>
            </div>
            <div className="space-y-3">
              {[
                { name: "张三", department: "产品部", score: 4.8, rank: 1, change: "↑2" },
                { name: "李四", department: "技术部", score: 4.7, rank: 2, change: "↑1" },
                { name: "王五", department: "销售部", score: 4.6, rank: 3, change: "→" },
                { name: "赵六", department: "市场部", score: 4.5, rank: 4, change: "↓1" },
                { name: "钱七", department: "运营部", score: 4.4, rank: 5, change: "↑3" },
              ].map((employee, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                        employee.rank === 1
                          ? "bg-yellow-500"
                          : employee.rank === 2
                            ? "bg-gray-400"
                            : employee.rank === 3
                              ? "bg-orange-500"
                              : "bg-slate-400"
                      }`}
                    >
                      {employee.rank}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{employee.name}</p>
                      <p className="text-sm text-slate-600">{employee.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium text-slate-800">{employee.score}</p>
                      <p className="text-xs text-slate-600">绩效分</p>
                    </div>
                    <Badge
                      variant={
                        employee.change.includes("↑")
                          ? "default"
                          : employee.change.includes("↓")
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {employee.change}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </EnhancedCard>

          <EnhancedCard>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">部门绩效对比</h3>
            <div className="space-y-4">
              {[
                { department: "产品部", avgScore: 4.5, employees: 8, target: 4.3 },
                { department: "技术部", avgScore: 4.3, employees: 12, target: 4.2 },
                { department: "销售部", avgScore: 4.2, employees: 10, target: 4.0 },
                { department: "市场部", avgScore: 4.0, employees: 6, target: 3.8 },
                { department: "运营部", avgScore: 3.9, employees: 9, target: 3.7 },
              ].map((dept, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-slate-800">{dept.department}</h4>
                      <p className="text-sm text-slate-600">{dept.employees}人</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-800">{dept.avgScore}</p>
                      <p className="text-xs text-slate-600">平均分</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">目标: {dept.target}</span>
                      <span
                        className={`font-medium ${dept.avgScore >= dept.target ? "text-green-600" : "text-red-600"}`}
                      >
                        {dept.avgScore >= dept.target ? "已达成" : "未达成"}
                      </span>
                    </div>
                    <Progress value={(dept.avgScore / 5) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </EnhancedCard>
        </div>

        {/* 绩效分析 */}
        <EnhancedCard>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">绩效分布分析</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { level: "优秀", range: "4.5-5.0", count: 12, percentage: 27, color: "bg-green-500" },
              { level: "良好", range: "4.0-4.4", count: 18, percentage: 40, color: "bg-blue-500" },
              { level: "合格", range: "3.5-3.9", count: 10, percentage: 22, color: "bg-yellow-500" },
              { level: "待改进", range: "3.0-3.4", count: 4, percentage: 9, color: "bg-orange-500" },
              { level: "不合格", range: "< 3.0", count: 1, percentage: 2, color: "bg-red-500" },
            ].map((level, index) => (
              <div key={index} className="text-center p-4 border border-slate-200 rounded-lg">
                <div className={`w-16 h-16 ${level.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-medium text-slate-800 mb-1">{level.level}</h4>
                <p className="text-sm text-slate-600 mb-2">{level.range}</p>
                <p className="text-2xl font-bold text-slate-800">{level.count}</p>
                <p className="text-xs text-slate-600">{level.percentage}%</p>
              </div>
            ))}
          </div>
        </EnhancedCard>
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
