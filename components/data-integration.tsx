/**
 * @fileoverview data-integration.tsx
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Database,
  Server,
  Globe,
  FileText,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Settings,
  Eye,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DataSource {
  id: string
  name: string
  type: "mysql" | "redis" | "api" | "file"
  status: "connected" | "disconnected" | "error"
  lastSync: string
  records: number
  config: Record<string, any>
}

export function DataIntegration() {
  const { toast } = useToast()
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: "1",
      name: "客户数据库",
      type: "mysql",
      status: "connected",
      lastSync: "2024-01-15 14:30:00",
      records: 15420,
      config: {
        host: "localhost",
        port: 3306,
        database: "customers",
        username: "admin",
      },
    },
    {
      id: "2",
      name: "缓存服务器",
      type: "redis",
      status: "connected",
      lastSync: "2024-01-15 14:25:00",
      records: 8930,
      config: {
        host: "redis.jinlan.com",
        port: 6379,
        database: 0,
      },
    },
    {
      id: "3",
      name: "第三方API",
      type: "api",
      status: "error",
      lastSync: "2024-01-15 12:15:00",
      records: 0,
      config: {
        endpoint: "https://api.partner.com/v1",
        apiKey: "sk-***",
        timeout: 30000,
      },
    },
  ])

  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null)
  const [isConfiguring, setIsConfiguring] = useState(false)

  const getStatusIcon = (status: DataSource["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "disconnected":
        return <XCircle className="h-4 w-4 text-gray-400" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusText = (status: DataSource["status"]) => {
    switch (status) {
      case "connected":
        return "已连接"
      case "disconnected":
        return "未连接"
      case "error":
        return "连接错误"
    }
  }

  const getTypeIcon = (type: DataSource["type"]) => {
    switch (type) {
      case "mysql":
        return <Database className="h-5 w-5 text-blue-500" />
      case "redis":
        return <Server className="h-5 w-5 text-red-500" />
      case "api":
        return <Globe className="h-5 w-5 text-green-500" />
      case "file":
        return <FileText className="h-5 w-5 text-orange-500" />
    }
  }

  const handleTestConnection = async (sourceId: string) => {
    toast({
      title: "测试连接",
      description: "正在测试数据源连接...",
    })

    // 模拟测试连接
    setTimeout(() => {
      setDataSources((prev) =>
        prev.map((source) => (source.id === sourceId ? { ...source, status: "connected" as const } : source)),
      )

      toast({
        title: "连接成功",
        description: "数据源连接测试通过",
      })
    }, 2000)
  }

  const handleSync = async (sourceId: string) => {
    toast({
      title: "开始同步",
      description: "正在同步数据源数据...",
    })

    // 模拟数据同步
    setTimeout(() => {
      setDataSources((prev) =>
        prev.map((source) =>
          source.id === sourceId
            ? {
                ...source,
                lastSync: new Date().toLocaleString("zh-CN"),
                records: source.records + Math.floor(Math.random() * 100),
              }
            : source,
        ),
      )

      toast({
        title: "同步完成",
        description: "数据同步成功完成",
      })
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">数据集成</h2>
          <p className="text-gray-600 mt-1">管理和配置各种数据源的集成</p>
        </div>
        <Button onClick={() => setIsConfiguring(true)}>
          <Settings className="h-4 w-4 mr-2" />
          添加数据源
        </Button>
      </div>

      <Tabs defaultValue="sources" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sources">数据源管理</TabsTrigger>
          <TabsTrigger value="sync">同步配置</TabsTrigger>
          <TabsTrigger value="logs">操作日志</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-6">
          {/* 数据源列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataSources.map((source) => (
              <Card key={source.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(source.type)}
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(source.status)}
                      <Badge variant={source.status === "connected" ? "default" : "secondary"}>
                        {getStatusText(source.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">最后同步:</span>
                      <span>{source.lastSync}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">记录数:</span>
                      <span className="font-medium">{source.records.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestConnection(source.id)}
                      className="flex-1"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      测试
                    </Button>
                    <Button size="sm" onClick={() => handleSync(source.id)} className="flex-1">
                      <Play className="h-3 w-3 mr-1" />
                      同步
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSelectedSource(source)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>同步配置</CardTitle>
              <CardDescription>配置数据源的自动同步策略</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-sync">启用自动同步</Label>
                    <Switch id="auto-sync" defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>同步间隔</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5分钟</SelectItem>
                        <SelectItem value="15">15分钟</SelectItem>
                        <SelectItem value="30">30分钟</SelectItem>
                        <SelectItem value="60">1小时</SelectItem>
                        <SelectItem value="360">6小时</SelectItem>
                        <SelectItem value="1440">24小时</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>重试次数</Label>
                    <Input type="number" defaultValue="3" min="1" max="10" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="error-notify">错误通知</Label>
                    <Switch id="error-notify" defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>通知邮箱</Label>
                    <Input type="email" placeholder="admin@jinlan.com" />
                  </div>

                  <div className="space-y-2">
                    <Label>备份策略</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">不备份</SelectItem>
                        <SelectItem value="daily">每日备份</SelectItem>
                        <SelectItem value="weekly">每周备份</SelectItem>
                        <SelectItem value="monthly">每月备份</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">重置</Button>
                <Button>保存配置</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>操作日志</CardTitle>
              <CardDescription>查看数据集成的操作历史记录</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {[
                    {
                      time: "2024-01-15 14:30:00",
                      action: "数据同步",
                      source: "客户数据库",
                      status: "success",
                      message: "成功同步 156 条记录",
                    },
                    {
                      time: "2024-01-15 14:25:00",
                      action: "数据同步",
                      source: "缓存服务器",
                      status: "success",
                      message: "成功同步 89 条记录",
                    },
                    {
                      time: "2024-01-15 12:15:00",
                      action: "连接测试",
                      source: "第三方API",
                      status: "error",
                      message: "连接超时，请检查网络配置",
                    },
                    {
                      time: "2024-01-15 11:45:00",
                      action: "配置更新",
                      source: "客户数据库",
                      status: "success",
                      message: "更新数据库连接配置",
                    },
                    {
                      time: "2024-01-15 10:30:00",
                      action: "数据备份",
                      source: "全部数据源",
                      status: "success",
                      message: "完成定时数据备份",
                    },
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {log.status === "success" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <div className="font-medium text-sm">
                            {log.action} - {log.source}
                          </div>
                          <div className="text-xs text-gray-500">{log.message}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">{log.time}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DataIntegration
