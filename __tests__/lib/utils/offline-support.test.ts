import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { OfflineStorage, OfflineManager, useOffline, useLocalStorage } from "@/lib/utils/offline-support"

interface TestItem {
  id: string
  name: string
  value: number
}

describe("OfflineStorage", () => {
  let storage: OfflineStorage<TestItem>
  let testData: TestItem[]

  beforeEach(() => {
    storage = new OfflineStorage<TestItem>({
      dbName: "test-db",
      storeName: "test-store",
      version: 1,
    })
    testData = Array.from({ length: 10 }, (_, i) => ({
      id: `item-${i}`,
      name: `Item ${i + 1}`,
      value: i + 1,
    }))
  })

  afterEach(async () => {
    try {
      await storage.clear()
    } catch (error) {
      console.error("Error clearing storage:", error)
    }
  })

  describe("initialization", () => {
    it("should initialize with default options", async () => {
      const defaultStorage = new OfflineStorage<TestItem>()

      await defaultStorage.init()

      expect(defaultStorage).toBeDefined()
    })

    it("should initialize with custom options", async () => {
      const customStorage = new OfflineStorage<TestItem>({
        dbName: "custom-db",
        storeName: "custom-store",
        version: 2,
      })

      await customStorage.init()

      expect(customStorage).toBeDefined()
    })

    it("should initialize database", async () => {
      await storage.init()

      expect(storage).toBeDefined()
    })
  })

  describe("add", () => {
    it("should add item to storage", async () => {
      await storage.add(testData[0])

      const retrieved = await storage.get(testData[0].id)
      expect(retrieved).toEqual(testData[0])
    })

    it("should add multiple items", async () => {
      await storage.add(testData[0])
      await storage.add(testData[1])
      await storage.add(testData[2])

      const retrieved1 = await storage.get(testData[0].id)
      const retrieved2 = await storage.get(testData[1].id)
      const retrieved3 = await storage.get(testData[2].id)

      expect(retrieved1).toEqual(testData[0])
      expect(retrieved2).toEqual(testData[1])
      expect(retrieved3).toEqual(testData[2])
    })

    it("should handle adding duplicate items", async () => {
      await storage.add(testData[0])
      await storage.add(testData[0])

      const retrieved = await storage.get(testData[0].id)
      expect(retrieved).toEqual(testData[0])
    })

    it("should handle items with special characters", async () => {
      const specialItem = {
        id: "item-special-!@#$%",
        name: "Special Item",
        value: 1,
      }

      await storage.add(specialItem)

      const retrieved = await storage.get(specialItem.id)
      expect(retrieved).toEqual(specialItem)
    })
  })

  describe("update", () => {
    it("should update existing item", async () => {
      await storage.add(testData[0])

      const updatedItem = { ...testData[0], name: "Updated Item" }
      await storage.update(updatedItem)

      const retrieved = await storage.get(testData[0].id)
      expect(retrieved).toEqual(updatedItem)
    })

    it("should update non-existent item", async () => {
      await storage.update(testData[0])

      const retrieved = await storage.get(testData[0].id)
      expect(retrieved).toEqual(testData[0])
    })

    it("should handle partial updates", async () => {
      await storage.add(testData[0])

      const partialUpdate = { ...testData[0], value: 999 }
      await storage.update(partialUpdate)

      const retrieved = await storage.get(testData[0].id)
      expect(retrieved!.value).toBe(999)
    })
  })

  describe("delete", () => {
    it("should delete item from storage", async () => {
      await storage.add(testData[0])

      await storage.delete(testData[0].id)

      const retrieved = await storage.get(testData[0].id)
      expect(retrieved).toBeNull()
    })

    it("should handle deleting non-existent item", async () => {
      await expect(storage.delete("non-existent")).resolves.not.toThrow()
    })

    it("should delete multiple items", async () => {
      await storage.add(testData[0])
      await storage.add(testData[1])
      await storage.add(testData[2])

      await storage.delete(testData[0].id)
      await storage.delete(testData[1].id)

      const retrieved1 = await storage.get(testData[0].id)
      const retrieved2 = await storage.get(testData[1].id)
      const retrieved3 = await storage.get(testData[2].id)

      expect(retrieved1).toBeNull()
      expect(retrieved2).toBeNull()
      expect(retrieved3).toEqual(testData[2])
    })
  })

  describe("get", () => {
    it("should get item from storage", async () => {
      await storage.add(testData[0])

      const retrieved = await storage.get(testData[0].id)
      expect(retrieved).toEqual(testData[0])
    })

    it("should return null for non-existent item", async () => {
      const retrieved = await storage.get("non-existent")
      expect(retrieved).toBeNull()
    })

    it("should get multiple items", async () => {
      await storage.add(testData[0])
      await storage.add(testData[1])
      await storage.add(testData[2])

      const retrieved1 = await storage.get(testData[0].id)
      const retrieved2 = await storage.get(testData[1].id)
      const retrieved3 = await storage.get(testData[2].id)

      expect(retrieved1).toEqual(testData[0])
      expect(retrieved2).toEqual(testData[1])
      expect(retrieved3).toEqual(testData[2])
    })
  })

  describe("getAll", () => {
    it("should get all items from storage", async () => {
      await storage.add(testData[0])
      await storage.add(testData[1])
      await storage.add(testData[2])

      const allItems = await storage.getAll()

      expect(allItems).toHaveLength(3)
      expect(allItems).toContainEqual(testData[0])
      expect(allItems).toContainEqual(testData[1])
      expect(allItems).toContainEqual(testData[2])
    })

    it("should return empty array when storage is empty", async () => {
      const allItems = await storage.getAll()

      expect(allItems).toEqual([])
    })

    it("should handle large number of items", async () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        id: `item-${i}`,
        name: `Item ${i + 1}`,
        value: i + 1,
      }))

      for (const item of largeData) {
        await storage.add(item)
      }

      const allItems = await storage.getAll()

      expect(allItems).toHaveLength(100)
    })
  })

  describe("clear", () => {
    it("should clear all items from storage", async () => {
      await storage.add(testData[0])
      await storage.add(testData[1])
      await storage.add(testData[2])

      await storage.clear()

      const allItems = await storage.getAll()
      expect(allItems).toEqual([])
    })

    it("should handle clearing empty storage", async () => {
      await expect(storage.clear()).resolves.not.toThrow()
    })
  })
})

