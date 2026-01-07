"use client"

import { MobileNativeApp } from "@/components/mobile-native-app"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function MobileAppPage() {
  return (
    <PageContainer
      title="移动应用"
      description="移动端应用管理"
      className="p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MobileNativeApp showTitle={false} />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
