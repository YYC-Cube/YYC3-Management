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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemManagementOverview showTitle={false} />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
