import { getCache, setCache, deleteCachePattern } from '@/lib/db/redis'

export async function withCache<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  const cached = await getCache<T>(cacheKey)
  if (cached) return cached

  const fresh = await fetcher()
  await setCache(cacheKey, fresh, ttl)
  return fresh
}

export async function invalidateResourceCache(resource: string): Promise<void> {
  await deleteCachePattern(`cache:${resource}:*`)
}

export function buildCacheKey(resource: string, params?: Record<string, string | number | undefined>): string {
  if (!params) return `cache:${resource}:all`
  const sorted = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .sort(([, a], [, b]) => String(a).localeCompare(String(b)))
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  return `cache:${resource}:${sorted || 'all'}`
}
