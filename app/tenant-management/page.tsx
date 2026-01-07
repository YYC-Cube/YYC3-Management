"use client"

import { TenantManagement } from "@/components/tenant-management"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function TenantManagementPage() {
  return (
    <PageContainer
      title="租户管理"
      description="多租户管理"
      className="p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TenantManagement showTitle={false} />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
