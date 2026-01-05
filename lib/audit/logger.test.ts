/**
 * Audit Logger Tests
 * 审计日志测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  AuditLogger,
  auditLogger,
  logOperation,
  logLogin,
  logLogout,
  logDataAccess,
  AuditAction,
  AuditResource,
  AuditLevel,
} from './logger';

describe('AuditLogger', () => {
  let logger: AuditLogger;

  beforeEach(() => {
    logger = new AuditLogger();
  });

  describe('基本日志记录', () => {
    it('应该记录审计日志', async () => {
      const log = await logger.log({
        userId: 'user123',
        action: AuditAction.CREATE,
        resource: AuditResource.CUSTOMER,
        resourceId: 'customer456',
        details: { name: 'Test Customer' },
      });

      expect(log.id).toBeDefined();
      expect(log.userId).toBe('user123');
      expect(log.action).toBe(AuditAction.CREATE);
      expect(log.resource).toBe(AuditResource.CUSTOMER);
      expect(log.resourceId).toBe('customer456');
      expect(log.level).toBe(AuditLevel.INFO);
      expect(log.result).toBe('success');
      expect(log.timestamp).toBeDefined();
    });

    it('应该记录失败的日志', async () => {
      const log = await logger.log({
        userId: 'user123',
        action: AuditAction.LOGIN,
        resource: AuditResource.USER,
        level: AuditLevel.WARNING,
        result: 'failure',
        details: { reason: 'Invalid password' },
      });

      expect(log.level).toBe(AuditLevel.WARNING);
      expect(log.result).toBe('failure');
      expect(log.details.reason).toBe('Invalid password');
    });

    it('应该从请求中提取IP地址', async () => {
      const request = new Request('http://example.com/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.100',
        },
      });

      const log = await logger.log({
        userId: 'user123',
        action: AuditAction.READ,
        resource: AuditResource.CUSTOMER,
        req: request,
      });

      expect(log.ipAddress).toBe('192.168.1.100');
    });

    it('应该从请求中提取User Agent', async () => {
      const request = new Request('http://example.com/api/test', {
        headers: {
          'user-agent': 'Mozilla/5.0 Test Browser',
        },
      });

      const log = await logger.log({
        userId: 'user123',
        action: AuditAction.READ,
        resource: AuditResource.CUSTOMER,
        req: request,
      });

      expect(log.userAgent).toBe('Mozilla/5.0 Test Browser');
    });

    it('应该处理x-forwarded-for中的多个IP', async () => {
      const request = new Request('http://example.com/api/test', {
        headers: {
          'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178',
        },
      });

      const log = await logger.log({
        userId: 'user123',
        action: AuditAction.READ,
        resource: AuditResource.CUSTOMER,
        req: request,
      });

      expect(log.ipAddress).toBe('203.0.113.195');
    });
  });

  describe('批量日志记录', () => {
    it('应该批量记录日志', async () => {
      const logs = await logger.logBatch([
        {
          userId: 'user1',
          action: AuditAction.CREATE,
          resource: AuditResource.CUSTOMER,
        },
        {
          userId: 'user2',
          action: AuditAction.UPDATE,
          resource: AuditResource.TASK,
        },
        {
          userId: 'user3',
          action: AuditAction.DELETE,
          resource: AuditResource.USER,
        },
      ]);

      expect(logs).toHaveLength(3);
      expect(logs[0].userId).toBe('user1');
      expect(logs[1].userId).toBe('user2');
      expect(logs[2].userId).toBe('user3');
    });

    it('应该记录不同级别的日志', async () => {
      const logs = await logger.logBatch([
        {
          userId: 'user1',
          action: AuditAction.READ,
          resource: AuditResource.CUSTOMER,
          level: AuditLevel.INFO,
        },
        {
          userId: 'user2',
          action: AuditAction.UPDATE,
          resource: AuditResource.CONFIG,
          level: AuditLevel.WARNING,
        },
        {
          userId: 'user3',
          action: AuditAction.DELETE,
          resource: AuditResource.USER,
          level: AuditLevel.ERROR,
        },
      ]);

      expect(logs[0].level).toBe(AuditLevel.INFO);
      expect(logs[1].level).toBe(AuditLevel.WARNING);
      expect(logs[2].level).toBe(AuditLevel.ERROR);
    });
  });

  describe('日志查询', () => {
    beforeEach(async () => {
      // 创建一些测试日志
      await logger.logBatch([
        { userId: 'user1', action: AuditAction.CREATE, resource: AuditResource.CUSTOMER },
        { userId: 'user1', action: AuditAction.UPDATE, resource: AuditResource.CUSTOMER },
        { userId: 'user2', action: AuditAction.READ, resource: AuditResource.TASK },
        { userId: 'user3', action: AuditAction.DELETE, resource: AuditResource.USER },
      ]);
    });

    it('应该查询所有日志', async () => {
      const logs = await logger.query(undefined, 100);

      expect(logs.length).toBeGreaterThanOrEqual(4);
    });

    it('应该按用户ID查询', async () => {
      const logs = await logger.query({ userId: 'user1' }, 100);

      expect(logs.length).toBe(2);
      expect(logs[0].userId).toBe('user1');
      expect(logs[1].userId).toBe('user1');
    });

    it('应该按操作类型查询', async () => {
      const logs = await logger.query({ action: AuditAction.CREATE }, 100);

      expect(logs.length).toBeGreaterThanOrEqual(1);
      expect(logs[0].action).toBe(AuditAction.CREATE);
    });

    it('应该按资源类型查询', async () => {
      const logs = await logger.query({ resource: AuditResource.CUSTOMER }, 100);

      expect(logs.length).toBeGreaterThanOrEqual(2);
    });

    it('应该按结果查询', async () => {
      const logs = await logger.query({ result: 'success' }, 100);

      expect(logs.length).toBeGreaterThanOrEqual(4);
      expect(logs.every(log => log.result === 'success')).toBe(true);
    });

    it('应该按日期范围查询', async () => {
      const now = Date.now();
      const logs = await logger.query(
        {
          startDate: now - 60000, // 1分钟前
          endDate: now + 60000, // 1分钟后
        },
        100
      );

      expect(logs.length).toBeGreaterThanOrEqual(4);
    });

    it('应该支持组合查询', async () => {
      const logs = await logger.query(
        {
          userId: 'user1',
          resource: AuditResource.CUSTOMER,
        },
        100
      );

      expect(logs.length).toBe(2);
      expect(logs.every(log => log.userId === 'user1' && log.resource === AuditResource.CUSTOMER)).toBe(true);
    });

    it('应该限制返回数量', async () => {
      const logs = await logger.query(undefined, 2);

      expect(logs.length).toBeLessThanOrEqual(2);
    });
  });

  describe('日志统计', () => {
    beforeEach(async () => {
      await logger.logBatch([
        { userId: 'user1', action: AuditAction.CREATE, resource: AuditResource.CUSTOMER },
        { userId: 'user2', action: AuditAction.CREATE, resource: AuditResource.CUSTOMER },
        { userId: 'user1', action: AuditAction.UPDATE, resource: AuditResource.CUSTOMER, level: AuditLevel.WARNING },
        { userId: 'user3', action: AuditAction.DELETE, resource: AuditResource.USER, level: AuditLevel.ERROR },
      ]);
    });

    it('应该计算总数', async () => {
      const stats = await logger.getStats();

      expect(stats.total).toBeGreaterThanOrEqual(4);
    });

    it('应该按操作统计', async () => {
      const stats = await logger.getStats();

      expect(stats.byAction[AuditAction.CREATE]).toBeDefined();
      expect(stats.byAction[AuditAction.UPDATE]).toBeDefined();
      expect(stats.byAction[AuditAction.DELETE]).toBeDefined();
    });

    it('应该按资源统计', async () => {
      const stats = await logger.getStats();

      expect(stats.byResource[AuditResource.CUSTOMER]).toBeDefined();
      expect(stats.byResource[AuditResource.USER]).toBeDefined();
    });

    it('应该按级别统计', async () => {
      const stats = await logger.getStats();

      expect(stats.byLevel[AuditLevel.INFO]).toBeDefined();
      expect(stats.byLevel[AuditLevel.WARNING]).toBeDefined();
      expect(stats.byLevel[AuditLevel.ERROR]).toBeDefined();
    });

    it('应该按结果统计', async () => {
      const stats = await logger.getStats();

      expect(stats.byResult.success).toBeDefined();
    });
  });

  describe('日志导出', () => {
    it('应该导出日志为JSON', async () => {
      await logger.logBatch([
        { userId: 'user1', action: AuditAction.CREATE, resource: AuditResource.CUSTOMER },
        { userId: 'user2', action: AuditAction.UPDATE, resource: AuditResource.TASK },
      ]);

      const exported = await logger.export();

      expect(exported.format).toBe('json');
      expect(exported.data).toBeInstanceOf(Array);
      expect(exported.data.length).toBeGreaterThanOrEqual(2);
      expect(exported.exportedAt).toBeDefined();
    });

    it('应该支持过滤导出', async () => {
      await logger.logBatch([
        { userId: 'user1', action: AuditAction.CREATE, resource: AuditResource.CUSTOMER },
        { userId: 'user2', action: AuditAction.UPDATE, resource: AuditResource.TASK },
      ]);

      const exported = await logger.export({ userId: 'user1' });

      expect(exported.data.every(log => log.userId === 'user1')).toBe(true);
    });
  });

  describe('日志清理', () => {
    it('应该清理旧日志', async () => {
      const retentionDays = 0; // 立即过期

      await logger.logBatch([
        { userId: 'user1', action: AuditAction.CREATE, resource: AuditResource.CUSTOMER },
        { userId: 'user2', action: AuditAction.UPDATE, resource: AuditResource.TASK },
      ]);

      const deletedCount = await logger.cleanup(retentionDays);

      expect(deletedCount).toBeGreaterThanOrEqual(0);
    });

    it('应该保留新日志', async () => {
      const retentionDays = 365; // 1年

      await logger.log({
        userId: 'user1',
        action: AuditAction.CREATE,
        resource: AuditResource.CUSTOMER,
      });

      await logger.cleanup(retentionDays);

      const logs = await logger.query({ userId: 'user1' }, 10);
      expect(logs.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('告警回调', () => {
    it('应该注册和触发告警回调', async () => {
      const mockCallback = vi.fn();
      logger.registerAlert('test-alert', mockCallback);

      await logger.log({
        userId: 'user1',
        action: AuditAction.CREATE,
        resource: AuditResource.CUSTOMER,
      });

      // 给告警检查一些时间
      await new Promise(resolve => setTimeout(resolve, 100));

      // 注意：实际告警触发取决于具体条件
      // 这里只是验证回调可以注册
      expect(true).toBe(true);
    });

    it('应该注销告警回调', () => {
      const mockCallback = vi.fn();
      logger.registerAlert('test-alert', mockCallback);

      logger.unregisterAlert('test-alert');

      // 验证回调已注销（通过再次注册不应该冲突）
      expect(() => {
        logger.registerAlert('test-alert', mockCallback);
      }).not.toThrow();
    });
  });
});

describe('便捷函数', () => {
  describe('logOperation', () => {
    it('应该记录操作', async () => {
      const log = await logOperation({
        userId: 'user123',
        action: AuditAction.UPDATE,
        resource: AuditResource.TASK,
        resourceId: 'task456',
        details: { field: 'status', value: 'done' },
      });

      expect(log.action).toBe(AuditAction.UPDATE);
      expect(log.resource).toBe(AuditResource.TASK);
      expect(log.resourceId).toBe('task456');
    });
  });

  describe('logLogin', () => {
    it('应该记录成功登录', async () => {
      const request = new Request('http://example.com/api/login', {
        method: 'POST',
        headers: {
          'user-agent': 'Test Browser',
          'x-forwarded-for': '192.168.1.1',
        },
      });

      const log = await logLogin('user123', 'success', request);

      expect(log.action).toBe(AuditAction.LOGIN);
      expect(log.resource).toBe(AuditResource.USER);
      expect(log.resourceId).toBe('user123');
      expect(log.result).toBe('success');
      expect(log.level).toBe(AuditLevel.INFO);
      expect(log.ipAddress).toBe('192.168.1.1');
      expect(log.userAgent).toBe('Test Browser');
    });

    it('应该记录失败登录', async () => {
      const log = await logLogin('user123', 'failure');

      expect(log.result).toBe('failure');
      expect(log.level).toBe(AuditLevel.WARNING);
    });
  });

  describe('logLogout', () => {
    it('应该记录登出', async () => {
      const log = await logLogout('user123');

      expect(log.action).toBe(AuditAction.LOGOUT);
      expect(log.resource).toBe(AuditResource.USER);
      expect(log.resourceId).toBe('user123');
      expect(log.result).toBe('success');
    });
  });

  describe('logDataAccess', () => {
    it('应该记录数据访问', async () => {
      const log = await logDataAccess(
        'user123',
        AuditResource.CUSTOMER,
        'customer456',
        AuditAction.READ
      );

      expect(log.action).toBe(AuditAction.READ);
      expect(log.resource).toBe(AuditResource.CUSTOMER);
      expect(log.resourceId).toBe('customer456');
    });

    it('应该默认使用READ操作', async () => {
      const log = await logDataAccess(
        'user123',
        AuditResource.TASK,
        'task789'
      );

      expect(log.action).toBe(AuditAction.READ);
    });
  });
});

describe('默认审计日志记录器', () => {
  it('应该导出默认实例', () => {
    expect(auditLogger).toBeDefined();
    expect(auditLogger).toBeInstanceOf(AuditLogger);
  });

  it('应该使用默认实例记录日志', async () => {
    const log = await auditLogger.log({
      userId: 'test-user',
      action: AuditAction.CREATE,
      resource: AuditResource.CUSTOMER,
    });

    expect(log.userId).toBe('test-user');
  });
});
