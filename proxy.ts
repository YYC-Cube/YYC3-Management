/**
 * @fileoverview Next.js Edge Proxy — 请求拦截与认证重定向
 * @author YYC³
 * @version 3.0.0
 * @created 2026-01-01
 * @license MIT
 *
 * Next.js 16 已弃用 middleware.ts 文件约定，改用 proxy.ts。
 * 参见：https://nextjs.org/docs/messages/middleware-to-proxy
 *
 * 注意：proxy/middleware 仅在 standalone (Docker) 模式下运行；
 * output: 'export' (GitHub Pages) 不支持，导出构建会通过
 * scripts/prepare-static-export.sh 移除本文件。
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = ["/login", "/register", "/forgot-password", "/offline", "/unauthorized"]

const staticPaths = [
  "/_next",
  "/favicon.ico",
  "/yyc3-icons",
  "/images",
  "/icons",
  "/manifest.json",
  "/sw.js",
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (staticPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  if (publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))) {
    return NextResponse.next()
  }

  const token =
    request.cookies.get("auth_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "")

  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json).*)",
  ],
}
