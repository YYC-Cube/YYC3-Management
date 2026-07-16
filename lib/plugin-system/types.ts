/**
 * @fileoverview 插件系统类型定义 — 适配 Next.js App Router
 * @description 系统注册接口、菜单项、快捷命令等类型
 */

import type React from "react"

/** 侧边栏菜单项 */
export interface MenuItem {
  path: string
  label: string
  icon?: React.ElementType
  badge?: string | number
}

/** 浮窗 Hub 快捷命令 */
export interface HubCommand {
  id: string
  label: string
  systemId: string
  icon: React.ElementType
  action: () => void
}

/** 路由描述 (Next.js App Router 用元数据代替 RouteObject) */
export interface RouteDescriptor {
  /** 相对路径，如 "chat", "settings", "" (index) */
  path: string
  /** 页面标题 */
  title?: string
  /** 是否需要认证 */
  authRequired?: boolean
}

/** 子系统注册信息 */
export interface SystemRegistration {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
  order: number

  /** 侧边栏菜单 */
  menuItems: MenuItem[]
  /** 路由描述 (相对路径) */
  routes: RouteDescriptor[]
  /** 翻译贡献 */
  i18n?: Record<string, string>
  /** 浮窗 Hub 命令 */
  hubCommands?: HubCommand[]
}

/** 欢迎页系统卡片 */
export interface SystemCard {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
  path: string
  badge?: string
}

/** 聊天消息 */
export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
  personaId?: string
  emotion?: string
}

/** 提示词预设 */
export interface PromptPreset {
  id: string
  name: string
  prompt: string
  category: string
}

/** AI Family 家人人格 */
export interface FamilyPersona {
  id: string
  name: string
  shortName: string
  enTitle: string
  role: string
  color: string
  icon: React.ElementType
  personality: string
  expertise: string[]
  greeting: string
  mood: string
  modelName?: string
}

/** 模型选项 */
export interface ModelOption {
  id: string
  name: string
  provider: string
  isLocal: boolean
}
