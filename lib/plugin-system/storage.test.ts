/**
 * @fileoverview SystemStorage 单元测试
 */

import { describe, it, expect, beforeEach } from "vitest"
import { createSystemStorage } from "./storage"

describe("SystemStorage", () => {
  let store: ReturnType<typeof createSystemStorage>

  beforeEach(() => {
    localStorage.clear()
    store = createSystemStorage("test-system")
  })

  it("应该以 yyc3: 前缀存储数据", () => {
    store.set("myKey", { name: "test" })
    expect(localStorage.getItem("yyc3:test-system:myKey")).toBeTruthy()
  })

  it("get() 应返回存储的值", () => {
    store.set("myKey", { name: "test" })
    expect(store.get("myKey")).toEqual({ name: "test" })
  })

  it("get() 不存在时应返回 fallback", () => {
    expect(store.get("nonexistent", "default")).toBe("default")
  })

  it("get() 不存在且无 fallback 时应返回 undefined", () => {
    expect(store.get("nonexistent")).toBeUndefined()
  })

  it("remove() 应删除指定 key", () => {
    store.set("key1", "val1")
    store.remove("key1")
    expect(store.get("key1")).toBeUndefined()
  })

  it("clear() 应只清除本系统的 key", () => {
    store.set("key1", "val1")
    localStorage.setItem("yyc3:other-system:key2", '"val2"')
    store.clear()
    expect(store.get("key1")).toBeUndefined()
    expect(localStorage.getItem("yyc3:other-system:key2")).toBeTruthy()
  })

  it("应正确处理 JSON 序列化", () => {
    const data = { num: 42, arr: [1, 2, 3], nested: { a: true } }
    store.set("complex", data)
    expect(store.get("complex")).toEqual(data)
  })

  it("应处理损坏的 JSON 数据", () => {
    localStorage.setItem("yyc3:test-system:corrupt", "{invalid json")
    expect(store.get("corrupt", "fallback")).toBe("fallback")
  })
})
