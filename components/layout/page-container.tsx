"use client"

import type { ReactNode } from "react"
import { commonStyles } from "@/lib/design-system"

interface PageContainerProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function PageContainer({ title, description, children, className = "" }: PageContainerProps) {
  return (
    <div className={`${commonStyles.layout.container} ${className}`}>
      <div className="space-y-6">
        {/* 页面头部 */}
        <div className="border-b border-sky-100 pb-6">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {description && <p className="text-slate-600 mt-2">{description}</p>}
        </div>

        {/* 页面内容 */}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  )
}