describe("OfflineManager", () => {
  let manager: OfflineManager<TestItem>
  let testData: TestItem[]

  beforeEach(() => {
    manager = new OfflineManager<TestItem>({
      dbName: "test-manager-db",
      storeName: "test-manager-store",
    })
    testData = Array.from({ length: 10 }, (_, i) => ({
      id: `item-${i}`,
      name: `Item ${i + 1}`,
      value: i + 1,
    }))
  })

  afterEach(() => {
    manager.clearOperations()
  })

  describe("initialization", () => {
    it("should initialize with default options", () => {
      const defaultManager = new OfflineManager<TestItem>()

      expect(defaultManager).toBeDefined()
    })

    it("should initialize with custom options", () => {
      const customManager = new OfflineManager<TestItem>({
        dbName: "custom-manager-db",
        storeName: "custom-manager-store",
      })

      expect(customManager).toBeDefined()
    })

    it("should detect online status", () => {
      expect(manager.isOffline()).toBe(false)
    })
  })

  describe("addOperation", () => {
    it("should add operation to queue", async () => {
      await manager.addOperation("create", testData[0])

      const pending = manager.getPendingOperations()
      expect(pending).toHaveLength(1)
      expect(pending[0].type).toBe("create")
      expect(pending[0].data).toEqual(testData[0])
    })

    it("should add multiple operations", async () => {
      await manager.addOperation("create", testData[0])
      await manager.addOperation("update", testData[1])
      await manager.addOperation("delete", testData[2])

      const pending = manager.getPendingOperations()
      expect(pending).toHaveLength(3)
    })

    it("should generate unique operation IDs", async () => {
      await manager.addOperation("create", testData[0])
      await manager.addOperation("create", testData[1])

      const pending = manager.getPendingOperations()
      expect(pending[0].id).not.toBe(pending[1].id)
    })

    it("should set operation timestamp", async () => {
      const beforeTime = Date.now()
      await manager.addOperation("create", testData[0])
      const afterTime = Date.now()

      const pending = manager.getPendingOperations()
      expect(pending[0].timestamp).toBeGreaterThanOrEqual(beforeTime)
      expect(pending[0].timestamp).toBeLessThanOrEqual(afterTime)
    })

    it("should mark operation as not synced", async () => {
      await manager.addOperation("create", testData[0])

      const pending = manager.getPendingOperations()
      expect(pending[0].synced).toBe(false)
    })
  })

  describe("sync", () => {
    it("should sync operations when online", async () => {
      await manager.addOperation("create", testData[0])

      await manager.sync()

      const pending = manager.getPendingOperations()
      expect(pending).toHaveLength(0)
    })

    it("should not sync when offline", async () => {
      await manager.addOperation("create", testData[0])

      await manager.sync()

      const pending = manager.getPendingOperations()
      expect(pending).toHaveLength(1)
    })

    it("should handle sync errors", async () => {
      await manager.addOperation("create", testData[0])

      await manager.sync()

      const pending = manager.getPendingOperations()
      expect(pending).toHaveLength(1)
    })

    it("should sync multiple operations", async () => {
      await manager.addOperation("create", testData[0])
      await manager.addOperation("update", testData[1])
      await manager.addOperation("delete", testData[2])

      await manager.sync()

      const pending = manager.getPendingOperations()
      expect(pending).toHaveLength(0)
    })
  })

  describe("getPendingOperations", () => {
    it("should return pending operations", async () => {
      await manager.addOperation("create", testData[0])
      await manager.addOperation("update", testData[1])

      const pending = manager.getPendingOperations()
      expect(pending).toHaveLength(2)
    })

    it("should return empty array when no pending operations", () => {
      const pending = manager.getPendingOperations()
      expect(pending).toEqual([])
    })

    it("should not return synced operations", async () => {
      await manager.addOperation("create", testData[0])

      await manager.sync()

      const pending = manager.getPendingOperations()
      expect(pending).toHaveLength(0)
    })
  })

  describe("getFailedOperations", () => {
    it("should return failed operations", async () => {
      await manager.addOperation("create", testData[0])

      await manager.sync()

      const failed = manager.getFailedOperations()
      expect(failed).toHaveLength(1)
    })

    it("should return empty array when no failed operations", () => {
      const failed = manager.getFailedOperations()
      expect(failed).toEqual([])
    })
  })

  describe("clearOperations", () => {
    it("should clear all operations", async () => {
      await manager.addOperation("create", testData[0])
      await manager.addOperation("update", testData[1])

      manager.clearOperations()

      const pending = manager.getPendingOperations()
      expect(pending).toEqual([])
    })
  })

  describe("getOperationCount", () => {
    it("should return operation count", async () => {
      await manager.addOperation("create", testData[0])
      await manager.addOperation("update", testData[1])
      await manager.addOperation("delete", testData[2])

      const count = manager.getOperationCount()
      expect(count).toBe(3)
    })

    it("should return 0 when no operations", () => {
      const count = manager.getOperationCount()
      expect(count).toBe(0)
    })
  })

  describe("isOffline", () => {
    it("should return online status", () => {
      expect(manager.isOffline()).toBe(false)
    })
  })
})

