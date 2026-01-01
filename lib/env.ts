/**
 * @fileoverview env.ts
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// 环境变量类型定义和验证
interface EnvironmentVariables {
  // Next.js 内置变量
  NODE_ENV: "development" | "production" | "test"
  NEXT_PUBLIC_VERCEL_URL?: string

  // 应用配置
  NEXT_PUBLIC_APP_NAME: string
  NEXT_PUBLIC_APP_VERSION: string
  NEXT_PUBLIC_API_BASE_URL: string

  // 认证配置
  JWT_SECRET: string
  NEXTAUTH_SECRET: string
  NEXTAUTH_URL: string

  // AI模型配置 - 百度
  BAIDU_API_KEY?: string
  BAIDU_SECRET_KEY?: string

  // AI模型配置 - 阿里云
  ALIBABA_API_KEY?: string
  ALIBABA_ACCESS_KEY_ID?: string
  ALIBABA_ACCESS_KEY_SECRET?: string

  // AI模型配置 - 智谱AI
  ZHIPU_API_KEY?: string

  // AI模型配置 - OpenAI
  OPENAI_API_KEY?: string
  OPENAI_BASE_URL?: string

  // AI模型配置 - 本地模型
  OLLAMA_BASE_URL?: string
  LM_STUDIO_BASE_URL?: string

  // 数据库配置
  DATABASE_URL?: string
  REDIS_URL?: string

  // 第三方服务
  SMTP_HOST?: string
  SMTP_PORT?: string
  SMTP_USER?: string
  SMTP_PASS?: string

  // 文件存储
  AWS_ACCESS_KEY_ID?: string
  AWS_SECRET_ACCESS_KEY?: string
  AWS_REGION?: string
  AWS_S3_BUCKET?: string

  // 监控和分析
  SENTRY_DSN?: string
  GOOGLE_ANALYTICS_ID?: string
  MIXPANEL_TOKEN?: string

  // 功能开关
  ENABLE_AI_FEATURES?: string
  ENABLE_ANALYTICS?: string
  ENABLE_NOTIFICATIONS?: string
  ENABLE_FILE_UPLOAD?: string
}

// 环境变量验证函数
function validateEnv(): EnvironmentVariables {
  const env = process.env as any

  // 必需的环境变量
  const required = ["NEXT_PUBLIC_APP_NAME", "NEXT_PUBLIC_API_BASE_URL", "JWT_SECRET", "NEXTAUTH_SECRET"]

  // 检查必需变量
  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
  }

  return env
}

// 获取环境变量
export const env = validateEnv()

// 环境检查函数
export const isDevelopment = () => env.NODE_ENV === "development"
export const isProduction = () => env.NODE_ENV === "production"
export const isTest = () => env.NODE_ENV === "test"

// AI功能检查
export const isAIEnabled = () => {
  return (
    env.ENABLE_AI_FEATURES !== "false" &&
    (!!env.BAIDU_API_KEY ||
      !!env.ALIBABA_API_KEY ||
      !!env.ZHIPU_API_KEY ||
      !!env.OPENAI_API_KEY ||
      !!env.OLLAMA_BASE_URL ||
      !!env.LM_STUDIO_BASE_URL)
  )
}

// 数据库检查
export const isDatabaseEnabled = () => !!env.DATABASE_URL

// 文件上传检查
export const isFileUploadEnabled = () => {
  return (
    env.ENABLE_FILE_UPLOAD !== "false" && (!!env.AWS_ACCESS_KEY_ID || isDevelopment()) // 开发环境允许本地文件上传
  )
}

// 邮件服务检查
export const isEmailEnabled = () => {
  return !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS)
}

// 获取API基础URL
export const getApiBaseUrl = () => {
  if (isDevelopment()) {
    return env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"
  }
  return env.NEXT_PUBLIC_API_BASE_URL
}

// 获取应用URL
export const getAppUrl = () => {
  if (env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${env.NEXT_PUBLIC_VERCEL_URL}`
  }
  if (isDevelopment()) {
    return "http://localhost:3000"
  }
  return env.NEXTAUTH_URL
}

// AI模型配置
export const getAIConfig = () => {
  return {
    baidu: {
      apiKey: env.BAIDU_API_KEY,
      secretKey: env.BAIDU_SECRET_KEY,
      enabled: !!(env.BAIDU_API_KEY && env.BAIDU_SECRET_KEY),
    },
    alibaba: {
      apiKey: env.ALIBABA_API_KEY,
      accessKeyId: env.ALIBABA_ACCESS_KEY_ID,
      accessKeySecret: env.ALIBABA_ACCESS_KEY_SECRET,
      enabled: !!env.ALIBABA_API_KEY,
    },
    zhipu: {
      apiKey: env.ZHIPU_API_KEY,
      enabled: !!env.ZHIPU_API_KEY,
    },
    openai: {
      apiKey: env.OPENAI_API_KEY,
      baseUrl: env.OPENAI_BASE_URL,
      enabled: !!env.OPENAI_API_KEY,
    },
    ollama: {
      baseUrl: env.OLLAMA_BASE_URL || "http://localhost:11434",
      enabled: !!env.OLLAMA_BASE_URL || isDevelopment(),
    },
    lmStudio: {
      baseUrl: env.LM_STUDIO_BASE_URL || "http://localhost:1234",
      enabled: !!env.LM_STUDIO_BASE_URL || isDevelopment(),
    },
  }
}

// 数据库配置
export const getDatabaseConfig = () => {
  return {
    url: env.DATABASE_URL,
    enabled: isDatabaseEnabled(),
  }
}

// 文件存储配置
export const getStorageConfig = () => {
  return {
    aws: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      region: env.AWS_REGION || "us-east-1",
      bucket: env.AWS_S3_BUCKET,
      enabled: !!(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY),
    },
    local: {
      enabled: isDevelopment(),
      uploadPath: "/uploads",
    },
  }
}

// 邮件配置
export const getEmailConfig = () => {
  return {
    host: env.SMTP_HOST,
    port: Number.parseInt(env.SMTP_PORT || "587"),
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    enabled: isEmailEnabled(),
  }
}

// 监控配置
export const getMonitoringConfig = () => {
  return {
    sentry: {
      dsn: env.SENTRY_DSN,
      enabled: !!env.SENTRY_DSN && isProduction(),
    },
    analytics: {
      googleAnalyticsId: env.GOOGLE_ANALYTICS_ID,
      mixpanelToken: env.MIXPANEL_TOKEN,
      enabled: env.ENABLE_ANALYTICS !== "false" && isProduction(),
    },
  }
}

// 功能开关配置
export const getFeatureFlags = () => {
  return {
    ai: isAIEnabled(),
    analytics: env.ENABLE_ANALYTICS !== "false",
    notifications: env.ENABLE_NOTIFICATIONS !== "false",
    fileUpload: isFileUploadEnabled(),
    email: isEmailEnabled(),
    database: isDatabaseEnabled(),
  }
}

// 导出所有配置
export const config = {
  env,
  api: {
    baseUrl: getApiBaseUrl(),
  },
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    version: env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    url: getAppUrl(),
  },
  ai: getAIConfig(),
  database: getDatabaseConfig(),
  storage: getStorageConfig(),
  email: getEmailConfig(),
  monitoring: getMonitoringConfig(),
  features: getFeatureFlags(),
}

export default config
