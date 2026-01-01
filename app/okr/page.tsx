import { OKRManagementEnhanced } from "@/components/okr-management-enhanced"
import { PageContainer } from "@/components/layout/page-container"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"

export default function OKRPage() {
  return (
    <PageContainer title="OKR目标管理" description="目标与关键结果管理系统 - 通知协作增强版">
      <OKRManagementEnhanced />
      <FloatingNavButtons />
    </PageContainer>
  )
}
