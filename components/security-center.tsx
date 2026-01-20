/**
 * @fileoverview security-center.tsx
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Eye,
  UserCheck,
  Activity,
  Database,
  Settings,
  RefreshCw,
  Download,
  Search,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Users,
  Server,
  Network,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface SecurityEvent {
  id: string
  type: "login" | "access" | "data" | "system" | "threat"
  level: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  source: string
  timestamp: string
  status: "new" | "investigating" | "resolved" | "ignored"
  details: {
    ip?: string
    user?: string
    location?: string
    device?: string
    action?: string
  }
}

interface SecurityPolicy {
  id: string
  name: string
  category: "access" | "password" | "data" | "network" | "audit"
  enabled: boolean
  description: string
  rules: Array<{
    id: string
    name: string
    enabled: boolean
    value: string | number | boolean
  }>
}

interface ThreatIntelligence {
  id: string
  type: "malware" | "phishing" | "ddos" | "bruteforce" | "vulnerability"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  indicators: string[]
  mitigation: string
  timestamp: string
  source: string
}

export function SecurityCenter({ showTitle = true }: { showTitle?: boolean }) {
  const [securityScore, setSecurityScore] = useState(85)
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [policies, setPolicies] = useState<SecurityPolicy[]>([])
  const [threats, setThreats] = useState<ThreatIntelligence[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterLevel, setFilterLevel] = useState<string>("all")
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false)
  const { toast } = useToast()

  // 模拟数据加载
  useEffect(() => {
    const loadSecurityData = async () => {
      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setEvents([
          {
            id: "evt-001",
            type: "login",
            level: "medium",
            title: "异常登录尝试",
            description: "检测到来自异常地理位置的登录尝试",
            source: "认证系统",
            timestamp: "2024-12-30 14:35:00",
            status: "new",
            details: {
              ip: "192.168.1.100",
              user: "admin",
              location: "北京",
              device: "Chrome/Windows",
              action: "登录失败",
            },
          },
          {
            id: "evt-002",
            type: "access",
            level: "high",
            title: "权限提升检测",
            description: "用户尝试访问超出权限范围的资源",
            source: "访问控制",
            timestamp: "2024-12-30 14:20:00",
            status: "investigating",
            details: {
              ip: "10.0.0.50",
              user: "user001",
              location: "上海",
              device: "Firefox/Linux",
              action: "访问管理员面板",
            },
          },
          {
            id: "evt-003",
            type: "data",
            level: "critical",
            title: "数据泄露风险",
            description: "检测到大量敏感数据被异常访问",
            source: "数据监控",
            timestamp: "2024-12-30 13:45:00",
            status: "new",
            details: {
              ip: "172.16.0.25",
              user: "service_account",
              location: "深圳",
              device: "API调用",
              action: "批量数据查询",
            },
          },
          {
            id: "evt-004",
            type: "system",
            level: "low",
            title: "系统配置变更",
            description: "安全配置文件被修改",
            source: "系统监控",
            timestamp: "2024-12-30 12:30:00",
            status: "resolved",
            details: {
              ip: "127.0.0.1",
              user: "system",
              location: "本地",
              device: "服务器",
              action: "配置更新",
            },
          },
          {
            id: "evt-005",
            type: "threat",
            level: "high",
            title: "恶意软件检测",
            description: "在系统中发现可疑文件",
            source: "威胁检测",
            timestamp: "2024-12-30 11:15:00",
            status: "investigating",
            details: {
              ip: "192.168.1.200",
              user: "unknown",
              location: "广州",
              device: "Unknown",
              action: "文件上传",
            },
          },
        ])

        setPolicies([
          {
            id: "pol-001",
            name: "密码安全策略",
            category: "password",
            enabled: true,
            description: "定义密码复杂度和有效期要求",
            rules: [
              { id: "r1", name: "最小长度", enabled: true, value: 8 },
              { id: "r2", name: "包含特殊字符", enabled: true, value: true },
              { id: "r3", name: "密码有效期(天)", enabled: true, value: 90 },
              { id: "r4", name: "历史密码检查", enabled: true, value: 5 },
            ],
          },
          {
            id: "pol-002",
            name: "访问控制策略",
            category: "access",
            enabled: true,
            description: "控制用户访问权限和资源",
            rules: [
              { id: "r1", name: "多因素认证", enabled: true, value: true },
              { id: "r2", name: "会话超时(分钟)", enabled: true, value: 30 },
              { id: "r3", name: "IP白名单", enabled: false, value: false },
              { id: "r4", name: "设备绑定", enabled: true, value: true },
            ],
          },
          {
            id: "pol-003",
            name: "数据保护策略",
            category: "data",
            enabled: true,
            description: "保护敏感数据的安全",
            rules: [
              { id: "r1", name: "数据加密", enabled: true, value: true },
              { id: "r2", name: "备份频率(小时)", enabled: true, value: 6 },
              { id: "r3", name: "访问日志", enabled: true, value: true },
              { id: "r4", name: "数据脱敏", enabled: true, value: true },
            ],
          },
        ])

        setThreats([
          {
            id: "thr-001",
            type: "malware",
            severity: "high",
            title: "新型勒索软件威胁",
            description: "发现针对企业系统的新型勒索软件变种",
            indicators: ["suspicious_file.exe", "192.168.1.100", "malware_domain.com"],
            mitigation: "更新防病毒软件，加强邮件过滤，定期备份数据",
            timestamp: "2024-12-30 10:00:00",
            source: "威胁情报中心",
          },
          {
            id: "thr-002",
            type: "phishing",
            severity: "medium",
            title: "钓鱼邮件攻击",
            description: "检测到大量针对企业员工的钓鱼邮件",
            indicators: ["phishing@fake-bank.com", "fake-login-page.html"],
            mitigation: "加强员工安全培训，部署邮件安全网关",
            timestamp: "2024-12-30 09:30:00",
            source: "邮件安全",
          },
          {
            id: "thr-003",
            type: "vulnerability",
            severity: "critical",
            title: "系统漏洞预警",
            description: "发现影响Web应用的严重安全漏洞",
            indicators: ["CVE-2024-12345", "SQL注入", "权限绕过"],
            mitigation: "立即更新系统补丁，加强输入验证",
            timestamp: "2024-12-30 08:15:00",
            source: "漏洞扫描",
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

    loadSecurityData()
  }, [toast])

  // 安全评分计算
  useEffect(() => {
    const calculateSecurityScore = () => {
      let score = 100

      // 根据事件严重程度扣分
      events.forEach((event) => {
        if (event.status === "new" || event.status === "investigating") {
          switch (event.level) {
            case "critical":
              score -= 15
              break
            case "high":
              score -= 10
              break
            case "medium":
              score -= 5
              break
            case "low":
              score -= 2
              break
          }
        }
      })

      // 根据策略启用情况加分
      const enabledPolicies = policies.filter((p) => p.enabled).length
      const totalPolicies = policies.length
      if (totalPolicies > 0) {
        score += (enabledPolicies / totalPolicies) * 10
      }

      setSecurityScore(Math.max(0, Math.min(100, Math.round(score))))
    }

    if (!loading) {
      calculateSecurityScore()
    }
  }, [events, policies, loading])

  const getLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-red-100 text-red-800"
      case "investigating":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "ignored":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "login":
        return <UserCheck className="w-4 h-4" />
      case "access":
        return <Lock className="w-4 h-4" />
      case "data":
        return <Database className="w-4 h-4" />
      case "system":
        return <Settings className="w-4 h-4" />
      case "threat":
        return <ShieldAlert className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const handleEventStatusChange = (eventId: string, newStatus: string) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, status: newStatus as any } : event)))
    toast({
      title: "状态已更新",
      description: `事件状态已更改为${newStatus}`,
    })
  }

  const handlePolicyToggle = (policyId: string) => {
    setPolicies((prev) =>
      prev.map((policy) => (policy.id === policyId ? { ...policy, enabled: !policy.enabled } : policy)),
    )
    toast({
      title: "策略已更新",
      description: "安全策略状态已更改",
    })
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterLevel === "all" || event.level === filterLevel
    return matchesSearch && matchesFilter
  })

  // 图表数据
  const securityTrendData = [
    { date: "12-24", score: 88, events: 12 },
    { date: "12-25", score: 85, events: 15 },
    { date: "12-26", score: 90, events: 8 },
    { date: "12-27", score: 87, events: 10 },
    { date: "12-28", score: 83, events: 18 },
    { date: "12-29", score: 86, events: 14 },
    { date: "12-30", score: securityScore, events: events.length },
  ]

  const eventTypeData = [
    { name: "登录事件", value: events.filter((e) => e.type === "login").length, color: "#0ea5e9" },
    { name: "访问控制", value: events.filter((e) => e.type === "access").length, color: "#10b981" },
    { name: "数据安全", value: events.filter((e) => e.type === "data").length, color: "#f59e0b" },
    { name: "系统安全", value: events.filter((e) => e.type === "system").length, color: "#ef4444" },
    { name: "威胁检测", value: events.filter((e) => e.type === "threat").length, color: "#8b5cf6" },
  ]

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
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          {showTitle && (
            <h1 className="text-3xl font-bold text-slate-900">安全中心</h1>
          )}
          <p className="text-slate-600 mt-2">监控和管理系统安全状态</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出报告
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新数据
          </Button>
        </div>
      </div>

      {/* 安全概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">安全评分</p>
                <p className="text-3xl font-bold text-slate-900">{securityScore}</p>
                <div className="flex items-center mt-2">
                  {securityScore >= 80 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ml-1 ${securityScore >= 80 ? "text-green-600" : "text-red-600"}`}>
                    {securityScore >= 80 ? "安全" : "需要关注"}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <Progress value={securityScore} className="mt-4" />
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-red-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">安全事件</p>
                <p className="text-3xl font-bold text-slate-900">{events.length}</p>
                <div className="flex items-center mt-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600 ml-1">
                    {events.filter((e) => e.status === "new").length} 待处理
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">安全策略</p>
                <p className="text-3xl font-bold text-slate-900">{policies.filter((p) => p.enabled).length}</p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600 ml-1">/ {policies.length} 已启用</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">威胁情报</p>
                <p className="text-3xl font-bold text-slate-900">{threats.length}</p>
                <div className="flex items-center mt-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-600 ml-1">
                    {threats.filter((t) => t.severity === "critical" || t.severity === "high").length} 高危
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容区域 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="events">安全事件</TabsTrigger>
          <TabsTrigger value="policies">安全策略</TabsTrigger>
          <TabsTrigger value="threats">威胁情报</TabsTrigger>
          <TabsTrigger value="monitoring">实时监控</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 安全趋势图 */}
            <Card>
              <CardHeader>
                <CardTitle>安全趋势</CardTitle>
                <CardDescription>过去7天的安全评分和事件数量</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer>
                    <LineChart data={securityTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="score"
                        stroke="#10b981"
                        strokeWidth={3}
                        name="安全评分"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="events"
                        stroke="#ef4444"
                        strokeWidth={2}
                        name="事件数量"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* 事件类型分布 */}
            <Card>
              <CardHeader>
                <CardTitle>事件类型分布</CardTitle>
                <CardDescription>各类安全事件的数量分布</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={eventTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {eventTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 最近事件 */}
          <Card>
            <CardHeader>
              <CardTitle>最近安全事件</CardTitle>
              <CardDescription>需要关注的最新安全事件</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedEvent(event)
                      setIsEventDialogOpen(true)
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${getLevelColor(event.level)}`}>{getTypeIcon(event.type)}</div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getLevelColor(event.level)}>{event.level}</Badge>
                      <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {/* 搜索和筛选 */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索安全事件..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="严重程度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部级别</SelectItem>
                <SelectItem value="critical">严重</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 事件列表 */}
          <Card>
            <CardHeader>
              <CardTitle>安全事件列表</CardTitle>
              <CardDescription>所有安全事件的详细信息</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-2 rounded-full ${getLevelColor(event.level)}`}>{getTypeIcon(event.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge className={getLevelColor(event.level)}>{event.level}</Badge>
                          <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>来源: {event.source}</span>
                          <span>时间: {event.timestamp}</span>
                          {event.details.ip && <span>IP: {event.details.ip}</span>}
                          {event.details.user && <span>用户: {event.details.user}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={event.status} onValueChange={(value) => handleEventStatusChange(event.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">新事件</SelectItem>
                          <SelectItem value="investigating">调查中</SelectItem>
                          <SelectItem value="resolved">已解决</SelectItem>
                          <SelectItem value="ignored">已忽略</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event)
                          setIsEventDialogOpen(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>安全策略管理</CardTitle>
              <CardDescription>配置和管理系统安全策略</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {policies.map((policy) => (
                  <div key={policy.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{policy.name}</h4>
                        <p className="text-sm text-gray-600">{policy.description}</p>
                      </div>
                      <Switch checked={policy.enabled} onCheckedChange={() => handlePolicyToggle(policy.id)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {policy.rules.map((rule) => (
                        <div key={rule.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{rule.name}</span>
                          <div className="flex items-center gap-2">
                            {typeof rule.value === "boolean" ? (
                              <Switch checked={rule.value} disabled />
                            ) : (
                              <span className="text-sm font-medium">{rule.value}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>威胁情报</CardTitle>
              <CardDescription>最新的安全威胁信息和防护建议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threats.map((threat) => (
                  <div key={threat.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{threat.title}</h4>
                        <Badge className={getLevelColor(threat.severity)}>{threat.severity}</Badge>
                      </div>
                      <span className="text-sm text-gray-500">{threat.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{threat.description}</p>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">威胁指标:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {threat.indicators.map((indicator, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {indicator}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">缓解措施:</span>
                        <p className="text-sm text-gray-600 mt-1">{threat.mitigation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  系统监控
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CPU使用率</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <Progress value={45} />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">内存使用率</span>
                    <span className="text-sm font-medium">62%</span>
                  </div>
                  <Progress value={62} />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">磁盘使用率</span>
                    <span className="text-sm font-medium">38%</span>
                  </div>
                  <Progress value={38} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  网络监控
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">入站流量</span>
                    <span className="text-sm font-medium">125 MB/s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">出站流量</span>
                    <span className="text-sm font-medium">89 MB/s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">连接数</span>
                    <span className="text-sm font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">异常连接</span>
                    <span className="text-sm font-medium text-red-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  用户活动
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">在线用户</span>
                    <span className="text-sm font-medium">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">今日登录</span>
                    <span className="text-sm font-medium">342</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">失败登录</span>
                    <span className="text-sm font-medium text-yellow-600">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">异常登录</span>
                    <span className="text-sm font-medium text-red-600">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 事件详情对话框 */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>安全事件详情</DialogTitle>
            <DialogDescription>事件ID: {selectedEvent?.id}</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>事件类型</Label>
                  <p className="text-sm mt-1">{selectedEvent.type}</p>
                </div>
                <div>
                  <Label>严重程度</Label>
                  <Badge className={`${getLevelColor(selectedEvent.level)} mt-1`}>{selectedEvent.level}</Badge>
                </div>
              </div>
              <div>
                <Label>事件标题</Label>
                <p className="text-sm mt-1">{selectedEvent.title}</p>
              </div>
              <div>
                <Label>事件描述</Label>
                <p className="text-sm mt-1">{selectedEvent.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>来源</Label>
                  <p className="text-sm mt-1">{selectedEvent.source}</p>
                </div>
                <div>
                  <Label>时间</Label>
                  <p className="text-sm mt-1">{selectedEvent.timestamp}</p>
                </div>
              </div>
              {selectedEvent.details && (
                <div>
                  <Label>详细信息</Label>
                  <div className="mt-2 space-y-2">
                    {selectedEvent.details.ip && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">IP地址:</span>
                        <span className="text-sm">{selectedEvent.details.ip}</span>
                      </div>
                    )}
                    {selectedEvent.details.user && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">用户:</span>
                        <span className="text-sm">{selectedEvent.details.user}</span>
                      </div>
                    )}
                    {selectedEvent.details.location && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">位置:</span>
                        <span className="text-sm">{selectedEvent.details.location}</span>
                      </div>
                    )}
                    {selectedEvent.details.device && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">设备:</span>
                        <span className="text-sm">{selectedEvent.details.device}</span>
                      </div>
                    )}
                    {selectedEvent.details.action && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">操作:</span>
                        <span className="text-sm">{selectedEvent.details.action}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
              关闭
            </Button>
            <Button
              onClick={() => {
                if (selectedEvent) {
                  handleEventStatusChange(selectedEvent.id, "resolved")
                  setIsEventDialogOpen(false)
                }
              }}
            >
              标记为已解决
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SecurityCenter
