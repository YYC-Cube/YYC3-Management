/**
 * @fileoverview mobile-native-app.tsx
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Smartphone,
  Download,
  Wifi,
  WifiOff,
  Bell,
  Settings,
  FolderSyncIcon as Sync,
  Shield,
  Zap,
  Users,
  BarChart3,
  MessageSquare,
  Calendar,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"

interface AppFeature {
  id: string
  name: string
  description: string
  icon: any
  status: "available" | "development" | "planned"
}

interface NotificationSetting {
  id: string
  title: string
  description: string
  enabled: boolean
}

export function MobileNativeApp() {
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [syncProgress, setSyncProgress] = useState(85)

  const appFeatures: AppFeature[] = [
    {
      id: "1",
      name: "仪表盘",
      description: "实时业务数据概览",
      icon: BarChart3,
      status: "available",
    },
    {
      id: "2",
      name: "客户管理",
      description: "移动端客户信息管理",
      icon: Users,
      status: "available",
    },
    {
      id: "3",
      name: "即时通讯",
      description: "团队内部沟通协作",
      icon: MessageSquare,
      status: "available",
    },
    {
      id: "4",
      name: "日程安排",
      description: "移动端日程和任务管理",
      icon: Calendar,
      status: "development",
    },
    {
      id: "5",
      name: "语音助手",
      description: "AI语音交互功能",
      icon: Zap,
      status: "planned",
    },
    {
      id: "6",
      name: "AR展示",
      description: "增强现实产品展示",
      icon: Smartphone,
      status: "planned",
    },
  ]

  const notificationSettings: NotificationSetting[] = [
    {
      id: "1",
      title: "新消息通知",
      description: "接收新的聊天消息和系统通知",
      enabled: true,
    },
    {
      id: "2",
      title: "任务提醒",
      description: "任务截止日期和重要事项提醒",
      enabled: true,
    },
    {
      id: "3",
      title: "销售报告",
      description: "每日销售数据和业绩报告",
      enabled: false,
    },
    {
      id: "4",
      title: "客户动态",
      description: "重要客户活动和状态变化",
      enabled: true,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "development":
        return "bg-yellow-100 text-yellow-800"
      case "planned":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "可用"
      case "development":
        return "开发中"
      case "planned":
        return "计划中"
      default:
        return "未知"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">移动端应用</h1>
          <p className="text-slate-600 mt-2">原生移动端体验和功能管理</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            下载APK
          </Button>
          <Button className="bg-rose-600 hover:bg-rose-700">
            <Smartphone className="w-4 h-4 mr-2" />
            扫码安装
          </Button>
        </div>
      </div>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">功能特性</TabsTrigger>
          <TabsTrigger value="offline">离线同步</TabsTrigger>
          <TabsTrigger value="notifications">推送通知</TabsTrigger>
          <TabsTrigger value="settings">应用设置</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appFeatures.map((feature) => (
              <Card key={feature.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-rose-100 rounded-lg">
                    <feature.icon className="w-6 h-6 text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">{feature.name}</h3>
                      <Badge className={getStatusColor(feature.status)}>{getStatusText(feature.status)}</Badge>
                    </div>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                    {feature.status === "available" && (
                      <Button variant="link" className="p-0 h-auto mt-2 text-sm">
                        立即体验
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="offline" className="space-y-4">
          <div className="grid gap-6">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isOfflineMode ? (
                    <WifiOff className="w-5 h-5 text-red-600" />
                  ) : (
                    <Wifi className="w-5 h-5 text-green-600" />
                  )}
                  离线模式管理
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">启用离线模式</h4>
                    <p className="text-sm text-slate-600">在无网络环境下继续使用应用</p>
                  </div>
                  <Switch checked={isOfflineMode} onCheckedChange={setIsOfflineMode} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">数据同步进度</span>
                    <span className="text-sm text-slate-600">{syncProgress}%</span>
                  </div>
                  <Progress value={syncProgress} className="w-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">已缓存数据</h4>
                    <p className="text-2xl font-bold text-blue-600 mt-2">2.3 GB</p>
                    <p className="text-sm text-blue-700">包含客户、产品、订单数据</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">离线可用功能</h4>
                    <p className="text-2xl font-bold text-green-600 mt-2">8/12</p>
                    <p className="text-sm text-green-700">核心功能离线可用</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline">
                    <Sync className="w-4 h-4 mr-2" />
                    立即同步
                  </Button>
                  <Button variant="outline">清理缓存</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                推送通知设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationSettings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0"
                >
                  <div>
                    <h4 className="font-medium">{setting.title}</h4>
                    <p className="text-sm text-slate-600">{setting.description}</p>
                  </div>
                  <Switch defaultChecked={setting.enabled} />
                </div>
              ))}

              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">通知统计</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-orange-700">今日推送</p>
                    <p className="text-xl font-bold text-orange-600">23</p>
                  </div>
                  <div>
                    <p className="text-sm text-orange-700">点击率</p>
                    <p className="text-xl font-bold text-orange-600">68%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-6">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-600" />
                  应用设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">自动更新</h4>
                    <p className="text-sm text-slate-600">自动下载和安装应用更新</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">生物识别登录</h4>
                    <p className="text-sm text-slate-600">使用指纹或面部识别快速登录</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">数据加密</h4>
                    <p className="text-sm text-slate-600">本地数据端到端加密存储</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">崩溃报告</h4>
                    <p className="text-sm text-slate-600">自动发送崩溃日志帮助改进应用</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3">应用信息</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">版本号</span>
                      <span className="font-medium">v2.1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">构建号</span>
                      <span className="font-medium">20240628</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">应用大小</span>
                      <span className="font-medium">45.2 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">最后更新</span>
                      <span className="font-medium">2024年6月28日</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    隐私政策
                  </Button>
                  <Button variant="outline">检查更新</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
