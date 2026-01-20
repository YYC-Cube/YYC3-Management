import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { ChunkedDataLoader } from "@/lib/utils/chunked-data-loader"

interface TestItem {
  id: number
  name: string
  value: number
}

describe("ChunkedDataLoader", () => {
  let loader: ChunkedDataLoader<TestItem>
  let testData: TestItem[]

  beforeEach(() => {
    loader = new ChunkedDataLoader<TestItem>({
      chunkSize: 10,
      preloadCount: 2,
      cacheSize: 5,
    })
    testData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: i + 1,
    }))
  })

  afterEach(() => {
    loader.cleanupCache()
  })

  describe("initialization", () => {
    it("should initialize with default options", () => {
      const defaultLoader = new ChunkedDataLoader<TestItem>()

      expect(defaultLoader).toBeDefined()
    })

    it("should initialize with custom options", () => {
      const customLoader = new ChunkedDataLoader<TestItem>({
        chunkSize: 20,
        preloadCount: 3,
        cacheSize: 10,
      })

      expect(customLoader).toBeDefined()
    })

    it("should set chunk size correctly", () => {
      const chunkSize = 20
      const customLoader = new ChunkedDataLoader<TestItem>({ chunkSize })

      expect(customLoader).toBeDefined()
    })
  })

  describe("loadChunk", () => {
    it("should load a chunk successfully", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData.slice(0, 10))

      const result = await loader.loadChunk("chunk-0", loadFn)

      expect(result).toHaveLength(10)
      expect(result[0].id).toBe(1)
      expect(loadFn).toHaveBeenCalledWith(0, 10)
    })

    it("should cache loaded chunks", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData.slice(0, 10))

      await loader.loadChunk("chunk-0", loadFn)
      const chunk = loader.getChunk("chunk-0")

      expect(chunk).toBeDefined()
      expect(chunk!.loaded).toBe(true)
      expect(chunk!.data).toHaveLength(10)
    })

    it("should not reload cached chunks", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData.slice(0, 10))

      await loader.loadChunk("chunk-0", loadFn)
      await loader.loadChunk("chunk-0", loadFn)

      expect(loadFn).toHaveBeenCalledTimes(1)
    })

    it("should handle loading errors", async () => {
      const loadFn = vi.fn().mockRejectedValue(new Error("Network error"))

      await expect(loader.loadChunk("chunk-0", loadFn)).rejects.toThrow("Network error")
    })

    it("should handle empty chunks", async () => {
      const loadFn = vi.fn().mockResolvedValue([])

      const result = await loader.loadChunk("chunk-0", loadFn)

      expect(result).toHaveLength(0)
    })

    it("should handle concurrent chunk loading", async () => {
      const loadFn = vi.fn()
        .mockResolvedValueOnce(testData.slice(0, 10))
        .mockResolvedValueOnce(testData.slice(10, 20))
        .mockResolvedValueOnce(testData.slice(20, 30))

      const [chunk0, chunk1, chunk2] = await Promise.all([
        loader.loadChunk("chunk-0", loadFn),
        loader.loadChunk("chunk-1", loadFn),
        loader.loadChunk("chunk-2", loadFn),
      ])

      expect(chunk0).toHaveLength(10)
      expect(chunk1).toHaveLength(10)
      expect(chunk2).toHaveLength(10)
    })

    it("should handle large chunks", async () => {
      const largeChunkSize = 1000
      const largeLoader = new ChunkedDataLoader<TestItem>({ chunkSize: largeChunkSize })
      const largeData = Array.from({ length: largeChunkSize }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: i + 1,
      }))
      const loadFn = vi.fn().mockResolvedValue(largeData)

      const result = await largeLoader.loadChunk("chunk-0", loadFn)

      expect(result).toHaveLength(largeChunkSize)
      largeLoader.cleanupCache()
    })
  })

  describe("preloadChunks", () => {
    it("should preload multiple chunks", async () => {
      const loadFn = vi.fn()
        .mockResolvedValueOnce(testData.slice(0, 10))
        .mockResolvedValueOnce(testData.slice(10, 20))
        .mockResolvedValueOnce(testData.slice(20, 30))

      await loader.preloadChunks(0, loadFn)

      expect(loadFn).toHaveBeenCalledTimes(3)
      expect(loader.getChunk("chunk-0")!.loaded).toBe(true)
      expect(loader.getChunk("chunk-1")!.loaded).toBe(true)
      expect(loader.getChunk("chunk-2")!.loaded).toBe(true)
    })

    it("should preload chunks sequentially", async () => {
      const loadFn = vi.fn()
        .mockResolvedValueOnce(testData.slice(0, 10))
        .mockResolvedValueOnce(testData.slice(10, 20))
        .mockResolvedValueOnce(testData.slice(20, 30))

      await loader.preloadChunks(0, loadFn)

      const calls = loadFn.mock.calls
      expect(calls[0]).toEqual([0, 10])
      expect(calls[1]).toEqual([10, 10])
      expect(calls[2]).toEqual([20, 10])
    })

    it("should handle preload errors", async () => {
      const loadFn = vi.fn()
        .mockResolvedValueOnce(testData.slice(0, 10))
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce(testData.slice(20, 30))

      await loader.preloadChunks(0, loadFn)

      expect(loader.getChunk("chunk-0")!.loaded).toBe(true)
      expect(loader.getChunk("chunk-1")!.loaded).toBe(false)
      expect(loader.getChunk("chunk-2")!.loaded).toBe(true)
    })

    it("should preload with custom count", async () => {
      const customLoader = new ChunkedDataLoader<TestItem>({
        chunkSize: 10,
        preloadCount: 5,
      })
      const loadFn = vi.fn().mockResolvedValue([])

      await customLoader.preloadChunks(0, loadFn)

      expect(loadFn).toHaveBeenCalledTimes(5)
      customLoader.cleanupCache()
    })

    it("should handle preload count of zero", async () => {
      const customLoader = new ChunkedDataLoader<TestItem>({
        chunkSize: 10,
        preloadCount: 0,
      })
      const loadFn = vi.fn().mockResolvedValue([])

      await customLoader.preloadChunks(0, loadFn)

      expect(loadFn).toHaveBeenCalledTimes(0)
      customLoader.cleanupCache()
    })
  })

  describe("getChunk", () => {
    it("should return undefined for non-existent chunks", () => {
      const chunk = loader.getChunk("non-existent")

      expect(chunk).toBeUndefined()
    })

    it("should return loaded chunks", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData.slice(0, 10))

      await loader.loadChunk("chunk-0", loadFn)
      const chunk = loader.getChunk("chunk-0")

      expect(chunk).toBeDefined()
      expect(chunk!.id).toBe("chunk-0")
      expect(chunk!.loaded).toBe(true)
      expect(chunk!.data).toHaveLength(10)
    })

    it("should return loading chunks", async () => {
      const loadFn = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(testData.slice(0, 10)), 100))
      )

      const loadPromise = loader.loadChunk("chunk-0", loadFn)
      const chunk = loader.getChunk("chunk-0")

      expect(chunk).toBeDefined()
      expect(chunk!.loading).toBe(true)
      expect(chunk!.loaded).toBe(false)

      await loadPromise
    })
  })

  describe("cache management", () => {
    it("should cleanup old chunks", async () => {
      const customLoader = new ChunkedDataLoader<TestItem>({
        chunkSize: 10,
        cacheSize: 3,
      })
      const loadFn = vi.fn().mockResolvedValue(testData.slice(0, 10))

      await customLoader.loadChunk("chunk-0", loadFn)
      await customLoader.loadChunk("chunk-1", loadFn)
      await customLoader.loadChunk("chunk-2", loadFn)
      await customLoader.loadChunk("chunk-3", loadFn)

      customLoader.cleanupCache()

      expect(customLoader.getChunk("chunk-0")).toBeUndefined()
      expect(customLoader.getChunk("chunk-1")).toBeDefined()
      expect(customLoader.getChunk("chunk-2")).toBeDefined()
      expect(customLoader.getChunk("chunk-3")).toBeDefined()

      customLoader.cleanupCache()
    })

    it("should clear all chunks", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData.slice(0, 10))

      await loader.loadChunk("chunk-0", loadFn)
      await loader.loadChunk("chunk-1", loadFn)

      loader.clear()

      expect(loader.getChunk("chunk-0")).toBeUndefined()
      expect(loader.getChunk("chunk-1")).toBeUndefined()
    })

    it("should respect cache size limit", async () => {
      const customLoader = new ChunkedDataLoader<TestItem>({
        chunkSize: 10,
        cacheSize: 2,
      })
      const loadFn = vi.fn().mockResolvedValue(testData.slice(0, 10))

      await customLoader.loadChunk("chunk-0", loadFn)
      await customLoader.loadChunk("chunk-1", loadFn)
      await customLoader.loadChunk("chunk-2", loadFn)

      customLoader.cleanupCache()

      const chunks = customLoader.getAllChunks()
      expect(chunks.length).toBeLessThanOrEqual(2)

      customLoader.cleanupCache()
    })
  })

  describe("getAllChunks", () => {
    it("should return all loaded chunks", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData.slice(0, 10))

      await loader.loadChunk("chunk-0", loadFn)
      await loader.loadChunk("chunk-1", loadFn)
      await loader.loadChunk("chunk-2", loadFn)

      const chunks = loader.getAllChunks()

      expect(chunks).toHaveLength(3)
    })

    it("should return empty array when no chunks loaded", () => {
      const chunks = loader.getAllChunks()

      expect(chunks).toHaveLength(0)
    })
  })

  describe("getLoadedChunks", () => {
    it("should return only loaded chunks", async () => {
      const loadFn = vi.fn()
        .mockResolvedValueOnce(testData.slice(0, 10))
        .mockRejectedValueOnce(new Error("Error"))
        .mockResolvedValueOnce(testData.slice(20, 30))

      await loader.loadChunk("chunk-0", loadFn)
      await loader.loadChunk("chunk-1", loadFn).catch(() => {})
      await loader.loadChunk("chunk-2", loadFn)

      const loadedChunks = loader.getLoadedChunks()

      expect(loadedChunks).toHaveLength(2)
      expect(loadedChunks.every((chunk) => chunk.loaded)).toBe(true)
    })
  })

  describe("getLoadingChunks", () => {
    it("should return only loading chunks", async () => {
      const loadFn = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(testData.slice(0, 10)), 100))
      )

      loader.loadChunk("chunk-0", loadFn)
      loader.loadChunk("chunk-1", loadFn)

      const loadingChunks = loader.getLoadingChunks()

      expect(loadingChunks).toHaveLength(2)
      expect(loadingChunks.every((chunk) => chunk.loading)).toBe(true)
    })
  })

  describe("getChunkIndex", () => {
    it("should extract chunk index from chunk ID", () => {
      const index = loader.getChunkIndex("chunk-5")

      expect(index).toBe(5)
    })

    it("should handle chunk IDs without prefix", () => {
      const index = loader.getChunkIndex("5")

      expect(index).toBe(5)
    })

    it("should handle chunk IDs with custom prefix", () => {
      const index = loader.getChunkIndex("custom-10")

      expect(index).toBe(10)
    })
  })

  describe("performance", () => {
    it("should handle large number of chunks efficiently", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData.slice(0, 10))

      const promises = []
      for (let i = 0; i < 100; i++) {
        promises.push(loader.loadChunk(`chunk-${i}`, loadFn))
      }

      await Promise.all(promises)

      const chunks = loader.getAllChunks()
      expect(chunks).toHaveLength(100)
    })

    it("should not block on chunk loading", async () => {
      const loadFn = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(testData.slice(0, 10)), 100))
      )

      const startTime = Date.now()
      loader.loadChunk("chunk-0", loadFn)
      const endTime = Date.now()

      expect(endTime - startTime).toBeLessThan(50)
    })

    it("should reuse cached chunks efficiently", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData.slice(0, 10))

      await loader.loadChunk("chunk-0", loadFn)
      await loader.loadChunk("chunk-0", loadFn)
      await loader.loadChunk("chunk-0", loadFn)

      expect(loadFn).toHaveBeenCalledTimes(1)
    })
  })

  describe("edge cases", () => {
    it("should handle chunk ID with special characters", async () => {
      const loadFn = vi.fn().mockResolvedValue(testData.slice(0, 10))

      await loader.loadChunk("chunk-0-1-2", loadFn)

      const chunk = loader.getChunk("chunk-0-1-2")
      expect(chunk).toBeDefined()
    })

    it("should handle chunk size of 1", async () => {
      const customLoader = new ChunkedDataLoader<TestItem>({ chunkSize: 1 })
      const loadFn = vi.fn().mockResolvedValue([testData[0]])

      const result = await customLoader.loadChunk("chunk-0", loadFn)

      expect(result).toHaveLength(1)
      customLoader.cleanupCache()
    })

    it("should handle very large chunk size", async () => {
      const largeChunkSize = 10000
      const customLoader = new ChunkedDataLoader<TestItem>({ chunkSize: largeChunkSize })
      const largeData = Array.from({ length: largeChunkSize }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: i + 1,
      }))
      const loadFn = vi.fn().mockResolvedValue(largeData)

      const result = await customLoader.loadChunk("chunk-0", loadFn)

      expect(result).toHaveLength(largeChunkSize)
      customLoader.cleanupCache()
    })

    it("should handle empty load function result", async () => {
      const loadFn = vi.fn().mockResolvedValue([])

      const result = await loader.loadChunk("chunk-0", loadFn)

      expect(result).toHaveLength(0)
    })

    it("should handle null load function result", async () => {
      const loadFn = vi.fn().mockResolvedValue(null as any)

      const result = await loader.loadChunk("chunk-0", loadFn)

      expect(result).toBeNull()
    })
  })
})
