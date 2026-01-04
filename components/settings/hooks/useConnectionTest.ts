/**
 * useConnectionTest Hook
 * 连接测试功能
 */

import { useState, useCallback } from 'react';
import type { ConnectionTestResult } from '../types';

export function useConnectionTest() {
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, ConnectionTestResult>>({});

  const testConnection = useCallback(async (
    type: string,
    config: any
  ): Promise<ConnectionTestResult> => {
    setTesting(prev => ({ ...prev, [type]: true }));
    
    try {
      const startTime = Date.now();
      
      // 模拟连接测试
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const latency = Date.now() - startTime;
      const success = Math.random() > 0.2;
      
      const result: ConnectionTestResult = {
        success,
        message: success ? '连接成功' : '连接失败，请检查配置',
        latency,
      };
      
      setResults(prev => ({ ...prev, [type]: result }));
      return result;
    } catch (error) {
      const result: ConnectionTestResult = {
        success: false,
        message: '连接测试出错',
      };
      
      setResults(prev => ({ ...prev, [type]: result }));
      return result;
    } finally {
      setTesting(prev => ({ ...prev, [type]: false }));
    }
  }, []);

  return {
    testing,
    results,
    testConnection,
  };
}
