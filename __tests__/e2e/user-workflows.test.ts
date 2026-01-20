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

interface User {
  id: number
  name: string
  email: string
  status: string
  role: string
}

describe("E2E Tests - Key User Workflows", () => {
  let testUsers: User[]

  beforeEach(() => {
    testUsers = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: i % 2 === 0 ? "active" : "inactive",
      role: i % 3 === 0 ? "admin" : "user",
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("User Management Workflow", () => {
    it("should complete full user management lifecycle", async () => {
      const batchOps = new BatchOperations<User>()
      const search = new AdvancedSearch<User>()
      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      const createFn = vi.fn().mockResolvedValue({ success: true })
      const createResult = await batchOps.batchCreate(testUsers.slice(0, 10), createFn)

      expect(createResult.success).toBe(true)
      expect(createResult.created).toHaveLength(10)

      const activeUsers = search.filter(testUsers.slice(0, 10), [
        { field: "status", operator: "equals", value: "active" },
      ])

      expect(activeUsers.length).toBeGreaterThan(0)

      DataExporter.exportToCSV(activeUsers, { filename: "active-users" })
      expect(mockSaveAs).toHaveBeenCalled()
    })

    it("should handle user search and export workflow", async () => {
      const search = new AdvancedSearch<User>()
      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      const adminUsers = search.filter(testUsers, [
        { field: "role", operator: "equals", value: "admin" },
      ])

      expect(adminUsers.length).toBeGreaterThan(0)

      DataExporter.exportToJSON(adminUsers, { filename: "admin-users" })
      expect(mockSaveAs).toHaveBeenCalled()

      const call = mockSaveAs.mock.calls[0]
      expect(call[1]).toBe("admin-users.json")
    })

    it("should handle user batch update workflow", async () => {
      const batchOps = new BatchOperations<User>()
      const updateFn = vi.fn().mockResolvedValue({ success: true })

      const updates = testUsers.slice(0, 5).map((user) => ({
        id: user.id,
        data: { status: "verified" },
      }))

      const result = await batchOps.batchUpdate(updates, updateFn)

      expect(result.success).toBe(true)
      expect(result.updated).toHaveLength(5)
    })
  })

  describe("Data Import/Export Workflow", () => {
    it("should complete full import-export workflow", async () => {
      const csvContent = "name,email,status,role\nAlice,alice@example.com,active,admin\nBob,bob@example.com,inactive,user"
      const file = new File([csvContent], "users.csv", { type: "text/csv" })

      const importer = new DataImporter<User>()
      const importResult = await importer.importFromCSV(file)

      expect(importResult.success).toBe(true)
      expect(importResult.data).toHaveLength(2)

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToExcel(importResult.data, { filename: "imported-users" })
      expect(mockSaveAs).toHaveBeenCalled()
    })

    it("should handle Excel import and CSV export workflow", async () => {
      const mockXlsx = {
        read: vi.fn().mockReturnValue({
          Sheets: { Sheet1: {} },
          SheetNames: ["Sheet1"],
        }),
        utils: {
          sheet_to_json: vi.fn().mockReturnValue([
            { name: "Alice", email: "alice@example.com", status: "active", role: "admin" },
            { name: "Bob", email: "bob@example.com", status: "inactive", role: "user" },
          ]),
        },
      }
      global.XLSX = mockXlsx

      const file = new File([new ArrayBuffer(0)], "users.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      const importer = new DataImporter<User>()
      const importResult = await importer.importFromExcel(file)

      expect(importResult.success).toBe(true)

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToCSV(importResult.data, { filename: "converted-users" })
      expect(mockSaveAs).toHaveBeenCalled()
    })

    it("should handle import with validation and export workflow", async () => {
      const csvContent = "name,email,status,role\nAlice,alice@example.com,active,admin\nBob,bob@example.com,inactive,user"
      const file = new File([csvContent], "users.csv", { type: "text/csv" })

      const importer = new DataImporter<User>()
      const importResult = await importer.importFromCSV(file, {
        validateRow: (row) => row.name && row.email,
      })

      expect(importResult.success).toBe(true)

      const search = new AdvancedSearch<User>()
      const activeUsers = search.filter(importResult.data, [
        { field: "status", operator: "equals", value: "active" },
      ])

      expect(activeUsers).toHaveLength(1)

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToJSON(activeUsers, { filename: "validated-active-users" })
      expect(mockSaveAs).toHaveBeenCalled()
    })
  })

  describe("Search and Filter Workflow", () => {
    it("should complete search, filter, and export workflow", async () => {
      const search = new AdvancedSearch<User>()
      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      const activeAdmins = search.filter(testUsers, [
        { field: "status", operator: "equals", value: "active" },
        { field: "role", operator: "equals", value: "admin" },
      ])

      expect(activeAdmins.length).toBeGreaterThan(0)

      DataExporter.exportToCSV(activeAdmins, { filename: "active-admins" })
      expect(mockSaveAs).toHaveBeenCalled()

      const searchResults = search.search(testUsers, "User 1", [
        { field: "name", operator: "contains" },
      ])

      expect(searchResults.length).toBeGreaterThan(0)

      DataExporter.exportToJSON(searchResults, { filename: "search-results" })
      expect(mockSaveAs).toHaveBeenCalledTimes(2)
    })

    it("should handle search with history and export workflow", async () => {
      const search = new AdvancedSearch<User>()

      search.addToHistory("User 1")
      search.addToHistory("User 2")
      search.addToHistory("User 3")

      const history = search.getHistory()
      expect(history).toHaveLength(3)

      const results1 = search.search(testUsers, "User 1", [
        { field: "name", operator: "contains" },
      ])
      const results2 = search.search(testUsers, "User 2", [
        { field: "name", operator: "contains" },
      ])

      expect(results1.length).toBeGreaterThan(0)
      expect(results2.length).toBeGreaterThan(0)

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToCSV([...results1, ...results2], { filename: "combined-results" })
      expect(mockSaveAs).toHaveBeenCalled()
    })
  })

  describe("Batch Operations Workflow", () => {
    it("should complete batch create, update, and delete workflow", async () => {
      const batchOps = new BatchOperations<User>()
      const createFn = vi.fn().mockResolvedValue({ success: true })
      const updateFn = vi.fn().mockResolvedValue({ success: true })
      const deleteFn = vi.fn().mockResolvedValue({ success: true })

      const createResult = await batchOps.batchCreate(testUsers.slice(0, 5), createFn)
      expect(createResult.success).toBe(true)

      const updates = testUsers.slice(0, 5).map((user) => ({
        id: user.id,
        data: { status: "updated" },
      }))
      const updateResult = await batchOps.batchUpdate(updates, updateFn)
      expect(updateResult.success).toBe(true)

      const ids = testUsers.slice(0, 3).map((user) => user.id)
      const deleteResult = await batchOps.batchDelete(ids, deleteFn)
      expect(deleteResult.success).toBe(true)
    })

    it("should handle batch operations with progress tracking workflow", async () => {
      const batchOps = new BatchOperations<User>()
      const createFn = vi.fn().mockResolvedValue({ success: true })
      const onProgress = vi.fn()

      const result = await batchOps.batchCreate(testUsers.slice(0, 20), createFn, {
        onProgress,
      })

      expect(result.success).toBe(true)
      expect(onProgress).toHaveBeenCalled()

      const lastProgressCall = onProgress.mock.calls[onProgress.mock.calls.length - 1]
      expect(lastProgressCall[0]).toBe(100)
    })

    it("should handle batch operations with error handling workflow", async () => {
      const batchOps = new BatchOperations<User>()
      const createFn = vi.fn()
        .mockResolvedValueOnce({ success: true })
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({ success: true })

      const result = await batchOps.batchCreate(testUsers.slice(0, 3), createFn)

      expect(result.success).toBe(false)
      expect(result.created).toHaveLength(2)
      expect(result.failed).toHaveLength(1)
    })
  })

  describe("Virtual Scroll and Data Loading Workflow", () => {
    it("should complete virtual scroll with chunk loading workflow", async () => {
      const loader = new ChunkedDataLoader<User>({
        chunkSize: 10,
        preloadCount: 2,
      })

      const loadFn = vi.fn().mockImplementation((offset, limit) => {
        return Promise.resolve(testUsers.slice(offset, offset + limit))
      })

      const chunk0 = await loader.loadChunk("chunk-0", loadFn)
      const chunk1 = await loader.loadChunk("chunk-1", loadFn)
      const chunk2 = await loader.loadChunk("chunk-2", loadFn)

      expect(chunk0).toHaveLength(10)
      expect(chunk1).toHaveLength(10)
      expect(chunk2).toHaveLength(10)
      expect(loadFn).toHaveBeenCalledTimes(3)

      await loader.preloadChunks(0, loadFn)

      expect(loadFn).toHaveBeenCalledTimes(6)
    })

    it("should handle data preloading with virtual scroll workflow", async () => {
      const preloader = new DataPreloader<User>({
        enabled: true,
        prefetchCount: 3,
      })

      const loadFn = vi.fn().mockResolvedValue(testUsers[0])

      await preloader.preload("user-1", loadFn)
      await preloader.preload("user-2", loadFn)
      await preloader.preload("user-3", loadFn)

      expect(loadFn).toHaveBeenCalledTimes(3)

      const cached1 = preloader.get("user-1")
      const cached2 = preloader.get("user-2")
      const cached3 = preloader.get("user-3")

      expect(cached1).toBeDefined()
      expect(cached2).toBeDefined()
      expect(cached3).toBeDefined()
    })
  })

  describe("Drag and Drop Workflow", () => {
    it("should complete drag, drop, and save workflow", async () => {
      const onReorder = vi.fn()
      const manager = new DragDropManager<User>({
        items: testUsers.slice(0, 10),
        onReorder,
      })

      manager.startDrag(testUsers[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()

      const reorderedItems = onReorder.mock.calls[0][0]

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToJSON(reorderedItems, { filename: "reordered-users" })
      expect(mockSaveAs).toHaveBeenCalled()
    })

    it("should handle multiple drag and drop operations workflow", async () => {
      const onReorder = vi.fn()
      const manager = new DragDropManager<User>({
        items: testUsers.slice(0, 10),
        onReorder,
      })

      manager.startDrag(testUsers[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      manager.startDrag(testUsers[1], 1)
      manager.handleDragOver(8, "before")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalledTimes(2)
    })
  })

  describe("Keyboard Shortcuts Workflow", () => {
    it("should complete keyboard shortcut operations workflow", () => {
      const manager = new KeyboardShortcutManager()
      const searchAction = vi.fn()
      const saveAction = vi.fn()
      const deleteAction = vi.fn()

      manager.register({
        key: "f",
        ctrl: true,
        description: "Search",
        action: searchAction,
      })
      manager.register({
        key: "s",
        ctrl: true,
        description: "Save",
        action: saveAction,
      })
      manager.register({
        key: "Delete",
        description: "Delete",
        action: deleteAction,
      })

      const searchEvent = new KeyboardEvent("keydown", { key: "f", ctrlKey: true })
      const saveEvent = new KeyboardEvent("keydown", { key: "s", ctrlKey: true })
      const deleteEvent = new KeyboardEvent("keydown", { key: "Delete" })

      manager.handleKeyDown(searchEvent)
      manager.handleKeyDown(saveEvent)
      manager.handleKeyDown(deleteEvent)

      expect(searchAction).toHaveBeenCalled()
      expect(saveAction).toHaveBeenCalled()
      expect(deleteAction).toHaveBeenCalled()
    })

    it("should handle keyboard shortcuts with context workflow", () => {
      const manager = new KeyboardShortcutManager()
      const actions: { [key: string]: Function } = {}

      for (let i = 1; i <= 10; i++) {
        const action = vi.fn()
        actions[`action-${i}`] = action
        manager.register({
          key: `${i}`,
          description: `Action ${i}`,
          action,
        })
      }

      for (let i = 1; i <= 10; i++) {
        const event = new KeyboardEvent("keydown", { key: `${i}` })
        manager.handleKeyDown(event)
      }

      Object.values(actions).forEach((action) => {
        expect(action).toHaveBeenCalled()
      })
    })
  })

  describe("Offline Support Workflow", () => {
    it("should complete offline operation and sync workflow", async () => {
      const manager = new OfflineManager<User>()

      await manager.addOperation("create", testUsers[0])
      await manager.addOperation("update", testUsers[1])
      await manager.addOperation("delete", testUsers[2])

      const pending = manager.getPendingOperations()
      expect(pending).toHaveLength(3)

      await manager.sync()

      const syncedPending = manager.getPendingOperations()
      expect(syncedPending).toHaveLength(0)
    })

    it("should handle offline operations with error handling workflow", async () => {
      const manager = new OfflineManager<User>()

      await manager.addOperation("create", testUsers[0])

      const pending = manager.getPendingOperations()
      expect(pending).toHaveLength(1)

      await manager.sync()

      const failed = manager.getFailedOperations()
      expect(failed).toHaveLength(1)
    })
  })

  describe("Complex Multi-Step Workflow", () => {
    it("should complete full data management workflow", async () => {
      const csvContent = "name,email,status,role\nAlice,alice@example.com,active,admin\nBob,bob@example.com,inactive,user"
      const file = new File([csvContent], "users.csv", { type: "text/csv" })

      const importer = new DataImporter<User>()
      const importResult = await importer.importFromCSV(file)

      expect(importResult.success).toBe(true)

      const search = new AdvancedSearch<User>()
      const activeUsers = search.filter(importResult.data, [
        { field: "status", operator: "equals", value: "active" },
      ])

      expect(activeUsers).toHaveLength(1)

      const batchOps = new BatchOperations<User>()
      const updateFn = vi.fn().mockResolvedValue({ success: true })
      const updates = activeUsers.map((user) => ({
        id: user.id,
        data: { status: "verified" },
      }))

      const updateResult = await batchOps.batchUpdate(updates, updateFn)
      expect(updateResult.success).toBe(true)

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToCSV(activeUsers.map((user) => ({
        ...user,
        status: "verified",
      })), { filename: "final-users" })

      expect(mockSaveAs).toHaveBeenCalled()
    })

    it("should complete full user interaction workflow", async () => {
      const search = new AdvancedSearch<User>()
      const batchOps = new BatchOperations<User>()
      const keyboardManager = new KeyboardShortcutManager()

      const searchAction = vi.fn()
      keyboardManager.register({
        key: "f",
        ctrl: true,
        description: "Search",
        action: searchAction,
      })

      const searchEvent = new KeyboardEvent("keydown", { key: "f", ctrlKey: true })
      keyboardManager.handleKeyDown(searchEvent)

      expect(searchAction).toHaveBeenCalled()

      const activeUsers = search.filter(testUsers, [
        { field: "status", operator: "equals", value: "active" },
      ])

      expect(activeUsers.length).toBeGreaterThan(0)

      const deleteFn = vi.fn().mockResolvedValue({ success: true })
      const ids = activeUsers.slice(0, 3).map((user) => user.id)
      const deleteResult = await batchOps.batchDelete(ids, deleteFn)

      expect(deleteResult.success).toBe(true)

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToCSV(activeUsers.slice(3), { filename: "remaining-users" })
      expect(mockSaveAs).toHaveBeenCalled()
    })

    it("should complete full performance optimization workflow", async () => {
      const loader = new ChunkedDataLoader<User>({
        chunkSize: 10,
        preloadCount: 2,
      })

      const loadFn = vi.fn().mockImplementation((offset, limit) => {
        return Promise.resolve(testUsers.slice(offset, offset + limit))
      })

      await loader.preloadChunks(0, loadFn)

      const preloader = new DataPreloader<User>()
      const preloadFn = vi.fn().mockResolvedValue(testUsers[0])

      await preloader.preload("user-1", preloadFn)

      const search = new AdvancedSearch<User>()
      const startTime = Date.now()
      const results = search.filter(testUsers, [
        { field: "status", operator: "equals", value: "active" },
      ])
      const endTime = Date.now()

      expect(results.length).toBeGreaterThan(0)
      expect(endTime - startTime).toBeLessThan(100)

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToCSV(results, { filename: "optimized-results" })
      expect(mockSaveAs).toHaveBeenCalled()
    })
  })

  describe("Error Recovery Workflow", () => {
    it("should handle and recover from import errors", async () => {
      const invalidContent = "invalid,csv,format"
      const file = new File([invalidContent], "test.csv", { type: "text/csv" })

      const importer = new DataImporter<User>()
      const result = await importer.importFromCSV(file)

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)

      const validContent = "name,email,status,role\nAlice,alice@example.com,active,admin"
      const validFile = new File([validContent], "valid.csv", { type: "text/csv" })

      const validResult = await importer.importFromCSV(validFile)

      expect(validResult.success).toBe(true)
    })

    it("should handle and recover from batch operation errors", async () => {
      const batchOps = new BatchOperations<User>()
      const createFn = vi.fn()
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({ success: true })

      const result = await batchOps.batchCreate(testUsers.slice(0, 2), createFn, {
        retryCount: 2,
      })

      expect(result.success).toBe(true)
      expect(result.created).toHaveLength(2)
    })
  })

  describe("Performance and Scalability Workflow", () => {
    it("should handle large dataset workflow efficiently", async () => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        status: i % 2 === 0 ? "active" : "inactive",
        role: i % 3 === 0 ? "admin" : "user",
      }))

      const search = new AdvancedSearch<User>()
      const startTime = Date.now()
      const results = search.filter(largeDataset, [
        { field: "status", operator: "equals", value: "active" },
      ])
      const endTime = Date.now()

      expect(results).toHaveLength(5000)
      expect(endTime - startTime).toBeLessThan(1000)

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToCSV(results.slice(0, 100), { filename: "large-dataset-sample" })
      expect(mockSaveAs).toHaveBeenCalled()
    })

    it("should handle rapid user operations workflow", async () => {
      const batchOps = new BatchOperations<User>()
      const createFn = vi.fn().mockResolvedValue({ success: true })

      const startTime = Date.now()
      for (let i = 0; i < 100; i++) {
        await batchOps.batchCreate([testUsers[i % testUsers.length]], createFn)
      }
      const endTime = Date.now()

      expect(endTime - startTime).toBeLessThan(5000)
    })
  })
})
