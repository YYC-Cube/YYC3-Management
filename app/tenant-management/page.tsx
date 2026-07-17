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
      <div className="responsive-grid-2">
        <TenantManagement />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
