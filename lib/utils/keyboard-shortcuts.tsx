"use client"

import React, { useEffect, useCallback, useRef } from "react"

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  description: string
  action: () => void
  enabled?: boolean
  preventDefault?: boolean
}

export interface KeyboardShortcutOptions {
  enabled?: boolean
  global?: boolean
  showHints?: boolean
}

export class KeyboardShortcutManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map()
  private enabled: boolean
  private global: boolean
  private listeners: Set<(event: KeyboardEvent) => void> = new Set()

  constructor(options: KeyboardShortcutOptions = {}) {
    this.enabled = options.enabled !== false
    this.global = options.global || false

    if (this.global) {
      this.attachGlobalListener()
    }
  }

  private getShortcutKey(event: KeyboardEvent): string {
    const parts: string[] = []

    if (event.ctrlKey) parts.push("ctrl")
    if (event.shiftKey) parts.push("shift")
    if (event.altKey) parts.push("alt")
    if (event.metaKey) parts.push("meta")
    parts.push(event.key.toLowerCase())

    return parts.join("+")
  }

  register(shortcut: KeyboardShortcut): void {
    const key = this.buildShortcutKey(shortcut)
    this.shortcuts.set(key, shortcut)
  }

  unregister(key: string, ctrl?: boolean, shift?: boolean, alt?: boolean, meta?: boolean): void {
    const shortcutKey = this.buildShortcutKey({ key, ctrl, shift, alt, meta })
    this.shortcuts.delete(shortcutKey)
  }

  private buildShortcutKey(shortcut: Partial<KeyboardShortcut>): string {
    const parts: string[] = []

    if (shortcut.ctrl) parts.push("ctrl")
    if (shortcut.shift) parts.push("shift")
    if (shortcut.alt) parts.push("alt")
    if (shortcut.meta) parts.push("meta")
    parts.push(shortcut.key!.toLowerCase())

    return parts.join("+")
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (!this.enabled) {
      return
    }

    const shortcutKey = this.getShortcutKey(event)
    const shortcut = this.shortcuts.get(shortcutKey)

    if (shortcut && shortcut.enabled !== false) {
      if (shortcut.preventDefault !== false) {
        event.preventDefault()
      }

      shortcut.action()
    }
  }

  private attachGlobalListener(): void {
    const handler = (event: KeyboardEvent) => {
      this.handleKeyDown(event)
    }

    document.addEventListener("keydown", handler)
    this.listeners.add(handler)
  }

  detachGlobalListener(): void {
    this.listeners.forEach((handler) => {
      document.removeEventListener("keydown", handler)
    })
    this.listeners.clear()
  }

  enable(): void {
    this.enabled = true
  }

  disable(): void {
    this.enabled = false
  }

  clear(): void {
    this.shortcuts.clear()
  }

  getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values())
  }

  getShortcut(key: string, ctrl?: boolean, shift?: boolean, alt?: boolean, meta?: boolean): KeyboardShortcut | undefined {
    const shortcutKey = this.buildShortcutKey({ key, ctrl, shift, alt, meta })
    return this.shortcuts.get(shortcutKey)
  }
}

export interface UseKeyboardShortcutsOptions extends KeyboardShortcutOptions {
  shortcuts: KeyboardShortcut[]
  onShortcutTriggered?: (shortcut: KeyboardShortcut) => void
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions) {
  const {
    shortcuts,
    enabled = true,
    global = false,
    onShortcutTriggered,
  } = options

  const managerRef = useRef<KeyboardShortcutManager | null>(null)

  useEffect(() => {
    managerRef.current = new KeyboardShortcutManager({ enabled, global })

    shortcuts.forEach((shortcut) => {
      managerRef.current?.register(shortcut)
    })

    return () => {
      managerRef.current?.clear()
      if (global) {
        managerRef.current?.detachGlobalListener()
      }
    }
  }, [shortcuts, enabled, global])

  useEffect(() => {
    if (!managerRef.current || !global) {
      return
    }

    const handler = (event: KeyboardEvent) => {
      managerRef.current?.handleKeyDown(event)
    }

    document.addEventListener("keydown", handler)
    return () => {
      document.removeEventListener("keydown", handler)
    }
  }, [global, shortcuts])

  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    managerRef.current?.register(shortcut)
  }, [])

  const unregisterShortcut = useCallback(
    (key: string, ctrl?: boolean, shift?: boolean, alt?: boolean, meta?: boolean) => {
      managerRef.current?.unregister(key, ctrl, shift, alt, meta)
    },
    []
  )

  const enableShortcuts = useCallback(() => {
    managerRef.current?.enable()
  }, [])

  const disableShortcuts = useCallback(() => {
    managerRef.current?.disable()
  }, [])

  return {
    registerShortcut,
    unregisterShortcut,
    enableShortcuts,
    disableShortcuts,
    getShortcuts: () => managerRef.current?.getShortcuts() || [],
  }
}

export interface ShortcutHintProps {
  shortcuts: KeyboardShortcut[]
  className?: string
}

export function ShortcutHints({ shortcuts, className = "" }: ShortcutHintProps) {
  const formatShortcut = (shortcut: KeyboardShortcut): string => {
    const parts: string[] = []

    if (shortcut.ctrl) parts.push("Ctrl")
    if (shortcut.shift) parts.push("Shift")
    if (shortcut.alt) parts.push("Alt")
    if (shortcut.meta) parts.push("Meta")
    parts.push(shortcut.key.toUpperCase())

    return parts.join(" + ")
  }

  return (
    <div className={`shortcut-hints ${className}`}>
      {shortcuts.map((shortcut, index) => (
        <div key={index} className="shortcut-hint">
          <kbd className="shortcut-key">{formatShortcut(shortcut)}</kbd>
          <span className="shortcut-description">{shortcut.description}</span>
        </div>
      ))}
    </div>
  )
}

export const commonShortcuts: KeyboardShortcut[] = [
  {
    key: "n",
    ctrl: true,
    description: "新建",
    action: () => console.log("New"),
  },
  {
    key: "s",
    ctrl: true,
    description: "保存",
    action: () => console.log("Save"),
  },
  {
    key: "f",
    ctrl: true,
    description: "搜索",
    action: () => console.log("Search"),
  },
  {
    key: "a",
    ctrl: true,
    description: "全选",
    action: () => console.log("Select All"),
  },
  {
    key: "c",
    ctrl: true,
    description: "复制",
    action: () => console.log("Copy"),
  },
  {
    key: "v",
    ctrl: true,
    description: "粘贴",
    action: () => console.log("Paste"),
  },
  {
    key: "x",
    ctrl: true,
    description: "剪切",
    action: () => console.log("Cut"),
  },
  {
    key: "z",
    ctrl: true,
    description: "撤销",
    action: () => console.log("Undo"),
  },
  {
    key: "y",
    ctrl: true,
    description: "重做",
    action: () => console.log("Redo"),
  },
  {
    key: "Delete",
    description: "删除",
    action: () => console.log("Delete"),
  },
  {
    key: "Escape",
    description: "取消",
    action: () => console.log("Cancel"),
  },
  {
    key: "Enter",
    description: "确认",
    action: () => console.log("Confirm"),
  },
]
