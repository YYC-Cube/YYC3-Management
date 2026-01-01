/**
 * @fileoverview AI组件系统React Hook
 * @description 为React组件提供AI组件系统的便捷访问
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-28
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { AIComponentsIntegration, ComponentEventBus } from '@/lib/ai-components';
import type { AIComponentsConfig } from '@/lib/ai-components/AIComponentsIntegration';

/**
 * AI组件系统Hook
 * 
 * @description
 * 提供AI组件系统的React集成，包括：
 * - 自动初始化和清理
 * - 组件访问器
 * - 状态管理
 * - 事件订阅
 * 
 * @example
 * ```typescript
 * const MyComponent = () => {
 *   const { 
 *     aiComponents, 
 *     initialized, 
 *     started,
 *     chatInterface,
 *     toolboxPanel 
 *   } = useAIComponents({
 *     enabledComponents: {
 *       chatInterface: true,
 *       toolboxPanel: true
 *     },
 *     autoStart: true
 *   });
 * 
 *   if (!initialized) return <div>初始化中...</div>;
 * 
 *   return (
 *     <div>
 *       <button onClick={() => chatInterface?.sendMessage(...)}>
 *         发送消息
 *       </button>
 *     </div>
 *   );
 * };
 * ```
 */
export function useAIComponents(config: AIComponentsConfig = {}) {
  const [initialized, setInitialized] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const aiComponentsRef = useRef<AIComponentsIntegration | null>(null);
  const eventBusRef = useRef<ComponentEventBus>(ComponentEventBus.getInstance());

  // 初始化AI组件系统
  useEffect(() => {
    let mounted = true;
    let systemSub: any = null;

    const initializeSystem = async () => {
      try {
        console.log('[useAIComponents] 开始初始化AI组件系统...');
        
        // 创建集成服务实例
        const aiComponents = new AIComponentsIntegration({
          ...config,
          autoStart: config.autoStart ?? true
        });

        aiComponentsRef.current = aiComponents;

        // 订阅系统事件
        const eventBus = eventBusRef.current;
        
        systemSub = eventBus.subscribe('system', (event) => {
          if (!mounted) return;

          switch (event.type) {
            case 'system_initialized':
              console.log('[useAIComponents] 系统已初始化');
              setInitialized(true);
              break;
            case 'system_started':
              console.log('[useAIComponents] 系统已启动');
              setStarted(true);
              break;
            case 'system_stopped':
              console.log('[useAIComponents] 系统已停止');
              setStarted(false);
              break;
            case 'system_error':
              console.error('[useAIComponents] 系统错误:', event.data);
              setError(new Error(event.data?.message || '系统错误'));
              break;
          }
        });

        // 初始化系统
        await aiComponents.initialize();

        // 如果没有自动启动，手动触发初始化完成
        if (!config.autoStart) {
          setInitialized(true);
        }

      } catch (err) {
        console.error('[useAIComponents] 初始化失败:', err);
        if (mounted) {
          setError(err as Error);
        }
      }
    };

    initializeSystem();

    // 清理函数
    return () => {
      mounted = false;
      
      if (systemSub) {
        systemSub.unsubscribe();
      }
      
      if (aiComponentsRef.current) {
        aiComponentsRef.current.cleanup().catch(console.error);
        aiComponentsRef.current = null;
      }
    };
  }, []); // 只在挂载时执行一次

  // 手动启动系统
  const start = useCallback(async () => {
    if (!aiComponentsRef.current || !initialized || started) {
      return;
    }

    try {
      await aiComponentsRef.current.start();
    } catch (err) {
      console.error('[useAIComponents] 启动失败:', err);
      setError(err as Error);
    }
  }, [initialized, started]);

  // 手动停止系统
  const stop = useCallback(async () => {
    if (!aiComponentsRef.current || !started) {
      return;
    }

    try {
      await aiComponentsRef.current.stop();
    } catch (err) {
      console.error('[useAIComponents] 停止失败:', err);
      setError(err as Error);
    }
  }, [started]);

  // 健康检查
  const healthCheck = useCallback(async () => {
    if (!aiComponentsRef.current) {
      return null;
    }

    return await aiComponentsRef.current.healthCheck();
  }, []);

  // 获取系统状态
  const getStatus = useCallback(() => {
    if (!aiComponentsRef.current) {
      return null;
    }

    return aiComponentsRef.current.getSystemStatus();
  }, []);

  // 获取组件访问器（响应式更新）
  const components = useMemo(() => {
    if (!aiComponentsRef.current) {
      return {
        chatInterface: null,
        toolboxPanel: null,
        insightsDashboard: null,
        workflowDesigner: null,
        knowledgeBase: null,
        aiActionsManager: null,
        streamProcessor: null,
        contextManager: null
      };
    }

    return {
      chatInterface: aiComponentsRef.current.getChatInterface(),
      toolboxPanel: aiComponentsRef.current.getToolboxPanel(),
      insightsDashboard: aiComponentsRef.current.getInsightsDashboard(),
      workflowDesigner: aiComponentsRef.current.getWorkflowDesigner(),
      knowledgeBase: aiComponentsRef.current.getKnowledgeBase(),
      aiActionsManager: aiComponentsRef.current.getAIActionsManager(),
      streamProcessor: aiComponentsRef.current.getStreamProcessor(),
      contextManager: aiComponentsRef.current.getContextManager()
    };
  }, [initialized]);

  return {
    // 系统状态
    initialized,
    started,
    error,

    // 主要服务
    aiComponents: aiComponentsRef.current,
    eventBus: eventBusRef.current,

    // 8大核心组件
    ...components,

    // 控制方法
    start,
    stop,
    healthCheck,
    getStatus
  };
}

/**
 * 订阅组件事件Hook
 * 
 * @example
 * ```typescript
 * useAIComponentEvent('chat', 'message_sent', (event) => {
 *   console.log('消息已发送:', event.data);
 * });
 * ```
 */
export function useAIComponentEvent(
  channel: string,
  eventType: string,
  handler: (event: any) => void,
  deps: any[] = []
) {
  const eventBus = ComponentEventBus.getInstance();

  useEffect(() => {
    const subscription = eventBus.subscribe(channel, (event) => {
      if (event.type === eventType) {
        handler(event);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [channel, eventType, ...deps]);
}

/**
 * 发布组件事件Hook
 * 
 * @example
 * ```typescript
 * const publishEvent = useAIComponentPublish('chat');
 * 
 * publishEvent('message_sent', { message: 'Hello' });
 * ```
 */
export function useAIComponentPublish(channel: string) {
  const eventBus = ComponentEventBus.getInstance();

  return useCallback((type: string, data: any, metadata?: Record<string, any>) => {
    eventBus.publish(channel, {
      type,
      source: channel,
      data,
      metadata
    });
  }, [channel]);
}

export default useAIComponents;
