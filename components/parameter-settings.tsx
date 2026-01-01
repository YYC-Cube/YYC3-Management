/**
 * @fileoverview parameter-settings.tsx
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Settings, Globe, Mail, Shield, Database, Clock, Save, RefreshCw, Eye, EyeOff, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export function ParameterSettings() {
  const { toast } = useToast()
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [settings, setSettings] = useState({
    system: {
      siteName: "锦澜家居企业管理系统",
      siteUrl: "https://jinlan.com",
      adminEmail: "admin@jinlan.com",
      timezone: "Asia/Shanghai",
      language: "zh-CN",
      currency: "CNY",
      dateFormat: "YYYY-MM-DD",
      timeFormat: "24h",
    },
    platforms: {
      wechat: {
        appId: "wx1234567890abcdef",
        appSecret: "***",
        token: "***",
        encodingAESKey: "***",
        enabled: true,
      },
      dingtalk: {
        appKey: "dingoa1234567890",
        appSecret: "***",
        agentId: "123456789",
        enabled: true,
      },
      feishu: {
        appId: "cli_a1234567890abcdef",
        appSecret: "***",
        enabled: false,
      },
      douyin: {
        clientKey: "aw1234567890abcdef",
        clientSecret: "***",
        enabled: false,
      },
    },
    email: {
      smtpHost: "smtp.jinlan.com",
      smtpPort: "587",
      smtpUser: "noreply@jinlan.com",
      smtpPassword: "***",
      smtpEncryption: "tls",
      fromName: "锦澜家居",
      fromEmail: "noreply@jinlan.com",
    },
    security: {
      passwordMinLength: 8,
      passwordRequireSpecial: true,
      passwordRequireNumber: true,
      passwordRequireUpper: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorAuth: false,
      ipWhitelist: "",
    },
  })

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSave = (section: string) => {
    toast({
      title: "设置已保存",
      description: `${section}设置已成功保存`,
    })
  }

  const handleTest = (type: string) => {
    toast({
      title: "测试中...",
      description: `正在测试${type}连接`,
    })

    setTimeout(() => {
      toast({
        title: "测试成功",
        description: `${type}连接测试通过`,
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">参数设置</h2>
          <p className="text-gray-600 mt-1">配置系统运行的各项参数和集成设置</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            重置
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            保存全部
          </Button>
        </div>
      </div>

      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="system">系统设置</TabsTrigger>
          <TabsTrigger value="platforms">平台对接</TabsTrigger>
          <TabsTrigger value="email">邮件配置</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
          <TabsTrigger value="advanced">高级选项</TabsTrigger>
        </TabsList>

        {/* 系统设置 */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                基础设置
              </CardTitle>
              <CardDescription>配置系统的基本信息和显示选项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">网站名称</Label>
                    <Input
                      id="siteName"
                      value={settings.system.siteName}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          system: { ...prev.system, siteName: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">网站地址</Label>
                    <Input
                      id="siteUrl"
                      value={settings.system.siteUrl}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          system: { ...prev.system, siteUrl: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">管理员邮箱</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={settings.system.adminEmail}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          system: { ...prev.system, adminEmail: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>时区设置</Label>
                    <Select value={settings.system.timezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Shanghai">中国标准时间 (UTC+8)</SelectItem>
                        <SelectItem value="UTC">协调世界时 (UTC+0)</SelectItem>
                        <SelectItem value="America/New_York">美国东部时间 (UTC-5)</SelectItem>
                        <SelectItem value="Europe/London">英国时间 (UTC+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>系统语言</Label>
                    <Select value={settings.system.language}>
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

                  <div className="space-y-2">
                    <Label>货币单位</Label>
                    <Select value={settings.system.currency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CNY">人民币 (¥)</SelectItem>
                        <SelectItem value="USD">美元 ($)</SelectItem>
                        <SelectItem value="EUR">欧元 (€)</SelectItem>
                        <SelectItem value="JPY">日元 (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>日期格式</Label>
                    <Select value={settings.system.dateFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YYYY-MM-DD">2024-01-15</SelectItem>
                        <SelectItem value="DD/MM/YYYY">15/01/2024</SelectItem>
                        <SelectItem value="MM/DD/YYYY">01/15/2024</SelectItem>
                        <SelectItem value="YYYY年MM月DD日">2024年01月15日</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>时间格式</Label>
                    <Select value={settings.system.timeFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24小时制</SelectItem>
                        <SelectItem value="12h">12小时制</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("系统")}>
                  <Save className="h-4 w-4 mr-2" />
                  保存设置
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 平台对接 */}
        <TabsContent value="platforms" className="space-y-6">
          {/* 微信配置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image src="/platforms/wechat.png" alt="微信" width={24} height={24} className="mr-2" />
                  微信公众号
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.platforms.wechat.enabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        platforms: {
                          ...prev.platforms,
                          wechat: { ...prev.platforms.wechat, enabled: checked },
                        },
                      }))
                    }
                  />
                  <Badge variant={settings.platforms.wechat.enabled ? "default" : "secondary"}>
                    {settings.platforms.wechat.enabled ? "已启用" : "未启用"}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>AppID</Label>
                  <Input value={settings.platforms.wechat.appId} />
                </div>
                <div className="space-y-2">
                  <Label>AppSecret</Label>
                  <div className="relative">
                    <Input
                      type={showPasswords.wechatSecret ? "text" : "password"}
                      value={settings.platforms.wechat.appSecret}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => togglePasswordVisibility("wechatSecret")}
                    >
                      {showPasswords.wechatSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Token</Label>
                  <Input
                    type={showPasswords.wechatToken ? "text" : "password"}
                    value={settings.platforms.wechat.token}
                  />
                </div>
                <div className="space-y-2">
                  <Label>EncodingAESKey</Label>
                  <Input
                    type={showPasswords.wechatAES ? "text" : "password"}
                    value={settings.platforms.wechat.encodingAESKey}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleTest("微信")}>
                  测试连接
                </Button>
                <Button onClick={() => handleSave("微信")}>保存配置</Button>
              </div>
            </CardContent>
          </Card>

          {/* 钉钉配置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image src="/platforms/dingtalk.png" alt="钉钉" width={24} height={24} className="mr-2" />
                  钉钉企业应用
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.platforms.dingtalk.enabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        platforms: {
                          ...prev.platforms,
                          dingtalk: { ...prev.platforms.dingtalk, enabled: checked },
                        },
                      }))
                    }
                  />
                  <Badge variant={settings.platforms.dingtalk.enabled ? "default" : "secondary"}>
                    {settings.platforms.dingtalk.enabled ? "已启用" : "未启用"}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>AppKey</Label>
                  <Input value={settings.platforms.dingtalk.appKey} />
                </div>
                <div className="space-y-2">
                  <Label>AppSecret</Label>
                  <Input
                    type={showPasswords.dingtalkSecret ? "text" : "password"}
                    value={settings.platforms.dingtalk.appSecret}
                  />
                </div>
                <div className="space-y-2">
                  <Label>AgentId</Label>
                  <Input value={settings.platforms.dingtalk.agentId} />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleTest("钉钉")}>
                  测试连接
                </Button>
                <Button onClick={() => handleSave("钉钉")}>保存配置</Button>
              </div>
            </CardContent>
          </Card>

          {/* 飞书配置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image src="/platforms/feishu.png" alt="飞书" width={24} height={24} className="mr-2" />
                  飞书企业应用
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.platforms.feishu.enabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        platforms: {
                          ...prev.platforms,
                          feishu: { ...prev.platforms.feishu, enabled: checked },
                        },
                      }))
                    }
                  />
                  <Badge variant={settings.platforms.feishu.enabled ? "default" : "secondary"}>
                    {settings.platforms.feishu.enabled ? "已启用" : "未启用"}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>App ID</Label>
                  <Input value={settings.platforms.feishu.appId} />
                </div>
                <div className="space-y-2">
                  <Label>App Secret</Label>
                  <Input
                    type={showPasswords.feishuSecret ? "text" : "password"}
                    value={settings.platforms.feishu.appSecret}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleTest("飞书")}>
                  测试连接
                </Button>
                <Button onClick={() => handleSave("飞书")}>保存配置</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 邮件配置 */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                SMTP邮件服务器
              </CardTitle>
              <CardDescription>配置系统邮件发送服务</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>SMTP服务器</Label>
                    <Input value={settings.email.smtpHost} />
                  </div>
                  <div className="space-y-2">
                    <Label>端口</Label>
                    <Input value={settings.email.smtpPort} />
                  </div>
                  <div className="space-y-2">
                    <Label>用户名</Label>
                    <Input value={settings.email.smtpUser} />
                  </div>
                  <div className="space-y-2">
                    <Label>密码</Label>
                    <Input
                      type={showPasswords.smtpPassword ? "text" : "password"}
                      value={settings.email.smtpPassword}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>加密方式</Label>
                    <Select value={settings.email.smtpEncryption}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">无加密</SelectItem>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>发件人名称</Label>
                    <Input value={settings.email.fromName} />
                  </div>
                  <div className="space-y-2">
                    <Label>发件人邮箱</Label>
                    <Input value={settings.email.fromEmail} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleTest("邮件服务")}>
                  发送测试邮件
                </Button>
                <Button onClick={() => handleSave("邮件")}>保存配置</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 安全设置 */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                安全策略
              </CardTitle>
              <CardDescription>配置系统安全相关参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>密码最小长度</Label>
                    <Input type="number" value={settings.security.passwordMinLength} min="6" max="32" />
                  </div>

                  <div className="space-y-3">
                    <Label>密码复杂度要求</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={settings.security.passwordRequireSpecial}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({
                              ...prev,
                              security: { ...prev.security, passwordRequireSpecial: checked },
                            }))
                          }
                        />
                        <Label>包含特殊字符</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={settings.security.passwordRequireNumber}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({
                              ...prev,
                              security: { ...prev.security, passwordRequireNumber: checked },
                            }))
                          }
                        />
                        <Label>包含数字</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={settings.security.passwordRequireUpper}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({
                              ...prev,
                              security: { ...prev.security, passwordRequireUpper: checked },
                            }))
                          }
                        />
                        <Label>包含大写字母</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>会话超时时间（分钟）</Label>
                    <Input type="number" value={settings.security.sessionTimeout} min="5" max="1440" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>最大登录尝试次数</Label>
                    <Input type="number" value={settings.security.maxLoginAttempts} min="3" max="10" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: { ...prev.security, twoFactorAuth: checked },
                        }))
                      }
                    />
                    <Label>启用双因素认证</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>IP白名单</Label>
                    <Textarea
                      placeholder="每行一个IP地址或IP段，例如：&#10;192.168.1.1&#10;10.0.0.0/8"
                      value={settings.security.ipWhitelist}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: { ...prev.security, ipWhitelist: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave("安全")}>
                  <Save className="h-4 w-4 mr-2" />
                  保存设置
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 高级选项 */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  缓存设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>启用Redis缓存</Label>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>缓存过期时间（秒）</Label>
                  <Input type="number" defaultValue="3600" />
                </div>
                <div className="space-y-2">
                  <Label>缓存前缀</Label>
                  <Input defaultValue="jinlan:" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  会话设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>会话存储方式</Label>
                  <Select defaultValue="redis">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="file">文件存储</SelectItem>
                      <SelectItem value="redis">Redis存储</SelectItem>
                      <SelectItem value="database">数据库存储</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>会话名称</Label>
                  <Input defaultValue="JINLAN_SESSION" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>HttpOnly Cookie</Label>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  日志设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>日志级别</Label>
                  <Select defaultValue="info">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>日志保留天数</Label>
                  <Input type="number" defaultValue="30" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>启用访问日志</Label>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  API设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API请求频率限制</Label>
                  <Input placeholder="100/分钟" />
                </div>
                <div className="space-y-2">
                  <Label>API版本</Label>
                  <Select defaultValue="v1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v1">v1.0</SelectItem>
                      <SelectItem value="v2">v2.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>启用API文档</Label>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ParameterSettings
