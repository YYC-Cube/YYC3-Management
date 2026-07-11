"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageContainer } from "@/components/layout/page-container"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight, Filter } from "lucide-react"

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week")

  // 模拟日程数据
  const scheduleData = [
    {
      id: 1,
      title: "团队周会",
      time: "09:00 - 10:00",
      location: "会议室A",
      attendees: ["张三", "李四", "王五"],
      type: "meeting",
      status: "confirmed",
    },
    {
      id: 2,
      title: "客户拜访",
      time: "14:00 - 16:00",
      location: "客户办公室",
      attendees: ["张三"],
      type: "visit",
      status: "pending",
    },
    {
      id: 3,
      title: "项目评审",
      time: "16:30 - 17:30",
      location: "会议室B",
      attendees: ["李四", "王五", "赵六"],
      type: "review",
      status: "confirmed",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return "👥"
      case "visit":
        return "🏢"
      case "review":
        return "📋"
      default:
        return "📅"
    }
  }

  return (
    <>
      <PageContainer title="日程安排" description="管理您的日程安排和会议">
        {/* 操作栏 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold min-w-0">
              {currentDate.toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as string)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="day">日</TabsTrigger>
                <TabsTrigger value="week">周</TabsTrigger>
                <TabsTrigger value="month">月</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>

            <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              新建日程
            </Button>
          </div>
        </div>

        {/* 今日概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-r-[5px] border-r-blue-400 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900">3</p>
                  <p className="text-xs text-slate-500 mt-1">今日日程</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-r-[5px] border-r-green-400 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900">2</p>
                  <p className="text-xs text-slate-500 mt-1">待确认</p>
                </div>
                <Clock className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-r-[5px] border-r-purple-400 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900">5</p>
                  <p className="text-xs text-slate-500 mt-1">本周会议</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 日程列表 */}
        <div className="border-t-4 border-t-blue-400 pt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">今日日程</CardTitle>
              <CardDescription>您今天的所有安排</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scheduleData.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="text-2xl">{getTypeIcon(item.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      <Badge className={`${getStatusColor(item.status)} border`}>
                        {item.status === "confirmed" ? "已确认" : item.status === "pending" ? "待确认" : "已取消"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {item.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {item.attendees.length} 人参与
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-500">参与者:</span>
                      <div className="flex gap-1">
                        {item.attendees.map((attendee, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {attendee}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      编辑
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      取消
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageContainer>
      <FloatingNavButtons />
    </>
  )
}
