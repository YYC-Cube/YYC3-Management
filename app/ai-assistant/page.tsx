"use client"

import { AIAssistant } from "@/components/ai-assistant"
import { PageContainer } from "@/components/layout/page-container"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"

export default function AIAssistantPage() {
  return (
    <>
      <PageContainer title="AI智能助手" description="智能业务助手，提供数据分析和决策支持">
        <div className="min-h-screen">
          <AIAssistant />
        </div>
      </PageContainer>
      <FloatingNavButtons />
    </>
  )
}
