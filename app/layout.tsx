/**
 * @fileoverview layout.tsx — Root Layout with full multi-device adaptation
 * @description YYC³ 企业智能管理系统根布局，含全端Logo、PWA、SEO、多端适配
 * @author YYC³
 * @version 3.0.0
 * @created 2025-01-30
 * @modified 2026-07-11
 * @copyright Copyright (c) 2025-2026 YYC³
 * @license MIT
 */

import { AIWidgetProvider } from "@/components/ai-floating-widget"
import { BottomNav } from "@/components/bottom-nav"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { PageTitleProvider } from "@/contexts/page-title-context"
import { I18nProvider } from "@/lib/i18n"
import type { Metadata, Viewport } from "next"
import type React from "react"
import "./globals.css"

// 使用系统字体栈替代 next/font/google 的 Inter 字体
// 避免 CI 构建时无法获取 Google Fonts 导致构建失败
const inter = {
  className: "font-sans",
  style: { fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans SC", sans-serif' },
}

const siteUrl = "https://management.yyc3.vip"
const siteName = "YYC³ 企业智能管理系统"
const siteDescription =
  "YYC³ 企业智能管理系统 — 集成AI助手、客户管理、任务管理、数据分析的企业级管理平台"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "YYC³ 企业智能管理系统 | YanYuCloudCube Enterprise Management",
    template: "%s | YYC³ 企业智能管理系统",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "YYC³", "企业管理", "客户管理", "任务管理", "数据分析", "AI助手",
    "CRM", "ERP", "Enterprise Management", "YanYuCloudCube", "言语云立方",
  ],
  authors: [{ name: "YYC³ Team", url: "https://yyc3.vip" }],
  creator: "YYC³ Team",
  publisher: "YYC³ Team",
  manifest: "/manifest.json",
  generator: "YYC³ Enterprise Management v3.0.0",

  // ==========================================
  // 全端 Logo / Favicon 配置（PC + Mobile + PWA + iOS + Android）
  // ==========================================
  icons: {
    icon: [
      { url: "/yyc3-icons/favicon/favicon.ico", sizes: "48x48" },
      { url: "/yyc3-icons/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/yyc3-icons/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/yyc3-icons/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/yyc3-icons/pwa/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: ["/yyc3-icons/favicon/favicon.ico"],
    apple: [
      { url: "/yyc3-icons/ios/icon-180.png", sizes: "180x180", type: "image/png" },
      { url: "/yyc3-icons/ios/icon-152.png", sizes: "152x152", type: "image/png" },
      { url: "/yyc3-icons/ios/icon-167.png", sizes: "167x167", type: "image/png" },
    ],
    other: [
      // Android Chrome M48+
      {
        rel: "icon",
        url: "/yyc3-icons/pwa/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/yyc3-icons/pwa/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },

  // ==========================================
  // 社交媒体 / Open Graph
  // ==========================================
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: "YYC³ 企业智能管理系统",
    description: siteDescription,
    images: [
      {
        url: "/yyc3-icons/pwa/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "YYC³ 企业智能管理系统",
      },
    ],
  },

  // ==========================================
  // Twitter Card
  // ==========================================
  twitter: {
    card: "summary_large_image",
    title: "YYC³ 企业智能管理系统",
    description: siteDescription,
    images: ["/yyc3-icons/pwa/icon-512x512.png"],
  },

  // ==========================================
  // 机器人 / 爬虫
  // ==========================================
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ==========================================
  // PWA / 应用相关
  // ==========================================
  appLinks: {
    web: {
      url: siteUrl,
      should_fallback: true,
    },
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  alternates: {
    canonical: siteUrl,
  },

  category: "business",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* ========================================== */}
        {/* 全端 Logo / Favicon 链接                    */}
        {/* ========================================== */}
        <link rel="icon" href="/yyc3-icons/favicon/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/yyc3-icons/favicon/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/yyc3-icons/favicon/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/yyc3-icons/favicon/favicon-96x96.png" sizes="96x96" type="image/png" />
        <link rel="icon" href="/yyc3-icons/pwa/icon-192x192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/yyc3-icons/pwa/icon-512x512.png" sizes="512x512" type="image/png" />

        {/* iOS / Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/yyc3-icons/ios/icon-180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/yyc3-icons/ios/icon-152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/yyc3-icons/ios/icon-167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/yyc3-icons/ios/icon-180.png" />

        {/* PWA / Mobile Web App */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="YYC³ 管理系统" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />

        {/* PWA 启动图 (WebP 优化) */}
        <link rel="apple-touch-startup-image" href="/yyc3-icons/webp/icon-512x512.webp" />

        {/* Android Chrome */}
        <meta name="application-name" content="YYC³ 管理系统" />
        <meta name="theme-color" content="#3b82f6" />

        {/* Windows Tile */}
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-TileImage" content="/yyc3-icons/pwa/icon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        >
          跳转到主要内容
        </a>
        <I18nProvider>
          <PageTitleProvider>
            <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
              <AIWidgetProvider autoInit={true}>
                <div className="flex h-screen bg-slate-50">
                  {/* 侧边栏 */}
                  <Sidebar />

                  {/* 主内容区域 */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* 头部 */}
                    <Header />

                    {/* 页面内容 */}
                    <main id="main-content" className="flex-1 overflow-auto main-content-adaptive" role="main">{children}</main>
                  </div>

                  {/* 移动端底部导航（仅 xs/sm 显示） */}
                  <BottomNav />
                </div>
                <Toaster />
              </AIWidgetProvider>
            </ThemeProvider>
          </PageTitleProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
