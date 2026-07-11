import { createPageMetadata, PAGE_METADATA } from "@/lib/metadata"

const meta = PAGE_METADATA["channel-center"] || { title: "channel center" }
export const metadata = createPageMetadata(meta)

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
