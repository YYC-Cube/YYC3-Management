"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { commonStyles } from "@/lib/design-system"
import { usePageTitle } from "@/contexts/page-title-context"

interface PageContainerProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function PageContainer({ title, description, children, className = "" }: PageContainerProps) {
  const { setTitle } = usePageTitle()

  useEffect(() => {
    setTitle(title)
  }, [title, setTitle])

  return (
    <div className={`${commonStyles.layout.container} ${className}`}>
      <div className="space-y-6">
        <div className="border-b border-sky-100 pb-6">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {description && <p className="text-slate-600 mt-2">{description}</p>}
        </div>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  )
}