/**
 * Security Alert System
 * 安全事件告警系统
 *
 * 检测和响应安全事件
 */

import { auditLogger, AuditLog, AuditLevel } from '../audit/logger';

/**
 * 安全告警类型
 */
export enum SecurityAlertType {
  SUSPICIOUS_LOGIN = 'suspicious_login',              // 可疑登录
  BRUTE_FORCE_ATTACK = 'brute_force_attack',          // 暴力破解攻击
  PRIVILEGE_ESCALATION = 'privilege_escalation',      // 权限提升
  BULK_OPERATION = 'bulk_operation',                  // 批量操作
  API_ABUSE = 'api_abuse',                            // API滥用
  DATA_BREACH = 'data_breach',                        // 数据泄露
  MALICIOUS_PAYLOAD = 'malicious_payload',            // 恶意载荷
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',        // 超过速率限制
  INVALID_SIGNATURE = 'invalid_signature',            // 无效签名
  CSRF_DETECTED = 'csrf_detected',                    // CSRF攻击
  SQL_INJECTION_ATTEMPT = 'sql_injection_attempt',    // SQL注入尝试
  XSS_ATTEMPT = 'xss_attempt',                        // XSS攻击尝试
  UNAUTHORIZED_ACCESS = 'unauthorized_access',        // 未授权访问
}

/**
 * 告警严重程度
 */
export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * 安全告警
 */
export interface SecurityAlert {
  id: string;
  type: SecurityAlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  details: Record<string, any>;
  sourceIp: string;
  userId?: string;
  timestamp: number;
  acknowledged: boolean;
  resolved: boolean;
  resolvedAt?: number;
  resolvedBy?: string;
}

/**
 * 告警通知渠道
 */
interface NotificationChannel {
  name: string;
  send: (alert: SecurityAlert) => Promise<void>;
}

/**
 * 邮件通知渠道
 */
class EmailNotificationChannel implements NotificationChannel {
  name = 'email';

  constructor(
    private config: {
      smtpHost: string;
      smtpPort: number;
      username: string;
      password: string;
      from: string;
      to: string[];
    }
  ) {}

  async send(alert: SecurityAlert): Promise<void> {
    // TODO: 实现邮件发送
    // 这里可以使用nodemailer或其他邮件库
    console.log(`[EMAIL] Sending alert: ${alert.title}`);
  }
}

/**
 * Slack通知渠道
 */
class SlackNotificationChannel implements NotificationChannel {
  name = 'slack';

  constructor(private webhookUrl: string) {}

  async send(alert: SecurityAlert): Promise<void> {
    const severityEmoji = {
      [AlertSeverity.LOW]: '🟢',
      [AlertSeverity.MEDIUM]: '🟡',
      [AlertSeverity.HIGH]: '🟠',
      [AlertSeverity.CRITICAL]: '🔴',
    };

    const message = {
      text: `${severityEmoji[alert.severity]} ${alert.title}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${severityEmoji[alert.severity]} ${alert.title}`,
          },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Type:*\n${alert.type}` },
            { type: 'mrkdwn', text: `*Severity:*\n${alert.severity}` },
            { type: 'mrkdwn', text: `*IP:*\n${alert.sourceIp}` },
            { type: 'mrkdwn', text: `*Time:*\n${new Date(alert.timestamp).toISOString()}` },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Message:*\n${alert.message}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Details:*\n\`\`\`${JSON.stringify(alert.details, null, 2)}\`\`\``,
          },
        },
      ],
    };

    // TODO: 发送到Slack webhook
    console.log(`[SLACK] Sending alert: ${alert.title}`, message);
  }
}

/**
 * Webhook通知渠道
 */
class WebhookNotificationChannel implements NotificationChannel {
  name = 'webhook';

  constructor(private url: string) {}

  async send(alert: SecurityAlert): Promise<void> {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Webhook notification error:', error);
    }
  }
}

/**
 * 安全告警管理器
 */
export class SecurityAlertManager {
  private alerts: Map<string, SecurityAlert> = new Map();
  private channels: Map<string, NotificationChannel> = new Map();
  private alertRules: Map<SecurityAlertType, AlertRule> = new Map();
  private idCounter = 0;

