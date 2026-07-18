/**
 * @fileoverview 跨系统事件总线 — AI Family 中枢核心
 * @description 基于 pub/sub 模式，支持 on/off/once/emit
 */

type Handler = (...args: unknown[]) => void

export class EventBus {
  private listeners = new Map<string, Set<Handler>>()

  /** 发送事件 */
  emit(event: string, ...args: unknown[]): void {
    this.listeners.get(event)?.forEach((fn) => fn(...args))
  }

  /** 监听事件，返回取消监听函数 */
  on(event: string, fn: Handler): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event)!.add(fn)
    return () => {
      this.listeners.get(event)?.delete(fn)
    }
  }

  /** 一次性监听 */
  once(event: string, fn: Handler): () => void {
    const wrapper = (...args: unknown[]) => {
      fn(...args)
      this.off(event, wrapper)
    }
    return this.on(event, wrapper)
  }

  /** 取消监听 */
  off(event: string, fn: Handler): void {
    this.listeners.get(event)?.delete(fn)
  }

  /** 清除指定事件或全部事件的监听器 */
  clear(event?: string): void {
    if (event) {
      this.listeners.delete(event)
    } else {
      this.listeners.clear()
    }
  }

  /** 获取指定事件的监听器数量 */
  listenerCount(event: string): number {
    return this.listeners.get(event)?.size ?? 0
  }
}

/** 全局单例 */
export const eventBus = new EventBus()

/**
 * 预定义事件常量 (统一全系统)
 */
export const Events = {
  // AI Family 中枢事件
  AI_PERSONA_CHANGED: "ai:persona-changed",
  AI_ASK: "ai:ask",
  AI_RESPONSE: "ai:response",

  // 浮窗 Hub 事件
  HUB_OPEN: "hub:open",
  HUB_CLOSE: "hub:close",
  HUB_NAVIGATE: "hub:navigate",
  HUB_COMMAND: "hub:command",

  // 系统间事件
  SYSTEM_NOTIFY: "system:notify",
  SYSTEM_NAVIGATE: "system:navigate",

  // Shell 事件
  SHELL_WELCOME_DISMISS: "shell:welcome-dismiss",
  SHELL_SIDEBAR_TOGGLE: "shell:sidebar-toggle",
} as const

export type EventName = (typeof Events)[keyof typeof Events]
