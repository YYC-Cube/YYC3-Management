export interface SystemConfig {
  basic: {
    siteName: string
    siteUrl: string
    adminEmail: string
    timezone: string
    language: string
    dateFormat: string
    currency: string
    companyName: string
    companyAddress: string
    companyPhone: string
  }
  database: {
    host: string
    port: number
    name: string
    username: string
    password: string
    maxConnections: number
    timeout: number
    ssl: boolean
    backup: boolean
    backupInterval: number
  }
  cache: {
    enabled: boolean
    type: "redis" | "memory" | "file"
    host: string
    port: number
    ttl: number
    maxSize: number
    compression: boolean
  }
  security: {
    sessionTimeout: number
    maxLoginAttempts: number
    passwordMinLength: number
    passwordComplexity: boolean
    twoFactorAuth: boolean
    ipWhitelist: string[]
    sslForced: boolean
    corsEnabled: boolean
    allowedOrigins: string[]
  }
  notification: {
    emailEnabled: boolean
    smsEnabled: boolean
    pushEnabled: boolean
    emailProvider: string
    emailHost: string
    emailPort: number
    emailUsername: string
    emailPassword: string
    smsProvider: string
    smsApiKey: string
    pushProvider: string
    pushApiKey: string
  }
  appearance: {
    theme: "light" | "dark" | "auto"
    primaryColor: string
    logoUrl: string
    faviconUrl: string
    customCss: string
    showBranding: boolean
    compactMode: boolean
    animationsEnabled: boolean
  }
}

export interface SystemStatus {
  cpu: number
  memory: number
  disk: number
  network: number
  uptime: string
  version: string
  lastUpdate: string
  activeUsers: number
  totalRequests: number
  errorRate: number
}

export interface SystemSettingsProps {
  showTitle?: boolean
}

export const defaultSystemConfig: SystemConfig = {
  basic: {
    siteName: "YYC³ 企业管理系统",
    siteUrl: "",
    adminEmail: "admin@company.com",
    timezone: "Asia/Shanghai",
    language: "zh-CN",
    dateFormat: "YYYY-MM-DD",
    currency: "CNY",
    companyName: "",
    companyAddress: "",
    companyPhone: "",
  },
  database: {
    host: "localhost",
    port: 5432,
    name: "yyc3_mana",
    username: "postgres",
    password: "",
    maxConnections: 20,
    timeout: 30000,
    ssl: false,
    backup: true,
    backupInterval: 24,
  },
  cache: {
    enabled: true,
    type: "redis",
    host: "localhost",
    port: 6379,
    ttl: 300,
    maxSize: 1000,
    compression: false,
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    passwordComplexity: true,
    twoFactorAuth: false,
    ipWhitelist: [],
    sslForced: true,
    corsEnabled: true,
    allowedOrigins: [],
  },
  notification: {
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    emailProvider: "smtp",
    emailHost: "",
    emailPort: 587,
    emailUsername: "",
    emailPassword: "",
    smsProvider: "",
    smsApiKey: "",
    pushProvider: "",
    pushApiKey: "",
  },
  appearance: {
    theme: "light",
    primaryColor: "#3b82f6",
    logoUrl: "/yyc3-icons/pwa/icon-512x512.png",
    faviconUrl: "/yyc3-icons/favicon/favicon.ico",
    customCss: "",
    showBranding: true,
    compactMode: false,
    animationsEnabled: true,
  },
}

export const defaultSystemStatus: SystemStatus = {
  cpu: 0,
  memory: 0,
  disk: 0,
  network: 0,
  uptime: "0天",
  version: "v2.0.0",
  lastUpdate: new Date().toISOString(),
  activeUsers: 0,
  totalRequests: 0,
  errorRate: 0,
}
