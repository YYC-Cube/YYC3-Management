/**
 * @fileoverview StatusBadge — 业务状态徽章
 * @description 基于 Tailwind 语义 token 的状态徽章，自动适配深色模式
 * @author YYC³
 * @version 3.1.0
 * @created 2025-12-09
 * @modified 2026-07-17
 * @copyright Copyright (c) 2025-2026 YYC³
 * @license MIT
 *
 * @note 修复历史：
 *   - v3.0.0：硬编码 green-100/yellow-100/red-100 等，深色模式不自适应
 *   - v3.1.0：全部改用语义 token（bg-success/10 text-success border-success/20）
 */

import { cn } from '@/lib/utils'

/** 业务状态徽章变体 */
export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'primary'

/**
 * 状态样式映射表 — 全部使用语义 token + 软背景模式
 * 软背景：bg-{color}/10（10% 透明度）
 * 边框：border-{color}/20（20% 透明度）
 */
const STATUS_STYLES: Record<BadgeVariant, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-primary/10 text-primary border-primary/20',
  neutral: 'bg-muted text-muted-foreground border-border',
  primary: 'bg-primary/10 text-primary border-primary/20',
}

interface StatusBadgeProps {
  /** 状态变体，默认 neutral */
  variant?: BadgeVariant
  /** 徽章内容 */
  children: React.ReactNode
  /** 自定义类名（与默认样式合并） */
  className?: string
}

/**
 * StatusBadge - 业务状态徽章
 *
 * 使用语义 token，深色模式自动切换。
 *
 * @example
 * <StatusBadge variant="success">活跃</StatusBadge>
 * <StatusBadge variant="warning">待处理</StatusBadge>
 * <StatusBadge variant="danger">已取消</StatusBadge>
 */
export function StatusBadge({ variant = 'neutral', children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border',
        STATUS_STYLES[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

/**
 * 根据状态字符串推断 BadgeVariant
 * 支持中英文业务状态值
 *
 * @param status - 业务状态字符串
 * @returns 对应的 BadgeVariant
 */
export function getStatusVariant(status: string): BadgeVariant {
  const lower = status.toLowerCase()
  if (['active', '活跃', 'online', 'approved', 'completed', '已完成', 'success', '成功'].includes(lower)) {
    return 'success'
  }
  if (['pending', '待处理', 'waiting', 'review', 'planning'].includes(lower)) {
    return 'warning'
  }
  if (['inactive', '非活跃', 'offline', 'rejected', 'failed', 'error', 'cancelled', '已取消', 'churned', '流失'].includes(lower)) {
    return 'danger'
  }
  if (['in_progress', '进行中', 'processing'].includes(lower)) {
    return 'info'
  }
  return 'neutral'
}
