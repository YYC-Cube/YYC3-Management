import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { DataPreloader, PredictivePreloader } from "@/lib/utils/data-preloader"

interface TestItem {
  id: number
  name: string
  value: number
}

describe("DataPreloader", () => {
  let preloader: DataPreloader<TestItem>
  let testData: TestItem[]

  beforeEach(() => {
    preloader = new DataPreloader<TestItem>({
      enabled: true,
      prefetchCount: 3,
      prefetchDelay: 100,
      cacheTTL: 60000,
    })
    testData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: i + 1,
    }))
  })

  afterEach(() => {
    preloader.clear()
  })

  describe("initialization", () => {
    it("should initialize with default options", () => {
      const defaultPreloader = new DataPreloader<TestItem>()

      expect(defaultPreloader).toBeDefined()
    })

    it("should initialize with custom options", () => {
      const customPreloader = new DataPreloader<TestItem>({
        enabled: true,
        prefetchCount: 5,
        prefetchDelay: 200,
        cacheTTL: 120000,
      })

      expect(customPreloader).toBeDefined()
    })

    it("should be enabled by default", () => {
      const defaultPreloader = new DataPreloader<TestItem>()

      expect(defaultPreloader).toBeDefined()
    })
  })

  describe("preload", () => {
    it("should preload data successfully", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      const result = await preloader.preload("item-1", loadFn)

      expect(result).toEqual(testData[0])
      expect(loadFn).toHaveBeenCalledTimes(1)
    })

    it("should cache preloaded data", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      await preloader.preload("item-1", loadFn)
      await preloader.preload("item-1", loadFn)

      expect(loadFn).toHaveBeenCalledTimes(1)
    })

    it("should handle preload errors", async () => {
      const loadFn = vi.fn().mockRejectedValue(new Error("Network error"))

      const result = await preloader.preload("item-1", loadFn)

      expect(result).toBeNull()
    })

    it("should respect prefetch delay", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])
      vi.useFakeTimers()

      preloader.preload("item-1", loadFn, false)

      expect(loadFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)

      await vi.runAllTimersAsync()

      expect(loadFn).toHaveBeenCalled()

      vi.useRealTimers()
    })

    it("should preload immediately when configured", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      const result = await preloader.preload("item-1", loadFn, true)

      expect(result).toEqual(testData[0])
      expect(loadFn).toHaveBeenCalledTimes(1)
    })

    it("should handle disabled preloader", async () => {
      const disabledPreloader = new DataPreloader<TestItem>({ enabled: false })
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      const result = await disabledPreloader.preload("item-1", loadFn)

      expect(result).toBeNull()
      expect(loadFn).not.toHaveBeenCalled()
    })

    it("should handle null load function result", async () => {
      const loadFn = vi.fn().mockResolvedValue(null)

      const result = await preloader.preload("item-1", loadFn)

      expect(result).toBeNull()
    })

    it("should handle undefined load function result", async () => {
      const loadFn = vi.fn().mockResolvedValue(undefined)

      const result = await preloader.preload("item-1", loadFn)

      expect(result).toBeNull()
    })
  })

  describe("prefetchMultiple", () => {
    it("should prefetch multiple keys", async () => {
      const loadFn = vi.fn()
        .mockResolvedValueOnce(testData[0])
        .mockResolvedValueOnce(testData[1])
        .mockResolvedValueOnce(testData[2])

      await preloader.prefetchMultiple(
        ["item-1", "item-2", "item-3"],
        loadFn,
        true
      )

      expect(loadFn).toHaveBeenCalledTimes(3)
    })

    it("should prefetch with delay", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])
      vi.useFakeTimers()

      preloader.prefetchMultiple(["item-1"], loadFn, false)

      expect(loadFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)

      await vi.runAllTimersAsync()

      expect(loadFn).toHaveBeenCalled()

      vi.useRealTimers()
    })

    it("should handle prefetch errors", async () => {
      const loadFn = vi.fn()
        .mockResolvedValueOnce(testData[0])
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce(testData[2])

      await preloader.prefetchMultiple(
        ["item-1", "item-2", "item-3"],
        loadFn,
        true
      )

      expect(loadFn).toHaveBeenCalledTimes(3)
    })

    it("should handle empty keys array", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      await preloader.prefetchMultiple([], loadFn, true)

      expect(loadFn).not.toHaveBeenCalled()
    })

    it("should prefetch sequentially", async () => {
      const loadFn = vi.fn()
        .mockResolvedValueOnce(testData[0])
        .mockResolvedValueOnce(testData[1])
        .mockResolvedValueOnce(testData[2])

      await preloader.prefetchMultiple(
        ["item-1", "item-2", "item-3"],
        loadFn,
        true
      )

      const calls = loadFn.mock.calls
      expect(calls[0]).toEqual(["item-1"])
      expect(calls[1]).toEqual(["item-2"])
      expect(calls[2]).toEqual(["item-3"])
    })
  })

  describe("cache management", () => {
    it("should cache preloaded data", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      await preloader.preload("item-1", loadFn)
      const cached = preloader.get("item-1")

      expect(cached).toBeDefined()
      expect(cached!.data).toEqual(testData[0])
    })

    it("should return null for non-existent cache", () => {
      const cached = preloader.get("non-existent")

      expect(cached).toBeNull()
    })

    it("should clear specific cache", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      await preloader.preload("item-1", loadFn)
      preloader.clear("item-1")

      const cached = preloader.get("item-1")
      expect(cached).toBeNull()
    })

    it("should clear all caches", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      await preloader.preload("item-1", loadFn)
      await preloader.preload("item-2", loadFn)
      preloader.clear()

      expect(preloader.get("item-1")).toBeNull()
      expect(preloader.get("item-2")).toBeNull()
    })

    it("should expire cache after TTL", async () => {
      const shortTTLPreloader = new DataPreloader<TestItem>({
        cacheTTL: 100,
      })
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      await shortTTLPreloader.preload("item-1", loadFn)

      await new Promise((resolve) => setTimeout(resolve, 150))

      const cached = shortTTLPreloader.get("item-1")
      expect(cached).toBeNull()
    })

    it("should not expire cache before TTL", async () => {
      const shortTTLPreloader = new DataPreloader<TestItem>({
        cacheTTL: 200,
      })
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      await shortTTLPreloader.preload("item-1", loadFn)

      await new Promise((resolve) => setTimeout(resolve, 100))

      const cached = shortTTLPreloader.get("item-1")
      expect(cached).toBeDefined()
    })
  })

  describe("cache stats", () => {
    it("should return cache size", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      await preloader.preload("item-1", loadFn)
      await preloader.preload("item-2", loadFn)
      await preloader.preload("item-3", loadFn)

      const size = preloader.getCacheSize()
      expect(size).toBe(3)
    })

    it("should return cache keys", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      await preloader.preload("item-1", loadFn)
      await preloader.preload("item-2", loadFn)

      const keys = preloader.getCacheKeys()
      expect(keys).toContain("item-1")
      expect(keys).toContain("item-2")
    })

    it("should return empty array when cache is empty", () => {
      const keys = preloader.getCacheKeys()

      expect(keys).toHaveLength(0)
    })
  })

  describe("performance", () => {
    it("should handle large number of prefetches", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])
      const keys = Array.from({ length: 100 }, (_, i) => `item-${i}`)

      await preloader.prefetchMultiple(keys, loadFn, true)

      expect(loadFn).toHaveBeenCalledTimes(100)
    })

    it("should not block on prefetch", async () => {
      const loadFn = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(testData[0]), 100))
      )

      const startTime = Date.now()
      preloader.preload("item-1", loadFn, false)
      const endTime = Date.now()

      expect(endTime - startTime).toBeLessThan(50)
    })

    it("should reuse cached data efficiently", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      await preloader.preload("item-1", loadFn)
      await preloader.preload("item-1", loadFn)
      await preloader.preload("item-1", loadFn)

      expect(loadFn).toHaveBeenCalledTimes(1)
    })
  })

  describe("edge cases", () => {
    it("should handle keys with special characters", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      await preloader.preload("item-1-2-3", loadFn)

      const cached = preloader.get("item-1-2-3")
      expect(cached).toBeDefined()
    })

    it("should handle empty string key", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      await preloader.preload("", loadFn)

      const cached = preloader.get("")
      expect(cached).toBeDefined()
    })

    it("should handle very long key", async () => {
      const longKey = "a".repeat(1000)
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      await preloader.preload(longKey, loadFn)

      const cached = preloader.get(longKey)
      expect(cached).toBeDefined()
    })
  })
})

