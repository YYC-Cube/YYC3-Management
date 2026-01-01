"use client"

import { AiSmartForms } from "@/components/ai-smart-forms"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"

export default function AiSmartFormsPage() {
  return (
    <div className="p-6">
      {/* 页面头部区域 - 统一设计规范 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI智能表单</h1>
          <p className="text-slate-600 mt-1">智能表单生成与自动填充系统</p>
        </div>
      </div>

      {/* AI智能表单内容 */}
      <AiSmartForms />

      <FloatingNavButtons />
    </div>
  )
}
