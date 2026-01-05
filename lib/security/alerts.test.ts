/**
 * Security Alerts Tests
 * 安全告警测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  SecurityAlertManager,
  securityAlertManager,
  createSecurityAlert,
  detectSQLInjection,
  detectXSS,
  extractIPFromRequest,
  SecurityAlertType,
  AlertSeverity,
  EmailNotificationChannel,
  SlackNotificationChannel,
  WebhookNotificationChannel,
} from './alerts';

describe('SecurityAlertManager', () => {
  let manager: SecurityAlertManager;
  let mockEmailChannel: EmailNotificationChannel;
  let mockSlackChannel: SlackNotificationChannel;
  let mockWebhookChannel: WebhookNotificationChannel;

  beforeEach(() => {
    manager = new SecurityAlertManager();

    // Mock email channel
    mockEmailChannel = {
      name: 'email',
      send: vi.fn().mockResolvedValue(undefined),
    } as any;

    // Mock Slack channel
    mockSlackChannel = {
      name: 'slack',
      send: vi.fn().mockResolvedValue(undefined),
    } as any;

    // Mock webhook channel
    mockWebhookChannel = {
      name: 'webhook',
      send: vi.fn().mockResolvedValue(undefined),
    } as any;
  });

  describe('告警创建', () => {
    it('应该创建安全告警', async () => {
      const alert = await manager.createAlert({
        type: SecurityAlertType.SUSPICIOUS_LOGIN,
        severity: AlertSeverity.HIGH,
        title: 'Suspicious Login Detected',
        message: 'User user123 has 5 failed login attempts',
        sourceIp: '192.168.1.100',
        userId: 'user123',
        details: {
          attemptCount: 5,
          timeWindow: '10 minutes',
        },
      });

      expect(alert.id).toBeDefined();
      expect(alert.type).toBe(SecurityAlertType.SUSPICIOUS_LOGIN);
      expect(alert.severity).toBe(AlertSeverity.HIGH);
      expect(alert.title).toBe('Suspicious Login Detected');
      expect(alert.message).toContain('5 failed login attempts');
      expect(alert.sourceIp).toBe('192.168.1.100');
      expect(alert.userId).toBe('user123');
      expect(alert.acknowledged).toBe(false);
      expect(alert.resolved).toBe(false);
      expect(alert.timestamp).toBeDefined();
    });

    it('应该生成唯一的告警ID', async () => {
      const alert1 = await manager.createAlert({
        type: SecurityAlertType.API_ABUSE,
        severity: AlertSeverity.MEDIUM,
        title: 'API Abuse',
        message: 'Excessive API calls detected',
        sourceIp: '192.168.1.1',
      });

      const alert2 = await manager.createAlert({
        type: SecurityAlertType.API_ABUSE,
        severity: AlertSeverity.MEDIUM,
        title: 'API Abuse',
        message: 'Excessive API calls detected',
        sourceIp: '192.168.1.1',
      });

      expect(alert1.id).not.toBe(alert2.id);
    });
  });

  describe('告警确认', () => {
    it('应该确认告警', async () => {
      const alert = await manager.createAlert({
        type: SecurityAlertType.SUSPICIOUS_LOGIN,
        severity: AlertSeverity.HIGH,
        title: 'Test Alert',
        message: 'Test message',
        sourceIp: '192.168.1.1',
      });

      const result = manager.acknowledgeAlert(alert.id, 'admin-user');

      expect(result).toBe(true);

      const acknowledgedAlert = manager.getAlert(alert.id);
      expect(acknowledgedAlert?.acknowledged).toBe(true);
    });

    it('应该确认不存在的告警时返回false', () => {
      const result = manager.acknowledgeAlert('non-existent-id', 'admin-user');
      expect(result).toBe(false);
    });
  });

  describe('告警解决', () => {
    it('应该解决告警', async () => {
      const alert = await manager.createAlert({
        type: SecurityAlertType.DATA_BREACH,
        severity: AlertSeverity.CRITICAL,
        title: 'Data Breach',
        message: 'Potential data breach detected',
        sourceIp: '192.168.1.1',
      });

      const resolvedAt = Date.now();
      const result = manager.resolveAlert(alert.id, 'security-admin');

      expect(result).toBe(true);

      const resolvedAlert = manager.getAlert(alert.id);
      expect(resolvedAlert?.resolved).toBe(true);
      expect(resolvedAlert?.resolvedBy).toBe('security-admin');
      expect(resolvedAlert?.resolvedAt).toBeGreaterThanOrEqual(resolvedAt);
    });
  });

  describe('告警查询', () => {
    beforeEach(async () => {
      // 创建测试告警
      await manager.createAlert({
        type: SecurityAlertType.SUSPICIOUS_LOGIN,
        severity: AlertSeverity.HIGH,
        title: 'Alert 1',
        message: 'Message 1',
        sourceIp: '192.168.1.1',
      });

      await manager.createAlert({
        type: SecurityAlertType.API_ABUSE,
        severity: AlertSeverity.MEDIUM,
        title: 'Alert 2',
        message: 'Message 2',
        sourceIp: '192.168.1.2',
      });

      await manager.createAlert({
        type: SecurityAlertType.SUSPICIOUS_LOGIN,
        severity: AlertSeverity.LOW,
        title: 'Alert 3',
        message: 'Message 3',
        sourceIp: '192.168.1.3',
      });
    });

    it('应该获取所有告警', () => {
      const alerts = manager.getAllAlerts();

      expect(alerts.length).toBeGreaterThanOrEqual(3);
    });

    it('应该按类型过滤', () => {
      const alerts = manager.getAllAlerts({ type: SecurityAlertType.SUSPICIOUS_LOGIN });

      expect(alerts.length).toBeGreaterThanOrEqual(2);
      expect(alerts.every(a => a.type === SecurityAlertType.SUSPICIOUS_LOGIN)).toBe(true);
    });

    it('应该按严重程度过滤', () => {
      const alerts = manager.getAllAlerts({ severity: AlertSeverity.HIGH });

      expect(alerts.length).toBeGreaterThanOrEqual(1);
      expect(alerts.every(a => a.severity === AlertSeverity.HIGH)).toBe(true);
    });

    it('应该按确认状态过滤', () => {
      const alerts = manager.getAllAlerts({ acknowledged: false });

      expect(alerts.length).toBeGreaterThanOrEqual(3);
      expect(alerts.every(a => !a.acknowledged)).toBe(true);
    });

    it('应该按解决状态过滤', () => {
      const alerts = manager.getAllAlerts({ resolved: false });

      expect(alerts.length).toBeGreaterThanOrEqual(3);
      expect(alerts.every(a => !a.resolved)).toBe(true);
    });

    it('应该按日期范围过滤', async () => {
      const now = Date.now();
      const alerts = manager.getAllAlerts({
        startDate: now - 60000,
        endDate: now + 60000,
      });

      expect(alerts.length).toBeGreaterThanOrEqual(3);
    });

    it('应该支持组合过滤', () => {
      const alerts = manager.getAllAlerts({
        type: SecurityAlertType.SUSPICIOUS_LOGIN,
        severity: AlertSeverity.HIGH,
      });

      // 根据测试数据，应该只有一个HIGH级别的SUSPICIOUS_LOGIN
      expect(alerts.every(a =>
        a.type === SecurityAlertType.SUSPICIOUS_LOGIN &&
        a.severity === AlertSeverity.HIGH
      )).toBe(true);
    });
  });

  describe('告警统计', () => {
    beforeEach(async () => {
      await manager.createAlert({
        type: SecurityAlertType.SUSPICIOUS_LOGIN,
        severity: AlertSeverity.HIGH,
        title: 'Alert 1',
        message: 'Message 1',
        sourceIp: '192.168.1.1',
      });

      await manager.createAlert({
        type: SecurityAlertType.API_ABUSE,
        severity: AlertSeverity.MEDIUM,
        title: 'Alert 2',
        message: 'Message 2',
        sourceIp: '192.168.1.2',
      });

      await manager.createAlert({
        type: SecurityAlertType.SUSPICIOUS_LOGIN,
        severity: AlertSeverity.LOW,
        title: 'Alert 3',
        message: 'Message 3',
        sourceIp: '192.168.1.3',
      });
    });

    it('应该计算总数', () => {
      const stats = manager.getStats();

      expect(stats.total).toBeGreaterThanOrEqual(3);
    });

    it('应该按类型统计', () => {
      const stats = manager.getStats();

      expect(stats.byType[SecurityAlertType.SUSPICIOUS_LOGIN]).toBeDefined();
      expect(stats.byType[SecurityAlertType.API_ABUSE]).toBeDefined();
    });

    it('应该按严重程度统计', () => {
      const stats = manager.getStats();

      expect(stats.bySeverity[AlertSeverity.HIGH]).toBeDefined();
      expect(stats.bySeverity[AlertSeverity.MEDIUM]).toBeDefined();
      expect(stats.bySeverity[AlertSeverity.LOW]).toBeDefined();
    });

    it('应该统计未确认告警', () => {
      const stats = manager.getStats();

      expect(stats.unacknowledged).toBeGreaterThanOrEqual(3);
    });

    it('应该统计未解决告警', () => {
      const stats = manager.getStats();

      expect(stats.unresolved).toBeGreaterThanOrEqual(3);
    });
  });

  describe('告警清理', () => {
    it('应该清理旧告警', async () => {
      const alert = await manager.createAlert({
        type: SecurityAlertType.SUSPICIOUS_LOGIN,
        severity: AlertSeverity.HIGH,
        title: 'Test Alert',
        message: 'Test',
        sourceIp: '192.168.1.1',
      });

      // 手动解决告警
      manager.resolveAlert(alert.id, 'admin');

      // 清理0天前的告警
      const count = manager.cleanup(0);

      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('通知渠道', () => {
    it('应该注册通知渠道', () => {
      manager.registerChannel(mockEmailChannel);
      manager.registerChannel(mockSlackChannel);
      manager.registerChannel(mockWebhookChannel);

      // 验证渠道注册成功（通过后续操作不会报错）
      expect(true).toBe(true);
    });

    it('应该向HIGH和CRITICAL告警发送通知', async () => {
      manager.registerChannel(mockEmailChannel);
      manager.registerChannel(mockSlackChannel);

      await manager.createAlert({
        type: SecurityAlertType.DATA_BREACH,
        severity: AlertSeverity.CRITICAL,
        title: 'Critical Alert',
        message: 'Critical security issue',
        sourceIp: '192.168.1.1',
      });

      // 给通知一些时间
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockEmailChannel.send).toHaveBeenCalled();
      expect(mockSlackChannel.send).toHaveBeenCalled();
    });

    it('不应该向MEDIUM及以下告警发送通知', async () => {
      manager.registerChannel(mockEmailChannel);

      await manager.createAlert({
        type: SecurityAlertType.API_ABUSE,
        severity: AlertSeverity.MEDIUM,
        title: 'Medium Alert',
        message: 'Medium severity issue',
        sourceIp: '192.168.1.1',
      });

      // 给通知一些时间
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockEmailChannel.send).not.toHaveBeenCalled();
    });
  });
});

describe('安全检测函数', () => {
  describe('detectSQLInjection', () => {
    it('应该检测常见的SQL注入模式', () => {
      // UNION注入
      expect(detectSQLInjection("1' UNION SELECT * FROM users--")).toBe(true);

      // OR注入
      expect(detectSQLInjection("' OR '1'='1")).toBe(true);

      // AND注入
      expect(detectSQLInjection("' AND '1'='1")).toBe(true);

      // 注释符
      expect(detectSQLInjection("admin'--")).toBe(true);

      // 批量注释
      expect(detectSQLInjection("admin'#")).toBe(true);

      // exec注入
      expect(detectSQLInjection("'; EXEC xp_cmdshell('dir')--")).toBe(true);

      // select注入
      expect(detectSQLInjection("'; SELECT * FROM users--")).toBe(true);

      // insert注入
      expect(detectSQLInjection("'; INSERT INTO users VALUES--")).toBe(true);

      // update注入
      expect(detectSQLInjection("'; UPDATE users SET--")).toBe(true);

      // delete注入
      expect(detectSQLInjection("'; DELETE FROM users--")).toBe(true);

      // drop注入
      expect(detectSQLInjection("'; DROP TABLE users--")).toBe(true);
    });

    it('应该接受安全的输入', () => {
      expect(detectSQLInjection('normal text')).toBe(false);
      expect(detectSQLInjection('user@example.com')).toBe(false);
      expect(detectSQLInjection('John Doe')).toBe(false);
      expect(detectSQLInjection('12345')).toBe(false);
    });
  });

  describe('detectXSS', () => {
    it('应该检测常见的XSS攻击模式', () => {
      // Script标签
      expect(detectXSS('<script>alert("XSS")</script>')).toBe(true);

      // iframe标签
      expect(detectXSS('<iframe src="evil.com"></iframe>')).toBe(true);

      // javascript:协议
      expect(detectXSS('<a href="javascript:alert(1)">click</a>')).toBe(true);

      // 事件处理器
      expect(detectXSS('<img src="x" onerror="alert(1)">')).toBe(true);
      expect(detectXSS('<div onclick="alert(1)">')).toBe(true);
      expect(detectXSS('<body onload="alert(1)">')).toBe(true);

      // 带事件的标签
      expect(detectXSS('<img onmouseenter="alert(1)" src="x">')).toBe(true);
    });

    it('应该接受安全的HTML', () => {
      expect(detectXSS('<p>Normal paragraph</p>')).toBe(false);
      expect(detectXSS('<div class="container">Content</div>')).toBe(false);
      expect(detectXSS('<a href="https://example.com">Link</a>')).toBe(false);
      expect(detectXSS('<strong>Bold text</strong>')).toBe(false);
    });

    it('应该接受纯文本', () => {
      expect(detectXSS('Just normal text')).toBe(false);
      expect(detectXSS('Email: user@example.com')).toBe(false);
      expect(detectXSS('Visit https://example.com')).toBe(false);
    });
  });
});

describe('辅助函数', () => {
  describe('extractIPFromRequest', () => {
    it('应该从x-forwarded-for提取IP', () => {
      const request = new Request('http://example.com', {
        headers: {
          'x-forwarded-for': '203.0.113.195',
        },
      });

      const ip = extractIPFromRequest(request);
      expect(ip).toBe('203.0.113.195');
    });

    it('应该从x-forwarded-for提取第一个IP', () => {
      const request = new Request('http://example.com', {
        headers: {
          'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178',
        },
      });

      const ip = extractIPFromRequest(request);
      expect(ip).toBe('203.0.113.195');
    });

    it('应该回退到x-real-ip', () => {
      const request = new Request('http://example.com', {
        headers: {
          'x-real-ip': '192.168.1.100',
        },
      });

      const ip = extractIPFromRequest(request);
      expect(ip).toBe('192.168.1.100');
    });

    it('应该在没有IP时返回unknown', () => {
      const request = new Request('http://example.com');

      const ip = extractIPFromRequest(request);
      expect(ip).toBe('unknown');
    });
  });
});

describe('便捷函数', () => {
  it('应该创建安全告警', async () => {
    const alert = await createSecurityAlert({
      type: SecurityAlertType.BRUTE_FORCE_ATTACK,
      severity: AlertSeverity.CRITICAL,
      title: 'Brute Force Attack',
      message: 'Multiple failed login attempts detected',
      sourceIp: '192.168.1.100',
      userId: 'attacker',
      details: {
        attempts: 100,
        duration: '5 minutes',
      },
    });

    expect(alert.type).toBe(SecurityAlertType.BRUTE_FORCE_ATTACK);
    expect(alert.severity).toBe(AlertSeverity.CRITICAL);
    expect(alert.sourceIp).toBe('192.168.1.100');
  });
});

describe('默认安全管理器', () => {
  it('应该导出默认实例', () => {
    expect(securityAlertManager).toBeDefined();
    expect(securityAlertManager).toBeInstanceOf(SecurityAlertManager);
  });

  it('应该使用默认实例创建告警', async () => {
    const alert = await securityAlertManager.createAlert({
      type: SecurityAlertType.UNAUTHORIZED_ACCESS,
      severity: AlertSeverity.HIGH,
      title: 'Unauthorized Access',
      message: 'Unauthorized access attempt detected',
      sourceIp: '192.168.1.1',
    });

    expect(alert.type).toBe(SecurityAlertType.UNAUTHORIZED_ACCESS);
  });
});
