/**
 * CSRF Protection Tests
 * CSRF保护测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateCSRFToken,
  generateCSRFHash,
  verifyCSRFToken,
  CSRFTokenManager,
  csrfManager,
  withCSRFProtection,
  createCSRFErrorResponse,
} from './csrf';

describe('CSRF Token生成', () => {
  it('应该生成指定长度的随机token', () => {
    const token = generateCSRFToken(16);
    expect(token).toHaveLength(32); // 16字节 = 32个十六进制字符
  });

  it('应该生成不同长度的token', () => {
    const token16 = generateCSRFToken(16);
    const token32 = generateCSRFToken(32);

    expect(token16).toHaveLength(32);
    expect(token32).toHaveLength(64);
  });

  it('应该每次生成不同的token', () => {
    const token1 = generateCSRFToken();
    const token2 = generateCSRFToken();

    expect(token1).not.toBe(token2);
  });
});

describe('CSRF Hash生成', () => {
  it('应该为token生成一致的hash', () => {
    const token = 'test-token-123';
    const hash1 = generateCSRFHash(token);
    const hash2 = generateCSRFHash(token);

    expect(hash1).toBe(hash2);
  });

  it('应该为不同token生成不同的hash', () => {
    const hash1 = generateCSRFHash('token1');
    const hash2 = generateCSRFHash('token2');

    expect(hash1).not.toBe(hash2);
  });

  it('应该使用salt影响hash结果', () => {
    const token = 'test-token';
    const hash1 = generateCSRFHash(token, 'salt1');
    const hash2 = generateCSRFHash(token, 'salt2');

    expect(hash1).not.toBe(hash2);
  });
});

describe('CSRF Token验证', () => {
  it('应该验证有效的token', () => {
    const token = 'valid-token';
    const hash = generateCSRFHash(token);

    const isValid = verifyCSRFToken(token, hash);
    expect(isValid).toBe(true);
  });

  it('应该拒绝无效的token', () => {
    const token = 'valid-token';
    const hash = generateCSRFHash(token);
    const wrongToken = 'wrong-token';

    const isValid = verifyCSRFToken(wrongToken, hash);
    expect(isValid).toBe(false);
  });

  it('应该拒绝错误的hash', () => {
    const token = 'valid-token';
    const wrongHash = 'wrong-hash';

    const isValid = verifyCSRFToken(token, wrongHash);
    expect(isValid).toBe(false);
  });

  it('应该拒绝不同长度的hash', () => {
    const token = 'valid-token';
    const hash = generateCSRFHash(token);
    const shortHash = hash.substring(0, 10);

    const isValid = verifyCSRFToken(token, shortHash);
    expect(isValid).toBe(false);
  });
});

describe('CSRFTokenManager', () => {
  let manager: CSRFTokenManager;

  beforeEach(() => {
    manager = new CSRFTokenManager();
  });

  describe('token生成', () => {
    it('应该生成token和hash对', async () => {
      const { token, hash } = await manager.generateToken();

      expect(token).toBeDefined();
      expect(hash).toBeDefined();
      expect(token).toHaveLength(64); // 32字节
      expect(hash).toHaveLength(64); // SHA256 hex
    });

    it('应该为不同用户生成不同的token', async () => {
      const { token: token1 } = await manager.generateToken('user1');
      const { token: token2 } = await manager.generateToken('user2');

      expect(token1).not.toBe(token2);
    });

    it('应该为同一用户生成不同的token', async () => {
      const { token: token1 } = await manager.generateToken('user1');
      const { token: token2 } = await manager.generateToken('user1');

      expect(token1).not.toBe(token2);
    });
  });

  describe('token验证', () => {
    it('应该验证新生成的token', async () => {
      const { token, hash } = await manager.generateToken();

      const isValid = await manager.validateToken(token, hash);
      expect(isValid).toBe(true);
    });

    it('应该拒绝未生成的token', async () => {
      const isValid = await manager.validateToken('unknown-token', 'unknown-hash');
      expect(isValid).toBe(false);
    });

    it('应该验证token格式', async () => {
      const response = await manager.validateRequest(
        new Request('http://example.com', {
          headers: {
            'x-csrf-token': 'invalid-format',
          },
        })
      );

      expect(response.valid).toBe(false);
      expect(response.error).toContain('格式');
    });
  });

  describe('token刷新', () => {
    it('应该刷新有效的token', async () => {
      const { token } = await manager.generateToken('user1');
      const newTokenData = await manager.refreshToken(token, 'user1');

      expect(newTokenData).toBeDefined();
      expect(newTokenData?.token).not.toBe(token);
    });

    it('应该拒绝刷新无效的token', async () => {
      const result = await manager.refreshToken('invalid-token');
      expect(result).toBeNull();
    });
  });

  describe('token撤销', () => {
    it('应该撤销已生成的token', async () => {
      const { token, hash } = await manager.generateToken();

      // 验证token有效
      let isValid = await manager.validateToken(token, hash);
      expect(isValid).toBe(true);

      // 撤销token
      await manager.revokeToken(token);

      // 验证token无效
      isValid = await manager.validateToken(token, hash);
      expect(isValid).toBe(false);
    });
  });

  describe('从请求提取token', () => {
    it('应该从header提取token', () => {
      const token = 'test-token-123';
      const request = new Request('http://example.com', {
        headers: {
          'x-csrf-token': token,
        },
      });

      const extractedToken = manager.getTokenFromRequest(request);
      expect(extractedToken).toBe(token);
    });

    it('应该从cookie提取token', () => {
      const token = 'test-token-123';
      const hash = 'test-hash-abc';
      const request = new Request('http://example.com', {
        headers: {
          'cookie': `csrf_token=${token}:${hash}`,
        },
      });

      const extractedToken = manager.getTokenFromRequest(request);
      expect(extractedToken).toBe(`${token}:${hash}`);
    });

    it('应该优先从header提取token', () => {
      const headerToken = 'header-token';
      const cookieToken = 'cookie-token';
      const request = new Request('http://example.com', {
        headers: {
          'x-csrf-token': headerToken,
          'cookie': `csrf_token=${cookieToken}`,
        },
      });

      const extractedToken = manager.getTokenFromRequest(request);
      expect(extractedToken).toBe(headerToken);
    });

    it('应该在没有token时返回null', () => {
      const request = new Request('http://example.com');

      const extractedToken = manager.getTokenFromRequest(request);
      expect(extractedToken).toBeNull();
    });
  });

  describe('Set-Cookie头生成', () => {
    it('应该生成正确的Set-Cookie头', async () => {
      const { token, hash } = await manager.generateToken();
      const cookieHeader = manager.generateSetCookieHeader(token, hash);

      expect(cookieHeader).toContain('csrf_token=');
      expect(cookieHeader).toContain('Path=/');
      expect(cookieHeader).toContain('SameSite=strict');
      expect(cookieHeader).toContain('Max-Age=');
    });

    it('应该在生产环境包含Secure标志', async () => {
      const productionManager = new CSRFTokenManager({
        cookieOptions: {
          httpOnly: false,
          secure: true,
          sameSite: 'strict',
          path: '/',
          maxAge: 86400000,
        },
      });

      const { token, hash } = await productionManager.generateToken();
      const cookieHeader = productionManager.generateSetCookieHeader(token, hash);

      expect(cookieHeader).toContain('Secure');
    });
  });

  describe('请求验证', () => {
    it('应该验证带有效token的请求', async () => {
      const { token, hash } = await manager.generateToken();

      const request = new Request('http://example.com', {
        method: 'POST',
        headers: {
          'x-csrf-token': `${token}:${hash}`,
        },
      });

      const result = await manager.validateRequest(request);
      expect(result.valid).toBe(true);
    });

    it('应该拒绝没有token的写操作请求', async () => {
      const request = new Request('http://example.com', {
        method: 'POST',
      });

      const result = await manager.validateRequest(request);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('应该允许读操作请求', async () => {
      const request = new Request('http://example.com', {
        method: 'GET',
      });

      const result = await manager.validateRequest(request);
      expect(result.valid).toBe(true);
    });

    it('应该拒绝所有修改类型的请求（没有token）', async () => {
      const methods = ['POST', 'PUT', 'DELETE', 'PATCH'];

      for (const method of methods) {
        const request = new Request('http://example.com', {
          method,
        });

        const result = await manager.validateRequest(request);
        expect(result.valid).toBe(false);
      }
    });
  });
});

describe('withCSRFProtection辅助函数', () => {
  it('应该验证CSRF token', async () => {
    const { token, hash } = await csrfManager.generateToken();

    const request = new Request('http://example.com', {
      method: 'POST',
      headers: {
        'x-csrf-token': `${token}:${hash}`,
      },
    });

    const result = await withCSRFProtection(request);
    expect(result.valid).toBe(true);
  });

  it('应该拒绝无效的CSRF token', async () => {
    const request = new Request('http://example.com', {
      method: 'POST',
      headers: {
        'x-csrf-token': 'invalid:token',
      },
    });

    const result = await withCSRFProtection(request);
    expect(result.valid).toBe(false);
  });
});

describe('createCSRFErrorResponse', () => {
  it('应该创建正确的错误响应', () => {
    const response = createCSRFErrorResponse('Missing CSRF token');

    expect(response.status).toBe(403);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    return response.json().then((body) => {
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('CSRF_TOKEN_INVALID');
      expect(body.error.message).toBe('Missing CSRF token');
    });
  });
});

describe('token过期', () => {
  it('应该拒绝过期的token', async () => {
    // 生成一个会立即过期的token
    const shortLivedManager = new CSRFTokenManager({
      cookieOptions: {
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 50, // 50ms - 非常短
      },
    });

    const { token, hash } = await shortLivedManager.generateToken();

    // 立即验证应该成功
    let isValid = await shortLivedManager.validateToken(token, hash);
    expect(isValid).toBe(true);

    // 等待过期 (等待足够长的时间确保超过maxAge)
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 过期后应该失败
    isValid = await shortLivedManager.validateToken(token, hash);
    expect(isValid).toBe(false);
  });
});
