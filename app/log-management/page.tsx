import type { Metadata } from "next"
import LogManagement from "@/components/log-management"

export const metadata: Metadata = {
  title: "日志管理 - 金兰企业管理系统",
  description: "系统操作日志查看",
}

export default function LogManagementPage() {
  return <LogManagement />
}
