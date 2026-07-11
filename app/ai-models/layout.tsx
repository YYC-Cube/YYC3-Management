import { createPageMetadata, PAGE_METADATA } from "@/lib/metadata"

const meta = PAGE_METADATA["ai-models"] || { title: "AI模型管理" }
export const metadata = createPageMetadata({ ...meta, description: "管理AI模型配置 · 扫描Ollama · 可视化测试" })

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
