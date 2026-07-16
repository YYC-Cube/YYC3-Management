"use client"

/**
 * @fileoverview 通用中枢浮窗 — 所有子系统各持一份
 * @description 每个子系统通过 props 注入自己的命令和配置
 */

import { useState, useCallback, useEffect, useRef } from "react"
import {
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  Send,
  Command,
  MessageSquare,
  BookOpen,
  Sliders,
  Copy,
  Check,
  Mic,
  MicOff,
  Trash2,
  RotateCcw,
  Key,
  Cpu,
} from "lucide-react"
import { eventBus, Events } from "@/lib/plugin-system/event-bus"
import {
  StorageKeys,
  createSystemStorage,
} from "@/lib/plugin-system/storage"
import type { HubCommand, PromptPreset } from "@/lib/plugin-system/types"

interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
}

let idCounter = 0
const genId = (s = "") => {
  idCounter += 1
  return `msg-${idCounter}${s}`
}
const now = () => Date.now()

function mockResponse(msg: string): string {
  const l = msg.toLowerCase()
  if (l.includes("状态") || l.includes("节点"))
    return `## 状态报告\n\n**时间**: ${new Date().toLocaleString("zh-CN")}\n\n系统运行正常，所有节点在线。`
  if (l.includes("帮助") || l.includes("help"))
    return `可用命令：\n- 查看状态\n- 执行分析\n- 生成报告\n- 配置参数`
  return `收到: "${msg}"\n\n已处理完毕。需要进一步帮助吗？`
}

export interface AIAssistantHubProps {
  isMobile?: boolean
  systemId: string
  title?: string
  accentColor?: string
  commands?: HubCommand[]
  extraPrompts?: PromptPreset[]
  showPersonas?: boolean
  renderPersonaBar?: () => React.ReactNode
  customMock?: (msg: string) => string
}

const DEFAULT_PROMPTS: PromptPreset[] = [
  {
    id: "p1",
    name: "运维助手",
    prompt: "你是系统运维专家。请分析当前状态，给出优化建议。",
    category: "通用",
  },
  {
    id: "p2",
    name: "数据分析",
    prompt: "你是数据分析专家。请解读监控数据，识别趋势和异常。",
    category: "数据",
  },
]

