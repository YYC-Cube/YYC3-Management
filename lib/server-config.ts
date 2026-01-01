/**
 * @fileoverview server-config.ts
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// 服务端专用配置文件
// 此文件仅在服务端使用，包含敏感的 API 密钥和凭证
// 警告：切勿在客户端组件中导入此文件

/**
 * 第三方服务配置（服务端）
 */
export const serverConfig = {
  // 高德地图配置
  amap: {
    key: process.env.AMAP_KEY || "",
    securityCode: process.env.AMAP_SECURITY_CODE || "",
  },

  // 七鱼客服配置
  qiyu: {
    appKey: process.env.QIYU_APP_KEY || "",
    appSecret: process.env.QIYU_APP_SECRET || "",
  },

  // 百度统计配置
  baiduAnalytics: {
    trackingId: process.env.BAIDU_ANALYTICS_ID || "",
    apiKey: process.env.BAIDU_ANALYTICS_API_KEY || "",
  },

  // Sentry 配置
  sentry: {
    dsn: process.env.SENTRY_DSN || "",
    authToken: process.env.SENTRY_AUTH_TOKEN || "",
  },

  // 数据库配置
  database: {
    url: process.env.DATABASE_URL || "",
    host: process.env.DB_HOST || "",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "",
  },

  // Redis 配置
  redis: {
    url: process.env.REDIS_URL || "",
    host: process.env.REDIS_HOST || "",
    port: Number.parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || "",
  },

  // 邮件服务配置
  email: {
    host: process.env.EMAIL_HOST || "",
    port: Number.parseInt(process.env.EMAIL_PORT || "587"),
    username: process.env.EMAIL_USERNAME || "",
    password: process.env.EMAIL_PASSWORD || "",
    from: process.env.EMAIL_FROM || "noreply@jinlan.com",
  },

  // 对象存储配置
  storage: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || "",
    accessKeySecret: process.env.STORAGE_ACCESS_KEY_SECRET || "",
    bucket: process.env.STORAGE_BUCKET || "",
    region: process.env.STORAGE_REGION || "",
  },

  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || "",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },

  // API 密钥配置
  apiKeys: {
    internal: process.env.INTERNAL_API_KEY || "",
    external: process.env.EXTERNAL_API_KEY || "",
  },
}

/**
 * 获取服务端配置的辅助函数
 * 仅在服务端使用（Server Components, API Routes, Server Actions）
 */
export function getServerConfig<T extends keyof typeof serverConfig>(key: T): (typeof serverConfig)[T] {
  // 确保只在服务端运行
  if (typeof window !== "undefined") {
    throw new Error("serverConfig 只能在服务端使用，不能在客户端访问")
  }
  return serverConfig[key]
}

/**
 * 检查必需的环境变量是否已配置
 */
export function checkRequiredEnvVars(): {
  valid: boolean
  missing: string[]
} {
  const requiredVars = [
    "JWT_SECRET",
    // 根据实际需求添加必需的环境变量
  ]

  const missing = requiredVars.filter((key) => !process.env[key])

  return {
    valid: missing.length === 0,
    missing,
  }
}

/**
 * 验证配置是否完整
 */
export function validateServerConfig(): boolean {
  const { valid, missing } = checkRequiredEnvVars()

  if (!valid) {
    console.error("缺少必需的环境变量:", missing.join(", "))
    return false
  }

  return true
}
