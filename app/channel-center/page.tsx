import { ChannelCenter } from "@/components/channel-center"
import { PageContainer } from "@/components/layout/page-container"

export default function ChannelCenterPage() {
  return (
    <PageContainer
      title="渠道中心"
      description="渠道管理中心"
      className="p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChannelCenter showTitle={false} />
      </div>
    </PageContainer>
  )
}
