/**
 * SecurityManager - 安全管理组件
 * 
 * 系统安全守护者,提供:
 * - 身份认证 (JWT, OAuth, SSO)
 * - 权限授权 (RBAC, ABAC)
 * - 数据加密
 * - 安全审计
 * - 速率限制
 * - 攻击防护
 * 
 * @author YYC³ AI开发团队
 * @version 1.0.0
 * @standard YYC³团队标准化规范 v1.1.0
 */

import { EventEmitter } from 'events';
import * as crypto from 'crypto';

// ==================== 类型定义 ====================

/**
 * 认证方法
 */
export enum AuthMethod {
  JWT = 'jwt',
  OAUTH = 'oauth',
  SSO = 'sso',
  API_KEY = 'api_key',
  BASIC = 'basic'
}

/**
 * 用户角色
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  GUEST = 'guest'
}

/**
 * 权限
 */
export enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin'
}

/**
 * 用户信息
 */
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  roles: UserRole[];
  permissions: Permission[];
  metadata?: Record<string, any>;
}

/**
 * 认证令牌
 */
export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}

/**
 * 安全配置
 */
export interface SecurityConfig {
  jwtSecret: string;
  tokenExpiry?: number;
  refreshTokenExpiry?: number;
  enableRateLimit?: boolean;
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
  enableCSRFProtection?: boolean;
  enableXSSProtection?: boolean;
  encryptionAlgorithm?: string;
  hashAlgorithm?: string;
}

/**
 * 审计日志
 */
export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  result: 'success' | 'failure';
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * 速率限制记录
 */
interface RateLimitRecord {
  count: number;
  resetTime: Date;
}

// ==================== 主类实现 ====================

/**
 * 安全管理器
 */
export class SecurityManager extends EventEmitter {
  private config: SecurityConfig;
  private userSessions: Map<string, UserInfo>;
  private rateLimitMap: Map<string, RateLimitRecord>;
  private auditLogs: AuditLog[];
  private blacklistedTokens: Set<string>;

  constructor(config: SecurityConfig) {
    super();
    
    this.config = {
      tokenExpiry: 3600,
      refreshTokenExpiry: 86400,
      enableRateLimit: true,
      rateLimit: {
        windowMs: 60000,
        maxRequests: 100
      },
      enableCSRFProtection: true,
      enableXSSProtection: true,
      encryptionAlgorithm: 'aes-256-gcm',
      hashAlgorithm: 'sha256',
      ...config
    };

    this.userSessions = new Map();
    this.rateLimitMap = new Map();
    this.auditLogs = [];
    this.blacklistedTokens = new Set();

    this.startCleanupTimer();
  }

  // ==================== 认证管理 ====================

