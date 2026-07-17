import { PageContainer } from "@/components/layout/page-container"
import UserManagement from "@/components/user-management"
import { createPageMetadata, PAGE_METADATA } from "@/lib/metadata"

export const metadata = createPageMetadata(PAGE_METADATA["user-management"] || { title: "用户管理" })

export default function UserManagementPage() {
  return (
    <PageContainer
      title="用户管理"
      description="用户权限和角色管理"
      className="p-6"
    >
      <div className="responsive-grid-3">
        <UserManagement />
      </div>
    </PageContainer>
  )
}
