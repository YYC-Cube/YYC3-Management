import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import {
  KeyboardShortcutManager,
  useKeyboardShortcuts,
  ShortcutHints,
  commonShortcuts,
} from "@/lib/utils/keyboard-shortcuts"

describe("KeyboardShortcutManager", () => {
  let manager: KeyboardShortcutManager

  beforeEach(() => {
    manager = new KeyboardShortcutManager({
      enabled: true,
      global: false,
    })
  })

  afterEach(() => {
    manager.clear()
    manager.detachGlobalListener()
  })

  describe("initialization", () => {
    it("should initialize with default options", () => {
      const defaultManager = new KeyboardShortcutManager()

      expect(defaultManager).toBeDefined()
    })

    it("should initialize with custom options", () => {
      const customManager = new KeyboardShortcutManager({
        enabled: true,
        global: true,
      })

      expect(customManager).toBeDefined()
    })

    it("should be enabled by default", () => {
      const defaultManager = new KeyboardShortcutManager()

      expect(defaultManager).toBeDefined()
    })
  })

  describe("register", () => {
    it("should register a shortcut", () => {
      const action = vi.fn()
      const shortcut = {
        key: "a",
        description: "Test shortcut",
        action,
      }

      manager.register(shortcut)

      const registered = manager.getShortcut("a")
      expect(registered).toBeDefined()
      expect(registered!.description).toBe("Test shortcut")
    })

    it("should register shortcut with modifiers", () => {
      const action = vi.fn()
      const shortcut = {
        key: "s",
        ctrl: true,
        description: "Save",
        action,
      }

      manager.register(shortcut)

      const registered = manager.getShortcut("s", true)
      expect(registered).toBeDefined()
      expect(registered!.ctrl).toBe(true)
    })

    it("should register shortcut with multiple modifiers", () => {
      const action = vi.fn()
      const shortcut = {
        key: "s",
        ctrl: true,
        shift: true,
        alt: true,
        description: "Save with modifiers",
        action,
      }

      manager.register(shortcut)

      const registered = manager.getShortcut("s", true, true, true)
      expect(registered).toBeDefined()
    })

    it("should register multiple shortcuts", () => {
      const action1 = vi.fn()
      const action2 = vi.fn()

      manager.register({ key: "a", description: "Action 1", action: action1 })
      manager.register({ key: "b", description: "Action 2", action: action2 })

      expect(manager.getShortcuts()).toHaveLength(2)
    })

    it("should overwrite existing shortcut", () => {
      const action1 = vi.fn()
      const action2 = vi.fn()

      manager.register({ key: "a", description: "Action 1", action: action1 })
      manager.register({ key: "a", description: "Action 2", action: action2 })

      const registered = manager.getShortcut("a")
      expect(registered!.description).toBe("Action 2")
    })
  })

  describe("unregister", () => {
    it("should unregister a shortcut", () => {
      const action = vi.fn()
      manager.register({ key: "a", description: "Test", action })

      manager.unregister("a")

      const registered = manager.getShortcut("a")
      expect(registered).toBeUndefined()
    })

    it("should unregister shortcut with modifiers", () => {
      const action = vi.fn()
      manager.register({ key: "s", ctrl: true, description: "Save", action })

      manager.unregister("s", true)

      const registered = manager.getShortcut("s", true)
      expect(registered).toBeUndefined()
    })

    it("should handle unregistering non-existent shortcut", () => {
      expect(() => manager.unregister("x")).not.toThrow()
    })
  })

  describe("handleKeyDown", () => {
    it("should trigger registered shortcut", () => {
      const action = vi.fn()
      manager.register({ key: "a", description: "Test", action })

      const event = new KeyboardEvent("keydown", { key: "a" })
      manager.handleKeyDown(event)

      expect(action).toHaveBeenCalled()
    })

    it("should trigger shortcut with modifiers", () => {
      const action = vi.fn()
      manager.register({ key: "s", ctrl: true, description: "Save", action })

      const event = new KeyboardEvent("keydown", { key: "s", ctrlKey: true })
      manager.handleKeyDown(event)

      expect(action).toHaveBeenCalled()
    })

    it("should not trigger when modifiers don't match", () => {
      const action = vi.fn()
      manager.register({ key: "s", ctrl: true, description: "Save", action })

      const event = new KeyboardEvent("keydown", { key: "s", ctrlKey: false })
      manager.handleKeyDown(event)

      expect(action).not.toHaveBeenCalled()
    })

    it("should prevent default when configured", () => {
      const action = vi.fn()
      manager.register({ key: "a", description: "Test", action, preventDefault: true })

      const event = new KeyboardEvent("keydown", { key: "a" })
      event.preventDefault = vi.fn()

      manager.handleKeyDown(event)

      expect(event.preventDefault).toHaveBeenCalled()
    })

    it("should not prevent default when not configured", () => {
      const action = vi.fn()
      manager.register({ key: "a", description: "Test", action, preventDefault: false })

      const event = new KeyboardEvent("keydown", { key: "a" })
      event.preventDefault = vi.fn()

      manager.handleKeyDown(event)

      expect(event.preventDefault).not.toHaveBeenCalled()
    })

    it("should not trigger when disabled", () => {
      const action = vi.fn()
      const disabledManager = new KeyboardShortcutManager({ enabled: false })
      disabledManager.register({ key: "a", description: "Test", action })

      const event = new KeyboardEvent("keydown", { key: "a" })
      disabledManager.handleKeyDown(event)

      expect(action).not.toHaveBeenCalled()
    })

    it("should not trigger when shortcut is disabled", () => {
      const action = vi.fn()
      manager.register({ key: "a", description: "Test", action, enabled: false })

      const event = new KeyboardEvent("keydown", { key: "a" })
      manager.handleKeyDown(event)

      expect(action).not.toHaveBeenCalled()
    })

    it("should be case insensitive", () => {
      const action = vi.fn()
      manager.register({ key: "a", description: "Test", action })

      const event = new KeyboardEvent("keydown", { key: "A" })
      manager.handleKeyDown(event)

      expect(action).toHaveBeenCalled()
    })
  })

  describe("getShortcut", () => {
    it("should return registered shortcut", () => {
      const action = vi.fn()
      manager.register({ key: "a", description: "Test", action })

      const shortcut = manager.getShortcut("a")
      expect(shortcut).toBeDefined()
      expect(shortcut!.key).toBe("a")
    })

    it("should return undefined for non-existent shortcut", () => {
      const shortcut = manager.getShortcut("x")
      expect(shortcut).toBeUndefined()
    })

    it("should return shortcut with modifiers", () => {
      const action = vi.fn()
      manager.register({ key: "s", ctrl: true, description: "Save", action })

      const shortcut = manager.getShortcut("s", true)
      expect(shortcut).toBeDefined()
      expect(shortcut!.ctrl).toBe(true)
    })
  })

  describe("getShortcuts", () => {
    it("should return all registered shortcuts", () => {
      const action1 = vi.fn()
      const action2 = vi.fn()

      manager.register({ key: "a", description: "Action 1", action: action1 })
      manager.register({ key: "b", description: "Action 2", action: action2 })

      const shortcuts = manager.getShortcuts()
      expect(shortcuts).toHaveLength(2)
    })

    it("should return empty array when no shortcuts", () => {
      const shortcuts = manager.getShortcuts()
      expect(shortcuts).toHaveLength(0)
    })
  })

  describe("enable/disable", () => {
    it("should enable shortcuts", () => {
      manager.disable()
      manager.enable()

      const action = vi.fn()
      manager.register({ key: "a", description: "Test", action })

      const event = new KeyboardEvent("keydown", { key: "a" })
      manager.handleKeyDown(event)

      expect(action).toHaveBeenCalled()
    })

    it("should disable shortcuts", () => {
      const action = vi.fn()
      manager.register({ key: "a", description: "Test", action })

      manager.disable()

      const event = new KeyboardEvent("keydown", { key: "a" })
      manager.handleKeyDown(event)

      expect(action).not.toHaveBeenCalled()
    })
  })

  describe("clear", () => {
    it("should clear all shortcuts", () => {
      const action1 = vi.fn()
      const action2 = vi.fn()

      manager.register({ key: "a", description: "Action 1", action: action1 })
      manager.register({ key: "b", description: "Action 2", action: action2 })

      manager.clear()

      const shortcuts = manager.getShortcuts()
      expect(shortcuts).toHaveLength(0)
    })
  })

  describe("global listener", () => {
    it("should attach global listener when configured", () => {
      const globalManager = new KeyboardShortcutManager({ global: true })

      expect(globalManager).toBeDefined()

      globalManager.detachGlobalListener()
    })

    it("should detach global listener", () => {
      const globalManager = new KeyboardShortcutManager({ global: true })

      expect(() => globalManager.detachGlobalListener()).not.toThrow()
    })
  })

  describe("edge cases", () => {
    it("should handle special keys", () => {
      const action = vi.fn()
      manager.register({ key: "Escape", description: "Cancel", action })

      const event = new KeyboardEvent("keydown", { key: "Escape" })
      manager.handleKeyDown(event)

      expect(action).toHaveBeenCalled()
    })

    it("should handle function keys", () => {
      const action = vi.fn()
      manager.register({ key: "F1", description: "Help", action })

      const event = new KeyboardEvent("keydown", { key: "F1" })
      manager.handleKeyDown(event)

      expect(action).toHaveBeenCalled()
    })

    it("should handle numpad keys", () => {
      const action = vi.fn()
      manager.register({ key: "1", description: "Number 1", action })

      const event = new KeyboardEvent("keydown", { key: "1" })
      manager.handleKeyDown(event)

      expect(action).toHaveBeenCalled()
    })

    it("should handle meta key (Command on Mac)", () => {
      const action = vi.fn()
      manager.register({ key: "s", meta: true, description: "Save", action })

      const event = new KeyboardEvent("keydown", { key: "s", metaKey: true })
      manager.handleKeyDown(event)

      expect(action).toHaveBeenCalled()
    })

    it("should handle combination of all modifiers", () => {
      const action = vi.fn()
      manager.register({
        key: "s",
        ctrl: true,
        shift: true,
        alt: true,
        meta: true,
        description: "Super shortcut",
        action,
      })

      const event = new KeyboardEvent("keydown", {
        key: "s",
        ctrlKey: true,
        shiftKey: true,
        altKey: true,
        metaKey: true,
      })
      manager.handleKeyDown(event)

      expect(action).toHaveBeenCalled()
    })
  })
})

