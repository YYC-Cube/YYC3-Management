"use client"

import { ParameterSettings } from "@/components/parameter-settings"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function ParameterSettingsPage() {
  return (
    <PageContainer
      title="参数设置"
      description="系统参数配置"
      className="p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ParameterSettings showTitle={false} />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
