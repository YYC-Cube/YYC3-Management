/**
 * @fileoverview okr-management.tsx
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EnhancedProgress } from "@/components/ui/enhanced-progress"
import { Target, TrendingUp, Users, Calendar, Plus, Edit, Eye, Award } from "lucide-react"

interface OKR {
  id: string
  title: string
  description: string
  owner: string
  department: string
  quarter: string
  status: "draft" | "active" | "completed" | "cancelled"
  progress: number
  keyResults: KeyResult[]
  createdAt: string
  dueDate: string
}

interface KeyResult {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  progress: number
  status: "on-track" | "at-risk" | "off-track"
}

export function OKRManagement() {
  const [selectedQuarter, setSelectedQuarter] = useState("2025-Q2")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // 模拟OKR数据
  const okrs: OKR[] = [
    {
      id: "1",
      title: "提升客户满意度和服务质量",
      description: "通过优化服务流程和提升团队能力，显著提高客户满意度",
      owner: "张经理",
      department: "客服部",
      quarter: "2025-Q2",
      status: "active",
      progress: 75,
      createdAt: "2025-04-01",
      dueDate: "2025-06-30",
      keyResults: [
        {
          id: "kr1",
          title: "客户满意度评分达到4.5分",
          description: "通过客户调研提升满意度评分",
          target: 4.5,
          current: 4.2,
          unit: "分",
          progress: 80,
          status: "on-track",
        },
        {
          id: "kr2",
          title: "客户投诉处理时间缩短至2小时内",
          description: "优化投诉处理流程，提升响应速度",
          target: 2,
          current: 3.5,
          unit: "小时",
          progress: 60,
          status: "at-risk",
        },
        {
          id: "kr3",
          title: "客户续约率提升至85%",
          description: "通过优质服务提高客户续约意愿",
          target: 85,
          current: 78,
          unit: "%",
          progress: 85,
          status: "on-track",
        },
      ],
    },
    {
      id: "2",
      title: "数字化转型和系统优化",
      description: "推进企业数字化转型，提升运营效率",
      owner: "李总监",
      department: "技术部",
      quarter: "2025-Q2",
      status: "active",
      progress: 60,
      createdAt: "2025-04-01",
      dueDate: "2025-06-30",
      keyResults: [
        {
          id: "kr4",
          title: "完成核心业务系统升级",
          description: "升级ERP和CRM系统，提升系统性能",
          target: 100,
          current: 65,
          unit: "%",
          progress: 65,
          status: "on-track",
        },
        {
          id: "kr5",
          title: "员工数字化技能培训覆盖率达到90%",
          description: "提升全员数字化操作能力",
          target: 90,
          current: 72,
          unit: "%",
          progress: 80,
          status: "on-track",
        },
      ],
    },
    {
      id: "3",
      title: "销售业绩突破和市场拓展",
      description: "实现销售目标突破，扩大市场份额",
      owner: "王总监",
      department: "销售部",
      quarter: "2025-Q2",
      status: "active",
      progress: 45,
      createdAt: "2025-04-01",
      dueDate: "2025-06-30",
      keyResults: [
        {
          id: "kr6",
          title: "季度销售额达到500万",
          description: "通过市场拓展和客户维护实现销售目标",
          target: 500,
          current: 320,
          unit: "万元",
          progress: 64,
          status: "at-risk",
        },
        {
          id: "kr7",
          title: "新客户获取数量达到50个",
          description: "开发新客户，扩大客户基础",
          target: 50,
          current: 28,
          unit: "个",
          progress: 56,
          status: "at-risk",
        },
      ],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "at-risk":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "off-track":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "on-track":
        return "进展顺利"
      case "at-risk":
        return "存在风险"
      case "off-track":
        return "进度滞后"
      default:
        return "未知状态"
    }
  }

  const filteredOKRs = okrs.filter((okr) => {
    if (selectedDepartment !== "all" && okr.department !== selectedDepartment) return false
    if (okr.quarter !== selectedQuarter) return false
    return true
  })

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 - 统一风格 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">OKR目标管理</h1>
          <p className="text-slate-600 mt-1">目标与关键结果管理系统</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-Q1">2025 Q1</SelectItem>
              <SelectItem value="2025-Q2">2025 Q2</SelectItem>
              <SelectItem value="2025-Q3">2025 Q3</SelectItem>
              <SelectItem value="2025-Q4">2025 Q4</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            创建OKR
          </Button>
        </div>
      </div>

      {/* 统计卡片区域 - 严格执行统一规范 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-r-[5px] border-r-purple-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">总OKR数量</p>
                <p className="text-3xl font-bold text-purple-600">{filteredOKRs.length}</p>
                <p className="text-xs text-slate-500 mt-1">本季度活跃目标</p>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-sky-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">平均完成度</p>
                <p className="text-3xl font-bold text-sky-600">
                  {Math.round(filteredOKRs.reduce((acc, okr) => acc + okr.progress, 0) / filteredOKRs.length)}%
                </p>
                <p className="text-xs text-slate-500 mt-1">整体进展情况</p>
              </div>
              <TrendingUp className="w-8 h-8 text-sky-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-emerald-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">参与人数</p>
                <p className="text-3xl font-bold text-emerald-600">12</p>
                <p className="text-xs text-slate-500 mt-1">涉及团队成员</p>
              </div>
              <Users className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-amber-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">即将到期</p>
                <p className="text-3xl font-bold text-amber-600">2</p>
                <p className="text-xs text-slate-500 mt-1">30天内到期</p>
              </div>
              <Calendar className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OKR列表 */}
      <div className="space-y-6">
        {filteredOKRs.map((okr) => (
          <Card
            key={okr.id}
            className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <CardHeader className="border-b border-sky-100 bg-gradient-to-r from-sky-50/50 to-blue-50/30">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg text-slate-800">{okr.title}</CardTitle>
                  <CardDescription className="mt-2 text-slate-600">{okr.description}</CardDescription>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-slate-500">
                    <span>负责人: {okr.owner}</span>
                    <span>部门: {okr.department}</span>
                    <span>截止: {okr.dueDate}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-sky-200 text-sky-700">
                    {okr.quarter}
                  </Badge>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">{okr.progress}%</div>
                    <div className="w-20 mt-1">
                      <EnhancedProgress value={okr.progress} size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-slate-600">关键结果 (Key Results)</h4>
                <div className="space-y-3">
                  {okr.keyResults.map((kr) => (
                    <div key={kr.id} className="border border-sky-200 rounded-lg p-4 bg-sky-50/30">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-slate-800">{kr.title}</h5>
                          <p className="text-sm text-slate-600 mt-1">{kr.description}</p>
                        </div>
                        <Badge className={getStatusColor(kr.status)}>{getStatusText(kr.status)}</Badge>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-sm">
                          <span className="font-medium text-slate-800">{kr.current}</span>
                          <span className="text-slate-600">
                            {" "}
                            / {kr.target} {kr.unit}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24">
                            <EnhancedProgress value={kr.progress} status={kr.status} size="sm" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">{kr.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t border-sky-100">
                  <Button variant="outline" size="sm" className="border-sky-200 text-sky-700 hover:bg-sky-50">
                    <Eye className="w-4 h-4 mr-2" />
                    查看详情
                  </Button>
                  <Button variant="outline" size="sm" className="border-sky-200 text-sky-700 hover:bg-sky-50">
                    <Edit className="w-4 h-4 mr-2" />
                    编辑OKR
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    更新进度
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
