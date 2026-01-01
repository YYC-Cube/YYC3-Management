"use client"

import { SystemManagementOverview } from "@/components/system-management-overview"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"

export default function SystemManagementPage() {
  return (
    <>
      <SystemManagementOverview />
      <FloatingNavButtons />
    </>
  )
}
