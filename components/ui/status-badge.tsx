import { cn } from '@/lib/utils'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary'

const STATUS_STYLES: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
  danger: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  info: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  neutral: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700',
  primary: 'bg-primary/10 text-primary border-primary/20',
}

interface StatusBadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

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
  if (['in_progress', '进行中', 'processing', 'active'].includes(lower)) {
    return 'info'
  }
  return 'neutral'
}
