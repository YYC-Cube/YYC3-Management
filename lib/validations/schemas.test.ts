/**
 * Validation Schemas Tests
 * 验证模式测试
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  userSchema,
  userUpdateSchema,
  loginSchema,
  registerSchema,
  customerSchema,
  customerSearchSchema,
  taskSchema,
  workflowSchema,
  aiConfigSchema,
  systemConfigSchema,
  databaseConfigSchema,
  cacheConfigSchema,
  paginationSchema,
  dateRangeSchema,
  exportQuerySchema,
  importDataSchema,
  notificationSchema,
  apiKeySchema,
  auditLogQuerySchema,
} from './schemas';

describe('用户验证模式', () => {
  describe('userSchema', () => {
    const validUser = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'Password123!',
      role: 'user' as const,
      phone: '13800138000',
    };

    it('应该接受有效的用户数据', () => {
      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('应该拒绝无效的邮箱', () => {
      const result = userSchema.safeParse({
        ...validUser,
        email: 'invalid-email',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('邮箱');
      }
    });

    it('应该拒绝太短的用户名', () => {
      const result = userSchema.safeParse({
        ...validUser,
        name: 'T',
      });
      expect(result.success).toBe(false);
    });

    it('应该拒绝太长的用户名', () => {
      const result = userSchema.safeParse({
        ...validUser,
        name: 'A'.repeat(51),
      });
      expect(result.success).toBe(false);
    });

    it('应该验证密码强度', () => {
      // 缺少大写字母
      let result = userSchema.safeParse({
        ...validUser,
        password: 'password123!',
      });
      expect(result.success).toBe(false);

      // 缺少小写字母
      result = userSchema.safeParse({
        ...validUser,
        password: 'PASSWORD123!',
      });
      expect(result.success).toBe(false);

      // 缺少数字
      result = userSchema.safeParse({
        ...validUser,
        password: 'PasswordTest!',
      });
      expect(result.success).toBe(false);

      // 缺少特殊字符
      result = userSchema.safeParse({
        ...validUser,
        password: 'Password123',
      });
      expect(result.success).toBe(false);

      // 太短
      result = userSchema.safeParse({
        ...validUser,
        password: 'Pass1!',
      });
      expect(result.success).toBe(false);
    });

    it('应该拒绝无效的角色', () => {
      const result = userSchema.safeParse({
        ...validUser,
        role: 'invalid_role',
      });
      expect(result.success).toBe(false);
    });

    it('应该验证手机号格式', () => {
      // 有效手机号
      let result = userSchema.safeParse({
        ...validUser,
        phone: '13800138000',
      });
      expect(result.success).toBe(true);

      // 无效手机号 - 太短
      result = userSchema.safeParse({
        ...validUser,
        phone: '1234567890',
      });
      expect(result.success).toBe(false);
    });

    it('应该接受可选字段', () => {
      const minimalUser = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123!',
        role: 'user' as const,
      };

      const result = userSchema.safeParse(minimalUser);
      expect(result.success).toBe(true);
    });
  });

  describe('userUpdateSchema', () => {
    it('应该允许部分更新', () => {
      const result = userUpdateSchema.safeParse({
        name: 'Updated Name',
      });
      expect(result.success).toBe(true);
    });

    it('应该允许更新密码但可选', () => {
      const result = userUpdateSchema.safeParse({
        email: 'newemail@example.com',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('loginSchema', () => {
    it('应该接受有效的登录数据', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'anypassword',
      });
      expect(result.success).toBe(true);
    });

    it('应该要求密码字段', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    const validRegister = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
      confirmPassword: 'Password123!',
    };

    it('应该接受有效的注册数据', () => {
      const result = registerSchema.safeParse(validRegister);
      expect(result.success).toBe(true);
    });

    it('应该要求密码确认', () => {
      const result = registerSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      });
      expect(result.success).toBe(false);
    });

    it('应该验证密码匹配', () => {
      const result = registerSchema.safeParse({
        ...validRegister,
        confirmPassword: 'DifferentPassword123!',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('两次密码');
      }
    });
  });
});

describe('客户验证模式', () => {
  describe('customerSchema', () => {
    const validCustomer = {
      name: '张三',
      email: 'zhangsan@example.com',
      phone: '13800138000',
    };

    it('应该接受有效的客户数据', () => {
      const result = customerSchema.safeParse(validCustomer);
      expect(result.success).toBe(true);
    });

    it('应该验证手机号格式', () => {
      const result = customerSchema.safeParse({
        ...validCustomer,
        phone: '12345678901',
      });
      expect(result.success).toBe(false);
    });

    it('应该接受可选字段', () => {
      const result = customerSchema.safeParse({
        ...validCustomer,
        company: 'ABC公司',
        tags: ['VIP', '重要客户'],
      });
      expect(result.success).toBe(true);
    });

    it('应该限制备注长度', () => {
      const result = customerSchema.safeParse({
        ...validCustomer,
        notes: 'A'.repeat(1001),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('customerSearchSchema', () => {
    it('应该接受空的搜索条件', () => {
      const result = customerSearchSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('应该接受搜索参数', () => {
      const result = customerSearchSchema.safeParse({
        keyword: '张三',
        industry: '科技',
        tags: ['VIP'],
      });
      expect(result.success).toBe(true);
    });

    it('应该验证日期范围', () => {
      const result = customerSearchSchema.safeParse({
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('任务验证模式', () => {
  describe('taskSchema', () => {
    const validTask = {
      title: '完成项目文档',
      status: 'todo' as const,
      priority: 'high' as const,
    };

    it('应该接受有效的任务数据', () => {
      const result = taskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('应该要求标题字段', () => {
      const result = taskSchema.safeParse({
        status: 'todo' as const,
        priority: 'medium' as const,
      });
      expect(result.success).toBe(false);
    });

    it('应该限制标题长度', () => {
      const result = taskSchema.safeParse({
        ...validTask,
        title: 'A'.repeat(201),
      });
      expect(result.success).toBe(false);
    });

    it('应该限制描述长度', () => {
      const result = taskSchema.safeParse({
        ...validTask,
        description: 'A'.repeat(2001),
      });
      expect(result.success).toBe(false);
    });

    it('应该验证assigneeId为UUID', () => {
      const result = taskSchema.safeParse({
        ...validTask,
        assigneeId: 'not-a-uuid',
      });
      expect(result.success).toBe(false);
    });

    it('应该接受有效的UUID', () => {
      const result = taskSchema.safeParse({
        ...validTask,
        assigneeId: '123e4567-e89b-12d3-a456-426614174000',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('工作流验证模式', () => {
  describe('workflowSchema', () => {
    const validWorkflow = {
      name: '客户跟进流程',
      trigger: {
        type: 'manual' as const,
        config: {},
      },
      steps: [
        {
          id: 'step1',
          type: 'action' as const,
          config: { action: 'send_email' },
        },
      ],
    };

    it('应该接受有效的工作流数据', () => {
      const result = workflowSchema.safeParse(validWorkflow);
      expect(result.success).toBe(true);
    });

    it('应该要求至少一个步骤', () => {
      const result = workflowSchema.safeParse({
        ...validWorkflow,
        steps: [],
      });
      expect(result.success).toBe(false);
    });

    it('应该验证触发器类型', () => {
      const result = workflowSchema.safeParse({
        ...validWorkflow,
        trigger: {
          type: 'invalid' as any,
          config: {},
        },
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('AI配置验证模式', () => {
  describe('aiConfigSchema', () => {
    const validAIConfig = {
      provider: 'openai' as const,
      model: 'gpt-4',
      apiKey: 'sk-test123',
    };

    it('应该接受有效的AI配置', () => {
      const result = aiConfigSchema.safeParse(validAIConfig);
      expect(result.success).toBe(true);
    });

    it('应该验证provider类型', () => {
      const result = aiConfigSchema.safeParse({
        ...validAIConfig,
        provider: 'invalid' as any,
      });
      expect(result.success).toBe(false);
    });

    it('应该限制systemPrompt长度', () => {
      const result = aiConfigSchema.safeParse({
        ...validAIConfig,
        systemPrompt: 'A'.repeat(5001),
      });
      expect(result.success).toBe(false);
    });

    it('应该验证temperature范围', () => {
      const result = aiConfigSchema.safeParse({
        ...validAIConfig,
        temperature: 3,
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('系统配置验证模式', () => {
  describe('systemConfigSchema', () => {
    it('应该接受有效的系统配置', () => {
      const result = systemConfigSchema.safeParse({
        siteName: 'YYC³管理系统',
        siteUrl: 'https://example.com',
        companyName: 'ABC公司',
        timezone: 'Asia/Shanghai',
        language: 'zh-CN',
        dateFormat: 'YYYY-MM-DD',
        currency: 'CNY',
      });
      expect(result.success).toBe(true);
    });

    it('应该验证URL格式', () => {
      const result = systemConfigSchema.safeParse({
        siteName: 'Test',
        siteUrl: 'not-a-url',
        companyName: 'ABC',
        timezone: 'UTC',
        language: 'zh-CN',
        dateFormat: 'YYYY-MM-DD',
        currency: 'CNY',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('databaseConfigSchema', () => {
    it('应该接受有效的数据库配置', () => {
      const result = databaseConfigSchema.safeParse({
        host: 'localhost',
        port: 5432,
        database: 'yyc3_db',
        username: 'postgres',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('应该验证端口范围', () => {
      const result = databaseConfigSchema.safeParse({
        host: 'localhost',
        port: 99999,
        database: 'test',
        username: 'user',
        password: 'pass',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('cacheConfigSchema', () => {
    it('应该接受有效的缓存配置', () => {
      const result = cacheConfigSchema.safeParse({
        host: 'localhost',
        port: 6379,
        password: 'redis123',
        db: 0,
        ttl: 3600,
      });
      expect(result.success).toBe(true);
    });

    it('应该验证db范围', () => {
      const result = cacheConfigSchema.safeParse({
        host: 'localhost',
        port: 6379,
        db: 16,
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('分页和查询验证模式', () => {
  describe('paginationSchema', () => {
    it('应该使用默认值', () => {
      const result = paginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it('应该转换字符串为数字', () => {
      const result = paginationSchema.safeParse({
        page: '5',
        limit: '20',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(5);
        expect(result.data.limit).toBe(20);
      }
    });

    it('应该限制最小页码为1', () => {
      const result = paginationSchema.safeParse({
        page: '0',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
      }
    });

    it('应该限制最大每页数量为100', () => {
      const result = paginationSchema.safeParse({
        limit: '200',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(100);
      }
    });

    it('应该验证排序字段', () => {
      const result = paginationSchema.safeParse({
        sort: 'invalid' as any,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('dateRangeSchema', () => {
    it('应该接受有效的日期范围', () => {
      const result = dateRangeSchema.safeParse({
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
      });
      expect(result.success).toBe(true);
    });

    it('应该拒绝开始日期晚于结束日期', () => {
      const result = dateRangeSchema.safeParse({
        startDate: '2024-12-31T23:59:59Z',
        endDate: '2024-01-01T00:00:00Z',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('开始日期');
      }
    });
  });
});

describe('导出导入验证模式', () => {
  describe('exportQuerySchema', () => {
    it('应该接受有效的导出查询', () => {
      const result = exportQuerySchema.safeParse({
        format: 'json',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
      });
      expect(result.success).toBe(true);
    });

    it('应该验证格式类型', () => {
      const result = exportQuerySchema.safeParse({
        format: 'pdf' as any,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('importDataSchema', () => {
    it('应该接受有效的导入数据', () => {
      const result = importDataSchema.safeParse({
        format: 'json',
        data: { test: 'data' },
        overwrite: true,
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('通知验证模式', () => {
  describe('notificationSchema', () => {
    it('应该接受有效的通知', () => {
      const result = notificationSchema.safeParse({
        type: 'success',
        title: '成功',
        message: '操作已完成',
      });
      expect(result.success).toBe(true);
    });

    it('应该要求标题和消息', () => {
      const result = notificationSchema.safeParse({
        type: 'error',
        title: '',
        message: '',
      });
      expect(result.success).toBe(false);
    });

    it('应该限制标题长度', () => {
      const result = notificationSchema.safeParse({
        type: 'info',
        title: 'A'.repeat(101),
        message: 'Test',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('API密钥验证模式', () => {
  describe('apiKeySchema', () => {
    it('应该接受有效的API密钥', () => {
      const result = apiKeySchema.safeParse({
        name: 'Production Key',
        scopes: ['read', 'write'],
        expiresIn: 86400,
      });
      expect(result.success).toBe(true);
    });

    it('应该要求至少一个权限范围', () => {
      const result = apiKeySchema.safeParse({
        name: 'Test Key',
        scopes: [],
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('审计日志验证模式', () => {
  describe('auditLogQuerySchema', () => {
    it('应该接受有效的审计日志查询', () => {
      const result = auditLogQuerySchema.safeParse({
        userId: 'user123',
        action: 'login',
        page: '1',
        limit: '10',
      });
      expect(result.success).toBe(true);
    });

    it('应该验证action类型', () => {
      const result = auditLogQuerySchema.safeParse({
        action: 'invalid_action' as any,
      });
      expect(result.success).toBe(false);
    });

    it('应该验证resource类型', () => {
      const result = auditLogQuerySchema.safeParse({
        resource: 'invalid_resource' as any,
      });
      expect(result.success).toBe(false);
    });
  });
});
