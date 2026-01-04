# YYC³-MANA 安全加固方案

> **文档类型**: 安全设计
> **创建日期**: 2026-01-03
> **执行周期**: Phase 1 - Week 5-6
> **安全目标**: 评分 4/10 → 7/10

---

## 📋 安全现状分析

### 当前安全评分

```
总体评分: 4/10 ⚠️

各维度评分:
- 身份认证:     7/10 ✅ (JWT实现，缺少MFA)
- 访问控制:     6/10 ⚠️ (RBAC基础，缺少细粒度)
- 数据保护:     5/10 ⚠️ (传输加密，缺少字段加密)
- API安全:      4/10 ❌ (无速率限制，缺少签名)
- 审计日志:     3/10 ❌ (基础日志，无审计)
- 合规性:       2/10 ❌ (缺少认证)
```

### 关键安全问题

1. **高危漏洞**
   - SQL注入风险
   - XSS攻击面
   - 敏感信息泄露

2. **中危漏洞**
   - CSRF攻击
   - 会话固定

3. **低危问题**
   - 缺少安全头
   - 日志不完整

---

## 🎯 安全加固目标

### 总体目标

```
当前安全评分: 4/10
目标安全评分: 7/10
提升: +75%
```

### 分项目标

| 安全域 | 当前 | 目标 | 提升 |
|--------|------|------|------|
| **API安全** | 4/10 | 7/10 | +75% |
| **身份认证** | 7/10 | 8/10 | +14% |
| **访问控制** | 6/10 | 8/10 | +33% |
| **审计日志** | 3/10 | 7/10 | +133% |
| **合规性** | 2/10 | 6/10 | +200% |

---

## 🔒 API安全实施方案

### 1. 速率限制 (Rate Limiting)

#### 1.1 设计

```typescript
// 速率限制配置
interface RateLimitConfig {
  windowMs: number;      // 时间窗口 (毫秒)
  maxRequests: number;   // 最大请求数
  keyGenerator: (req) => string;  // 键生成器
  skipSuccessfulRequests?: boolean;  // 跳过成功请求
}

// 默认配置
const defaultLimits = {
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
};
```

#### 1.2 中间件实现

```typescript
// middleware/rateLimit.ts
import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  
  constructor(
    private windowMs: number,
    private maxRequests: number,
    private keyGenerator: (req: Request) => string
  ) {}
  
  middleware(req: Request, res: Response, next: NextFunction) {
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
      
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: '请求过于频繁，请稍后再试',
          details: {
            retryAfter,
          },
        },
        timestamp: new Date().toISOString(),
      });
    }
    
    // 添加速率限制头
    res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', (this.maxRequests - record.count).toString());
    res.setHeader('X-RateLimit-Reset', record.resetTime.toString());
    
    next();
  }
  
  private cleanup(now: number) {
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    }
  }
}

// 导出工厂函数
export function createRateLimiter(config: RateLimitConfig) {
  return new RateLimiter(
    config.windowMs,
    config.maxRequests,
    config.keyGenerator
  ).middleware.bind(this.rateLimiter);
}
```

#### 1.3 使用示例

```typescript
// app/api/[...]/route.ts
import { createRateLimiter } from '@/lib/rateLimit';

// 创建速率限制器
const limiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 100,
  keyGenerator: (req) => {
    // 根据用户ID限制
    return req.headers['x-user-id'] || req.ip;
  },
});

export async function GET(request: Request) {
  // 应用速率限制
  const response = await limiter(request);
  if (response) return response;
  
  // 处理请求
  // ...
}
```

---

### 2. 输入验证 (Input Validation)

#### 2.1 Zod Schema 定义

```typescript
// lib/validations/schemas.ts
import { z } from 'zod';

// 用户输入验证
export const userSchema = z.object({
  email: z.string().email('无效的邮箱格式'),
  name: z.string().min(2, '名称至少2个字符').max(50, '名称最多50个字符'),
  password: z.string().min(8, '密码至少8个字符')
    .regex(/[A-Z]/, '密码必须包含大写字母')
    .regex(/[a-z]/, '密码必须包含小写字母')
    .regex(/[0-9]/, '密码必须包含数字'),
  role: z.enum(['admin', 'user', 'guest']),
});

// 客户数据验证
export const customerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '无效的手机号'),
  company: z.string().optional(),
});

// 查询参数验证
export const querySchema = z.object({
  page: z.string().optional().transform((val) => parseInt(val) || 1),
  limit: z.string().optional().transform((val) => parseInt(val) || 10),
  sort: z.enum(['name', 'date', 'status']).optional(),
});
```

#### 2.2 验证中间件

