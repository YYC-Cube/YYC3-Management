/**
 * @fileoverview PluginRegistry 单元测试
 */

import { describe, it, expect, beforeEach } from "vitest"
import { pluginRegistry } from "./registry"
import type { SystemRegistration } from "./types"
import { Activity } from "lucide-react"

function makeSystem(id: string, order: number): SystemRegistration {
  return {
    id,
    name: `System ${id}`,
    description: `Test system ${id}`,
    icon: Activity,
    color: "#00d4ff",
    order,
    menuItems: [{ path: `/${id}`, label: id }],
    routes: [{ path: "", title: id }],
  }
}

describe("PluginRegistry", () => {
  beforeEach(() => {
    pluginRegistry.clear()
  })

  it("应该注册并获取系统", () => {
    const sys = makeSystem("monitor", 10)
    pluginRegistry.register(sys)
    expect(pluginRegistry.get("monitor")).toBe(sys)
  })

  it("getAll() 应按 order 排序", () => {
    pluginRegistry.register(makeSystem("zeta", 90))
    pluginRegistry.register(makeSystem("alpha", 10))
    pluginRegistry.register(makeSystem("mid", 50))

    const all = pluginRegistry.getAll()
    expect(all.map((s) => s.id)).toEqual(["alpha", "mid", "zeta"])
  })

  it("registerAll() 应批量注册", () => {
    pluginRegistry.registerAll([
      makeSystem("a", 10),
      makeSystem("b", 20),
    ])
    expect(pluginRegistry.size).toBe(2)
  })

  it("unregister() 应移除系统", () => {
    pluginRegistry.register(makeSystem("temp", 10))
    pluginRegistry.unregister("temp")
    expect(pluginRegistry.get("temp")).toBeUndefined()
  })

  it("toCards() 应返回欢迎页卡片格式", () => {
    pluginRegistry.register(makeSystem("monitor", 10))
    const cards = pluginRegistry.toCards()
    expect(cards).toHaveLength(1)
    expect(cards[0].id).toBe("monitor")
    expect(cards[0].path).toBe("/monitor")
  })

  it("getAllHubCommands() 应聚合所有系统的命令", () => {
    pluginRegistry.register({
      ...makeSystem("a", 10),
      hubCommands: [
        {
          id: "cmd-a",
          label: "Command A",
          systemId: "a",
          icon: Activity,
          action: () => {},
        },
      ],
    })
    pluginRegistry.register({
      ...makeSystem("b", 20),
      hubCommands: [
        {
          id: "cmd-b",
          label: "Command B",
          systemId: "b",
          icon: Activity,
          action: () => {},
        },
      ],
    })
    const cmds = pluginRegistry.getAllHubCommands()
    expect(cmds).toHaveLength(2)
  })

  it("重复注册应覆盖而非报错", () => {
    pluginRegistry.register(makeSystem("dup", 10))
    pluginRegistry.register({ ...makeSystem("dup", 20), name: "Updated" })
    expect(pluginRegistry.get("dup")?.name).toBe("Updated")
    expect(pluginRegistry.size).toBe(1)
  })

  it("clear() 应清除所有注册", () => {
    pluginRegistry.registerAll([makeSystem("a", 10), makeSystem("b", 20)])
    pluginRegistry.clear()
    expect(pluginRegistry.size).toBe(0)
    expect(pluginRegistry.getAll()).toHaveLength(0)
  })
})
