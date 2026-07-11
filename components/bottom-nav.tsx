/**
 * @fileoverview 移动端底部导航栏
 * @description 仅在 xs/sm 断点 (<768px) 显示，提供核心功能快速访问
 * @author YYC³
 * @version 3.0.0
 * @created 2026-07-11
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 * @see 规范文档 4.3 移动端 H5 响应式版本 - 底部导航
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CheckSquare, Bell, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const bottomNavItems = [
  { name: "首页", href: "/dashboard", icon: LayoutDashboard },
  { name: "任务", href: "/tasks", icon: CheckSquare },
  { name: "客户", href: "/customers", icon: Users },
  { name: "通知", href: "/notifications", icon: Bell },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bottom-nav no-select" aria-label="底部导航">
      {bottomNavItems.map((item) => {
        const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard")
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn("bottom-nav-item touch-target no-tap-highlight", isActive && "active")}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
