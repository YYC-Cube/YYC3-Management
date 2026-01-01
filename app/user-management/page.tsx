import type { Metadata } from "next"
import UserManagement from "@/components/user-management"
import { PageContainer } from "@/components/layout/page-container"

export const metadata: Metadata = {
  title: "用户管理 - 金兰企业管理系统",
  description: "用户权限和角色管理",
}

export default function UserManagementPage() {
  return (
    <PageContainer title="用户管理" description="用户权限和角色管理">
      <UserManagement showTitle={false} />
    </PageContainer>
  )
}
