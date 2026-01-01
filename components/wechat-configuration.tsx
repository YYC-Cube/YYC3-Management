/**
 * @fileoverview wechat-configuration.tsx
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Settings,
  Menu,
  Bell,
  BarChart3,
  Save,
  TestTube,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Users,
  MessageCircle,
  MousePointer,
  TrendingUp,
  Plus,
  Trash2,
  Edit,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface MenuButton {
  id: string
  name: string
  type: "click" | "view" | "miniprogram"
  key?: string
  url?: string
  appid?: string
  pagepath?: string
  subButtons?: MenuButton[]
}

interface AutoReply {
  id: string
  keyword: string
  replyType: "text" | "image" | "news"
  content: string
  enabled: boolean
}

interface Template {
  id: string
  templateId: string
  title: string
  content: string
  industry: string
  enabled: boolean
}

export function WechatConfiguration() {
  const [loading, setLoading] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "testing">("connected")

  const [basicConfig, setBasicConfig] = useState({
    appId: "wx1234567890abcdef",
    appSecret: "abcdef1234567890abcdef1234567890",
    token: "jinlan_wechat_token_2024",
    encodingAESKey: "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFG",
    serverUrl: "https://api.jinlan.com/wechat/callback",
    enabled: true,
  })

  const [menuButtons, setMenuButtons] = useState<MenuButton[]>([
    {
      id: "1",
      name: "产品中心",
      type: "click",
      key: "PRODUCT_CENTER",
      subButtons: [
        { id: "1-1", name: "家具系列", type: "view", url: "https://jinlan.com/furniture" },
        { id: "1-2", name: "定制服务", type: "view", url: "https://jinlan.com/custom" },
        { id: "1-3", name: "新品推荐", type: "click", key: "NEW_PRODUCTS" },
      ],
    },
    {
      id: "2",
      name: "客户服务",
      type: "click",
      key: "CUSTOMER_SERVICE",
      subButtons: [
        { id: "2-1", name: "在线咨询", type: "click", key: "ONLINE_CHAT" },
        { id: "2-2", name: "预约服务", type: "view", url: "https://jinlan.com/appointment" },
        { id: "2-3", name: "售后支持", type: "click", key: "AFTER_SALES" },
      ],
    },
    {
      id: "3",
      name: "关于我们",
      type: "view",
      url: "https://jinlan.com/about",
    },
  ])

  const [autoReplies, setAutoReplies] = useState<AutoReply[]>([
    {
      id: "1",
      keyword: "你好",
      replyType: "text",
      content: "您好！欢迎关注锦澜家居，我们为您提供优质的家居产品和服务。有什么可以帮助您的吗？",
      enabled: true,
    },
    {
      id: "2",
      keyword: "价格",
      replyType: "text",
      content: "我们的产品价格因款式和材质而异，请您提供具体的产品信息，我们会为您详细报价。",
      enabled: true,
    },
    {
      id: "3",
      keyword: "联系方式",
      replyType: "text",
      content: "客服热线：400-888-8888\n营业时间：周一至周日 9:00-18:00\n地址：上海市浦东新区锦澜大厦",
      enabled: true,
    },
  ])

  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      templateId: "OPENTM001",
      title: "订单确认通知",
      content: "您的订单{{order.orderNumber}}已确认，预计{{order.deliveryTime}}送达。",
      industry: "电商",
      enabled: true,
    },
    {
      id: "2",
      templateId: "OPENTM002",
      title: "预约成功通知",
      content: "您已成功预约{{appointment.service}}服务，时间：{{appointment.time}}。",
      industry: "服务",
      enabled: true,
    },
  ])

  const [stats] = useState({
    followers: 15680,
    messages: 2340,
    clicks: 8920,
    growth: 12.5,
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: "配置已保存",
        description: "微信公众号配置已成功更新",
      })
    } catch (error) {
      toast({
        title: "保存失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    setConnectionStatus("testing")
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setConnectionStatus("connected")
      toast({
        title: "连接测试成功",
        description: "微信公众号配置正确，连接正常",
      })
    } catch (error) {
      setConnectionStatus("disconnected")
      toast({
        title: "连接测试失败",
        description: "请检查配置参数",
        variant: "destructive",
      })
    }
  }

  const syncMenu = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "菜单同步成功",
        description: "自定义菜单已同步到微信服务器",
      })
    } catch (error) {
      toast({
        title: "菜单同步失败",
        description: "请检查菜单配置",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "disconnected":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "testing":
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const addAutoReply = () => {
    const newReply: AutoReply = {
      id: Date.now().toString(),
      keyword: "",
      replyType: "text",
      content: "",
      enabled: true,
    }
    setAutoReplies([...autoReplies, newReply])
  }

  const updateAutoReply = (id: string, updates: Partial<AutoReply>) => {
    setAutoReplies((prev) => prev.map((reply) => (reply.id === id ? { ...reply, ...updates } : reply)))
  }

  const deleteAutoReply = (id: string) => {
    setAutoReplies((prev) => prev.filter((reply) => reply.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">微信公众号配置</h1>
          <p className="text-slate-600 mt-2">配置微信公众号接入参数和功能设置</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={testConnection} disabled={connectionStatus === "testing"}>
            <TestTube className="w-4 h-4 mr-2" />
            {connectionStatus === "testing" ? "测试中..." : "测试连接"}
          </Button>
          <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            {loading ? "保存中..." : "保存配置"}
          </Button>
        </div>
      </div>

      {/* 状态概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">关注用户</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.followers.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">消息量</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.messages.toLocaleString()}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">点击量</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{stats.clicks.toLocaleString()}</p>
              </div>
              <MousePointer className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">增长率</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">+{stats.growth}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">基础配置</TabsTrigger>
          <TabsTrigger value="menu">自定义菜单</TabsTrigger>
          <TabsTrigger value="reply">自动回复</TabsTrigger>
          <TabsTrigger value="template">模板消息</TabsTrigger>
          <TabsTrigger value="analytics">数据分析</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    基础配置信息
                  </CardTitle>
                  <CardDescription>配置微信公众号的基本接入参数</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getConnectionStatusIcon()}
                  <Badge variant={connectionStatus === "connected" ? "default" : "destructive"}>
                    {connectionStatus === "connected" ? "已连接" : connectionStatus === "testing" ? "测试中" : "未连接"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-0.5">
                  <Label>启用微信公众号</Label>
                  <p className="text-sm text-gray-500">开启后系统将接收微信公众号消息</p>
                </div>
                <Switch
                  checked={basicConfig.enabled}
                  onCheckedChange={(checked) => setBasicConfig({ ...basicConfig, enabled: checked })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="appId">AppID</Label>
                  <Input
                    id="appId"
                    value={basicConfig.appId}
                    onChange={(e) => setBasicConfig({ ...basicConfig, appId: e.target.value })}
                    disabled={!basicConfig.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appSecret">AppSecret</Label>
                  <div className="relative">
                    <Input
                      id="appSecret"
                      type={showSecret ? "text" : "password"}
                      value={basicConfig.appSecret}
                      onChange={(e) => setBasicConfig({ ...basicConfig, appSecret: e.target.value })}
                      disabled={!basicConfig.enabled}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
                <Input
                  id="token"
                  value={basicConfig.token}
                  onChange={(e) => setBasicConfig({ ...basicConfig, token: e.target.value })}
                  disabled={!basicConfig.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="encodingAESKey">EncodingAESKey</Label>
                <Input
                  id="encodingAESKey"
                  value={basicConfig.encodingAESKey}
                  onChange={(e) => setBasicConfig({ ...basicConfig, encodingAESKey: e.target.value })}
                  disabled={!basicConfig.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serverUrl">服务器URL</Label>
                <Input
                  id="serverUrl"
                  value={basicConfig.serverUrl}
                  onChange={(e) => setBasicConfig({ ...basicConfig, serverUrl: e.target.value })}
                  disabled={!basicConfig.enabled}
                />
                <p className="text-sm text-gray-500">请将此URL配置到微信公众平台的服务器配置中</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Menu className="w-5 h-5" />
                    自定义菜单配置
                  </CardTitle>
                  <CardDescription>配置微信公众号底部自定义菜单</CardDescription>
                </div>
                <Button onClick={syncMenu} disabled={loading}>
                  <Settings className="w-4 h-4 mr-2" />
                  {loading ? "同步中..." : "同步菜单"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                {menuButtons.map((button, index) => (
                  <div key={button.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">一级菜单 {index + 1}</h4>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        编辑
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label>菜单名称</Label>
                        <Input value={button.name} />
                      </div>
                      <div className="space-y-2">
                        <Label>菜单类型</Label>
                        <select className="w-full p-2 border border-gray-300 rounded-md" value={button.type}>
                          <option value="click">点击事件</option>
                          <option value="view">跳转链接</option>
                          <option value="miniprogram">小程序</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>{button.type === "view" ? "URL地址" : "事件Key"}</Label>
                        <Input value={button.type === "view" ? button.url : button.key} />
                      </div>
                    </div>

                    {button.subButtons && button.subButtons.length > 0 && (
                      <div className="space-y-4">
                        <h5 className="font-medium text-sm text-gray-700">子菜单</h5>
                        {button.subButtons.map((subButton, subIndex) => (
                          <div key={subButton.id} className="bg-gray-50 p-3 rounded-md">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">子菜单名称</Label>
                                <Input className="text-sm" value={subButton.name} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">类型</Label>
                                <select
                                  className="w-full p-1 text-sm border border-gray-300 rounded"
                                  value={subButton.type}
                                >
                                  <option value="click">点击事件</option>
                                  <option value="view">跳转链接</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">{subButton.type === "view" ? "URL地址" : "事件Key"}</Label>
                                <Input className="text-sm" value={subButton.type === "view" ? subButton.url : subButton.key} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reply" className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    自动回复设置
                  </CardTitle>
                  <CardDescription>配置关键词自动回复规则</CardDescription>
                </div>
                <Button onClick={addAutoReply}>
                  <Plus className="w-4 h-4 mr-2" />
                  添加回复
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {autoReplies.map((reply) => (
                <div key={reply.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={reply.enabled}
                        onCheckedChange={(checked) => updateAutoReply(reply.id, { enabled: checked })}
                      />
                      <span className="font-medium">关键词回复</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => deleteAutoReply(reply.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>触发关键词</Label>
                      <Input
                        value={reply.keyword}
                        onChange={(e) => updateAutoReply(reply.id, { keyword: e.target.value })}
                        placeholder="输入关键词"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>回复类型</Label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={reply.replyType}
                        onChange={(e) =>
                          updateAutoReply(reply.id, { replyType: e.target.value as "text" | "image" | "news" })
                        }
                      >
                        <option value="text">文本消息</option>
                        <option value="image">图片消息</option>
                        <option value="news">图文消息</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>回复内容</Label>
                    <Textarea
                      value={reply.content}
                      onChange={(e) => updateAutoReply(reply.id, { content: e.target.value })}
                      placeholder="输入回复内容"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template" className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                模板消息管理
              </CardTitle>
              <CardDescription>管理微信模板消息推送</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={template.enabled}
                        onCheckedChange={(checked) =>
                          setTemplates((prev) =>
                            prev.map((t) => (t.id === template.id ? { ...t, enabled: checked } : t)),
                          )
                        }
                      />
                      <div>
                        <h4 className="font-medium">{template.title}</h4>
                        <p className="text-sm text-gray-500">模板ID: {template.templateId}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{template.industry}</Badge>
                  </div>

                  <div className="space-y-2">
                    <Label>模板内容</Label>
                    <Textarea
                      value={template.content}
                      onChange={(e) =>
                        setTemplates((prev) =>
                          prev.map((t) => (t.id === template.id ? { ...t, content: e.target.value } : t)),
                        )
                      }
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-indigo-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                数据统计分析
              </CardTitle>
              <CardDescription>查看微信公众号运营数据</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">用户增长趋势</h4>
                  <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">用户增长图表</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">消息互动统计</h4>
                  <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">消息统计图表</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">热门内容排行</h4>
                <div className="space-y-2">
                  {[
                    { title: "新品发布：现代简约沙发系列", views: 1250, clicks: 89 },
                    { title: "家居搭配技巧分享", views: 980, clicks: 67 },
                    { title: "春季家装优惠活动", views: 756, clicks: 45 },
                    { title: "客户案例：北欧风格装修", views: 623, clicks: 38 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">
                          阅读量: {item.views} | 点击量: {item.clicks}
                        </p>
                      </div>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default WechatConfiguration
