/**
 * @fileoverview user-training.tsx
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
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Users,
  Award,
  FileText,
  Video,
  Download,
  Star,
  TrendingUp,
  Target,
  MessageSquare,
  Calendar,
} from "lucide-react"

interface TrainingModule {
  id: string
  title: string
  description: string
  type: "video" | "document" | "interactive" | "quiz"
  duration: number
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  completed: boolean
  progress: number
  rating: number
  enrollments: number
}

interface TrainingPath {
  id: string
  name: string
  description: string
  modules: string[]
  estimatedTime: number
  completionRate: number
  difficulty: "beginner" | "intermediate" | "advanced"
}

interface UserProgress {
  userId: string
  userName: string
  completedModules: number
  totalModules: number
  totalHours: number
  certificates: number
  lastActivity: Date
}

export function UserTraining() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const trainingModules: TrainingModule[] = [
    {
      id: "ai-assistant-basics",
      title: "AI智能助手基础操作",
      description: "学习如何使用AI助手进行日常业务操作和数据分析",
      type: "video",
      duration: 25,
      difficulty: "beginner",
      category: "AI功能",
      completed: true,
      progress: 100,
      rating: 4.8,
      enrollments: 156,
    },
    {
      id: "tenant-management-guide",
      title: "多租户管理完整指南",
      description: "掌握多租户系统的配置、管理和维护技能",
      type: "interactive",
      duration: 45,
      difficulty: "intermediate",
      category: "系统管理",
      completed: false,
      progress: 60,
      rating: 4.6,
      enrollments: 89,
    },
    {
      id: "bi-reports-creation",
      title: "BI报表制作与分析",
      description: "学习创建自定义报表和进行数据可视化分析",
      type: "document",
      duration: 35,
      difficulty: "intermediate",
      category: "数据分析",
      completed: false,
      progress: 0,
      rating: 4.7,
      enrollments: 124,
    },
    {
      id: "mobile-app-usage",
      title: "移动端应用使用技巧",
      description: "掌握移动端功能和离线操作技巧",
      type: "video",
      duration: 20,
      difficulty: "beginner",
      category: "移动应用",
      completed: true,
      progress: 100,
      rating: 4.5,
      enrollments: 203,
    },
    {
      id: "security-best-practices",
      title: "系统安全最佳实践",
      description: "了解安全策略配置和威胁防护措施",
      type: "quiz",
      duration: 30,
      difficulty: "advanced",
      category: "安全管理",
      completed: false,
      progress: 25,
      rating: 4.9,
      enrollments: 67,
    },
    {
      id: "performance-optimization",
      title: "系统性能优化指南",
      description: "学习系统性能监控和优化技术",
      type: "interactive",
      duration: 40,
      difficulty: "advanced",
      category: "性能优化",
      completed: false,
      progress: 0,
      rating: 4.4,
      enrollments: 45,
    },
  ]

  const trainingPaths: TrainingPath[] = [
    {
      id: "new-user-path",
      name: "新用户入门路径",
      description: "为新用户设计的完整学习路径，涵盖系统基础功能",
      modules: ["ai-assistant-basics", "mobile-app-usage"],
      estimatedTime: 45,
      completionRate: 85,
      difficulty: "beginner",
    },
    {
      id: "admin-path",
      name: "系统管理员路径",
      description: "面向系统管理员的高级功能培训",
      modules: ["tenant-management-guide", "security-best-practices", "performance-optimization"],
      estimatedTime: 115,
      completionRate: 62,
      difficulty: "advanced",
    },
    {
      id: "analyst-path",
      name: "数据分析师路径",
      description: "专为数据分析人员设计的BI和报表培训",
      modules: ["bi-reports-creation", "ai-assistant-basics"],
      estimatedTime: 60,
      completionRate: 78,
      difficulty: "intermediate",
    },
  ]

  const userProgress: UserProgress[] = [
    {
      userId: "user-1",
      userName: "张总经理",
      completedModules: 4,
      totalModules: 6,
      totalHours: 8.5,
      certificates: 2,
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      userId: "user-2",
      userName: "李部长",
      completedModules: 3,
      totalModules: 6,
      totalHours: 6.2,
      certificates: 1,
      lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      userId: "user-3",
      userName: "王主管",
      completedModules: 2,
      totalModules: 6,
      totalHours: 3.8,
      certificates: 1,
      lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />
      case "document":
        return <FileText className="w-4 h-4" />
      case "interactive":
        return <Target className="w-4 h-4" />
      case "quiz":
        return <MessageSquare className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "初级"
      case "intermediate":
        return "中级"
      case "advanced":
        return "高级"
      default:
        return "未知"
    }
  }

  const startModule = (moduleId: string) => {
    setSelectedModule(moduleId)
  }

  const overallProgress = Math.round(
    (trainingModules.reduce((sum, module) => sum + module.progress, 0) / (trainingModules.length * 100)) * 100,
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">用户培训中心</h1>
          <p className="text-slate-600 mt-2">系统功能培训和用户指导</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            下载资料
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Calendar className="w-4 h-4 mr-2" />
            预约培训
          </Button>
        </div>
      </div>

      {/* 学习进度概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-orange-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">总体进度</p>
              <p className="text-2xl font-bold text-orange-600">{overallProgress}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-400" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-orange-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">已完成模块</p>
              <p className="text-2xl font-bold text-orange-600">{trainingModules.filter((m) => m.completed).length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-orange-400" />
          </div>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-orange-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">学习时长</p>
              <p className="text-2xl font-bold text-orange-600">
                {trainingModules.filter((m) => m.completed).reduce((sum, m) => sum + m.duration, 0)}分钟
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-400" />
          </div>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-orange-500 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">获得证书</p>
              <p className="text-2xl font-bold text-orange-600">
                {userProgress.reduce((sum, user) => sum + user.certificates, 0)}
              </p>
            </div>
            <Award className="w-8 h-8 text-orange-400" />
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">培训概览</TabsTrigger>
          <TabsTrigger value="modules">培训模块</TabsTrigger>
          <TabsTrigger value="paths">学习路径</TabsTrigger>
          <TabsTrigger value="progress">学习进度</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-orange-500 p-6">
              <h3 className="text-lg font-semibold mb-4">推荐学习</h3>
              <div className="space-y-4">
                {trainingModules
                  .filter((module) => !module.completed)
                  .slice(0, 3)
                  .map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">{getTypeIcon(module.type)}</div>
                        <div>
                          <h4 className="font-medium text-sm">{module.title}</h4>
                          <p className="text-xs text-slate-600">{module.duration}分钟</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => startModule(module.id)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        开始学习
                      </Button>
                    </div>
                  ))}
              </div>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-orange-500 p-6">
              <h3 className="text-lg font-semibold mb-4">最新公告</h3>
              <div className="space-y-4">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-900">新功能培训上线</h4>
                  <p className="text-sm text-orange-700 mt-1">AI智能助手高级功能培训课程现已上线</p>
                  <p className="text-xs text-orange-600 mt-2">2小时前</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900">培训证书更新</h4>
                  <p className="text-sm text-green-700 mt-1">完成培训可获得官方认证证书</p>
                  <p className="text-xs text-green-600 mt-2">1天前</p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-900">在线答疑活动</h4>
                  <p className="text-sm text-yellow-700 mt-1">每周三下午2点专家在线答疑</p>
                  <p className="text-xs text-yellow-600 mt-2">3天前</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-orange-500 p-6">
            <h3 className="text-lg font-semibold mb-4">培训统计</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{trainingModules.length}</div>
                <p className="text-slate-600">培训模块</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{userProgress.length}</div>
                <p className="text-slate-600">参与用户</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {Math.round(
                    (trainingModules.reduce((sum, module) => sum + module.rating, 0) / trainingModules.length) * 10,
                  ) / 10}
                </div>
                <p className="text-slate-600">平均评分</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid gap-4">
            {trainingModules.map((module) => (
              <Card
                key={module.id}
                className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-orange-500 p-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">{getTypeIcon(module.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900 group-hover:translate-x-1 transition-transform duration-300">
                          {module.title}
                        </h3>
                        <Badge className={getDifficultyColor(module.difficulty)}>
                          {getDifficultyText(module.difficulty)}
                        </Badge>
                        {module.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{module.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {module.duration}分钟
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {module.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {module.enrollments}人学习
                        </span>
                        <span className="text-slate-400">#{module.category}</span>
                      </div>
                      {module.progress > 0 && !module.completed && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>学习进度</span>
                            <span>{module.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-gradient-to-r from-orange-400 to-orange-500 h-1 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${module.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {module.completed ? (
                      <Button variant="outline" size="sm">
                        <Award className="w-3 h-3 mr-1" />
                        查看证书
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => startModule(module.id)}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        {module.progress > 0 ? "继续学习" : "开始学习"}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paths" className="space-y-4">
          <div className="grid gap-4">
            {trainingPaths.map((path) => (
              <Card
                key={path.id}
                className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-orange-500 p-6 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:translate-x-1 transition-transform duration-300">
                      {path.name}
                    </h3>
                    <p className="text-slate-600 mt-1">{path.description}</p>
                  </div>
                  <Badge className={getDifficultyColor(path.difficulty)}>{getDifficultyText(path.difficulty)}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">{path.modules.length}</div>
                    <p className="text-sm text-slate-600">培训模块</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">{path.estimatedTime}分钟</div>
                    <p className="text-sm text-slate-600">预计时长</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">{path.completionRate}%</div>
                    <p className="text-sm text-slate-600">完成率</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h4 className="font-medium">包含模块:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {path.modules.map((moduleId) => {
                      const module = trainingModules.find((m) => m.id === moduleId)
                      return (
                        <div key={moduleId} className="flex items-center gap-2 text-sm">
                          {module && (
                            <>
                              {getTypeIcon(module.type)}
                              <span>{module.title}</span>
                              {module.completed && <CheckCircle className="w-3 h-3 text-green-600" />}
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  开始学习路径
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid gap-4">
            {userProgress.map((user) => (
              <Card
                key={user.userId}
                className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-orange-500 p-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:translate-x-1 transition-transform duration-300">
                        {user.userName}
                      </h3>
                      <p className="text-sm text-slate-600">
                        已完成 {user.completedModules}/{user.totalModules} 个模块
                      </p>
                      <p className="text-xs text-slate-500">最后活动: {user.lastActivity.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">{user.totalHours}h</div>
                        <p className="text-xs text-slate-600">学习时长</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">{user.certificates}</div>
                        <p className="text-xs text-slate-600">获得证书</p>
                      </div>
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(user.completedModules / user.totalModules) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-orange-500 p-6">
            <h3 className="text-lg font-semibold mb-4">培训效果分析</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">完成率统计</h4>
                <div className="space-y-3">
                  {["AI功能", "系统管理", "数据分析", "移动应用", "安全管理"].map((category, index) => (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{category}</span>
                        <span>{85 - index * 5}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${85 - index * 5}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">用户反馈</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">"培训内容很实用，帮助我快速掌握了新功能"</p>
                    <p className="text-xs text-green-600 mt-1">- 张总经理</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">"视频教程制作精良，讲解清晰易懂"</p>
                    <p className="text-xs text-blue-600 mt-1">- 李部长</p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-800">"互动式学习很有趣，学习效果很好"</p>
                    <p className="text-xs text-purple-600 mt-1">- 王主管</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