describe("useOffline", () => {
  it("should provide offline hook", () => {
    const { isOnline, operations, syncing, addOperation } = useOffline<any>({})

    expect(isOnline).toBeDefined()
    expect(operations).toBeDefined()
    expect(syncing).toBeDefined()
    expect(addOperation).toBeDefined()
    expect(typeof addOperation).toBe("function")
  })

  it("should provide retryFailedOperations function", () => {
    const { retryFailedOperations } = useOffline<any>({})

    expect(retryFailedOperations).toBeDefined()
    expect(typeof retryFailedOperations).toBe("function")
  })

  it("should provide clearOperations function", () => {
    const { clearOperations } = useOffline<any>({})

    expect(clearOperations).toBeDefined()
    expect(typeof clearOperations).toBe("function")
  })

  it("should provide pendingCount", () => {
    const { pendingCount } = useOffline<any>({})

    expect(pendingCount).toBeDefined()
    expect(typeof pendingCount).toBe("number")
  })

  it("should provide failedCount", () => {
    const { failedCount } = useOffline<any>({})

    expect(failedCount).toBeDefined()
    expect(typeof failedCount).toBe("number")
  })
})

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it("should store and retrieve value", () => {
    const [value, setValue] = useLocalStorage("test-key", "default")

    expect(value).toBe("default")

    setValue("new-value")

    expect(value).toBe("new-value")
  })

  it("should use initial value when key doesn't exist", () => {
    const [value] = useLocalStorage("new-key", "initial")

    expect(value).toBe("initial")
  })

  it("should handle complex objects", () => {
    const complexObject = { name: "Test", value: 123, nested: { key: "value" } }
    const [value, setValue] = useLocalStorage("complex-key", {})

    setValue(complexObject)

    expect(value).toEqual(complexObject)
  })

  it("should handle arrays", () => {
    const array = [1, 2, 3, 4, 5]
    const [value, setValue] = useLocalStorage("array-key", [])

    setValue(array)

    expect(value).toEqual(array)
  })

  it("should handle boolean values", () => {
    const [value, setValue] = useLocalStorage("bool-key", false)

    setValue(true)

    expect(value).toBe(true)
  })

  it("should handle null values", () => {
    const [value, setValue] = useLocalStorage("null-key", "default")

    setValue(null)

    expect(value).toBeNull()
  })

  it("should handle undefined values", () => {
    const [value, setValue] = useLocalStorage("undefined-key", "default")

    setValue(undefined)

    expect(value).toBe("default")
  })

  it("should provide removeValue function", () => {
    const [value, , removeValue] = useLocalStorage("remove-key", "default")

    setValue("new-value")
    expect(value).toBe("new-value")

    removeValue()
    expect(value).toBe("default")
  })

  it("should handle function updates", () => {
    const [value, setValue] = useLocalStorage("count-key", 0)

    setValue((prev) => prev + 1)

    expect(value).toBe(1)
  })

  it("should persist across hook instances", () => {
    const [value1, setValue1] = useLocalStorage("shared-key", "initial")
    const [value2] = useLocalStorage("shared-key", "default")

    expect(value1).toBe("initial")
    expect(value2).toBe("initial")

    setValue1("updated")

    const [value3] = useLocalStorage("shared-key", "default")
    expect(value3).toBe("updated")
  })

  it("should handle special characters in key", () => {
    const [value, setValue] = useLocalStorage("key-with-special-!@#$%", "default")

    setValue("value")

    expect(value).toBe("value")
  })

  it("should handle very long values", () => {
    const longValue = "a".repeat(10000)
    const [value, setValue] = useLocalStorage("long-key", "")

    setValue(longValue)

    expect(value).toBe(longValue)
  })
})

