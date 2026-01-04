/**
 * useConfigPersistence Hook
 * 配置持久化管理
 */

import { useCallback } from 'react';
import type { SystemConfig } from '../types';

export function useConfigPersistence() {
  const loadConfig = useCallback(async (): Promise<SystemConfig | null> => {
    try {
      const saved = localStorage.getItem('systemConfig');
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch (error) {
      console.error('加载配置失败:', error);
      return null;
    }
  }, []);

  const saveConfig = useCallback(async (config: SystemConfig): Promise<void> => {
    try {
      localStorage.setItem('systemConfig', JSON.stringify(config));
    } catch (error) {
      console.error('保存配置失败:', error);
      throw new Error('保存配置失败');
    }
  }, []);

  const exportConfig = useCallback(() => {
    try {
      const config = localStorage.getItem('systemConfig');
      if (config) {
        const blob = new Blob([config], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'system-config.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('导出配置失败:', error);
    }
  }, []);

  const importConfig = useCallback(async (file: File): Promise<SystemConfig> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          resolve(config);
        } catch (error) {
          reject(new Error('配置文件格式错误'));
        }
      };
      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsText(file);
    });
  }, []);

  return {
    loadConfig,
    saveConfig,
    exportConfig,
    importConfig,
  };
}
