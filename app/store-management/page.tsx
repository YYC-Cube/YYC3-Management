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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StoreManagement showTitle={false} />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
