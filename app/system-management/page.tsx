"use client"

import { SystemManagementOverview } from "@/components/system-management-overview"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function SystemManagementPage() {
  return (
    <PageContainer
      title="系统管理"
      description="系统配置和管理"
      className="p-6"
    >
      <div className="responsive-grid-2">
        <SystemManagementOverview />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
