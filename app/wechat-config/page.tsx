"use client"

import { WechatConfiguration } from "@/components/wechat-configuration"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function WechatConfigPage() {
  return (
    <PageContainer
      title="微信配置"
      description="微信集成配置"
      className="p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WechatConfiguration showTitle={false} />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