  constructor() {
    // 注册默认告警规则
    this.registerDefaultRules();

    // 集成审计日志
    auditLogger.registerAlert('security', this.handleAuditLog.bind(this));
  }

  /**
   * 注册通知渠道
   */
  registerChannel(channel: NotificationChannel): void {
    this.channels.set(channel.name, channel);
  }

  /**
   * 注销通知渠道
   */
  unregisterChannel(name: string): void {
    this.channels.delete(name);
  }

  /**
   * 创建安全告警
   */
  async createAlert(params: {
    type: SecurityAlertType;
    severity: AlertSeverity;
    title: string;
    message: string;
    details?: Record<string, any>;
    sourceIp: string;
    userId?: string;
  }): Promise<SecurityAlert> {
    const alert: SecurityAlert = {
      id: `alert_${++this.idCounter}_${Date.now()}`,
      type: params.type,
      severity: params.severity,
      title: params.title,
      message: params.message,
      details: params.details || {},
      sourceIp: params.sourceIp,
      userId: params.userId,
      timestamp: Date.now(),
      acknowledged: false,
      resolved: false,
    };

    // 保存告警
    this.alerts.set(alert.id, alert);

    // 发送通知
    await this.sendNotifications(alert);

    return alert;
  }

  /**
   * 确认告警
   */
  acknowledgeAlert(alertId: string, userId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  /**
   * 解决告警
   */
  resolveAlert(alertId: string, userId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = Date.now();
      alert.resolvedBy = userId;
      return true;
    }
    return false;
  }

  /**
   * 获取告警
   */
  getAlert(alertId: string): SecurityAlert | undefined {
    return this.alerts.get(alertId);
  }

