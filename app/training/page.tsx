"use client"

import { UserTraining } from "@/components/user-training"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function TrainingPage() {
  return (
    <PageContainer
      title="用户培训"
      description="用户培训和教程"
      className="p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserTraining showTitle={false} />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
