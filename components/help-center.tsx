/**
 * @fileoverview help-center.tsx
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
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  FileText,
  Video,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Clock,
  Star,
  User,
  ChevronDown,
  BookOpen,
  PlayCircle,
  MessageCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface HelpArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  views: number
  likes: number
  dislikes: number
  lastUpdated: Date
  author: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

interface VideoTutorial {
  id: string
  title: string
  description: string
  duration: string
  thumbnail: string
  category: string
  views: number
  rating: number
  author: string
  publishedAt: Date
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
  notHelpful: number
}

export function HelpCenter() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("articles")

  const [articles] = useState<HelpArticle[]>([
    {
      id: "1",
      title: "如何创建新客户档案",
      content:
        "详细介绍如何在系统中创建和管理客户档案的步骤。首先登录系统，进入客户管理模块，点击新建客户按钮，填写客户基本信息包括姓名、联系方式、地址等必要信息，然后保存即可完成客户档案创建。",
      category: "客户管理",
      tags: ["客户", "创建", "档案"],
      views: 1250,
      likes: 45,
      dislikes: 3,
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      author: "系统管理员",
      difficulty: "beginner",
    },
    {
      id: "2",
      title: "财务报表生成指南",
      content:
        "学习如何生成各种财务报表，包括收入、支出和利润分析。进入财务管理模块，选择报表类型，设置时间范围，选择需要的数据维度，点击生成报表按钮即可获得详细的财务分析报告。",
      category: "财务管理",
      tags: ["财务", "报表", "分析"],
      views: 890,
      likes: 32,
      dislikes: 1,
      lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      author: "财务专员",
      difficulty: "intermediate",
    },
    {
      id: "3",
      title: "系统权限配置详解",
      content:
        "深入了解系统权限管理，包括角色创建、权限分配等高级功能。管理员可以创建不同的用户角色，为每个角色分配相应的功能权限，确保系统安全性和数据保护。",
      category: "系统管理",
      tags: ["权限", "角色", "安全"],
      views: 567,
      likes: 28,
      dislikes: 2,
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      author: "技术支持",
      difficulty: "advanced",
    },
    {
      id: "4",
      title: "数据导入导出操作",
      content:
        "了解如何批量导入客户数据和导出业务报表。支持Excel、CSV等多种格式，可以快速完成大量数据的处理和分析工作。",
      category: "数据管理",
      tags: ["导入", "导出", "Excel"],
      views: 723,
      likes: 38,
      dislikes: 2,
      lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      author: "数据分析师",
      difficulty: "intermediate",
    },
  ])

  const [videos] = useState<VideoTutorial[]>([
    {
      id: "1",
      title: "系统快速入门教程",
      description: "5分钟快速了解系统的基本功能和操作流程，适合新用户快速上手",
      duration: "5:32",
      thumbnail: "/placeholder.svg?height=200&width=300&text=系统入门教程",
      category: "入门教程",
      views: 2340,
      rating: 4.8,
      author: "产品经理",
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      title: "客户管理模块详解",
      description: "详细演示客户管理模块的各项功能和最佳实践，包括客户创建、编辑、分类等操作",
      duration: "12:45",
      thumbnail: "/placeholder.svg?height=200&width=300&text=客户管理教程",
      category: "功能教程",
      views: 1890,
      rating: 4.6,
      author: "培训师",
      publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      title: "数据分析与报表制作",
      description: "学习如何使用系统的分析工具创建专业的业务报表，掌握数据可视化技巧",
      duration: "18:20",
      thumbnail: "/placeholder.svg?height=200&width=300&text=数据分析教程",
      category: "高级功能",
      views: 1456,
      rating: 4.9,
      author: "数据分析师",
      publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
    {
      id: "4",
      title: "移动端使用指南",
      description: "了解如何在手机和平板设备上使用系统，随时随地管理业务",
      duration: "8:15",
      thumbnail: "/placeholder.svg?height=200&width=300&text=移动端教程",
      category: "移动应用",
      views: 1123,
      rating: 4.5,
      author: "移动开发工程师",
      publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    },
  ])

  const [faqs] = useState<FAQ[]>([
    {
      id: "1",
      question: "如何重置密码？",
      answer:
        "您可以在登录页面点击“忘记密码”链接，输入您的邮箱地址，系统会发送重置密码的邮件到您的邮箱。请检查邮箱（包括垃圾邮件文件夹），点击邮件中的重置链接，设置新密码即可。",
      category: "账户管理",
      helpful: 156,
      notHelpful: 8,
    },
    {
      id: "2",
      question: "系统支持哪些浏览器？",
      answer:
        "系统支持Chrome、Firefox、Safari、Edge等主流浏览器的最新版本。我们建议使用Chrome浏览器以获得最佳体验。如果遇到兼容性问题，请确保浏览器已更新到最新版本。",
      category: "系统要求",
      helpful: 120,
      notHelpful: 5,
    },
    {
      id: "3",
      question: "如何导出数据报表？",
      answer:
        "在任何数据列表页面，您可以点击页面右上角的“导出”按钮，选择CSV或Excel格式导出当前视图的数据。导出的文件将包含当前筛选条件下的所有数据记录。",
      category: "数据管理",
      helpful: 98,
      notHelpful: 3,
    },
    {
      id: "4",
      question: "如何联系技术支持？",
      answer:
        "您可以通过以下方式联系我们的技术支持团队：1) 在线客服（工作时间9:00-18:00）；2) 发送邮件至support@jinlan.com；3) 拨打客服热线400-888-8888。我们会在24小时内回复您的问题。",
      category: "技术支持",
      helpful: 89,
      notHelpful: 2,
    },
    {
      id: "5",
      question: "数据安全如何保障？",
      answer:
        "我们采用多层安全防护措施：1) 数据传输采用SSL加密；2) 数据库定期备份；3) 严格的权限控制；4) 定期安全审计。您的数据安全是我们的首要任务。",
      category: "安全保障",
      helpful: 134,
      notHelpful: 6,
    },
  ])

  const uniqueCategories = [
    "all",
    ...new Set([...articles.map((a) => a.category), ...videos.map((v) => v.category), ...faqs.map((f) => f.category)]),
  ]

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const filteredVideos = videos.filter((video) => {
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getDifficultyBadge = (difficulty: HelpArticle["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return <Badge className="bg-green-100 text-green-800">初级</Badge>
      case "intermediate":
        return <Badge className="bg-yellow-100 text-yellow-800">中级</Badge>
      case "advanced":
        return <Badge className="bg-red-100 text-red-800">高级</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">未知</Badge>
    }
  }

  const handleArticleClick = (articleId: string) => {
    toast({
      title: "查看文章",
      description: `正在打开文章详情页面`,
    })
  }

  const handleVideoClick = (videoId: string) => {
    toast({
      title: "播放视频",
      description: `正在加载视频教程`,
    })
  }

  const handleFeedback = (type: "helpful" | "notHelpful", faqId: string) => {
    toast({
      title: "反馈已提交",
      description: `感谢您的${type === "helpful" ? "好评" : "反馈"}`,
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">帮助中心</h1>
        <p className="text-slate-600 mb-6">查找常见问题的答案、观看教程视频或阅读详细指南</p>

        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="搜索帮助文档、视频教程或常见问题..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 text-lg"
          />
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">帮助文章</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{articles.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">视频教程</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{videos.length}</p>
              </div>
              <Video className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">常见问题</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{faqs.length}</p>
              </div>
              <HelpCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选器 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "所有分类" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 主要内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            帮助文章
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            视频教程
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            常见问题
          </TabsTrigger>
        </TabsList>

        {/* 帮助文章 */}
        <TabsContent value="articles" className="space-y-6">
          {filteredArticles.length > 0 ? (
            <div className="space-y-6">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 cursor-pointer"
                  onClick={() => handleArticleClick(article.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      {getDifficultyBadge(article.difficulty)}
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.lastUpdated.toLocaleDateString()}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2">{article.content}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {article.views}
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {article.likes}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {article.author}
                        </div>
                      </div>
                      <Badge variant="outline">{article.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的文章</h3>
                <p className="text-gray-500 mb-4">请尝试使用不同的搜索词或选择其他分类</p>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  清除搜索
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 视频教程 */}
        <TabsContent value="videos" className="space-y-6">
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card
                  key={video.id}
                  className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleVideoClick(video.id)}
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-t-xl group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="w-16 h-16 text-white" />
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline">{video.category}</Badge>
                      <div className="flex items-center text-yellow-500 text-sm">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        {video.rating.toFixed(1)}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {video.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{video.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {video.views}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {video.publishedAt.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {video.author}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm">
              <CardContent className="p-12 text-center">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的视频</h3>
                <p className="text-gray-500 mb-4">请尝试使用不同的搜索词或选择其他分类</p>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  清除搜索
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 常见问题 */}
        <TabsContent value="faqs" className="space-y-4">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card
                  key={faq.id}
                  className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300"
                >
                  <CardContent className="p-0">
                    <details className="group">
                      <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                        <h3 className="text-lg font-medium text-gray-900 pr-4">{faq.question}</h3>
                        <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-300 group-open:rotate-180" />
                      </summary>

                      <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                        <p className="text-gray-600 mb-4 leading-relaxed">{faq.answer}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFeedback("helpful", faq.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              有帮助 ({faq.helpful})
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleFeedback("notHelpful", faq.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <ThumbsDown className="w-4 h-4 mr-1" />
                              没帮助 ({faq.notHelpful})
                            </Button>
                          </div>
                          <Badge variant="outline">{faq.category}</Badge>
                        </div>
                      </div>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm">
              <CardContent className="p-12 text-center">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的常见问题</h3>
                <p className="text-gray-500 mb-4">请尝试使用不同的搜索词或选择其他分类</p>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  清除搜索
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
