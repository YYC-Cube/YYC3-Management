import pool from './client'
import redisClient from './redis'

export async function checkAllConnections() {
  const results = {
    postgresql: false,
    redis: false,
  }

  try {
    const pgClient = await pool.connect()
    await pgClient.query('SELECT 1')
    pgClient.release()
    results.postgresql = true
    console.log('✓ PostgreSQL connection successful')
  } catch (error) {
    console.error('✗ PostgreSQL connection failed:', error)
  }

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect()
    }
    await redisClient.ping()
    results.redis = true
    console.log('✓ Redis connection successful')
  } catch (error) {
    console.error('✗ Redis connection failed:', error)
  }

  return results
}

export async function closeAllConnections() {
  try {
    await pool.end()
    console.log('✓ PostgreSQL connection closed')
  } catch (error) {
    console.error('✗ Failed to close PostgreSQL connection:', error)
  }

  try {
    if (redisClient.isOpen) {
      await redisClient.quit()
      console.log('✓ Redis connection closed')
    }
  } catch (error) {
    console.error('✗ Failed to close Redis connection:', error)
  }
}

export { pool, redisClient }
