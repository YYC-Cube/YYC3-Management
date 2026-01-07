"use client"

import { AiSmartForms } from "@/components/ai-smart-forms"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function AiSmartFormsPage() {
  return (
    <PageContainer
      title="AI智能表单"
      description="智能表单生成与自动填充系统"
      className="p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AiSmartForms />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
