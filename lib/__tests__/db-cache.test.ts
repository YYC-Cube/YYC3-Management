/**
 * @fileoverview 数据库缓存层单元测试 — withCache、buildCacheKey、cache invalidation
 * @author YYC³ @version 3.1.0 @license MIT
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Redis
const mockGet = vi.fn()
const mockSet = vi.fn()
const mockDelPattern = vi.fn()

vi.mock('@/lib/db/redis', () => ({
  getCache: (...args: unknown[]) => mockGet(...args),
  setCache: (...args: unknown[]) => mockSet(...args),
  deleteCachePattern: (...args: unknown[]) => mockDelPattern(...args),
}))

const cache = await import('../db/cache')

describe('DB Cache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // === buildCacheKey ===

  describe('buildCacheKey', () => {
    it('无参数时返回 all 后缀', () => {
      expect(cache.buildCacheKey('users')).toBe('cache:users:all')
    })

    it('有参数时按排序拼接', () => {
      const key = cache.buildCacheKey('users', { page: 1, limit: 10 })
      expect(key).toContain('cache:users:')
      expect(key).toContain('limit=10')
      expect(key).toContain('page=1')
    })

    it('应过滤 undefined 和空字符串参数', () => {
      const key = cache.buildCacheKey('users', { page: 1, search: undefined, sort: '' })
      expect(key).not.toContain('search')
      expect(key).not.toContain('sort')
      expect(key).toContain('page=1')
    })

    it('全部参数为 undefined 时返回 all', () => {
      const key = cache.buildCacheKey('users', { search: undefined })
      expect(key).toBe('cache:users:all')
    })
  })

  // === withCache ===

  describe('withCache', () => {
    it('缓存命中时直接返回缓存数据', async () => {
      const cachedData = { id: 1, name: 'cached' }
      mockGet.mockResolvedValueOnce(cachedData)

      const fetcher = vi.fn().mockResolvedValue({ id: 2, name: 'fresh' })
      const result = await cache.withCache('test:key', fetcher)

      expect(result).toEqual(cachedData)
      expect(fetcher).not.toHaveBeenCalled()
    })

    it('缓存未命中时调用 fetcher 并缓存结果', async () => {
      mockGet.mockResolvedValueOnce(null)
      const freshData = { id: 1, name: 'fresh' }
      const fetcher = vi.fn().mockResolvedValue(freshData)

      const result = await cache.withCache('test:key', fetcher, 60)

      expect(result).toEqual(freshData)
      expect(fetcher).toHaveBeenCalledTimes(1)
      expect(mockSet).toHaveBeenCalledWith('test:key', freshData, 60)
    })

    it('fetcher 抛出错误时应向上传播', async () => {
      mockGet.mockResolvedValueOnce(null)
      const fetcher = vi.fn().mockRejectedValue(new Error('DB error'))

      await expect(cache.withCache('test:key', fetcher)).rejects.toThrow('DB error')
      expect(mockSet).not.toHaveBeenCalled()
    })

    it('默认 TTL 为 300 秒', async () => {
      mockGet.mockResolvedValueOnce(null)
      const fetcher = vi.fn().mockResolvedValue('data')

      await cache.withCache('test:key', fetcher)
      expect(mockSet).toHaveBeenCalledWith('test:key', 'data', 300)
    })
  })

  // === invalidateResourceCache ===

  describe('invalidateResourceCache', () => {
    it('应调用 deleteCachePattern 清除缓存', async () => {
      mockDelPattern.mockResolvedValueOnce(undefined)

      await cache.invalidateResourceCache('users')

      expect(mockDelPattern).toHaveBeenCalledWith('cache:users:*')
    })
  })
})