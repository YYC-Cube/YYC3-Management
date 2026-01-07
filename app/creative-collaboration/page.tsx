"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import {
  Lightbulb,
  Users,
  Zap,
  Brain,
  Palette,
  FileText,
  MessageSquare,
  CheckCircle,
  Star,
  TrendingUp,
  Target,
  Rocket,
  Sparkles,
  Plus,
  Eye,
  ThumbsUp,
  Share2,
  Edit3,
  Calendar,
  Search,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CreativeProject {
  id: string
  title: string
  description: string
  status: "planning" | "in-progress" | "review" | "completed"
  priority: "low" | "medium" | "high"
  progress: number
  team: string[]
  deadline: string
  tags: string[]
  aiAssisted: boolean
}

interface CreativeIdea {
  id: string
  title: string
  description: string
  author: string
  likes: number
  category: string
  timestamp: string
  aiGenerated: boolean
}

export default function CreativeCollaborationPage() {
  const [activeTab, setActiveTab] = useState("projects")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const [projects] = useState<CreativeProject[]>([
    {
      id: "1",
      title: "春季家居营销方案",
      description: "结合AI分析用户偏好，制定个性化营销策略",
      status: "in-progress",
      priority: "high",
      progress: 75,
      team: ["张设计", "李文案", "王策划"],
      deadline: "2024-01-15",
      tags: ["营销", "AI辅助", "家居"],
      aiAssisted: true,
    },
    {
      id: "2",
      title: "品牌视觉升级项目",
      description: "全新品牌形象设计与VI系统建设",
      status: "review",
      priority: "medium",
      progress: 90,
      team: ["陈美工", "刘总监"],
      deadline: "2024-01-20",
      tags: ["设计", "品牌", "视觉"],
      aiAssisted: false,
    },
    {
      id: "3",
      title: "智能客服话术优化",
      description: "基于AI对话分析，优化客服响应效率",
      status: "planning",
      priority: "high",
      progress: 25,
      team: ["王客服", "李技术"],
      deadline: "2024-01-25",
      tags: ["AI", "客服", "优化"],
      aiAssisted: true,
    },
  ])

  const [ideas] = useState<CreativeIdea[]>([
    {
      id: "1",
      title: "AR家具试放功能",
      description: "让客户通过手机AR技术在家中预览家具摆放效果",
      author: "张创新",
      likes: 24,
      category: "技术创新",
      timestamp: "2小时前",
      aiGenerated: false,
    },
    {
      id: "2",
      title: "智能家居搭配推荐",
      description: "基于用户喜好和空间特点，AI推荐最佳家具搭配方案",
      author: "AI助手",
      likes: 18,
      category: "AI应用",
      timestamp: "4小时前",
      aiGenerated: true,
    },
    {
      id: "3",
      title: "社区化装修分享平台",
      description: "打造用户装修经验分享社区，增强品牌粘性",
      author: "李产品",
      likes: 31,
      category: "产品策略",
      timestamp: "1天前",
      aiGenerated: false,
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-orange-100 text-orange-800"
      case "review":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "planning":
        return "规划中"
      case "in-progress":
        return "进行中"
      case "review":
        return "评审中"
      case "completed":
        return "已完成"
      default:
        return "未知"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-orange-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const handleCreateProject = () => {
    toast({
      title: "创建项目",
      description: "新建创意协作项目功能开发中...",
    })
  }

  const handleCreateIdea = () => {
    toast({
      title: "提交创意",
      description: "创意想法已提交到创意库！",
    })
  }

  const handleAIBrainstorm = () => {
    toast({
      title: "AI头脑风暴",
      description: "正在为您生成创意灵感...",
    })
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
              <Lightbulb className="w-8 h-8 mr-3 text-purple-600" />
              智创协同
            </h1>
            <p className="text-slate-600 mt-2">AI驱动的创意协作平台，激发团队无限创造力</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleAIBrainstorm}>
              <Brain className="w-4 h-4 mr-2" />
              AI头脑风暴
            </Button>
            <Button
              onClick={handleCreateProject}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              新建项目
            </Button>
          </div>
        </div>

        {/* 数据概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border border-purple-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-purple-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">活跃项目</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">12</p>
                </div>
                <Rocket className="w-8 h-8 text-purple-500" />
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+15% 本月</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-pink-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-pink-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-pink-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">创意想法</p>
                  <p className="text-2xl font-bold text-pink-600 mt-1">156</p>
                </div>
                <Lightbulb className="w-8 h-8 text-pink-500" />
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-green-600">
                  <Sparkles className="w-4 h-4 mr-1" />
                  <span>+8 今日新增</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-blue-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">协作成员</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">28</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-blue-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span>15人在线</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-green-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-green-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">AI辅助率</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">85%</p>
                </div>
                <Brain className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-green-600">
                  <Zap className="w-4 h-4 mr-1" />
                  <span>效率提升40%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容区域 */}
        <div className="border-t-4 border-t-purple-400 pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="projects">创意项目</TabsTrigger>
              <TabsTrigger value="ideas">创意库</TabsTrigger>
              <TabsTrigger value="collaboration">团队协作</TabsTrigger>
              <TabsTrigger value="ai-tools">AI工具</TabsTrigger>
              <TabsTrigger value="analytics">数据分析</TabsTrigger>
            </TabsList>

            {/* 创意项目 */}
            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-search" className="sr-only">搜索项目</Label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="project-search"
                        placeholder="搜索项目..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">全部状态</option>
                    <option value="planning">规划中</option>
                    <option value="in-progress">进行中</option>
                    <option value="review">评审中</option>
                    <option value="completed">已完成</option>
                  </select>
                </div>
                <Button onClick={handleCreateProject} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Plus className="w-4 h-4 mr-2" />
                  新建项目
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-white/90 backdrop-blur-sm border border-purple-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-purple-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-purple-500 group"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {project.title}
                            {project.aiAssisted && (
                              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                                <Brain className="w-3 h-3 mr-1" />
                                AI辅助
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-2">{project.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>项目进度</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{project.deadline}</span>
                          </div>
                          <div className="flex -space-x-2">
                            {project.team.slice(0, 3).map((member, index) => (
                              <Avatar key={index} className="w-6 h-6 border-2 border-white">
                                <AvatarFallback className="text-xs bg-purple-100 text-purple-600">
                                  {member.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {project.team.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-gray-600">+{project.team.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {project.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              查看
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit3 className="w-4 h-4 mr-1" />
                              编辑
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* 创意库 */}
            <TabsContent value="ideas" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">创意想法库</h3>
                <Button onClick={handleCreateIdea} className="bg-gradient-to-r from-pink-600 to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  提交创意
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ideas.map((idea) => (
                  <Card
                    key={idea.id}
                    className="bg-white/90 backdrop-blur-sm border border-pink-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-pink-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-pink-500 group"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {idea.title}
                            {idea.aiGenerated && (
                              <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-200">
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI生成
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-2">{idea.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs bg-pink-100 text-pink-600">
                                {idea.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">{idea.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-pink-50 text-pink-700">
                              {idea.category}
                            </Badge>
                            <span className="text-xs text-gray-500">{idea.timestamp}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {idea.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              评论
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Star className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* 团队协作 */}
            <TabsContent value="collaboration" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/90 backdrop-blur-sm border border-blue-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-300/60 transition-all duration-300 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      在线团队成员
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["张设计师", "李文案", "王策划", "陈美工", "刘总监"].map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-blue-100 text-blue-600">{member.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900">{member}</p>
                              <p className="text-sm text-green-600">在线</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border border-green-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-green-300/60 transition-all duration-300 border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                      实时协作动态
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs bg-green-100 text-green-600">张</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">张设计师</span> 更新了春季营销方案的设计稿
                          </p>
                          <p className="text-xs text-gray-500">2分钟前</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs bg-green-100 text-green-600">李</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">李文案</span> 提交了新的创意想法
                          </p>
                          <p className="text-xs text-gray-500">5分钟前</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs bg-green-100 text-green-600">AI</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">AI助手</span> 生成了3个新的营销创意
                          </p>
                          <p className="text-xs text-gray-500">10分钟前</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI工具 */}
            <TabsContent value="ai-tools" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white/90 backdrop-blur-sm border border-purple-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-purple-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-purple-500 group cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-6 h-6 mr-2 text-purple-600" />
                      AI创意生成器
                    </CardTitle>
                    <CardDescription>基于行业趋势和用户数据，智能生成创意方案</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">今日使用次数</span>
                        <Badge className="bg-purple-100 text-purple-800">15次</Badge>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                        <Sparkles className="w-4 h-4 mr-2" />
                        开始创作
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border border-pink-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-pink-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-pink-500 group cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="w-6 h-6 mr-2 text-pink-600" />
                      智能设计助手
                    </CardTitle>
                    <CardDescription>AI辅助设计，自动生成配色方案和布局建议</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">设计模板</span>
                        <Badge className="bg-pink-100 text-pink-800">200+</Badge>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800">
                        <Palette className="w-4 h-4 mr-2" />
                        开始设计
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border border-blue-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-blue-500 group cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-6 h-6 mr-2 text-blue-600" />
                      智能文案生成
                    </CardTitle>
                    <CardDescription>根据产品特点和目标用户，生成吸引人的营销文案</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">文案风格</span>
                        <Badge className="bg-blue-100 text-blue-800">12种</Badge>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                        <FileText className="w-4 h-4 mr-2" />
                        生成文案
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border border-green-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-green-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-green-500 group cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-6 h-6 mr-2 text-green-600" />
                      市场趋势分析
                    </CardTitle>
                    <CardDescription>AI分析市场数据，预测行业趋势和用户需求</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">数据源</span>
                        <Badge className="bg-green-100 text-green-800">实时更新</Badge>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        查看趋势
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border border-orange-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-orange-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-orange-500 group cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="w-6 h-6 mr-2 text-orange-600" />
                      创意评估器
                    </CardTitle>
                    <CardDescription>AI评估创意可行性，提供改进建议和风险分析</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">评估维度</span>
                        <Badge className="bg-orange-100 text-orange-800">8个</Badge>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        开始评估
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border border-indigo-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-indigo-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-indigo-500 group cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Rocket className="w-6 h-6 mr-2 text-indigo-600" />
                      项目智能规划
                    </CardTitle>
                    <CardDescription>AI制定项目计划，优化资源配置和时间安排</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">成功率</span>
                        <Badge className="bg-indigo-100 text-indigo-800">92%</Badge>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800">
                        <Calendar className="w-4 h-4 mr-2" />
                        智能规划
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 数据分析 */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/90 backdrop-blur-sm border border-blue-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-300/60 transition-all duration-300 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      创意效果分析
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">创意采用率</span>
                        <span className="font-semibold text-blue-600">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">平均评分</span>
                        <span className="font-semibold text-blue-600">4.6/5.0</span>
                      </div>
                      <Progress value={92} className="h-2" />

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">实施成功率</span>
                        <span className="font-semibold text-blue-600">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border border-green-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-green-300/60 transition-all duration-300 border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-600" />
                      团队协作效率
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">项目按时完成率</span>
                        <span className="font-semibold text-green-600">91%</span>
                      </div>
                      <Progress value={91} className="h-2" />

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">团队满意度</span>
                        <span className="font-semibold text-green-600">4.8/5.0</span>
                      </div>
                      <Progress value={96} className="h-2" />

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">沟通效率提升</span>
                        <span className="font-semibold text-green-600">+45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/90 backdrop-blur-sm border border-purple-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-purple-300/60 transition-all duration-300 border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-600" />
                    AI辅助效果统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">40%</div>
                      <div className="text-sm text-gray-600">创意生成效率提升</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">65%</div>
                      <div className="text-sm text-gray-600">设计时间节省</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
                      <div className="text-sm text-gray-600">用户满意度</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <FloatingNavButtons />
    </>
  )
}
