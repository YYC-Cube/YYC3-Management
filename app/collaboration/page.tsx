import { TeamCollaboration } from "@/components/team-collaboration"
import { PageContainer } from "@/components/layout/page-container"

export default function CollaborationPage() {
  return (
    <PageContainer
      title="团队协作"
      description="共享目标，协同合作，共同成长"
      className="p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamCollaboration showTitle={false} />
      </div>
    </PageContainer>
  )
}
