// app/profile/page.tsx

// 导入FloatingNavButtons组件
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import { PageContainer } from "@/components/layout/page-container"

export default function ProfilePage() {
  return (
    <>
      <PageContainer title="个人中心" description="管理您的个人信息和账户设置">
        {/* 现有内容 */}
        <div>
          <p>欢迎来到您的个人中心！</p>
        </div>
      </PageContainer>
      <FloatingNavButtons />
    </>
  )
}
