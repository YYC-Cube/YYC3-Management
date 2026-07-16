"use client"

/**
 * @fileoverview AI Family 家园首页 — 时钟环布局 + 家人状态墙
 */

import { useState } from "react"
import { Bot, Sparkles } from "lucide-react"
import {
  FAMILY_PERSONAS,
} from "@/lib/plugin-system/family-personas"
import { eventBus, Events } from "@/lib/plugin-system/event-bus"

export function FamilyHomePage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handlePersonaClick = (personaId: string) => {
    eventBus.emit(Events.AI_PERSONA_CHANGED, personaId)
    eventBus.emit(Events.HUB_OPEN, "chat")
  }

  const centerX = 180,
    centerY = 180,
    radius = 130
  const angleStep = (2 * Math.PI) / FAMILY_PERSONAS.length

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(0,255,136,0.03) 0%, rgba(4,8,20,1) 70%)",
      }}
    >
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00FF88] to-[#00d4ff] flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-foreground text-2xl font-bold tracking-wider">
          AI Family · 家园
        </h1>
        <p className="text-muted-foreground text-sm mt-2">
          {FAMILY_PERSONAS.length} 位家人 · 点击头像开始对话
        </p>
      </div>

      <div className="relative" style={{ width: 360, height: 360 }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 360 360">
          {FAMILY_PERSONAS.map((p, i) => {
            const angle = angleStep * i - Math.PI / 2
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)
            return (
              <line
                key={p.id}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke={hoveredId === p.id ? p.color : "rgba(0,255,136,0.06)"}
                strokeWidth={hoveredId === p.id ? 2 : 1}
                className="transition-all duration-300"
              />
            )
          })}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="rgba(0,255,136,0.08)"
            strokeWidth={1}
          />
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[#00FF88] to-[#00d4ff] flex items-center justify-center shadow-lg z-10">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        {FAMILY_PERSONAS.map((p, i) => {
          const angle = angleStep * i - Math.PI / 2
          const x = centerX + radius * Math.cos(angle) - 24
          const y = centerY + radius * Math.sin(angle) - 24
          const Icon = p.icon
          const isHovered = hoveredId === p.id

          return (
            <button
              key={p.id}
              onClick={() => handlePersonaClick(p.id)}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="absolute z-20 transition-all duration-300 hover:scale-110"
              style={{ left: x, top: y, width: 48, height: 48 }}
            >
              <div
                className="w-full h-full rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: isHovered ? `${p.color}30` : `${p.color}15`,
                  border: `2px solid ${isHovered ? p.color : `${p.color}30`}`,
                  boxShadow: isHovered ? `0 0 20px ${p.color}44` : "none",
                }}
              >
                <Icon size={22} style={{ color: p.color }} />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span
                  className="text-muted-foreground"
                  style={{ fontSize: "0.6rem" }}
                >
                  {p.shortName}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <div
        className="mt-20 flex items-center gap-4 text-muted-foreground"
        style={{ fontSize: "0.6rem" }}
      >
        <span>点击家人打开中枢对话</span>
        <span>·</span>
        <span>
          {FAMILY_PERSONAS.filter((p) => p.mood !== "idle").length} 人在线
        </span>
      </div>
    </div>
  )
}