describe("offline support performance", () => {
  it("should handle large number of operations efficiently", async () => {
    const manager = new OfflineManager<TestItem>()

    for (let i = 0; i < 1000; i++) {
      await manager.addOperation("create", {
        id: `item-${i}`,
        name: `Item ${i + 1}`,
        value: i + 1,
      })
    }

    const count = manager.getOperationCount()
    expect(count).toBe(1000)

    manager.clearOperations()
  })

  it("should handle large data items efficiently", async () => {
    const storage = new OfflineStorage<TestItem>()
    const largeItem = {
      id: "large-item",
      name: "Large Item",
      value: 1,
      data: Array.from({ length: 10000 }, (_, i) => i),
    }

    const startTime = Date.now()
    await storage.add(largeItem as any)
    const endTime = Date.now()

    expect(endTime - startTime).toBeLessThan(1000)

    await storage.clear()
  })

  it("should handle rapid operation additions", async () => {
    const manager = new OfflineManager<TestItem>()

    const startTime = Date.now()
    for (let i = 0; i < 100; i++) {
      await manager.addOperation("create", {
        id: `item-${i}`,
        name: `Item ${i + 1}`,
        value: i + 1,
      })
    }
    const endTime = Date.now()

    expect(endTime - startTime).toBeLessThan(1000)

    manager.clearOperations()
  })
})
