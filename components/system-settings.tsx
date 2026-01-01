/**
 * @fileoverview system-settings.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Settings,
  Database,
  Shield,
  Bell,
  Palette,
  Globe,
  HardDrive,
  Cpu,
  MemoryStickIcon as Memory,
  Network,
  Mail,
  MessageSquare,
  Phone,
  Download,
  Upload,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Zap,
  Activity,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SystemConfig {
  basic: {
    siteName: string
    siteUrl: string
    adminEmail: string
    timezone: string
    language: string
    dateFormat: string
    currency: string
    companyName: string
    companyAddress: string
    companyPhone: string
  }
  database: {
    host: string
    port: number
    name: string
    username: string
    password: string
    maxConnections: number
    timeout: number
    ssl: boolean
    backup: boolean
    backupInterval: number
  }
  cache: {
    enabled: boolean
    type: "redis" | "memory" | "file"
    host: string
    port: number
    ttl: number
    maxSize: number
    compression: boolean
  }
  security: {
    sessionTimeout: number
    maxLoginAttempts: number
    passwordMinLength: number
    passwordComplexity: boolean
    twoFactorAuth: boolean
    ipWhitelist: string[]
    sslForced: boolean
    corsEnabled: boolean
    allowedOrigins: string[]
  }
  notification: {
    emailEnabled: boolean
    smsEnabled: boolean
    pushEnabled: boolean
    emailProvider: string
    emailHost: string
    emailPort: number
    emailUsername: string
    emailPassword: string
    smsProvider: string
    smsApiKey: string
    pushProvider: string
    pushApiKey: string
  }
  appearance: {
    theme: "light" | "dark" | "auto"
    primaryColor: string
    logoUrl: string
    faviconUrl: string
    customCss: string
    showBranding: boolean
    compactMode: boolean
    animationsEnabled: boolean
  }
}

interface SystemStatus {
  cpu: number
  memory: number
  disk: number
  network: number
  uptime: string
  version: string
  lastUpdate: string
  activeUsers: number
  totalRequests: number
  errorRate: number
}

interface SystemSettingsProps {
  showTitle?: boolean
}

export default function SystemSettings({ showTitle = true }: SystemSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    basic: {
      siteName: "金兰企业管理系统",
      siteUrl: "https://jinlan.com",
      adminEmail: "admin@jinlan.com",
      timezone: "Asia/Shanghai",
      language: "zh-CN",
      dateFormat: "YYYY-MM-DD",
      currency: "CNY",
      companyName: "金兰科技有限公司",
      companyAddress: "北京市朝阳区xxx街道xxx号",
      companyPhone: "400-123-4567",
    },
    database: {
      host: "localhost",
      port: 3306,
      name: "jinlan_db",
      username: "jinlan_user",
      password: "***********",
      maxConnections: 100,
      timeout: 30,
      ssl: true,
      backup: true,
      backupInterval: 24,
    },
    cache: {
      enabled: true,
      type: "redis",
      host: "localhost",
      port: 6379,
      ttl: 3600,
      maxSize: 1024,
      compression: true,
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      passwordComplexity: true,
      twoFactorAuth: false,
      ipWhitelist: ["127.0.0.1", "192.168.1.0/24"],
      sslForced: true,
      corsEnabled: true,
      allowedOrigins: ["https://jinlan.com", "https://app.jinlan.com"],
    },
    notification: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      emailProvider: "smtp",
      emailHost: "smtp.qq.com",
      emailPort: 587,
      emailUsername: "noreply@jinlan.com",
      emailPassword: "***********",
      smsProvider: "aliyun",
      smsApiKey: "***********",
      pushProvider: "firebase",
      pushApiKey: "***********",
    },
    appearance: {
      theme: "light",
      primaryColor: "#3b82f6",
      logoUrl: "/yyc3-logo-blue.png",
      faviconUrl: "/favicon.ico",
      customCss: "",
      showBranding: true,
      compactMode: false,
      animationsEnabled: true,
    },
  })

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    cpu: 45,
    memory: 68,
    disk: 32,
    network: 15,
    uptime: "15天 8小时 32分钟",
    version: "v2.1.0",
    lastUpdate: "2024-01-02 14:30:25",
    activeUsers: 156,
    totalRequests: 89234,
    errorRate: 0.02,
  })

  useEffect(() => {
    // 模拟系统状态更新
    const interval = setInterval(() => {
      setSystemStatus((prev) => ({
        ...prev,
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(95, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 20)),
        activeUsers: prev.activeUsers + Math.floor((Math.random() - 0.5) * 10),
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 50),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleConfigChange = (section: keyof SystemConfig, field: string, value: any) => {
    setSystemConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
    setHasChanges(true)
  }

  const handleSaveConfig = async () => {
    setSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setHasChanges(false)
      toast({
        title: "配置已保存",
        description: "系统配置已成功更新",
      })
    } catch (error) {
      toast({
        title: "保存失败",
        description: "无法保存系统配置，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleExportConfig = () => {
    const configData = JSON.stringify(systemConfig, null, 2)
    const blob = new Blob([configData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `system-config-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "配置已导出",
      description: "系统配置文件已下载到本地",
    })
  }

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string)
        setSystemConfig(config)
        setHasChanges(true)
        toast({
          title: "配置已导入",
          description: "系统配置已成功导入，请检查并保存",
        })
      } catch (error) {
        toast({
          title: "导入失败",
          description: "配置文件格式错误，请检查文件内容",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const handleTestConnection = async (type: string) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "连接测试成功",
        description: `${type}连接正常`,
      })
    } catch (error) {
      toast({
        title: "连接测试失败",
        description: `无法连接到${type}服务`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="responsive-content">
      {/* 页面标题和控制 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          {showTitle && (
            <h1 className="responsive-title flex items-center">
              <Settings className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-600" />
              系统设置
            </h1>
          )}
          <p className="responsive-text mt-2">全局系统配置管理</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <input type="file" accept=".json" onChange={handleImportConfig} className="hidden" id="import-config" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("import-config")?.click()}
            className="responsive-button bg-transparent"
          >
            <Upload className="responsive-icon mr-2" />
            导入配置
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportConfig} className="responsive-button bg-transparent">
            <Download className="responsive-icon mr-2" />
            导出配置
          </Button>
          <Button
            onClick={handleSaveConfig}
            disabled={!hasChanges || saving}
            className="bg-blue-600 hover:bg-blue-700 responsive-button"
          >
            <Save className={`responsive-icon mr-2 ${saving ? "animate-spin" : ""}`} />
            {saving ? "保存中..." : "保存配置"}
          </Button>
        </div>
      </div>

      {/* 系统状态概览 */}
      <Card className="responsive-card border-r-[5px] border-r-slate-500 shadow-[4px_0_12px_rgba(100,116,139,0.15)]">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
            系统状态
          </CardTitle>
          <CardDescription>实时系统运行状态监控</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="responsive-grid-4">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="30%"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="30%"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 30 * 0.01 * systemStatus.cpu} ${2 * Math.PI * 30}`}
                    className="text-blue-600 transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-800">{systemStatus.cpu}%</div>
              <div className="text-xs sm:text-sm text-gray-600">CPU使用率</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="30%"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="30%"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 30 * 0.01 * systemStatus.memory} ${2 * Math.PI * 30}`}
                    className="text-green-600 transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Memory className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-800">{systemStatus.memory}%</div>
              <div className="text-xs sm:text-sm text-gray-600">内存使用率</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="30%"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="30%"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 30 * 0.01 * systemStatus.disk} ${2 * Math.PI * 30}`}
                    className="text-orange-600 transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <HardDrive className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                </div>
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-800">{systemStatus.disk}%</div>
              <div className="text-xs sm:text-sm text-gray-600">磁盘使用率</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="30%"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="30%"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 30 * 0.01 * systemStatus.network} ${2 * Math.PI * 30}`}
                    className="text-purple-600 transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Network className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                </div>
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-800">{systemStatus.network}%</div>
              <div className="text-xs sm:text-sm text-gray-600">网络使用率</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg sm:text-xl font-bold text-gray-800">{systemStatus.activeUsers}</div>
              <div className="text-xs sm:text-sm text-gray-600">在线用户</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-gray-800">
                {systemStatus.totalRequests.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">总请求数</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-gray-800">{systemStatus.uptime}</div>
              <div className="text-xs sm:text-sm text-gray-600">运行时间</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-gray-800">
                {(systemStatus.errorRate * 100).toFixed(2)}%
              </div>
              <div className="text-xs sm:text-sm text-gray-600">错误率</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 配置变更提醒 */}
      {hasChanges && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">您有未保存的配置更改，请及时保存以避免丢失。</AlertDescription>
        </Alert>
      )}

      {/* 配置标签页 */}
      <Tabs defaultValue="basic" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">基本设置</TabsTrigger>
          <TabsTrigger value="database">数据库</TabsTrigger>
          <TabsTrigger value="cache">缓存</TabsTrigger>
          <TabsTrigger value="security">安全</TabsTrigger>
          <TabsTrigger value="notification">通知</TabsTrigger>
          <TabsTrigger value="appearance">外观</TabsTrigger>
        </TabsList>

        {/* 基本设置 */}
        <TabsContent value="basic" className="responsive-spacing">
          <div className="responsive-grid-2">
            <Card className="responsive-card border-r-[5px] border-r-slate-500 shadow-[4px_0_12px_rgba(100,116,139,0.15)]">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-slate-600" />
                  站点信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">站点名称</Label>
                  <Input
                    id="siteName"
                    value={systemConfig.basic.siteName}
                    onChange={(e) => handleConfigChange("basic", "siteName", e.target.value)}
                    className="responsive-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">站点地址</Label>
                  <Input
                    id="siteUrl"
                    value={systemConfig.basic.siteUrl}
                    onChange={(e) => handleConfigChange("basic", "siteUrl", e.target.value)}
                    className="responsive-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">管理员邮箱</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={systemConfig.basic.adminEmail}
                    onChange={(e) => handleConfigChange("basic", "adminEmail", e.target.value)}
                    className="responsive-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">时区</Label>
                  <Select
                    value={systemConfig.basic.timezone}
                    onValueChange={(value) => handleConfigChange("basic", "timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Shanghai">Asia/Shanghai (UTC+8)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">语言</Label>
                  <Select
                    value={systemConfig.basic.language}
                    onValueChange={(value) => handleConfigChange("basic", "language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh-CN">简体中文</SelectItem>
                      <SelectItem value="zh-TW">繁体中文</SelectItem>
                      <SelectItem value="en-US">English</SelectItem>
                      <SelectItem value="ja-JP">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="responsive-card border-r-[5px] border-r-slate-500 shadow-[4px_0_12px_rgba(100,116,139,0.15)]">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-slate-600" />
                  公司信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">公司名称</Label>
                  <Input
                    id="companyName"
                    value={systemConfig.basic.companyName}
                    onChange={(e) => handleConfigChange("basic", "companyName", e.target.value)}
                    className="responsive-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">公司地址</Label>
                  <Textarea
                    id="companyAddress"
                    value={systemConfig.basic.companyAddress}
                    onChange={(e) => handleConfigChange("basic", "companyAddress", e.target.value)}
                    className="responsive-input"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">联系电话</Label>
                  <Input
                    id="companyPhone"
                    value={systemConfig.basic.companyPhone}
                    onChange={(e) => handleConfigChange("basic", "companyPhone", e.target.value)}
                    className="responsive-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">日期格式</Label>
                  <Select
                    value={systemConfig.basic.dateFormat}
                    onValueChange={(value) => handleConfigChange("basic", "dateFormat", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY年MM月DD日">YYYY年MM月DD日</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">货币单位</Label>
                  <Select
                    value={systemConfig.basic.currency}
                    onValueChange={(value) => handleConfigChange("basic", "currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CNY">人民币 (CNY)</SelectItem>
                      <SelectItem value="USD">美元 (USD)</SelectItem>
                      <SelectItem value="EUR">欧元 (EUR)</SelectItem>
                      <SelectItem value="JPY">日元 (JPY)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 数据库设置 */}
        <TabsContent value="database" className="responsive-spacing">
          <Card className="responsive-card border-r-[5px] border-r-slate-500 shadow-[4px_0_12px_rgba(100,116,139,0.15)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center">
                <Database className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-slate-600" />
                数据库配置
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestConnection("数据库")}
                  disabled={loading}
                  className="text-xs bg-transparent"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${loading ? "animate-spin" : ""}`} />
                  测试连接
                </Button>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  已连接
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="responsive-grid-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dbHost">数据库主机</Label>
                    <Input
                      id="dbHost"
                      value={systemConfig.database.host}
                      onChange={(e) => handleConfigChange("database", "host", e.target.value)}
                      className="responsive-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dbPort">端口</Label>
                    <Input
                      id="dbPort"
                      type="number"
                      value={systemConfig.database.port}
                      onChange={(e) => handleConfigChange("database", "port", Number.parseInt(e.target.value))}
                      className="responsive-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dbName">数据库名</Label>
                    <Input
                      id="dbName"
                      value={systemConfig.database.name}
                      onChange={(e) => handleConfigChange("database", "name", e.target.value)}
                      className="responsive-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dbUsername">用户名</Label>
                    <Input
                      id="dbUsername"
                      value={systemConfig.database.username}
                      onChange={(e) => handleConfigChange("database", "username", e.target.value)}
                      className="responsive-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dbPassword">密码</Label>
                    <div className="relative">
                      <Input
                        id="dbPassword"
                        type={showPasswords ? "text" : "password"}
                        value={systemConfig.database.password}
                        onChange={(e) => handleConfigChange("database", "password", e.target.value)}
                        className="responsive-input pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxConnections">最大连接数</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[systemConfig.database.maxConnections]}
                        onValueChange={(value) => handleConfigChange("database", "maxConnections", value[0])}
                        max={500}
                        min={10}
                        step={10}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-600 text-center">
                        {systemConfig.database.maxConnections} 个连接
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeout">连接超时 (秒)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={systemConfig.database.timeout}
                      onChange={(e) => handleConfigChange("database", "timeout", Number.parseInt(e.target.value))}
                      className="responsive-input"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">启用SSL</Label>
                      <p className="text-xs text-gray-600">使用SSL加密连接</p>
                    </div>
                    <Switch
                      checked={systemConfig.database.ssl}
                      onCheckedChange={(checked) => handleConfigChange("database", "ssl", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">自动备份</Label>
                      <p className="text-xs text-gray-600">定期备份数据库</p>
                    </div>
                    <Switch
                      checked={systemConfig.database.backup}
                      onCheckedChange={(checked) => handleConfigChange("database", "backup", checked)}
                    />
                  </div>
                  {systemConfig.database.backup && (
                    <div className="space-y-2">
                      <Label htmlFor="backupInterval">备份间隔 (小时)</Label>
                      <Select
                        value={systemConfig.database.backupInterval.toString()}
                        onValueChange={(value) =>
                          handleConfigChange("database", "backupInterval", Number.parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1小时</SelectItem>
                          <SelectItem value="6">6小时</SelectItem>
                          <SelectItem value="12">12小时</SelectItem>
                          <SelectItem value="24">24小时</SelectItem>
                          <SelectItem value="168">7天</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 缓存设置 */}
        <TabsContent value="cache" className="responsive-spacing">
          <Card className="responsive-card border-r-[5px] border-r-slate-500 shadow-[4px_0_12px_rgba(100,116,139,0.15)]">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-slate-600" />
                缓存配置
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestConnection("缓存")}
                  disabled={loading}
                  className="text-xs bg-transparent"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${loading ? "animate-spin" : ""}`} />
                  测试连接
                </Button>
                <Badge
                  className={systemConfig.cache.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                >
                  {systemConfig.cache.enabled ? "已启用" : "已禁用"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="responsive-grid-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">启用缓存</Label>
                      <p className="text-xs text-gray-600">提高系统响应速度</p>
                    </div>
                    <Switch
                      checked={systemConfig.cache.enabled}
                      onCheckedChange={(checked) => handleConfigChange("cache", "enabled", checked)}
                    />
                  </div>
                  {systemConfig.cache.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cacheType">缓存类型</Label>
                        <Select
                          value={systemConfig.cache.type}
                          onValueChange={(value) => handleConfigChange("cache", "type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="redis">Redis</SelectItem>
                            <SelectItem value="memory">内存缓存</SelectItem>
                            <SelectItem value="file">文件缓存</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {systemConfig.cache.type === "redis" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="cacheHost">Redis主机</Label>
                            <Input
                              id="cacheHost"
                              value={systemConfig.cache.host}
                              onChange={(e) => handleConfigChange("cache", "host", e.target.value)}
                              className="responsive-input"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cachePort">Redis端口</Label>
                            <Input
                              id="cachePort"
                              type="number"
                              value={systemConfig.cache.port}
                              onChange={(e) => handleConfigChange("cache", "port", Number.parseInt(e.target.value))}
                              className="responsive-input"
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
                {systemConfig.cache.enabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cacheTtl">缓存过期时间 (秒)</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[systemConfig.cache.ttl]}
                          onValueChange={(value) => handleConfigChange("cache", "ttl", value[0])}
                          max={86400}
                          min={60}
                          step={60}
                          className="w-full"
                        />
                        <div className="text-sm text-gray-600 text-center">
                          {Math.floor(systemConfig.cache.ttl / 60)} 分钟
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxSize">最大缓存大小 (MB)</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[systemConfig.cache.maxSize]}
                          onValueChange={(value) => handleConfigChange("cache", "maxSize", value[0])}
                          max={10240}
                          min={64}
                          step={64}
                          className="w-full"
                        />
                        <div className="text-sm text-gray-600 text-center">{systemConfig.cache.maxSize} MB</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">启用压缩</Label>
                        <p className="text-xs text-gray-600">压缩缓存数据节省空间</p>
                      </div>
                      <Switch
                        checked={systemConfig.cache.compression}
                        onCheckedChange={(checked) => handleConfigChange("cache", "compression", checked)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 安全设置 */}
        <TabsContent value="security" className="responsive-spacing">
          <div className="responsive-grid-2">
            <Card className="responsive-card border-r-[5px] border-r-slate-500 shadow-[4px_0_12px_rgba(100,116,139,0.15)]">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600" />
                  访问安全
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">会话超时 (分钟)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[systemConfig.security.sessionTimeout]}
                      onValueChange={(value) => handleConfigChange("security", "sessionTimeout", value[0])}
                      max={480}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600 text-center">{systemConfig.security.sessionTimeout} 分钟</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">最大登录尝试次数</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={systemConfig.security.maxLoginAttempts}
                    onChange={(e) =>
                      handleConfigChange("security", "maxLoginAttempts", Number.parseInt(e.target.value))
                    }
                    className="responsive-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">密码最小长度</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={systemConfig.security.passwordMinLength}
                    onChange={(e) =>
                      handleConfigChange("security", "passwordMinLength", Number.parseInt(e.target.value))
                    }
                    className="responsive-input"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">密码复杂度要求</Label>
                    <p className="text-xs text-gray-600">要求包含大小写字母、数字和特殊字符</p>
                  </div>
                  <Switch
                    checked={systemConfig.security.passwordComplexity}
                    onCheckedChange={(checked) => handleConfigChange("security", "passwordComplexity", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">双因素认证</Label>
                    <p className="text-xs text-gray-600">启用2FA增强安全性</p>
                  </div>
                  <Switch
                    checked={systemConfig.security.twoFactorAuth}
                    onCheckedChange={(checked) => handleConfigChange("security", "twoFactorAuth", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="responsive-card border-r-[5px] border-r-slate-500 shadow-[4px_0_12px_rgba(100,116,139,0.15)]">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-600" />
                  网络安全
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">强制SSL</Label>
                    <p className="text-xs text-gray-600">强制使用HTTPS连接</p>
                  </div>
                  <Switch
                    checked={systemConfig.security.sslForced}
                    onCheckedChange={(checked) => handleConfigChange("security", "sslForced", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">启用CORS</Label>
                    <p className="text-xs text-gray-600">跨域资源共享</p>
                  </div>
                  <Switch
                    checked={systemConfig.security.corsEnabled}
                    onCheckedChange={(checked) => handleConfigChange("security", "corsEnabled", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ipWhitelist">IP白名单</Label>
                  <Textarea
                    id="ipWhitelist"
                    value={systemConfig.security.ipWhitelist.join("\n")}
                    onChange={(e) =>
                      handleConfigChange("security", "ipWhitelist", e.target.value.split("\n").filter(Boolean))
                    }
                    placeholder="每行一个IP地址或CIDR"
                    className="responsive-input"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowedOrigins">允许的来源</Label>
                  <Textarea
                    id="allowedOrigins"
                    value={systemConfig.security.allowedOrigins.join("\n")}
                    onChange={(e) =>
                      handleConfigChange("security", "allowedOrigins", e.target.value.split("\n").filter(Boolean))
                    }
                    placeholder="每行一个域名"
                    className="responsive-input"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 通知设置 */}
        <TabsContent value="notification" className="responsive-spacing">
          <div className="responsive-grid-2">
            <Card className="responsive-card border-r-[5px] border-r-slate-500 shadow-[4px_0_12px_rgba(100,116,139,0.15)]">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                  邮件通知
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestConnection("邮件")}
                    disabled={loading}
                    className="text-xs bg-transparent"
                  >
                    <RefreshCw className={`w-3 h-3 mr-1 ${loading ? "animate-spin" : ""}`} />
                    测试发送
                  </Button>
                  <Switch
                    checked={systemConfig.notification.emailEnabled}
                    onCheckedChange={(checked) => handleConfigChange("notification", "emailEnabled", checked)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemConfig.notification.emailEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="emailProvider">邮件服务商</Label>
                      <Select
                        value={systemConfig.notification.emailProvider}
                        onValueChange={(value) => handleConfigChange("notification", "emailProvider", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smtp">SMTP</SelectItem>
                          <SelectItem value="sendmail">Sendmail</SelectItem>
                          <SelectItem value="aliyun">阿里云邮件</SelectItem>
                          <SelectItem value="tencent">腾讯云邮件</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailHost">SMTP主机</Label>
                      <Input
                        id="emailHost"
                        value={systemConfig.notification.emailHost}
                        onChange={(e) => handleConfigChange("notification", "emailHost", e.target.value)}
                        className="responsive-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailPort">SMTP端口</Label>
                      <Input
                        id="emailPort"
                        type="number"
                        value={systemConfig.notification.emailPort}
                        onChange={(e) =>
                          handleConfigChange("notification", "emailPort", Number.parseInt(e.target.value))
                        }
                        className="responsive-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailUsername">用户名</Label>
                      <Input
                        id="emailUsername"
                        value={systemConfig.notification.emailUsername}
                        onChange={(e) => handleConfigChange("notification", "emailUsername", e.target.value)}
                        className="responsive-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailPassword">密码</Label>
                      <div className="relative">
                        <Input
                          id="emailPassword"
                          type={showPasswords ? "text" : "password"}
                          value={systemConfig.notification.emailPassword}
                          onChange={(e) => handleConfigChange("notification", "emailPassword", e.target.value)}
                          className="responsive-input pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords(!showPasswords)}
                        >
                          {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="responsive-card border-r-[5px] border-r-slate-500 shadow-[4px_0_12px_rgba(100,116,139,0.15)]">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                  其他通知
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      短信通知
                    </Label>
                    <p className="text-xs text-gray-600">发送重要通知短信</p>
                  </div>
                  <Switch
                    checked={systemConfig.notification.smsEnabled}
                    onCheckedChange={(checked) => handleConfigChange("notification", "smsEnabled", checked)}
                  />
                </div>
                {systemConfig.notification.smsEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="smsProvider">短信服务商</Label>
                      <Select
                        value={systemConfig.notification.smsProvider}
                        onValueChange={(value) => handleConfigChange("notification", "smsProvider", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aliyun">阿里云短信</SelectItem>
                          <SelectItem value="tencent">腾讯云短信</SelectItem>
                          <SelectItem value="huawei">华为云短信</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smsApiKey">API密钥</Label>
                      <div className="relative">
                        <Input
                          id="smsApiKey"
                          type={showPasswords ? "text" : "password"}
                          value={systemConfig.notification.smsApiKey}
                          onChange={(e) => handleConfigChange("notification", "smsApiKey", e.target.value)}
                          className="responsive-input pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords(!showPasswords)}
                        >
                          {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      推送通知
                    </Label>
                    <p className="text-xs text-gray-600">浏览器推送通知</p>
                  </div>
                  <Switch
                    checked={systemConfig.notification.pushEnabled}
                    onCheckedChange={(checked) => handleConfigChange("notification", "pushEnabled", checked)}
                  />
                </div>
                {systemConfig.notification.pushEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="pushProvider">推送服务商</Label>
                      <Select
                        value={systemConfig.notification.pushProvider}
                        onValueChange={(value) => handleConfigChange("notification", "pushProvider", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="firebase">Firebase</SelectItem>
                          <SelectItem value="jpush">极光推送</SelectItem>
                          <SelectItem value="getui">个推</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pushApiKey">API密钥</Label>
                      <div className="relative">
                        <Input
                          id="pushApiKey"
                          type={showPasswords ? "text" : "password"}
                          value={systemConfig.notification.pushApiKey}
                          onChange={(e) => handleConfigChange("notification", "pushApiKey", e.target.value)}
                          className="responsive-input pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPasswords(!showPasswords)}
                        >
                          {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 外观设置 */}
        <TabsContent value="appearance" className="responsive-spacing">
          <div className="responsive-grid-2">
            <Card className="responsive-card border-r-[5px] border-r-pink-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-pink-600" />
                  主题设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">主题模式</Label>
                  <Select
                    value={systemConfig.appearance.theme}
                    onValueChange={(value) => handleConfigChange("appearance", "theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">浅色主题</SelectItem>
                      <SelectItem value="dark">深色主题</SelectItem>
                      <SelectItem value="auto">跟随系统</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">主色调</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={systemConfig.appearance.primaryColor}
                      onChange={(e) => handleConfigChange("appearance", "primaryColor", e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={systemConfig.appearance.primaryColor}
                      onChange={(e) => handleConfigChange("appearance", "primaryColor", e.target.value)}
                      className="flex-1 responsive-input"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">显示品牌标识</Label>
                    <p className="text-xs text-gray-600">在页面底部显示品牌信息</p>
                  </div>
                  <Switch
                    checked={systemConfig.appearance.showBranding}
                    onCheckedChange={(checked) => handleConfigChange("appearance", "showBranding", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">紧凑模式</Label>
                    <p className="text-xs text-gray-600">减少界面间距，显示更多内容</p>
                  </div>
                  <Switch
                    checked={systemConfig.appearance.compactMode}
                    onCheckedChange={(checked) => handleConfigChange("appearance", "compactMode", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">启用动画</Label>
                    <p className="text-xs text-gray-600">界面过渡动画效果</p>
                  </div>
                  <Switch
                    checked={systemConfig.appearance.animationsEnabled}
                    onCheckedChange={(checked) => handleConfigChange("appearance", "animationsEnabled", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="responsive-card border-r-[5px] border-r-indigo-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <Monitor className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
                  界面定制
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo地址</Label>
                  <Input
                    id="logoUrl"
                    value={systemConfig.appearance.logoUrl}
                    onChange={(e) => handleConfigChange("appearance", "logoUrl", e.target.value)}
                    className="responsive-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faviconUrl">网站图标地址</Label>
                  <Input
                    id="faviconUrl"
                    value={systemConfig.appearance.faviconUrl}
                    onChange={(e) => handleConfigChange("appearance", "faviconUrl", e.target.value)}
                    className="responsive-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customCss">自定义CSS</Label>
                  <Textarea
                    id="customCss"
                    value={systemConfig.appearance.customCss}
                    onChange={(e) => handleConfigChange("appearance", "customCss", e.target.value)}
                    placeholder="/* 在此输入自定义CSS样式 */"
                    className="responsive-input font-mono text-sm"
                    rows={8}
                  />
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">预览效果</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-1 flex items-center justify-center">
                        <Monitor className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="text-xs text-gray-600">桌面端</div>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-1 flex items-center justify-center">
                        <Tablet className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="text-xs text-gray-600">平板端</div>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-1 flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="text-xs text-gray-600">移动端</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