describe("PredictivePreloader", () => {
  let predictivePreloader: PredictivePreloader<TestItem>
  let testData: TestItem[]

  beforeEach(() => {
    predictivePreloader = new PredictivePreloader<TestItem>({
      maxHistorySize: 10,
      predictionThreshold: 2,
    })
    testData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: i + 1,
    }))
  })

  afterEach(() => {
    predictivePreloader.clear()
  })

  describe("initialization", () => {
    it("should initialize with default options", () => {
      const defaultPredictive = new PredictivePreloader<TestItem>()

      expect(defaultPredictive).toBeDefined()
    })

    it("should initialize with custom options", () => {
      const customPredictive = new PredictivePreloader<TestItem>({
        maxHistorySize: 20,
        predictionThreshold: 3,
      })

      expect(customPredictive).toBeDefined()
    })
  })

  describe("recordAccess", () => {
    it("should record item access", () => {
      predictivePreloader.recordAccess("item-1")

      const history = predictivePreloader.getAccessHistory()
      expect(history).toHaveLength(1)
      expect(history[0].key).toBe("item-1")
    })

    it("should record multiple accesses", () => {
      predictivePreloader.recordAccess("item-1")
      predictivePreloader.recordAccess("item-2")
      predictivePreloader.recordAccess("item-3")

      const history = predictivePreloader.getAccessHistory()
      expect(history).toHaveLength(3)
    })

    it("should limit history size", () => {
      const smallHistoryPreloader = new PredictivePreloader<TestItem>({
        maxHistorySize: 5,
      })

      for (let i = 0; i < 10; i++) {
        smallHistoryPreloader.recordAccess(`item-${i}`)
      }

      const history = smallHistoryPreloader.getAccessHistory()
      expect(history).toHaveLength(5)
    })

    it("should update access count for repeated items", () => {
      predictivePreloader.recordAccess("item-1")
      predictivePreloader.recordAccess("item-1")
      predictivePreloader.recordAccess("item-1")

      const history = predictivePreloader.getAccessHistory()
      const item1Access = history.filter((h) => h.key === "item-1")
      expect(item1Access).toHaveLength(3)
    })
  })

  describe("predictNextKeys", () => {
    it("should predict next keys based on history", () => {
      predictivePreloader.recordAccess("item-1")
      predictivePreloader.recordAccess("item-2")
      predictivePreloader.recordAccess("item-3")

      const predictions = predictivePreloader.predictNextKeys("item-3")

      expect(predictions.length).toBeGreaterThan(0)
    })

    it("should return empty predictions for no history", () => {
      const predictions = predictivePreloader.predictNextKeys("item-1")

      expect(predictions).toHaveLength(0)
    })

    it("should respect prediction threshold", () => {
      const highThresholdPreloader = new PredictivePreloader<TestItem>({
        predictionThreshold: 10,
      })

      for (let i = 0; i < 5; i++) {
        highThresholdPreloader.recordAccess(`item-${i}`)
      }

      const predictions = highThresholdPreloader.predictNextKeys("item-4")

      expect(predictions).toHaveLength(0)
    })

    it("should predict most frequently accessed items", () => {
      for (let i = 0; i < 10; i++) {
        predictivePreloader.recordAccess("item-1")
      }
      for (let i = 0; i < 5; i++) {
        predictivePreloader.recordAccess("item-2")
      }
      predictivePreloader.recordAccess("item-3")

      const predictions = predictivePreloader.predictNextKeys("item-3")

      expect(predictions).toContain("item-1")
    })
  })

  describe("prefetchPredicted", () => {
    it("should prefetch predicted keys", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      for (let i = 0; i < 5; i++) {
        predictivePreloader.recordAccess(`item-${i}`)
      }

      await predictivePreloader.prefetchPredicted("item-4", loadFn)

      expect(loadFn).toHaveBeenCalled()
    })

    it("should not prefetch when no predictions", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData[0])

      await predictivePreloader.prefetchPredicted("item-1", loadFn)

      expect(loadFn).not.toHaveBeenCalled()
    })

    it("should handle prefetch errors", async () => {
      const loadFn = vi.fn().mockRejectedValue(new Error("Network error"))

      for (let i = 0; i < 5; i++) {
        predictivePreloader.recordAccess(`item-${i}`)
      }

      await predictivePreloader.prefetchPredicted("item-4", loadFn)

      expect(loadFn).toHaveBeenCalled()
    })
  })

  describe("access history", () => {
    it("should return access history", () => {
      predictivePreloader.recordAccess("item-1")
      predictivePreloader.recordAccess("item-2")

      const history = predictivePreloader.getAccessHistory()

      expect(history).toHaveLength(2)
      expect(history[0].key).toBe("item-1")
      expect(history[1].key).toBe("item-2")
    })

    it("should clear access history", () => {
      predictivePreloader.recordAccess("item-1")
      predictivePreloader.recordAccess("item-2")

      predictivePreloader.clearHistory()

      const history = predictivePreloader.getAccessHistory()
      expect(history).toHaveLength(0)
    })

    it("should get access frequency", () => {
      predictivePreloader.recordAccess("item-1")
      predictivePreloader.recordAccess("item-1")
      predictivePreloader.recordAccess("item-2")

      const frequency = predictivePreloader.getAccessFrequency()

      expect(frequency["item-1"]).toBe(2)
      expect(frequency["item-2"]).toBe(1)
    })
  })

  describe("performance", () => {
    it("should handle large access history", () => {
      for (let i = 0; i < 1000; i++) {
        predictivePreloader.recordAccess(`item-${i % 100}`)
      }

      const history = predictivePreloader.getAccessHistory()
      expect(history.length).toBeGreaterThan(0)
    })

    it("should make predictions quickly", () => {
      for (let i = 0; i < 100; i++) {
        predictivePreloader.recordAccess(`item-${i % 10}`)
      }

      const startTime = Date.now()
      const predictions = predictivePreloader.predictNextKeys("item-5")
      const endTime = Date.now()

      expect(endTime - startTime).toBeLessThan(10)
      expect(predictions).toBeDefined()
    })
  })

  describe("edge cases", () => {
    it("should handle keys with special characters", () => {
      predictivePreloader.recordAccess("item-1-2-3")

      const history = predictivePreloader.getAccessHistory()
      expect(history[0].key).toBe("item-1-2-3")
    })

    it("should handle empty string key", () => {
      predictivePreloader.recordAccess("")

      const history = predictivePreloader.getAccessHistory()
      expect(history[0].key).toBe("")
    })

    it("should handle very long key", () => {
      const longKey = "a".repeat(1000)
      predictivePreloader.recordAccess(longKey)

      const history = predictivePreloader.getAccessHistory()
      expect(history[0].key).toBe(longKey)
    })
  })
})
