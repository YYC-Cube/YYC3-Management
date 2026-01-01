"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageContainer } from "@/components/layout/page-container"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { NotificationReminderSystem } from "@/components/notification-reminder-system"
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  MessageSquare,
  Calendar,
  Users,
  Settings,
  Trash2,
  BookMarkedIcon as MarkAsRead,
} from "lucide-react"

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "important">("all")

  // 模拟通知数据
  const notifications = [
    {
      id: 1,
      title: "新任务分配",
      message: "您有一个新的任务需要处理：客户资料整理",
      type: "task",
      priority: "high",
      time: "5分钟前",
      read: false,
      from: "张三",
    },
    {
      id: 2,
      title: "会议提醒",
      message: "团队周会将在30分钟后开始，请准时参加",
      type: "meeting",
      priority: "medium",
      time: "25分钟前",
      read: false,
      from: "系统",
    },
    {
      id: 3,
      title: "审批通知",
      message: "您的请假申请已通过审批",
      type: "approval",
      priority: "low",
      time: "2小时前",
      read: true,
      from: "李四",
    },
    {
      id: 4,
      title: "系统更新",
      message: "系统将在今晚22:00进行维护更新，预计耗时2小时",
      type: "system",
      priority: "medium",
      time: "4小时前",
      read: true,
      from: "系统管理员",
    },
    {
      id: 5,
      title: "客户反馈",
      message: "客户对最近的服务给出了5星好评",
      type: "feedback",
      priority: "low",
      time: "1天前",
      read: true,
      from: "客服部",
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "task":
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case "meeting":
        return <Calendar className="w-5 h-5 text-green-500" />
      case "approval":
        return <Users className="w-5 h-5 text-purple-500" />
      case "system":
        return <Settings className="w-5 h-5 text-orange-500" />
      case "feedback":
        return <MessageSquare className="w-5 h-5 text-pink-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "紧急"
      case "medium":
        return "普通"
      case "low":
        return "低优先级"
      default:
        return "未知"
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read
    if (filter === "important") return notification.priority === "high"
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length
  const importantCount = notifications.filter((n) => n.priority === "high").length

  return (
    <PageContainer title="通知中心" description="查看和管理您的所有通知消息">
      <NotificationReminderSystem showTitle={false} />
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-r-[5px] border-r-blue-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
                <p className="text-xs text-gray-500 mt-1">全部通知</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-red-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{unreadCount}</p>
                <p className="text-xs text-gray-500 mt-1">未读消息</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-orange-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{importantCount}</p>
                <p className="text-xs text-gray-500 mt-1">重要通知</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-green-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">95%</p>
                <p className="text-xs text-gray-500 mt-1">处理率</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 通知列表 */}
      <div className="border-t-4 border-t-blue-400 pt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">通知列表</CardTitle>
                <CardDescription>管理您的通知消息</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <MarkAsRead className="w-4 h-4 mr-2" />
                  全部标记已读
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  清空已读
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">全部 ({notifications.length})</TabsTrigger>
                <TabsTrigger value="unread">未读 ({unreadCount})</TabsTrigger>
                <TabsTrigger value="important">重要 ({importantCount})</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    flex items-start gap-4 p-4 border rounded-lg transition-all hover:shadow-sm
                    ${!notification.read ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"}
                  `}
                >
                  <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-semibold ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getPriorityColor(notification.priority)} border text-xs`}>
                          {getPriorityText(notification.priority)}
                        </Badge>
                        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>来自: {notification.from}</span>
                        <span>{notification.time}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                            标记已读
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
