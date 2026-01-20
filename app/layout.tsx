/**
 * @fileoverview layout.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AIWidgetProvider } from "@/components/ai-floating-widget"
import { PageTitleProvider } from "@/contexts/page-title-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "企业管理系统 - Enterprise Management System",
  description: "现代化企业管理系统，提供客户管理、任务管理、数据分析等功能",
  keywords: "企业管理,客户管理,任务管理,数据分析,CRM,ERP",
  authors: [{ name: "Enterprise Team" }],
  manifest: "/manifest.json",
  generator: 'v0.app',
  icons: {
    icon: [{ url: "/yyc3-pwa-icon.png" }],
    apple: [{ url: "/yyc3-pwa-icon.png", sizes: "180x180" }]
  }
}

export const generateViewport = () => {
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#3b82f6'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/yyc3-pwa-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <PageTitleProvider>
          <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
            <AIWidgetProvider autoInit={true}>
              <div className="flex h-screen bg-gray-50">
                {/* 侧边栏 */}
                <Sidebar />

                {/* 主内容区域 */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* 头部 */}
                  <Header />

                  {/* 页面内容 */}
                  <main className="flex-1 overflow-auto">{children}</main>
                </div>
              </div>
              <Toaster />
            </AIWidgetProvider>
          </ThemeProvider>
        </PageTitleProvider>
      </body>
    </html>
  )
}
