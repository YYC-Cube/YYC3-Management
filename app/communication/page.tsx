"use client"

import { PageContainer } from "@/components/layout/page-container"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Users, Send, Phone, Video, Plus, Search, Paperclip } from "lucide-react"

export default function CommunicationPage() {
  return (
    <PageContainer title="团队沟通" description="与团队成员实时沟通协作">
      <div className="space-y-6">
        {/* 页面操作区 */}
        <div className="flex items-center justify-between">
          <div></div>
          <div className="flex gap-2">
            <EnhancedButton variant="outline">
              <Video className="w-4 h-4 mr-2" />
              视频会议
            </EnhancedButton>
            <EnhancedButton className="bg-purple-600 hover:bg-purple-700 border-r-4 border-r-purple-500 shadow-[4px_0_12px_rgba(168,85,247,0.15)]">
              <Plus className="w-4 h-4 mr-2 text-white" />
              新建群组
            </EnhancedButton>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedCard className="border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(168,85,247,0.15)] hover:border-r-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">活跃群组</p>
                <p className="text-2xl font-bold text-slate-800">12</p>
                <p className="text-xs text-purple-600 mt-1">正在使用</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(168,85,247,0.15)] hover:border-r-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">今日消息</p>
                <p className="text-2xl font-bold text-slate-800">156</p>
                <p className="text-xs text-purple-600 mt-1">↑ 23% 较昨日</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(168,85,247,0.15)] hover:border-r-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">在线成员</p>
                <p className="text-2xl font-bold text-slate-800">28</p>
                <p className="text-xs text-purple-600 mt-1">当前在线</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard className="border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(168,85,247,0.15)] hover:border-r-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">未读消息</p>
                <p className="text-2xl font-bold text-slate-800">5</p>
                <p className="text-xs text-purple-600 mt-1">需要处理</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* 沟通界面 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 群组列表 */}
          <EnhancedCard className="border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(168,85,247,0.15)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">群组列表</h2>
              <EnhancedButton size="sm" variant="outline">
                <Search className="w-4 h-4" />
              </EnhancedButton>
            </div>
            <div className="space-y-2">
              {[
                { name: "产品开发团队", members: 8, unread: 3, online: true },
                { name: "市场营销部", members: 12, unread: 0, online: true },
                { name: "客户服务组", members: 6, unread: 2, online: false },
                { name: "财务部门", members: 4, unread: 0, online: true },
                { name: "人力资源", members: 5, unread: 1, online: false },
              ].map((group, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {group.name.charAt(0)}
                      </div>
                      {group.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{group.name}</p>
                      <p className="text-sm text-slate-600">{group.members} 成员</p>
                    </div>
                  </div>
                  {group.unread > 0 && <Badge className="bg-red-500 text-white">{group.unread}</Badge>}
                </div>
              ))}
            </div>
          </EnhancedCard>

          {/* 聊天区域 */}
          <div className="lg:col-span-2">
            <EnhancedCard className="h-[600px] flex flex-col">
              {/* 聊天头部 */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    产
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800">产品开发团队</h3>
                    <p className="text-sm text-slate-600">8 名成员，5 人在线</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <EnhancedButton size="sm" variant="outline">
                    <Phone className="w-4 h-4" />
                  </EnhancedButton>
                  <EnhancedButton size="sm" variant="outline">
                    <Video className="w-4 h-4" />
                  </EnhancedButton>
                </div>
              </div>

              {/* 消息列表 */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {[
                  { sender: "张三", message: "大家好，今天的产品评审会议准备得怎么样了？", time: "10:30", isMe: false },
                  { sender: "我", message: "已经准备好了，PPT和原型都已经完成", time: "10:32", isMe: true },
                  { sender: "李四", message: "我这边的技术方案也准备好了，可以开始了", time: "10:33", isMe: false },
                  { sender: "王五", message: "好的，那我们现在开始吧", time: "10:35", isMe: false },
                ].map((msg, index) => (
                  <div key={index} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.isMe ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {!msg.isMe && <p className="text-xs font-medium mb-1">{msg.sender}</p>}
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.isMe ? "text-sky-100" : "text-slate-500"}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 输入区域 */}
              <div className="p-4 border-t border-slate-200">
                <div className="space-y-2">
                  <Label htmlFor="message-input" className="sr-only">输入消息</Label>
                  <div className="flex items-center gap-2">
                    <EnhancedButton size="sm" variant="outline">
                      <Paperclip className="w-4 h-4" />
                    </EnhancedButton>
                    <Input
                      id="message-input"
                      placeholder="输入消息..."
                      className="flex-1"
                    />
                    <EnhancedButton className="bg-sky-600 hover:bg-sky-700">
                      <Send className="w-4 h-4" />
                    </EnhancedButton>
                  </div>
                </div>
              </div>
            </EnhancedCard>
          </div>
        </div>
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
