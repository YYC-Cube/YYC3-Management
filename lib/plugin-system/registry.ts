/**
 * @fileoverview 插件注册中心 — 收集与管理所有子系统注册信息
 * @description 单例模式，系统通过 register() 注册，UI 通过 getAll() / getBy() 查询
 */

import type { SystemRegistration, SystemCard, HubCommand } from "./types"

class PluginRegistry {
  private systems = new Map<string, SystemRegistration>()

  /** 注册一个子系统 */
  register(registration: SystemRegistration): void {
    if (this.systems.has(registration.id)) {
      console.warn(`[PluginRegistry] 系统 "${registration.id}" 已注册，将被覆盖`)
    }
    this.systems.set(registration.id, registration)
  }

  /** 批量注册 */
  registerAll(registrations: SystemRegistration[]): void {
    registrations.forEach((r) => this.register(r))
  }

  /** 注销一个子系统 */
  unregister(id: string): void {
    this.systems.delete(id)
  }

  /** 获取单个系统注册信息 */
  get(id: string): SystemRegistration | undefined {
    return this.systems.get(id)
  }

  /** 获取所有已注册系统 (按 order 排序) */
  getAll(): SystemRegistration[] {
    return Array.from(this.systems.values()).sort((a, b) => a.order - b.order)
  }

  /** 转换为欢迎页卡片 */
  toCards(): SystemCard[] {
    return this.getAll().map((sys) => ({
      id: sys.id,
      name: sys.name,
      description: sys.description,
      icon: sys.icon,
      color: sys.color,
      path: sys.menuItems[0]?.path ?? `/${sys.id}`,
      badge: undefined,
    }))
  }

  /** 获取所有系统的 Hub 命令 */
  getAllHubCommands(): HubCommand[] {
    return this.getAll().flatMap((sys) => sys.hubCommands ?? [])
  }

  /** 清除所有注册 */
  clear(): void {
    this.systems.clear()
  }

  /** 已注册系统数量 */
  get size(): number {
    return this.systems.size
  }
}

/** 全局单例 */
export const pluginRegistry = new PluginRegistry()
