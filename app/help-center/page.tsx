"use client"

import { HelpCenter } from "@/components/help-center"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function HelpCenterPage() {
  return (
    <PageContainer
      title="帮助中心"
      description="系统帮助和支持"
      className="p-6"
    >
      <div className="responsive-grid-2">
        <HelpCenter />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