export function AIAssistantHub({
  isMobile = false,
  systemId,
  title = "AI 智能助理",
  accentColor = "#00d4ff",
  commands = [],
  extraPrompts,
  showPersonas = false,
  renderPersonaBar,
  customMock,
}: AIAssistantHubProps) {
  const allPrompts = [...(extraPrompts ?? []), ...DEFAULT_PROMPTS]

  const [isOpen, setIsOpen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [activeTab, setActiveTab] = useState<
    "chat" | "commands" | "prompts" | "settings"
  >("chat")

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `你好！我是 ${title}。\n\n请输入指令或点击快捷命令开始操作。`,
      timestamp: Date.now(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [systemPrompt, setSystemPrompt] = useState(allPrompts[0]?.prompt ?? "")
  const [showAk, setShowAk] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Voice recognition
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const voiceSupported =
    typeof window !== "undefined" &&
    ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
  const recogRef = useRef<any>(null)

  const startListening = useCallback(() => {
    if (!voiceSupported) return
    const R =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition
    const r = new R()
    r.lang = "zh-CN"
    r.continuous = false
    r.interimResults = false
    r.onresult = (e: any) => {
      setTranscript(e.results[0][0].transcript)
      setIsListening(false)
    }
    r.onerror = () => setIsListening(false)
    r.onend = () => setIsListening(false)
    r.start()
    recogRef.current = r
    setIsListening(true)
  }, [voiceSupported])

  const stopListening = useCallback(() => {
    recogRef.current?.stop()
    setIsListening(false)
  }, [])

  useEffect(() => () => recogRef.current?.abort(), [])

  useEffect(() => {
    if (transcript) setInput(transcript)
  }, [transcript])
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const sysStorage =
    typeof window !== "undefined"
      ? createSystemStorage(systemId)
      : {
          get: (_k: string, fb?: string) => fb ?? "",
          set: () => {},
          remove: () => {},
          clear: () => {},
        }

  const [localAk, setLocalAk] = useState(
    sysStorage.get(StorageKeys.AI_API_KEY, "") ?? "",
  )
  const [localMk, setLocalMk] = useState(
    sysStorage.get(StorageKeys.AI_MODEL, "") ?? "",
  )

  const persist = (k: string, v: string) =>
    sysStorage.set(k as any, v)

  useEffect(() => {
    const unsub1 = eventBus.on(Events.HUB_OPEN, () => setIsOpen(true))
    const unsub2 = eventBus.on(Events.HUB_CLOSE, () => setIsOpen(false))
    return () => {
      unsub1()
      unsub2()
    }
  }, [])

  const send = useCallback(
    async (content: string) => {
      if (!content.trim()) return
      setMessages((p) => [
        ...p,
        {
          id: genId(),
          role: "user",
          content: content.trim(),
          timestamp: now(),
        },
      ])
      setInput("")
      setIsTyping(true)
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200))
      const resp = customMock ? customMock(content) : mockResponse(content)
      setMessages((p) => [
        ...p,
        { id: genId("-r"), role: "assistant", content: resp, timestamp: now() },
      ])
      setIsTyping(false)
    },
    [customMock],
  )

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const copyMsg = (text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const TABS = [
    { key: "chat" as const, icon: MessageSquare, label: "对话" },
    { key: "commands" as const, icon: Command, label: "命令" },
    { key: "prompts" as const, icon: BookOpen, label: "提示词" },
    { key: "settings" as const, icon: Sliders, label: "配置" },
  ]

  const panelClass = isMaximized
    ? "fixed inset-4 md:inset-8 z-[60]"
    : isMobile
      ? "fixed inset-0 z-[60]"
      : "fixed bottom-20 right-4 w-[520px] h-[680px] z-[60]"

  // 浮窗按钮
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        data-testid={`hub-btn-${systemId}`}
        className="fixed z-[60] group"
        style={{ bottom: isMobile ? 80 : 24, right: isMobile ? 16 : 24 }}
      >
        <div
          className="relative rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          style={{
            width: isMobile ? 48 : 56,
            height: isMobile ? 48 : 56,
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
          }}
        >
          <Sparkles className="text-white" size={isMobile ? 22 : 26} />
          <div
            className="absolute inset-0 rounded-2xl animate-ping opacity-20"
            style={{ background: accentColor }}
          />
        </div>
      </button>
    )
  }

  // 面板
  return (
    <div className={panelClass}>
      <div
        className="w-full h-full rounded-2xl bg-card/95 backdrop-blur-2xl flex flex-col overflow-hidden border shadow-2xl"
        style={{
          borderColor: `${accentColor}33`,
          boxShadow: `0 0 60px ${accentColor}15`,
        }}
      >
        {/* Header */}
        <div
          className="shrink-0 px-4 py-3 flex items-center justify-between"
          style={{
            borderBottom: `1px solid ${accentColor}15`,
            background: `${accentColor}08`,
          }}
        >
          <div>
            <h3 className="text-foreground text-sm font-medium">{title}</h3>
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: accentColor }}
              />
              <span className="text-muted-foreground text-xs">
                {systemId} · {commands.length} 条命令
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setMessages([
                  {
                    id: "new",
                    role: "assistant",
                    content: "对话已清空。",
                    timestamp: now(),
                  },
                ])
              }
              className="p-1.5 rounded-lg hover:bg-muted"
            >
              <Trash2
                className="w-4 h-4"
                style={{ color: `${accentColor}66` }}
              />
            </button>
            {!isMobile && (
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1.5 rounded-lg hover:bg-muted"
              >
                {isMaximized ? (
                  <Minimize2
                    className="w-4 h-4"
                    style={{ color: `${accentColor}66` }}
                  />
                ) : (
                  <Maximize2
                    className="w-4 h-4"
                    style={{ color: `${accentColor}66` }}
                  />
                )}
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-destructive/10"
            >
              <X
                className="w-4 h-4"
                style={{ color: `${accentColor}88` }}
              />
            </button>
          </div>
        </div>

        {/* Persona bar */}
        {showPersonas && renderPersonaBar && (
          <div
            className="shrink-0 px-3 pb-2"
            style={{ borderBottom: `1px solid ${accentColor}10` }}
          >
            {renderPersonaBar()}
          </div>
        )}

        {/* Tab bar */}
        <div
          className="shrink-0 flex items-center gap-0.5 px-2 py-1.5 overflow-x-auto"
          style={{
            borderBottom: `1px solid ${accentColor}08`,
            background: `${accentColor}05`,
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg shrink-0 border transition-colors"
              style={{
                fontSize: "0.68rem",
                background:
                  activeTab === t.key ? `${accentColor}18` : "transparent",
                color: activeTab === t.key ? accentColor : `${accentColor}66`,
                borderColor:
                  activeTab === t.key ? `${accentColor}44` : "transparent",
              }}
            >
              <t.icon className="w-3 h-3" /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Chat */}
          {activeTab === "chat" && (
            <>
              <div className="flex-1 overflow-auto p-3 space-y-3">
                {messages.map((msg) => {
                  const isUser = msg.role === "user"
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] relative group px-3.5 py-2.5 ${isUser ? "rounded-2xl rounded-br-sm" : "rounded-2xl rounded-bl-sm"}`}
                        style={{
                          background: isUser
                            ? `${accentColor}18`
                            : "rgba(0,40,80,0.3)",
                          border: `1px solid ${isUser ? `${accentColor}33` : "rgba(0,180,255,0.1)"}`,
                        }}
                      >
                        <div
                          className="whitespace-pre-wrap text-foreground"
                          style={{ fontSize: "0.78rem", lineHeight: 1.6 }}
                        >
                          {msg.content}
                        </div>
                        {msg.role === "assistant" && (
                          <button
                            onClick={() => copyMsg(msg.content, msg.id)}
                            className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-success" />
                            ) : (
                              <Copy
                                className="w-3 h-3"
                                style={{ color: `${accentColor}55` }}
                              />
                            )}
                          </button>
                        )}
                        <div
                          className="text-muted-foreground/50"
                          style={{ fontSize: "0.58rem" }}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString("zh-CN")}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted border rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1.5">
                        {[0, 150, 300].map((d) => (
                          <div
                            key={d}
                            className="w-2 h-2 rounded-full animate-bounce"
                            style={{
                              background: accentColor,
                              animationDelay: `${d}ms`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div
                className="shrink-0 p-3"
                style={{ borderTop: `1px solid ${accentColor}15` }}
              >
                <div className="flex items-end gap-2">
                  {voiceSupported && (
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`p-2.5 rounded-xl min-w-[40px] min-h-[40px] flex items-center justify-center ${isListening ? "bg-destructive/10/20 border border-destructive/20/40 animate-pulse" : ""}`}
                      style={{
                        background:
                          isListening ? undefined : "rgba(0,40,80,0.4)",
                        border: isListening
                          ? undefined
                          : `1px solid ${accentColor}22`,
                      }}
                    >
                      {isListening ? (
                        <MicOff className="w-4 h-4 text-destructive" />
                      ) : (
                        <Mic
                          className="w-4 h-4"
                          style={{ color: `${accentColor}88` }}
                        />
                      )}
                    </button>
                  )}
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={
                      isListening ? "🎤 正在聆听..." : "输入指令... (Enter 发送)"
                    }
                    rows={1}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none resize-none border"
                    style={{
                      fontSize: "0.8rem",
                      maxHeight: "100px",
                      borderColor: `${accentColor}22`,
                    }}
                  />
                  <button
                    onClick={() => send(input)}
                    disabled={!input.trim() || isTyping}
                    className="p-2.5 rounded-xl text-white min-w-[44px] min-h-[44px] flex items-center justify-center disabled:opacity-30"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Commands */}
          {activeTab === "commands" && (
            <div className="flex-1 overflow-auto p-3">
              <h4 className="text-foreground mb-3 text-sm font-medium">
                系统快捷命令
              </h4>
              {commands.length === 0 ? (
                <p className="text-muted-foreground text-xs">暂无注册命令</p>
              ) : (
                <div className="space-y-1">
                  {commands.map((cmd) => {
                    const Icon = cmd.icon
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          setActiveTab("chat")
                          send(cmd.label)
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl transition-all hover:opacity-80 border bg-muted/50"
                        style={{ borderColor: `${accentColor}10` }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: accentColor }}
                        />
                        <span className="text-foreground text-xs">
                          {cmd.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Prompts */}
          {activeTab === "prompts" && (
            <div className="flex-1 overflow-auto p-3">
              <h4 className="text-foreground mb-3 text-sm font-medium">
                提示词预设
              </h4>
              <div className="space-y-2 mb-4">
                {allPrompts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSystemPrompt(p.prompt)
                      setActiveTab("chat")
                    }}
                    className="p-3 rounded-xl border cursor-pointer"
                    style={{
                      borderColor:
                        systemPrompt === p.prompt
                          ? `${accentColor}44`
                          : `${accentColor}10`,
                      background:
                        systemPrompt === p.prompt
                          ? `${accentColor}10`
                          : "rgba(0,40,80,0.15)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-foreground text-xs font-medium">
                        {p.name}
                      </span>
                      <span
                        className="px-1.5 py-0.5 rounded"
                        style={{
                          background: `${accentColor}10`,
                          color: accentColor,
                          fontSize: "0.55rem",
                        }}
                      >
                        {p.category}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {p.prompt.slice(0, 60)}...
                    </p>
                  </div>
                ))}
              </div>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-muted text-foreground focus:outline-none resize-none border"
                style={{ fontSize: "0.75rem", borderColor: `${accentColor}22` }}
                rows={4}
              />
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="flex-1 overflow-auto p-3 space-y-4">
              <div>
                <h4 className="text-foreground mb-2 flex items-center gap-2 text-sm font-medium">
                  <Key className="w-4 h-4" style={{ color: accentColor }} /> API
                  Key
                </h4>
                <div className="relative">
                  <input
                    type={showAk ? "text" : "password"}
                    value={localAk}
                    onChange={(e) => {
                      setLocalAk(e.target.value)
                      persist(StorageKeys.AI_API_KEY, e.target.value)
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted text-foreground focus:outline-none border font-mono"
                    style={{
                      fontSize: "0.78rem",
                      borderColor: `${accentColor}22`,
                    }}
                    placeholder="sk-..."
                  />
                  <button
                    onClick={() => setShowAk(!showAk)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                  >
                    <span
                      className="text-muted-foreground"
                      style={{ fontSize: "0.65rem" }}
                    >
                      {showAk ? "隐藏" : "显示"}
                    </span>
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-foreground mb-2 flex items-center gap-2 text-sm font-medium">
                  <Cpu className="w-4 h-4" style={{ color: accentColor }} />{" "}
                  模型
                </h4>
                <input
                  value={localMk}
                  onChange={(e) => {
                    setLocalMk(e.target.value)
                    persist(StorageKeys.AI_MODEL, e.target.value)
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-muted text-foreground focus:outline-none border"
                  style={{ fontSize: "0.78rem", borderColor: `${accentColor}22` }}
                  placeholder="gpt-4o"
                />
              </div>
              <button
                onClick={() => {
                  setLocalAk("")
                  setLocalMk("")
                }}
                className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 border bg-muted text-muted-foreground text-xs hover:bg-muted/80"
              >
                <RotateCcw className="w-3.5 h-3.5" /> 清空配置
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
