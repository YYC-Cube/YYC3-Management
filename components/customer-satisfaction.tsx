/**
 * @fileoverview customer-satisfaction.tsx
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EnhancedProgress } from "@/components/ui/enhanced-progress"
import { Star, ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, Award, AlertCircle } from "lucide-react"

interface SatisfactionSurvey {
  id: string
  customerId: string
  customerName: string
  rating: number
  feedback: string
  category: "product" | "service" | "support" | "overall"
  date: string
  status: "pending" | "responded" | "resolved"
}

interface SatisfactionMetrics {
  averageRating: number
  totalResponses: number
  npsScore: number
  satisfactionTrend: number
}

export function CustomerSatisfaction() {
  const [surveys] = useState<SatisfactionSurvey[]>([
    {
      id: "1",
      customerId: "1",
      customerName: "华润集团",
      rating: 5,
      feedback: "产品质量很好，服务也很到位，会继续合作",
      category: "overall",
      date: "2025-06-19",
      status: "responded",
    },
    {
      id: "2",
      customerId: "2",
      customerName: "万科地产",
      rating: 4,
      feedback: "产品不错，但交期可以再快一些",
      category: "service",
      date: "2025-06-18",
      status: "pending",
    },
    {
      id: "3",
      customerId: "3",
      customerName: "碧桂园",
      rating: 5,
      feedback: "非常满意，质量和服务都很棒",
      category: "product",
      date: "2025-06-17",
      status: "resolved",
    },
  ])

  const [metrics] = useState<SatisfactionMetrics>({
    averageRating: 4.7,
    totalResponses: 156,
    npsScore: 72,
    satisfactionTrend: 8.5,
  })

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
    ))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">待处理</Badge>
      case "responded":
        return <Badge className="bg-sky-100 text-sky-800 border-sky-200">已回复</Badge>
      case "resolved":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">已解决</Badge>
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    const categories = {
      product: { label: "产品", color: "bg-sky-100 text-sky-800 border-sky-200" },
      service: { label: "服务", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
      support: { label: "支持", color: "bg-purple-100 text-purple-800 border-purple-200" },
      overall: { label: "整体", color: "bg-amber-100 text-amber-800 border-amber-200" },
    }
    const cat = categories[category as keyof typeof categories] || categories.overall
    return <Badge className={cat.color}>{cat.label}</Badge>
  }

  const getSatisfactionLevel = (rating: number) => {
    if (rating >= 4.5) return { label: "非常满意", color: "text-emerald-600", icon: <Award className="w-4 h-4" /> }
    if (rating >= 3.5) return { label: "满意", color: "text-sky-600", icon: <ThumbsUp className="w-4 h-4" /> }
    if (rating >= 2.5) return { label: "一般", color: "text-amber-600", icon: <MessageSquare className="w-4 h-4" /> }
    return { label: "不满意", color: "text-red-600", icon: <ThumbsDown className="w-4 h-4" /> }
  }

  const satisfactionLevel = getSatisfactionLevel(metrics.averageRating)

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 - 统一风格 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">客户满意度管理</h1>
          <p className="text-slate-600 mt-1">客户反馈收集与满意度分析</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="border-sky-200 text-sky-700 hover:bg-sky-50">
            <MessageSquare className="w-4 h-4 mr-2" />
            发送调研
          </Button>
          <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            分析报告
          </Button>
        </div>
      </div>

      {/* 满意度概览 - 统一风格 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-r-[5px] border-r-amber-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">平均评分</p>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-amber-600">{metrics.averageRating}</span>
                  <div className="flex">{getRatingStars(Math.round(metrics.averageRating))}</div>
                </div>
                <div className={`text-xs flex items-center space-x-1 ${satisfactionLevel.color} mt-1`}>
                  {satisfactionLevel.icon}
                  <span>{satisfactionLevel.label}</span>
                </div>
              </div>
              <Star className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-sky-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">总回复数</p>
                <p className="text-3xl font-bold text-sky-600">{metrics.totalResponses}</p>
                <p className="text-xs text-slate-500 mt-1">本月收集反馈</p>
              </div>
              <MessageSquare className="w-8 h-8 text-sky-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-emerald-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">NPS评分</p>
                <p className="text-3xl font-bold text-emerald-600">{metrics.npsScore}</p>
                <p className="text-xs text-emerald-600 mt-1">+{metrics.satisfactionTrend}% 较上月</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-red-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">待处理</p>
                <p className="text-3xl font-bold text-red-600">
                  {surveys.filter((s) => s.status === "pending").length}
                </p>
                <p className="text-xs text-slate-500 mt-1">需要跟进的反馈</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 满意度分布 */}
      <Card className="border-t-4 border-t-sky-400">
        <CardHeader>
          <CardTitle className="text-slate-800">满意度分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = surveys.filter((s) => s.rating === rating).length
              const percentage = surveys.length > 0 ? (count / surveys.length) * 100 : 0

              return (
                <div key={rating} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 w-20">
                    <span className="text-sm font-medium text-slate-700">{rating}</span>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <EnhancedProgress value={percentage} />
                  </div>
                  <div className="text-sm text-slate-600 w-16 text-right">
                    {count} ({percentage.toFixed(0)}%)
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 客户反馈列表 */}
      <Card className="border-t-4 border-t-sky-400">
        <CardHeader>
          <CardTitle className="text-slate-800">最新客户反馈</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {surveys.map((survey) => (
              <div key={survey.id} className="border border-sky-200 rounded-lg p-4 bg-sky-50/30">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-slate-800">{survey.customerName}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex">{getRatingStars(survey.rating)}</div>
                      <span className="text-sm text-slate-600">{survey.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {getCategoryBadge(survey.category)}
                    {getStatusBadge(survey.status)}
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-3">"{survey.feedback}"</p>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">{survey.date}</span>
                  <div className="flex space-x-2">
                    {survey.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" className="border-sky-200 text-sky-700 hover:bg-sky-50">
                          回复
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
                        >
                          标记已处理
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 快速回复模板 */}
      <Card className="border-t-4 border-t-sky-400">
        <CardHeader>
          <CardTitle className="text-slate-800">快速回复模板</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border border-sky-200 rounded-lg hover:bg-sky-50 cursor-pointer">
              <h4 className="font-medium text-sm text-slate-800">感谢反馈模板</h4>
              <p className="text-xs text-slate-600">感谢您的宝贵反馈，我们会持续改进产品和服务质量...</p>
            </div>
            <div className="p-3 border border-sky-200 rounded-lg hover:bg-sky-50 cursor-pointer">
              <h4 className="font-medium text-sm text-slate-800">问题解决模板</h4>
              <p className="text-xs text-slate-600">我们已经了解到您遇到的问题，正在积极处理中...</p>
            </div>
            <div className="p-3 border border-sky-200 rounded-lg hover:bg-sky-50 cursor-pointer">
              <h4 className="font-medium text-sm text-slate-800">服务改进模板</h4>
              <p className="text-xs text-slate-600">根据您的建议，我们将在以下方面进行改进...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
