"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  CheckCircle,
  XCircle,
  RefreshCw,
  Save,
  Globe,
  MessageSquare,
  Users,
  Video,
  DollarSign,
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export default function PlatformSettingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("wechat")
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({
    wechat: true,
    enterprise: false,
    feishu: true,
    dingtalk: false,
    douyin: false,
    alipay: true,
  })

  const [formData, setFormData] = useState({
    wechat: {
      appId: "wx1234567890abcdef",
      appSecret: "abcdef1234567890abcdef1234567890",
      token: "mytoken123",
      encodingAESKey: "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFG",
      url: "https://api.example.com/wechat/callback",
      enabled: true,
    },
    enterprise: {
      corpId: "ww1234567890abcdef",
      corpSecret: "abcdef1234567890abcdef1234567890",
      agentId: "1000001",
      token: "mytoken123",
      encodingAESKey: "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFG",
      enabled: false,
    },
    feishu: {
      appId: "cli_1234567890abcdef",
      appSecret: "abcdef1234567890abcdef1234567890",
      verificationToken: "v1234567890abcdef",
      encryptKey: "abcdefghijklmnopqrstuvwxyz123456",
      enabled: true,
    },
    dingtalk: {
      appKey: "dingoa1234567890",
      appSecret: "abcdef1234567890abcdef1234567890",
      agentId: "123456789",
      token: "mytoken123",
      aesKey: "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFG",
      enabled: false,
    },
    douyin: {
      clientKey: "aw1234567890abcdef",
      clientSecret: "abcdef1234567890abcdef1234567890",
      redirectUri: "https://api.example.com/douyin/callback",
      enabled: false,
    },
    alipay: {
      appId: "2021001234567890",
      privateKey: "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...",
      publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...",
      gatewayUrl: "https://openapi.alipay.com/gateway.do",
      enabled: true,
    },
  })

  const platforms = [
    {
      id: "wechat",
      name: "微信公众号",
      logo: "/platforms/wechat.png",
      description: "配置微信公众号的API接口参数，实现菜单同步和消息接收",
      color: "border-l-green-500",
      bgColor: "bg-green-50",
      docs: "https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html",
    },
    {
      id: "enterprise",
      name: "企业微信",
      logo: "/platforms/wechat.png",
      description: "配置企业微信应用参数，实现企业内部通讯和办公协作",
      color: "border-l-blue-500",
      bgColor: "bg-blue-50",
      docs: "https://developer.work.weixin.qq.com/document/path/90664",
    },
    {
      id: "feishu",
      name: "飞书",
      logo: "/platforms/feishu.png",
      description: "配置飞书开放平台应用，实现消息推送和数据同步",
      color: "border-l-cyan-500",
      bgColor: "bg-cyan-50",
      docs: "https://open.feishu.cn/document/ukTMukTMukTM/uYDNxYjL2QTM24iN0EjN",
    },
    {
      id: "dingtalk",
      name: "钉钉",
      logo: "/platforms/dingtalk.png",
      description: "配置钉钉开放平台应用，实现工作通知和审批流程",
      color: "border-l-blue-600",
      bgColor: "bg-blue-50",
      docs: "https://open.dingtalk.com/document/orgapp-server/tutorial-obtaining-user-personal-information",
    },
    {
      id: "douyin",
      name: "抖音",
      logo: "/platforms/douyin.png",
      description: "配置抖音开放平台，实现内容发布和数据分析",
      color: "border-l-pink-500",
      bgColor: "bg-pink-50",
      docs: "https://developer.open-douyin.com/docs/resource/zh-CN/dop/develop/openapi/overview",
    },
    {
      id: "alipay",
      name: "支付宝",
      logo: "/platforms/alipay.png",
      description: "配置支付宝开放平台，实现支付功能和小程序对接",
      color: "border-l-blue-500",
      bgColor: "bg-blue-50",
      docs: "https://opendocs.alipay.com/open/200/105310",
    },
  ]

  const togglePasswordVisibility = (platform: string, field: string) => {
    const key = `${platform}-${field}`
    setShowPasswords((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "复制成功",
      description: "内容已复制到剪贴板",
    })
  }

  const testConnection = async (platform: string) => {
    toast({
      title: "正在测试连接...",
      description: "请稍候",
    })

    // 模拟API调用
    setTimeout(() => {
      const success = Math.random() > 0.3
      setConnectionStatus((prev) => ({
        ...prev,
        [platform]: success,
      }))

      toast({
        title: success ? "连接成功" : "连接失败",
        description: success ? "平台连接正常" : "请检查配置参数",
        variant: success ? "default" : "destructive",
      })
    }, 2000)
  }

  const saveConfiguration = (platform: string) => {
    toast({
      title: "保存成功",
      description: `${platforms.find((p) => p.id === platform)?.name} 配置已保存`,
    })
  }

  const renderPasswordField = (
    platform: string,
    field: string,
    value: string,
    label: string,
    placeholder: string,
    required = true,
  ) => {
    const key = `${platform}-${field}`
    const isVisible = showPasswords[key]

    return (
      <div className="space-y-2">
        <Label htmlFor={key} className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative">
          <Input
            id={key}
            type={isVisible ? "text" : "password"}
            value={value}
            placeholder={placeholder}
            className="pr-20"
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                [platform]: {
                  ...prev[platform as keyof typeof prev],
                  [field]: e.target.value,
                },
              }))
            }}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => togglePasswordVisibility(platform, field)}
            >
              {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => copyToClipboard(value)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderTextField = (
    platform: string,
    field: string,
    value: string,
    label: string,
    placeholder: string,
    required = true,
    multiline = false,
  ) => {
    const key = `${platform}-${field}`

    return (
      <div className="space-y-2">
        <Label htmlFor={key} className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative">
          {multiline ? (
            <Textarea
              id={key}
              value={value}
              placeholder={placeholder}
              className="pr-10 min-h-[100px]"
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [platform]: {
                    ...prev[platform as keyof typeof prev],
                    [field]: e.target.value,
                  },
                }))
              }}
            />
          ) : (
            <Input
              id={key}
              value={value}
              placeholder={placeholder}
              className="pr-10"
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [platform]: {
                    ...prev[platform as keyof typeof prev],
                    [field]: e.target.value,
                  },
                }))
              }}
            />
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-8 w-8 p-0"
            onClick={() => copyToClipboard(value)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              国内公共平台对接设置
            </h1>
            <p className="text-gray-600 mt-1">
              配置微信公众号、企业微信、飞书、钉钉等平台的对接参数，实现菜单同步和图文内容一键分发
            </p>
          </div>
        </div>
      </div>

      {/* 平台配置标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* 标签页导航 */}
        <div className="border-b border-gray-200">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-gray-50">
            {platforms.map((platform) => (
              <TabsTrigger
                key={platform.id}
                value={platform.id}
                className="flex flex-col items-center space-y-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <div className="relative">
                  <Image
                    src={platform.logo || "/placeholder.svg"}
                    alt={platform.name}
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  {connectionStatus[platform.id] ? (
                    <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-500 bg-white rounded-full" />
                  ) : (
                    <XCircle className="absolute -top-1 -right-1 w-4 h-4 text-red-500 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-xs font-medium text-center">{platform.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* 微信公众号配置 */}
        <TabsContent value="wechat" className="space-y-6">
          <Card className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/images/platforms/wechat.png"
                    alt="微信公众号"
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                  <div>
                    <CardTitle className="text-xl text-green-700">微信公众号对接配置</CardTitle>
                    <CardDescription>配置微信公众号的API接口参数，实现菜单同步和消息接收</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={connectionStatus.wechat ? "default" : "secondary"}
                    className="bg-green-100 text-green-800"
                  >
                    {connectionStatus.wechat ? "已连接" : "未连接"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => window.open(platforms[0].docs, "_blank")}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    开发文档
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderTextField("wechat", "appId", formData.wechat.appId, "AppID", "请输入微信公众号AppID")}
                {renderPasswordField(
                  "wechat",
                  "appSecret",
                  formData.wechat.appSecret,
                  "AppSecret",
                  "请输入微信公众号AppSecret",
                )}
                {renderTextField("wechat", "token", formData.wechat.token, "Token", "请输入自定义Token")}
                {renderPasswordField(
                  "wechat",
                  "encodingAESKey",
                  formData.wechat.encodingAESKey,
                  "EncodingAESKey",
                  "请输入消息加解密密钥",
                )}
              </div>

              <div className="space-y-4">
                {renderTextField("wechat", "url", formData.wechat.url, "服务器URL", "请输入服务器回调URL", true)}

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">启用微信公众号对接</Label>
                    <p className="text-sm text-gray-600">开启后将自动同步菜单和接收消息</p>
                  </div>
                  <Switch
                    checked={formData.wechat.enabled}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({
                        ...prev,
                        wechat: { ...prev.wechat, enabled: checked },
                      }))
                    }}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => testConnection("wechat")}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>测试连接</span>
                  </Button>
                  <Button
                    onClick={() => saveConfiguration("wechat")}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />
                    <span>保存配置</span>
                  </Button>
                </div>
                <Badge variant={connectionStatus.wechat ? "default" : "destructive"}>
                  {connectionStatus.wechat ? "连接正常" : "连接异常"}
                </Badge>
              </div>

              <Alert>
                <MessageSquare className="h-4 w-4" />
                <AlertDescription>
                  配置完成后，请在微信公众平台后台设置服务器配置，并确保服务器URL可以正常访问。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 企业微信配置 */}
        <TabsContent value="enterprise" className="space-y-6">
          <Card className="border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/images/platforms/wechat.png"
                    alt="企业微信"
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                  <div>
                    <CardTitle className="text-xl text-blue-700">企业微信对接配置</CardTitle>
                    <CardDescription>配置企业微信应用参数，实现企业内部通讯和办公协作</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={connectionStatus.enterprise ? "default" : "secondary"}>
                    {connectionStatus.enterprise ? "已连接" : "未连接"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => window.open(platforms[1].docs, "_blank")}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    开发文档
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderTextField("enterprise", "corpId", formData.enterprise.corpId, "CorpID", "请输入企业ID")}
                {renderPasswordField(
                  "enterprise",
                  "corpSecret",
                  formData.enterprise.corpSecret,
                  "CorpSecret",
                  "请输入应用Secret",
                )}
                {renderTextField("enterprise", "agentId", formData.enterprise.agentId, "AgentID", "请输入应用AgentID")}
                {renderTextField("enterprise", "token", formData.enterprise.token, "Token", "请输入回调Token")}
              </div>

              <div className="space-y-4">
                {renderPasswordField(
                  "enterprise",
                  "encodingAESKey",
                  formData.enterprise.encodingAESKey,
                  "EncodingAESKey",
                  "请输入回调加密密钥",
                )}

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">启用企业微信对接</Label>
                    <p className="text-sm text-gray-600">开启后将自动同步通讯录和发送消息</p>
                  </div>
                  <Switch
                    checked={formData.enterprise.enabled}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({
                        ...prev,
                        enterprise: { ...prev.enterprise, enabled: checked },
                      }))
                    }}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => testConnection("enterprise")}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>测试连接</span>
                  </Button>
                  <Button
                    onClick={() => saveConfiguration("enterprise")}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    <span>保存配置</span>
                  </Button>
                </div>
                <Badge variant={connectionStatus.enterprise ? "default" : "destructive"}>
                  {connectionStatus.enterprise ? "连接正常" : "连接异常"}
                </Badge>
              </div>

              <Alert>
                <Users className="h-4 w-4" />
                <AlertDescription>
                  请确保在企业微信管理后台创建了自建应用，并获取了相应的CorpID和Secret。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 飞书配置 */}
        <TabsContent value="feishu" className="space-y-6">
          <Card className="border-r-[5px] border-r-cyan-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image src="/images/platforms/feishu.png" alt="飞书" width={40} height={40} className="rounded-lg" />
                  <div>
                    <CardTitle className="text-xl text-cyan-700">飞书对接配置</CardTitle>
                    <CardDescription>配置飞书开放平台应用，实现消息推送和数据同步</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={connectionStatus.feishu ? "default" : "secondary"}>
                    {connectionStatus.feishu ? "已连接" : "未连接"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => window.open(platforms[2].docs, "_blank")}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    开发文档
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderTextField("feishu", "appId", formData.feishu.appId, "App ID", "请输入飞书应用ID")}
                {renderPasswordField(
                  "feishu",
                  "appSecret",
                  formData.feishu.appSecret,
                  "App Secret",
                  "请输入飞书应用Secret",
                )}
                {renderTextField(
                  "feishu",
                  "verificationToken",
                  formData.feishu.verificationToken,
                  "Verification Token",
                  "请输入事件订阅验证Token",
                )}
                {renderPasswordField(
                  "feishu",
                  "encryptKey",
                  formData.feishu.encryptKey,
                  "Encrypt Key",
                  "请输入事件订阅加密Key",
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">启用飞书对接</Label>
                    <p className="text-sm text-gray-600">开启后将自动接收事件和发送消息</p>
                  </div>
                  <Switch
                    checked={formData.feishu.enabled}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({
                        ...prev,
                        feishu: { ...prev.feishu, enabled: checked },
                      }))
                    }}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => testConnection("feishu")}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>测试连接</span>
                  </Button>
                  <Button
                    onClick={() => saveConfiguration("feishu")}
                    className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700"
                  >
                    <Save className="w-4 h-4" />
                    <span>保存配置</span>
                  </Button>
                </div>
                <Badge variant={connectionStatus.feishu ? "default" : "destructive"}>
                  {connectionStatus.feishu ? "连接正常" : "连接异常"}
                </Badge>
              </div>

              <Alert>
                <Video className="h-4 w-4" />
                <AlertDescription>请在飞书开放平台创建企业自建应用，并配置相应的事件订阅和权限范围。</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 钉钉配置 */}
        <TabsContent value="dingtalk" className="space-y-6">
          <Card className="border-r-[5px] border-r-blue-600 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/images/platforms/dingtalk.png"
                    alt="钉钉"
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                  <div>
                    <CardTitle className="text-xl text-blue-700">钉钉对接配置</CardTitle>
                    <CardDescription>配置钉钉开放平台应用，实现工作通知和审批流程</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={connectionStatus.dingtalk ? "default" : "secondary"}>
                    {connectionStatus.dingtalk ? "已连接" : "未连接"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => window.open(platforms[3].docs, "_blank")}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    开发文档
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderTextField("dingtalk", "appKey", formData.dingtalk.appKey, "AppKey", "请输入钉钉应用AppKey")}
                {renderPasswordField(
                  "dingtalk",
                  "appSecret",
                  formData.dingtalk.appSecret,
                  "AppSecret",
                  "请输入钉钉应用AppSecret",
                )}
                {renderTextField("dingtalk", "agentId", formData.dingtalk.agentId, "AgentID", "请输入应用AgentID")}
                {renderTextField("dingtalk", "token", formData.dingtalk.token, "Token", "请输入回调Token")}
              </div>

              <div className="space-y-4">
                {renderPasswordField("dingtalk", "aesKey", formData.dingtalk.aesKey, "AES Key", "请输入回调加密Key")}

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">启用钉钉对接</Label>
                    <p className="text-sm text-gray-600">开启后将自动同步组织架构和发送工作通知</p>
                  </div>
                  <Switch
                    checked={formData.dingtalk.enabled}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({
                        ...prev,
                        dingtalk: { ...prev.dingtalk, enabled: checked },
                      }))
                    }}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => testConnection("dingtalk")}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>测试连接</span>
                  </Button>
                  <Button
                    onClick={() => saveConfiguration("dingtalk")}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    <span>保存配置</span>
                  </Button>
                </div>
                <Badge variant={connectionStatus.dingtalk ? "default" : "destructive"}>
                  {connectionStatus.dingtalk ? "连接正常" : "连接异常"}
                </Badge>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  请在钉钉开发者后台创建企业内部应用，并配置相应的接口权限和回调地址。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 抖音配置 */}
        <TabsContent value="douyin" className="space-y-6">
          <Card className="border-r-[5px] border-r-pink-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image src="/images/platforms/douyin.png" alt="抖音" width={40} height={40} className="rounded-lg" />
                  <div>
                    <CardTitle className="text-xl text-pink-700">抖音对接配置</CardTitle>
                    <CardDescription>配置抖音开放平台，实现内容发布和数据分析</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={connectionStatus.douyin ? "default" : "secondary"}>
                    {connectionStatus.douyin ? "已连接" : "未连接"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => window.open(platforms[4].docs, "_blank")}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    开发文档
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderTextField(
                  "douyin",
                  "clientKey",
                  formData.douyin.clientKey,
                  "Client Key",
                  "请输入抖音应用Client Key",
                )}
                {renderPasswordField(
                  "douyin",
                  "clientSecret",
                  formData.douyin.clientSecret,
                  "Client Secret",
                  "请输入抖音应用Client Secret",
                )}
              </div>

              <div className="space-y-4">
                {renderTextField(
                  "douyin",
                  "redirectUri",
                  formData.douyin.redirectUri,
                  "Redirect URI",
                  "请输入授权回调地址",
                )}

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">启用抖音对接</Label>
                    <p className="text-sm text-gray-600">开启后将自动发布内容和获取数据分析</p>
                  </div>
                  <Switch
                    checked={formData.douyin.enabled}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({
                        ...prev,
                        douyin: { ...prev.douyin, enabled: checked },
                      }))
                    }}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => testConnection("douyin")}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>测试连接</span>
                  </Button>
                  <Button
                    onClick={() => saveConfiguration("douyin")}
                    className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700"
                  >
                    <Save className="w-4 h-4" />
                    <span>保存配置</span>
                  </Button>
                </div>
                <Badge variant={connectionStatus.douyin ? "default" : "destructive"}>
                  {connectionStatus.douyin ? "连接正常" : "连接异常"}
                </Badge>
              </div>

              <Alert>
                <Video className="h-4 w-4" />
                <AlertDescription>
                  请在抖音开放平台申请应用并通过审核，确保具有内容发布和数据获取权限。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 支付宝配置 */}
        <TabsContent value="alipay" className="space-y-6">
          <Card className="border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/images/platforms/alipay.png"
                    alt="支付宝"
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                  <div>
                    <CardTitle className="text-xl text-blue-700">支付宝对接配置</CardTitle>
                    <CardDescription>配置支付宝开放平台，实现支付功能和小程序对接</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={connectionStatus.alipay ? "default" : "secondary"}>
                    {connectionStatus.alipay ? "已连接" : "未连接"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => window.open(platforms[5].docs, "_blank")}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    开发文档
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderTextField("alipay", "appId", formData.alipay.appId, "应用ID", "请输入支付宝应用ID")}
                {renderTextField(
                  "alipay",
                  "gatewayUrl",
                  formData.alipay.gatewayUrl,
                  "网关地址",
                  "请输入支付宝网关地址",
                )}
              </div>

              <div className="space-y-4">
                {renderTextField(
                  "alipay",
                  "privateKey",
                  formData.alipay.privateKey,
                  "应用私钥",
                  "请输入RSA2应用私钥",
                  true,
                  true,
                )}
                {renderTextField(
                  "alipay",
                  "publicKey",
                  formData.alipay.publicKey,
                  "支付宝公钥",
                  "请输入支付宝RSA2公钥",
                  true,
                  true,
                )}

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">启用支付宝对接</Label>
                    <p className="text-sm text-gray-600">开启后将自动处理支付和小程序相关功能</p>
                  </div>
                  <Switch
                    checked={formData.alipay.enabled}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({
                        ...prev,
                        alipay: { ...prev.alipay, enabled: checked },
                      }))
                    }}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => testConnection("alipay")}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>测试连接</span>
                  </Button>
                  <Button
                    onClick={() => saveConfiguration("alipay")}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    <span>保存配置</span>
                  </Button>
                </div>
                <Badge variant={connectionStatus.alipay ? "default" : "destructive"}>
                  {connectionStatus.alipay ? "连接正常" : "连接异常"}
                </Badge>
              </div>

              <Alert>
                <DollarSign className="h-4 w-4" />
                <AlertDescription>
                  请确保在支付宝开放平台创建了应用并配置了RSA2密钥，同时开通了相应的产品功能。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
