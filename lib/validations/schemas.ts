import { z } from 'zod'

export const customerSchema = z.object({
  name: z.string().min(1, '客户名称不能为空').max(100, '客户名称最多100个字符'),
  company: z.string().max(200, '公司名称最多200个字符').optional().or(z.literal('')),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号格式').optional().or(z.literal('')),
  email: z.string().email('请输入有效的邮箱格式').optional().or(z.literal('')),
  level: z.enum(['普通', 'VIP', '银卡', '金卡', '钻石']).optional(),
  status: z.enum(['活跃', ' inactive', '潜在', '流失']).optional(),
  address: z.string().max(500, '地址最多500个字符').optional().or(z.literal('')),
  notes: z.string().max(1000, '备注最多1000个字符').optional().or(z.literal('')),
})

export const taskSchema = z.object({
  title: z.string().min(1, '任务标题不能为空').max(200, '任务标题最多200个字符'),
  description: z.string().max(2000, '描述最多2000个字符').optional().or(z.literal('')),
  assignee_id: z.number().int().positive('请选择有效的负责人').optional(),
  priority: z.enum(['低', '中', '高', '紧急']),
  status: z.enum(['待处理', '进行中', '已完成', '已取消']),
  progress: z.number().int().min(0, '进度不能小于0').max(100, '进度不能超过100'),
  due_date: z.string().optional().or(z.literal('')),
})

export const projectSchema = z.object({
  name: z.string().min(1, '项目名称不能为空').max(200, '项目名称最多200个字符'),
  description: z.string().max(2000, '描述最多2000个字符').optional().or(z.literal('')),
  manager_id: z.number().int().positive('请选择有效的项目负责人').optional(),
  team_size: z.number().int().min(0, '团队人数不能为负数').max(1000, '团队人数最多1000'),
  progress: z.number().int().min(0, '进度不能小于0').max(100, '进度不能超过100'),
  status: z.enum(['进行中', '已完成', '延期', '暂停', '取消']),
  priority: z.enum(['低', '中', '高', '紧急']),
  start_date: z.string().optional().or(z.literal('')),
  end_date: z.string().optional().or(z.literal('')),
  budget: z.number().min(0, '预算不能为负数').optional(),
  type: z.string().max(50, '类型最多50个字符').optional().or(z.literal('')),
})

export const userSchema = z.object({
  username: z.string().min(2, '用户名至少2个字符').max(50, '用户名最多50个字符'),
  email: z.string().email('请输入有效的邮箱格式'),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号格式').optional().or(z.literal('')),
  real_name: z.string().min(1, '真实姓名不能为空').max(50, '姓名最多50个字符'),
  role: z.enum(['admin', 'manager', 'user']),
  department: z.string().max(100, '部门名称最多100个字符').optional().or(z.literal('')),
  position: z.string().max(100, '职位名称最多100个字符').optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
})

export type CustomerFormData = z.infer<typeof customerSchema>
export type TaskFormData = z.infer<typeof taskSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
export type UserFormData = z.infer<typeof userSchema>