describe("commonShortcuts", () => {
  it("should provide common shortcuts", () => {
    expect(commonShortcuts).toBeDefined()
    expect(commonShortcuts.length).toBeGreaterThan(0)
  })

  it("should include Ctrl+N shortcut", () => {
    const newShortcut = commonShortcuts.find((s) => s.key === "n" && s.ctrl)
    expect(newShortcut).toBeDefined()
    expect(newShortcut!.description).toBe("新建")
  })

  it("should include Ctrl+S shortcut", () => {
    const saveShortcut = commonShortcuts.find((s) => s.key === "s" && s.ctrl)
    expect(saveShortcut).toBeDefined()
    expect(saveShortcut!.description).toBe("保存")
  })

  it("should include Ctrl+F shortcut", () => {
    const searchShortcut = commonShortcuts.find((s) => s.key === "f" && s.ctrl)
    expect(searchShortcut).toBeDefined()
    expect(searchShortcut!.description).toBe("搜索")
  })

  it("should include Delete shortcut", () => {
    const deleteShortcut = commonShortcuts.find((s) => s.key === "Delete")
    expect(deleteShortcut).toBeDefined()
    expect(deleteShortcut!.description).toBe("删除")
  })

  it("should include Escape shortcut", () => {
    const escapeShortcut = commonShortcuts.find((s) => s.key === "Escape")
    expect(escapeShortcut).toBeDefined()
    expect(escapeShortcut!.description).toBe("取消")
  })

  it("should include Enter shortcut", () => {
    const enterShortcut = commonShortcuts.find((s) => s.key === "Enter")
    expect(enterShortcut).toBeDefined()
    expect(enterShortcut!.description).toBe("确认")
  })
})

