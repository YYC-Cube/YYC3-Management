"use client"

import { SystemTesting } from "@/components/system-testing"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function SystemTestingPage() {
  return (
    <PageContainer
      title="系统测试"
      description="功能测试和验证"
      className="p-6"
    >
      <div className="responsive-grid-2">
        <SystemTesting />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
