/**
 * @fileoverview 统一命名空间存储 — 按系统 ID 分区
 * @description 自动添加 yyc3:{systemId}: 前缀到 localStorage
 */

export interface SystemStorage {
  get<T>(key: string, fallback?: T): T | undefined
  set<T>(key: string, value: T): void
  remove(key: string): void
  clear(): void
}

/** 创建系统专属存储 */
export function createSystemStorage(systemId: string): SystemStorage {
  const prefix = `yyc3:${systemId}:`

  return {
    get<T>(key: string, fallback?: T): T | undefined {
      try {
        const raw = localStorage.getItem(prefix + key)
        if (raw === null) return fallback
        return JSON.parse(raw) as T
      } catch {
        return fallback
      }
    },

    set<T>(key: string, value: T): void {
      try {
        localStorage.setItem(prefix + key, JSON.stringify(value))
      } catch {
        // quota exceeded, silently fail
      }
    },

    remove(key: string): void {
      localStorage.removeItem(prefix + key)
    },

    clear(): void {
      // Use localStorage.length/key(i) iteration — Object.keys(localStorage)
      // does not work reliably in jsdom or some browsers
      const toRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && k.startsWith(prefix)) toRemove.push(k)
      }
      toRemove.forEach((k) => localStorage.removeItem(k))
    },
  }
}

/** SSR-safe storage (no-op when localStorage is unavailable) */
function createSSRSafeStorage(systemId: string): SystemStorage {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return {
      get: (_k, fallback) => fallback,
      set: () => {},
      remove: () => {},
      clear: () => {},
    }
  }
  return createSystemStorage(systemId)
}

/** 系统存储单例 */
export const storage = {
  aiFamily: createSSRSafeStorage("ai-family"),
  monitor: createSSRSafeStorage("monitor"),
  ops: createSSRSafeStorage("ops"),
  ai: createSSRSafeStorage("ai"),
  dev: createSSRSafeStorage("dev"),
  admin: createSSRSafeStorage("admin"),
  shell: createSSRSafeStorage("shell"),
}

/** 关键存储字段常量 */
export const StorageKeys = {
  AI_ACTIVE_PERSONA: "activePersona",
  AI_API_KEY: "aiApiKey",
  AI_MODEL: "aiModel",
  AI_TEMPERATURE: "aiTemperature",
  AI_TOP_P: "aiTopP",
  AI_MAX_TOKENS: "aiMaxTokens",

  SHELL_WELCOME_DISMISSED: "welcomeDismissed",
  SHELL_SIDEBAR_COLLAPSED: "sidebarCollapsed",
  SHELL_THEME: "theme",

  MONITOR_AUTO_REFRESH: "autoRefresh",
  OPS_FILE_VIEW: "fileManagerView",
} as const
