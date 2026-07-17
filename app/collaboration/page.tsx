import { PageContainer } from "@/components/layout/page-container"
import { TeamCollaboration } from "@/components/team-collaboration"

export default function CollaborationPage() {
  return (
    <PageContainer
      title="团队协作"
      description="共享目标，协同合作，共同成长"
      className="p-6"
    >
      <div className="responsive-grid-2">
        <TeamCollaboration showTitle={false} />
      </div>
    </PageContainer>
  )
}
