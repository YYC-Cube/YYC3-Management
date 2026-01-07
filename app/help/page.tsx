"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import {
  Search,
  BookOpen,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Video,
  Settings,
  HelpCircle,
  ExternalLink,
  Download,
  Clock,
  CheckCircle,
  Star,
  ThumbsUp,
  Eye,
} from "lucide-react"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const quickLinks = [
    {
      title: "快速入门指南",
      description: "了解系统基本功能和操作流程",
      icon: BookOpen,
      badge: "推荐",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "视频教程",
      description: "观看详细的操作演示视频",
      icon: Video,
      badge: "热门",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "常见问题",
      description: "查找常见问题的解决方案",
      icon: HelpCircle,
      badge: "FAQ",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "联系支持",
      description: "获取专业的技术支持服务",
      icon: MessageCircle,
      badge: "24/7",
      color: "bg-orange-50 text-orange-600",
    },
  ]

  const faqData = [
    {
      question: "如何重置密码？",
      answer: "您可以在登录页面点击“忘记密码”链接，输入您的邮箱地址，系统会发送重置密码的邮件到您的邮箱。",
      helpful: 45,
      views: 234,
    },
    {
      question: "如何添加新用户？",
      answer: "管理员可以在系统设置 > 用户管理中添加新用户，填写用户基本信息并分配相应的角色权限。",
      helpful: 38,
      views: 189,
    },
    {
      question: "数据如何备份？",
      answer: "系统支持自动备份和手动备份两种方式。自动备份每天凌晨2点执行，手动备份可在系统管理 > 数据备份中操作。",
      helpful: 52,
      views: 312,
    },
    {
      question: "如何导出报表？",
      answer: "在各个模块的报表页面，点击导出按钮，选择导出格式（Excel、PDF等），系统会生成相应的报表文件。",
      helpful: 29,
      views: 156,
    },
    {
      question: "移动端如何使用？",
      answer: "系统支持PWA技术，可以在手机浏览器中添加到主屏幕，获得类似原生应用的体验。",
      helpful: 33,
      views: 198,
    },
  ]

  const contactMethods = [
    {
      title: "在线客服",
      description: "工作日 9:00-18:00",
      icon: MessageCircle,
      action: "立即咨询",
      color: "bg-blue-500",
    },
    {
      title: "技术热线",
      description: "400-888-8888",
      icon: Phone,
      action: "拨打电话",
      color: "bg-green-500",
    },
    {
      title: "邮件支持",
      description: "support@jinlan.com",
      icon: Mail,
      action: "发送邮件",
      color: "bg-purple-500",
    },
  ]

  const resources = [
    {
      title: "用户手册",
      description: "完整的系统使用说明",
      type: "PDF",
      size: "2.5MB",
      downloads: "1,234",
      rating: 4.8,
    },
    {
      title: "API文档",
      description: "开发者接口文档",
      type: "HTML",
      size: "1.2MB",
      downloads: "567",
      rating: 4.6,
    },
    {
      title: "培训视频",
      description: "系统操作培训视频集",
      type: "MP4",
      size: "156MB",
      downloads: "890",
      rating: 4.9,
    },
    {
      title: "移动端指南",
      description: "移动端使用完整指南",
      type: "PDF",
      size: "1.8MB",
      downloads: "456",
      rating: 4.5,
    },
  ]

  const tutorials = [
    {
      title: "系统快速入门",
      description: "15分钟掌握系统基本操作",
      duration: "15分钟",
      difficulty: "初级",
      rating: 4.8,
      views: 1234,
    },
    {
      title: "客户管理详解",
      description: "深入了解客户管理功能",
      duration: "25分钟",
      difficulty: "中级",
      rating: 4.6,
      views: 856,
    },
    {
      title: "数据分析技巧",
      description: "掌握高级数据分析方法",
      duration: "35分钟",
      difficulty: "高级",
      rating: 4.9,
      views: 567,
    },
    {
      title: "权限配置指南",
      description: "学习用户权限管理配置",
      duration: "20分钟",
      difficulty: "中级",
      rating: 4.7,
      views: 789,
    },
  ]

  return (
    <>
      <div className="p-6 space-y-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">帮助中心</h1>
            <p className="text-slate-600 mt-2">为您提供全面的帮助文档和技术支持</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              联系客服
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              在线咨询
            </Button>
          </div>
        </div>

        {/* 搜索框 */}
        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-blue-500 p-6">
          <div className="space-y-2">
            <Label htmlFor="help-search" className="sr-only">搜索帮助内容</Label>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="help-search"
                  placeholder="搜索帮助内容..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">搜索</Button>
            </div>
          </div>
        </Card>

        {/* 快速链接 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <Card
              key={index}
              className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-blue-500 cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-3 rounded-lg ${link.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <link.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {link.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-2 text-slate-800 group-hover:translate-x-1 transition-transform duration-300">
                  {link.title}
                </CardTitle>
                <CardDescription className="text-slate-600">{link.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 主要内容区域 */}
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-sky-50 border border-sky-200">
            <TabsTrigger value="faq" className="data-[state=active]:bg-white data-[state=active]:text-sky-700">
              常见问题
            </TabsTrigger>
            <TabsTrigger value="guides" className="data-[state=active]:bg-white data-[state=active]:text-sky-700">
              使用指南
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-white data-[state=active]:text-sky-700">
              资源下载
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-white data-[state=active]:text-sky-700">
              联系我们
            </TabsTrigger>
          </TabsList>

          {/* 常见问题 */}
          <TabsContent value="faq">
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
              <CardHeader className="p-6 border-b border-sky-100">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  常见问题解答
                </CardTitle>
                <CardDescription className="text-slate-600">以下是用户最常遇到的问题和解决方案</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {faqData.map((faq, index) => (
                    <Card
                      key={index}
                      className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                          <p className="text-slate-700">{faq.answer}</p>
                          <div className="flex items-center justify-between text-sm text-slate-500">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" />
                                {faq.helpful} 人觉得有用
                              </span>
                              <span>{faq.views} 次查看</span>
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              有用
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 使用指南 */}
          <TabsContent value="guides">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                <CardHeader className="p-6 border-b border-sky-100">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    视频教程
                  </CardTitle>
                  <CardDescription className="text-slate-600">观看详细的操作演示视频</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {tutorials.map((tutorial, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Video className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 group-hover:translate-x-1 transition-transform duration-300">
                              {tutorial.title}
                            </h4>
                            <p className="text-sm text-slate-600">{tutorial.description}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {tutorial.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {tutorial.rating}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {tutorial.views} 次观看
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          观看
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                <CardHeader className="p-6 border-b border-sky-100">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Settings className="h-5 w-5 text-blue-600" />
                    操作指南
                  </CardTitle>
                  <CardDescription className="text-slate-600">详细的功能操作说明</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="text-slate-700">账户注册与登录</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="text-slate-700">基本功能介绍</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="text-slate-700">界面操作指南</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="text-slate-700">权限管理配置</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <span className="text-slate-700">数据导入导出</span>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      查看完整指南
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 资源下载 */}
          <TabsContent value="resources">
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
              <CardHeader className="p-6 border-b border-sky-100">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Download className="h-5 w-5 text-blue-600" />
                  资源下载中心
                </CardTitle>
                <CardDescription className="text-slate-600">下载相关文档、工具和资源文件</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {resources.map((resource, index) => (
                    <Card
                      key={index}
                      className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-blue-500 group"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900 group-hover:translate-x-1 transition-transform duration-300">
                                {resource.title}
                              </h3>
                              <p className="text-sm text-slate-600">{resource.description}</p>
                              <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                                <span>{resource.type}</span>
                                <span>{resource.size}</span>
                                <span className="flex items-center gap-1">
                                  <Download className="h-3 w-3" />
                                  {resource.downloads}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  {resource.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Download className="w-4 h-4 mr-2" />
                            下载
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 联系我们 */}
          <TabsContent value="contact">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {contactMethods.map((method, index) => (
                <Card
                  key={index}
                  className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
                >
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${method.color}`}
                    >
                      <method.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-slate-800">{method.title}</CardTitle>
                    <CardDescription className="text-slate-600">{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">{method.action}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 反馈表单 */}
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
              <CardHeader className="p-6 border-b border-sky-100">
                <CardTitle className="text-slate-800">意见反馈</CardTitle>
                <CardDescription className="text-slate-600">如果您有任何建议或问题，请告诉我们</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="feedback-name">您的姓名</Label>
                      <Input id="feedback-name" placeholder="您的姓名" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feedback-email">联系邮箱</Label>
                      <Input id="feedback-email" type="email" placeholder="联系邮箱" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback-title">问题标题</Label>
                    <Input id="feedback-title" placeholder="问题标题" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback-content">详细描述</Label>
                    <textarea
                      id="feedback-content"
                      className="w-full p-3 border border-sky-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                      rows={4}
                      placeholder="详细描述您的问题或建议..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">提交反馈</Button>
                    <Button type="button" variant="outline">重置</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <FloatingNavButtons />
    </>
  )
}
