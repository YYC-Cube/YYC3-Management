/**
 * @fileoverview backup-recovery.tsx
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
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Database,
  Download,
  RotateCcw,
  Calendar,
  Clock,
  HardDrive,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Settings,
  FileText,
  Shield,
  Trash2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BackupRecord {
  id: string
  name: string
  type: "full" | "incremental" | "differential"
  size: string
  createdAt: Date
  status: "completed" | "failed" | "running"
  description: string
  location: string
}

export function BackupRecovery() {
  const { toast } = useToast()
  const [isBackupRunning, setIsBackupRunning] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true)

  const [backupRecords] = useState<BackupRecord[]>([
    {
      id: "1",
      name: "系统完整备份_20241201",
      type: "full",
      size: "2.5 GB",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "completed",
      description: "包含所有系统数据和配置文件的完整备份",
      location: "/backup/full/system_20241201.tar.gz",
    },
    {
      id: "2",
      name: "增量备份_20241130",
      type: "incremental",
      size: "156 MB",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "completed",
      description: "自上次备份以来的增量数据备份",
      location: "/backup/incremental/inc_20241130.tar.gz",
    },
    {
      id: "3",
      name: "数据库备份_20241129",
      type: "differential",
      size: "890 MB",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "completed",
      description: "数据库差异备份，包含客户和订单数据",
      location: "/backup/database/db_20241129.sql.gz",
    },
    {
      id: "4",
      name: "系统备份_20241128",
      type: "full",
      size: "2.3 GB",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      status: "failed",
      description: "备份过程中出现磁盘空间不足错误",
      location: "/backup/failed/system_20241128_failed",
    },
    {
      id: "5",
      name: "配置文件备份_20241127",
      type: "incremental",
      size: "45 MB",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: "completed",
      description: "系统配置文件和用户设置备份",
      location: "/backup/config/config_20241127.tar.gz",
    },
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">完成</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">失败</Badge>
      case "running":
        return <Badge className="bg-blue-100 text-blue-800">运行中</Badge>
      default:
        return <Badge>未知</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "running":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      full: { label: "完整", className: "bg-blue-100 text-blue-800" },
      incremental: { label: "增量", className: "bg-green-100 text-green-800" },
      differential: { label: "差异", className: "bg-orange-100 text-orange-800" },
    }

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.full
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const handleStartBackup = async (type: string) => {
    setIsBackupRunning(true)
    setBackupProgress(0)

    toast({
      title: "开始备份",
      description: `正在执行${type}备份...`,
    })

    // 模拟备份进度
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackupRunning(false)
          toast({
            title: "备份完成",
            description: `${type}备份已成功完成`,
          })
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleRestore = (backupId: string) => {
    const backup = backupRecords.find((b) => b.id === backupId)
    if (backup) {
      toast({
        title: "开始恢复",
        description: `正在从备份 ${backup.name} 恢复数据...`,
      })
    }
  }

  const handleDownload = (backupId: string) => {
    const backup = backupRecords.find((b) => b.id === backupId)
    if (backup) {
      toast({
        title: "下载开始",
        description: `正在下载备份文件 ${backup.name}`,
      })
    }
  }

  const handleDelete = (backupId: string) => {
    const backup = backupRecords.find((b) => b.id === backupId)
    if (backup) {
      toast({
        title: "删除成功",
        description: `备份文件 ${backup.name} 已被删除`,
        variant: "destructive",
      })
    }
  }

  const backupStats = {
    total: backupRecords.length,
    completed: backupRecords.filter((b) => b.status === "completed").length,
    failed: backupRecords.filter((b) => b.status === "failed").length,
    totalSize: "6.4 GB",
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">备份恢复</h1>
          <p className="text-slate-600 mt-2">管理系统数据备份和恢复操作</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleStartBackup("增量")}>
            <Database className="w-4 h-4 mr-2" />
            增量备份
          </Button>
          <Button onClick={() => handleStartBackup("完整")} className="bg-blue-600 hover:bg-blue-700">
            <Database className="w-4 h-4 mr-2" />
            完整备份
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">总备份数</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{backupStats.total}</p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">成功备份</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{backupStats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-red-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">失败备份</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{backupStats.failed}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 hover:scale-105 border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">存储占用</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{backupStats.totalSize}</p>
              </div>
              <HardDrive className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 备份进度 */}
      {isBackupRunning && (
        <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 animate-spin" />
              备份进行中
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={backupProgress} className="w-full" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>正在备份系统数据...</span>
                <span>{backupProgress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 主要内容 */}
      <Tabs defaultValue="backups" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="backups">备份列表</TabsTrigger>
          <TabsTrigger value="schedule">定时备份</TabsTrigger>
          <TabsTrigger value="settings">备份设置</TabsTrigger>
        </TabsList>

        {/* 备份列表 */}
        <TabsContent value="backups" className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300">
            <CardHeader>
              <CardTitle>备份记录</CardTitle>
              <CardDescription>系统备份历史记录和管理</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backupRecords.map((backup) => (
                  <div
                    key={backup.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(backup.status)}
                        <Database className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{backup.name}</h3>
                          {getTypeBadge(backup.type)}
                          {getStatusBadge(backup.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{backup.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{backup.createdAt.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <HardDrive className="w-3 h-3" />
                            <span>{backup.size}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span>{backup.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {backup.status === "completed" && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleRestore(backup.id)}>
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDownload(backup.id)}>
                            <Download className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleDelete(backup.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 定时备份 */}
        <TabsContent value="schedule" className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  自动备份计划
                </div>
                <Switch checked={autoBackupEnabled} onCheckedChange={setAutoBackupEnabled} />
              </CardTitle>
              <CardDescription>配置系统自动备份计划和策略</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>备份频率</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">每小时</SelectItem>
                        <SelectItem value="daily">每日</SelectItem>
                        <SelectItem value="weekly">每周</SelectItem>
                        <SelectItem value="monthly">每月</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>备份时间</Label>
                    <Input type="time" defaultValue="02:00" />
                  </div>

                  <div className="space-y-2">
                    <Label>备份类型</Label>
                    <Select defaultValue="incremental">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">完整备份</SelectItem>
                        <SelectItem value="incremental">增量备份</SelectItem>
                        <SelectItem value="differential">差异备份</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>保留天数</Label>
                    <Input type="number" defaultValue="30" />
                  </div>

                  <div className="space-y-2">
                    <Label>存储位置</Label>
                    <Input defaultValue="/backup/auto/" />
                  </div>

                  <div className="space-y-2">
                    <Label>压缩级别</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">无压缩</SelectItem>
                        <SelectItem value="low">低压缩</SelectItem>
                        <SelectItem value="medium">中等压缩</SelectItem>
                        <SelectItem value="high">高压缩</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">备份内容选择</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label>数据库</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label>用户文件</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label>系统配置</Label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch />
                      <Label>日志文件</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label>应用程序</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch />
                      <Label>临时文件</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>保存计划</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 备份设置 */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  备份配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>默认备份路径</Label>
                  <Input defaultValue="/var/backup/jinlan/" />
                </div>

                <div className="space-y-2">
                  <Label>最大备份文件数</Label>
                  <Input type="number" defaultValue="10" />
                </div>

                <div className="space-y-2">
                  <Label>备份文件命名格式</Label>
                  <Input defaultValue="backup_{date}_{type}" />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>备份完成后发送通知</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch />
                  <Label>备份前验证磁盘空间</Label>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  安全设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>备份文件加密</Label>
                </div>

                <div className="space-y-2">
                  <Label>加密算法</Label>
                  <Select defaultValue="aes256">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aes128">AES-128</SelectItem>
                      <SelectItem value="aes256">AES-256</SelectItem>
                      <SelectItem value="des">3DES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>加密密钥</Label>
                  <Input type="password" placeholder="输入加密密钥" />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch />
                  <Label>备份完整性校验</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>远程存储备份</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
