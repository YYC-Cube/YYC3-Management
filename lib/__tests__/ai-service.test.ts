/**
 * @fileoverview AI Service 单元测试 — 模型配置、API 调用、错误处理
 * @author YYC³ @version 3.1.0 @license MIT
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AIService } from '../ai-service'

// Mock fetch
const mockFetch = vi.fn()
globalThis.fetch = mockFetch as unknown as typeof fetch

// Mock getModelById
vi.mock('../ai-models', () => ({
  getModelById: vi.fn((id: string) => {
    const models: Record<string, unknown> = {
      'deepseek-chat': {
        id: 'deepseek-chat', name: 'DeepSeek', provider: 'DeepSeek',
        type: 'cloud', endpoint: 'https://api.deepseek.com/v1',
        apiKey: 'test-key', maxTokens: 8192, temperature: 0.7,
        description: 'Test', capabilities: ['chat'],
      },
      'local-llama2': {
        id: 'local-llama2', name: 'Llama 2', provider: 'Local',
        type: 'local', endpoint: 'http://localhost:11434/api/chat',
        maxTokens: 4096, temperature: 0.7,
        description: 'Test', capabilities: ['chat'],
      },
    }
    return models[id] || null
  }),
  AI_MODELS: [],
}))

// Mock AIModelRepository
vi.mock('../db/repositories/ai-model.repository', () => ({
  AIModelRepository: vi.fn().mockImplementation(() => ({
    findActive: vi.fn().mockResolvedValue([]),
    getDecryptedApiKey: vi.fn().mockReturnValue(''),
  })),
}))

describe('AIService', () => {
  let service: AIService

  beforeEach(() => {
    service = AIService.getInstance()
    mockFetch.mockReset()
  })

  // === 基本功能 ===

  describe('单例模式', () => {
    it('getInstance() 应返回同一实例', () => {
      const a = AIService.getInstance()
      const b = AIService.getInstance()
      expect(a).toBe(b)
    })
  })

  // === 云端模型调用 ===

  describe('云端模型调用 (OpenAI 兼容)', () => {
    it('应成功调用云端模型并返回内容', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: '这是 DeepSeek 的回复' } }],
          model: 'deepseek-chat',
          usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
        }),
      })

      const response = await service.chat({
        modelId: 'deepseek-chat',
        messages: [{ role: 'user', content: '你好' }],
      })

      expect(response.success).toBe(true)
      expect(response.content).toBe('这是 DeepSeek 的回复')
      expect(response.usage?.totalTokens).toBe(30)
    })

    it('应正确传递 API Key 和请求体', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ choices: [{ message: { content: 'OK' } }] }),
      })

      await service.chat({
        modelId: 'deepseek-chat',
        messages: [{ role: 'user', content: '测试' }],
        temperature: 0.5,
        maxTokens: 1000,
      })

      const call = mockFetch.mock.calls[0]
      const [url, options] = call
      expect(url).toContain('/chat/completions')
      expect(options.headers.Authorization).toBe('Bearer test-key')
      const body = JSON.parse(options.body)
      expect(body.temperature).toBe(0.5)
      expect(body.max_tokens).toBe(1000)
    })

    it('API 返回错误时应返回失败状态', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: { message: 'Invalid API Key' } }),
      })

      const response = await service.chat({
        modelId: 'deepseek-chat',
        messages: [{ role: 'user', content: '你好' }],
      })

      expect(response.success).toBe(false)
      expect(response.error).toContain('Invalid API Key')
    })

    it('API 超时应返回超时错误', async () => {
      mockFetch.mockImplementationOnce(() =>
        new Promise((_, reject) => {
          const err = new Error('The operation was aborted')
          err.name = 'AbortError'
          reject(err)
        })
      )

      const response = await service.chat({
        modelId: 'deepseek-chat',
        messages: [{ role: 'user', content: '你好' }],
      })

      expect(response.success).toBe(false)
      expect(response.error).toContain('超时')
    })
  })

  // === 本地模型调用 (Ollama) ===

  describe('本地模型调用 (Ollama)', () => {
    it('应成功调用 Ollama 本地模型', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: { content: '我是 Llama 2，运行在本地' },
          prompt_eval_count: 8,
          eval_count: 15,
        }),
      })

      const response = await service.chat({
        modelId: 'local-llama2',
        messages: [{ role: 'user', content: '你是谁？' }],
      })

      expect(response.success).toBe(true)
      expect(response.content).toBe('我是 Llama 2，运行在本地')
      expect(response.usage?.totalTokens).toBe(23)
    })

    it('Ollama 不可用时应返回错误', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: async () => ({ error: 'model not found' }),
      })

      const response = await service.chat({
        modelId: 'local-llama2',
        messages: [{ role: 'user', content: '你好' }],
      })

      expect(response.success).toBe(false)
      expect(response.error).toBeDefined()
    })
  })

  // === 模型不存在 ===

  describe('模型不存在处理', () => {
    it('不存在的模型应返回错误', async () => {
      const response = await service.chat({
        modelId: 'nonexistent-model-xyz',
        messages: [{ role: 'user', content: '你好' }],
      })

      expect(response.success).toBe(false)
      expect(response.error).toContain('未配置')
    })
  })

  // === 获取可用模型 ===

  describe('getAvailableModels', () => {
    it('DB 不可用时应回退到内置模型', async () => {
      const models = await service.getAvailableModels()
      expect(Array.isArray(models)).toBe(true)
    })
  })
})
