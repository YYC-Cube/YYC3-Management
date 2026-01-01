/**
 * @fileoverview page.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { DashboardContent } from "@/components/dashboard-content"
import { PageContainer } from "@/components/layout/page-container"

export default function HomePage() {
  return (
    <PageContainer title="运营中心" description="欢迎回来，这里是您的企业管理控制台">
      <DashboardContent showTitle={false} />
    </PageContainer>
  )
}
