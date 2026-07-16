/**
 * @fileoverview API 路由集成测试 — Dashboard Stats、AI Chat、AI Models
 * @description Mock 数据库 + 认证 + 外部 API，测试路由处理逻辑
 * @author YYC³ @version 3.1.0 @license MIT
 */
/// <reference types="node" />

import * as crypto from 'crypto'
import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// ---- Mock 依赖 ----

const mockQuery = vi.fn()
const mockCheckDb = vi.fn()
const mockGetCache = vi.fn()
const mockSetCache = vi.fn()

vi.mock('../../lib/db/client', () => ({
  checkDatabaseConnection: (...args: unknown[]) => mockCheckDb(...args),
  query: (...args: unknown[]) => mockQuery(...args),
}))

vi.mock('../../lib/db/cache', () => ({
  withCache: vi.fn(async (_key: string, fetcher: () => Promise<unknown>) => fetcher()),
  buildCacheKey: vi.fn((resource: string) => `cache:${resource}:all`),
}))

vi.mock('../../lib/db/redis', () => ({
  getCache: (...args: unknown[]) => mockGetCache(...args),
  setCache: (...args: unknown[]) => mockSetCache(...args),
}))

// Mock auth-guard
function createJwt(payload: Record<string, unknown>, secret: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHash('sha256')
    .update(`${header}.${body}${secret}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return `${header}.${body}.${sig}`
}

const TEST_SECRET = 'test-secret-key-32-chars-min!!!'
const validToken = createJwt(
  { userId: 1, role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 },
  TEST_SECRET
)

function makeAuthedRequest(url: string, options?: RequestInit): NextRequest {
  const headers = new Headers(options?.headers)
  headers.set('authorization', `Bearer ${validToken}`)
  return new NextRequest(`http://localhost:3223${url}`, {
    method: options?.method,
    headers,
    body: options?.body,
  })
}

// ---- 测试 ----

describe('API Routes Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.JWT_SECRET = TEST_SECRET
    process.env.ZHIPU_API_KEY = 'test-zhipu-key'
  })

  // === Dashboard Stats API ===

  describe('GET /api/dashboard/stats', () => {
    it('应返回聚合统计数据', async () => {
      mockCheckDb.mockResolvedValue(true)
      mockQuery
        .mockResolvedValueOnce([{ total: '100', active: '80', online: '20', new_today: '5' }])
        .mockResolvedValueOnce([{ total: '500', active: '300', vip: '50', new_today: '10' }])
        .mockResolvedValueOnce([{ total: '200', completed: '100', in_progress: '50', pending: '50' }])
        .mockResolvedValueOnce([{ total: '50', completed: '20', in_progress: '15', avg_progress: '65.5' }])

      const { GET } = await import('../../app/api/dashboard/stats/route')
      const req = makeAuthedRequest('/api/dashboard/stats')
      const res = await GET(req)

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.users.total).toBe(100)
      expect(data.data.customers.total).toBe(500)
      expect(data.data.tasks.completed).toBe(100)
      expect(data.data.projects.total).toBe(50)
    })

    it('数据库不可用时应返回 503', async () => {
      mockCheckDb.mockResolvedValue(false)

      const { GET } = await import('../../app/api/dashboard/stats/route')
      const req = makeAuthedRequest('/api/dashboard/stats')
      const res = await GET(req)

      expect(res.status).toBe(503)
    })

    it('未认证请求应返回 401', async () => {
      const { GET } = await import('../../app/api/dashboard/stats/route')
      const req = new NextRequest('http://localhost:3223/api/dashboard/stats')
      const res = await GET(req)

      expect(res.status).toBe(401)
    })
  })

  // === AI Chat API ===

  describe('POST /api/ai/chat', () => {
    it('应成功调用 AI 对话', async () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: '你好，我是 AI 助手' } }],
          model: 'glm-4-flash',
          usage: { total_tokens: 50 },
        }),
      })
      globalThis.fetch = mockFetch as unknown as typeof fetch

      const { POST } = await import('../../app/api/ai/chat/route')
      const req = makeAuthedRequest('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [{ role: 'user', content: '你好' }],
        }),
      })
      const res = await POST(req)

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.content).toBe('你好，我是 AI 助手')
    })

    it('消息为空时应返回 400', async () => {
      const { POST } = await import('../../app/api/ai/chat/route')
      const req = makeAuthedRequest('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [] }),
      })
      const res = await POST(req)

      expect(res.status).toBe(400)
    })

    it('未配置 API Key 时应返回 503', async () => {
      delete process.env.ZHIPU_API_KEY

      const { POST } = await import('../../app/api/ai/chat/route')
      const req = makeAuthedRequest('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [{ role: 'user', content: '你好' }],
        }),
      })
      const res = await POST(req)

      expect(res.status).toBe(503)
    })

    it('AI 服务返回错误时应返回 502', async () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ error: { message: 'Rate limited' } }),
      })
      globalThis.fetch = mockFetch as unknown as typeof fetch

      process.env.ZHIPU_API_KEY = 'test-key'
      const { POST } = await import('../../app/api/ai/chat/route')
      const req = makeAuthedRequest('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [{ role: 'user', content: '你好' }],
        }),
      })
      const res = await POST(req)

      expect(res.status).toBe(502)
    })
  })

  // === AI Models API ===

  describe('GET /api/ai/models', () => {
    it('数据库可用时应从 DB 获取模型列表', async () => {
      mockCheckDb.mockResolvedValue(true)
      const mockRepo = {
        findAll: vi.fn().mockResolvedValue([
          { id: 1, name: 'GLM-4', provider: 'zhipu', model_id: 'glm-4-flash', is_active: true },
        ]),
        scanOllama: vi.fn(),
        testOllamaConnection: vi.fn(),
        getDecryptedApiKey: vi.fn().mockReturnValue(''),
      }
      vi.doMock('../../lib/db/repositories/ai-model.repository', () => ({
        AIModelRepository: vi.fn(() => mockRepo),
      }))

      const { GET } = await import('../../app/api/ai/models/route')
      const req = makeAuthedRequest('/api/ai/models')
      const res = await GET(req)

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.source).toBe('db')
    })

    it('scan=ollama 时应触发 Ollama 扫描', async () => {
      const mockRepo = {
        findAll: vi.fn(),
        scanOllama: vi.fn().mockResolvedValue([
          { name: 'llama3.2', size: '2.0GB', parameter_size: '3B', quantization: 'Q4_0' },
        ]),
        testOllamaConnection: vi.fn().mockResolvedValue(true),
        getDecryptedApiKey: vi.fn(),
      }
      vi.doMock('../../lib/db/repositories/ai-model.repository', () => ({
        AIModelRepository: vi.fn(() => mockRepo),
      }))

      const { GET } = await import('../../app/api/ai/models/route')
      const req = makeAuthedRequest('/api/ai/models?scan=ollama')
      const res = await GET(req)

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(mockRepo.scanOllama).toHaveBeenCalled()
    })
  })
})
