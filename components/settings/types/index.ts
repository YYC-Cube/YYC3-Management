/**
 * System Settings Types
 * 统一的设置配置类型定义
 */

export interface SystemConfig {
  basic: BasicConfig;
  database: DatabaseConfig;
  cache: CacheConfig;
  security: SecurityConfig;
  notification: NotificationConfig;
  appearance: AppearanceConfig;
}

export interface BasicConfig {
  siteName: string;
  siteUrl: string;
  adminEmail: string;
  timezone: string;
  language: string;
  dateFormat: string;
  currency: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  username: string;
  password: string;
  maxConnections: number;
  timeout: number;
  ssl: boolean;
  backup: boolean;
  backupInterval: number;
}

export interface CacheConfig {
  enabled: boolean;
  type: 'redis' | 'memory' | 'file';
  host: string;
  port: number;
  ttl: number;
  maxSize: number;
  compression: boolean;
}

export interface SecurityConfig {
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  passwordComplexity: boolean;
  twoFactorAuth: boolean;
  ipWhitelist: string[];
}

export interface NotificationConfig {
  emailEnabled: boolean;
  emailHost: string;
  emailPort: number;
  emailUsername: string;
  emailPassword: string;
  smsEnabled: boolean;
  smsProvider: string;
  smsApiKey: string;
  pushEnabled: boolean;
  pushEnabledDesktop: boolean;
  pushFrequency: 'low' | 'medium' | 'high';
}

export interface AppearanceConfig {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  layout: 'default' | 'compact' | 'spacious';
  sidebarCollapsed: boolean;
}

export interface SystemSettingsProps {
  showTitle?: boolean;
}

export type ConfigSection = keyof SystemConfig;

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  latency?: number;
}
