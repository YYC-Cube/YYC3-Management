/**
 * @fileoverview touch-gestures.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { RefreshCw } from "lucide-react"

interface TouchGesturesProps {
  children: ReactNode
  onRefresh?: () => Promise<void>
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  enablePullToRefresh?: boolean
  enableSwipeNavigation?: boolean
  refreshThreshold?: number
  swipeThreshold?: number
}

export function TouchGestures({
  children,
  onRefresh,
  onSwipeLeft,
  onSwipeRight,
  enablePullToRefresh = true,
  enableSwipeNavigation = true,
  refreshThreshold = 80,
  swipeThreshold = 100,
}: TouchGesturesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [showRefreshIndicator, setShowRefreshIndicator] = useState(false)

  // 触摸状态
  const touchState = useRef({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    startTime: 0,
    isScrolling: false,
    isPulling: false,
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationFrame: number | null = null

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchState.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        startTime: Date.now(),
        isScrolling: false,
        isPulling: false,
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return

      const touch = e.touches[0]
      const deltaX = touch.clientX - touchState.current.startX
      const deltaY = touch.clientY - touchState.current.startY

      touchState.current.currentX = touch.clientX
      touchState.current.currentY = touch.clientY

      // 判断滚动方向
      if (!touchState.current.isScrolling && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
        touchState.current.isScrolling = true
      }

      // 下拉刷新逻辑
      if (enablePullToRefresh && deltaY > 0 && container.scrollTop === 0 && !isRefreshing) {
        e.preventDefault()
        touchState.current.isPulling = true

        const distance = Math.min(deltaY * 0.5, refreshThreshold * 1.5)
        setPullDistance(distance)
        setShowRefreshIndicator(distance > 20)

        // 添加阻尼效果
        container.style.transform = `translateY(${distance}px)`
        container.style.transition = "none"
      }
    }

    const handleTouchEnd = async (e: TouchEvent) => {
      const deltaX = touchState.current.currentX - touchState.current.startX
      const deltaY = touchState.current.currentY - touchState.current.startY
      const deltaTime = Date.now() - touchState.current.startTime
      const velocity = Math.abs(deltaX) / deltaTime

      // 重置容器位置
      container.style.transform = ""
      container.style.transition = "transform 0.3s ease-out"

      // 下拉刷新
      if (enablePullToRefresh && touchState.current.isPulling && pullDistance >= refreshThreshold && onRefresh) {
        setIsRefreshing(true)
        try {
          await onRefresh()
        } catch (error) {
          console.error("刷新失败:", error)
        } finally {
          setIsRefreshing(false)
        }
      }

      // 左右滑动导航
      if (enableSwipeNavigation && Math.abs(deltaX) > swipeThreshold && Math.abs(deltaY) < 50 && velocity > 0.3) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      }

      // 重置状态
      setPullDistance(0)
      setShowRefreshIndicator(false)
      touchState.current.isPulling = false
    }

    // 添加事件监听器
    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd, { passive: false })

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [
    enablePullToRefresh,
    enableSwipeNavigation,
    refreshThreshold,
    swipeThreshold,
    onRefresh,
    onSwipeLeft,
    onSwipeRight,
    isRefreshing,
    pullDistance,
  ])

  return (
    <div ref={containerRef} className="relative h-full overflow-auto">
      {/* 下拉刷新指示器 */}
      {enablePullToRefresh && (showRefreshIndicator || isRefreshing) && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-gradient-to-b from-sky-50 to-transparent z-10"
          style={{
            transform: `translateY(${Math.max(0, pullDistance - 60)}px)`,
            opacity: Math.min(1, pullDistance / 40),
          }}
        >
          <div className="flex items-center space-x-2 text-sky-600">
            <RefreshCw
              className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""} ${pullDistance >= refreshThreshold ? "rotate-180" : ""} transition-transform duration-200`}
            />
            <span className="text-sm font-medium">
              {isRefreshing ? "正在刷新..." : pullDistance >= refreshThreshold ? "释放刷新" : "下拉刷新"}
            </span>
          </div>
        </div>
      )}

      {/* 左右滑动提示 */}
      {enableSwipeNavigation && (
        <>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-gradient-to-r from-sky-400 to-transparent opacity-20 pointer-events-none" />
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-16 bg-gradient-to-l from-sky-400 to-transparent opacity-20 pointer-events-none" />
        </>
      )}

      {children}
    </div>
  )
}
