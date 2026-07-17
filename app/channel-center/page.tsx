import { ChannelCenter } from "@/components/channel-center"
import { PageContainer } from "@/components/layout/page-container"

export default function ChannelCenterPage() {
  return (
    <PageContainer
      title="渠道中心"
      description="渠道管理中心"
      className="p-6"
    >
      <div className="responsive-grid-2">
        <ChannelCenter />
      </div>
    </PageContainer>
  )
}
