"use client"

import { TenantManagement } from "@/components/tenant-management"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"

export default function TenantManagementPage() {
  return (
    <>
      <TenantManagement />
      <FloatingNavButtons />
    </>
  )
}
