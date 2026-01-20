"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface DataChunk<T> {
  id: string
  data: T[]
  index: number
  loaded: boolean
  loading: boolean
}

interface ChunkedDataLoaderOptions {
  chunkSize?: number
  preloadCount?: number
  cacheSize?: number
}

export class ChunkedDataLoader<T> {
  private chunks: Map<string, DataChunk<T>> = new Map()
  private chunkSize: number
  private preloadCount: number
  private cacheSize: number
  private loadQueue: Set<string> = new Set()
  private loadingPromises: Map<string, Promise<void>> = new Map()

  constructor(options: ChunkedDataLoaderOptions = {}) {
    this.chunkSize = options.chunkSize || 20
    this.preloadCount = options.preloadCount || 2
    this.cacheSize = options.cacheSize || 5
  }

  getChunkId(index: number): string {
    return `chunk-${Math.floor(index / this.chunkSize)}`
  }

  getChunkIndex(chunkId: string): number {
    const match = chunkId.match(/chunk-(\d+)/)
    return match ? parseInt(match[1], 10) : 0
  }

  async loadChunk(
    chunkId: string,
    loadFn: (offset: number, limit: number) => Promise<T[]>
  ): Promise<T[]> {
    if (this.chunks.has(chunkId) && this.chunks.get(chunkId)!.loaded) {
      return this.chunks.get(chunkId)!.data
    }

    if (this.loadingPromises.has(chunkId)) {
      return this.loadingPromises.get(chunkId)!.then(() => this.chunks.get(chunkId)!.data)
    }

    const chunkIndex = this.getChunkIndex(chunkId)
    const offset = chunkIndex * this.chunkSize

    const promise = loadFn(offset, this.chunkSize).then((data) => {
      const chunk: DataChunk<T> = {
        id: chunkId,
        data,
        index: chunkIndex,
        loaded: true,
        loading: false,
      }
      this.chunks.set(chunkId, chunk)
      this.loadQueue.delete(chunkId)
      this.loadingPromises.delete(chunkId)
      this.cleanupCache()
      return data
    })

    this.loadingPromises.set(chunkId, promise)
    this.chunks.set(chunkId, {
      id: chunkId,
      data: [],
      index: chunkIndex,
      loaded: false,
      loading: true,
    })

    return promise
  }

  async preloadChunks(
    startIndex: number,
    loadFn: (offset: number, limit: number) => Promise<T[]>
  ): Promise<void> {
    const startChunkIndex = Math.floor(startIndex / this.chunkSize)
    const promises: Promise<T[]>[] = []

    for (let i = startChunkIndex; i < startChunkIndex + this.preloadCount; i++) {
      const chunkId = this.getChunkId(i * this.chunkSize)
      if (!this.chunks.has(chunkId) || !this.chunks.get(chunkId)!.loaded) {
        promises.push(this.loadChunk(chunkId, loadFn))
      }
    }

    await Promise.all(promises)
  }

  getChunk(chunkId: string): DataChunk<T> | undefined {
    return this.chunks.get(chunkId)
  }

  getChunksInRange(startIndex: number, endIndex: number): DataChunk<T>[] {
    const chunks: DataChunk<T>[] = []
    const startChunkIndex = Math.floor(startIndex / this.chunkSize)
    const endChunkIndex = Math.floor(endIndex / this.chunkSize)

    for (let i = startChunkIndex; i <= endChunkIndex; i++) {
      const chunkId = this.getChunkId(i * this.chunkSize)
      const chunk = this.chunks.get(chunkId)
      if (chunk) {
        chunks.push(chunk)
      }
    }

    return chunks
  }

  cleanupCache(): void {
    if (this.chunks.size <= this.cacheSize) {
      return
    }

    const sortedChunks = Array.from(this.chunks.values())
      .sort((a, b) => b.index - a.index)
      .slice(this.cacheSize)

    sortedChunks.forEach((chunk) => {
      this.chunks.delete(chunk.id)
    })
  }

  clearCache(): void {
    this.chunks.clear()
    this.loadQueue.clear()
    this.loadingPromises.clear()
  }

  getCacheSize(): number {
    return this.chunks.size
  }
}

export interface UseChunkedDataOptions<T> {
  chunkSize?: number
  preloadCount?: number
  cacheSize?: number
  loadFn: (offset: number, limit: number) => Promise<T[]>
  initialLoad?: boolean
}

export function useChunkedData<T>(options: UseChunkedDataOptions<T>) {
  const {
    chunkSize = 20,
    preloadCount = 2,
    cacheSize = 5,
    loadFn,
    initialLoad = true,
  } = options

  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<ChunkedDataLoader<T> | null>(null)

  useEffect(() => {
    loaderRef.current = new ChunkedDataLoader<T>({ chunkSize, preloadCount, cacheSize })

    if (initialLoad) {
      loadMore()
    }

    return () => {
      loaderRef.current?.clearCache()
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (!loaderRef.current || loading || !hasMore) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const offset = data.length
      const newData = await loadFn(offset, chunkSize)

      if (newData.length < chunkSize) {
        setHasMore(false)
      }

      setData((prev) => [...prev, ...newData])
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load data"))
    } finally {
      setLoading(false)
    }
  }, [data.length, loading, hasMore, loadFn, chunkSize])

  const loadRange = useCallback(
    async (startIndex: number, endIndex: number) => {
      if (!loaderRef.current) {
        return
      }

      setLoading(true)
      setError(null)

      try {
        const chunks = loaderRef.current.getChunksInRange(startIndex, endIndex)
        const allLoaded = chunks.every((chunk) => chunk.loaded)

        if (!allLoaded) {
          await loaderRef.current.preloadChunks(startIndex, loadFn)
        }

        const loadedChunks = loaderRef.current.getChunksInRange(startIndex, endIndex)
        const rangeData = loadedChunks.flatMap((chunk) => chunk.data)
        setData((prev) => {
          const newData = [...prev]
          rangeData.forEach((item, index) => {
            newData[startIndex + index] = item
          })
          return newData
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load data range"))
      } finally {
        setLoading(false)
      }
    },
    [loadFn]
  )

  const refresh = useCallback(() => {
    setData([])
    setHasMore(true)
    setError(null)
    loaderRef.current?.clearCache()
  }, [])

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    loadRange,
    refresh,
    cacheSize: loaderRef.current?.getCacheSize() || 0,
  }
}

export interface RenderCacheOptions {
  maxSize?: number
  ttl?: number
}

export class RenderCache<T> {
  private cache: Map<string, { data: T; timestamp: number }> = new Map()
  private maxSize: number
  private ttl: number

  constructor(options: RenderCacheOptions = {}) {
    this.maxSize = options.maxSize || 100
    this.ttl = options.ttl || 60000
  }

  set(key: string, data: T): void {
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTimestamp = Infinity

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp
        oldestKey = key
      }
    })

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > this.ttl) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach((key) => this.cache.delete(key))
  }

  size(): number {
    return this.cache.size
  }
}
