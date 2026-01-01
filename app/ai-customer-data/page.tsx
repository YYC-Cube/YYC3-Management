"use client"

import { AiCustomerData } from "@/components/ai-customer-data"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function AiCustomerDataPage() {
  return (
    <PageContainer title="AI客户数据" description="智能客户数据分析与转化预测系统">
      {/* AI客户数据内容 */}
      <AiCustomerData />

      <FloatingNavButtons />
    </PageContainer>
  )
}
