/**
 * Audit Logging System
 * 审计日志系统
 *
 * 记录所有重要操作和安全事件
 */

/**
 * 审计操作类型
 */
export enum AuditAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  EXPORT = 'export',
  IMPORT = 'import',
  SHARE = 'share',
  PERMISSION_CHANGE = 'permission_change',
  ROLE_CHANGE = 'role_change',
  PASSWORD_CHANGE = 'password_change',
  API_KEY_CREATE = 'api_key_create',
  API_KEY_REVOKE = 'api_key_revoke',
}

/**
 * 审计资源类型
 */
export enum AuditResource {
  USER = 'user',
  CUSTOMER = 'customer',
  TASK = 'task',
  WORKFLOW = 'workflow',
  CONFIG = 'config',
  SYSTEM = 'system',
  API_KEY = 'api_key',
  DATA = 'data',
}

/**
 * 审计日志级别
 */
export enum AuditLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * 审计日志条目
 */
export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  level: AuditLevel;
  details: Record<string, any>;
  result: 'success' | 'failure';
  ipAddress: string;
  userAgent: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * 审计日志存储接口
 */
interface AuditLogStore {
  create(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog>;
  findById(id: string): Promise<AuditLog | null>;
  findByUserId(userId: string, limit?: number): Promise<AuditLog[]>;
  findByDateRange(startDate: number, endDate: number, limit?: number): Promise<AuditLog[]>;
  findRecent(limit: number): Promise<AuditLog[]>;
  count(filters?: AuditLogFilters): Promise<number>;
  deleteOldLogs(beforeDate: number): Promise<number>;
}

interface AuditLogFilters {
  userId?: string;
  action?: AuditAction;
  resource?: AuditResource;
  level?: AuditLevel;
  result?: 'success' | 'failure';
  startDate?: number;
  endDate?: number;
}

/**
 * 内存审计日志存储 (开发环境)
 */
class MemoryAuditLogStore implements AuditLogStore {
  private logs: AuditLog[] = [];
  private idCounter = 0;

  async create(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const newLog: AuditLog = {
      ...log,
      id: `audit_${++this.idCounter}_${Date.now()}`,
      timestamp: Date.now(),
    };

    this.logs.push(newLog);

    // 保持最多10000条日志
    if (this.logs.length > 10000) {
      this.logs = this.logs.slice(-10000);
    }

    return newLog;
  }

  async findById(id: string): Promise<AuditLog | null> {
    return this.logs.find(log => log.id === id) || null;
  }

