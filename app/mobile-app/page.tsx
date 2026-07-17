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
      <div className="responsive-grid-2">
        <MobileNativeApp />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
