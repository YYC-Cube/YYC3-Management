/**
 * @fileoverview 数据库客户端单元测试 — 连接池、健康检查、查询、错误处理
 * @author YYC³ @version 3.1.0 @license MIT
 */
/// <reference types="node" />

import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock pg Pool
const mockQuery = vi.fn()
const mockConnect = vi.fn()
const mockRelease = vi.fn()
const mockEnd = vi.fn()

const mockPoolInstance = {
  query: mockQuery,
  connect: mockConnect,
  end: mockEnd,
  on: vi.fn(),
}

vi.mock('pg', () => ({
  Pool: vi.fn(() => mockPoolInstance),
}))

// 动态导入以确保 mock 先生效
const clientModule = await import('../db/client')

describe('Database Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // === 健康检查 ===

  describe('checkDatabaseConnection', () => {
    it('连接成功应返回 true', async () => {
      mockConnect.mockResolvedValueOnce({
        query: vi.fn().mockResolvedValueOnce({ rows: [{ '?column?': 1 }] }),
        release: mockRelease,
      })

      const result = await clientModule.checkDatabaseConnection()
      expect(result).toBe(true)
      expect(mockRelease).toHaveBeenCalled()
    })

    it('连接失败应返回 false', async () => {
      mockConnect.mockRejectedValueOnce(new Error('Connection refused'))

      const result = await clientModule.checkDatabaseConnection()
      expect(result).toBe(false)
    })

    it('查询失败应返回 false', async () => {
      mockConnect.mockResolvedValueOnce({
        query: vi.fn().mockRejectedValueOnce(new Error('Query timeout')),
        release: mockRelease,
      })

      const result = await clientModule.checkDatabaseConnection()
      expect(result).toBe(false)
    })
  })

  // === 参数化查询 ===

  describe('query', () => {
    it('应正确执行参数化查询', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 1, name: 'test' }],
        rowCount: 1,
      })

      const rows = await clientModule.query('SELECT * FROM users WHERE id = $1', [1])
      expect(rows).toEqual([{ id: 1, name: 'test' }])
      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [1])
    })

    it('应返回空数组', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })

      const rows = await clientModule.query('SELECT * FROM users WHERE id = $1', [999])
      expect(rows).toEqual([])
    })

    it('查询失败应抛出错误', async () => {
      mockQuery.mockRejectedValueOnce(new Error('syntax error'))

      await expect(
        clientModule.query('INVALID SQL', [])
      ).rejects.toThrow('syntax error')
    })

    it('应正确处理 NULL 参数', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })

      await clientModule.query('SELECT * FROM users WHERE email = $1', [null])
      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', [null])
    })
  })

  // === 事务客户端 ===

  describe('getClient', () => {
    it('应返回事务客户端', async () => {
      const clientQuery = vi.fn().mockResolvedValue({ rows: [], rowCount: 0 })
      mockConnect.mockResolvedValueOnce({
        query: clientQuery,
        release: mockRelease,
      })

      const client = await clientModule.getClient()
      expect(client).toBeDefined()
      expect(client.query).toBeDefined()
      expect(client.release).toBeDefined()
    })

    it('release 应是异步的', async () => {
      mockConnect.mockResolvedValueOnce({
        query: vi.fn(),
        release: mockRelease,
      })

      const client = await clientModule.getClient()
      client.release()

      // setImmediate 延迟释放
      await new Promise((resolve) => setImmediate(resolve))
      expect(mockRelease).toHaveBeenCalled()
    })
  })

  // === 连接池错误处理 ===

  describe('连接池错误处理', () => {
    it('不应在错误时调用 process.exit', () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)

      // 模拟 pool.on('error', ...) 注册
      const poolOnCalls = mockPoolInstance.on.mock.calls
      const errorHandler = poolOnCalls.find((c: string[]) => c[0] === 'error')?.[1]

      if (errorHandler) {
        errorHandler(new Error('idle client error'))
        // 不应调用 process.exit
        expect(exitSpy).not.toHaveBeenCalled()
      }

      exitSpy.mockRestore()
    })
  })
})
