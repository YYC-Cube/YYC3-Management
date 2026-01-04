/**
 * useSystemConfig Hook
 * 管理系统配置状态
 */

import { useState, useCallback } from 'react';
import type { SystemConfig, ConfigSection } from '../types';

const defaultConfig: SystemConfig = {
  basic: {
    siteName: 'YYC³ 管理系统',
    siteUrl: 'https://yyc3.example.com',
    adminEmail: 'admin@example.com',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN',
    dateFormat: 'YYYY-MM-DD',
    currency: 'CNY',
    companyName: 'YYC³科技有限公司',
    companyAddress: '北京市朝阳区',
    companyPhone: '+86-400-123-4567',
  },
  database: {
    host: 'localhost',
    port: 5432,
    name: 'yyc3_mana',
    username: 'postgres',
    password: '',
    maxConnections: 100,
    timeout: 30,
    ssl: false,
    backup: true,
    backupInterval: 24,
  },
  cache: {
    enabled: true,
    type: 'redis',
    host: 'localhost',
    port: 6379,
    ttl: 3600,
    maxSize: 1024,
    compression: true,
  },
  security: {
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    passwordComplexity: true,
    twoFactorAuth: false,
    ipWhitelist: [],
  },
  notification: {
    emailEnabled: true,
    emailHost: 'smtp.example.com',
    emailPort: 587,
    emailUsername: 'notifications@example.com',
    emailPassword: '',
    smsEnabled: false,
    smsProvider: '',
    smsApiKey: '',
    pushEnabled: true,
    pushEnabledDesktop: false,
    pushFrequency: 'medium',
  },
  appearance: {
    theme: 'light',
    primaryColor: '#3b82f6',
    fontSize: 'medium',
    layout: 'default',
    sidebarCollapsed: false,
  },
};

export function useSystemConfig() {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateConfig = useCallback((
    section: ConfigSection,
    field: string,
    value: any
  ) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }, []);

  const saveConfig = useCallback(async () => {
    setIsSaving(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 保存到 localStorage
      localStorage.setItem('systemConfig', JSON.stringify(config));
      
      return { success: true };
    } catch (error) {
      console.error('保存配置失败:', error);
      return { success: false, error: '保存失败' };
    } finally {
      setIsSaving(false);
    }
  }, [config]);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
  }, []);

  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const saved = localStorage.getItem('systemConfig');
      if (saved) {
        setConfig(JSON.parse(saved));
      }
    } catch (error) {
      console.error('加载配置失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    config,
    updateConfig,
    saveConfig,
    resetConfig,
    loadConfig,
    isLoading,
    isSaving,
  };
}
