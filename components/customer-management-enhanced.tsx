/**
 * @fileoverview customer-management-enhanced.tsx
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
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { PageContainer } from "@/components/layout/page-container"
import { commonStyles } from "@/lib/design-system"
import {
  Search,
  Plus,
  Filter,
  Download,
  Users,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Star,
  Eye,
  Edit,
  MessageCircle,
  DollarSign,
  Clock,
  Target,
} from "lucide-react"

const customers = [
  {
    id: 1,
    name: "深圳华润集团",
    contact: "李总监",
    phone: "138-0013-8888",
    email: "li.director@huarun.com",
    address: "深圳市南山区",
    status: "活跃",
    level: "VIP",
    value: "¥2,847,392",
    lastContact: "2天前",
    nextFollow: "明天",
    satisfaction: 95,
    orders: 24,
    category: "大客户",
  },
  {
    id: 2,
    name: "广州万科地产",
    contact: "张经理",
    phone: "139-2234-5678",
    email: "zhang.manager@vanke.com",
    address: "广州市天河区",
    status: "潜在",
    level: "A级",
    value: "¥1,234,567",
    lastContact: "1周前",
    nextFollow: "本周",
    satisfaction: 88,
    orders: 12,
    category: "重点客户",
  },
  {
    id: 3,
    name: "东莞制造有限公司",
    contact: "王主管",
    phone: "137-1122-3344",
    email: "wang.supervisor@dg-mfg.com",
    address: "东莞市长安镇",
    status: "休眠",
    level: "B级",
    value: "¥567,890",
    lastContact: "1个月前",
    nextFollow: "下周",
    satisfaction: 72,
    orders: 8,
    category: "普通客户",
  },
]

const customerStats = [
  { label: "总客户数", value: "1,247", change: "+8.2%", icon: Users, color: "from-blue-400 to-sky-500" },
  { label: "活跃客户", value: "892", change: "+12.5%", icon: TrendingUp, color: "from-emerald-400 to-teal-500" },
  { label: "客户价值", value: "¥4.2M", change: "+15.3%", icon: DollarSign, color: "from-purple-400 to-indigo-500" },
  { label: "满意度", value: "94.5%", change: "+2.1%", icon: Star, color: "from-orange-400 to-red-500" },
]

export function CustomerManagementEnhanced() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("list")

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <PageContainer title="客户管理" description="全面管理客户关系，提升客户满意度和业务价值">
      {/* 统计卡片 */}
      <div className={commonStyles.layout.grid + " grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}>
        {customerStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <EnhancedCard key={index} variant="glass">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                    <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
                    <span className="text-xs text-slate-500 ml-1">vs 上月</span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </EnhancedCard>
          )
        })}
      </div>

      {/* 主要内容区域 */}
      <EnhancedCard variant="gradient">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-sky-100/50 border border-sky-200">
              <TabsTrigger value="list" className="data-[state=active]:bg-white data-[state=active]:text-sky-700">
                客户列表
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-sky-700">
                客户分析
              </TabsTrigger>
              <TabsTrigger value="follow" className="data-[state=active]:bg-white data-[state=active]:text-sky-700">
                跟进管理
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4" />
                <Input
                  placeholder="搜索客户..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={commonStyles.input + " pl-10 w-64"}
                />
              </div>
              <EnhancedButton
                variant="primary"
                icon={Filter}
                className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
              >
                筛选
              </EnhancedButton>
              <EnhancedButton
                variant="primary"
                icon={Download}
                className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
              >
                导出
              </EnhancedButton>
              <EnhancedButton
                variant="primary"
                icon={Plus}
                className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
              >
                新增客户
              </EnhancedButton>
            </div>
          </div>

          <TabsContent value="list" className="space-y-4">
            <div className="grid gap-4">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className={`${commonStyles.card} p-6 hover:scale-[1.01] cursor-pointer transition-all duration-200`}
                  onClick={() => setSelectedCustomer(customer.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-slate-800 text-lg">{customer.name}</h3>
                          <Badge className={commonStyles.badge.primary}>{customer.level}</Badge>
                          <Badge
                            variant="outline"
                            className={
                              customer.status === "活跃"
                                ? commonStyles.badge.success
                                : customer.status === "潜在"
                                  ? commonStyles.badge.warning
                                  : commonStyles.badge.secondary
                            }
                          >
                            {customer.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1 text-sky-500" />
                            {customer.contact}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1 text-sky-500" />
                            {customer.phone}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-sky-500" />
                            {customer.address}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm text-slate-600">客户价值</p>
                        <p className="font-bold text-lg text-slate-800">{customer.value}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">满意度</p>
                        <div className="flex items-center">
                          <div className="w-16 bg-sky-100 rounded-full h-2 mr-2">
                            <div
                              className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${customer.satisfaction}%` }}
                            />
                          </div>
                          <span className="font-medium text-emerald-600">{customer.satisfaction}%</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <EnhancedButton
                          variant="primary"
                          size="sm"
                          icon={Eye}
                          className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
                        >
                          查看
                        </EnhancedButton>
                        <EnhancedButton
                          variant="primary"
                          size="sm"
                          icon={MessageCircle}
                          className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
                        >
                          沟通
                        </EnhancedButton>
                        <EnhancedButton
                          variant="primary"
                          size="sm"
                          icon={Edit}
                          className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
                        >
                          编辑
                        </EnhancedButton>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-sky-100 flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-slate-600">
                        <Clock className="w-4 h-4 mr-1 text-sky-500" />
                        最后联系: {customer.lastContact}
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Calendar className="w-4 h-4 mr-1 text-sky-500" />
                        下次跟进: {customer.nextFollow}
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Target className="w-4 h-4 mr-1 text-sky-500" />
                        订单数: {customer.orders}
                      </div>
                    </div>
                    <Badge variant="outline" className={commonStyles.badge.secondary}>
                      {customer.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EnhancedCard title="客户分布分析" description="按地区和行业分析客户分布">
                <div className="h-64 flex items-center justify-center text-slate-500">客户分布图表区域</div>
              </EnhancedCard>

              <EnhancedCard title="客户价值分析" description="客户生命周期价值分析">
                <div className="h-64 flex items-center justify-center text-slate-500">价值分析图表区域</div>
              </EnhancedCard>
            </div>
          </TabsContent>

          <TabsContent value="follow" className="space-y-6">
            <EnhancedCard title="跟进计划" description="客户跟进任务和计划管理">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-sky-50/50 rounded-xl border border-sky-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-slate-800">深圳华润集团 - 合同续签</p>
                      <p className="text-sm text-slate-600">联系人: 李总监 | 截止: 明天</p>
                    </div>
                  </div>
                  <Badge variant="destructive">紧急</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-sky-50/50 rounded-xl border border-sky-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-slate-800">广州万科地产 - 需求调研</p>
                      <p className="text-sm text-slate-600">联系人: 张经理 | 截止: 本周</p>
                    </div>
                  </div>
                  <Badge variant="outline">普通</Badge>
                </div>
              </div>
            </EnhancedCard>
          </TabsContent>
        </Tabs>
      </EnhancedCard>
    </PageContainer>
  )
}