  async findByUserId(userId: string, limit: number = 100): Promise<AuditLog[]> {
    return this.logs
      .filter(log => log.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  async findByDateRange(startDate: number, endDate: number, limit: number = 1000): Promise<AuditLog[]> {
    return this.logs
      .filter(log => log.timestamp >= startDate && log.timestamp <= endDate)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  async findRecent(limit: number = 100): Promise<AuditLog[]> {
    return this.logs
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  async count(filters?: AuditLogFilters): Promise<number> {
    let filtered = this.logs;

    if (filters) {
      if (filters.userId) {
        filtered = filtered.filter(log => log.userId === filters.userId);
      }
      if (filters.action) {
        filtered = filtered.filter(log => log.action === filters.action);
      }
      if (filters.resource) {
        filtered = filtered.filter(log => log.resource === filters.resource);
      }
      if (filters.level) {
        filtered = filtered.filter(log => log.level === filters.level);
      }
      if (filters.result) {
        filtered = filtered.filter(log => log.result === filters.result);
      }
      if (filters.startDate) {
        filtered = filtered.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filtered = filtered.filter(log => log.timestamp <= filters.endDate!);
      }
    }

    return filtered.length;
  }

  async deleteOldLogs(beforeDate: number): Promise<number> {
    const initialLength = this.logs.length;
    this.logs = this.logs.filter(log => log.timestamp >= beforeDate);
    return initialLength - this.logs.length;
  }
}

/**
 * 审计日志记录器
 */
export class AuditLogger {
  private store: AuditLogStore;
  private alertCallbacks: Map<string, (log: AuditLog) => void> = new Map();

  constructor(store?: AuditLogStore) {
    this.store = store || new MemoryAuditLogStore();
  }

  /**
   * 记录审计日志
   */
  async log(params: {
    userId: string;
    action: AuditAction;
    resource: AuditResource;
    resourceId?: string;
    level?: AuditLevel;
    details?: Record<string, any>;
    result?: 'success' | 'failure';
    req?: Request;
    metadata?: Record<string, any>;
  }): Promise<AuditLog> {
    const log: Omit<AuditLog, 'id' | 'timestamp'> = {
      userId: params.userId,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      level: params.level || AuditLevel.INFO,
      details: params.details || {},
      result: params.result || 'success',
      ipAddress: this.extractIPAddress(params.req),
      userAgent: this.extractUserAgent(params.req),
      metadata: params.metadata,
    };

    // 保存到存储
    const savedLog = await this.store.create(log);

    // 检查是否需要告警
    await this.checkAlerts(savedLog);

    return savedLog;
  }

  /**
   * 批量记录日志
   */
  async logBatch(logs: Array<{
    userId: string;
    action: AuditAction;
    resource: AuditResource;
    resourceId?: string;
    level?: AuditLevel;
    details?: Record<string, any>;
    result?: 'success' | 'failure';
    req?: Request;
  }>): Promise<AuditLog[]> {
    const promises = logs.map(log => this.log(log));
    return Promise.all(promises);
  }

  /**
   * 查询审计日志
   */
  async query(filters?: AuditLogFilters, limit: number = 100): Promise<AuditLog[]> {
    if (filters?.userId) {
      return this.store.findByUserId(filters.userId, limit);
    }

    if (filters?.startDate || filters?.endDate) {
      return this.store.findByDateRange(
        filters.startDate || 0,
        filters.endDate || Date.now(),
        limit
      );
    }

    return this.store.findRecent(limit);
  }

  /**
   * 获取日志统计
   */
  async getStats(filters?: AuditLogFilters): Promise<{
    total: number;
    byAction: Record<string, number>;
    byResource: Record<string, number>;
    byLevel: Record<string, number>;
    byResult: Record<string, number>;
  }> {
    const logs = await this.query(filters, 10000);

    const stats = {
      total: logs.length,
      byAction: {} as Record<string, number>,
      byResource: {} as Record<string, number>,
      byLevel: {} as Record<string, number>,
      byResult: {} as Record<string, number>,
    };

    for (const log of logs) {
      // 按操作统计
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;

      // 按资源统计
      stats.byResource[log.resource] = (stats.byResource[log.resource] || 0) + 1;

      // 按级别统计
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;

      // 按结果统计
      stats.byResult[log.result] = (stats.byResult[log.result] || 0) + 1;
    }

    return stats;
  }

  /**
   * 导出审计日志
   */
  async export(filters?: AuditLogFilters): Promise<{
    format: 'json';
    data: AuditLog[];
    exportedAt: number;
  }> {
    const logs = await this.query(filters, 10000);

    return {
      format: 'json',
      data: logs,
      exportedAt: Date.now(),
    };
  }

  /**
   * 清理旧日志
   */
  async cleanup(retentionDays: number = 90): Promise<number> {
    const cutoffDate = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
    return this.store.deleteOldLogs(cutoffDate);
  }

  /**
   * 注册告警回调
   */
  registerAlert(name: string, callback: (log: AuditLog) => void): void {
    this.alertCallbacks.set(name, callback);
  }

  /**
   * 注销告警回调
   */
  unregisterAlert(name: string): void {
    this.alertCallbacks.delete(name);
  }

  /**
   * 检查告警条件
   */
  private async checkAlerts(log: AuditLog): Promise<void> {
    // 异常登录检测
    if (log.action === AuditAction.LOGIN) {
      const recentLogins = await this.store.findByUserId(
        log.userId,
        10
      );

      const recentInLast10Minutes = recentLogins.filter(
        l => l.timestamp >= Date.now() - 10 * 60 * 1000
      );

      if (recentInLast10Minutes.length > 5) {
        this.triggerAlert({
          ...log,
          level: AuditLevel.WARNING,
          details: {
            ...log.details,
            alertReason: 'Excessive login attempts',
            attemptCount: recentInLast10Minutes.length,
          },
        });
      }
    }

    // 权限变更检测
    if (log.action === AuditAction.ROLE_CHANGE || log.action === AuditAction.PERMISSION_CHANGE) {
      this.triggerAlert({
        ...log,
        level: AuditLevel.WARNING,
        details: {
          ...log.details,
          alertReason: 'Privilege change detected',
        },
      });
    }

    // API密钥操作
    if (log.action === AuditAction.API_KEY_CREATE || log.action === AuditAction.API_KEY_REVOKE) {
      this.triggerAlert({
        ...log,
        level: AuditLevel.INFO,
        details: {
          ...log.details,
          alertReason: 'API key operation',
        },
      });
    }

    // 失败操作检测
    if (log.result === 'failure' && log.level === AuditLevel.ERROR) {
      this.triggerAlert({
        ...log,
        level: AuditLevel.ERROR,
        details: {
          ...log.details,
          alertReason: 'Operation failed',
        },
      });
    }
  }

  /**
   * 触发告警
   */
  private triggerAlert(log: AuditLog): void {
    for (const callback of this.alertCallbacks.values()) {
      try {
        callback(log);
      } catch (error) {
        console.error('Alert callback error:', error);
      }
    }
  }

  /**
   * 提取IP地址
   */
  private extractIPAddress(req?: Request): string {
    if (!req) return 'system';

    return (
      req.headers.get('x-forwarded-for')?.split(',')[0] ||
      req.headers.get('x-real-ip') ||
      'unknown'
    );
  }

  /**
   * 提取User Agent
   */
  private extractUserAgent(req?: Request): string {
    if (!req) return 'system';

    return req.headers.get('user-agent') || 'unknown';
  }
}

/**
 * 默认审计日志记录器实例
 */
export const auditLogger = new AuditLogger();

/**
 * 便捷函数：记录操作
 */
export async function logOperation(params: {
  userId: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  details?: Record<string, any>;
  result?: 'success' | 'failure';
  req?: Request;
}): Promise<AuditLog> {
  return auditLogger.log(params);
}

/**
 * 便捷函数：记录登录
 */
export async function logLogin(
  userId: string,
  result: 'success' | 'failure',
  req?: Request
): Promise<AuditLog> {
  return auditLogger.log({
    userId,
    action: AuditAction.LOGIN,
    resource: AuditResource.USER,
    resourceId: userId,
    result,
    level: result === 'success' ? AuditLevel.INFO : AuditLevel.WARNING,
    details: { event: 'login_attempt' },
    req,
  });
}

/**
 * 便捷函数：记录登出
 */
export async function logLogout(userId: string, req?: Request): Promise<AuditLog> {
  return auditLogger.log({
    userId,
    action: AuditAction.LOGOUT,
    resource: AuditResource.USER,
    resourceId: userId,
    result: 'success',
    req,
  });
}

/**
 * 便捷函数：记录数据访问
 */
export async function logDataAccess(
  userId: string,
  resource: AuditResource,
  resourceId: string,
  action: AuditAction = AuditAction.READ,
  req?: Request
): Promise<AuditLog> {
  return auditLogger.log({
    userId,
    action,
    resource,
    resourceId,
    result: 'success',
    details: { event: 'data_access' },
    req,
  });
}
