"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface PreloadConfig {
  enabled?: boolean
  prefetchCount?: number
  prefetchDelay?: number
  cacheKey?: string
  cacheTTL?: number
}

interface PreloadState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  timestamp: number
}

export class DataPreloader<T> {
  private cache: Map<string, PreloadState<T>> = new Map()
  private prefetchQueue: Set<string> = new Set()
  private prefetchTimers: Map<string, NodeJS.Timeout> = new Map()

  constructor(private config: PreloadConfig = {}) {
    this.config = {
      enabled: true,
      prefetchCount: 3,
      prefetchDelay: 100,
      cacheTTL: 60000,
      ...config,
    }
  }

  async preload(
    key: string,
    loadFn: () => Promise<T>,
    immediate = false
  ): Promise<T | null> {
    if (!this.config.enabled) {
      return null
    }

    const cached = this.getFromCache(key)
    if (cached) {
      return cached
    }

    if (this.prefetchQueue.has(key)) {
      return null
    }

    this.prefetchQueue.add(key)

    if (!immediate && this.config.prefetchDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.config.prefetchDelay))
    }

    try {
      const data = await loadFn()
      this.setCache(key, data)
      return data
    } catch (error) {
      console.error(`Failed to preload data for key: ${key}`, error)
      return null
    } finally {
      this.prefetchQueue.delete(key)
    }
  }

  async prefetchMultiple(
    keys: string[],
    loadFn: (key: string) => Promise<T>,
    immediate = false
  ): Promise<void> {
    if (!this.config.enabled) {
      return
    }

    const keysToLoad = keys.slice(0, this.config.prefetchCount)

    await Promise.all(
      keysToLoad.map((key) => this.preload(key, () => loadFn(key), immediate))
    )
  }

  prefetchWithDelay(
    key: string,
    loadFn: () => Promise<T>,
    delay: number
  ): void {
    if (this.prefetchTimers.has(key)) {
      return
    }

    const timer = setTimeout(() => {
      this.preload(key, loadFn)
      this.prefetchTimers.delete(key)
    }, delay)

    this.prefetchTimers.set(key, timer)
  }

  cancelPrefetch(key: string): void {
    const timer = this.prefetchTimers.get(key)
    if (timer) {
      clearTimeout(timer)
      this.prefetchTimers.delete(key)
    }
    this.prefetchQueue.delete(key)
  }

  cancelAllPrefetches(): void {
    this.prefetchTimers.forEach((timer) => clearTimeout(timer))
    this.prefetchTimers.clear()
    this.prefetchQueue.clear()
  }

  private getFromCache(key: string): T | null {
    const state = this.cache.get(key)
    if (!state) {
      return null
    }

    if (Date.now() - state.timestamp > this.config.cacheTTL!) {
      this.cache.delete(key)
      return null
    }

    return state.data
  }

  private setCache(key: string, data: T): void {
    this.cache.set(key, {
      data,
      loading: false,
      error: null,
      timestamp: Date.now(),
    })
  }

  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }

  getCacheSize(): number {
    return this.cache.size
  }

  cleanup(): void {
    this.cancelAllPrefetches()
    this.clearCache()
  }
}

export interface UsePreloadDataOptions<T> {
  loadFn: () => Promise<T>
  preloadKeys?: string[]
  preloadFn?: (key: string) => Promise<T>
  config?: PreloadConfig
  immediate?: boolean
}

export function usePreloadData<T>(options: UsePreloadDataOptions<T>) {
  const {
    loadFn,
    preloadKeys = [],
    preloadFn,
    config = {},
    immediate = false,
  } = options

  const [state, setState] = useState<PreloadState<T>>({
    data: null,
    loading: false,
    error: null,
    timestamp: 0,
  })

  const preloaderRef = useRef<DataPreloader<T> | null>(null)

  useEffect(() => {
    preloaderRef.current = new DataPreloader<T>(config)

    return () => {
      preloaderRef.current?.cleanup()
    }
  }, [])

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const data = await loadFn()
      setState({
        data,
        loading: false,
        error: null,
        timestamp: Date.now(),
      })
      return data
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Failed to load data")
      setState((prev) => ({ ...prev, loading: false, error: err }))
      throw err
    }
  }, [loadFn])

  const preload = useCallback(
    async (key: string) => {
      if (!preloaderRef.current || !preloadFn) {
        return null
      }

      return preloaderRef.current.preload(key, () => preloadFn(key))
    },
    [preloadFn]
  )

  const prefetch = useCallback(async () => {
    if (!preloaderRef.current || !preloadFn) {
      return
    }

    await preloaderRef.current.prefetchMultiple(preloadKeys, preloadFn)
  }, [preloadKeys, preloadFn])

  const invalidate = useCallback(() => {
    preloaderRef.current?.clearCache()
  }, [])

  useEffect(() => {
    if (immediate) {
      load()
    }
  }, [immediate, load])

  useEffect(() => {
    if (preloadKeys.length > 0 && preloadFn) {
      prefetch()
    }
  }, [preloadKeys, preloadFn, prefetch])

  return {
    ...state,
    load,
    preload,
    prefetch,
    invalidate,
    cacheSize: preloaderRef.current?.getCacheSize() || 0,
  }
}

export interface PredictivePreloadOptions {
  enabled?: boolean
  threshold?: number
  historySize?: number
}

export class PredictivePreloader<T> {
  private accessHistory: string[] = []
  private accessFrequency: Map<string, number> = new Map()
  private preloader: DataPreloader<T>
  private config: PredictivePreloadOptions

  constructor(
    preloader: DataPreloader<T>,
    config: PredictivePreloadOptions = {}
  ) {
    this.preloader = preloader
    this.config = {
      enabled: true,
      threshold: 3,
      historySize: 100,
      ...config,
    }
  }

  recordAccess(key: string): void {
    if (!this.config.enabled) {
      return
    }

    this.accessHistory.push(key)
    if (this.accessHistory.length > this.config.historySize!) {
      this.accessHistory.shift()
    }

    const frequency = this.accessFrequency.get(key) || 0
    this.accessFrequency.set(key, frequency + 1)
  }

  predictNextKeys(currentKey: string): string[] {
    if (!this.config.enabled) {
      return []
    }

    const predictions: Array<{ key: string; score: number }> = []

    this.accessFrequency.forEach((frequency, key) => {
      if (key === currentKey) {
        return
      }

      const score = this.calculateScore(key, currentKey, frequency)
      if (score >= this.config.threshold!) {
        predictions.push({ key, score })
      }
    })

    return predictions
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((p) => p.key)
  }

  private calculateScore(key: string, currentKey: string, frequency: number): number {
    let score = frequency

    const currentIndex = this.accessHistory.lastIndexOf(currentKey)
    if (currentIndex === -1) {
      return score
    }

    const recentAccesses = this.accessHistory.slice(Math.max(0, currentIndex - 10), currentIndex)
    const keyAccesses = recentAccesses.filter((k) => k === key).length

    score += keyAccesses * 2

    return score
  }

  async prefetchPredicted(
    currentKey: string,
    loadFn: (key: string) => Promise<T>
  ): Promise<void> {
    if (!this.config.enabled) {
      return
    }

    const predictedKeys = this.predictNextKeys(currentKey)
    await this.preloader.prefetchMultiple(predictedKeys, loadFn)
  }

  clearHistory(): void {
    this.accessHistory = []
    this.accessFrequency.clear()
  }
}
