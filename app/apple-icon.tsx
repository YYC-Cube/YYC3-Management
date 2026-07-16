/**
 * @fileoverview app/apple-icon.tsx — Next.js 约定式 Apple Touch Icon 生成器
 * @description 动态生成 180x180 Apple Touch Icon，作为静态 iOS 图标的补充
 *              Next.js 会自动在 <head> 注入 <link rel="apple-touch-icon" href="/apple-icon" />
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
 * @author YYC³
 * @version 3.1.0
 * @created 2026-07-17
 * @license MIT
 */

import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'
export const alt = 'YYC³ 企业智能管理系统'

/**
 * 生成 YYC³ 品牌 Apple Touch Icon
 * 设计：蓝色渐变背景 + 白色 "YYC³" 文字（完整品牌标识）
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          fontSize: '56px',
          fontWeight: 700,
          color: 'white',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '-2px',
        }}
      >
        YYC³
      </div>
    ),
    { ...size }
  )
}
