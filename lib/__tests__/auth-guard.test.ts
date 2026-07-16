/**
 * @fileoverview 认证守卫单元测试 — Token 验证、权限检查、公共路由
 * @author YYC³ @version 3.1.0 @license MIT
 */
/// <reference types="node" />

import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const authGuard = await import('../api/auth-guard')

// 辅助：创建签名 JWT
function createJwt(payload: Record<string, unknown>, secret: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const crypto = require('crypto')
  const sig = crypto.createHash('sha256')
    .update(`${header}.${body}${secret}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return `${header}.${body}.${sig}`
}

function makeRequest(pathname: string, token?: string): NextRequest {
  const headers = new Headers()
  if (token) headers.set('authorization', `Bearer ${token}`)
  return new NextRequest(`http://localhost:3223${pathname}`, { headers })
}

describe('Auth Guard', () => {
  const originalSecret = process.env.JWT_SECRET

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.JWT_SECRET = 'test-secret-key-32-chars-min!!!'
  })

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret
  })

  // === isPublicApiRoute ===

  describe('isPublicApiRoute', () => {
    it('/api/health 应为公共路由', () => {
      expect(authGuard.isPublicApiRoute('/api/health')).toBe(true)
    })

    it('/api/users 应为非公共路由', () => {
      expect(authGuard.isPublicApiRoute('/api/users')).toBe(false)
    })
  })

  // === getRequestToken ===

  describe('getRequestToken', () => {
    it('应从 Bearer 头提取 token', () => {
      const req = makeRequest('/api/test', 'my-token-123')
      expect(authGuard.getRequestToken(req)).toBe('my-token-123')
    })

    it('应从 Token 头提取', () => {
      const headers = new Headers()
      headers.set('authorization', 'Token my-token-456')
      const req = new NextRequest('http://localhost:3223/api/test', { headers })
      expect(authGuard.getRequestToken(req)).toBe('my-token-456')
    })

    it('无 authorization 头应返回 null', () => {
      const req = makeRequest('/api/test')
      expect(authGuard.getRequestToken(req)).toBeNull()
    })

    it('格式不对的 authorization 头应返回 null', () => {
      const headers = new Headers()
      headers.set('authorization', 'Basic abc123')
      const req = new NextRequest('http://localhost:3223/api/test', { headers })
      expect(authGuard.getRequestToken(req)).toBeNull()
    })
  })

  // === verifyToken ===

  describe('verifyToken', () => {
    it('有效未过期 token 应返回 payload', () => {
      const payload = { userId: 123, role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 }
      const token = createJwt(payload, 'test-secret-key-32-chars-min!!!')

      const result = authGuard.verifyToken(token)
      expect(result).not.toBeNull()
      expect(result?.userId).toBe(123)
      expect(result?.role).toBe('admin')
    })

    it('空 token 应返回 null', () => {
      expect(authGuard.verifyToken('')).toBeNull()
    })

    it('格式不对的 token 应返回 null', () => {
      expect(authGuard.verifyToken('invalid.token')).toBeNull()
    })

    it('过期的 token 应返回 null', () => {
      const payload = { userId: 123, role: 'user', exp: Math.floor(Date.now() / 1000) - 3600 }
      const token = createJwt(payload, 'test-secret-key-32-chars-min!!!')

      expect(authGuard.verifyToken(token)).toBeNull()
    })

    it('签名错误的 token 应返回 null', () => {
      const payload = { userId: 123, role: 'user', exp: Math.floor(Date.now() / 1000) + 3600 }
      const token = createJwt(payload, 'wrong-secret')

      expect(authGuard.verifyToken(token)).toBeNull()
    })

    it('无 JWT_SECRET 环境变量应返回 null', () => {
      delete process.env.JWT_SECRET
      delete process.env.SESSION_SECRET
      const payload = { userId: 123, role: 'user' }
      const token = createJwt(payload, 'test-secret-key-32-chars-min!!!')

      expect(authGuard.verifyToken(token)).toBeNull()
    })
  })

  // === authenticateApiRequest ===

  describe('authenticateApiRequest', () => {
    it('公共路由应直接通过', () => {
      const req = makeRequest('/api/health')
      const result = authGuard.authenticateApiRequest(req)

      expect(result.authenticated).toBe(true)
      if (result.authenticated) {
        expect(result.payload.role).toBe('system')
      }
    })

    it('无 token 应返回 401', () => {
      const req = makeRequest('/api/users')
      const result = authGuard.authenticateApiRequest(req)

      expect(result.authenticated).toBe(false)
      if (!result.authenticated) {
        expect(result.response.status).toBe(401)
      }
    })

    it('无效 token 应返回 401', () => {
      const req = makeRequest('/api/users', 'invalid-token')
      const result = authGuard.authenticateApiRequest(req)

      expect(result.authenticated).toBe(false)
    })

    it('有效 token 应返回 payload', () => {
      const payload = {
        userId: 42,
        role: 'manager',
        exp: Math.floor(Date.now() / 1000) + 3600,
      }
      const token = createJwt(payload, 'test-secret-key-32-chars-min!!!')
      const req = makeRequest('/api/users', token)

      const result = authGuard.authenticateApiRequest(req)
      expect(result.authenticated).toBe(true)
      if (result.authenticated) {
        expect(result.payload.userId).toBe(42)
        expect(result.payload.role).toBe('manager')
      }
    })
  })
})
