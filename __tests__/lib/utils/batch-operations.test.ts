import { describe, it, expect, beforeEach, vi } from "vitest"
import { BatchOperations } from "@/lib/utils/batch-operations"

interface TestItem {
  id: number
  name: string
  email: string
  status: string
}

describe("BatchOperations", () => {
  let batchOps: BatchOperations<TestItem>
  let testData: TestItem[]

  beforeEach(() => {
    batchOps = new BatchOperations<TestItem>()
    testData = [
      { id: 1, name: "Alice", email: "alice@example.com", status: "active" },
      { id: 2, name: "Bob", email: "bob@example.com", status: "inactive" },
      { id: 3, name: "Charlie", email: "charlie@example.com", status: "active" },
      { id: 4, name: "Diana", email: "diana@example.com", status: "active" },
      { id: 5, name: "Eve", email: "eve@example.com", status: "inactive" },
    ]
  })

  describe("batchCreate", () => {
    it("should create multiple items successfully", async () => {
      const createFn = vi.fn().mockResolvedValue({ success: true })

      const result = await batchOps.batchCreate(testData, createFn)

      expect(result.success).toBe(true)
      expect(result.created).toHaveLength(5)
      expect(result.failed).toHaveLength(0)
      expect(createFn).toHaveBeenCalledTimes(5)
    })

    it("should handle batch size configuration", async () => {
      const createFn = vi.fn().mockResolvedValue({ success: true })

      await batchOps.batchCreate(testData, createFn, { batchSize: 2 })

      expect(createFn).toHaveBeenCalledTimes(5)
    })

    it("should handle partial failures", async () => {
      const createFn = vi.fn()
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: false, error: "Validation failed" })
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: false, error: "Duplicate entry" })
        .mockResolvedValueOnce({ success: true })

      const result = await batchOps.batchCreate(testData, createFn)

      expect(result.success).toBe(false)
      expect(result.created).toHaveLength(3)
      expect(result.failed).toHaveLength(2)
      expect(result.failed[0].error).toBe("Validation failed")
      expect(result.failed[1].error).toBe("Duplicate entry")
    })

    it("should call onProgress callback", async () => {
      const createFn = vi.fn().mockResolvedValue({ success: true })
      const onProgress = vi.fn()

      await batchOps.batchCreate(testData, createFn, { onProgress })

      expect(onProgress).toHaveBeenCalled()
      const progressCalls = onProgress.mock.calls
      expect(progressCalls[progressCalls.length - 1][0]).toBe(100)
    })

    it("should stop on first failure when configured", async () => {
      const createFn = vi.fn()
        .mockResolvedValueOnce({ success: true })
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({ success: true })

      const result = await batchOps.batchCreate(testData, createFn, {
        stopOnFirstError: true,
      })

      expect(result.success).toBe(false)
      expect(createFn).toHaveBeenCalledTimes(2)
    })

    it("should handle empty items array", async () => {
      const createFn = vi.fn().mockResolvedValue({ success: true })

      const result = await batchOps.batchCreate([], createFn)

      expect(result.success).toBe(true)
      expect(result.created).toHaveLength(0)
      expect(createFn).not.toHaveBeenCalled()
    })

    it("should retry failed operations when configured", async () => {
      const createFn = vi.fn()
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: true })

      const result = await batchOps.batchCreate(testData, createFn, {
        retryCount: 2,
      })

      expect(result.success).toBe(true)
      expect(result.created).toHaveLength(5)
    })

    it("should handle concurrent operations", async () => {
      const createFn = vi.fn().mockResolvedValue({ success: true })

      await batchOps.batchCreate(testData, createFn, {
        batchSize: 2,
        concurrency: 2,
      })

      expect(createFn).toHaveBeenCalledTimes(5)
    })
  })

  describe("batchUpdate", () => {
    it("should update multiple items successfully", async () => {
      const updateFn = vi.fn().mockResolvedValue({ success: true })
      const updates = testData.map((item) => ({
        id: item.id,
        data: { status: "updated" },
      }))

      const result = await batchOps.batchUpdate(updates, updateFn)

      expect(result.success).toBe(true)
      expect(result.updated).toHaveLength(5)
      expect(updateFn).toHaveBeenCalledTimes(5)
    })

    it("should handle partial failures", async () => {
      const updateFn = vi.fn()
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: false, error: "Not found" })
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: false, error: "Permission denied" })
        .mockResolvedValueOnce({ success: true })

      const updates = testData.map((item) => ({
        id: item.id,
        data: { status: "updated" },
      }))

      const result = await batchOps.batchUpdate(updates, updateFn)

      expect(result.success).toBe(false)
      expect(result.updated).toHaveLength(3)
      expect(result.failed).toHaveLength(2)
    })

    it("should handle empty updates array", async () => {
      const updateFn = vi.fn().mockResolvedValue({ success: true })

      const result = await batchOps.batchUpdate([], updateFn)

      expect(result.success).toBe(true)
      expect(result.updated).toHaveLength(0)
      expect(updateFn).not.toHaveBeenCalled()
    })

    it("should validate update data", async () => {
      const updateFn = vi.fn().mockResolvedValue({ success: true })
      const validateFn = vi.fn().mockReturnValue(true)

      const updates = testData.map((item) => ({
        id: item.id,
        data: { status: "updated" },
      }))

      await batchOps.batchUpdate(updates, updateFn, { validateFn })

      expect(validateFn).toHaveBeenCalledTimes(5)
    })

    it("should skip invalid updates", async () => {
      const updateFn = vi.fn().mockResolvedValue({ success: true })
      const validateFn = vi.fn((item) => item.id !== 3)

      const updates = testData.map((item) => ({
        id: item.id,
        data: { status: "updated" },
      }))

      const result = await batchOps.batchUpdate(updates, updateFn, { validateFn })

      expect(result.success).toBe(true)
      expect(result.updated).toHaveLength(4)
      expect(result.skipped).toHaveLength(1)
    })
  })

  describe("batchDelete", () => {
    it("should delete multiple items successfully", async () => {
      const deleteFn = vi.fn().mockResolvedValue({ success: true })
      const ids = testData.map((item) => item.id)

      const result = await batchOps.batchDelete(ids, deleteFn)

      expect(result.success).toBe(true)
      expect(result.deleted).toHaveLength(5)
      expect(deleteFn).toHaveBeenCalledTimes(5)
    })

    it("should handle partial failures", async () => {
      const deleteFn = vi.fn()
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: false, error: "Not found" })
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: false, error: "Permission denied" })
        .mockResolvedValueOnce({ success: true })

      const ids = testData.map((item) => item.id)

      const result = await batchOps.batchDelete(ids, deleteFn)

      expect(result.success).toBe(false)
      expect(result.deleted).toHaveLength(3)
      expect(result.failed).toHaveLength(2)
    })

    it("should handle empty ids array", async () => {
      const deleteFn = vi.fn().mockResolvedValue({ success: true })

      const result = await batchOps.batchDelete([], deleteFn)

      expect(result.success).toBe(true)
      expect(result.deleted).toHaveLength(0)
      expect(deleteFn).not.toHaveBeenCalled()
    })

    it("should require confirmation when configured", async () => {
      const deleteFn = vi.fn().mockResolvedValue({ success: true })
      const confirmFn = vi.fn().mockResolvedValue(false)
      const ids = testData.map((item) => item.id)

      const result = await batchOps.batchDelete(ids, deleteFn, {
        requireConfirmation: true,
        confirmFn,
      })

      expect(confirmFn).toHaveBeenCalled()
      expect(result.success).toBe(true)
      expect(result.deleted).toHaveLength(0)
    })

    it("should proceed with confirmation", async () => {
      const deleteFn = vi.fn().mockResolvedValue({ success: true })
      const confirmFn = vi.fn().mockResolvedValue(true)
      const ids = testData.map((item) => item.id)

      const result = await batchOps.batchDelete(ids, deleteFn, {
        requireConfirmation: true,
        confirmFn,
      })

      expect(confirmFn).toHaveBeenCalled()
      expect(result.success).toBe(true)
      expect(result.deleted).toHaveLength(5)
    })
  })

  describe("batchUpdateStatus", () => {
    it("should update status for multiple items", async () => {
      const updateFn = vi.fn().mockResolvedValue({ success: true })
      const ids = testData.map((item) => item.id)
      const newStatus = "inactive"

      const result = await batchOps.batchUpdateStatus(ids, newStatus, updateFn)

      expect(result.success).toBe(true)
      expect(result.updated).toHaveLength(5)
      expect(updateFn).toHaveBeenCalledTimes(5)
      updateFn.mock.calls.forEach((call) => {
        expect(call[1]).toBe(newStatus)
      })
    })

    it("should handle partial failures", async () => {
      const updateFn = vi.fn()
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: false, error: "Not found" })
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: false, error: "Permission denied" })
        .mockResolvedValueOnce({ success: true })

      const ids = testData.map((item) => item.id)
      const newStatus = "inactive"

      const result = await batchOps.batchUpdateStatus(ids, newStatus, updateFn)

      expect(result.success).toBe(false)
      expect(result.updated).toHaveLength(3)
      expect(result.failed).toHaveLength(2)
    })

    it("should handle empty ids array", async () => {
      const updateFn = vi.fn().mockResolvedValue({ success: true })

      const result = await batchOps.batchUpdateStatus([], "inactive", updateFn)

      expect(result.success).toBe(true)
      expect(result.updated).toHaveLength(0)
      expect(updateFn).not.toHaveBeenCalled()
    })

    it("should validate status value", async () => {
      const updateFn = vi.fn().mockResolvedValue({ success: true })
      const validStatuses = ["active", "inactive", "pending"]
      const ids = testData.map((item) => item.id)

      const result = await batchOps.batchUpdateStatus(ids, "invalid", updateFn, {
        validStatuses,
      })

      expect(result.success).toBe(false)
      expect(result.updated).toHaveLength(0)
      expect(result.failed).toHaveLength(1)
      expect(result.failed[0].error).toContain("Invalid status")
    })
  })

  describe("progress tracking", () => {
    it("should report progress correctly", async () => {
      const createFn = vi.fn().mockResolvedValue({ success: true })
      const onProgress = vi.fn()

      await batchOps.batchCreate(testData, createFn, {
        batchSize: 2,
        onProgress,
      })

      const progressCalls = onProgress.mock.calls
      expect(progressCalls.length).toBeGreaterThan(0)
      expect(progressCalls[0][0]).toBeGreaterThan(0)
      expect(progressCalls[progressCalls.length - 1][0]).toBe(100)
    })

    it("should provide detailed progress information", async () => {
      const createFn = vi.fn().mockResolvedValue({ success: true })
      const onProgress = vi.fn()

      await batchOps.batchCreate(testData, createFn, { onProgress })

      const lastCall = onProgress.mock.calls[onProgress.mock.calls.length - 1]
      const progressInfo = lastCall[1]

      expect(progressInfo).toHaveProperty("total", 5)
      expect(progressInfo).toHaveProperty("completed")
      expect(progressInfo).toHaveProperty("failed")
      expect(progressInfo).toHaveProperty("pending")
    })
  })

  describe("error handling", () => {
    it("should handle network errors", async () => {
      const createFn = vi.fn().mockRejectedValue(new Error("Network error"))

      const result = await batchOps.batchCreate(testData, createFn)

      expect(result.success).toBe(false)
      expect(result.failed).toHaveLength(5)
      result.failed.forEach((failed) => {
        expect(failed.error).toContain("Network error")
      })
    })

    it("should handle timeout errors", async () => {
      const createFn = vi.fn().mockRejectedValue(new Error("Timeout"))

      const result = await batchOps.batchCreate(testData, createFn, {
        timeout: 100,
      })

      expect(result.success).toBe(false)
    })

    it("should handle validation errors", async () => {
      const createFn = vi.fn().mockResolvedValue({
        success: false,
        error: "Validation failed",
      })

      const result = await batchOps.batchCreate(testData, createFn)

      expect(result.success).toBe(false)
      expect(result.failed).toHaveLength(5)
    })
  })

  describe("result export", () => {
    it("should export results to CSV", async () => {
      const createFn = vi.fn()
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ success: false, error: "Validation failed" })
        .mockResolvedValueOnce({ success: true })

      const result = await batchOps.batchCreate(testData.slice(0, 3), createFn)

      const csv = result.exportToCSV()

      expect(csv).toContain("id,status,error")
      expect(csv).toContain("1,success")
      expect(csv).toContain("2,failed,Validation failed")
    })

    it("should export results to JSON", async () => {
      const createFn = vi.fn().mockResolvedValue({ success: true })

      const result = await batchOps.batchCreate(testData, createFn)

      const json = result.exportToJSON()

      expect(() => JSON.parse(json)).not.toThrow()
      const parsed = JSON.parse(json)
      expect(parsed).toHaveLength(5)
    })
  })

  describe("edge cases", () => {
    it("should handle very large batches", async () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        status: "active",
      }))

      const createFn = vi.fn().mockResolvedValue({ success: true })

      const result = await batchOps.batchCreate(largeData, createFn, {
        batchSize: 50,
      })

      expect(result.success).toBe(true)
      expect(result.created).toHaveLength(1000)
    })

    it("should handle duplicate items", async () => {
      const duplicateData = [
        testData[0],
        testData[0],
        testData[1],
        testData[1],
      ]

      const createFn = vi.fn().mockResolvedValue({ success: true })

      const result = await batchOps.batchCreate(duplicateData, createFn)

      expect(result.success).toBe(true)
      expect(result.created).toHaveLength(4)
    })

    it("should handle items with missing fields", async () => {
      const incompleteData = [
        { id: 1, name: "Alice", email: "", status: "active" },
        { id: 2, name: "", email: "bob@example.com", status: "inactive" },
      ]

      const createFn = vi.fn().mockResolvedValue({ success: true })

      const result = await batchOps.batchCreate(incompleteData, createFn)

      expect(result.success).toBe(true)
      expect(result.created).toHaveLength(2)
    })
  })
})
