"use client"

import { cn } from "@/lib/utils"
import { getProgressColor } from "@/lib/design-system"

interface EnhancedProgressProps {
  value: number
  status?: "on-track" | "at-risk" | "off-track" | "excellent" | "good" | "warning" | "critical"
  size?: "sm" | "md" | "lg"
  animated?: boolean
  showLabel?: boolean
  className?: string
}

export function EnhancedProgress({
  value,
  status,
  size = "md",
  animated = false,
  showLabel = false,
  className,
}: EnhancedProgressProps) {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  }

  const progressColor = getProgressColor(value, status)

  return (
    <div className={cn("relative", className)}>
      <div className={cn("bg-slate-200 rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn(
            "h-full transition-all duration-500 relative overflow-hidden",
            progressColor,
            animated && "animate-pulse",
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
      {showLabel && <div className="text-xs text-slate-600 mt-1 text-center">{value}%</div>}
    </div>
  )
}