```typescript
// lib/middleware/validation.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export function validateRequestBody<T extends z.ZodType>(schema: T) {
  return async (req: NextRequest) => {
    try {
      const body = await req.json();
      const validated = schema.parse(body);
      
      // 将验证后的数据附加到请求
      (req as any).validatedData = validated;
      
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '请求数据验证失败',
            details: error.errors,
          },
        };
      }
      throw error;
    }
  };
}

export function validateQuery<T extends z.ZodType>(schema: T) {
  return (req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const query = Object.fromEntries(searchParams);
      const validated = schema.parse(query);
      
      return { success: true, data: validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '查询参数验证失败',
            details: error.errors,
          },
        };
      }
      throw error;
    }
  };
}
```

#### 2.3 使用示例

```typescript
// app/api/customers/route.ts
import { validateRequestBody } from '@/lib/middleware/validation';
import { customerSchema } from '@/lib/validations/schemas';

export async function POST(req: NextRequest) {
  // 验证请求体
  const validation = await validateRequestBody(customerSchema)(req);
  
  if (!validation.success) {
    return NextResponse.json(validation.error, { status: 422 });
  }
  
  // 使用验证后的数据
  const customer = validation.data;
  
  // 处理业务逻辑...
}
```

---

### 3. CSRF 保护

#### 3.1 Token生成

```typescript
// lib/security/csrf.ts
import { randomBytes, createHash } from 'crypto';

export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

export function generateCSRFHash(token: string, salt: string): string {
  return createHash('sha256')
    .update(token + salt)
    .digest('hex');
}

// 存储CSRF token
export class CSRFTokenManager {
  private static readonly TOKEN_HEADER = 'x-csrf-token';
  private static readonly COOKIE_NAME = 'csrf_token';
  
  static generateToken(userId: string): { token: string; hash: string } {
    const token = generateCSRFToken();
    const salt = Date.now().toString();
    const hash = generateCSRFHash(token, salt);
    
    return { token, hash };
  }
  
  static validateToken(token: string, hash: string): boolean {
    const expectedHash = generateCSRFHash(token, '');
    return hash === expectedHash;
  }
  
  static getTokenFromRequest(req: Request): string | null {
    return req.headers.get(this.TOKEN_HEADER);
  }
}
```

#### 3.2 CSRF中间件

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import { CSRFTokenManager } from '@/lib/security/csrf';

export function middleware(request: Request) {
  // 对写操作进行CSRF验证
  if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
    const token = CSRFTokenManager.getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'CSRF_TOKEN_MISSING',
          message: '缺少CSRF token',
        },
      }, { status: 403 });
    }
    
    // 验证token
    // ...
  }
  
  return NextResponse.next();
}
```

---

### 4. API签名验证

#### 4.1 签名生成

```typescript
// lib/security/signature.ts
import { createHmac } from 'crypto';

export function generateSignature(
  method: string,
  path: string,
  body: string,
  timestamp: string,
  secretKey: string
): string {
  const payload = `${method}${path}${body}${timestamp}`;
  return createHmac('sha256', secretKey)
    .update(payload)
    .digest('hex');
}

export function verifySignature(
  signature: string,
  payload: string,
  secretKey: string
): boolean {
  const expected = createHmac('sha256', secretKey)
    .update(payload)
    .digest('hex');
  
  return signature === expected;
}
```

#### 4.2 签名中间件

```typescript
// lib/middleware/apiSignature.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifySignature } from '@/lib/security/signature';

export function apiSignature(req: Request) {
  // 获取签名
  const signature = req.headers.get('x-signature');
  const timestamp = req.headers.get('x-timestamp');
  const apiKey = req.headers.get('x-api-key');
  
  if (!signature || !timestamp || !apiKey) {
    return {
      success: false,
      error: {
        code: 'SIGNATURE_MISSING',
        message: '缺少API签名信息',
      },
    };
  }
  
  // 验证时间戳 (5分钟内有效)
  const now = Date.now();
  const requestTime = parseInt(timestamp);
  if (Math.abs(now - requestTime) > 5 * 60 * 1000) {
    return {
      success: false,
      error: {
        code: 'TIMESTAMP_EXPIRED',
        message: '请求时间戳过期',
      },
    };
  }
  
  // 获取请求体
  const body = await req.text();
  
  // 构建签名payload
  const payload = `${req.method}${new URL(req.url).pathname}${body}${timestamp}`;
  
  // 验证签名
  const isValid = verifySignature(signature, payload, apiKey);
  
  if (!isValid) {
    return {
      success: false,
      error: {
        code: 'SIGNATURE_INVALID',
        message: 'API签名无效',
      },
    };
  }
  
  return { success: true };
}
```

---

## 📊 审计日志系统

### 5.1 审计日志设计

```typescript
// types/audit.ts
export enum AuditAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  EXPORT = 'export',
  IMPORT = 'import',
}

export enum AuditResource {
  USER = 'user',
  CUSTOMER = 'customer',
  TASK = 'task',
  CONFIG = 'config',
  SYSTEM = 'system',
}

