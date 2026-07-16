"use client"

/**
 * @fileoverview 统一欢迎页 — 展示所有已注册系统卡片
 */

import { useState } from "react"
import { Sparkles, Users } from "lucide-react"
import type { SystemCard } from "@/lib/plugin-system/types"
import { storage, StorageKeys } from "@/lib/plugin-system/storage"
import { eventBus, Events } from "@/lib/plugin-system/event-bus"

interface WelcomePageProps {
  systems: SystemCard[]
  mode?: "page" | "modal"
  onNavigate: (path: string) => void
  familySummary?: string
}

export function WelcomePage({
  systems,
  mode = "page",
  onNavigate,
  familySummary,
}: WelcomePageProps) {
  const [dismissed, setDismissed] = useState(() =>
    storage.shell.get(StorageKeys.SHELL_WELCOME_DISMISSED, false),
  )

  if (mode === "modal" && dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    storage.shell.set(StorageKeys.SHELL_WELCOME_DISMISSED, true)
    eventBus.emit(Events.SHELL_WELCOME_DISMISS)
  }

  return (
    <div
      className={`flex flex-col items-center justify-center ${mode === "modal" ? "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" : "min-h-screen"}`}
      style={{
        background:
          mode === "page"
            ? "radial-gradient(ellipse at center, rgba(0,180,255,0.05) 0%, rgba(4,8,20,1) 70%)"
            : undefined,
      }}
    >
      <div
        className={`max-w-2xl w-full ${mode === "modal" ? "bg-card border border-border rounded-2xl p-8 shadow-2xl mx-4" : "px-4"}`}
      >
        {/* Logo + 标题 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-foreground text-2xl font-bold tracking-wider mb-2">
            YYC³ Cloud Intelli-Matrix
          </h1>
          <p className="text-muted-foreground text-sm">
            AI Family 中枢 · 协同所有系统
          </p>
        </div>

        {/* 系统卡片网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {systems.map((sys) => {
            const Icon = sys.icon
            return (
              <button
                key={sys.id}
                onClick={() => onNavigate(sys.path)}
                className="group p-4 rounded-xl text-center transition-all hover:scale-105 active:scale-95 border"
                style={{
                  background: `${sys.color}08`,
                  borderColor: `${sys.color}20`,
                  boxShadow: `0 0 20px ${sys.color}08`,
                }}
              >
                <div
                  className="w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ background: `${sys.color}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color: sys.color }} />
                </div>
                <p className="text-foreground text-sm font-medium">{sys.name}</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {sys.description}
                </p>
                {sys.badge && (
                  <span
                    className="inline-block mt-1 px-2 py-0.5 rounded text-xs"
                    style={{ background: `${sys.color}18`, color: sys.color }}
                  >
                    {sys.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* AI Family 状态摘要 */}
        {familySummary && (
          <div
            className="p-3 rounded-xl flex items-center gap-3 border"
            style={{
              background: "rgba(0,255,136,0.04)",
              borderColor: "rgba(0,255,136,0.1)",
            }}
          >
            <Users className="w-5 h-5 text-[#00FF88]" />
            <span className="text-muted-foreground text-xs">{familySummary}</span>
          </div>
        )}

        {/* 弹窗模式的关闭按钮 */}
        {mode === "modal" && (
          <button
            onClick={handleDismiss}
            className="mt-4 w-full py-2.5 rounded-xl text-sm transition-all border bg-muted hover:bg-muted/80 text-muted-foreground"
          >
            进入系统 · 下次不再提示
          </button>
        )}
      </div>
    </div>
  )
}
