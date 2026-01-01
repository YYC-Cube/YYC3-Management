import type { Metadata } from "next"
import SystemSettings from "@/components/system-settings"
import { PageContainer } from "@/components/layout/page-container"

export const metadata: Metadata = {
  title: "系统设置 - 金兰企业管理系统",
  description: "全局系统配置管理",
}

export default function SystemSettingsPage() {
  return (
    <PageContainer title="系统设置" description="全局系统配置管理">
      <SystemSettings showTitle={false} />
    </PageContainer>
  )
}
