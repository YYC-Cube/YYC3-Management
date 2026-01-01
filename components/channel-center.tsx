/**
 * @fileoverview channel-center.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  WifiOff,
  Settings,
  Plus,
  MoreHorizontal,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  MessageSquare,
  ShoppingCart,
  Users,
  BarChart3,
  Edit,
  Trash2,
  Copy,
  Download,
  Search,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Channel {
  id: string
  name: string
  type: "wechat" | "douyin" | "xiaohongshu" | "alipay" | "feishu" | "dingtalk"
  status: "connected" | "disconnected" | "error" | "syncing"
  lastSync: string
  dataCount: number
  errorCount: number
  config: {
    appId?: string
    appSecret?: string
    token?: string
    webhookUrl?: string
    apiKey?: string
  }
  metrics: {
    totalUsers: number
    activeUsers: number
    messages: number
    orders: number
    revenue: number
  }
}

interface ChannelTemplate {
  id: string
  name: string
  type: string
  description: string
  icon: string
  fields: Array<{
    key: string
    label: string
    type: "text" | "password" | "url" | "select"
    required: boolean
    options?: string[]
  }>
}

export function ChannelCenter() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [templates, setTemplates] = useState<ChannelTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [newChannelData, setNewChannelData] = useState<Partial<Channel>>({})
  const { toast } = useToast()

  // 模拟数据加载
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // 模拟API调用延迟
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setChannels([
          {
            id: "wechat-1",
            name: "微信公众号",
            type: "wechat",
            status: "connected",
            lastSync: "2024-12-30 14:30:00",
            dataCount: 15420,
            errorCount: 0,
            config: {
              appId: "wx1234567890",
              appSecret: "***hidden***",
              token: "jinlan_token_2024",
              webhookUrl: "https://api.jinlan.com/wechat/webhook",
            },
            metrics: {
              totalUsers: 25680,
              activeUsers: 18420,
              messages: 3420,
              orders: 156,
              revenue: 89650,
            },
          },
          {
            id: "douyin-1",
            name: "抖音小店",
            type: "douyin",
            status: "connected",
            lastSync: "2024-12-30 14:25:00",
            dataCount: 8920,
            errorCount: 2,
            config: {
              appId: "dy9876543210",
              appSecret: "***hidden***",
              apiKey: "***hidden***",
            },
            metrics: {
              totalUsers: 12450,
              activeUsers: 8920,
              messages: 1850,
              orders: 89,
              revenue: 45200,
            },
          },
          {
            id: "xiaohongshu-1",
            name: "小红书",
            type: "xiaohongshu",
            status: "error",
            lastSync: "2024-12-30 12:15:00",
            dataCount: 0,
            errorCount: 5,
            config: {
              apiKey: "***hidden***",
              webhookUrl: "https://api.jinlan.com/xiaohongshu/webhook",
            },
            metrics: {
              totalUsers: 8650,
              activeUsers: 0,
              messages: 0,
              orders: 0,
              revenue: 0,
            },
          },
          {
            id: "alipay-1",
            name: "支付宝小程序",
            type: "alipay",
            status: "syncing",
            lastSync: "2024-12-30 14:20:00",
            dataCount: 5680,
            errorCount: 1,
            config: {
              appId: "ap2024123456",
              appSecret: "***hidden***",
            },
            metrics: {
              totalUsers: 9850,
              activeUsers: 5680,
              messages: 920,
              orders: 45,
              revenue: 28900,
            },
          },
        ])

        setTemplates([
          {
            id: "wechat-template",
            name: "微信公众号",
            type: "wechat",
            description: "连接微信公众号，同步用户数据和消息",
            icon: "/platforms/wechat.png",
            fields: [
              { key: "appId", label: "应用ID", type: "text", required: true },
              { key: "appSecret", label: "应用密钥", type: "password", required: true },
              { key: "token", label: "Token", type: "text", required: true },
              { key: "webhookUrl", label: "回调地址", type: "url", required: false },
            ],
          },
          {
            id: "douyin-template",
            name: "抖音小店",
            type: "douyin",
            description: "连接抖音小店，同步商品和订单数据",
            icon: "/platforms/douyin.png",
            fields: [
              { key: "appId", label: "应用ID", type: "text", required: true },
              { key: "appSecret", label: "应用密钥", type: "password", required: true },
              { key: "apiKey", label: "API密钥", type: "password", required: true },
            ],
          },
          {
            id: "xiaohongshu-template",
            name: "小红书",
            type: "xiaohongshu",
            description: "连接小红书平台，同步内容和用户数据",
            icon: "/platforms/xiaohongshu.png",
            fields: [
              { key: "apiKey", label: "API密钥", type: "password", required: true },
              { key: "webhookUrl", label: "回调地址", type: "url", required: false },
            ],
          },
        ])
      } catch (error) {
        toast({
          title: "数据加载失败",
          description: "请稍后重试",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800 border-green-200"
      case "disconnected":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "syncing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4" />
      case "disconnected":
        return <WifiOff className="w-4 h-4" />
      case "error":
        return <AlertTriangle className="w-4 h-4" />
      case "syncing":
        return <RefreshCw className="w-4 h-4 animate-spin" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "已连接"
      case "disconnected":
        return "未连接"
      case "error":
        return "连接错误"
      case "syncing":
        return "同步中"
      default:
        return "未知状态"
    }
  }

  const getPlatformIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      wechat: "/platforms/wechat.png",
      douyin: "/platforms/douyin.png",
      xiaohongshu: "/platforms/xiaohongshu.png",
      alipay: "/platforms/alipay.png",
      feishu: "/platforms/feishu.png",
      dingtalk: "/images/platforms/dingtalk.png",
    }
    return iconMap[type] || "/placeholder.svg"
  }

  const handleSync = async (channelId: string) => {
    setSyncing(channelId)
    try {
      // 模拟同步过程
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setChannels((prev) =>
        prev.map((channel) =>
          channel.id === channelId
            ? {
                ...channel,
                status: "connected" as const,
                lastSync: new Date().toLocaleString("zh-CN"),
                errorCount: 0,
              }
            : channel,
        ),
      )

      toast({
        title: "同步成功",
        description: "渠道数据已更新",
      })
    } catch (error) {
      toast({
        title: "同步失败",
        description: "请检查配置后重试",
        variant: "destructive",
      })
    } finally {
      setSyncing(null)
    }
  }

  const handleAddChannel = async () => {
    try {
      const newChannel: Channel = {
        id: `channel-${Date.now()}`,
        name: newChannelData.name || "新渠道",
        type: (newChannelData.type as any) || "wechat",
        status: "disconnected",
        lastSync: "从未同步",
        dataCount: 0,
        errorCount: 0,
        config: newChannelData.config || {},
        metrics: {
          totalUsers: 0,
          activeUsers: 0,
          messages: 0,
          orders: 0,
          revenue: 0,
        },
      }

      setChannels((prev) => [...prev, newChannel])
      setIsAddDialogOpen(false)
      setNewChannelData({})

      toast({
        title: "渠道添加成功",
        description: "请配置连接参数后进行同步",
      })
    } catch (error) {
      toast({
        title: "添加失败",
        description: "请检查输入信息",
        variant: "destructive",
      })
    }
  }

  const handleDeleteChannel = async (channelId: string) => {
    try {
      setChannels((prev) => prev.filter((channel) => channel.id !== channelId))
      toast({
        title: "渠道删除成功",
        description: "渠道已从系统中移除",
      })
    } catch (error) {
      toast({
        title: "删除失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    }
  }

  const filteredChannels = channels.filter((channel) => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || channel.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalMetrics = channels.reduce(
    (acc, channel) => ({
      totalUsers: acc.totalUsers + channel.metrics.totalUsers,
      activeUsers: acc.activeUsers + channel.metrics.activeUsers,
      messages: acc.messages + channel.metrics.messages,
      orders: acc.orders + channel.metrics.orders,
      revenue: acc.revenue + channel.metrics.revenue,
    }),
    { totalUsers: 0, activeUsers: 0, messages: 0, orders: 0, revenue: 0 },
  )

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">渠道中心</h1>
          <p className="text-slate-600 mt-2">管理和监控所有平台渠道连接</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出数据
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                添加渠道
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>添加新渠道</DialogTitle>
                <DialogDescription>选择要连接的平台类型</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="h-20 flex-col gap-2 bg-transparent"
                    onClick={() => {
                      setNewChannelData({ type: template.type as any, name: template.name })
                      setIsAddDialogOpen(false)
                      setIsEditDialogOpen(true)
                    }}
                  >
                    <Image
                      src={template.icon || "/placeholder.svg"}
                      alt={template.name}
                      width={24}
                      height={24}
                      className="rounded"
                    />
                    <span className="text-sm">{template.name}</span>
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索渠道..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="connected">已连接</SelectItem>
            <SelectItem value="disconnected">未连接</SelectItem>
            <SelectItem value="error">连接错误</SelectItem>
            <SelectItem value="syncing">同步中</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 总览指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">总用户数</p>
                <p className="text-2xl font-bold text-slate-900">{totalMetrics.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">活跃用户</p>
                <p className="text-2xl font-bold text-slate-900">{totalMetrics.activeUsers.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">消息数</p>
                <p className="text-2xl font-bold text-slate-900">{totalMetrics.messages.toLocaleString()}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">订单数</p>
                <p className="text-2xl font-bold text-slate-900">{totalMetrics.orders.toLocaleString()}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-red-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">总收入</p>
                <p className="text-2xl font-bold text-slate-900">¥{(totalMetrics.revenue / 10000).toFixed(1)}万</p>
              </div>
              <BarChart3 className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 渠道列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredChannels.map((channel) => (
          <Card key={channel.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={getPlatformIcon(channel.type) || "/placeholder.svg"}
                    alt={channel.name}
                    width={32}
                    height={32}
                    className="rounded"
                  />
                  <div>
                    <CardTitle className="text-lg">{channel.name}</CardTitle>
                    <CardDescription>最后同步: {channel.lastSync}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedChannel(channel)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      编辑配置
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSync(channel.id)}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      立即同步
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      复制配置
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      导出数据
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteChannel(channel.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      删除渠道
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 状态和指标 */}
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(channel.status)}>
                  {getStatusIcon(channel.status)}
                  <span className="ml-1">{getStatusText(channel.status)}</span>
                </Badge>
                {channel.errorCount > 0 && <Badge variant="destructive">{channel.errorCount} 错误</Badge>}
              </div>

              {/* 数据统计 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">总用户</p>
                  <p className="font-semibold">{channel.metrics.totalUsers.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">活跃用户</p>
                  <p className="font-semibold">{channel.metrics.activeUsers.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">消息数</p>
                  <p className="font-semibold">{channel.metrics.messages.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">订单数</p>
                  <p className="font-semibold">{channel.metrics.orders.toLocaleString()}</p>
                </div>
              </div>

              {/* 收入和进度 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>本月收入</span>
                  <span className="font-semibold">¥{channel.metrics.revenue.toLocaleString()}</span>
                </div>
                <Progress value={(channel.metrics.activeUsers / channel.metrics.totalUsers) * 100} className="h-2" />
                <p className="text-xs text-gray-500">
                  活跃率: {((channel.metrics.activeUsers / channel.metrics.totalUsers) * 100).toFixed(1)}%
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSync(channel.id)}
                  disabled={syncing === channel.id}
                  className="flex-1"
                >
                  {syncing === channel.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      同步中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      同步数据
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedChannel(channel)
                    setIsEditDialogOpen(true)
                  }}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 编辑渠道对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedChannel ? "编辑渠道配置" : "添加新渠道"}</DialogTitle>
            <DialogDescription>配置渠道连接参数以启用数据同步</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="channel-name">渠道名称</Label>
              <Input
                id="channel-name"
                value={selectedChannel?.name || newChannelData.name || ""}
                onChange={(e) => {
                  if (selectedChannel) {
                    setSelectedChannel({ ...selectedChannel, name: e.target.value })
                  } else {
                    setNewChannelData({ ...newChannelData, name: e.target.value })
                  }
                }}
                placeholder="输入渠道名称"
              />
            </div>

            {/* 根据渠道类型显示不同的配置字段 */}
            {(selectedChannel?.type === "wechat" || newChannelData.type === "wechat") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="app-id">应用ID</Label>
                  <Input
                    id="app-id"
                    value={selectedChannel?.config.appId || ""}
                    onChange={(e) => {
                      if (selectedChannel) {
                        setSelectedChannel({
                          ...selectedChannel,
                          config: { ...selectedChannel.config, appId: e.target.value },
                        })
                      }
                    }}
                    placeholder="输入微信应用ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-secret">应用密钥</Label>
                  <Input
                    id="app-secret"
                    type="password"
                    value={selectedChannel?.config.appSecret || ""}
                    onChange={(e) => {
                      if (selectedChannel) {
                        setSelectedChannel({
                          ...selectedChannel,
                          config: { ...selectedChannel.config, appSecret: e.target.value },
                        })
                      }
                    }}
                    placeholder="输入应用密钥"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="token">Token</Label>
                  <Input
                    id="token"
                    value={selectedChannel?.config.token || ""}
                    onChange={(e) => {
                      if (selectedChannel) {
                        setSelectedChannel({
                          ...selectedChannel,
                          config: { ...selectedChannel.config, token: e.target.value },
                        })
                      }
                    }}
                    placeholder="输入Token"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={
                selectedChannel
                  ? () => {
                      // 更新现有渠道
                      setChannels((prev) => prev.map((ch) => (ch.id === selectedChannel.id ? selectedChannel : ch)))
                      setIsEditDialogOpen(false)
                      setSelectedChannel(null)
                      toast({
                        title: "配置已保存",
                        description: "渠道配置更新成功",
                      })
                    }
                  : handleAddChannel
              }
            >
              {selectedChannel ? "保存更改" : "添加渠道"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ChannelCenter
