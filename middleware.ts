import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 公开路径（不需要认证）
const publicPaths = ["/login", "/register", "/forgot-password", "/offline", "/unauthorized"]

// 静态资源路径
const staticPaths = ["/_next", "/favicon.ico", "/images", "/icons", "/manifest.json", "/sw.js"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 跳过静态资源
  if (staticPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 跳过 API 路由
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // 允许所有请求通过
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
