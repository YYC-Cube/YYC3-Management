/**
 * @fileoverview ai-smart-forms.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Smartphone,
  BarChart3,
  Users,
  MessageSquare,
  Mic,
  Loader,
  CheckCircle,
  FileTextIcon as DocumentText,
  Search,
  ArrowRight,
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function AiSmartForms() {
  const router = useRouter()
  const { toast } = useToast()
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("sales-daily")
  const [formData, setFormData] = useState({
    customerName: "",
    contactPerson: "",
    phone: "",
    email: "",
    followUpContent: "",
    nextAction: "",
    amount: "",
    stage: "",
  })

  // 页面跳转函数
  const handleNavigation = (path: string) => {
    router.push(path)
  }

  // 语音录制函数
  const handleVoiceRecord = async () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      toast({
        title: "开始语音录制",
        description: "请开始说话，系统将自动识别并填充表单",
      })

      // 模拟语音识别
      setIsProcessing(true)
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setFormData({
        ...formData,
        customerName: "华润集团",
        contactPerson: "张总",
        phone: "13800138000",
        followUpContent: "客户对我们的整装方案很感兴趣，特别是轻奢风格的设计。已经看了三次方案，准备下周安排量房。",
        nextAction: "安排设计师上门量房",
        amount: "280000",
        stage: "准备成交期",
      })
      setIsProcessing(false)
      setIsRecording(false)

      toast({
        title: "语音识别完成",
        description: "已自动填充表单内容，请检查并确认",
      })
    }
  }

  // NFC触发函数
  const handleNFCTrigger = () => {
    toast({
      title: "NFC触发成功",
      description: "已自动获取客户基础信息",
    })

    setFormData({
      ...formData,
      customerName: "万科地产",
      contactPerson: "李经理",
      phone: "13900139000",
      email: "li.manager@vanke.com",
    })
  }

  // AI智能填充函数
  const handleAIFill = async () => {
    setIsProcessing(true)
    toast({
      title: "AI分析中",
      description: "正在基于历史数据智能填充表单",
    })

    await new Promise((resolve) => setTimeout(resolve, 2000))
    setFormData({
      ...formData,
      followUpContent: "基于客户历史数据分析，建议推送现代简约风格方案，预计成交概率85%",
      nextAction: "发送3D设计方案",
      stage: "意向客户期",
    })
    setIsProcessing(false)

    toast({
      title: "AI填充完成",
      description: "已基于客户画像智能填充相关内容",
    })
  }

  // 保存表单函数
  const handleSave = () => {
    toast({
      title: "保存成功",
      description: "表单已保存为草稿，可稍后继续编辑",
    })
    console.log("保存表单数据", formData)
  }

  // 提交表单函数
  const handleSubmit = () => {
    if (!formData.customerName || !formData.contactPerson) {
      toast({
        title: "提交失败",
        description: "请填写必要的客户信息",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "提交成功",
      description: "表单已提交，正在跳转到客户管理页面",
    })

    console.log("提交表单数据", formData)
    setTimeout(() => {
      handleNavigation("/customers")
    }, 1500)
  }

  const formTemplates = [
    {
      id: "sales-daily",
      name: "销售日报表",
      description: "NFC触发版销售业绩记录",
      icon: BarChart3,
      color: "blue",
      fields: ["客户信息", "跟进内容", "成交金额", "下步行动"],
    },
    {
      id: "customer-follow",
      name: "客户跟进表",
      description: "动态推进引擎客户管理",
      icon: Users,
      color: "green",
      fields: ["客户阶段", "沟通记录", "需求分析", "风险评估"],
    },
    {
      id: "meeting-record",
      name: "会议记录表",
      description: "语音转文字会议纪要",
      icon: MessageSquare,
      color: "purple",
      fields: ["会议主题", "参与人员", "讨论要点", "行动计划"],
    },
    {
      id: "project-report",
      name: "项目报告表",
      description: "项目进度和风险管控",
      icon: FileText,
      color: "orange",
      fields: ["项目状态", "完成进度", "风险点", "资源需求"],
    },
  ]

  const recentForms = [
    {
      id: "1",
      template: "销售日报表",
      customer: "华润集团",
      status: "已提交",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      amount: "¥2,847,000",
    },
    {
      id: "2",
      template: "客户跟进表",
      customer: "万科地产",
      status: "草稿",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      amount: "¥1,250,000",
    },
    {
      id: "3",
      template: "会议记录表",
      customer: "碧桂园",
      status: "已提交",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      amount: "¥890,000",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已提交":
        return "bg-green-100 text-green-700 border-green-300"
      case "草稿":
        return "bg-amber-100 text-amber-700 border-amber-300"
      case "处理中":
        return "bg-blue-100 text-blue-700 border-blue-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  const getTemplateColor = (color: string) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 text-blue-700",
      green: "bg-green-50 border-green-200 text-green-700",
      purple: "bg-purple-50 border-purple-200 text-purple-700",
      orange: "bg-orange-50 border-orange-200 text-orange-700",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            AI智能表单
          </h1>
          <p className="text-slate-600 mt-2">智能表单系统，支持语音输入、NFC触发和自动填充</p>
        </div>
      </div>

      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleNFCTrigger}
            className="flex items-center gap-2 border-purple-200 hover:bg-purple-50 bg-transparent"
          >
            <Smartphone className="w-4 h-4" />
            NFC触发
          </Button>
          <Button
            variant="outline"
            onClick={handleVoiceRecord}
            className={`flex items-center gap-2 ${isRecording ? "border-red-500 text-red-500" : "border-blue-200"} hover:bg-blue-50 bg-transparent`}
          >
            {isRecording ? <Loader className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
            {isRecording ? "录音中..." : "语音输入"}
          </Button>
          <Button
            variant="outline"
            onClick={handleAIFill}
            className="flex items-center gap-2 border-green-200 hover:bg-green-50 bg-transparent"
            disabled={isProcessing}
          >
            {isProcessing ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            AI智能填充
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
            <Search className="w-3 h-3" />
            搜索表单
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
            <ArrowRight className="w-3 h-3" />
            更多操作
          </Button>
        </div>
      </div>

      {/* 表单模板选择 */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
        <h3 className="text-lg font-medium text-slate-800 mb-4">选择表单模板</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {formTemplates.map((template) => {
            const IconComponent = template.icon
            return (
              <div
                key={template.id}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedTemplate === template.id ? "ring-2 ring-blue-500 ring-offset-2" : ""
                } ${getTemplateColor(template.color)} hover:shadow-md`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      template.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : template.color === "green"
                          ? "bg-green-100 text-green-600"
                          : template.color === "purple"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-slate-800">{template.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {template.fields.map((field) => (
                    <span key={field} className="text-xs bg-white/80 text-slate-600 px-2 py-0.5 rounded-full">
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 表单内容 */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-slate-800">
            {formTemplates.find((t) => t.id === selectedTemplate)?.name || "销售日报表"}
          </h3>
          {isProcessing && (
            <div className="flex items-center text-blue-600">
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              <span>AI处理中...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">客户名称 *</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入客户名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">联系人 *</label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入联系人"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">电话</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入联系电话"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">邮箱</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入邮箱地址"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">跟进内容</label>
            <textarea
              value={formData.followUpContent}
              onChange={(e) => setFormData({ ...formData, followUpContent: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入跟进内容"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">下步行动</label>
            <textarea
              value={formData.nextAction}
              onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入下步行动"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">成交金额</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入成交金额"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">客户阶段</label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">请选择客户阶段</option>
              <option value="初步接触">初步接触</option>
              <option value="需求分析">需求分析</option>
              <option value="方案设计">方案设计</option>
              <option value="准备成交期">准备成交期</option>
              <option value="已成交">已成交</option>
              <option value="已流失">已流失</option>
            </select>
          </div>
        </div>

        {/* 表单底部操作 */}
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={handleSave}>
            保存草稿
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setFormData({
                customerName: "",
                contactPerson: "",
                phone: "",
                email: "",
                followUpContent: "",
                nextAction: "",
                amount: "",
                stage: "",
              })
            }
          >
            重置表单
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            提交表单
          </Button>
        </div>
      </div>

      {/* 最近表单 */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-slate-800">最近表单</h3>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            查看全部
          </Button>
        </div>

        <div className="space-y-3">
          {recentForms.map((form) => (
            <div
              key={form.id}
              className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DocumentText className="w-5 h-5 text-slate-400 mr-3" />
                  <div>
                    <h4 className="font-medium text-slate-800">{form.template}</h4>
                    <p className="text-sm text-slate-500 mt-0.5">{form.customer}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(form.status)}`}>
                    {form.status}
                  </span>
                  <span className="ml-3 text-sm text-slate-500">{form.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  <span className="font-medium">{form.amount}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  查看详情
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
