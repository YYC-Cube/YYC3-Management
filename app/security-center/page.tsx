import { SecurityCenter } from "@/components/security-center"
import { PageContainer } from "@/components/layout/page-container"

export default function SecurityCenterPage() {
  return (
    <PageContainer title="安全中心" description="监控和管理系统安全状态">
      <SecurityCenter showTitle={false} />
    </PageContainer>
  )
}
