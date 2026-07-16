"use client"

/**
 * @fileoverview AI Family 交流中心 — 家人对话页面
 */

import { MessageSquare, Users } from "lucide-react"
import { FAMILY_PERSONAS } from "@/lib/plugin-system/family-personas"

export function FamilyChatPage() {
  return (
    <div className="p-8">
      <h1 className="text-foreground text-lg font-medium flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-[#00FF88]" /> 交流中心
      </h1>
      <p className="text-muted-foreground text-sm mt-1 mb-6">
        与 AI 家人群聊或私聊
      </p>

      <div className="flex gap-6">
        <div className="w-48 space-y-1">
          {["全体闲聊", "技术讨论", "音乐鉴赏", "创意工坊"].map((ch) => (
            <div
              key={ch}
              className="px-3 py-2 rounded-lg text-sm cursor-pointer transition-all bg-muted/50 border text-muted-foreground hover:text-foreground"
            >
              # {ch}
            </div>
          ))}
        </div>

        <div
          className="flex-1 rounded-xl p-6 flex flex-col items-center justify-center border bg-muted/30"
          style={{ minHeight: 400 }}
        >
          <Users className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground text-sm">选择频道开始交流</p>
          <p className="text-muted-foreground/50 text-xs mt-1">
            {FAMILY_PERSONAS.length} 位家人在线
          </p>
        </div>
      </div>
    </div>
  )
}
