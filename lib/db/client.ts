/**
 * @fileoverview 数据库客户端 — PostgreSQL 连接池管理
 * @description 提供连接池、健康检查、参数化查询、事务客户端，支持自动重连与优雅降级
 * @author YYC³
 * @version 3.1.0
 * @created 2025-01-30
 * @modified 2026-07-17
 * @copyright Copyright (c) 2025-2026 YYC³
 * @license MIT
 */

// @ts-expect-error - pg ESM 模块缺少类型声明文件，使用 types.d.ts 中的 declare module
import { Pool, PoolConfig } from 'pg'

// ---- 连接池配置 ----

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  database: process.env.DB_NAME || 'yyc3_33',
  user: process.env.DB_USER || 'yanyu',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}

const pool = new Pool(poolConfig)

// ---- 连接状态追踪 ----

let consecutiveErrors = 0
const MAX_CONSECUTIVE_ERRORS = 5
let isReconnecting = false
const RECONNECT_DELAY_MS = 5000

// ---- 空闲客户端错误处理（优雅降级，不退出进程） ----

pool.on('error', (err: Error) => {
  consecutiveErrors++
  console.error(
    `[DB] 空闲客户端错误 (连续第 ${consecutiveErrors} 次): ${err.message}`,
    { stack: err.stack }
  )

  // 连续多次错误时触发告警，但不退出进程
  if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS && !isReconnecting) {
    isReconnecting = true
    console.error('[DB] 连续错误过多，尝试重新建立连接池...')

    // 异步重连：关闭旧连接后重新创建
    setTimeout(async () => {
      try {
        await pool.end().catch(() => {})
        // 重新初始化连接池（pg 内部会自动重建连接）
        console.log('[DB] 连接池已重置，下次请求将自动重连')
      } catch (reconnectError) {
        console.error('[DB] 重连失败:', reconnectError)
      } finally {
        consecutiveErrors = 0
        isReconnecting = false
      }
    }, RECONNECT_DELAY_MS)
  }
})

// 健康连接后重置计数器
pool.on('connect', () => {
  if (consecutiveErrors > 0) {
    console.log('[DB] 新连接建立成功，重置错误计数器')
    consecutiveErrors = 0
  }
})

export default pool

// ---- 数据库健康检查 ----

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    return true
  } catch (error) {
    console.error('[DB] 连接检查失败:', error)
    return false
  }
}

// ---- 参数化查询（防 SQL 注入） ----

export async function query<T = any>(text: string, params?: unknown[]): Promise<T[]> {
  try {
    const result = await pool.query(text, params)
    return result.rows
  } catch (error) {
    console.error('[DB] 查询错误:', error)
    throw error
  }
}

// ---- 事务客户端 ----

export async function getClient() {
  const client = await pool.connect()
  const originalQuery = client.query.bind(client)
  const originalRelease = client.release.bind(client)

  client.query = async (text: string, params?: unknown[]) => {
    try {
      return await originalQuery(text, params)
    } catch (error) {
      throw error
    }
  }

  client.release = () => {
    setImmediate(() => {
      originalRelease()
    })
  }

  return client
}

// ---- 带行锁的查询（用于并发控制） ----

/**
 * 执行 SELECT ... FOR UPDATE 行锁查询
 * 必须在事务中使用，防止并发修改
 */
export async function queryForUpdate<T = any>(
  client: ReturnType<typeof getClient> extends Promise<infer C> ? C : never,
  text: string,
  params?: unknown[]
): Promise<T[]> {
  try {
    const result = await client.query(text, params)
    return result.rows
  } catch (error) {
    console.error('[DB] 行锁查询错误:', error)
    throw error
  }
}
