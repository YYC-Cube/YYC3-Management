"use client"

/**
 * @fileoverview AI Family 模型设置页面
 */

import { useState } from "react"
import { Sliders, Key, Cpu, Save } from "lucide-react"
import { FAMILY_PERSONAS } from "@/lib/plugin-system/family-personas"
import { storage, StorageKeys } from "@/lib/plugin-system/storage"

export function FamilySettingsPage() {
  const s = storage.aiFamily
  const [apiKey, setApiKey] = useState(s.get(StorageKeys.AI_API_KEY, "") ?? "")
  const [model, setModel] = useState(s.get(StorageKeys.AI_MODEL, "") ?? "")

  const handleSave = () => {
    s.set(StorageKeys.AI_API_KEY, apiKey)
    s.set(StorageKeys.AI_MODEL, model)
  }

  return (
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-2 mb-6">
        <Sliders className="w-5 h-5 text-[#00FF88]" />
        <h1 className="text-foreground text-lg font-medium">Family 设置</h1>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Key className="w-4 h-4" /> API Key
          </label>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-muted border text-foreground focus:outline-none focus:border-[#00FF88]"
            style={{ fontSize: "0.8rem" }}
            placeholder="sk-..."
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Cpu className="w-4 h-4" /> 默认模型
          </label>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-muted border text-foreground focus:outline-none focus:border-[#00FF88]"
            style={{ fontSize: "0.8rem" }}
            placeholder="gpt-4o"
          />
        </div>

        <div>
          <h3 className="text-muted-foreground text-sm mb-2">家人模型绑定</h3>
          <div className="space-y-1">
            {FAMILY_PERSONAS.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="flex justify-between px-3 py-2 rounded-lg bg-muted/50 border"
              >
                <span className="text-muted-foreground text-sm">
                  {p.shortName}
                </span>
                <span className="text-foreground text-sm">
                  {p.modelName ?? "默认"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
        >
          <Save className="w-4 h-4" /> 保存配置
        </button>
      </div>
    </div>
  )
}
