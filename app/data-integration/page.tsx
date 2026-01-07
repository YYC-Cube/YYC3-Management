"use client"

import { DataIntegration } from "@/components/data-integration"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function DataIntegrationPage() {
  return (
    <PageContainer
      title="数据集成"
      description="数据集成和同步"
      className="p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataIntegration showTitle={false} />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
