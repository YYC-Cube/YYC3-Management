"use client"

/**
 * @fileoverview EnhancedButton — 基于标准 Button 的扩展按钮
 * @description 提供 icon / loading / iconPosition 增强能力，variant 完全委托给标准 Button
 * @author YYC³
 * @version 3.1.0
 * @created 2025-12-09
 * @modified 2026-07-17
 * @copyright Copyright (c) 2025-2026 YYC³
 * @license MIT
 *
 * @note 修复历史：
 *   - v3.0.0：variant 全部使用相同 sky→blue 渐变，参数失效（已废弃）
 *   - v3.1.0：改为基于 Button 的浅封装，仅保留 icon/loading/iconPosition 增强
 */

import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { Loader2 } from "lucide-react"
import type { ReactNode } from "react"

/** EnhancedButton 自身扩展的 props */
interface EnhancedButtonExtraProps {
  /** 左侧或右侧图标 */
  icon?: LucideIcon
  /** 图标位置，默认 left */
  iconPosition?: "left" | "right"
  /** 加载状态：true 时显示 spinner 并禁用 */
  loading?: boolean
  children?: ReactNode
}

/** EnhancedButton 接受的 size 类型（历史值 sm/md/lg + 标准 Button 值） */
type EnhancedSize = "sm" | "md" | "lg" | "default" | "icon"

/** 合并 Button 的 variant，但 size 改为兼容历史值的扩展类型 */
export type EnhancedButtonProps = Omit<ButtonProps, "className" | "size"> &
  EnhancedButtonExtraProps & {
    className?: string
    /** 尺寸：历史值 sm/md/lg 自动映射到标准 Button size */
    size?: EnhancedSize
  }

/** 历史 size → 标准 Button size 映射 */
const SIZE_MAP: Record<"sm" | "md" | "lg", "sm" | "default" | "lg"> = {
  sm: "sm",
  md: "default",
  lg: "lg",
}

/**
 * EnhancedButton - 图标/加载增强按钮
 *
 * 变体（variant）完全继承标准 Button，支持：
 * default / destructive / outline / secondary / ghost / link / success / warning
 */
export function EnhancedButton({
  children,
  icon: Icon,
  iconPosition = "left",
  loading = false,
  className,
  size = "default",
  variant = "default",
  disabled,
  ...props
}: EnhancedButtonProps) {
  // 历史 size (sm/md/lg) 映射到标准 Button size；其他值（default/icon）原样传递
  const mappedSize: "sm" | "default" | "lg" | "icon" =
    size === "sm" || size === "md" || size === "lg"
      ? SIZE_MAP[size]
      : (size as "default" | "icon")

  return (
    <Button
      variant={variant}
      size={mappedSize}
      disabled={disabled || loading}
      className={cn(loading && "opacity-70 cursor-not-allowed", className)}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        Icon && iconPosition === "left" && <Icon className="h-4 w-4" />
      )}
      {children}
      {Icon && iconPosition === "right" && <Icon className="h-4 w-4" />}
    </Button>
  )
}
