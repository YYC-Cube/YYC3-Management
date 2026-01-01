"use client"

import { SecurityCenter } from "@/components/security-center"
import { PageContainer } from "@/components/layout/page-container"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"

export default function SecurityPage() {
  return (
    <>
      <PageContainer title="安全中心" description="监控和管理系统安全状态">
        <SecurityCenter showTitle={false} />
      </PageContainer>
      <FloatingNavButtons />
    </>
  )
}
