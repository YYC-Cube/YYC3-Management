/**
 * @fileoverview design-system.ts
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 3.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// 企业管理系统设计系统配置
export const colors = {
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },
  gray: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
}

export const spacing = {
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
}

export const borderRadius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
}

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
}

// 通用样式配置
// NOTE: 全部使用语义 token（bg-primary、bg-muted 等），深色模式自动切换。
// 历史的 sky-*/blue-*/slate-* 硬编码已于 2026-07-17 全部替换。
export const commonStyles = {
  layout: {
    container: "min-h-screen bg-background p-6",
    pageHeader: "flex items-center justify-between mb-6",
    pageTitle: "text-2xl font-bold text-foreground",
    pageDescription: "text-muted-foreground mt-1",
    grid: "grid gap-6",
  },
  card: {
    base: "bg-card text-card-foreground border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200",
    header: "p-6 border-b border-border",
    content: "p-6",
    footer: "p-6 border-t border-border",
    statCard: "border-l-4 hover:shadow-md transition-shadow",
    enhanced:
      "bg-card border border-border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300",
  },
  button: {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium px-4 py-2 rounded-lg transition-all duration-200",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-lg transition-all duration-200",
    ghost: "text-foreground hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-lg transition-all duration-200",
  },
  input: {
    base: "w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 bg-background text-foreground",
    search:
      "pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-muted/50 transition-all duration-200",
  },
  badge: {
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    error: "bg-destructive/10 text-destructive border-destructive/20",
    secondary: "bg-muted text-muted-foreground border-border",
  },
  text: {
    title: "text-2xl font-bold text-foreground",
    subtitle: "text-lg font-semibold text-foreground",
    body: "text-foreground",
    caption: "text-sm text-muted-foreground",
    muted: "text-xs text-muted-foreground",
  },
  status: {
    active: "bg-success/10 text-success border-success/20",
    inactive: "bg-muted text-muted-foreground border-border",
    pending: "bg-warning/10 text-warning border-warning/20",
    completed: "bg-primary/10 text-primary border-primary/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  },
}

// 进度条颜色配置 - 统一使用语义 token
export const getProgressColor = (progress: number, status?: string): string => {
  if (status === "completed") return "bg-success"
  if (status === "cancelled" || status === "critical" || status === "off-track") return "bg-destructive"
  if (status === "warning" || status === "at-risk") return "bg-warning"
  if (status === "excellent" || status === "on-track") return "bg-success"
  if (status === "good") return "bg-primary"

  // 根据进度值返回阶梯色
  if (progress >= 90) return "bg-success"
  if (progress >= 70) return "bg-primary"
  if (progress >= 50) return "bg-warning"
  return "bg-destructive"
}

// 状态配置（保持业务语义不变，但颜色类全部使用 token）
export const statusConfig = {
  task: {
    todo: { label: "待开始", color: "bg-muted text-muted-foreground", icon: "Clock" },
    "in-progress": { label: "进行中", color: "bg-primary/10 text-primary", icon: "Play" },
    review: { label: "待审核", color: "bg-warning/10 text-warning", icon: "Eye" },
    completed: { label: "已完成", color: "bg-success/10 text-success", icon: "Check" },
  },
  approval: {
    pending: { label: "待审批", color: "bg-warning/10 text-warning", icon: "Clock", bgColor: "bg-warning/10" },
    approved: { label: "已批准", color: "bg-success/10 text-success", icon: "Check", bgColor: "bg-success/10" },
    rejected: { label: "已拒绝", color: "bg-destructive/10 text-destructive", icon: "X", bgColor: "bg-destructive/10" },
    cancelled: { label: "已取消", color: "bg-muted text-muted-foreground", icon: "Ban", bgColor: "bg-muted" },
    draft: { label: "草稿", color: "bg-primary/10 text-primary", icon: "FileText", bgColor: "bg-primary/10" },
  },
  customer: {
    active: { label: "活跃", color: "bg-success/10 text-success", icon: "UserCheck" },
    inactive: { label: "非活跃", color: "bg-muted text-muted-foreground", icon: "UserX" },
    potential: { label: "潜在", color: "bg-warning/10 text-warning", icon: "User" },
  },
}

// 通知配置
export const notificationConfig = {
  types: {
    info: { color: "bg-primary/10 text-primary border-primary/20", icon: "Info" },
    success: { color: "bg-success/10 text-success border-success/20", icon: "CheckCircle" },
    warning: { color: "bg-warning/10 text-warning border-warning/20", icon: "AlertTriangle" },
    error: { color: "bg-destructive/10 text-destructive border-destructive/20", icon: "AlertCircle" },
  },
  priorities: {
    low: { label: "低", color: "bg-muted text-muted-foreground" },
    medium: { label: "中", color: "bg-primary/10 text-primary" },
    high: { label: "高", color: "bg-warning/10 text-warning" },
    urgent: { label: "紧急", color: "bg-destructive/10 text-destructive" },
  },
}

// 工具函数
export const getStatusStyle = (type: string, status: string) => {
  const config = statusConfig[type as keyof typeof statusConfig];
  const result = config?.[status as keyof typeof config] || {
    label: status,
    color: "bg-muted text-muted-foreground",
    icon: "Circle",
    bgColor: "bg-muted",
  };
  return result as { label: string; color: string; icon: string; bgColor?: string };
}

export const getPriorityStyle = (priority: string) => {
  return (
    notificationConfig.priorities[priority as keyof typeof notificationConfig.priorities] || {
      label: priority,
      color: "bg-muted text-muted-foreground",
    }
  )
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date))
}

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}
