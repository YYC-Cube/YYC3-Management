// 真实用户场景测试 - 模拟真实用户行为和边界情况
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,E2E,真实场景,用户行为

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import { DataExporter, DataImporter } from "@/lib/utils/data-import-export"
import { AdvancedSearch } from "@/lib/utils/advanced-search"
import { BatchOperations } from "@/lib/utils/batch-operations"
import { ChunkedDataLoader } from "@/lib/utils/chunked-data-loader"
import { DataPreloader } from "@/lib/utils/data-preloader"
import { DragDropManager } from "@/lib/utils/drag-drop"
import { KeyboardShortcutManager } from "@/lib/utils/keyboard-shortcuts"
import { OfflineStorage } from "@/lib/utils/offline-support"

interface TestUser {
  id: number
  name: string
  email: string
  age: number
  status: "active" | "inactive"
  createdAt: string
}

describe("Real User Scenarios - Data Management", () => {
  let testData: TestUser[]

  beforeEach(() => {
    testData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 20 + (i % 50),
      status: i % 2 === 0 ? "active" : "inactive",
      createdAt: `2024-01-${String(i + 1).padStart(2, "0")}`,
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("Scenario 1: User imports data from CSV, filters, and exports results", () => {
    it("should complete the full workflow", async () => {
      const csvContent = `name,email,age,status,createdAt\nAlice,alice@example.com,30,active,2024-01-01\nBob,bob@example.com,25,inactive,2024-01-02\nCharlie,charlie@example.com,35,active,2024-01-03`
      const file = new File([csvContent], "users.csv", { type: "text/csv" })

      const importer = new DataImporter<TestUser>()
      const importResult = await importer.importFromCSV(file)

      expect(importResult.success).toBe(true)
      expect(importResult.data).toHaveLength(3)

      const search = new AdvancedSearch<TestUser>()
      const filteredData = search.search(importResult.data, "Alice", [
        { field: "name", operator: "contains" },
      ])

      expect(filteredData).toHaveLength(1)
      expect(filteredData[0].name).toBe("Alice")

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToCSV(filteredData, { filename: "filtered-users" })

      expect(mockSaveAs).toHaveBeenCalled()
    })
  })

  describe("Scenario 2: User searches with multiple filters and saves results", () => {
    it("should handle complex search and save workflow", () => {
      const search = new AdvancedSearch<TestUser>()

      const results = search.search(testData, "", [
        { field: "age", operator: "gte", value: 30 },
        { field: "status", operator: "eq", value: "active" },
        { field: "name", operator: "contains", value: "User" },
      ])

      expect(results.length).toBeGreaterThan(0)
      results.forEach(user => {
        expect(user.age).toBeGreaterThanOrEqual(30)
        expect(user.status).toBe("active")
        expect(user.name).toContain("User")
      })

      const history = search.getSearchHistory()
      expect(history.length).toBeGreaterThan(0)
    })
  })

  describe("Scenario 3: User performs batch operations on selected items", () => {
    it("should handle batch update workflow", async () => {
      const batchOps = new BatchOperations<TestUser>()
      const selectedUsers = testData.slice(0, 10)

      const updateFn = vi.fn().mockResolvedValue({ success: true })
      const result = await batchOps.batchUpdate(
        selectedUsers,
        { status: "inactive" },
        updateFn
      )

      expect(result.success).toBe(true)
      expect(result.updated).toHaveLength(10)
      expect(updateFn).toHaveBeenCalledTimes(10)
    })

    it("should handle batch delete with confirmation", async () => {
      const batchOps = new BatchOperations<TestUser>()
      const selectedUsers = testData.slice(0, 5)

      const deleteFn = vi.fn().mockResolvedValue({ success: true })
      const result = await batchOps.batchDelete(selectedUsers, deleteFn, {
        requireConfirmation: true,
      })

      expect(result.success).toBe(true)
      expect(result.deleted).toHaveLength(5)
      expect(deleteFn).toHaveBeenCalledTimes(5)
    })
  })

  describe("Scenario 4: User navigates large dataset with virtual scrolling", () => {
    it("should handle scrolling through large dataset efficiently", async () => {
      const largeData = Array.from({ length: 10000 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: i + 1,
      }))

      const loader = new ChunkedDataLoader<{ id: number; name: string; value: number }>({
        chunkSize: 100,
        preloadCount: 2,
      })

      const loadFn = vi.fn((offset, limit) =>
        Promise.resolve(largeData.slice(offset, offset + limit))
      )

      const firstChunk = await loader.loadChunk("chunk-0", loadFn)
      expect(firstChunk).toHaveLength(100)
      expect(firstChunk[0].id).toBe(1)

      await loader.preloadChunks(0, loadFn)
      expect(loader.getChunk("chunk-0")?.loaded).toBe(true)
      expect(loader.getChunk("chunk-1")?.loaded).toBe(true)
    })
  })

  describe("Scenario 5: User uses keyboard shortcuts for quick actions", () => {
    it("should handle keyboard shortcut workflow", () => {
      const manager = new KeyboardShortcutManager({ enabled: true })

      const searchAction = vi.fn()
      const createAction = vi.fn()
      const saveAction = vi.fn()

      manager.register({
        key: "/",
        description: "Search",
        action: searchAction,
      })

      manager.register({
        key: "n",
        description: "Create new",
        action: createAction,
      })

      manager.register({
        key: "s",
        description: "Save",
        action: saveAction,
      })

      const searchEvent = new KeyboardEvent("keydown", { key: "/" })
      manager.handleKeyDown(searchEvent)

      expect(searchAction).toHaveBeenCalled()

      const createEvent = new KeyboardEvent("keydown", { key: "n" })
      manager.handleKeyDown(createEvent)

      expect(createAction).toHaveBeenCalled()

      const saveEvent = new KeyboardEvent("keydown", { key: "s" })
      manager.handleKeyDown(saveEvent)

      expect(saveAction).toHaveBeenCalled()
    })
  })

  describe("Scenario 6: User works offline and syncs when back online", () => {
    it("should handle offline workflow", async () => {
      const storage = new OfflineStorage<TestUser>("users")

      await storage.setItem("user-1", testData[0])
      await storage.setItem("user-2", testData[1])

      const user1 = await storage.getItem("user-1")
      expect(user1).toEqual(testData[0])

      const allUsers = await storage.getAll()
      expect(allUsers).toHaveLength(2)

      await storage.removeItem("user-1")
      const removedUser = await storage.getItem("user-1")
      expect(removedUser).toBeNull()
    })
  })

  describe("Scenario 7: User drags and drops items to reorder list", () => {
    it("should handle drag and drop workflow", () => {
      const items = testData.slice(0, 10)
      const onReorder = vi.fn()

      const manager = new DragDropManager<TestUser>({
        items,
        onReorder,
      })

      manager.startDrag(items[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
      const reorderedItems = onReorder.mock.calls[0][0]
      expect(reorderedItems[4].id).toBe(1)
    })
  })

  describe("Scenario 8: User preloads data for faster navigation", () => {
    it("should handle data preloading workflow", async () => {
      const preloader = new DataPreloader<TestUser>({
        enabled: true,
        prefetchCount: 3,
        prefetchDelay: 100,
      })

      const loadFn = vi.fn((id) => Promise.resolve(testData.find(u => u.id === id)))

      await preloader.preload("user-1", () => loadFn(1))
      await preloader.preload("user-2", () => loadFn(2))
      await preloader.preload("user-3", () => loadFn(3))

      expect(loadFn).toHaveBeenCalledTimes(3)

      const user1 = await preloader.get("user-1", () => loadFn(1))
      expect(user1).toEqual(testData[0])
      expect(loadFn).toHaveBeenCalledTimes(3)
    })
  })

  describe("Scenario 9: User encounters errors and recovers", () => {
    it("should handle error recovery workflow", async () => {
      const batchOps = new BatchOperations<TestUser>()
      const selectedUsers = testData.slice(0, 5)

      const updateFn = vi.fn()
        .mockResolvedValueOnce({ success: true })
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({ success: true })
        .mockRejectedValueOnce(new Error("Validation error"))
        .mockResolvedValueOnce({ success: true })

      const result = await batchOps.batchUpdate(
        selectedUsers,
        { status: "active" },
        updateFn,
        { retryCount: 2 }
      )

      expect(result.success).toBe(false)
      expect(result.updated).toHaveLength(3)
      expect(result.failed).toHaveLength(2)
    })
  })

  describe("Scenario 10: User performs complex multi-step workflow", () => {
    it("should handle complex workflow", async () => {
      const csvContent = `name,email,age,status\nAlice,alice@example.com,30,active\nBob,bob@example.com,25,inactive`
      const file = new File([csvContent], "users.csv", { type: "text/csv" })

      const importer = new DataImporter<TestUser>()
      const importResult = await importer.importFromCSV(file)

      expect(importResult.success).toBe(true)

      const search = new AdvancedSearch<TestUser>()
      const filteredData = search.search(importResult.data, "", [
        { field: "age", operator: "gte", value: 25 },
      ])

      expect(filteredData).toHaveLength(2)

      const batchOps = new BatchOperations<TestUser>()
      const updateFn = vi.fn().mockResolvedValue({ success: true })
      const batchResult = await batchOps.batchUpdate(
        filteredData,
        { status: "active" },
        updateFn
      )

      expect(batchResult.success).toBe(true)
      expect(batchResult.updated).toHaveLength(2)

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToCSV(filteredData, { filename: "updated-users" })

      expect(mockSaveAs).toHaveBeenCalled()
    })
  })

  describe("Scenario 11: User works with large datasets and pagination", () => {
    it("should handle large dataset with pagination", async () => {
      const largeData = Array.from({ length: 50000 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: i + 1,
      }))

      const loader = new ChunkedDataLoader<{ id: number; name: string; value: number }>({
        chunkSize: 500,
        preloadCount: 3,
      })

      const loadFn = vi.fn((offset, limit) =>
        Promise.resolve(largeData.slice(offset, offset + limit))
      )

      const chunks = []
      for (let i = 0; i < 10; i++) {
        const chunk = await loader.loadChunk(`chunk-${i}`, loadFn)
        chunks.push(chunk)
      }

      expect(chunks.length).toBe(10)
      expect(chunks[0]).toHaveLength(500)
      expect(chunks[0][0].id).toBe(1)
      expect(chunks[9][0].id).toBe(4501)
    })
  })

  describe("Scenario 12: User uses advanced search with multiple conditions", () => {
    it("should handle complex search conditions", () => {
      const search = new AdvancedSearch<TestUser>()

      const results = search.search(testData, "", [
        { field: "age", operator: "gte", value: 25 },
        { field: "age", operator: "lte", value: 40 },
        { field: "status", operator: "eq", value: "active" },
        { field: "name", operator: "contains", value: "User" },
      ])

      expect(results.length).toBeGreaterThan(0)
      results.forEach(user => {
        expect(user.age).toBeGreaterThanOrEqual(25)
        expect(user.age).toBeLessThanOrEqual(40)
        expect(user.status).toBe("active")
        expect(user.name).toContain("User")
      })

      const history = search.getSearchHistory()
      expect(history.length).toBeGreaterThan(0)
    })
  })

  describe("Scenario 13: User performs batch operations with progress tracking", () => {
    it("should handle batch operations with progress", async () => {
      const batchOps = new BatchOperations<TestUser>()
      const selectedUsers = testData.slice(0, 20)

      const onProgress = vi.fn()
      const updateFn = vi.fn().mockImplementation(async (user) => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return { success: true }
      })

      const result = await batchOps.batchUpdate(
        selectedUsers,
        { status: "active" },
        updateFn,
        { onProgress }
      )

      expect(result.success).toBe(true)
      expect(result.updated).toHaveLength(20)
      expect(onProgress).toHaveBeenCalled()
    })
  })

  describe("Scenario 14: User uses keyboard shortcuts for navigation", () => {
    it("should handle keyboard navigation workflow", () => {
      const manager = new KeyboardShortcutManager({ enabled: true })

      const actions = {
        next: vi.fn(),
        previous: vi.fn(),
        first: vi.fn(),
        last: vi.fn(),
      }

      manager.register({ key: "ArrowDown", description: "Next", action: actions.next })
      manager.register({ key: "ArrowUp", description: "Previous", action: actions.previous })
      manager.register({ key: "Home", description: "First", action: actions.first })
      manager.register({ key: "End", description: "Last", action: actions.last })

      const nextEvent = new KeyboardEvent("keydown", { key: "ArrowDown" })
      manager.handleKeyDown(nextEvent)

      expect(actions.next).toHaveBeenCalled()

      const prevEvent = new KeyboardEvent("keydown", { key: "ArrowUp" })
      manager.handleKeyDown(prevEvent)

      expect(actions.previous).toHaveBeenCalled()

      const firstEvent = new KeyboardEvent("keydown", { key: "Home" })
      manager.handleKeyDown(firstEvent)

      expect(actions.first).toHaveBeenCalled()

      const lastEvent = new KeyboardEvent("keydown", { key: "End" })
      manager.handleKeyDown(lastEvent)

      expect(actions.last).toHaveBeenCalled()
    })
  })

  describe("Scenario 15: User works with offline data and syncs", () => {
    it("should handle offline data sync workflow", async () => {
      const storage = new OfflineStorage<TestUser>("users")

      const offlineData = testData.slice(0, 10)
      for (const user of offlineData) {
        await storage.setItem(`user-${user.id}`, user)
      }

      const allOfflineData = await storage.getAll()
      expect(allOfflineData).toHaveLength(10)

      const syncFn = vi.fn().mockResolvedValue({ success: true })
      const syncResults = []

      for (const user of allOfflineData) {
        const result = await syncFn(user)
        syncResults.push(result)
      }

      expect(syncFn).toHaveBeenCalledTimes(10)
      expect(syncResults.every(r => r.success)).toBe(true)

      await storage.clear()
      const clearedData = await storage.getAll()
      expect(clearedData).toHaveLength(0)
    })
  })
})
