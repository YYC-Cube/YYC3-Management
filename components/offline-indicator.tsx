/**
 * @fileoverview offline-indicator.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WifiOff, Wifi, AlertCircle } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)

      if (!online) {
        setShowIndicator(true)
      } else {
        // 延迟隐藏指示器，让用户看到连接恢复
        setTimeout(() => setShowIndicator(false), 2000)
      }
    }

    // 初始状态检查
    updateOnlineStatus()

    // 监听网络状态变化
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  if (!showIndicator) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Card className={`${isOnline ? "bg-emerald-50 border-emerald-200" : "bg-orange-50 border-orange-200"} shadow-lg`}>
        <CardContent className="px-4 py-2">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">网络连接已恢复</span>
                <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300">
                  在线
                </Badge>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">网络连接断开</span>
                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                  离线
                </Badge>
              </>
            )}
          </div>
          {!isOnline && (
            <div className="flex items-center space-x-1 mt-1">
              <AlertCircle className="w-3 h-3 text-orange-500" />
              <span className="text-xs text-orange-600">正在使用缓存数据</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
