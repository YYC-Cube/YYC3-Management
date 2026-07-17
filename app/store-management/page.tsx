"use client"

import { StoreManagement } from "@/components/store-management"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function StoreManagementPage() {
  return (
    <PageContainer
      title="商店管理"
      description="商店和订单管理"
      className="p-6"
    >
      <div className="responsive-grid-2">
        <StoreManagement />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
