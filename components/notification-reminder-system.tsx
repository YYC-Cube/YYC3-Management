/**
 * @fileoverview notification-reminder-system.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { commonStyles, notificationConfig } from "@/lib/design-system"
import {
  Bell,
  Clock,
  AlertTriangle,
  Calendar,
  TrendingDown,
  Target,
  Users,
  Mail,
  Settings,
  CheckCircle,
  XCircle,
  Zap,
} from "lucide-react"

interface Notification {
  id: string
  type: "deadline" | "progress" | "milestone" | "team" | "system"
  priority: "high" | "medium" | "low"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionRequired: boolean
  relatedOKR?: string
  relatedUser?: string
}

interface ReminderSettings {
  deadlineReminders: boolean
  progressAlerts: boolean
  milestoneNotifications: boolean
  teamUpdates: boolean
  weeklyReports: boolean
  reminderDays: number
  alertThreshold: number
}

interface NotificationReminderSystemProps {
  showTitle?: boolean
}

export function NotificationReminderSystem({ showTitle = true }: NotificationReminderSystemProps) {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "deadline",
      priority: "high",
      title: "OKR即将到期",
      message: "客户满意度提升目标将在3天后到期，当前完成度75%",
      timestamp: "2025-06-28 09:30",
      read: false,
      actionRequired: true,
      relatedOKR: "提升客户满意度和服务质量",
    },
    {
      id: "2",
      type: "progress",
      priority: "medium",
      title: "进度异常预警",
      message: "数字化转型项目进度低于预期，建议关注",
      timestamp: "2025-06-28 08:15",
      read: false,
      actionRequired: true,
      relatedOKR: "数字化转型和系统优化",
    },
    {
      id: "3",
      type: "milestone",
      priority: "low",
      title: "里程碑完成",
      message: "客户调研系统开发已完成",
      timestamp: "2025-06-27 16:45",
      read: true,
      actionRequired: false,
      relatedOKR: "提升客户满意度和服务质量",
    },
    {
      id: "4",
      type: "team",
      priority: "medium",
      title: "团队协作提醒",
      message: "张经理请求您更新OKR进度",
      timestamp: "2025-06-27 14:20",
      read: false,
      actionRequired: true,
      relatedUser: "张经理",
    },
  ])

  const [settings, setSettings] = useState<ReminderSettings>({
    deadlineReminders: true,
    progressAlerts: true,
    milestoneNotifications: true,
    teamUpdates: true,
    weeklyReports: true,
    reminderDays: 7,
    alertThreshold: 20,
  })

  const [activeTab, setActiveTab] = useState("notifications")

  // 模拟实时通知
  useEffect(() => {
    const interval = setInterval(() => {
      // 模拟新通知
      if (Math.random() > 0.95) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: "progress",
          priority: "medium",
          title: "进度更新提醒",
          message: "有新的OKR进度更新需要您的关注",
          timestamp: new Date().toLocaleString("zh-CN"),
          read: false,
          actionRequired: true,
        }
        setNotifications((prev) => [newNotification, ...prev])

        toast({
          title: "新通知",
          description: newNotification.message,
          duration: 3000,
        })
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [toast])

  const getNotificationIcon = (type: string) => {
    const config = notificationConfig.types[type as keyof typeof notificationConfig.types]
    if (!config) return <Bell className="w-4 h-4 text-slate-500" />

    switch (type) {
      case "deadline":
        return <Clock className={`w-4 h-4 ${config.color}`} />
      case "progress":
        return <TrendingDown className={`w-4 h-4 ${config.color}`} />
      case "milestone":
        return <Target className={`w-4 h-4 ${config.color}`} />
      case "team":
        return <Users className={`w-4 h-4 ${config.color}`} />
      case "system":
        return <Settings className={`w-4 h-4 ${config.color}`} />
      default:
        return <Bell className="w-4 h-4 text-slate-500" />
    }
  }

  const getPriorityStyle = (priority: string) => {
    const config = notificationConfig.priorities[priority as keyof typeof notificationConfig.priorities]
    if (!config) return "bg-slate-100 text-slate-800 border-slate-200"

    return config.color
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
    toast({
      title: "已标记为已读",
      description: "所有通知已标记为已读",
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const updateSettings = (key: keyof ReminderSettings, value: boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    toast({
      title: "设置已更新",
      description: "通知设置已保存",
    })
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const urgentCount = notifications.filter((n) => !n.read && n.priority === "high").length

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          {showTitle && (
            <h1 className="text-2xl font-bold text-slate-900">通知提醒中心</h1>
          )}
          <p className="text-slate-600 mt-1">智能提醒系统，确保目标按时完成</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {urgentCount} 紧急
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {unreadCount} 未读
          </Badge>
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={commonStyles.button.primary}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            全部已读
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-r-[5px] border-r-red-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">即将到期</p>
                <p className="text-3xl font-bold text-red-600">3</p>
                <p className="text-xs text-slate-500 mt-1">7天内到期目标</p>
              </div>
              <Clock className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-amber-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">进度预警</p>
                <p className="text-3xl font-bold text-amber-600">2</p>
                <p className="text-xs text-slate-500 mt-1">低于预期目标</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-green-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">里程碑完成</p>
                <p className="text-3xl font-bold text-green-600">8</p>
                <p className="text-xs text-slate-500 mt-1">本周完成数量</p>
              </div>
              <Target className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-blue-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">团队协作</p>
                <p className="text-3xl font-bold text-blue-600">12</p>
                <p className="text-xs text-slate-500 mt-1">待处理请求</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容区域 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-sky-100">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            通知列表
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            提醒设置
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            定期报告
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card className={commonStyles.card.base}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-sky-500" />
                实时通知
              </CardTitle>
              <CardDescription>系统自动监控并发送重要提醒</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                        notification.read ? "bg-slate-50 opacity-75" : "bg-white border-sky-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-slate-800">{notification.title}</h4>
                              <Badge className={getPriorityStyle(notification.priority)} variant="outline">
                                {notification.priority === "high"
                                  ? "紧急"
                                  : notification.priority === "medium"
                                    ? "重要"
                                    : "一般"}
                              </Badge>
                              {notification.actionRequired && (
                                <Badge className="bg-orange-100 text-orange-800 border-orange-200">需要处理</Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>{notification.timestamp}</span>
                              {notification.relatedOKR && <span>相关目标: {notification.relatedOKR}</span>}
                              {notification.relatedUser && <span>来自: {notification.relatedUser}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <Card className={commonStyles.card.base}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-sky-500" />
                提醒设置
              </CardTitle>
              <CardDescription>自定义通知和提醒规则</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-800">通知类型</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span className="text-sm">截止日期提醒</span>
                      </div>
                      <Switch
                        checked={settings.deadlineReminders}
                        onCheckedChange={(checked) => updateSettings("deadlineReminders", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-amber-500" />
                        <span className="text-sm">进度异常预警</span>
                      </div>
                      <Switch
                        checked={settings.progressAlerts}
                        onCheckedChange={(checked) => updateSettings("progressAlerts", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-500" />
                        <span className="text-sm">里程碑通知</span>
                      </div>
                      <Switch
                        checked={settings.milestoneNotifications}
                        onCheckedChange={(checked) => updateSettings("milestoneNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">团队更新</span>
                      </div>
                      <Switch
                        checked={settings.teamUpdates}
                        onCheckedChange={(checked) => updateSettings("teamUpdates", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">周报提醒</span>
                      </div>
                      <Switch
                        checked={settings.weeklyReports}
                        onCheckedChange={(checked) => updateSettings("weeklyReports", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-slate-800">提醒参数</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-600 mb-2 block">提前提醒天数</label>
                      <Select
                        value={settings.reminderDays.toString()}
                        onValueChange={(value) => updateSettings("reminderDays", Number.parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3天</SelectItem>
                          <SelectItem value="7">7天</SelectItem>
                          <SelectItem value="14">14天</SelectItem>
                          <SelectItem value="30">30天</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 mb-2 block">进度预警阈值</label>
                      <Select
                        value={settings.alertThreshold.toString()}
                        onValueChange={(value) => updateSettings("alertThreshold", Number.parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">低于预期10%</SelectItem>
                          <SelectItem value="20">低于预期20%</SelectItem>
                          <SelectItem value="30">低于预期30%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className={commonStyles.card.base}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-sky-500" />
                定期报告
              </CardTitle>
              <CardDescription>自动生成和发送进度报告</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-800">报告类型</h4>
                  <div className="space-y-3">
                    <div className="p-4 border border-sky-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-slate-800">周进度报告</h5>
                        <Badge className="bg-green-100 text-green-800">已启用</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">每周一自动发送OKR进度汇总</p>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        查看示例
                      </Button>
                    </div>
                    <div className="p-4 border border-sky-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-slate-800">月度总结</h5>
                        <Badge className="bg-green-100 text-green-800">已启用</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">每月末生成详细分析报告</p>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        查看示例
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-slate-800">发送设置</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-600 mb-2 block">发送时间</label>
                      <Select defaultValue="monday-9">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday-9">周一 09:00</SelectItem>
                          <SelectItem value="friday-17">周五 17:00</SelectItem>
                          <SelectItem value="sunday-20">周日 20:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600 mb-2 block">接收人员</label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">目标负责人</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">部门主管</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">高级管理层</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
