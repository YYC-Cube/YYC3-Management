/**
 * @fileoverview AI Family 人格数据单元测试
 */

import { describe, it, expect } from "vitest"
import {
  FAMILY_PERSONAS,
  PERSONAS_MAP,
  getPersonaResponse,
  getPersonaGreeting,
} from "./family-personas"

describe("FamilyPersonas", () => {
  it("应该有 8 位家人", () => {
    expect(FAMILY_PERSONAS).toHaveLength(8)
  })

  it("每位家人应有完整的属性", () => {
    FAMILY_PERSONAS.forEach((persona) => {
      expect(persona.id).toBeTruthy()
      expect(persona.name).toBeTruthy()
      expect(persona.shortName).toBeTruthy()
      expect(persona.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(persona.icon).toBeDefined()
      expect(persona.expertise.length).toBeGreaterThan(0)
      expect(persona.greeting).toBeTruthy()
    })
  })

  it("PERSONAS_MAP 应包含所有 8 位家人", () => {
    expect(Object.keys(PERSONAS_MAP)).toHaveLength(8)
    FAMILY_PERSONAS.forEach((p) => {
      expect(PERSONAS_MAP[p.id]).toBeDefined()
      expect(PERSONAS_MAP[p.id].id).toBe(p.id)
    })
  })

  it("每位家人的 id 应唯一", () => {
    const ids = FAMILY_PERSONAS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("meta-oracle 应为默认中枢人格", () => {
    const oracle = PERSONAS_MAP["meta-oracle"]
    expect(oracle).toBeDefined()
    expect(oracle.role).toContain("调度")
  })

  it("getPersonaGreeting() 应返回对应人格的问候语", () => {
    const greeting = getPersonaGreeting("navigator")
    expect(greeting).toBeTruthy()
    expect(greeting.length).toBeGreaterThan(0)
  })

  it("getPersonaGreeting() 对未知人格应返回默认问候", () => {
    const greeting = getPersonaGreeting("nonexistent")
    expect(greeting).toContain("AI")
  })

  it("getPersonaResponse() 应包含人格专长信息", () => {
    const response = getPersonaResponse("thinker", "分析数据")
    expect(response).toContain("万物")
    expect(response).toContain("分析")
  })

  it("getPersonaResponse() 对未知人格应返回默认回复", () => {
    const response = getPersonaResponse("unknown", "test")
    expect(response).toBeTruthy()
    expect(response.length).toBeGreaterThan(0)
  })
})
