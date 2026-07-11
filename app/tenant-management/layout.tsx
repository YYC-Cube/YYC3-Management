import { createPageMetadata, PAGE_METADATA } from "@/lib/metadata"

const meta = PAGE_METADATA["tenant-management"] || { title: "tenant management" }
export const metadata = createPageMetadata(meta)

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
