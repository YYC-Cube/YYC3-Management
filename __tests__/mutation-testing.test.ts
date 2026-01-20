// 变异测试示例 - 验证测试用例有效性
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,变异测试,质量保证

import { describe, it, expect } from "vitest"
import { MutationTester } from "./helpers/mutation-testing"

describe("Mutation Testing Examples", () => {
  describe("Simple Function Mutation Testing", () => {
    function add(a: number, b: number): number {
      return a + b
    }

    function multiply(a: number, b: number): number {
      return a * b
    }

    function isPositive(num: number): boolean {
      return num > 0
    }

    function isEven(num: number): boolean {
      return num % 2 === 0
    }

    it("should kill return mutations in add function", () => {
      const code = `
        function add(a: number, b: number): number {
          return a + b
        }
      `

      const tester = new MutationTester()
      const result = tester.mutateCode(code, "add.ts")

      expect(result.totalMutations).toBeGreaterThan(0)
      expect(result.mutations.length).toBeGreaterThan(0)

      const returnMutations = result.mutations.filter(m => m.type === "return")
      expect(returnMutations.length).toBeGreaterThan(0)

      returnMutations.forEach(mutation => {
        expect(mutation.originalCode).toContain("return a + b")
        expect(mutation.mutatedCode).not.toBe(mutation.originalCode)
      })
    })

    it("should kill arithmetic mutations in multiply function", () => {
      const code = `
        function multiply(a: number, b: number): number {
          return a * b
        }
      `

      const tester = new MutationTester()
      const result = tester.mutateCode(code, "multiply.ts")

      expect(result.totalMutations).toBeGreaterThan(0)

      const arithmeticMutations = result.mutations.filter(m => m.type === "arithmetic")
      expect(arithmeticMutations.length).toBeGreaterThan(0)

      arithmeticMutations.forEach(mutation => {
        expect(mutation.originalCode).toContain("a * b")
        expect(mutation.mutatedCode).not.toBe(mutation.originalCode)
      })
    })

    it("should kill comparison mutations in isPositive function", () => {
      const code = `
        function isPositive(num: number): boolean {
          return num > 0
        }
      `

      const tester = new MutationTester()
      const result = tester.mutateCode(code, "isPositive.ts")

      expect(result.totalMutations).toBeGreaterThan(0)

      const comparisonMutations = result.mutations.filter(m => m.type === "comparison")
      expect(comparisonMutations.length).toBeGreaterThan(0)

      comparisonMutations.forEach(mutation => {
        expect(mutation.originalCode).toContain("num > 0")
        expect(mutation.mutatedCode).not.toBe(mutation.originalCode)
      })
    })

    it("should kill equality mutations in isEven function", () => {
      const code = `
        function isEven(num: number): boolean {
          return num % 2 === 0
        }
      `

      const tester = new MutationTester()
      const result = tester.mutateCode(code, "isEven.ts")

      expect(result.totalMutations).toBeGreaterThan(0)

      const equalityMutations = result.mutations.filter(m => m.type === "equality")
      expect(equalityMutations.length).toBeGreaterThan(0)

      equalityMutations.forEach(mutation => {
        expect(mutation.originalCode).toContain("=== 0")
        expect(mutation.mutatedCode).not.toBe(mutation.originalCode)
      })
    })
  })

  describe("Complex Function Mutation Testing", () => {
    function calculateDiscount(price: number, quantity: number): number {
      if (quantity > 10) {
        return price * 0.9
      } else if (quantity > 5) {
        return price * 0.95
      } else {
        return price
      }
    }

    function validateUser(user: { name: string; age: number; email: string }): boolean {
      return user.name && user.age >= 18 && user.email.includes("@")
    }

    it("should kill if mutations in calculateDiscount function", () => {
      const code = `
        function calculateDiscount(price: number, quantity: number): number {
          if (quantity > 10) {
            return price * 0.9
          } else if (quantity > 5) {
            return price * 0.95
          } else {
            return price
          }
        }
      `

      const tester = new MutationTester()
      const result = tester.mutateCode(code, "calculateDiscount.ts")

      expect(result.totalMutations).toBeGreaterThan(0)

      const ifMutations = result.mutations.filter(m => m.type === "if")
      expect(ifMutations.length).toBeGreaterThan(0)

      ifMutations.forEach(mutation => {
        expect(mutation.originalCode).toContain("if (quantity > 10)")
        expect(mutation.mutatedCode).not.toBe(mutation.originalCode)
      })
    })

    it("should kill and mutations in validateUser function", () => {
      const code = `
        function validateUser(user: { name: string; age: number; email: string }): boolean {
          return user.name && user.age >= 18 && user.email.includes("@")
        }
      `

      const tester = new MutationTester()
      const result = tester.mutateCode(code, "validateUser.ts")

      expect(result.totalMutations).toBeGreaterThan(0)

      const andMutations = result.mutations.filter(m => m.type === "and")
      expect(andMutations.length).toBeGreaterThan(0)

      andMutations.forEach(mutation => {
        expect(mutation.originalCode).toContain("&&")
        expect(mutation.mutatedCode).not.toBe(mutation.originalCode)
      })
    })
  })

  describe("Mutation Score Calculation", () => {
    it("should calculate mutation score correctly", () => {
      const code = `
        function add(a: number, b: number): number {
          return a + b
        }
      `

      const tester = new MutationTester()
      const result = tester.mutateCode(code, "add.ts")

      expect(result.mutationScore).toBeDefined()
      expect(result.mutationScore).toBeGreaterThanOrEqual(0)
      expect(result.mutationScore).toBeLessThanOrEqual(100)
    })

    it("should have high mutation score for well-tested code", () => {
      const code = `
        function add(a: number, b: number): number {
          return a + b
        }
      `

      const tester = new MutationTester()
      const result = tester.mutateCode(code, "add.ts")

      expect(result.mutationScore).toBeGreaterThan(50)
    })
  })

  describe("Mutation Report Generation", () => {
    it("should generate mutation report", () => {
      const code = `
        function add(a: number, b: number): number {
          return a + b
        }
      `

      const tester = new MutationTester()
      const result = tester.mutateCode(code, "add.ts")
      const report = tester.generateReport()

      expect(report).toBeDefined()
      expect(report.fileName).toBe("add.ts")
      expect(report.totalMutations).toBe(result.totalMutations)
      expect(report.killedMutations).toBe(result.killedMutations)
      expect(report.survivedMutations).toBe(result.survivedMutations)
      expect(report.mutationScore).toBe(result.mutationScore)
    })

    it("should include all mutation types in report", () => {
      const code = `
        function add(a: number, b: number): number {
          return a + b
        }
      `

      const tester = new MutationTester()
      const result = tester.mutateCode(code, "add.ts")
      const report = tester.generateReport()

      expect(report.mutationsByType).toBeDefined()
      expect(Object.keys(report.mutationsByType).length).toBeGreaterThan(0)
    })
  })
})
