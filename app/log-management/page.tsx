import type { Metadata } from "next"
import LogManagement from "@/components/log-management"
import { PageContainer } from "@/components/layout/page-container"

export const metadata: Metadata = {
  title: "日志管理 - 金兰企业管理系统",
  description: "系统操作日志查看",
}

export default function LogManagementPage() {
  return (
    <PageContainer
      title="日志管理"
      description="系统日志管理"
      className="p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LogManagement showTitle={false} />
      </div>
    </PageContainer>
  )
}
