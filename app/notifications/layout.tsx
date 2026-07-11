import { createPageMetadata, PAGE_METADATA } from "@/lib/metadata"

const meta = PAGE_METADATA["notifications"] || { title: "notifications" }
export const metadata = createPageMetadata(meta)

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
