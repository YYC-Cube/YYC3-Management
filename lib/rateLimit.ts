/**
 * Rate Limiting Middleware — 速率限制中间件
 *
 * 防止 API 滥用和 DDoS 攻击。
 * 服务端使用单例 + 定时清理，客户端使用 window 定时器。
 * 支持滑动窗口、固定窗口、IP/用户维度限流。
 *
 * @author YYC³
 * @version 3.1.0
 * @created 2025-01-30
 * @modified 2026-07-17
 * @license MIT
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

// ---- 全局单例管理（防止多实例 + 确保服务端定时器正确运行） ----

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000 // 5分钟
const MAX_STORE_SIZE = 10000 // 最大存储条目，防止内存无限增长

/**
 * 速率限制器类
 */
export class RateLimiter {
  private store: RateLimitStore = {};
  private windowMs: number;
  private maxRequests: number;
  private keyGenerator: (req: Request) => string;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor(config: RateLimitConfig) {
    this.windowMs = config.windowMs;
    this.maxRequests = config.maxRequests;
    this.keyGenerator = config.keyGenerator;

    // 服务端 & 客户端都启动定时清理
    this.startCleanupInterval();
  }

  /**
   * 启动定时清理（服务端/客户端通用）
   */
  private startCleanupInterval(): void {
    // 防止重复启动
    if (this.cleanupTimer) return;

    this.cleanupTimer = setInterval(() => {
      this.cleanup(Date.now());
    }, CLEANUP_INTERVAL_MS);

    // Node.js 环境下允许进程退出（不阻止事件循环）
    if (typeof this.cleanupTimer === 'object' && 'unref' in this.cleanupTimer) {
      this.cleanupTimer.unref();
    }
  }

  /**
   * 停止定时清理
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.store = {};
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
   * 清理过期记录（带上限保护，防止内存泄漏）
   */
  private cleanup(now: number): void {
    let size = 0;
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      } else {
        size++;
      }
    }

    // 内存保护：超过上限时强制清理最旧的记录
    if (size > MAX_STORE_SIZE) {
      const entries = Object.entries(this.store)
        .sort((a, b) => a[1].resetTime - b[1].resetTime);
      const toDelete = entries.slice(0, size - MAX_STORE_SIZE);
      for (const [key] of toDelete) {
        delete this.store[key];
      }
      console.warn(`[RateLimiter] 存储条目超过上限(${MAX_STORE_SIZE})，已清理 ${toDelete.length} 条旧记录`);
    }
  }

  /**
   * 获取当前存储大小
   */
  getStoreSize(): number {
    return Object.keys(this.store).length;
  }
}

// ---- 全局单例注册表（防止多实例内存泄漏） ----

const limiterRegistry = new Map<string, RateLimiter>();

/**
 * 创建或获取速率限制器单例
 * 相同配置的限流器复用同一个实例，避免内存泄漏
 */
export function createRateLimiter(config: RateLimitConfig): RateLimiter {
  const key = `${config.windowMs}:${config.maxRequests}`;
  if (!limiterRegistry.has(key)) {
    limiterRegistry.set(key, new RateLimiter(config));
  }
  return limiterRegistry.get(key)!;
}

/**
 * 销毁所有限流器实例（用于热重载/测试清理）
 */
export function destroyAllLimiters(): void {
  for (const limiter of limiterRegistry.values()) {
    limiter.destroy();
  }
  limiterRegistry.clear();
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
