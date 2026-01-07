"use client"

import { PerformanceOptimization } from "@/components/performance-optimization"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function PerformanceOptimizationPage() {
  return (
    <PageContainer
      title="性能优化"
      description="系统性能优化工具"
      className="p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceOptimization showTitle={false} />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
