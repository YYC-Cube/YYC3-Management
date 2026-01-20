import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { DataExporter, DataImporter } from "@/lib/utils/data-import-export"
import { AdvancedSearch } from "@/lib/utils/advanced-search"
import { BatchOperations } from "@/lib/utils/batch-operations"
import { ChunkedDataLoader } from "@/lib/utils/chunked-data-loader"
import { DataPreloader } from "@/lib/utils/data-preloader"
import { DragDropManager } from "@/lib/utils/drag-drop"
import { KeyboardShortcutManager } from "@/lib/utils/keyboard-shortcuts"
import { OfflineManager } from "@/lib/utils/offline-support"

interface TestItem {
  id: number
  name: string
  email: string
  status: string
}

describe("Integration Tests - Module Interactions", () => {
  let testData: TestItem[]

  beforeEach(() => {
    testData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: i % 2 === 0 ? "active" : "inactive",
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("Data Import/Export + Advanced Search Integration", () => {
    it("should export filtered search results", async () => {
      const search = new AdvancedSearch<TestItem>()
      const filteredData = search.search(testData, "User 1", [
        { field: "name", operator: "contains" },
      ])

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToCSV(filteredData, { filename: "filtered-users" })

      expect(mockSaveAs).toHaveBeenCalled()
      const call = mockSaveAs.mock.calls[0]
      expect(call[0]).toBeInstanceOf(Blob)
      expect(call[1]).toBe("filtered-users.csv")
    })

    it("should import data and apply search filters", async () => {
      const csvContent = "name,email,status\nAlice,alice@example.com,active\nBob,bob@example.com,inactive"
      const file = new File([csvContent], "test.csv", { type: "text/csv" })

      const importer = new DataImporter<TestItem>()
      const result = await importer.importFromCSV(file)

      expect(result.success).toBe(true)

      const search = new AdvancedSearch<TestItem>()
      const activeUsers = search.search(result.data, "active", [
        { field: "status", operator: "equals" },
      ])

      expect(activeUsers).toHaveLength(1)
      expect(activeUsers[0].name).toBe("Alice")
    })

    it("should export search results with custom format", async () => {
      const search = new AdvancedSearch<TestItem>()
      const filteredData = search.filter(testData, [
        { field: "status", operator: "equals", value: "active" },
      ])

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToJSON(filteredData, { filename: "active-users" })

      expect(mockSaveAs).toHaveBeenCalled()
      const call = mockSaveAs.mock.calls[0]
      expect(call[1]).toBe("active-users.json")
    })
  })

  describe("Batch Operations + Virtual Scroll Integration", () => {
    it("should batch update items in virtual scroll list", async () => {
      const batchOps = new BatchOperations<TestItem>()
      const updateFn = vi.fn().mockResolvedValue({ success: true })

      const updates = testData.slice(0, 10).map((item) => ({
        id: item.id,
        data: { status: "updated" },
      }))

      const result = await batchOps.batchUpdate(updates, updateFn)

      expect(result.success).toBe(true)
      expect(result.updated).toHaveLength(10)

      const updatedItems = testData.slice(0, 10).map((item) => ({
        ...item,
        status: "updated",
      }))

      expect(updatedItems).toHaveLength(10)
    })

    it("should batch delete items from virtual scroll list", async () => {
      const batchOps = new BatchOperations<TestItem>()
      const deleteFn = vi.fn().mockResolvedValue({ success: true })

      const ids = testData.slice(0, 5).map((item) => item.id)

      const result = await batchOps.batchDelete(ids, deleteFn)

      expect(result.success).toBe(true)
      expect(result.deleted).toHaveLength(5)

      const remainingItems = testData.filter((item) => !ids.includes(item.id))
      expect(remainingItems).toHaveLength(95)
    })

    it("should handle batch operations with progress tracking", async () => {
      const batchOps = new BatchOperations<TestItem>()
      const createFn = vi.fn().mockResolvedValue({ success: true })
      const onProgress = vi.fn()

      const result = await batchOps.batchCreate(testData.slice(0, 20), createFn, {
        onProgress,
      })

      expect(result.success).toBe(true)
      expect(onProgress).toHaveBeenCalled()

      const lastProgressCall = onProgress.mock.calls[onProgress.mock.calls.length - 1]
      expect(lastProgressCall[0]).toBe(100)
    })
  })

  describe("Data Preloading + Offline Support Integration", () => {
    it("should preload data and cache for offline use", async () => {
      const preloader = new DataPreloader<TestItem>({
        enabled: true,
        cacheTTL: 60000,
      })

      const loadFn = vi.fn().mockResolvedValue(testData[0])

      await preloader.preload("user-1", loadFn)

      const cached = preloader.get("user-1")
      expect(cached).toBeDefined()
      expect(cached!.data).toEqual(testData[0])
    })

    it("should sync offline operations with preloaded data", async () => {
      const manager = new OfflineManager<TestItem>()

      await manager.addOperation("create", testData[0])

      const pending = manager.getPendingOperations()
      expect(pending).toHaveLength(1)
      expect(pending[0].type).toBe("create")
    })

    it("should preload multiple items for offline access", async () => {
      const preloader = new DataPreloader<TestItem>()
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      const keys = ["user-1", "user-2", "user-3"]
      await preloader.prefetchMultiple(keys, loadFn, true)

      expect(loadFn).toHaveBeenCalledTimes(3)

      const cached1 = preloader.get("user-1")
      const cached2 = preloader.get("user-2")
      const cached3 = preloader.get("user-3")

      expect(cached1).toBeDefined()
      expect(cached2).toBeDefined()
      expect(cached3).toBeDefined()
    })
  })

  describe("Drag Drop + State Management Integration", () => {
    it("should reorder items and update state", () => {
      const onReorder = vi.fn()
      const manager = new DragDropManager<TestItem>({
        items: testData.slice(0, 10),
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
      const reorderedItems = onReorder.mock.calls[0][0]

      expect(reorderedItems[0].id).toBe(2)
      expect(reorderedItems[4].id).toBe(6)
      expect(reorderedItems[5].id).toBe(1)
    })

    it("should persist drag and drop state", () => {
      const onReorder = vi.fn()
      const manager = new DragDropManager<TestItem>({
        items: testData.slice(0, 10),
        onReorder,
      })

      manager.startDrag(testData[0], 0)

      const draggedItem = manager.getDraggedItem()
      expect(draggedItem).toBeDefined()
      expect(draggedItem!.data).toEqual(testData[0])

      manager.cancelDrag()

      const cancelledItem = manager.getDraggedItem()
      expect(cancelledItem).toBeNull()
    })

    it("should handle cross-list drag and drop", () => {
      const onReorder = vi.fn()
      const manager = new DragDropManager<TestItem>({
        items: testData.slice(0, 10),
        onReorder,
        crossList: true,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
    })
  })

  describe("Keyboard Shortcuts + User Actions Integration", () => {
    it("should trigger search with keyboard shortcut", () => {
      const manager = new KeyboardShortcutManager()
      const searchAction = vi.fn()

      manager.register({
        key: "f",
        ctrl: true,
        description: "Search",
        action: searchAction,
      })

      const event = new KeyboardEvent("keydown", { key: "f", ctrlKey: true })
      manager.handleKeyDown(event)

      expect(searchAction).toHaveBeenCalled()
    })

    it("should trigger batch delete with keyboard shortcut", () => {
      const manager = new KeyboardShortcutManager()
      const deleteAction = vi.fn()

      manager.register({
        key: "Delete",
        description: "Delete",
        action: deleteAction,
      })

      const event = new KeyboardEvent("keydown", { key: "Delete" })
      manager.handleKeyDown(event)

      expect(deleteAction).toHaveBeenCalled()
    })

    it("should trigger save with keyboard shortcut", () => {
      const manager = new KeyboardShortcutManager()
      const saveAction = vi.fn()

      manager.register({
        key: "s",
        ctrl: true,
        description: "Save",
        action: saveAction,
      })

      const event = new KeyboardEvent("keydown", { key: "s", ctrlKey: true })
      manager.handleKeyDown(event)

      expect(saveAction).toHaveBeenCalled()
    })

    it("should handle multiple keyboard shortcuts", () => {
      const manager = new KeyboardShortcutManager()
      const action1 = vi.fn()
      const action2 = vi.fn()
      const action3 = vi.fn()

      manager.register({ key: "s", ctrl: true, description: "Save", action: action1 })
      manager.register({ key: "f", ctrl: true, description: "Find", action: action2 })
      manager.register({ key: "a", ctrl: true, description: "Select All", action: action3 })

      const event1 = new KeyboardEvent("keydown", { key: "s", ctrlKey: true })
      const event2 = new KeyboardEvent("keydown", { key: "f", ctrlKey: true })
      const event3 = new KeyboardEvent("keydown", { key: "a", ctrlKey: true })

      manager.handleKeyDown(event1)
      manager.handleKeyDown(event2)
      manager.handleKeyDown(event3)

      expect(action1).toHaveBeenCalled()
      expect(action2).toHaveBeenCalled()
      expect(action3).toHaveBeenCalled()
    })
  })

  describe("Chunked Data Loading + Virtual Scroll Integration", () => {
    it("should load chunks for virtual scroll", async () => {
      const loader = new ChunkedDataLoader<TestItem>({
        chunkSize: 10,
        preloadCount: 2,
      })

      const loadFn = vi.fn().mockImplementation((offset, limit) => {
        return Promise.resolve(testData.slice(offset, offset + limit))
      })

      const chunk0 = await loader.loadChunk("chunk-0", loadFn)
      const chunk1 = await loader.loadChunk("chunk-1", loadFn)

      expect(chunk0).toHaveLength(10)
      expect(chunk1).toHaveLength(10)
      expect(loadFn).toHaveBeenCalledTimes(2)
    })

    it("should preload adjacent chunks for smooth scrolling", async () => {
      const loader = new ChunkedDataLoader<TestItem>({
        chunkSize: 10,
        preloadCount: 2,
      })

      const loadFn = vi.fn().mockImplementation((offset, limit) => {
        return Promise.resolve(testData.slice(offset, offset + limit))
      })

      await loader.preloadChunks(0, loadFn)

      expect(loadFn).toHaveBeenCalledTimes(3)
    })

    it("should cache loaded chunks for virtual scroll", async () => {
      const loader = new ChunkedDataLoader<TestItem>({
        chunkSize: 10,
        cacheSize: 5,
      })

      const loadFn = vi.fn().mockImplementation((offset, limit) => {
        return Promise.resolve(testData.slice(offset, offset + limit))
      })

      await loader.loadChunk("chunk-0", loadFn)
      await loader.loadChunk("chunk-0", loadFn)

      expect(loadFn).toHaveBeenCalledTimes(1)

      const chunk = loader.getChunk("chunk-0")
      expect(chunk).toBeDefined()
      expect(chunk!.loaded).toBe(true)
    })
  })

  describe("End-to-End Workflow Integration", () => {
    it("should complete full workflow: import -> search -> batch update -> export", async () => {
      const csvContent = "name,email,status\nAlice,alice@example.com,active\nBob,bob@example.com,inactive"
      const file = new File([csvContent], "test.csv", { type: "text/csv" })

      const importer = new DataImporter<TestItem>()
      const importResult = await importer.importFromCSV(file)

      expect(importResult.success).toBe(true)

      const search = new AdvancedSearch<TestItem>()
      const activeUsers = search.filter(importResult.data, [
        { field: "status", operator: "equals", value: "active" },
      ])

      expect(activeUsers).toHaveLength(1)

      const batchOps = new BatchOperations<TestItem>()
      const updateFn = vi.fn().mockResolvedValue({ success: true })
      const updates = activeUsers.map((user) => ({
        id: user.id,
        data: { status: "verified" },
      }))

      const batchResult = await batchOps.batchUpdate(updates, updateFn)

      expect(batchResult.success).toBe(true)

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToCSV(activeUsers.map((user) => ({
        ...user,
        status: "verified",
      })), { filename: "verified-users" })

      expect(mockSaveAs).toHaveBeenCalled()
    })

    it("should handle offline workflow: preload -> offline edit -> sync", async () => {
      const preloader = new DataPreloader<TestItem>()
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      await preloader.preload("user-1", loadFn)

      const cached = preloader.get("user-1")
      expect(cached).toBeDefined()

      const manager = new OfflineManager<TestItem>()
      await manager.addOperation("update", {
        ...testData[0],
        name: "Updated Name",
      })

      const pending = manager.getPendingOperations()
      expect(pending).toHaveLength(1)
      expect(pending[0].type).toBe("update")
      expect(pending[0].data.name).toBe("Updated Name")
    })

    it("should handle drag and drop workflow: reorder -> save -> export", async () => {
      const onReorder = vi.fn()
      const manager = new DragDropManager<TestItem>({
        items: testData.slice(0, 10),
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
      const reorderedItems = onReorder.mock.calls[0][0]

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToJSON(reorderedItems, { filename: "reordered-users" })

      expect(mockSaveAs).toHaveBeenCalled()
    })
  })

  describe("Error Handling Integration", () => {
    it("should handle import errors gracefully", async () => {
      const invalidContent = "invalid,csv,format"
      const file = new File([invalidContent], "test.csv", { type: "text/csv" })

      const importer = new DataImporter<TestItem>()
      const result = await importer.importFromCSV(file)

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it("should handle batch operation errors gracefully", async () => {
      const batchOps = new BatchOperations<TestItem>()
      const updateFn = vi.fn()
        .mockResolvedValueOnce({ success: true })
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({ success: true })

      const updates = testData.slice(0, 3).map((item) => ({
        id: item.id,
        data: { status: "updated" },
      }))

      const result = await batchOps.batchUpdate(updates, updateFn)

      expect(result.success).toBe(false)
      expect(result.updated).toHaveLength(2)
      expect(result.failed).toHaveLength(1)
    })

    it("should handle offline sync errors gracefully", async () => {
      const manager = new OfflineManager<TestItem>()
      await manager.addOperation("create", testData[0])

      await manager.sync()

      const pending = manager.getPendingOperations()
      expect(pending).toHaveLength(1)
    })
  })

  describe("Performance Integration", () => {
    it("should handle large dataset efficiently", async () => {
      const largeData = Array.from({ length: 10000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        status: i % 2 === 0 ? "active" : "inactive",
      }))

      const search = new AdvancedSearch<TestItem>()
      const startTime = Date.now()
      const filteredData = search.filter(largeData, [
        { field: "status", operator: "equals", value: "active" },
      ])
      const endTime = Date.now()

      expect(filteredData).toHaveLength(5000)
      expect(endTime - startTime).toBeLessThan(1000)
    })

    it("should handle rapid keyboard shortcuts efficiently", () => {
      const manager = new KeyboardShortcutManager()
      const action = vi.fn()

      manager.register({
        key: "a",
        description: "Test",
        action,
      })

      const startTime = Date.now()
      for (let i = 0; i < 100; i++) {
        const event = new KeyboardEvent("keydown", { key: "a" })
        manager.handleKeyDown(event)
      }
      const endTime = Date.now()

      expect(action).toHaveBeenCalledTimes(100)
      expect(endTime - startTime).toBeLessThan(100)
    })

    it("should handle large batch operations efficiently", async () => {
      const batchOps = new BatchOperations<TestItem>()
      const createFn = vi.fn().mockResolvedValue({ success: true })

      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        status: "active",
      }))

      const startTime = Date.now()
      const result = await batchOps.batchCreate(largeData, createFn, {
        batchSize: 50,
      })
      const endTime = Date.now()

      expect(result.success).toBe(true)
      expect(endTime - startTime).toBeLessThan(5000)
    })
  })
})
