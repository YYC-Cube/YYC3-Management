/**
 * @fileoverview 插件系统注册初始化 — 将现有模块注册为子系统
 * @description 在客户端启动时调用 registerAllSystems() 完成注册
 */

import {
  LayoutDashboard,
  CheckSquare,
  Users,
  FolderKanban,
  BarChart3,
  Wallet,
  Bell,
  Settings,
  UserCircle2,
} from "lucide-react"
import { pluginRegistry } from "./registry"
import type { SystemRegistration } from "./types"

/** 现有模块的系统注册信息 */
const SYSTEMS: SystemRegistration[] = [
  {
    id: "ai-family",
    name: "AI Family",
    description: "中枢 · 家人协同",
    icon: UserCircle2,
    color: "#00FF88",
    order: 5,
    menuItems: [
      { path: "/ai-family", label: "家族首页" },
      { path: "/ai-family/chat", label: "交流中心" },
      { path: "/ai-family/settings", label: "Family 设置" },
    ],
    routes: [
      { path: "", title: "AI Family 家园" },
      { path: "chat", title: "交流中心" },
      { path: "settings", title: "Family 设置" },
    ],
    hubCommands: [
      {
        id: "hub-call-thinker",
        label: "呼叫万物分析数据",
        systemId: "ai-family",
        icon: UserCircle2,
        action: () => {},
      },
    ],
  },
  {
    id: "dashboard",
    name: "仪表板",
    description: "数据概览与统计",
    icon: LayoutDashboard,
    color: "#00d4ff",
    order: 10,
    menuItems: [{ path: "/dashboard", label: "仪表板" }],
    routes: [{ path: "", title: "仪表板" }],
  },
  {
    id: "tasks",
    name: "任务管理",
    description: "任务跟踪与执行",
    icon: CheckSquare,
    color: "#FF6600",
    order: 20,
    menuItems: [{ path: "/tasks", label: "任务管理" }],
    routes: [{ path: "", title: "任务管理" }],
  },
  {
    id: "customers",
    name: "客户管理",
    description: "CRM 客户关系",
    icon: Users,
    color: "#AA55FF",
    order: 30,
    menuItems: [{ path: "/customers", label: "客户管理" }],
    routes: [{ path: "", title: "客户管理" }],
  },
  {
    id: "projects",
    name: "项目管理",
    description: "项目进度与协作",
    icon: FolderKanban,
    color: "#FFDD00",
    order: 40,
    menuItems: [{ path: "/projects", label: "项目管理" }],
    routes: [{ path: "", title: "项目管理" }],
  },
  {
    id: "analytics",
    name: "数据分析",
    description: "报表与可视化",
    icon: BarChart3,
    color: "#00BFFF",
    order: 50,
    menuItems: [{ path: "/analytics", label: "数据分析" }],
    routes: [{ path: "", title: "数据分析" }],
  },
  {
    id: "finance",
    name: "财务管理",
    description: "收支与预算",
    icon: Wallet,
    color: "#00ff88",
    order: 60,
    menuItems: [{ path: "/finance", label: "财务管理" }],
    routes: [{ path: "", title: "财务管理" }],
  },
  {
    id: "notifications",
    name: "通知中心",
    description: "消息与提醒",
    icon: Bell,
    color: "#FF3366",
    order: 70,
    menuItems: [{ path: "/notifications", label: "通知中心" }],
    routes: [{ path: "", title: "通知中心" }],
  },
  {
    id: "settings",
    name: "系统设置",
    description: "配置与安全",
    icon: Settings,
    color: "#C0C0C0",
    order: 80,
    menuItems: [{ path: "/settings", label: "系统设置" }],
    routes: [{ path: "", title: "系统设置" }],
  },
]

let initialized = false

/** 注册所有系统 (幂等，多次调用安全) */
export function registerAllSystems(): void {
  if (initialized) return
  pluginRegistry.registerAll(SYSTEMS)
  initialized = true
}
