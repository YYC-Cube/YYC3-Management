/**
 * @fileoverview team-collaboration.tsx
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  MessageSquare,
  Share2,
  Eye,
  ThumbsUp,
  MessageCircle,
  Send,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
} from "lucide-react"

interface TeamCollaborationProps {
  showTitle?: boolean
}

interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  avatar: string
  status: "online" | "offline" | "busy"
  okrCount: number
  completionRate: number
}

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  replies: Reply[]
}

interface Reply {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
}

interface SharedOKR {
  id: string
  title: string
  owner: string
  department: string
  progress: number
  status: "on-track" | "at-risk" | "off-track"
  sharedWith: string[]
  comments: Comment[]
  lastUpdate: string
  priority: "high" | "medium" | "low"
}

export function TeamCollaboration({ showTitle = true }: TeamCollaborationProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [newComment, setNewComment] = useState("")
  const [selectedOKR, setSelectedOKR] = useState<string | null>(null)

  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "张经理",
      role: "总经理",
      department: "管理层",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      okrCount: 3,
      completionRate: 85,
    },
    {
      id: "2",
      name: "李工程师",
      role: "技术主管",
      department: "技术部",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      okrCount: 5,
      completionRate: 72,
    },
    {
      id: "3",
      name: "王主管",
      role: "销售主管",
      department: "销售部",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "busy",
      okrCount: 4,
      completionRate: 90,
    },
    {
      id: "4",
      name: "陈专员",
      role: "客服专员",
      department: "客服部",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      okrCount: 2,
      completionRate: 65,
    },
  ]

  const sharedOKRs: SharedOKR[] = [
    {
      id: "1",
      title: "提升客户满意度和服务质量",
      owner: "张经理",
      department: "客服部",
      progress: 75,
      status: "on-track",
      sharedWith: ["李工程师", "王主管", "陈专员"],
      lastUpdate: "2025-06-28 10:30",
      priority: "high",
      comments: [
        {
          id: "c1",
          author: "李工程师",
          avatar: "/placeholder.svg?height=32&width=32",
          content: "技术支持系统已经优化完成，应该能提升客户体验",
          timestamp: "2025-06-28 09:15",
          likes: 3,
          replies: [
            {
              id: "r1",
              author: "张经理",
              avatar: "/placeholder.svg?height=32&width=32",
              content: "很好，这个优化对我们的目标很有帮助",
              timestamp: "2025-06-28 09:30",
            },
          ],
        },
        {
          id: "c2",
          author: "陈专员",
          avatar: "/placeholder.svg?height=32&width=32",
          content: "客户反馈收集系统运行良好，数据质量有明显提升",
          timestamp: "2025-06-28 08:45",
          likes: 2,
          replies: [],
        },
      ],
    },
    {
      id: "2",
      title: "数字化转型和系统优化",
      owner: "李工程师",
      department: "技术部",
      progress: 60,
      status: "at-risk",
      sharedWith: ["张经理", "王主管"],
      lastUpdate: "2025-06-27 16:20",
      priority: "high",
      comments: [
        {
          id: "c3",
          author: "张经理",
          avatar: "/placeholder.svg?height=32&width=32",
          content: "进度有些滞后，需要额外的资源支持吗？",
          timestamp: "2025-06-27 14:30",
          likes: 1,
          replies: [],
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-track":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case "at-risk":
        return <AlertCircle className="w-4 h-4 text-amber-500" />
      case "off-track":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-slate-500" />
    }
  }

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "busy":
        return "bg-amber-500"
      case "offline":
        return "bg-slate-400"
      default:
        return "bg-slate-400"
    }
  }

  const handleAddComment = (okrId: string) => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: "当前用户",
      avatar: "/placeholder.svg?height=32&width=32",
      content: newComment,
      timestamp: new Date().toLocaleString("zh-CN"),
      likes: 0,
      replies: [],
    }

    // 这里应该更新实际的数据
    setNewComment("")
    toast({
      title: "评论已发布",
      description: "您的评论已成功添加",
    })
  }

  const handleShareOKR = (okrId: string) => {
    toast({
      title: "OKR已分享",
      description: "目标已分享给团队成员",
    })
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <>
          {/* 页面头部 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">团队协作中心</h1>
              <p className="text-slate-600 mt-1">共享目标，协同合作，共同成长</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white border-0"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享目标
              </Button>
              <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                邀请成员
              </Button>
            </div>
          </div>
        </>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-r-[5px] border-r-blue-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">团队成员</p>
                <p className="text-3xl font-bold text-blue-600">{teamMembers.length}</p>
                <p className="text-xs text-slate-500 mt-1">活跃协作者</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-green-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">共享目标</p>
                <p className="text-3xl font-bold text-green-600">{sharedOKRs.length}</p>
                <p className="text-xs text-slate-500 mt-1">正在协作中</p>
              </div>
              <Target className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-purple-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">团队评论</p>
                <p className="text-3xl font-bold text-purple-600">
                  {sharedOKRs.reduce((total, okr) => total + okr.comments.length, 0)}
                </p>
                <p className="text-xs text-slate-500 mt-1">本周新增</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-amber-400 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">平均完成率</p>
                <p className="text-3xl font-bold text-amber-600">
                  {Math.round(teamMembers.reduce((sum, member) => sum + member.completionRate, 0) / teamMembers.length)}
                  %
                </p>
                <p className="text-xs text-slate-500 mt-1">团队整体表现</p>
              </div>
              <TrendingUp className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容区域 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-sky-100">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            团队看板
          </TabsTrigger>
          <TabsTrigger value="shared" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            共享目标
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            反馈协作
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* 团队成员看板 */}
          <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-500" />
                团队成员看板
              </CardTitle>
              <CardDescription>实时查看团队成员的OKR进展情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 border border-sky-200 rounded-lg bg-sky-50/30 hover:bg-sky-50/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getUserStatusColor(
                            member.status,
                          )}`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{member.name}</h4>
                        <p className="text-sm text-slate-600">{member.role}</p>
                        <p className="text-xs text-slate-500">{member.department}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">OKR数量</span>
                        <Badge variant="outline">{member.okrCount}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">完成率</span>
                        <span className="text-sm font-medium text-slate-800">{member.completionRate}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${member.completionRate}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                        <Eye className="w-3 h-3 mr-1" />
                        查看
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        沟通
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared" className="space-y-6">
          {/* 共享目标列表 */}
          <div className="space-y-4">
            {sharedOKRs.map((okr) => (
              <Card
                key={okr.id}
                className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg text-slate-800">{okr.title}</CardTitle>
                        <Badge className={getStatusColor(okr.status)} variant="outline">
                          {getStatusIcon(okr.status)}
                          <span className="ml-1">
                            {okr.status === "on-track"
                              ? "进展顺利"
                              : okr.status === "at-risk"
                                ? "存在风险"
                                : "进度滞后"}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>负责人: {okr.owner}</span>
                        <span>部门: {okr.department}</span>
                        <span>最后更新: {okr.lastUpdate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-800">{okr.progress}%</div>
                      <div className="w-20 mt-1">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full"
                            style={{ width: `${okr.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-slate-600 mb-2">协作成员</h4>
                      <div className="flex items-center gap-2">
                        {okr.sharedWith.map((member, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShareOKR(okr.id)}
                        className="border-sky-200 text-sky-700 hover:bg-sky-50 bg-transparent"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        分享
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-sky-200 text-sky-700 hover:bg-sky-50 bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        查看详情
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setSelectedOKR(okr.id)}
                        className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        参与讨论
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          {/* 反馈和评论系统 */}
          <Card className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-sky-500" />
                团队反馈与协作
              </CardTitle>
              <CardDescription>实时沟通，共同推进目标达成</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sharedOKRs.map((okr) => (
                  <div key={okr.id} className="border border-sky-200 rounded-lg p-4 bg-sky-50/30">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-slate-800">{okr.title}</h4>
                      <Badge className={getStatusColor(okr.status)} variant="outline">
                        {okr.progress}%
                      </Badge>
                    </div>

                    {/* 评论列表 */}
                    <ScrollArea className="h-64 mb-4">
                      <div className="space-y-3">
                        {okr.comments.map((comment) => (
                          <div key={comment.id} className="bg-white p-3 rounded-lg border border-sky-100">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{comment.author[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm text-slate-800">{comment.author}</span>
                                  <span className="text-xs text-slate-500">{comment.timestamp}</span>
                                </div>
                                <p className="text-sm text-slate-600 mb-2">{comment.content}</p>
                                <div className="flex items-center gap-3">
                                  <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-sky-600">
                                    <ThumbsUp className="w-3 h-3" />
                                    {comment.likes}
                                  </button>
                                  <button className="text-xs text-slate-500 hover:text-sky-600">回复</button>
                                </div>
                                {/* 回复列表 */}
                                {comment.replies.length > 0 && (
                                  <div className="mt-3 ml-4 space-y-2">
                                    {comment.replies.map((reply) => (
                                      <div key={reply.id} className="bg-sky-50 p-2 rounded">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-medium text-xs text-slate-700">{reply.author}</span>
                                          <span className="text-xs text-slate-500">{reply.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-slate-600">{reply.content}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* 添加评论 */}
                    <div className="flex gap-2">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="添加您的评论或建议..."
                        className="flex-1 min-h-[60px]"
                      />
                      <Button
                        onClick={() => handleAddComment(okr.id)}
                        disabled={!newComment.trim()}
                        className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
