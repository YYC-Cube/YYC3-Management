/**
 * @fileoverview form-validation.ts
 * @description 表单验证规则和工具函数
 * @author YYC³
 * @version 3.0.0
 * @created 2025-01-19
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { z } from "zod"

export const userFormSchema = z.object({
  username: z
    .string()
    .min(3, "用户名至少需要3个字符")
    .max(50, "用户名不能超过50个字符")
    .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
  email: z
    .string()
    .min(1, "邮箱不能为空")
    .email("请输入有效的邮箱地址"),
  real_name: z
    .string()
    .min(2, "真实姓名至少需要2个字符")
    .max(50, "真实姓名不能超过50个字符"),
  role: z.enum(["admin", "manager", "user"]),
  department: z
    .string()
    .min(1, "部门不能为空")
    .max(100, "部门名称不能超过100个字符"),
  status: z.enum(["active", "inactive"]),
})

export const customerFormSchema = z.object({
  name: z
    .string()
    .min(2, "客户姓名至少需要2个字符")
    .max(50, "客户姓名不能超过50个字符"),
  company: z
    .string()
    .min(2, "公司名称至少需要2个字符")
    .max(100, "公司名称不能超过100个字符"),
  email: z
    .string()
    .min(1, "邮箱不能为空")
    .email("请输入有效的邮箱地址"),
  phone: z
    .string()
    .min(11, "请输入有效的手机号码")
    .max(11, "请输入有效的手机号码")
    .regex(/^1[3-9]\d{9}$/, "请输入有效的手机号码"),
  level: z.enum(["VIP", "重要", "普通", "潜在"]),
  status: z.enum(["active", "inactive"]),
})

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(3, "任务标题至少需要3个字符")
    .max(200, "任务标题不能超过200个字符"),
  description: z
    .string()
    .max(1000, "任务描述不能超过1000个字符")
    .optional(),
  assignee_name: z
    .string()
    .min(1, "负责人不能为空")
    .max(50, "负责人姓名不能超过50个字符"),
  priority: z.enum(["urgent", "high", "medium", "low"]),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  progress: z
    .number()
    .min(0, "进度不能小于0")
    .max(100, "进度不能大于100"),
  due_date: z
    .string()
    .min(1, "截止日期不能为空"),
})

export const projectFormSchema = z.object({
  name: z
    .string()
    .min(3, "项目名称至少需要3个字符")
    .max(100, "项目名称不能超过100个字符"),
  description: z
    .string()
    .max(500, "项目描述不能超过500个字符")
    .optional(),
  manager: z
    .string()
    .min(1, "项目经理不能为空")
    .max(50, "项目经理姓名不能超过50个字符"),
  team_size: z
    .number()
    .min(1, "团队人数至少为1")
    .max(100, "团队人数不能超过100"),
  priority: z.enum(["urgent", "high", "medium", "low"]),
  status: z.enum(["planning", "in_progress", "completed", "on_hold", "cancelled"]),
  progress: z
    .number()
    .min(0, "进度不能小于0")
    .max(100, "进度不能大于100"),
  start_date: z
    .string()
    .min(1, "开始日期不能为空"),
  end_date: z
    .string()
    .min(1, "结束日期不能为空"),
  budget: z
    .number()
    .min(0, "预算不能为负数")
    .max(999999999, "预算不能超过999,999,999"),
})

export type UserFormValues = z.infer<typeof userFormSchema>
export type CustomerFormValues = z.infer<typeof customerFormSchema>
export type TaskFormValues = z.infer<typeof taskFormSchema>
export type ProjectFormValues = z.infer<typeof projectFormSchema>

export const validateForm = <T extends z.ZodSchema>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: Record<string, string> } => {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  const errors: Record<string, string> = {}
  result.error.issues.forEach((error) => {
    if (error.path.length > 0) {
      const field = error.path.join(".")
      errors[field] = error.message
    }
  })
  return { success: false, errors }
}
