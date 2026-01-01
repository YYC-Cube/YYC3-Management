/**
 * @fileoverview communication.tsx
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
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Send, Phone, Video, Users, Bell, Search, Plus, Paperclip, Smile } from "lucide-react"

export function Communication() {
  const [selectedChat, setSelectedChat] = useState("1")
  const [message, setMessage] = useState("")

  const chatList = [
    {
      id: "1",
      name: "产品开发团队",
      type: "group",
      lastMessage: "新产品原型设计已完成，请大家查看",
      time: "10:30",
      unread: 3,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "张经理",
      type: "private",
      lastMessage: "明天的会议时间需要调整一下",
      time: "09:45",
      unread: 1,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "销售部门群",
      type: "group",
      lastMessage: "本月销售目标完成情况汇报",
      time: "昨天",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      name: "李工程师",
      type: "private",
      lastMessage: "设备维护报告已发送",
      time: "2天前",
      unread: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const messages = [
    {
      id: "1",
      sender: "张经理",
      content: "大家好，关于新产品的开发进度，我们需要加快推进",
      time: "09:30",
      isOwn: false,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      sender: "我",
      content: "好的，我这边的设计稿已经完成了，稍后发给大家",
      time: "09:32",
      isOwn: true,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      sender: "李工程师",
      content: "技术��案我已经评估过了，可行性很高",
      time: "09:35",
      isOwn: false,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "4",
      sender: "我",
      content: "那我们明天开个会详细讨论一下具体的实施计划",
      time: "09:38",
      isOwn: true,
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const announcements = [
    {
      id: "1",
      title: "公司年会通知",
      content: "2025年公司年会将于12月28日举行，请各部门做好准备工作",
      time: "2025-06-19 14:30",
      priority: "high",
    },
    {
      id: "2",
      title: "系统维护通知",
      content: "本周六晚上22:00-24:00进行系统维护，期间可能影响正常使用",
      time: "2025-06-18 16:20",
      priority: "medium",
    },
    {
      id: "3",
      title: "新员工入职欢迎",
      content: "欢迎市场部新同事王小明加入我们的团队",
      time: "2025-06-17 10:15",
      priority: "low",
    },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("发送消息:", message)
      setMessage("")
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 - 统一风格 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">企业沟通中心</h1>
          <p className="text-gray-600 mt-1">高效的内部沟通协作平台</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white border-0"
          >
            <Video className="w-4 h-4 mr-2" />
            视频会议
          </Button>
          <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            创建群组
          </Button>
        </div>
      </div>

      {/* 统计卡片区域 - 统一风格 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-r-[5px] border-r-blue-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">未读消息</p>
                <p className="text-3xl font-bold text-blue-600">12</p>
                <p className="text-xs text-gray-500 mt-1">需要回复的消息</p>
              </div>
              <MessageCircle className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-green-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">活跃群组</p>
                <p className="text-3xl font-bold text-green-600">8</p>
                <p className="text-xs text-gray-500 mt-1">参与的工作群组</p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-purple-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">在线同事</p>
                <p className="text-3xl font-bold text-purple-600">45</p>
                <p className="text-xs text-gray-500 mt-1">当前在线人数</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-orange-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">今日消息</p>
                <p className="text-3xl font-bold text-orange-600">156</p>
                <p className="text-xs text-gray-500 mt-1">今日收发消息数</p>
              </div>
              <Bell className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* 聊天列表 */}
        <Card className="lg:col-span-1 bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">消息列表</CardTitle>
              <Button size="sm" variant="ghost">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {chatList.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 ${
                    selectedChat === chat.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                  }`}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{chat.name[0]}</AvatarFallback>
                      </Avatar>
                      {chat.type === "group" && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Users className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm truncate">{chat.name}</p>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <Badge className="w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 聊天窗口 */}
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-3 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>团</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">产品开发团队</CardTitle>
                  <p className="text-xs text-muted-foreground">5人在线</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Video className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col h-[400px] p-0">
            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`flex space-x-2 max-w-[70%] ${msg.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div
                        className={`p-3 rounded-lg ${
                          msg.isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-1">
                        {msg.isOwn ? "" : msg.sender + " · "}
                        {msg.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 消息输入框 */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="输入消息..."
                    className="min-h-[60px] pr-20"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <div className="absolute bottom-2 right-2 flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  className="self-end bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 公告和通知 */}
        <Card className="lg:col-span-1 bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-base">公告通知</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="announcements" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="announcements">公告</TabsTrigger>
                <TabsTrigger value="contacts">通讯录</TabsTrigger>
              </TabsList>

              <TabsContent value="announcements" className="space-y-3 mt-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{announcement.title}</h4>
                      <Badge
                        variant={
                          announcement.priority === "high"
                            ? "destructive"
                            : announcement.priority === "medium"
                              ? "outline"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {announcement.priority === "high"
                          ? "重要"
                          : announcement.priority === "medium"
                            ? "普通"
                            : "一般"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{announcement.content}</p>
                    <p className="text-xs text-muted-foreground">{announcement.time}</p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="contacts" className="space-y-3 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>张</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">张经理</p>
                      <p className="text-xs text-muted-foreground">总经理</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>

                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>李</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">李工程师</p>
                      <p className="text-xs text-muted-foreground">技术部</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>

                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>王</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">王主管</p>
                      <p className="text-xs text-muted-foreground">销售部</p>
                    </div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
