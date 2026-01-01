/**
 * @fileoverview AI智能助手组件
 * @description 提供多模型AI对话、业务分析、智能洞察等功能
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  BarChart3,
  Zap,
  Cloud,
  Server,
  ChevronRight,
} from "lucide-react"
import { aiService, type ChatMessage, type ChatRequest } from "@/lib/ai-service"
import { AI_MODELS, type AIModel, getModelsByType } from "@/lib/ai-models"

interface Insight {
  id: string
  type: "warning" | "success" | "info"
  title: string
  description: string
  action?: string
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: any
  action: () => void
}

interface AIAssistantProps {
  showTitle?: boolean
}

export function AIAssistant({ showTitle = true }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "您好！我是您的AI智能助手，支持多种本地和云端大模型。我可以帮您分析业务数据、提供决策建议、执行常用操作。有什么可以帮助您的吗？",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedModel, setSelectedModel] = useState("baidu-ernie")
  const [temperature, setTemperature] = useState([0.7])
  const [maxTokens, setMaxTokens] = useState([2000])
  const [streamMode, setStreamMode] = useState(false)
  const [availableModels, setAvailableModels] = useState<AIModel[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 加载可用模型
    loadAvailableModels()
  }, [])

  const loadAvailableModels = async () => {
    try {
      // 直接使用AI_MODELS而不是require
      setAvailableModels(AI_MODELS)
      if (AI_MODELS.length > 0 && !AI_MODELS.find((m) => m.id === selectedModel)) {
        setSelectedModel(AI_MODELS[0].id)
      }
    } catch (error) {
      console.error("加载可用模型失败:", error)
      // 使用默认模型列表
      setAvailableModels(AI_MODELS)
    }
  }

  const insights: Insight[] = [
    {
      id: "1",
      type: "warning",
      title: "客户流失风险",
      description: "检测到3个重要客户��月活跃度下降超过40%",
      action: "查看详情",
    },
    {
      id: "2",
      type: "success",
      title: "销售目标达成",
      description: "本月销售额已达成目标的105%，超额完成",
      action: "查看报表",
    },
    {
      id: "3",
      type: "info",
      title: "库存优化建议",
      description: "建议调整5个产品的库存配置以提高周转率",
      action: "优化库存",
    },
  ]

  const quickActions: QuickAction[] = [
    {
      id: "1",
      title: "生成销售报表",
      description: "自动生成本月销售数据报表",
      icon: BarChart3,
      action: () => handleQuickAction("生成销售报表"),
    },
    {
      id: "2",
      title: "客户跟进提醒",
      description: "查看需要跟进的客户列表",
      icon: Users,
      action: () => handleQuickAction("客户跟进提醒"),
    },
    {
      id: "3",
      title: "财务数据分析",
      description: "分析当前财务状况和趋势",
      icon: DollarSign,
      action: () => handleQuickAction("财务数据分析"),
    },
    {
      id: "4",
      title: "任务优先级排序",
      description: "智能排序待办任务优先级",
      icon: Clock,
      action: () => handleQuickAction("任务优先级排序"),
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const request: ChatRequest = {
        modelId: selectedModel,
        messages: [...messages, userMessage],
        temperature: temperature[0],
        maxTokens: maxTokens[0],
        stream: streamMode,
      }

      const response = await aiService.chat(request)

      if (response.success) {
        const aiResponse: ChatMessage = {
          role: "assistant",
          content: response.content,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
      } else {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: `抱歉，AI服务调用失败：${response.error}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: `抱歉，发生了未知错误：${error instanceof Error ? error.message : "未知错误"}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = async (action: string) => {
    const actionMessage: ChatMessage = {
      role: "user",
      content: `执行操作：${action}`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, actionMessage])

    setIsTyping(true)

    try {
      const request: ChatRequest = {
        modelId: selectedModel,
        messages: [...messages, actionMessage],
        temperature: temperature[0],
        maxTokens: maxTokens[0],
      }

      const response = await aiService.chat(request)

      if (response.success) {
        const responseMessage: ChatMessage = {
          role: "assistant",
          content: response.content,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, responseMessage])
      } else {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: `操作执行失败：${response.error}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: `操作执行失败：${error instanceof Error ? error.message : "未知错误"}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // 这里可以集成语音识别API
  }

  const getModelIcon = (model: AIModel) => {
    if (model.type === "local") {
      return <Server className="w-4 h-4" />
    } else {
      return <Cloud className="w-4 h-4" />
    }
  }

  const getModelBadgeColor = (model: AIModel) => {
    if (model.type === "local") {
      return "bg-green-100 text-green-800 border-green-200"
    } else {
      return "bg-purple-100 text-purple-800 border-purple-200"
    }
  }

  // 彩色进度条组件
  const ColoredProgress = ({ value, color }: { value: number; color: string }) => {
    return (
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50/30 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {showTitle && (
            <h1 className="text-2xl font-bold text-slate-900">AI智能助手</h1>
          )}
          <p className="text-slate-600 mt-2">支持本地和云端多种大模型的智能业务分析系统</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            <Bot className="w-4 h-4 mr-1" />
            AI驱动
          </Badge>
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            <Zap className="w-4 h-4 mr-1" />
            多模型支持
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">智能对话</TabsTrigger>
          <TabsTrigger value="insights">业务洞察</TabsTrigger>
          <TabsTrigger value="actions">快捷操作</TabsTrigger>
          <TabsTrigger value="settings">模型设置</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="border-r-[5px] border-r-purple-400 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 h-[600px] flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-600" />
                    智能对话助手
                    <Badge
                      variant="outline"
                      className={getModelBadgeColor(
                        availableModels.find((m) => m.id === selectedModel) || AI_MODELS[0],
                      )}
                    >
                      {getModelIcon(availableModels.find((m) => m.id === selectedModel) || AI_MODELS[0])}
                      <span className="ml-1">
                        {availableModels.find((m) => m.id === selectedModel)?.name || "未选择模型"}
                      </span>
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.role === "assistant" && (
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-purple-100 text-purple-600">
                                <Bot className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                                : "bg-purple-50 text-slate-900 border border-purple-200"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">{message.timestamp?.toLocaleTimeString()}</p>
                          </div>
                          {message.role === "user" && (
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-purple-100 text-purple-600">U</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex gap-3 justify-start">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-purple-100 text-purple-600">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div ref={messagesEndRef} />
                  </ScrollArea>

                  <div className="flex gap-2 mt-4">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="输入您的问题或需求..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <Button
                      onClick={toggleVoiceInput}
                      variant="outline"
                      size="icon"
                      className={`border-purple-200 ${isListening ? "bg-red-50 border-red-200" : "hover:bg-purple-50"}`}
                    >
                      {isListening ? (
                        <MicOff className="w-4 h-4 text-red-600" />
                      ) : (
                        <Mic className="w-4 h-4 text-purple-600" />
                      )}
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="border-r-[5px] border-r-purple-400 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 p-4">
                <h3 className="font-semibold text-slate-900 mb-3">模型选择</h3>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                    <SelectValue placeholder="选择AI模型" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center gap-2">
                          {getModelIcon(model)}
                          <span>{model.name}</span>
                          <Badge variant="outline" className={getModelBadgeColor(model)}>
                            {model.type === "local" ? "本地" : "云端"}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableModels.find((m) => m.id === selectedModel) && (
                  <p className="text-xs text-slate-600 mt-2">
                    {availableModels.find((m) => m.id === selectedModel)?.description}
                  </p>
                )}
              </Card>

              <Card className="border-r-[5px] border-r-purple-400 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 p-4">
                <h3 className="font-semibold text-slate-900 mb-3">快速设置</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">创造性 ({temperature[0]})</label>
                    <Slider
                      value={temperature}
                      onValueChange={setTemperature}
                      max={1}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                    <ColoredProgress
                      value={temperature[0] * 100}
                      color="bg-gradient-to-r from-purple-400 to-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">最大长度 ({maxTokens[0]})</label>
                    <Slider
                      value={maxTokens}
                      onValueChange={setMaxTokens}
                      max={8000}
                      min={100}
                      step={100}
                      className="mt-2"
                    />
                    <ColoredProgress
                      value={(maxTokens[0] / 8000) * 100}
                      color="bg-gradient-to-r from-purple-400 to-purple-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">流式输出</label>
                    <Switch checked={streamMode} onCheckedChange={setStreamMode} />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {insights.map((insight) => (
              <Card
                key={insight.id}
                className="border-r-[5px] border-r-purple-400 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 p-4 group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      insight.type === "warning"
                        ? "bg-amber-100"
                        : insight.type === "success"
                          ? "bg-green-100"
                          : "bg-purple-100"
                    }`}
                  >
                    {insight.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                    {insight.type === "success" && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {insight.type === "info" && <Lightbulb className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{insight.title}</h3>
                    <p className="text-slate-600 text-sm mt-1">{insight.description}</p>
                    {insight.action && (
                      <div className="flex items-center mt-2 text-purple-600 text-sm font-medium">
                        <span>{insight.action}</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Card
                key={action.id}
                className="border-r-[5px] border-r-purple-400 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 p-4 cursor-pointer group"
              >
                <div className="flex items-start gap-3" onClick={action.action}>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <action.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{action.title}</h3>
                    <p className="text-slate-600 text-sm mt-1">{action.description}</p>
                    <div className="flex items-center mt-2 text-purple-600 text-sm font-medium">
                      <span>立即执行</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-r-[5px] border-r-green-400 bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">本地模型</h3>
              <div className="space-y-4">
                {getModelsByType("local").map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Server className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{model.name}</h4>
                        <p className="text-sm text-slate-600">{model.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      本地部署
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-r-[5px] border-r-purple-400 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">云端模型</h3>
              <div className="space-y-4">
                {getModelsByType("cloud").map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between p-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Cloud className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{model.name}</h4>
                        <p className="text-sm text-slate-600">{model.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                      {model.provider}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="border-r-[5px] border-r-purple-400 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">模型能力对比</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-purple-200">
                    <th className="text-left p-2">模型名称</th>
                    <th className="text-left p-2">类型</th>
                    <th className="text-left p-2">最大Token</th>
                    <th className="text-left p-2">主要能力</th>
                  </tr>
                </thead>
                <tbody>
                  {AI_MODELS.map((model) => (
                    <tr key={model.id} className="border-b border-purple-100 hover:bg-purple-50">
                      <td className="p-2 font-medium">{model.name}</td>
                      <td className="p-2">
                        <Badge variant="outline" className={getModelBadgeColor(model)}>
                          {model.type === "local" ? "本地" : "云端"}
                        </Badge>
                      </td>
                      <td className="p-2">{model.maxTokens.toLocaleString()}</td>
                      <td className="p-2">
                        <div className="flex flex-wrap gap-1">
                          {model.capabilities.slice(0, 2).map((capability, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                              {capability}
                            </Badge>
                          ))}
                          {model.capabilities.length > 2 && (
                            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                              +{model.capabilities.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
