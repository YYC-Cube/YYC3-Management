/**
 * @fileoverview EventBus 单元测试
 */

import { describe, it, expect, beforeEach, vi } from "vitest"
import { EventBus, Events } from "./event-bus"

describe("EventBus", () => {
  let bus: EventBus

  beforeEach(() => {
    bus = new EventBus()
  })

  it("应该正确触发已注册的监听器", () => {
    const handler = vi.fn()
    bus.on("test:event", handler)
    bus.emit("test:event", "hello")
    expect(handler).toHaveBeenCalledWith("hello")
  })

  it("应该支持多个监听器", () => {
    const h1 = vi.fn()
    const h2 = vi.fn()
    bus.on("test:event", h1)
    bus.on("test:event", h2)
    bus.emit("test:event", 42)
    expect(h1).toHaveBeenCalledWith(42)
    expect(h2).toHaveBeenCalledWith(42)
  })

  it("on() 应该返回取消监听函数", () => {
    const handler = vi.fn()
    const unsub = bus.on("test:event", handler)
    unsub()
    bus.emit("test:event")
    expect(handler).not.toHaveBeenCalled()
  })

  it("once() 应该只触发一次", () => {
    const handler = vi.fn()
    bus.once("test:event", handler)
    bus.emit("test:event", "first")
    bus.emit("test:event", "second")
    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith("first")
  })

  it("off() 应该移除指定监听器", () => {
    const handler = vi.fn()
    bus.on("test:event", handler)
    bus.off("test:event", handler)
    bus.emit("test:event")
    expect(handler).not.toHaveBeenCalled()
  })

  it("clear() 应该清除指定事件的所有监听器", () => {
    const h1 = vi.fn()
    const h2 = vi.fn()
    bus.on("test:event", h1)
    bus.on("test:event", h2)
    bus.clear("test:event")
    bus.emit("test:event")
    expect(h1).not.toHaveBeenCalled()
    expect(h2).not.toHaveBeenCalled()
  })

  it("clear() 无参数应清除所有事件", () => {
    const h1 = vi.fn()
    const h2 = vi.fn()
    bus.on("a", h1)
    bus.on("b", h2)
    bus.clear()
    bus.emit("a")
    bus.emit("b")
    expect(h1).not.toHaveBeenCalled()
    expect(h2).not.toHaveBeenCalled()
  })

  it("listenerCount() 应返回正确数量", () => {
    bus.on("test", () => {})
    bus.on("test", () => {})
    expect(bus.listenerCount("test")).toBe(2)
    expect(bus.listenerCount("nonexistent")).toBe(0)
  })

  it("预定义 Events 常量应包含所有事件", () => {
    expect(Events.AI_PERSONA_CHANGED).toBe("ai:persona-changed")
    expect(Events.HUB_OPEN).toBe("hub:open")
    expect(Events.SYSTEM_NOTIFY).toBe("system:notify")
    expect(Events.SHELL_WELCOME_DISMISS).toBe("shell:welcome-dismiss")
  })

  it("不应触发未注册的事件", () => {
    const handler = vi.fn()
    bus.on("test:event", handler)
    bus.emit("other:event")
    expect(handler).not.toHaveBeenCalled()
  })
})
