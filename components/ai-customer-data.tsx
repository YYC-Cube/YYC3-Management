/**
 * @fileoverview ai-customer-data.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Settings,
  Download,
  Share,
  RefreshCw,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Star,
  ArrowUpRight,
  MessageSquare,
  DollarSign,
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function AiCustomerData() {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")

  // 页面跳转函数
  const handleNavigation = (path: string) => {
    router.push(path)
  }

  // 刷新数据函数
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  // 导出数据函数
  const handleExport = (type: string) => {
    console.log(`导出${type}数据`)
  }

  // 分享数据函数
  const handleShare = (type: string) => {
    console.log(`分享${type}数据`)
  }

  const customerStages = [
    {
      name: "潜在客户期",
      count: 342,
      percentage: 42,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      name: "意向客户期",
      count: 285,
      percentage: 35,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      name: "准备成交期",
      count: 187,
      percentage: 23,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
  ]

  const aiInsights = [
    {
      type: "opportunity",
      title: "高价值客户机会",
      description: "检测到3个高价值客户，建议优先跟进",
      priority: "high",
      action: "立即跟进",
      icon: Target,
      color: "green",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
    },
    {
      type: "warning",
      title: "客户流失风险",
      description: "客户 #A203 决策周期已达45天，超均值120%",
      priority: "medium",
      action: "发送礼包",
      icon: AlertTriangle,
      color: "amber",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
    },
    {
      type: "prediction",
      title: "转化预测",
      description: "下月预计新增成交客户15个，转化率提升8%",
      priority: "info",
      action: "查看详情",
      icon: TrendingUp,
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
    },
    {
      type: "optimization",
      title: "流程优化建议",
      description: "客户跟进效率可提升25%，建议调整沟通策略",
      priority: "low",
      action: "优化流程",
      icon: Star,
      color: "purple",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
    },
  ]

  const recentActivities = [
    {
      id: "1",
      type: "conversion",
      customer: "华润集团",
      action: "成功转化",
      value: "¥2,847,000",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: "success",
    },
    {
      id: "2",
      type: "follow-up",
      customer: "万科地产",
      action: "AI推送方案",
      value: "3D设计方案",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: "info",
    },
    {
      id: "3",
      type: "warning",
      customer: "恒大集团",
      action: "风险预警",
      value: "45天无互动",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: "warning",
    },
    {
      id: "4",
      type: "opportunity",
      customer: "碧桂园",
      action: "商机识别",
      value: "高价值客户",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "success",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "conversion":
        return <CheckCircle className="w-4 h-4" />
      case "follow-up":
        return <MessageSquare className="w-4 h-4" />
      case "warning":
        return <AlertTriangle className="w-4 h-4" />
      case "opportunity":
        return <Target className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100"
      case "warning":
        return "text-amber-600 bg-amber-100"
      case "info":
        return "text-blue-600 bg-blue-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            刷新数据
          </Button>
          <Button variant="outline" onClick={() => handleExport("customer")} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出报告
          </Button>
          <Button variant="outline" onClick={() => handleShare("customer")} className="flex items-center gap-2">
            <Share className="w-4 h-4" />
            分享数据
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1" />
            筛选
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleNavigation("/settings")}>
            <Settings className="w-4 h-4 mr-1" />
            设置
          </Button>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 总客户数 */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 via-white to-purple-50/30 shadow-lg hover:shadow-xl transition-all duration-500 group border-r-[5px] border-r-purple-400 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">总客户数</p>
                <p className="text-3xl font-bold text-purple-600">15,847</p>
                <p className="text-xs text-slate-500 mt-1">活跃客户</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl border border-purple-200/50 shadow-sm">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">+8.2%</span>
                </div>
                <span className="text-xs text-slate-500">较上月</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 转化率 */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 via-white to-purple-50/30 shadow-lg hover:shadow-xl transition-all duration-500 group border-r-[5px] border-r-purple-400 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">转化率</p>
                <p className="text-3xl font-bold text-purple-600">23.5%</p>
                <p className="text-xs text-slate-500 mt-1">月度转化</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl border border-purple-200/50 shadow-sm">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: "78%" }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">目标: 30%</p>
            </div>
          </CardContent>
        </Card>

        {/* 平均客单价 */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 via-white to-purple-50/30 shadow-lg hover:shadow-xl transition-all duration-500 group border-r-[5px] border-r-purple-400 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">平均客单价</p>
                <p className="text-3xl font-bold text-purple-600">¥89,247</p>
                <p className="text-xs text-slate-500 mt-1">单笔成交</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl border border-purple-200/50 shadow-sm">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">+12.8%</span>
                </div>
                <span className="text-xs text-slate-500">较上月</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI预测准确率 */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 via-white to-purple-50/30 shadow-lg hover:shadow-xl transition-all duration-500 group border-r-[5px] border-r-purple-400 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">AI预测准确率</p>
                <p className="text-3xl font-bold text-purple-600">94.2%</p>
                <p className="text-xs text-slate-500 mt-1">智能分析</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl border border-purple-200/50 shadow-sm">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: "94%" }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">持续优化中</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">客户概览</TabsTrigger>
          <TabsTrigger value="stages">阶段分析</TabsTrigger>
          <TabsTrigger value="insights">AI洞察</TabsTrigger>
          <TabsTrigger value="activities">活动日志</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 客户分布图 */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-slate-50/50 to-white hover:shadow-2xl transition-all duration-500 border-r-[5px] border-r-purple-400 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-600" />
                  客户分布分析
                </CardTitle>
                <CardDescription>按行业和规模分类的客户分布</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200/50">
                      <div className="text-2xl font-bold text-purple-600">45%</div>
                      <div className="text-sm text-slate-600">大型企业</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50">
                      <div className="text-2xl font-bold text-blue-600">35%</div>
                      <div className="text-sm text-slate-600">中型企业</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">房地产行业</span>
                      <span className="text-sm font-bold text-purple-600">38%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full"
                        style={{ width: "38%" }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">制造业</span>
                      <span className="text-sm font-bold text-blue-600">28%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                        style={{ width: "28%" }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-700">金融服务</span>
                      <span className="text-sm font-bold text-green-600">22%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                        style={{ width: "22%" }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 客户价值分析 */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-slate-50/50 to-white hover:shadow-2xl transition-all duration-500 border-r-[5px] border-r-purple-400 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  客户价值分析
                </CardTitle>
                <CardDescription>基于消费金额和频次的客户价值评估</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200/50">
                      <div className="text-lg font-bold text-green-700">156</div>
                      <div className="text-xs text-green-600">高价值</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200/50">
                      <div className="text-lg font-bold text-blue-700">892</div>
                      <div className="text-xs text-blue-600">中价值</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200/50">
                      <div className="text-lg font-bold text-gray-700">1,247</div>
                      <div className="text-xs text-gray-600">低价值</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700">高价值客户贡献</span>
                        <span className="font-medium text-green-600">68%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                          style={{ width: "68%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700">客户活跃度</span>
                        <span className="font-medium text-blue-600">82%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                          style={{ width: "82%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700">复购率</span>
                        <span className="font-medium text-purple-600">45%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full"
                          style={{ width: "45%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stages" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerStages.map((stage, index) => (
              <Card
                key={index}
                className={`border-0 shadow-xl bg-gradient-to-br from-white via-slate-50/50 to-white hover:shadow-2xl transition-all duration-500 border-r-[5px] border-r-purple-400 cursor-pointer hover:scale-105`}
                onClick={() => handleNavigation("/customers")}
              >
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 ${stage.bgColor} rounded-full flex items-center justify-center mx-auto`}>
                      <div className={`w-8 h-8 ${stage.color} rounded-full`}></div>
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${stage.textColor}`}>{stage.name}</h3>
                      <p className="text-3xl font-bold text-slate-900 mt-2">{stage.count}</p>
                      <p className="text-sm text-slate-500">占比 {stage.percentage}%</p>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-full ${stage.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 阶段转化漏斗 */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-slate-50/50 to-white hover:shadow-2xl transition-all duration-500 border-r-[5px] border-r-purple-400 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                客户转化漏斗
              </CardTitle>
              <CardDescription>各阶段客户转化率和流失分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50">
                    <div className="text-2xl font-bold text-blue-600">78%</div>
                    <div className="text-sm text-slate-600 mt-1">潜在→意向转化率</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200/50">
                    <div className="text-2xl font-bold text-green-600">65%</div>
                    <div className="text-sm text-slate-600 mt-1">意向→成交转化率</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200/50">
                    <div className="text-2xl font-bold text-purple-600">23.5%</div>
                    <div className="text-sm text-slate-600 mt-1">整体转化率</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiInsights.map((insight, index) => (
              <Card
                key={index}
                className={`border-0 shadow-xl bg-gradient-to-br from-white via-slate-50/50 to-white hover:shadow-2xl transition-all duration-500 border-r-[5px] border-r-purple-400 cursor-pointer hover:scale-105`}
                onClick={() => handleNavigation("/customers")}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 ${insight.bgColor} rounded-xl border ${insight.borderColor}`}>
                      <insight.icon className={`w-6 h-6 ${insight.textColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{insight.title}</h3>
                      <p className="text-sm text-slate-600 mb-4">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="secondary"
                          className={`${insight.bgColor} ${insight.textColor} border-${insight.color}-300`}
                        >
                          {insight.priority === "high"
                            ? "高优先级"
                            : insight.priority === "medium"
                              ? "中优先级"
                              : insight.priority === "low"
                                ? "低优先级"
                                : "信息"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`border-${insight.color}-200 hover:bg-${insight.color}-50`}
                        >
                          {insight.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <Card
                key={activity.id}
                className="border-0 shadow-lg bg-gradient-to-br from-white via-slate-50/50 to-white hover:shadow-xl transition-all duration-300 border-r-[5px] border-r-purple-400 cursor-pointer"
                onClick={() => handleNavigation("/customers")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-900">{activity.customer}</h4>
                        <span className="text-xs text-slate-500">{activity.timestamp.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-600">{activity.action}</p>
                      <p className="text-sm font-medium text-purple-600">{activity.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
