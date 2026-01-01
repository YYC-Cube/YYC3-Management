"use client"

import { ModuleCards } from "@/components/module-cards"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"

export default function ModulesPage() {
  return (
    <div className="p-6">
      {/* 页面头部区域 - 统一设计规范 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">应用总览</h1>
          <p className="text-slate-600 mt-1">选择您需要的功能模块，开始高效管理</p>
        </div>
      </div>

      {/* 功能模块卡片 */}
      <ModuleCards />

      <FloatingNavButtons />
    </div>
  )
}
