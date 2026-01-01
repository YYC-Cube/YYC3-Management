/**
 * @fileoverview customer-lifecycle.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { UserPlus, TrendingUp, Star, Heart, Users, Target, Award, ArrowRight, BarChart3, Settings } from "lucide-react"

interface LifecycleStage {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  customers: number
  percentage: number
}

export function CustomerLifecycle() {
  const lifecycleStages: LifecycleStage[] = [
    {
      id: "prospect",
      name: "潜在客户",
      description: "初次接触，了解需求",
      icon: <UserPlus className="w-5 h-5" />,
      color: "bg-gray-100 text-gray-800",
      customers: 45,
      percentage: 30,
    },
    {
      id: "lead",
      name: "意向客户",
      description: "表现出购买意向",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-800",
      customers: 32,
      percentage: 21,
    },
    {
      id: "customer",
      name: "新客户",
      description: "首次购买产品或服务",
      icon: <Star className="w-5 h-5" />,
      color: "bg-green-100 text-green-800",
      customers: 28,
      percentage: 19,
    },
    {
      id: "repeat",
      name: "回头客",
      description: "多次购买，建立信任",
      icon: <Heart className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-800",
      customers: 25,
      percentage: 17,
    },
    {
      id: "advocate",
      name: "忠诚客户",
      description: "主动推荐，价值最高",
      icon: <Award className="w-5 h-5" />,
      color: "bg-yellow-100 text-yellow-800",
      customers: 20,
      percentage: 13,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 - 统一风格 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">客户生命周期管理</h1>
          <p className="text-gray-600 mt-1">客户全生命周期价值分析与管理</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            阶段设置
          </Button>
          <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            生成报告
          </Button>
        </div>
      </div>

      {/* 生命周期概览 - 统一风格 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-r-[5px] border-r-blue-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总客户数</p>
                <p className="text-3xl font-bold text-blue-600">150</p>
                <p className="text-xs text-gray-500 mt-1">全生命周期客户</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-green-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">转化率</p>
                <p className="text-3xl font-bold text-green-600">68%</p>
                <p className="text-xs text-gray-500 mt-1">潜在→付费客户</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-purple-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">忠诚客户</p>
                <p className="text-3xl font-bold text-purple-600">20</p>
                <p className="text-xs text-gray-500 mt-1">高价值客户群体</p>
              </div>
              <Award className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-orange-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均价值</p>
                <p className="text-3xl font-bold text-orange-600">¥18.5K</p>
                <p className="text-xs text-gray-500 mt-1">客户生命周期价值</p>
              </div>
              <Target className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>客户生命周期分析</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lifecycleStages.map((stage, index) => (
              <div key={stage.id} className="relative">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                      {stage.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{stage.name}</h4>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={stage.color}>{stage.customers} 人</Badge>
                      <span className="text-sm text-muted-foreground">{stage.percentage}%</span>
                    </div>
                    <Progress value={stage.percentage} className="w-20 h-2" />
                  </div>
                </div>
                {index < lifecycleStages.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">转化目标</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">潜在→意向:</span>
                <span className="font-medium ml-2">71%</span>
              </div>
              <div>
                <span className="text-blue-700">意向→新客:</span>
                <span className="font-medium ml-2">88%</span>
              </div>
              <div>
                <span className="text-blue-700">新客→回头:</span>
                <span className="font-medium ml-2">89%</span>
              </div>
              <div>
                <span className="text-blue-700">回头→忠诚:</span>
                <span className="font-medium ml-2">80%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
