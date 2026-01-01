"use client"

import { PageContainer } from "@/components/layout/page-container"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, UserPlus, Search, Filter, TrendingUp, Star, Phone, Mail } from "lucide-react"

export default function CustomersPage() {
  return (
    <PageContainer title="客户管理" description="管理和维护客户关系">
      <div className="space-y-6">
        {/* 页面操作区 */}
        <div className="flex items-center justify-end">
          <EnhancedButton className="bg-green-600 hover:bg-green-700 border-r-4 border-r-green-500 shadow-[4px_0_12px_rgba(34,197,94,0.15)]">
            <UserPlus className="w-4 h-4 mr-2 text-white" />
            新增客户
          </EnhancedButton>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedCard className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(34,197,94,0.15)] hover:border-r-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">总客户数</p>
                <p className="text-2xl font-bold text-slate-800">1,234</p>
                <p className="text-xs text-green-600 mt-1">↑ 12% 较上月</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(34,197,94,0.15)] hover:border-r-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">活跃客户</p>
                <p className="text-2xl font-bold text-slate-800">856</p>
                <p className="text-xs text-green-600 mt-1">↑ 8% 较上月</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(34,197,94,0.15)] hover:border-r-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">VIP客户</p>
                <p className="text-2xl font-bold text-slate-800">89</p>
                <p className="text-xs text-yellow-600 mt-1">↑ 5% 较上月</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(34,197,94,0.15)] hover:border-r-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">新增客户</p>
                <p className="text-2xl font-bold text-slate-800">45</p>
                <p className="text-xs text-green-600 mt-1">本月新增</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* 搜索和筛选 */}
        <EnhancedCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input placeholder="搜索客户姓名、公司或联系方式..." className="pl-10" />
            </div>
            <EnhancedButton variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </EnhancedButton>
          </div>

          {/* 客户列表 */}
          <div className="space-y-4">
            {[
              {
                name: "张三",
                company: "ABC科技有限公司",
                level: "VIP",
                phone: "138****1234",
                email: "zhang@abc.com",
                status: "活跃",
              },
              {
                name: "李四",
                company: "XYZ贸易公司",
                level: "普通",
                phone: "139****5678",
                email: "li@xyz.com",
                status: "活跃",
              },
              {
                name: "王五",
                company: "DEF制造企业",
                level: "重要",
                phone: "137****9012",
                email: "wang@def.com",
                status: "潜在",
              },
            ].map((customer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors border-r-4 border-r-green-500 shadow-[2px_0_8px_rgba(34,197,94,0.1)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-800">{customer.name}</h3>
                      <Badge
                        variant={
                          customer.level === "VIP" ? "default" : customer.level === "重要" ? "secondary" : "outline"
                        }
                      >
                        {customer.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{customer.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3" />
                      {customer.email}
                    </div>
                  </div>
                  <Badge variant={customer.status === "活跃" ? "default" : "secondary"}>{customer.status}</Badge>
                  <EnhancedButton size="sm" variant="outline">
                    查看详情
                  </EnhancedButton>
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
