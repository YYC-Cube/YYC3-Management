/**
 * @fileoverview 页面头部组件
 * @description 包含搜索、通知、用户信息等功能
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
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  MessageSquare,
  Calendar,
  Clock,
} from "lucide-react"
import { useTheme } from "next-themes"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, setTheme } = useTheme()
  const [notifications] = useState([
    { id: 1, title: "新客户注册", message: "张三刚刚注册了账户", time: "2分钟前", unread: true },
    { id: 2, title: "任务提醒", message: "项目A的截止日期临近", time: "10分钟前", unread: true },
    { id: 3, title: "系统更新", message: "系统将在今晚进行维护", time: "1小时前", unread: false },
  ])

  const unreadCount = notifications.filter((n) => n.unread).length

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "long",
    })
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* 左侧：搜索栏 */}
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="搜索客户、任务、项目..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 w-full bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
          />
        </div>
      </div>

      {/* 中间：时间显示 */}
      <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
        <Clock className="h-4 w-4" />
        <span>{getCurrentTime()}</span>
      </div>

      {/* 右侧：操作按钮 */}
      <div className="flex items-center space-x-3">
        {/* 快捷操作 */}
        <Button variant="ghost" size="sm" className="hidden md:flex text-purple-500 hover:text-purple-600 hover:bg-purple-50">
          <Calendar className="h-4 w-4 mr-2" />
          日程
        </Button>

        <Button variant="ghost" size="sm" className="hidden md:flex text-green-500 hover:text-green-600 hover:bg-green-50">
          <MessageSquare className="h-4 w-4 mr-2" />
          消息
        </Button>

        {/* 主题切换 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 p-0 text-amber-500 hover:text-amber-600 hover:bg-amber-50"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-500" />
          <span className="sr-only">切换主题</span>
        </Button>

        {/* 通知 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-600">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>通知中心</span>
              <Badge variant="secondary">{unreadCount} 条未读</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                    </div>
                    {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-2"></div>}
                  </div>
                  <span className="text-xs text-gray-400 mt-2">{notification.time}</span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-blue-600 cursor-pointer">查看所有通知</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 设置 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-green-500 hover:text-green-600 hover:bg-green-50">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>系统设置</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Globe className="mr-2 h-4 w-4 text-blue-500" />
              语言设置
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4 text-blue-500" />
              通知设置
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4 text-blue-500" />
              帮助中心
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 用户菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full text-purple-500 hover:text-purple-600 hover:bg-purple-50">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder-user.jpg" alt="用户头像" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder-user.jpg' }} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">管</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">系统管理员</p>
                <p className="text-xs leading-none text-muted-foreground">admin@company.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              个人资料
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              账户设置
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              帮助支持
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
