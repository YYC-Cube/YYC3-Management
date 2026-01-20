import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { AdvancedSearch } from "@/lib/utils/advanced-search"

interface TestUser {
  id: number
  name: string
  email: string
  age: number
  status: string
  createdAt: string
}

describe("AdvancedSearch", () => {
  let search: AdvancedSearch<TestUser>
  let testData: TestUser[]

  beforeEach(() => {
    search = new AdvancedSearch<TestUser>()
    testData = [
      { id: 1, name: "Alice Johnson", email: "alice@example.com", age: 30, status: "active", createdAt: "2024-01-01" },
      { id: 2, name: "Bob Smith", email: "bob@example.com", age: 25, status: "inactive", createdAt: "2024-01-02" },
      { id: 3, name: "Charlie Brown", email: "charlie@example.com", age: 35, status: "active", createdAt: "2024-01-03" },
      { id: 4, name: "Diana Prince", email: "diana@example.com", age: 28, status: "active", createdAt: "2024-01-04" },
      { id: 5, name: "Eve Davis", email: "eve@example.com", age: 32, status: "inactive", createdAt: "2024-01-05" },
    ]
  })

  afterEach(() => {
    search.clearHistory()
  })

  describe("search", () => {
    it("should search by single field", () => {
      const results = search.search(testData, "Alice", [
        { field: "name", operator: "contains" },
      ])

      expect(results).toHaveLength(1)
      expect(results[0].name).toBe("Alice Johnson")
    })

    it("should search with fuzzy matching", () => {
      const results = search.search(testData, "alic", [
        { field: "name", operator: "contains" },
      ])

      expect(results).toHaveLength(1)
      expect(results[0].name).toBe("Alice Johnson")
    })

    it("should search with case insensitivity", () => {
      const results = search.search(testData, "ALICE", [
        { field: "name", operator: "contains" },
      ])

      expect(results).toHaveLength(1)
      expect(results[0].name).toBe("Alice Johnson")
    })

    it("should search by multiple fields", () => {
      const results = search.search(testData, "example", [
        { field: "email", operator: "contains" },
      ])

      expect(results).toHaveLength(5)
    })

    it("should search with exact match", () => {
      const results = search.search(testData, "active", [
        { field: "status", operator: "equals" },
      ])

      expect(results).toHaveLength(3)
      results.forEach((result) => {
        expect(result.status).toBe("active")
      })
    })

    it("should search with numeric comparison", () => {
      const results = search.search(testData, "30", [
        { field: "age", operator: "greaterThan" },
      ])

      expect(results).toHaveLength(2)
      results.forEach((result) => {
        expect(result.age).toBeGreaterThan(30)
      })
    })

    it("should search with multiple filters", () => {
      const results = search.search(testData, "", [
        { field: "status", operator: "equals", value: "active" },
        { field: "age", operator: "greaterThan", value: 28 },
      ])

      expect(results).toHaveLength(2)
      results.forEach((result) => {
        expect(result.status).toBe("active")
        expect(result.age).toBeGreaterThan(28)
      })
    })

    it("should return empty array for no matches", () => {
      const results = search.search(testData, "xyz", [
        { field: "name", operator: "contains" },
      ])

      expect(results).toHaveLength(0)
    })

    it("should handle empty data array", () => {
      const results = search.search([], "test", [
        { field: "name", operator: "contains" },
      ])

      expect(results).toHaveLength(0)
    })

    it("should handle empty search term", () => {
      const results = search.search(testData, "", [
        { field: "name", operator: "contains" },
      ])

      expect(results).toHaveLength(5)
    })
  })

  describe("filter", () => {
    it("should filter by single condition", () => {
      const results = search.filter(testData, [
        { field: "status", operator: "equals", value: "active" },
      ])

      expect(results).toHaveLength(3)
      results.forEach((result) => {
        expect(result.status).toBe("active")
      })
    })

    it("should filter by multiple conditions", () => {
      const results = search.filter(testData, [
        { field: "status", operator: "equals", value: "active" },
        { field: "age", operator: "lessThan", value: 30 },
      ])

      expect(results).toHaveLength(1)
      expect(results[0].name).toBe("Diana Prince")
    })

    it("should filter with contains operator", () => {
      const results = search.filter(testData, [
        { field: "name", operator: "contains", value: "a" },
      ])

      expect(results).toHaveLength(4)
    })

    it("should filter with startsWith operator", () => {
      const results = search.filter(testData, [
        { field: "name", operator: "startsWith", value: "A" },
      ])

      expect(results).toHaveLength(1)
      expect(results[0].name).toBe("Alice Johnson")
    })

    it("should filter with endsWith operator", () => {
      const results = search.filter(testData, [
        { field: "email", operator: "endsWith", value: ".com" },
      ])

      expect(results).toHaveLength(5)
    })

    it("should filter with in operator", () => {
      const results = search.filter(testData, [
        { field: "status", operator: "in", value: ["active", "inactive"] },
      ])

      expect(results).toHaveLength(5)
    })

    it("should filter with notIn operator", () => {
      const results = search.filter(testData, [
        { field: "status", operator: "notIn", value: ["pending"] },
      ])

      expect(results).toHaveLength(5)
    })

    it("should filter with date comparison", () => {
      const results = search.filter(testData, [
        { field: "createdAt", operator: "greaterThan", value: "2024-01-02" },
      ])

      expect(results).toHaveLength(3)
    })

    it("should handle empty filters", () => {
      const results = search.filter(testData, [])

      expect(results).toHaveLength(5)
    })
  })

  describe("search history", () => {
    it("should add search term to history", () => {
      search.addToHistory("Alice")
      const history = search.getHistory()

      expect(history).toHaveLength(1)
      expect(history[0].term).toBe("Alice")
    })

    it("should maintain history order", () => {
      search.addToHistory("Alice")
      search.addToHistory("Bob")
      search.addToHistory("Charlie")

      const history = search.getHistory()

      expect(history).toHaveLength(3)
      expect(history[0].term).toBe("Alice")
      expect(history[1].term).toBe("Bob")
      expect(history[2].term).toBe("Charlie")
    })

    it("should limit history to max items", () => {
      for (let i = 0; i < 15; i++) {
        search.addToHistory(`term${i}`)
      }

      const history = search.getHistory()

      expect(history).toHaveLength(10)
    })

    it("should not add duplicate terms", () => {
      search.addToHistory("Alice")
      search.addToHistory("Bob")
      search.addToHistory("Alice")

      const history = search.getHistory()

      expect(history).toHaveLength(2)
      expect(history[0].term).toBe("Alice")
      expect(history[1].term).toBe("Bob")
    })

    it("should update timestamp for existing term", () => {
      search.addToHistory("Alice")
      const firstTimestamp = search.getHistory()[0].timestamp

      setTimeout(() => {
        search.addToHistory("Alice")
        const secondTimestamp = search.getHistory()[0].timestamp

        expect(secondTimestamp).toBeGreaterThan(firstTimestamp)
      }, 10)
    })

    it("should clear history", () => {
      search.addToHistory("Alice")
      search.addToHistory("Bob")
      search.clearHistory()

      const history = search.getHistory()

      expect(history).toHaveLength(0)
    })

    it("should persist history to localStorage", () => {
      const mockSetItem = vi.spyOn(Storage.prototype, "setItem")
      search.addToHistory("Alice")

      expect(mockSetItem).toHaveBeenCalled()
      mockSetItem.mockRestore()
    })

    it("should load history from localStorage", () => {
      const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValue(
        JSON.stringify([
          { term: "Alice", timestamp: Date.now() },
          { term: "Bob", timestamp: Date.now() },
        ])
      )

      const newSearch = new AdvancedSearch<TestUser>()
      const history = newSearch.getHistory()

      expect(history).toHaveLength(2)
      mockGetItem.mockRestore()
    })
  })

  describe("debounce", () => {
    it("should debounce search calls", async () => {
      vi.useFakeTimers()

      const mockSearch = vi.fn((term: string) => search.search(testData, term, [
        { field: "name", operator: "contains" },
      ]))

      search.search(testData, "A", [{ field: "name", operator: "contains" }])
      search.search(testData, "Al", [{ field: "name", operator: "contains" }])
      search.search(testData, "Ali", [{ field: "name", operator: "contains" }])
      search.search(testData, "Alice", [{ field: "name", operator: "contains" }])

      vi.advanceTimersByTime(300)

      expect(mockSearch).toHaveBeenCalledTimes(4)

      vi.useRealTimers()
    })
  })

  describe("highlight", () => {
    it("should highlight matching text", () => {
      const text = "Alice Johnson"
      const searchTerm = "Alice"
      const highlighted = search.highlight(text, searchTerm)

      expect(highlighted).toContain("<mark>")
      expect(highlighted).toContain("</mark>")
    })

    it("should handle case insensitive highlighting", () => {
      const text = "Alice Johnson"
      const searchTerm = "alice"
      const highlighted = search.highlight(text, searchTerm)

      expect(highlighted).toContain("<mark>")
    })

    it("should handle no matches", () => {
      const text = "Alice Johnson"
      const searchTerm = "xyz"
      const highlighted = search.highlight(text, searchTerm)

      expect(highlighted).toBe(text)
    })

    it("should handle empty search term", () => {
      const text = "Alice Johnson"
      const searchTerm = ""
      const highlighted = search.highlight(text, searchTerm)

      expect(highlighted).toBe(text)
    })
  })

  describe("edge cases", () => {
    it("should handle null or undefined values", () => {
      const dataWithNulls: TestUser[] = [
        { id: 1, name: null as any, email: "test@example.com", age: 30, status: "active", createdAt: "2024-01-01" },
        { id: 2, name: "Bob", email: undefined as any, age: 25, status: "inactive", createdAt: "2024-01-02" },
      ]

      const results = search.search(dataWithNulls, "Bob", [
        { field: "name", operator: "contains" },
      ])

      expect(results).toHaveLength(1)
    })

    it("should handle nested fields", () => {
      interface NestedUser {
        id: number
        profile: {
          name: string
          email: string
        }
      }

      const nestedData: NestedUser[] = [
        { id: 1, profile: { name: "Alice", email: "alice@example.com" } },
        { id: 2, profile: { name: "Bob", email: "bob@example.com" } },
      ]

      const nestedSearch = new AdvancedSearch<NestedUser>()
      const results = nestedSearch.search(nestedData, "Alice", [
        { field: "profile.name", operator: "contains" },
      ])

      expect(results).toHaveLength(1)
    })

    it("should handle special characters", () => {
      const results = search.search(testData, "example.com", [
        { field: "email", operator: "contains" },
      ])

      expect(results).toHaveLength(5)
    })

    it("should handle unicode characters", () => {
      const unicodeData: TestUser[] = [
        { id: 1, name: "张三", email: "zhang@example.com", age: 30, status: "active", createdAt: "2024-01-01" },
        { id: 2, name: "李四", email: "li@example.com", age: 25, status: "inactive", createdAt: "2024-01-02" },
      ]

      const results = search.search(unicodeData, "张", [
        { field: "name", operator: "contains" },
      ])

      expect(results).toHaveLength(1)
    })
  })
})
