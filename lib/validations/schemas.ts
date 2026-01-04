/**
 * Zod Validation Schemas
 * 输入验证模式定义
 *
 * 使用Zod进行运行时类型验证
 */

import { z } from 'zod';

/**
 * 用户输入验证
 */

// 密码验证规则
const passwordRules = z
  .string()
  .min(8, '密码至少8个字符')
  .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
  .regex(/[a-z]/, '密码必须包含至少一个小写字母')
  .regex(/[0-9]/, '密码必须包含至少一个数字')
  .regex(/[^A-Za-z0-9]/, '密码必须包含至少一个特殊字符');

export const userSchema = z.object({
  email: z.string().email('无效的邮箱格式'),
  name: z
    .string()
    .min(2, '名称至少2个字符')
    .max(50, '名称最多50个字符')
    .regex(/^[\u4e00-\u9fa5a-zA-Z\s]+$/, '名称只能包含中文、英文和空格'),
  password: passwordRules,
  role: z.enum(['admin', 'user', 'guest'], {
    errorMap: () => ({ message: '角色必须是 admin、user 或 guest' }),
  }),
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, '无效的手机号格式')
    .optional(),
  avatar: z.string().url('无效的头像URL').optional(),
});

export const userUpdateSchema = userSchema.partial().extend({
  password: passwordRules.optional(),
});

export const loginSchema = z.object({
  email: z.string().email('无效的邮箱格式'),
  password: z.string().min(1, '请输入密码'),
});

export const registerSchema = z.object({
  email: z.string().email('无效的邮箱格式'),
  password: passwordRules,
  name: z
    .string()
    .min(2, '名称至少2个字符')
    .max(50, '名称最多50个字符'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次密码输入不一致',
  path: ['confirmPassword'],
});

/**
 * 客户数据验证
 */

export const customerSchema = z.object({
  name: z
    .string()
    .min(2, '客户名称至少2个字符')
    .max(100, '客户名称最多100个字符'),
  email: z.string().email('无效的邮箱格式'),
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, '无效的手机号格式'),
  company: z.string().optional(),
  industry: z.string().optional(),
  address: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().max(1000, '备注最多1000个字符').optional(),
});

export const customerSearchSchema = z.object({
  keyword: z.string().optional(),
  industry: z.string().optional(),
  tags: z.array(z.string()).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

/**
 * 任务数据验证
 */

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, '任务标题不能为空')
    .max(200, '任务标题最多200个字符'),
  description: z.string().max(2000, '任务描述最多2000个字符').optional(),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  assigneeId: z.string().uuid('无效的负责人ID').optional(),
  dueDate: z.number().int().positive('无效的截止日期').optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * 工作流数据验证
 */

export const workflowSchema = z.object({
  name: z
    .string()
    .min(1, '工作流名称不能为空')
    .max(100, '工作流名称最多100个字符'),
  description: z.string().max(500, '描述最多500个字符').optional(),
  trigger: z.object({
    type: z.enum(['manual', 'webhook', 'schedule', 'event']),
    config: z.record(z.any()),
  }),
  steps: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['action', 'condition', 'delay', 'notification']),
      config: z.record(z.any()),
      next: z.array(z.string()).optional(),
    })
  ).min(1, '工作流至少需要一个步骤'),
  isActive: z.boolean().optional(),
});

/**
 * AI配置验证
 */

export const aiConfigSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'zhipu', 'deepseek']),
  model: z.string().min(1, '模型名称不能为空'),
  apiKey: z.string().min(1, 'API密钥不能为空'),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().optional(),
  systemPrompt: z.string().max(5000, '系统提示词最多5000个字符').optional(),
});

/**
 * 系统配置验证
 */

export const systemConfigSchema = z.object({
  siteName: z
    .string()
    .min(1, '站点名称不能为空')
    .max(100, '站点名称最多100个字符'),
  siteUrl: z.string().url('无效的站点URL'),
  companyName: z
    .string()
    .min(1, '公司名称不能为空')
    .max(200, '公司名称最多200个字符'),
  timezone: z.string(),
  language: z.enum(['zh-CN', 'en-US']),
  dateFormat: z.enum(['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY']),
  currency: z.enum(['CNY', 'USD', 'EUR']),
});

export const databaseConfigSchema = z.object({
  host: z.string().min(1, '数据库主机不能为空'),
  port: z.number().int().min(1).max(65535),
  database: z.string().min(1, '数据库名称不能为空'),
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空'),
  ssl: z.boolean().optional(),
});

export const cacheConfigSchema = z.object({
  host: z.string().min(1, '缓存主机不能为空'),
  port: z.number().int().min(1).max(65535),
  password: z.string().optional(),
  db: z.number().int().min(0).max(15).optional(),
  ttl: z.number().int().positive().optional(),
});

/**
 * 查询参数验证
 */

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => Math.max(1, parseInt(val, 10) || 1)),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 10))),
  sort: z
    .enum(['name', 'date', 'status', 'createdAt', 'updatedAt'])
    .optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  {
    message: '开始日期不能晚于结束日期',
  }
);

/**
 * 导出/导入验证
 */

export const exportQuerySchema = z.object({
  format: z.enum(['json', 'csv', 'excel']),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  filters: z.record(z.any()).optional(),
});

export const importDataSchema = z.object({
  format: z.enum(['json', 'csv']),
  data: z.any(),
  overwrite: z.boolean().optional(),
});

/**
 * 通知验证
 */

export const notificationSchema = z.object({
  type: z.enum(['success', 'error', 'warning', 'info']),
  title: z.string().min(1, '通知标题不能为空').max(100),
  message: z.string().min(1, '通知内容不能为空').max(500),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  expireAt: z.number().int().positive().optional(),
});

/**
 * API密钥验证
 */

export const apiKeySchema = z.object({
  name: z
    .string()
    .min(1, '密钥名称不能为空')
    .max(100, '密钥名称最多100个字符'),
  scopes: z.array(z.string()).min(1, '至少需要一个权限范围'),
  expiresIn: z.number().int().positive().optional(),
});

/**
 * 审计日志查询
 */

export const auditLogQuerySchema = z.object({
  userId: z.string().optional(),
  action: z.enum([
    'create',
    'read',
    'update',
    'delete',
    'login',
    'logout',
    'export',
    'import',
  ]).optional(),
  resource: z.enum([
    'user',
    'customer',
    'task',
    'config',
    'system',
  ]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  ...paginationSchema.shape,
});

/**
 * 类型导出
 */

export type UserInput = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type WorkflowInput = z.infer<typeof workflowSchema>;
export type AIConfigInput = z.infer<typeof aiConfigSchema>;
export type SystemConfigInput = z.infer<typeof systemConfigSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