export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: number;
}
```

### 5.2 审计日志实现

```typescript
// lib/audit/logger.ts
export class AuditLogger {
  static async log(params: {
    userId: string;
    action: AuditAction;
    resource: AuditResource;
    resourceId?: string;
    details?: Record<string, any>;
    req?: Request;
  }) {
    const log: AuditLog = {
      id: `audit_${Date.now()}_${Math.random()}`,
      userId: params.userId,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      details: params.details || {},
      ipAddress: params.req?.headers.get('x-forwarded-for') || 'unknown',
      userAgent: params.req?.headers.get('user-agent') || 'unknown',
      timestamp: Date.now(),
    };
    
    // 保存到数据库
    await db.auditLog.create({ data: log });
    
    // 触发告警检查
    await this.checkAlerts(log);
  }
  
  private static async checkAlerts(log: AuditLog) {
    // 异常登录检测
    if (log.action === AuditAction.LOGIN) {
      const recentLogins = await db.auditLog.count({
        where: {
          userId: log.userId,
          action: AuditAction.LOGIN,
          timestamp: { gte: Date.now() - 10 * 60 * 1000 },
        },
      });
      
      if (recentLogins > 5) {
        await securityAlert({
          type: 'suspicious_login',
          message: `用户 ${log.userId} 在10分钟内登录${recentLogins}次`,
          severity: 'high',
        });
      }
    }
    
    // 权限提升检测
    if (log.action === AuditAction.UPDATE && 
        log.details.roleChange) {
      await securityAlert({
        type: 'privilege_escalation',
        message: `用户 ${log.userId} 角色变更`,
        severity: 'medium',
      });
    }
  }
}
```

---

## 🚨 安全事件告警

### 6.1 告警类型

```typescript
// lib/security/alerts.ts
export enum SecurityAlertType {
  SUSPICIOUS_LOGIN = 'suspicious_login',        // 可疑登录
  PRIVILEGE_ESCALATION = 'privilege_escalation', // 权限提升
  BULK_OPERATION = 'bulk_operation',            // 批量操作
  API_ABUSE = 'api_abuse',                      // API滥用
  DATA_BREACH = 'data_breach',                  // 数据泄露
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface SecurityAlert {
  id: string;
  type: SecurityAlertType;
  message: string;
  severity: AlertSeverity;
  details: Record<string, any>;
  timestamp: number;
  acknowledged: boolean;
}
```

### 6.2 告警实现

```typescript
// lib/security/notifier.ts
export async function securityAlert(params: {
  type: SecurityAlertType;
  message: string;
  severity: AlertSeverity;
  details?: Record<string, any>;
}) {
  const alert: SecurityAlert = {
    id: `alert_${Date.now()}_${Math.random()}`,
    type: params.type,
    message: params.message,
    severity: params.severity,
    details: params.details || {},
    timestamp: Date.now(),
    acknowledged: false,
  };
  
  // 保存到数据库
  await db.securityAlert.create({ data: alert });
  
  // 根据严重程度发送通知
  if (params.severity === 'high' || params.severity === 'critical') {
    // 发送邮件通知
    await sendEmail({
      to: getSecurityTeamEmail(),
      subject: `[安全告警] ${params.type}`,
      body: params.message,
    });
    
    // 发送Slack通知
    await sendSlackMessage({
      channel: '#security-alerts',
      text: `🚨 ${params.message}`,
    });
  }
}
```

---

## 🔍 安全扫描工具

### 7.1 npm audit

```bash
# 运行安全审计
bun audit

# 自动修复
bun audit fix

# 生成报告
bun audit --json > audit-report.json
```

### 7.2 Snyk

```bash
# 安装Snyk
bun install -g snyk

# 认证
snyk auth

# 扫描项目
snyk test

# 监控
snyk monitor
```

---

## 📋 实施计划

### Week 5: API安全

- [ ] Day 1: 速率限制实现
- [ ] Day 2: 输入验证实现
- [ ] Day 3: CSRF保护实现
- [ ] Day 4: API签名实现
- [ ] Day 5: 集成测试

### Week 6: 审计和监控

- [ ] Day 1: 审计日志实现
- [ ] Day 2: 安全告警实现
- [ ] Day 3: Snyk集成
- [ ] Day 4: 安全测试
- [ ] Day 5: 文档和总结

---

## ✅ 验收标准

### 功能完整性

- [ ] 所有API端点都有速率限制
- [ ] 所有输入都经过验证
- [ ] 所有写操作都有CSRF保护
- [ ] 敏感API都有签名验证

### 安全性

- [ ] 通过Snyk安全扫描
- [ ] 通过npm audit检查
- [ ] 无高危漏洞
- [ ] 审计日志完整

### 性能

- [ ] 中间件延迟 < 5ms
- [ ] 验证延迟 < 2ms
- [ ] 签名验证 < 3ms

---

**维护团队**: YYC³ Security Team
**预计开始**: 2026-01-03
**预计完成**: 2026-01-17
**下一个任务**: Phase 2 核心完善
