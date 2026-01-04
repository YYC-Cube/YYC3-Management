/**
 * Rate Limiting Middleware
 * 速率限制中间件
 *
 * 防止API滥用和DDoS攻击
 */

interface RateLimitConfig {
  windowMs: number;      // 时间窗口 (毫秒)
  maxRequests: number;   // 最大请求数
  keyGenerator: (req: Request) => string;  // 键生成器
  skipSuccessfulRequests?: boolean;  // 跳过成功请求
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

interface RateLimitStore {
  [key: string]: RateLimitRecord;
}

interface RateLimitResult {
  success: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
  error?: {
    code: string;
    message: string;
    retryAfter?: number;
  };
}

/**
 * 默认速率限制配置
 */
export const defaultLimits = {
  // 认证用户
  authenticated: {
    windowMs: 60 * 1000,  // 1分钟
    maxRequests: 100,      // 100次/分钟
  },

  // 未认证用户
  unauthenticated: {
    windowMs: 60 * 1000,  // 1分钟
    maxRequests: 20,       // 20次/分钟
  },

  // 特殊端点
  sensitive: {
    windowMs: 60 * 1000,  // 1分钟
    maxRequests: 10,       // 10次/分钟
  },

  // 极端严格
  strict: {
    windowMs: 60 * 1000,  // 1分钟
    maxRequests: 5,        // 5次/分钟
  },
} as const;

/**
 * 速率限制器类
 */
export class RateLimiter {
  private store: RateLimitStore = {};
  private windowMs: number;
  private maxRequests: number;
  private keyGenerator: (req: Request) => string;

  constructor(config: RateLimitConfig) {
    this.windowMs = config.windowMs;
    this.maxRequests = config.maxRequests;
    this.keyGenerator = config.keyGenerator;

    // 定期清理过期记录 (每5分钟)
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.cleanup(Date.now());
      }, 5 * 60 * 1000);
    }
  }

  /**
   * 检查速率限制
   */
  check(req: Request): RateLimitResult {
    const key = this.keyGenerator(req);
    const now = Date.now();

    // 清理过期记录
    this.cleanup(now);

    // 初始化或更新计数
    if (!this.store[key]) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
    } else {
      this.store[key].count++;
    }

    const record = this.store[key];

    // 检查是否超过限制
    if (record.count > this.maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);

      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset: record.resetTime,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: '请求过于频繁，请稍后再试',
          retryAfter,
        },
      };
    }

    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - record.count,
      reset: record.resetTime,
    };
  }

  /**
   * 重置特定键的计数
   */
  reset(key: string): void {
    delete this.store[key];
  }

  /**
   * 清理过期记录
   */
  private cleanup(now: number): void {
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    }
  }

  /**
   * 获取当前存储大小
   */
  getStoreSize(): number {
    return Object.keys(this.store).length;
  }
}

/**
 * 创建速率限制器的工厂函数
 */
export function createRateLimiter(config: RateLimitConfig): RateLimiter {
  return new RateLimiter(config);
}

/**
 * 默认键生成器
 */
export function getDefaultKeyGenerator(req: Request): string {
  // 1. 优先使用用户ID (从header)
  const userId = req.headers.get('x-user-id');
  if (userId) {
    return `user:${userId}`;
  }

  // 2. 使用IP地址
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';

  return `ip:${ip}`;
}

/**
 * Next.js API路由中间件
 */
export function withRateLimit(
  handler: (req: Request) => Promise<Response>,
  config: RateLimitConfig
) {
  const limiter = createRateLimiter(config);

  return async (req: Request): Promise<Response> => {
    const result = limiter.check(req);

    // 设置响应头
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', String(result.limit || 0));
    headers.set('X-RateLimit-Remaining', String(result.remaining || 0));
    headers.set('X-RateLimit-Reset', String(result.reset || 0));

    // 如果超过限制，返回429错误
    if (!result.success) {
      headers.set('Retry-After', String(result.error?.retryAfter || 60));
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error,
        }),
        {
          status: 429,
          headers,
        }
      );
    }

    // 继续处理请求
    try {
      const response = await handler(req);

      // 将速率限制头添加到响应
      response.headers.set('X-RateLimit-Limit', String(result.limit));
      response.headers.set('X-RateLimit-Remaining', String(result.remaining));
      response.headers.set('X-RateLimit-Reset', String(result.reset));

      return response;
    } catch (error) {
      throw error;
    }
  };
}

/**
 * 预配置的速率限制器
 */

// 认证用户速率限制器
export const authenticatedLimiter = createRateLimiter({
  ...defaultLimits.authenticated,
  keyGenerator: getDefaultKeyGenerator,
});

// 未认证用户速率限制器
export const unauthenticatedLimiter = createRateLimiter({
  ...defaultLimits.unauthenticated,
  keyGenerator: getDefaultKeyGenerator,
});

// 敏感操作速率限制器
export const sensitiveLimiter = createRateLimiter({
  ...defaultLimits.sensitive,
  keyGenerator: getDefaultKeyGenerator,
});

// 严格速率限制器
export const strictLimiter = createRateLimiter({
  ...defaultLimits.strict,
  keyGenerator: getDefaultKeyGenerator,
});
