"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getProgressColor } from "@/lib/design-system"

interface InteractiveProgressProps {
  value: number
  status?: "on-track" | "at-risk" | "off-track" | "excellent" | "good" | "warning" | "critical"
  size?: "sm" | "md" | "lg"
  editable?: boolean
  animated?: boolean
  title?: string
  onValueChange?: (value: number) => void
  className?: string
}

export function InteractiveProgress({
  value,
  status,
  size = "md",
  editable = false,
  animated = false,
  title,
  onValueChange,
  className,
}: InteractiveProgressProps) {
  const [currentValue, setCurrentValue] = useState(value)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  }

  const progressColor = getProgressColor(currentValue, status)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!editable) return
      setIsDragging(true)
      updateProgress(e)
    },
    [editable],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !editable) return
      updateProgress(e)
    },
    [isDragging, editable],
  )

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      onValueChange?.(currentValue)
    }
  }, [isDragging, currentValue, onValueChange])

  const updateProgress = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!progressRef.current) return

    const rect = progressRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setCurrentValue(Math.round(percentage))
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  return (
    <div className={cn("relative group", className)}>
      {title && (
        <div className="text-xs text-slate-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{title}</div>
      )}
      <div
        ref={progressRef}
        className={cn(
          "relative bg-slate-200 rounded-full overflow-hidden transition-all duration-200",
          sizeClasses[size],
          editable && "cursor-pointer",
          isHovered && "shadow-md",
          isDragging && "shadow-lg scale-105",
        )}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={editable ? `点击或拖拽调整进度: ${currentValue}%` : `进度: ${currentValue}%`}
      >
        <div
          className={cn(
            "h-full transition-all duration-300 relative overflow-hidden",
            progressColor,
            animated && "animate-pulse",
          )}
          style={{ width: `${currentValue}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </div>

        {editable && isHovered && <div className="absolute inset-0 bg-white/10 rounded-full" />}

        {isDragging && <div className="absolute top-0 left-0 w-full h-full bg-white/20 rounded-full" />}
      </div>

      {editable && isHovered && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {currentValue}%
        </div>
      )}
    </div>
  )
}
