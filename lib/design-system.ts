/**
 * @fileoverview design-system.ts
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
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
export const commonStyles = {
  layout: {
    container: "min-h-screen bg-gradient-to-br from-slate-50 to-sky-50/30 p-6",
    pageHeader: "flex items-center justify-between mb-6",
    pageTitle: "text-2xl font-bold text-slate-900",
    pageDescription: "text-slate-600 mt-1",
    grid: "grid gap-6",
  },
  card: {
    base: "bg-white/80 backdrop-blur-sm border border-sky-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200",
    header: "p-6 border-b border-sky-100",
    content: "p-6",
    footer: "p-6 border-t border-sky-100",
    statCard: "border-l-4 hover:shadow-md transition-shadow",
    enhanced:
      "bg-white/90 backdrop-blur-sm border border-sky-200/60 rounded-xl shadow-sm hover:shadow-lg hover:border-sky-300/60 transition-all duration-300",
  },
  button: {
    primary:
      "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md",
    secondary:
      "bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300 font-medium px-4 py-2 rounded-lg transition-all duration-200",
    outline:
      "border border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300 px-4 py-2 rounded-lg transition-all duration-200",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-lg transition-all duration-200",
  },
  input: {
    base: "w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200",
    search:
      "pl-10 pr-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-sky-50/50 transition-all duration-200",
  },
  badge: {
    primary: "bg-sky-100 text-sky-800 border-sky-200",
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    error: "bg-red-100 text-red-800 border-red-200",
    secondary: "bg-slate-100 text-slate-800 border-slate-200",
  },
  text: {
    title: "text-2xl font-bold text-slate-900",
    subtitle: "text-lg font-semibold text-slate-800",
    body: "text-slate-700",
    caption: "text-sm text-slate-600",
    muted: "text-xs text-slate-500",
  },
  status: {
    active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    inactive: "bg-slate-100 text-slate-800 border-slate-200",
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    completed: "bg-sky-100 text-sky-800 border-sky-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  },
}

// 进度条颜色配置 - 统一使用彩色渐变
export const getProgressColor = (progress: number, status?: string): string => {
  if (status === "completed") return "bg-gradient-to-r from-emerald-400 to-emerald-500"
  if (status === "cancelled") return "bg-gradient-to-r from-red-400 to-red-500"
  if (status === "critical") return "bg-gradient-to-r from-red-400 to-red-500"
  if (status === "warning") return "bg-gradient-to-r from-amber-400 to-amber-500"
  if (status === "excellent") return "bg-gradient-to-r from-emerald-400 to-emerald-500"
  if (status === "good") return "bg-gradient-to-r from-sky-400 to-sky-500"
  if (status === "at-risk") return "bg-gradient-to-r from-amber-400 to-amber-500"
  if (status === "off-track") return "bg-gradient-to-r from-red-400 to-red-500"
  if (status === "on-track") return "bg-gradient-to-r from-emerald-400 to-emerald-500"

  // 根据进度值返回彩色渐变
  if (progress >= 90) return "bg-gradient-to-r from-emerald-400 to-emerald-500"
  if (progress >= 70) return "bg-gradient-to-r from-sky-400 to-sky-500"
  if (progress >= 50) return "bg-gradient-to-r from-amber-400 to-amber-500"
  return "bg-gradient-to-r from-red-400 to-red-500"
}

// 状态配置
export const statusConfig = {
  task: {
    todo: { label: "待开始", color: "bg-slate-100 text-slate-800", icon: "Clock" },
    "in-progress": { label: "进行中", color: "bg-sky-100 text-sky-800", icon: "Play" },
    review: { label: "待审核", color: "bg-amber-100 text-amber-800", icon: "Eye" },
    completed: { label: "已完成", color: "bg-emerald-100 text-emerald-800", icon: "Check" },
  },
  approval: {
    pending: { label: "待审批", color: "bg-amber-100 text-amber-800", icon: "Clock", bgColor: "bg-amber-100" },
    approved: { label: "已批准", color: "bg-emerald-100 text-emerald-800", icon: "Check", bgColor: "bg-emerald-100" },
    rejected: { label: "已拒绝", color: "bg-red-100 text-red-800", icon: "X", bgColor: "bg-red-100" },
    cancelled: { label: "已取消", color: "bg-slate-100 text-slate-800", icon: "Ban", bgColor: "bg-slate-100" },
    draft: { label: "草稿", color: "bg-blue-100 text-blue-800", icon: "FileText", bgColor: "bg-blue-100" },
  },
  customer: {
    active: { label: "活跃", color: "bg-emerald-100 text-emerald-800", icon: "UserCheck" },
    inactive: { label: "非活跃", color: "bg-slate-100 text-slate-800", icon: "UserX" },
    potential: { label: "潜在", color: "bg-amber-100 text-amber-800", icon: "User" },
  },
}

// 通知配置
export const notificationConfig = {
  types: {
    info: { color: "bg-sky-100 text-sky-800 border-sky-200", icon: "Info" },
    success: { color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: "CheckCircle" },
    warning: { color: "bg-amber-100 text-amber-800 border-amber-200", icon: "AlertTriangle" },
    error: { color: "bg-red-100 text-red-800 border-red-200", icon: "AlertCircle" },
  },
  priorities: {
    low: { label: "低", color: "bg-slate-100 text-slate-800" },
    medium: { label: "中", color: "bg-sky-100 text-sky-800" },
    high: { label: "高", color: "bg-amber-100 text-amber-800" },
    urgent: { label: "紧急", color: "bg-red-100 text-red-800" },
  },
}

// 工具函数
export const getStatusStyle = (type: string, status: string) => {
  const config = statusConfig[type as keyof typeof statusConfig];
  const result = config?.[status as keyof typeof config] || {
    label: status,
    color: "bg-slate-100 text-slate-800",
    icon: "Circle",
    bgColor: "bg-slate-100",
  };
  return result as { label: string; color: string; icon: string; bgColor?: string };
}

export const getPriorityStyle = (priority: string) => {
  return (
    notificationConfig.priorities[priority as keyof typeof notificationConfig.priorities] || {
      label: priority,
      color: "bg-slate-100 text-slate-800",
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
