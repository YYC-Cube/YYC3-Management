/**
 * BasicSettings Component
 * 基本设置组件
 */

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, Mail, Phone, MapPin } from "lucide-react"
import type { BasicConfig } from "./types"
import { useSystemConfig } from "./hooks"

export function BasicSettings() {
  const { config, updateConfig } = useSystemConfig();
  const basic = config.basic;

  const handleChange = (field: keyof BasicConfig, value: any) => {
    updateConfig('basic', field, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          基本设置
        </CardTitle>
        <CardDescription>
          配置站点的基本信息和公司资料
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 站点信息 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">站点信息</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">站点名称</Label>
              <Input
                id="siteName"
                value={basic.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                placeholder="请输入站点名称"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteUrl">站点URL</Label>
              <Input
                id="siteUrl"
                type="url"
                value={basic.siteUrl}
                onChange={(e) => handleChange('siteUrl', e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminEmail">管理员邮箱</Label>
              <Input
                id="adminEmail"
                type="email"
                value={basic.adminEmail}
                onChange={(e) => handleChange('adminEmail', e.target.value)}
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">时区</Label>
              <Select
                value={basic.timezone}
                onValueChange={(value) => handleChange('timezone', value)}
              >
                <SelectTrigger id="timezone">
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
                value={basic.language}
                onValueChange={(value) => handleChange('language', value)}
              >
                <SelectTrigger id="language">
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
              <Label htmlFor="dateFormat">日期格式</Label>
              <Select
                value={basic.dateFormat}
                onValueChange={(value) => handleChange('dateFormat', value)}
              >
                <SelectTrigger id="dateFormat">
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
              <Label htmlFor="currency">货币</Label>
              <Select
                value={basic.currency}
                onValueChange={(value) => handleChange('currency', value)}
              >
                <SelectTrigger id="currency">
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
          </div>
        </div>

        {/* 公司信息 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">公司信息</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="companyName">公司名称</Label>
              <Input
                id="companyName"
                value={basic.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="请输入公司名称"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="companyAddress">公司地址</Label>
              <Input
                id="companyAddress"
                value={basic.companyAddress}
                onChange={(e) => handleChange('companyAddress', e.target.value)}
                placeholder="请输入公司地址"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyPhone">联系电话</Label>
              <Input
                id="companyPhone"
                type="tel"
                value={basic.companyPhone}
                onChange={(e) => handleChange('companyPhone', e.target.value)}
                placeholder="+86-400-123-4567"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
