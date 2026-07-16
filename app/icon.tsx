/**
 * @fileoverview app/icon.tsx — Next.js 约定式 Favicon 生成器
 * @description 动态生成 SVG-based favicon，作为静态 favicon.ico 的补充
 *              Next.js 会自动在 <head> 注入 <link rel="icon" href="/icon" />
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
 * @author YYC³
 * @version 3.1.0
 * @created 2026-07-17
 * @license MIT
 */

import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
export const alt = 'YYC³ 企业智能管理系统'

/**
 * 生成 YYC³ 品牌 Favicon
 * 设计：蓝色渐变背景 + 白色 "Y" 字母（简化品牌标识）
 */
export default function Icon() {
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
          borderRadius: '6px',
          fontSize: '20px',
          fontWeight: 700,
          color: 'white',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        Y
      </div>
    ),
    { ...size }
  )
}