  /**
   * 获取所有告警
   */
  getAllAlerts(filters?: {
    type?: SecurityAlertType;
    severity?: AlertSeverity;
    acknowledged?: boolean;
    resolved?: boolean;
    startDate?: number;
    endDate?: number;
  }): SecurityAlert[] {
    let alerts = Array.from(this.alerts.values());

    if (filters) {
      if (filters.type) {
        alerts = alerts.filter(a => a.type === filters.type);
      }
      if (filters.severity) {
        alerts = alerts.filter(a => a.severity === filters.severity);
      }
      if (filters.acknowledged !== undefined) {
        alerts = alerts.filter(a => a.acknowledged === filters.acknowledged);
      }
      if (filters.resolved !== undefined) {
        alerts = alerts.filter(a => a.resolved === filters.resolved);
      }
      if (filters.startDate) {
        alerts = alerts.filter(a => a.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        alerts = alerts.filter(a => a.timestamp <= filters.endDate!);
      }
    }

    return alerts.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * 获取告警统计
   */
  getStats(): {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    unacknowledged: number;
    unresolved: number;
  } {
    const alerts = Array.from(this.alerts.values());

    const stats = {
      total: alerts.length,
      byType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      unacknowledged: 0,
      unresolved: 0,
    };

    for (const alert of alerts) {
      // 按类型统计
      stats.byType[alert.type] = (stats.byType[alert.type] || 0) + 1;

      // 按严重程度统计
      stats.bySeverity[alert.severity] = (stats.bySeverity[alert.severity] || 0) + 1;

      // 未确认统计
      if (!alert.acknowledged) {
        stats.unacknowledged++;
      }

      // 未解决统计
      if (!alert.resolved) {
        stats.unresolved++;
      }
    }

    return stats;
  }

  /**
   * 清理旧告警
   */
  cleanup(retentionDays: number = 30): number {
    const cutoffDate = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
    let count = 0;

    for (const [id, alert] of this.alerts.entries()) {
      if (alert.resolved && alert.resolvedAt && alert.resolvedAt < cutoffDate) {
        this.alerts.delete(id);
        count++;
      }
    }

    return count;
  }

  /**
   * 处理审计日志
   */
  private async handleAuditLog(log: AuditLog): Promise<void> {
    // 根据审计日志检测安全事件
    const rule = this.alertRules.get(log.action as any);

    if (rule) {
      await rule.check(log, this);
    }
  }

  /**
   * 注册告警规则
   */
  registerRule(type: SecurityAlertType, rule: AlertRule): void {
    this.alertRules.set(type, rule);
  }

  /**
   * 注册默认告警规则
   */
  private registerDefaultRules(): void {
    // 可疑登录检测
    this.registerRule(SecurityAlertType.SUSPICIOUS_LOGIN, {
      check: async (log, manager) => {
        if (log.action === 'login' && log.result === 'failure') {
          const recentFailures = await auditLogger.query({
            userId: log.userId,
            action: log.action,
            result: 'failure',
            startDate: Date.now() - 10 * 60 * 1000,
          }, 10);

          if (recentFailures.length >= 5) {
            await manager.createAlert({
              type: SecurityAlertType.SUSPICIOUS_LOGIN,
              severity: AlertSeverity.HIGH,
              title: 'Suspicious Login Activity',
              message: `User ${log.userId} has ${recentFailures.length} failed login attempts in the last 10 minutes`,
              details: {
                userId: log.userId,
                attemptCount: recentFailures.length,
                timeWindow: '10 minutes',
              },
              sourceIp: log.ipAddress,
              userId: log.userId,
            });
          }
        }
      },
    });

    // 权限提升检测
    this.registerRule(SecurityAlertType.PRIVILEGE_ESCALATION, {
      check: async (log, manager) => {
        if (log.action === 'role_change' || log.action === 'permission_change') {
          await manager.createAlert({
            type: SecurityAlertType.PRIVILEGE_ESCALATION,
            severity: AlertSeverity.MEDIUM,
            title: 'Privilege Escalation Detected',
            message: `User ${log.userId} has changed privileges`,
            details: log.details,
            sourceIp: log.ipAddress,
            userId: log.userId,
          });
        }
      },
    });

    // 批量操作检测
    this.registerRule(SecurityAlertType.BULK_OPERATION, {
      check: async (log, manager) => {
        const recentOperations = await auditLogger.query({
          userId: log.userId,
          action: log.action,
          startDate: Date.now() - 60 * 1000,
        }, 50);

        if (recentOperations.length >= 50) {
          await manager.createAlert({
            type: SecurityAlertType.BULK_OPERATION,
            severity: AlertSeverity.MEDIUM,
            title: 'Bulk Operation Detected',
            message: `User ${log.userId} performed ${recentOperations.length} operations in 1 minute`,
            details: {
              userId: log.userId,
              operationCount: recentOperations.length,
              action: log.action,
            },
            sourceIp: log.ipAddress,
            userId: log.userId,
          });
        }
      },
    });
  }

  /**
   * 发送通知
   */
  private async sendNotifications(alert: SecurityAlert): Promise<void> {
    // 只为高严重性告警发送通知
    if (alert.severity === AlertSeverity.HIGH || alert.severity === AlertSeverity.CRITICAL) {
      const promises = Array.from(this.channels.values()).map(channel => channel.send(alert));

      await Promise.allSettled(promises);
    }
  }
}

/**
 * 告警规则接口
 */
interface AlertRule {
  check: (log: AuditLog, manager: SecurityAlertManager) => Promise<void>;
}

/**
 * 默认安全管理器实例
 */
export const securityAlertManager = new SecurityAlertManager();

/**
 * 便捷函数：创建安全告警
 */
export async function createSecurityAlert(params: {
  type: SecurityAlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  details?: Record<string, any>;
  sourceIp: string;
  userId?: string;
}): Promise<SecurityAlert> {
  return securityAlertManager.createAlert(params);
}

/**
 * 便捷函数：检测SQL注入
 */
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /(\bor\b|\band\b).*?=/i,
    /exec(\s|\+)+(s|x)p\w+/i,
    /union(\s|\+).*?select/i,
    /select(\s|\+).*?from/i,
    /insert(\s|\+).*?into/i,
    /delete(\s|\+).*?from/i,
    /update(\s|\+).*?set/i,
    /drop(\s|\+).*?table/i,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * 便捷函数：检测XSS攻击
 */
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,  // 事件处理器
    /<.*?on\w+.*?>/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * 辅助函数：从Request提取IP
 */
export function extractIPFromRequest(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}
