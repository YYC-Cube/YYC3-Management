import { createPageMetadata, PAGE_METADATA } from "@/lib/metadata"
import SystemSettings from "@/components/system-settings"
import { PageContainer } from "@/components/layout/page-container"

export const metadata = createPageMetadata(PAGE_METADATA["system-settings"] || { title: "系统设置" })

export default function SystemSettingsPage() {
  return (
    <PageContainer title="系统设置" description="全局系统配置管理">
      <SystemSettings />
    </PageContainer>
  )
}
