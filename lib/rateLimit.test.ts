/**
 * Rate Limiting Tests
 * 速率限制测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  RateLimiter,
  createRateLimiter,
  withRateLimit,
  defaultLimits,
  getDefaultKeyGenerator,
  authenticatedLimiter,
  unauthenticatedLimiter,
  sensitiveLimiter,
  strictLimiter,
} from './rateLimit';

describe('RateLimiter', () => {
  let limiter: RateLimiter;
  let mockRequest: Request;

  beforeEach(() => {
    limiter = createRateLimiter({
      windowMs: 60000, // 1分钟
      maxRequests: 5,
      keyGenerator: (req) => req.headers.get('x-user-id') || 'anonymous',
    });

    mockRequest = new Request('http://example.com/api/test', {
      headers: {
        'x-user-id': 'test-user',
      },
    });
  });

  describe('基本功能', () => {
    it('应该允许在限制内的请求', () => {
      for (let i = 0; i < 5; i++) {
        const result = limiter.check(mockRequest);
        expect(result.success).toBe(true);
        expect(result.remaining).toBe(5 - i - 1);
      }
    });

    it('应该阻止超过限制的请求', () => {
      // 发送5个成功的请求
      for (let i = 0; i < 5; i++) {
        limiter.check(mockRequest);
      }

      // 第6个请求应该被阻止
      const result = limiter.check(mockRequest);
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(result.error?.message).toBe('请求过于频繁，请稍后再试');
      expect(result.error?.retryAfter).toBeGreaterThan(0);
    });

    it('应该为不同用户分别计数', () => {
      const user1Request = new Request('http://example.com/api/test', {
        headers: { 'x-user-id': 'user1' },
      });
      const user2Request = new Request('http://example.com/api/test', {
        headers: { 'x-user-id': 'user2' },
      });

      // 用户1发送5个请求
      for (let i = 0; i < 5; i++) {
        const result = limiter.check(user1Request);
        expect(result.success).toBe(true);
      }

      // 用户1的第6个请求应该被阻止
      let result = limiter.check(user1Request);
      expect(result.success).toBe(false);

      // 用户2应该仍然可以发送请求
      result = limiter.check(user2Request);
      expect(result.success).toBe(true);
    });
  });

  describe('时间窗口', () => {
    it('应该在时间窗口过期后重置计数', () => {
      const shortWindowLimiter = createRateLimiter({
        windowMs: 100, // 100ms
        maxRequests: 2,
        keyGenerator: () => 'test',
      });

      const request = new Request('http://example.com/api/test');

      // 发送2个请求
      let result = shortWindowLimiter.check(request);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(1);

      result = shortWindowLimiter.check(request);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(0);

      // 第3个请求应该被阻止
      result = shortWindowLimiter.check(request);
      expect(result.success).toBe(false);

      // 等待窗口过期
      return new Promise((resolve) => {
        setTimeout(() => {
          result = shortWindowLimiter.check(request);
          expect(result.success).toBe(true);
          expect(result.remaining).toBe(1); // 刚重置，这是第一个请求，剩余maxRequests-1
          resolve(true);
        }, 150);
      });
    });

    it('应该返回正确的重置时间', () => {
      const result = limiter.check(mockRequest);
      expect(result.reset).toBeGreaterThan(Date.now());
      expect(result.reset).toBeLessThanOrEqual(Date.now() + 60000);
    });
  });

  describe('响应头', () => {
    it('应该返回速率限制响应头', () => {
      const result = limiter.check(mockRequest);

      expect(result.limit).toBe(5);
      expect(result.remaining).toBe(4);
      expect(result.reset).toBeDefined();
    });
  });

  describe('重置功能', () => {
    it('应该能够重置特定用户的限制', () => {
      // 发送5个请求
      for (let i = 0; i < 5; i++) {
        limiter.check(mockRequest);
      }

      // 重置
      limiter.reset('test-user');

      // 应该又可以发送请求了
      const result = limiter.check(mockRequest);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4);
    });
  });

  describe('存储管理', () => {
    it('应该能够获取存储大小', () => {
      const user1Request = new Request('http://example.com/api/test', {
        headers: { 'x-user-id': 'user1' },
      });
      const user2Request = new Request('http://example.com/api/test', {
        headers: { 'x-user-id': 'user2' },
      });

      limiter.check(user1Request);
      limiter.check(user2Request);

      expect(limiter.getStoreSize()).toBe(2);
    });

    it('应该自动清理过期记录', () => {
      const shortWindowLimiter = createRateLimiter({
        windowMs: 50,
        maxRequests: 5,
        keyGenerator: (req) => req.headers.get('x-user-id') || 'anonymous',
      });

      shortWindowLimiter.check(mockRequest);
      expect(shortWindowLimiter.getStoreSize()).toBe(1);

      return new Promise((resolve) => {
        setTimeout(() => {
          // 触发清理
          shortWindowLimiter.check(mockRequest);
          expect(shortWindowLimiter.getStoreSize()).toBe(1); // 旧记录被清理，新记录被添加
          resolve(true);
        }, 100);
      });
    });
  });
});

describe('预配置限制器', () => {
  it('应该导出正确的默认限制配置', () => {
    expect(defaultLimits.authenticated.maxRequests).toBe(100);
    expect(defaultLimits.authenticated.windowMs).toBe(60000);

    expect(defaultLimits.unauthenticated.maxRequests).toBe(20);
    expect(defaultLimits.unauthenticated.windowMs).toBe(60000);

    expect(defaultLimits.sensitive.maxRequests).toBe(10);
    expect(defaultLimits.sensitive.windowMs).toBe(60000);

    expect(defaultLimits.strict.maxRequests).toBe(5);
    expect(defaultLimits.strict.windowMs).toBe(60000);
  });

  it('应该创建预配置的限制器实例', () => {
    expect(authenticatedLimiter).toBeDefined();
    expect(unauthenticatedLimiter).toBeDefined();
    expect(sensitiveLimiter).toBeDefined();
    expect(strictLimiter).toBeDefined();
  });
});

describe('getDefaultKeyGenerator', () => {
  it('应该优先使用用户ID', () => {
    const request = new Request('http://example.com/api/test', {
      headers: {
        'x-user-id': 'user123',
        'x-forwarded-for': '192.168.1.1',
      },
    });

    const key = getDefaultKeyGenerator(request);
    expect(key).toBe('user:user123');
  });

  it('应该回退到IP地址', () => {
    const request = new Request('http://example.com/api/test', {
      headers: {
        'x-forwarded-for': '192.168.1.1',
      },
    });

    const key = getDefaultKeyGenerator(request);
    expect(key).toBe('ip:192.168.1.1');
  });

  it('应该使用x-real-ip作为后备', () => {
    const request = new Request('http://example.com/api/test', {
      headers: {
        'x-real-ip': '10.0.0.1',
      },
    });

    const key = getDefaultKeyGenerator(request);
    expect(key).toBe('ip:10.0.0.1');
  });

  it('应该处理多个IP的情况', () => {
    const request = new Request('http://example.com/api/test', {
      headers: {
        'x-forwarded-for': '192.168.1.1, 10.0.0.1',
      },
    });

    const key = getDefaultKeyGenerator(request);
    expect(key).toBe('ip:192.168.1.1');
  });
});

describe('withRateLimit', () => {
  it('应该包装handler并添加速率限制', async () => {
    const mockHandler = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    );

    const wrappedHandler = withRateLimit(mockHandler, {
      windowMs: 60000,
      maxRequests: 2,
      keyGenerator: () => 'test',
    });

    const request = new Request('http://example.com/api/test');

    // 第一次请求应该成功
    let response = await wrappedHandler(request);
    expect(response.status).toBe(200);
    expect(response.headers.get('X-RateLimit-Limit')).toBe('2');
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('1');

    // 第二次请求应该成功
    response = await wrappedHandler(request);
    expect(response.status).toBe(200);
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');

    // 第三次请求应该被阻止
    response = await wrappedHandler(request);
    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBeDefined();

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('RATE_LIMIT_EXCEEDED');
  });
});
