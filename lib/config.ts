/**
 * @fileoverview config.ts
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// 应用配置
export const config = {
  // 应用基本信息
  app: {
    name: "锦澜家居企业管理系统",
    nameChinese: "锦澜家居企业管理系统",
    company: "Jin Lan Home Furnishing",
    companyChinese: "锦澜家居",
    version: "1.0.0",
    description: "Professional enterprise management system for Jin Lan Home Furnishing",
    descriptionChinese: "锦澜家居专业的企业管理系统",
    url: "https://manage.jinlan.com",
    logo: "/yyc3-logo-blue.png",
    favicon: "/favicon.ico",
  },

  // API配置
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.jinlan.com",
    timeout: 10000,
    retries: 3,
    version: "v1",
  },

  // 认证配置
  auth: {
    tokenKey: "jinlan_auth_token",
    userKey: "jinlan_user_data",
    refreshTokenKey: "jinlan_refresh_token",
    sessionTimeout: 24 * 60 * 60 * 1000, // 24小时
    rememberMeTimeout: 30 * 24 * 60 * 60 * 1000, // 30天
  },

  // 主题配置
  theme: {
    defaultTheme: "light",
    enableSystemTheme: true,
    colors: {
      primary: "#0ea5e9", // 锦澜家居主色调
      secondary: "#64748b",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#06b6d4",
    },
  },

  // 功能开关
  features: {
    enableDarkMode: true,
    enableNotifications: true,
    enableSearch: true,
    enableChat: true,
    enableAnalytics: true,
    enableOfflineMode: true,
    enablePWA: true,
    enableMultiLanguage: false,
  },

  // 分页配置
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    maxPageSize: 100,
  },

  // 文件上传配置
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "application/pdf", "text/csv"],
    uploadPath: "/uploads",
  },

  // 缓存配置
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5分钟
    userDataTTL: 30 * 60 * 1000, // 30分钟
    staticDataTTL: 60 * 60 * 1000, // 1小时
  },

  // 通知配置
  notifications: {
    position: "top-right",
    duration: 5000,
    maxNotifications: 5,
    enableSound: false,
  },

  // 搜索配置
  search: {
    minQueryLength: 2,
    maxResults: 50,
    debounceDelay: 300,
    enableHighlight: true,
  },

  // 表格配置
  table: {
    defaultPageSize: 20,
    enableSorting: true,
    enableFiltering: true,
    enableExport: true,
    enableColumnResize: true,
  },

  // 图表配置
  charts: {
    defaultTheme: "light",
    enableAnimation: true,
    animationDuration: 1000,
    colors: ["#0ea5e9", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#f97316", "#84cc16"],
  },

  // 地图配置（客户端配置）
  map: {
    provider: "amap", // 高德地图
    defaultCenter: [116.397428, 39.90923], // 北京
    defaultZoom: 10,
  },

  services: {
    // 百度统计
    baiduAnalytics: {
      enabled: !!process.env.NEXT_PUBLIC_BAIDU_ANALYTICS_ID,
    },

    // 七鱼客服 - 实际配置在服务端
    qiyu: {
      enabled: true, // 功能开关
    },

    // Sentry错误监控
    sentry: {
      enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    },
  },

  // 开发配置
  development: {
    enableMockData: process.env.NEXT_PUBLIC_ENABLE_MOCK === "true",
    enableDebugMode: process.env.NODE_ENV === "development",
    enableConsoleLog: process.env.NODE_ENV === "development",
  },

  // 生产配置
  production: {
    enableCompression: true,
    enableCaching: true,
    enableMinification: true,
    enableSourceMap: false,
  },

  // 安全配置
  security: {
    enableCSP: true,
    enableHSTS: true,
    enableXSSProtection: true,
    enableFrameGuard: true,
    enableContentTypeNoSniff: true,
  },

  // 性能配置
  performance: {
    enableLazyLoading: true,
    enableImageOptimization: true,
    enableCodeSplitting: true,
    enablePrefetching: true,
  },

  // 可访问性配置
  accessibility: {
    enableScreenReader: true,
    enableKeyboardNavigation: true,
    enableHighContrast: false,
    enableFocusIndicator: true,
  },

  // 国际化配置
  i18n: {
    defaultLocale: "zh-CN",
    locales: ["zh-CN", "en-US"],
    enableRTL: false,
  },

  // 联系信息
  contact: {
    email: "service@jinlan.com",
    phone: "400-888-8888",
    address: "北京市朝阳区xxx街道xxx号",
    website: "https://www.jinlan.com",
    socialMedia: {
      wechat: "jinlan_official",
      weibo: "@锦澜家居官方",
      douyin: "@锦澜家居",
    },
  },

  // 法律信息
  legal: {
    privacyPolicy: "/privacy-policy",
    termsOfService: "/terms-of-service",
    cookiePolicy: "/cookie-policy",
    copyright: "© 2025 锦澜家居. 保留所有权利.",
  },
}

// 导出类型
export type Config = typeof config

// 获取配置的辅助函数
export function getConfig<T extends keyof Config>(key: T): Config[T] {
  return config[key]
}

// 检查功能是否启用
export function isFeatureEnabled(feature: keyof Config["features"]): boolean {
  return config.features[feature]
}

// 获取API URL
export function getApiUrl(endpoint: string): string {
  return `${config.api.baseUrl}/${config.api.version}${endpoint}`
}

// 获取上传URL
export function getUploadUrl(filename: string): string {
  return `${config.upload.uploadPath}/${filename}`
}
