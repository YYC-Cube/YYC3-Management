"use client"

import { ModuleCards } from "@/components/module-cards"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function ModulesPage() {
  return (
    <PageContainer
      title="应用总览"
      description="选择您需要的功能模块，开始高效管理"
      className="p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModuleCards />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
