import { PageContainer } from "@/components/layout/page-container"
import LogManagement from "@/components/log-management"
import { createPageMetadata, PAGE_METADATA } from "@/lib/metadata"

export const metadata = createPageMetadata(PAGE_METADATA["log-management"] || { title: "日志管理" })

export default function LogManagementPage() {
  return (
    <PageContainer
      title="日志管理"
      description="系统日志管理"
      className="p-6"
    >
      <div className="responsive-grid-2">
        <LogManagement />
      </div>
    </PageContainer>
  )
}
