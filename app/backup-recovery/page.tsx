"use client"

import { BackupRecovery } from "@/components/backup-recovery"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function BackupRecoveryPage() {
  return (
    <PageContainer
      title="备份恢复"
      description="数据备份和恢复管理"
      className="p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BackupRecovery showTitle={false} />
      </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
