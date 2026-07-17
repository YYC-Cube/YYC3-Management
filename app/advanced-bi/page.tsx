"use client"

import { AdvancedBIReports } from "@/components/advanced-bi-reports"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function AdvancedBIPage() {
  return (
    <PageContainer
      title="高级商业智能"
      description="数据分析和BI报表"
      className="p-6"
    >
      <div className="responsive-grid-2">
        <AdvancedBIReports />
        <FloatingNavButtons />
      </div>
    </PageContainer>
  )
}
