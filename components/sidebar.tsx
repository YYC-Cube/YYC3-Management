/**
 * @fileoverview 侧边栏导航组件
 * @description 应用主导航菜单，支持多级菜单和主题切换；移动端自动转换为滑出抽屉
 * @author YYC³
 * @version 3.0.0
 * @created 2025-01-30
 * @modified 2026-07-11
 * @copyright Copyright (c) 2025-2026 YYC³
 * @license MIT
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePageTitle } from "@/contexts/page-title-context"
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  MessageSquare,
  BarChart3,
  DollarSign,
  FolderOpen,
  Target,
  Bell,
  UserPlus,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Building2,
  Shield,
  Database,
  Smartphone,
  Zap,
  BookOpen,
  TestTube,
  Palette,
  Brain,
  Store,
  Sliders,
  Monitor,
  Archive,
  UserCog,
  FileText,
  Megaphone,
  Cpu,
} from "lucide-react"
import Image from "next/image"
import { getThemeForPath } from "@/lib/theme-colors"
import { useAIWidget } from "@/components/ai-floating-widget"

const navigationItems = [
  {
    title: "运营中心",
    items: [
      { name: "数据中心", href: "/dashboard", icon: LayoutDashboard, color: "blue" },
      { name: "客户管理", href: "/customers", icon: Users, color: "green" },
      { name: "任务管理", href: "/tasks", icon: CheckSquare, color: "orange" },
      { name: "沟通协作", href: "/communication", icon: MessageSquare, color: "purple" },
      { name: "数据分析", href: "/analytics", icon: BarChart3, color: "cyan" },
      { name: "财务管理", href: "/finance", icon: DollarSign, color: "emerald" },
      { name: "项目管理", href: "/projects", icon: FolderOpen, color: "indigo" },
      { name: "OKR管理", href: "/okr", icon: Target, color: "pink" },
      { name: "通知中心", href: "/notifications", icon: Bell, color: "amber" },
      { name: "团队协作", href: "/collaboration", icon: UserPlus, color: "sky" },
    ],
  },
  {
    title: "系统管理",
    items: [
      { name: "系统设置", href: "/system-settings", icon: Settings, color: "slate" },
      { name: "用户管理", href: "/user-management", icon: UserCog, color: "violet" },
      { name: "权限管理", href: "/permission-management", icon: Shield, color: "rose" },
      { name: "日志管理", href: "/log-management", icon: FileText, color: "teal" },
      { name: "系统监控", href: "/system-monitor", icon: Monitor, color: "lime" },
      { name: "备份恢复", href: "/backup-recovery", icon: Archive, color: "fuchsia" },
      { name: "帮助中心", href: "/help-center", icon: HelpCircle },
    ],
  },
  {
    title: "高级功能",
    items: [
      { name: "AI助手", href: "/ai-assistant", icon: Brain },
      { name: "AI模型管理", href: "/ai-models", icon: Cpu },
      { name: "租户管理", href: "/tenant-management", icon: Building2 },
      { name: "高级BI", href: "/advanced-bi", icon: BarChart3 },
      { name: "移动应用", href: "/mobile-app", icon: Smartphone },
      { name: "性能优化", href: "/performance-optimization", icon: Zap },
      { name: "用户培训", href: "/training", icon: BookOpen },
      { name: "系统测试", href: "/system-testing", icon: TestTube },
      { name: "创意协作", href: "/creative-collaboration", icon: Palette },
      { name: "AI内容创作", href: "/ai-content-creator", icon: Brain },
    ],
  },
  {
    title: "平台集成",
    items: [
      { name: "门店管理", href: "/store-management", icon: Store },
      { name: "参数设置", href: "/parameter-settings", icon: Sliders },
      { name: "平台设置", href: "/platform-settings", icon: Settings },
      { name: "微信配置", href: "/wechat-config", icon: MessageSquare },
      { name: "渠道中心", href: "/channel-center", icon: Megaphone },
      { name: "数据集成", href: "/data-integration", icon: Database },
    ],
  },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { title } = usePageTitle()
  const { toggleWidget } = useAIWidget()

  const closeMobile = useCallback(() => setIsMobileOpen(false), [])

  useEffect(() => {
    closeMobile()
  }, [pathname, closeMobile])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const sidebarContent = (
    <nav
      aria-label="主导航"
      className={cn(
        "flex flex-col bg-white border-r border-slate-200 h-full",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
        "max-md:w-72 max-md:border-r",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => toggleWidget()}
              aria-label="打开AI浮窗"
              title="打开AI浮窗"
              className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <Image src="/yyc3-icons/pwa/icon-96x96.png" alt="YYC³ Logo" width={20} height={20} className="rounded" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900">企业管理</h1>
              <p className="text-xs text-slate-500">Management System</p>
            </div>
          </div>
        )}
        {isCollapsed && title && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer mx-auto">
                <Image src="/yyc3-icons/pwa/icon-96x96.png" alt="YYC³ Logo" width={20} height={20} className="rounded" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="text-sm font-medium">{title}</div>
            </TooltipContent>
          </Tooltip>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
          className="hidden md:inline-flex h-8 w-8 p-0 hover:bg-slate-100"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={closeMobile}
          aria-label="关闭菜单"
          className="md:hidden h-8 w-8 p-0 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {navigationItems.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard")
                  const theme = getThemeForPath(item.href)
                  const colorClass = item.color || "blue"

                  const NavItem = (
                    <div key={item.name} className="relative">
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start h-10 transition-all duration-200",
                          isCollapsed ? "px-2" : "px-3",
                          `border-r-4 border-r-${colorClass}-500`,
                          isActive
                            ? `text-white hover:opacity-90 border-r-${colorClass}-600 shadow-[2px_0_8px_rgba(var(--color-${colorClass}-500),0.3)]`
                            : `text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-r-${colorClass}-400`,
                        )}
                        style={
                          isActive
                            ? {
                                background: `linear-gradient(to right, ${theme.primary}, ${theme.primary}dd)`,
                              }
                            : {}
                        }
                        asChild
                      >
                        <Link href={item.href} className="no-tap-highlight">
                          <item.icon
                            className={cn(
                              "h-4 w-4",
                              isCollapsed ? "mx-auto" : "mr-3",
                              isActive ? "text-white" : ""
                            )}
                            style={!isActive ? { color: theme.primary } : undefined}
                          />
                          {!isCollapsed && <span className="truncate">{item.name}</span>}
                        </Link>
                      </Button>
                      <div
                        className="absolute right-0 top-0 bottom-0 w-0.75 rounded-r transition-all duration-200"
                        style={{
                          ['--theme-shadow' as any]: theme.shadow,
                          backgroundColor: isActive ? 'var(--theme-shadow)' : 'transparent',
                          boxShadow: isActive ? '0 0 8px var(--theme-shadow)80' : 'none',
                        } as React.CSSProperties}
                      />
                    </div>
                  )

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.name}>
                        <TooltipTrigger asChild>{NavItem}</TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          {item.name}
                        </TooltipContent>
                      </Tooltip>
                    )
                  }

                  return NavItem
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-slate-200 p-4">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-linear-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">管</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">系统管理员</p>
              <p className="text-xs text-slate-500 truncate">admin@company.com</p>
            </div>
          </div>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-8 h-8 bg-linear-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto cursor-pointer">
                <span className="text-white text-sm font-medium">管</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div>
                <p className="font-medium">系统管理员</p>
                <p className="text-xs text-slate-500">admin@company.com</p>
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </nav>
  )

  return (
    <TooltipProvider>
      {/* 桌面端固定侧边栏 */}
      <aside className="hidden md:flex md:shrink-0">{sidebarContent}</aside>

      {/* 移动端触发按钮 */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label="打开导航菜单"
        className="md:hidden fixed top-3 left-3 z-50 h-10 w-10 inline-flex items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm no-tap-highlight"
      >
        <Menu className="h-5 w-5 text-slate-700" />
      </button>

      {/* 移动端遮罩 */}
      <div
        className={cn("mobile-overlay md:hidden", isMobileOpen && "open")}
        onClick={closeMobile}
        aria-hidden={!isMobileOpen}
      />

      {/* 移动端滑出抽屉 */}
      <div
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-50 drawer-transform",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="导航菜单"
      >
        {sidebarContent}
      </div>
    </TooltipProvider>
  )
}
