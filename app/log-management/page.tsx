import { createPageMetadata, PAGE_METADATA } from "@/lib/metadata"
import LogManagement from "@/components/log-management"
import { PageContainer } from "@/components/layout/page-container"

export const metadata = createPageMetadata(PAGE_METADATA["log-management"] || { title: "日志管理" })

export default function LogManagementPage() {
  return (
    <PageContainer
      title="日志管理"
      description="系统日志管理"
      className="p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LogManagement />
      </div>
    </PageContainer>
  )
}
