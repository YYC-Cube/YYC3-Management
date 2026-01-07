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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HelpCenter showTitle={false} />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