  /**
   * 创建JWT令牌
   */
  createJWT(user: UserInfo): AuthToken {
    const payload = {
      userId: user.id,
      username: user.username,
      roles: user.roles,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.config.tokenExpiry!
    };

    const accessToken = this.generateToken(payload);
    const refreshToken = this.generateToken({
      userId: user.id,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.config.refreshTokenExpiry!
    });

    this.userSessions.set(accessToken, user);

    this.logAudit({
      userId: user.id,
      action: 'create_token',
      resource: 'auth',
      result: 'success'
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.config.tokenExpiry!,
      tokenType: 'Bearer'
    };
  }

  /**
   * 验证JWT令牌
   */
  verifyJWT(token: string): UserInfo | null {
    if (this.blacklistedTokens.has(token)) {
      this.emit('authFailed', { reason: 'token_blacklisted' });
      return null;
    }

    try {
      const payload = this.verifyToken(token);
      
      if (!payload || payload.exp < Math.floor(Date.now() / 1000)) {
        this.emit('authFailed', { reason: 'token_expired' });
        return null;
      }

      const user = this.userSessions.get(token);
      
      if (!user) {
        this.emit('authFailed', { reason: 'session_not_found' });
        return null;
      }

      return user;
    } catch (error) {
      this.emit('authFailed', { reason: 'invalid_token', error });
      return null;
    }
  }

  /**
   * 刷新令牌
   */
  refreshToken(refreshToken: string): AuthToken | null {
    try {
      const payload = this.verifyToken(refreshToken);
      
      if (!payload || payload.type !== 'refresh') {
        return null;
      }

      // 查找用户
      let user: UserInfo | undefined;
      for (const [token, u] of this.userSessions.entries()) {
        if (u.id === payload.userId) {
          user = u;
          this.userSessions.delete(token); // 删除旧token
          break;
        }
      }

      if (!user) {
        return null;
      }

      return this.createJWT(user);
    } catch (error) {
      return null;
    }
  }

  /**
   * 撤销令牌
   */
  revokeToken(token: string): void {
    this.blacklistedTokens.add(token);
    this.userSessions.delete(token);
    
    this.emit('tokenRevoked', { token });
  }

  // ==================== 权限管理 ====================

  /**
   * 检查权限
   */
  hasPermission(user: UserInfo, permission: Permission): boolean {
    // 管理员有所有权限
    if (user.roles.includes(UserRole.ADMIN)) {
      return true;
    }

    return user.permissions.includes(permission);
  }

  /**
   * 检查角色
   */
  hasRole(user: UserInfo, role: UserRole): boolean {
    return user.roles.includes(role);
  }

  /**
   * 授权检查
   */
  authorize(token: string, requiredPermission: Permission): boolean {
    const user = this.verifyJWT(token);
    
    if (!user) {
      this.logAudit({
        userId: 'unknown',
        action: 'authorize',
        resource: requiredPermission,
        result: 'failure'
      });
      return false;
    }

    const hasPermission = this.hasPermission(user, requiredPermission);
    
    this.logAudit({
      userId: user.id,
      action: 'authorize',
      resource: requiredPermission,
      result: hasPermission ? 'success' : 'failure'
    });

    return hasPermission;
  }

  // ==================== 加密/解密 ====================

  /**
   * 加密数据
   */
  encrypt(data: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      this.config.encryptionAlgorithm!,
      Buffer.from(this.config.jwtSecret.padEnd(32, '0').slice(0, 32)),
      iv
    );

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = (cipher as any).getAuthTag().toString('hex');

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag
    };
  }

  /**
   * 解密数据
   */
  decrypt(encrypted: string, iv: string, tag: string): string {
    const decipher = crypto.createDecipheriv(
      this.config.encryptionAlgorithm!,
      Buffer.from(this.config.jwtSecret.padEnd(32, '0').slice(0, 32)),
      Buffer.from(iv, 'hex')
    );

    (decipher as any).setAuthTag(Buffer.from(tag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * 哈希数据
   */
  hash(data: string): string {
    return crypto
      .createHash(this.config.hashAlgorithm!)
      .update(data)
      .digest('hex');
  }

  /**
   * 验证哈希
   */
  verifyHash(data: string, hash: string): boolean {
    return this.hash(data) === hash;
  }

  // ==================== 速率限制 ====================

  /**
   * 检查速率限制
   */
  checkRateLimit(identifier: string): boolean {
    if (!this.config.enableRateLimit) {
      return true;
    }

    const record = this.rateLimitMap.get(identifier);
    const now = new Date();

    if (!record) {
      this.rateLimitMap.set(identifier, {
        count: 1,
        resetTime: new Date(now.getTime() + this.config.rateLimit!.windowMs)
      });
      return true;
    }

    if (now > record.resetTime) {
      this.rateLimitMap.set(identifier, {
        count: 1,
        resetTime: new Date(now.getTime() + this.config.rateLimit!.windowMs)
      });
      return true;
    }

    if (record.count >= this.config.rateLimit!.maxRequests) {
      this.emit('rateLimitExceeded', { identifier, count: record.count });
      return false;
    }

    record.count++;
    return true;
  }

  // ==================== 安全防护 ====================

  /**
   * 生成CSRF令牌
   */
  generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * 验证CSRF令牌
   */
  verifyCSRFToken(token: string, storedToken: string): boolean {
    if (!this.config.enableCSRFProtection) {
      return true;
    }

    return crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from(storedToken)
    );
  }

  /**
   * XSS防护 - 清理输入
   */
  sanitizeInput(input: string): string {
    if (!this.config.enableXSSProtection) {
      return input;
    }

    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // ==================== 审计日志 ====================

  /**
   * 记录审计日志
   */
  private logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const auditLog: AuditLog = {
      id: crypto.randomBytes(16).toString('hex'),
      timestamp: new Date(),
      ...log
    };

    this.auditLogs.push(auditLog);
    this.emit('audit', auditLog);

    // 限制日志数量
    if (this.auditLogs.length > 10000) {
      this.auditLogs = this.auditLogs.slice(-5000);
    }
  }

  /**
   * 获取审计日志
   */
  getAuditLogs(filter?: {
    userId?: string;
    action?: string;
    result?: 'success' | 'failure';
    startDate?: Date;
    endDate?: Date;
  }): AuditLog[] {
    let logs = this.auditLogs;

    if (filter) {
      logs = logs.filter(log => {
        if (filter.userId && log.userId !== filter.userId) return false;
        if (filter.action && log.action !== filter.action) return false;
        if (filter.result && log.result !== filter.result) return false;
        if (filter.startDate && log.timestamp < filter.startDate) return false;
        if (filter.endDate && log.timestamp > filter.endDate) return false;
        return true;
      });
    }

    return logs;
  }

  // ==================== 私有方法 ====================

  /**
   * 生成令牌
   */
  private generateToken(payload: any): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    
    const signature = crypto
      .createHmac('sha256', this.config.jwtSecret)
      .update(`${header}.${body}`)
      .digest('base64url');

    return `${header}.${body}.${signature}`;
  }

  /**
   * 验证令牌
   */
  private verifyToken(token: string): any {
    const [header, body, signature] = token.split('.');
    
    const expectedSignature = crypto
      .createHmac('sha256', this.config.jwtSecret)
      .update(`${header}.${body}`)
      .digest('base64url');

    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  }

  /**
   * 启动清理定时器
   */
  private startCleanupTimer(): void {
    setInterval(() => {
      this.cleanupExpiredSessions();
      this.cleanupRateLimits();
    }, 60000); // 每分钟清理一次
  }

  /**
   * 清理过期会话
   */
  private cleanupExpiredSessions(): void {
    const now = Math.floor(Date.now() / 1000);
    
    for (const [token] of this.userSessions.entries()) {
      try {
        const payload = this.verifyToken(token);
        if (payload.exp < now) {
          this.userSessions.delete(token);
        }
      } catch {
        this.userSessions.delete(token);
      }
    }
  }

  /**
   * 清理速率限制记录
   */
  private cleanupRateLimits(): void {
    const now = new Date();
    
    for (const [identifier, record] of this.rateLimitMap.entries()) {
      if (now > record.resetTime) {
        this.rateLimitMap.delete(identifier);
      }
    }
  }

  /**
   * 清理
   */
  public destroy(): void {
    this.userSessions.clear();
    this.rateLimitMap.clear();
    this.auditLogs = [];
    this.blacklistedTokens.clear();
    this.removeAllListeners();
  }
}
