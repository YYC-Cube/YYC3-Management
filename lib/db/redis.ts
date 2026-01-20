import { createClient } from '@redis/client'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

const redisClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('Redis reconnection failed after 10 retries')
        return new Error('Redis reconnection failed')
      }
      const delay = Math.min(retries * 100, 3000)
      console.log(`Redis reconnecting in ${delay}ms...`)
      return delay
    },
  },
})

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err)
})

redisClient.on('connect', () => {
  console.log('Redis Client Connected')
})

redisClient.on('ready', () => {
  console.log('Redis Client Ready')
})

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect()
  }
  return redisClient
}

export async function disconnectRedis() {
  if (redisClient.isOpen) {
    await redisClient.quit()
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const client = await connectRedis()
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

export async function setCache(key: string, value: any, ttl: number = 3600): Promise<void> {
  try {
    const client = await connectRedis()
    await client.setEx(key, ttl, JSON.stringify(value))
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    const client = await connectRedis()
    await client.del(key)
  } catch (error) {
    console.error('Redis delete error:', error)
  }
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const client = await connectRedis()
    const keys = await client.keys(pattern)
    if (keys.length > 0) {
      await client.del(keys)
    }
  } catch (error) {
    console.error('Redis delete pattern error:', error)
  }
}

export default redisClient
