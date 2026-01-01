/**
 * @fileoverview pwa-install-prompt.tsx
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X, Smartphone, Monitor } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // 检查是否已安装
    const checkInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true) {
        setIsInstalled(true)
      }
    }

    checkInstalled()

    // 监听安装提示事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    // 监听应用安装事件
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)

      // 显示安装成功提示
      if ("serviceWorker" in navigator && "Notification" in window) {
        new Notification("JINLAN 企业管理系统", {
          body: "应用已成功安装到您的设备！",
          icon: "/yyc3-pwa-icon.png",
        })
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        console.log("用户接受了安装提示")
      } else {
        console.log("用户拒绝了安装提示")
      }

      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    } catch (error) {
      console.error("安装提示失败:", error)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // 24小时后再次显示
    localStorage.setItem("pwa-install-dismissed", Date.now().toString())
  }

  // 检查是否在24小时内被拒绝过
  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed")
    if (dismissed) {
      const dismissedTime = Number.parseInt(dismissed)
      const now = Date.now()
      const hoursPassed = (now - dismissedTime) / (1000 * 60 * 60)

      if (hoursPassed < 24) {
        setShowInstallPrompt(false)
      }
    }
  }, [])

  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="bg-white/95 backdrop-blur-sm border border-sky-200 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/yyc3-pwa-icon.png" alt="YYC³" className="w-8 h-8 object-contain" />
              <div>
                <CardTitle className="text-sm font-semibold text-slate-800">安装应用</CardTitle>
                <CardDescription className="text-xs text-slate-600">获得更好的使用体验</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-6 w-6 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-4 text-xs text-slate-600">
              <div className="flex items-center space-x-1">
                <Smartphone className="w-3 h-3" />
                <span>离线访问</span>
              </div>
              <div className="flex items-center space-x-1">
                <Monitor className="w-3 h-3" />
                <span>桌面快捷方式</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="w-3 h-3" />
                <span>快速启动</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleInstallClick}
                className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-sm h-8"
              >
                <Download className="w-3 h-3 mr-1" />
                立即安装
              </Button>
              <Button variant="outline" onClick={handleDismiss} className="text-sm h-8 px-3">
                稍后
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