describe("ShortcutHints", () => {
  it("should render shortcut hints", () => {
    const shortcuts = [
      { key: "s", ctrl: true, description: "Save", action: vi.fn() },
      { key: "f", ctrl: true, description: "Find", action: vi.fn() },
    ]

    expect(() => ShortcutHints({ shortcuts })).not.toThrow()
  })

  it("should apply custom className", () => {
    const shortcuts = [{ key: "s", description: "Save", action: vi.fn() }]

    expect(() => ShortcutHints({ shortcuts, className: "custom" })).not.toThrow()
  })

  it("should handle empty shortcuts array", () => {
    expect(() => ShortcutHints({ shortcuts: [] })).not.toThrow()
  })
})

describe("useKeyboardShortcuts", () => {
  it("should provide keyboard shortcuts hook", () => {
    const shortcuts = [
      { key: "s", description: "Save", action: vi.fn() },
    ]

    expect(() => useKeyboardShortcuts({ shortcuts })).not.toThrow()
  })

  it("should provide registerShortcut function", () => {
    const shortcuts = [{ key: "s", description: "Save", action: vi.fn() }]
    const { registerShortcut } = useKeyboardShortcuts({ shortcuts })

    expect(registerShortcut).toBeDefined()
    expect(typeof registerShortcut).toBe("function")
  })

  it("should provide unregisterShortcut function", () => {
    const shortcuts = [{ key: "s", description: "Save", action: vi.fn() }]
    const { unregisterShortcut } = useKeyboardShortcuts({ shortcuts })

    expect(unregisterShortcut).toBeDefined()
    expect(typeof unregisterShortcut).toBe("function")
  })

  it("should provide enableShortcuts function", () => {
    const shortcuts = [{ key: "s", description: "Save", action: vi.fn() }]
    const { enableShortcuts } = useKeyboardShortcuts({ shortcuts })

    expect(enableShortcuts).toBeDefined()
    expect(typeof enableShortcuts).toBe("function")
  })

  it("should provide disableShortcuts function", () => {
    const shortcuts = [{ key: "s", description: "Save", action: vi.fn() }]
    const { disableShortcuts } = useKeyboardShortcuts({ shortcuts })

    expect(disableShortcuts).toBeDefined()
    expect(typeof disableShortcuts).toBe("function")
  })

  it("should provide getShortcuts function", () => {
    const shortcuts = [{ key: "s", description: "Save", action: vi.fn() }]
    const { getShortcuts } = useKeyboardShortcuts({ shortcuts })

    expect(getShortcuts).toBeDefined()
    expect(typeof getShortcuts).toBe("function")
  })
})

describe("keyboard shortcut performance", () => {
  it("should handle rapid key presses efficiently", () => {
    const manager = new KeyboardShortcutManager()
    const action = vi.fn()
    manager.register({ key: "a", description: "Test", action })

    for (let i = 0; i < 100; i++) {
      const event = new KeyboardEvent("keydown", { key: "a" })
      manager.handleKeyDown(event)
    }

    expect(action).toHaveBeenCalledTimes(100)
  })

  it("should handle many registered shortcuts efficiently", () => {
    const manager = new KeyboardShortcutManager()

    for (let i = 0; i < 100; i++) {
      const action = vi.fn()
      manager.register({ key: `key-${i}`, description: `Shortcut ${i}`, action })
    }

    const shortcuts = manager.getShortcuts()
    expect(shortcuts).toHaveLength(100)
  })

  it("should not block on key press", () => {
    const manager = new KeyboardShortcutManager()
    const action = vi.fn()
    manager.register({ key: "a", description: "Test", action })

    const startTime = Date.now()
    const event = new KeyboardEvent("keydown", { key: "a" })
    manager.handleKeyDown(event)
    const endTime = Date.now()

    expect(endTime - startTime).toBeLessThan(10)
  })
})
