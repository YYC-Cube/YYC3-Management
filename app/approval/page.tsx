"use client"

import { PageContainer } from "@/components/layout/page-container"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, CheckCircle, XCircle, User, Calendar, Plus } from "lucide-react"
import { OAApproval } from "@/components/oa-approval"

export default function ApprovalPage() {
  return (
    <>
      <PageContainer title="OA审批管理" description="企业办公自动化审批流程管理">
        <OAApproval />
        <div className="space-y-6">
          {/* 页面标题 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">OA审批</h1>
              <p className="text-slate-600 mt-1">处理和跟踪审批流程</p>
            </div>
            <EnhancedButton className="bg-sky-600 hover:bg-sky-700">
              <Plus className="w-4 h-4 mr-2" />
              发起审批
            </EnhancedButton>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EnhancedCard className="border-r-[5px] border-r-sky-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">待审批</p>
                  <p className="text-2xl font-bold text-slate-800">8</p>
                  <p className="text-xs text-sky-600 mt-1">需要处理</p>
                </div>
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-sky-600" />
                </div>
              </div>
            </EnhancedCard>

            <EnhancedCard className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">已通过</p>
                  <p className="text-2xl font-bold text-slate-800">45</p>
                  <p className="text-xs text-green-600 mt-1">本月通过</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </EnhancedCard>

            <EnhancedCard className="border-r-[5px] border-r-red-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">已拒绝</p>
                  <p className="text-2xl font-bold text-slate-800">3</p>
                  <p className="text-xs text-red-600 mt-1">本月拒绝</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </EnhancedCard>

            <EnhancedCard className="border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">总申请</p>
                  <p className="text-2xl font-bold text-slate-800">156</p>
                  <p className="text-xs text-purple-600 mt-1">历史总数</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </EnhancedCard>
          </div>

          {/* 审批列表 */}
          <EnhancedCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">待处理审批</h2>
              <div className="flex gap-2">
                <EnhancedButton variant="outline" size="sm">
                  全部
                </EnhancedButton>
                <EnhancedButton variant="outline" size="sm">
                  待审批
                </EnhancedButton>
                <EnhancedButton variant="outline" size="sm">
                  已处理
                </EnhancedButton>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "年假申请",
                  applicant: "张三",
                  type: "请假",
                  date: "2024-01-15",
                  status: "待审批",
                  priority: "普通",
                  description: "申请年假5天，时间：2024-01-20至2024-01-24",
                },
                {
                  title: "设备采购申请",
                  applicant: "李四",
                  type: "采购",
                  date: "2024-01-14",
                  status: "待审批",
                  priority: "紧急",
                  description: "申请采购办公电脑10台，预算金额：50,000元",
                },
                {
                  title: "差旅费报销",
                  applicant: "王五",
                  type: "报销",
                  date: "2024-01-13",
                  status: "已通过",
                  priority: "普通",
                  description: "出差北京产生的交通费和住宿费，总计：3,200元",
                },
                {
                  title: "培训费用申请",
                  applicant: "赵六",
                  type: "培训",
                  date: "2024-01-12",
                  status: "待审批",
                  priority: "普通",
                  description: "参加技术培训课程，费用：8,000元",
                },
              ].map((approval, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-slate-800">{approval.title}</h3>
                      <Badge variant="outline">{approval.type}</Badge>
                      <Badge
                        variant={
                          approval.priority === "紧急"
                            ? "destructive"
                            : approval.priority === "重要"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {approval.priority}
                      </Badge>
                      <Badge
                        variant={
                          approval.status === "已通过"
                            ? "default"
                            : approval.status === "已拒绝"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {approval.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {approval.status === "待审批" && (
                        <>
                          <EnhancedButton
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            通过
                          </EnhancedButton>
                          <EnhancedButton
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            拒绝
                          </EnhancedButton>
                        </>
                      )}
                      <EnhancedButton size="sm" variant="outline">
                        查看详情
                      </EnhancedButton>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      申请人: {approval.applicant}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      申请时间: {approval.date}
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{approval.description}</p>
                </div>
              ))}
            </div>
          </EnhancedCard>

          {/* 审批统计 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedCard>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">审批类型分布</h3>
              <div className="space-y-3">
                {[
                  { type: "请假申请", count: 23, percentage: 35, color: "bg-sky-500" },
                  { type: "报销申请", count: 18, percentage: 28, color: "bg-green-500" },
                  { type: "采购申请", count: 12, percentage: 18, color: "bg-yellow-500" },
                  { type: "培训申请", count: 8, percentage: 12, color: "bg-purple-500" },
                  { type: "其他申请", count: 5, percentage: 7, color: "bg-gray-500" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-slate-800">{item.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="font-medium text-slate-800 w-8">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </EnhancedCard>

            <EnhancedCard>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">审批效率</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">平均处理时间</p>
                    <p className="text-sm text-slate-600">从申请到审批完成</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-sky-600">2.3</p>
                    <p className="text-sm text-slate-600">天</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">通过率</p>
                    <p className="text-sm text-slate-600">审批通过的比例</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">94%</p>
                    <p className="text-sm text-slate-600">本月</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">待处理数量</p>
                    <p className="text-sm text-slate-600">当前需要处理的申请</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-600">8</p>
                    <p className="text-sm text-slate-600">个</p>
                  </div>
                </div>
              </div>
            </EnhancedCard>
          </div>
        </div>
      </PageContainer>
      <FloatingNavButtons />
    </>
  )
}
