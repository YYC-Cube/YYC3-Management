/**
 * CSRF Protection
 * CSRF跨站请求伪造保护
 *
 * 使用基于Token的CSRF保护机制
 */

import { randomBytes, createHash, timingSafeEqual } from 'crypto';

/**
 * CSRF Token配置
 */
interface CSRFConfig {
  tokenLength?: number;      // Token长度 (字节数)
  hashAlgorithm?: string;    // 哈希算法
  tokenHeader?: string;      // Token请求头名称
  cookieName?: string;       // Cookie名称
  cookieOptions?: {          // Cookie选项
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    path?: string;
    maxAge?: number;
  };
}

const DEFAULT_CONFIG: Required<CSRFConfig> = {
  tokenLength: 32,
  hashAlgorithm: 'sha256',
  tokenHeader: 'x-csrf-token',
  cookieName: 'csrf_token',
  cookieOptions: {
    httpOnly: false,  // 需要JavaScript访问
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000, // 24小时
  },
};

/**
 * 生成随机CSRF Token
 */
export function generateCSRFToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * 生成CSRF Token哈希
 */
export function generateCSRFHash(token: string, salt: string = ''): string {
  return createHash(DEFAULT_CONFIG.hashAlgorithm)
    .update(token + salt)
    .digest('hex');
}

/**
 * 验证CSRF Token (使用timing-safe比较)
 */
export function verifyCSRFToken(token: string, hash: string): boolean {
  const expectedHash = generateCSRFHash(token);

  // 长度不同直接返回false
  if (expectedHash.length !== hash.length) {
    return false;
  }

  // 使用timing-safe比较
  try {
    return timingSafeEqual(
      Buffer.from(expectedHash),
      Buffer.from(hash)
    );
  } catch {
    return false;
  }
}

/**
 * CSRF Token存储接口
 */
interface CSRFToken {
  token: string;
  hash: string;
  userId?: string;
  createdAt: number;
  expiresAt: number;
}

interface CSRFStore {
  get(token: string): Promise<CSRFToken | null>;
  set(token: CSRFToken): Promise<void>;
  delete(token: string): Promise<void>;
  cleanup(): Promise<void>;
}

/**
 * 内存CSRF Token存储 (开发环境)
 */
class MemoryCSRFStore implements CSRFStore {
  private store: Map<string, CSRFToken> = new Map();

  async get(token: string): Promise<CSRFToken | null> {
    return this.store.get(token) || null;
  }

  async set(data: CSRFToken): Promise<void> {
    this.store.set(data.token, data);
  }

  async delete(token: string): Promise<void> {
    this.store.delete(token);
  }

  async cleanup(): Promise<void> {
    const now = Date.now();
    for (const [token, data] of this.store.entries()) {
      if (data.expiresAt < now) {
        this.store.delete(token);
      }
    }
  }
}

/**
 * Cookie-based CSRF Token管理器
 * (推荐用于生产环境)
 */
export class CSRFTokenManager {
  private store: CSRFStore;
  private config: Required<CSRFConfig>;

  constructor(config: CSRFConfig = {}, store?: CSRFStore) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.store = store || new MemoryCSRFStore();

    // 定期清理过期token
    if (typeof setInterval !== 'undefined') {
      setInterval(() => {
        this.store.cleanup().catch(console.error);
      }, 60 * 60 * 1000); // 每小时清理一次
    }
  }

  /**
   * 生成新的CSRF Token
   */
  async generateToken(userId?: string): Promise<{ token: string; hash: string }> {
    const token = generateCSRFToken(this.config.tokenLength);
    const salt = Date.now().toString();
    const hash = generateCSRFHash(token, salt);

    const csrfToken: CSRFToken = {
      token,
      hash,
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.config.cookieOptions.maxAge,
    };

    await this.store.set(csrfToken);

    return { token, hash };
  }

  /**
   * 验证CSRF Token
   */
  async validateToken(token: string, hash: string): Promise<boolean> {
    // 从存储中获取token
    const storedToken = await this.store.get(token);

    if (!storedToken) {
      return false;
    }

    // 检查是否过期
    if (storedToken.expiresAt < Date.now()) {
      await this.store.delete(token);
      return false;
    }

    // 验证哈希
    const isValid = verifyCSRFToken(token, hash);

    // 如果验证失败，删除token
    if (!isValid) {
      await this.store.delete(token);
    }

    return isValid;
  }

  /**
   * 刷新CSRF Token
   */
  async refreshToken(oldToken: string, userId?: string): Promise<{ token: string; hash: string } | null> {
    const storedToken = await this.store.get(oldToken);

    if (storedToken) {
      await this.store.delete(oldToken);
      return this.generateToken(userId);
    }

    return null;
  }

  /**
   * 撤销CSRF Token
   */
  async revokeToken(token: string): Promise<void> {
    await this.store.delete(token);
  }

  /**
   * 从请求中获取Token
   */
  getTokenFromRequest(req: Request): string | null {
    // 1. 优先从Header获取
    const headerToken = req.headers.get(this.config.tokenHeader);
    if (headerToken) {
      return headerToken;
    }

    // 2. 从Cookie获取
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const csrfCookie = cookies.find(c => c.startsWith(`${this.config.cookieName}=`));
      if (csrfCookie) {
        return csrfCookie.split('=')[1];
      }
    }

    return null;
  }

  /**
   * 生成Set-Cookie头
   */
  generateSetCookieHeader(token: string, hash: string): string {
    const cookieValue = `${token}:${hash}`;
    const options = this.config.cookieOptions;

    const parts = [
      `${this.config.cookieName}=${cookieValue}`,
      `Path=${options.path}`,
      `Max-Age=${Math.floor(options.maxAge / 1000)}`,
      `SameSite=${options.sameSite}`,
    ];

    if (options.secure) {
      parts.push('Secure');
    }

    if (options.httpOnly) {
      parts.push('HttpOnly');
    }

    return parts.join('; ');
  }

  /**
   * 验证请求的CSRF Token
   */
  async validateRequest(req: Request): Promise<{ valid: boolean; error?: string }> {
    const token = this.getTokenFromRequest(req);

    if (!token) {
      return {
        valid: false,
        error: 'Missing CSRF token',
      };
    }

    // token格式应为 "token:hash"
    const [actualToken, hash] = token.split(':');

    if (!actualToken || !hash) {
      return {
        valid: false,
        error: 'Invalid CSRF token format',
      };
    }

    const isValid = await this.validateToken(actualToken, hash);

    if (!isValid) {
      return {
        valid: false,
        error: 'Invalid or expired CSRF token',
      };
    }

    return { valid: true };
  }
}

/**
 * 默认CSRF管理器实例
 */
export const csrfManager = new CSRFTokenManager();

/**
 * Next.js中间件辅助函数
 */
export async function withCSRFProtection(
  req: Request,
  csrfManager: CSRFTokenManager = csrfManager
): Promise<{ valid: boolean; error?: string }> {
  // 对写操作进行CSRF验证
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return csrfManager.validateRequest(req);
  }

  // 读操作不需要验证
  return { valid: true };
}

/**
 * 生成CSRF错误响应
 */
export function createCSRFErrorResponse(error: string): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        code: 'CSRF_TOKEN_INVALID',
        message: error,
      },
    }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
