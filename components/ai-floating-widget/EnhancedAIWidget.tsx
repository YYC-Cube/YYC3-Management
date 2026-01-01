/**
 * @fileoverview 增强版AI浮窗组件
 * @description 集成AutonomousAIEngine、ModelAdapter、UnifiedLearningSystem的智能AI交互界面
 * @author YYC³
 * @version 2.0.0
 * @created 2025-12-28
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { IntelligentAIWidget } from './IntelligentAIWidget';
import { AutonomousAIEngine, EngineConfig, AgentMessage, MessageType } from '@/lib/autonomous-engine';
import { UnifiedLearningSystem, UserBehavior } from '@/lib/learning-system';
import { ModelProvider } from '@/lib/model-adapter/types';
import { ModelAdapterFactory, IModelAdapter } from '@/lib/model-adapter';
import { AgenticCore } from '@/lib/agentic-core';

// ====================================
// 类型定义
// ====================================

interface EnhancedAIWidgetProps {
  agenticCore: AgenticCore;
  onClose?: () => void;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  userId?: string;
}

interface SystemStatus {
  engineStatus: string;
  activeModels: string[];
  learningMetrics: {
    behavioralSamples: number;
    strategicSamples: number;
    knowledgeEntries: number;
    overallAccuracy: number;
  };
}

// ====================================
// 组件实现
// ====================================

export const EnhancedAIWidget: React.FC<EnhancedAIWidgetProps> = ({ 
  agenticCore, 
  onClose,
  initialPosition,
  initialSize,
  userId = 'default-user'
}) => {
  // 核心系统状态
  const [engine, setEngine] = useState<AutonomousAIEngine | null>(null);
  const [learningSystem, setLearningSystem] = useState<UnifiedLearningSystem | null>(null);
  const [modelAdapters, setModelAdapters] = useState<Map<string, IModelAdapter>>(new Map());
  const [systemReady, setSystemReady] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    engineStatus: 'initializing',
    activeModels: [],
    learningMetrics: {
      behavioralSamples: 0,
      strategicSamples: 0,
      knowledgeEntries: 0,
      overallAccuracy: 0
    }
  });

  // ====================================
  // 系统初始化
  // ====================================

  useEffect(() => {
    const initializeSystem = async () => {
      try {
        console.log('[EnhancedAIWidget] 开始初始化增强AI系统...');

        // 1. 初始化自治AI引擎
        const engineConfig: EngineConfig = {
          version: '2.0.0',
          defaultTimeout: 30000,
          maxConcurrentTasks: 5,
          enableDebugMode: process.env.NODE_ENV === 'development',
          persistenceEnabled: true,
          resumeTasksOnRestore: true
        };

        const newEngine = new AutonomousAIEngine(engineConfig);
        
        // 注册消息处理器
        newEngine.registerMessageHandler(MessageType.USER_INPUT, async (message, context) => {
          console.log('[EnhancedAIWidget] 处理用户输入:', message);
          
          // 这里集成模型适配器来处理实际的AI推理
          // 简化实现：返回模拟响应
          return {
            id: `response-${Date.now()}`,
            success: true,
            data: {
              text: `收到您的消息：${message.content}`,
              modelUsed: 'enhanced-model'
            },
            metadata: {
              processingTime: 100,
              traceId: context.traceId,
              timestamp: new Date()
            }
          };
        });

        await newEngine.start();
        setEngine(newEngine);
        console.log('[EnhancedAIWidget] 自治AI引擎初始化完成');

        // 2. 初始化学习系统
        const newLearningSystem = new UnifiedLearningSystem();
        setLearningSystem(newLearningSystem);
        console.log('[EnhancedAIWidget] 学习系统初始化完成');

        // 3. 初始化模型适配器
        const adapters = new Map<string, IModelAdapter>();
        
        try {
          const localAdapter = await ModelAdapterFactory.createAdapter({
            provider: 'Local',
            modelName: 'qwen-max',
            baseURL: process.env.NEXT_PUBLIC_LOCAL_MODEL_ENDPOINT || 'http://localhost:11434',
            maxInputLength: 8000,
            maxOutputLength: 4000,
            timeout: 30000,
            cacheEnabled: false
          });
          
          adapters.set('local', localAdapter);
          console.log('[EnhancedAIWidget] 本地模型适配器初始化完成');
        } catch (error) {
          console.warn('[EnhancedAIWidget] 本地模型适配器初始化失败，将在运行时降级:', error);
        }

        setModelAdapters(adapters);

        // 4. 更新系统状态
        updateSystemStatus(newEngine, newLearningSystem, adapters);

        setSystemReady(true);
        console.log('[EnhancedAIWidget] 增强AI系统初始化完成');

      } catch (error) {
        console.error('[EnhancedAIWidget] 系统初始化失败:', error);
        setSystemStatus(prev => ({
          ...prev,
          engineStatus: 'error'
        }));
      }
    };

    initializeSystem();

    // 清理函数
    return () => {
      if (engine) {
        console.log('[EnhancedAIWidget] 关闭自治AI引擎...');
        engine.shutdown().catch(console.error);
      }
    };
  }, []);

  // ====================================
  // 系统状态更新
  // ====================================

  const updateSystemStatus = useCallback(
    (
      currentEngine: AutonomousAIEngine,
      currentLearningSystem: UnifiedLearningSystem,
      currentAdapters: Map<string, IModelAdapter>
    ) => {
      const metrics = currentLearningSystem.getOverallMetrics();
      
      setSystemStatus({
        engineStatus: currentEngine.getStatus(),
        activeModels: Array.from(currentAdapters.keys()),
        learningMetrics: {
          behavioralSamples: metrics.behavioral.totalSamples,
          strategicSamples: metrics.strategic.totalSamples,
          knowledgeEntries: metrics.knowledge.totalSamples,
          overallAccuracy: metrics.overall
        }
      });
    },
    []
  );

  // 定期更新系统状态
  useEffect(() => {
    if (!systemReady || !engine || !learningSystem) return;

    const interval = setInterval(() => {
      updateSystemStatus(engine, learningSystem, modelAdapters);
    }, 5000); // 每5秒更新一次

    return () => clearInterval(interval);
  }, [systemReady, engine, learningSystem, modelAdapters, updateSystemStatus]);

  // ====================================
  // 行为记录
  // ====================================

  const recordUserBehavior = useCallback(
    (action: string, context: Record<string, any> = {}) => {
      if (!learningSystem) return;

      const behavior: UserBehavior = {
        id: `behavior-${Date.now()}`,
        userId,
        action,
        context,
        timestamp: new Date(),
        sessionId: `session-${Date.now()}`
      };

      learningSystem.getBehavioralLayer().recordBehavior(behavior);
      console.log('[EnhancedAIWidget] 记录用户行为:', action);
    },
    [learningSystem, userId]
  );

  // ====================================
  // 增强的消息处理
  // ====================================

  const handleEnhancedMessage = useCallback(
    async (content: string) => {
      if (!engine) {
        console.warn('[EnhancedAIWidget] 引擎未就绪');
        return null;
      }

      // 记录用户行为
      recordUserBehavior('send_message', { content });

      // 通过引擎处理消息
      const message: AgentMessage = {
        type: MessageType.USER_INPUT,
        content,
        source: 'chat-widget',
        timestamp: new Date()
      };

      try {
        const response = await engine.processMessage(message);
        
        // 记录成功的决策
        if (learningSystem && response.success) {
          learningSystem.getStrategicLayer().recordOutcome({
            id: `outcome-${Date.now()}`,
            decision: 'process_user_message',
            parameters: { messageType: MessageType.USER_INPUT },
            context: { content },
            result: 'success',
            metrics: {
              executionTime: response.metadata.processingTime,
              resourceUsage: 0.1,
              userSatisfaction: 0.8
            },
            timestamp: new Date()
          });
        }

        return response;
      } catch (error) {
        console.error('[EnhancedAIWidget] 消息处理失败:', error);
        
        // 记录失败的决策
        if (learningSystem) {
          learningSystem.getStrategicLayer().recordOutcome({
            id: `outcome-${Date.now()}`,
            decision: 'process_user_message',
            parameters: { messageType: MessageType.USER_INPUT },
            context: { content },
            result: 'failure',
            metrics: {
              executionTime: 0,
              resourceUsage: 0,
              userSatisfaction: 0
            },
            timestamp: new Date()
          });
        }

        return null;
      }
    },
    [engine, learningSystem, recordUserBehavior]
  );

  // ====================================
  // 渲染
  // ====================================

  if (!systemReady) {
    return (
      <div 
        className="fixed z-50 bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6"
        style={{
          left: initialPosition?.x || window.innerWidth - 420,
          top: initialPosition?.y || 100,
          width: initialSize?.width || 400,
          height: initialSize?.height || 600
        }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              初始化AI系统
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              正在加载自治AI引擎、学习系统和模型适配器...
            </p>
            <div className="mt-4 text-xs text-gray-400">
              <div>引擎状态: {systemStatus.engineStatus}</div>
              <div>活跃模型: {systemStatus.activeModels.join(', ') || '无'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 系统就绪，渲染完整的AI Widget
  return (
    <>
      <IntelligentAIWidget 
        agenticCore={agenticCore}
        initialPosition={initialPosition}
        initialSize={initialSize}
        onClose={() => {
          // 记录关闭行为
          recordUserBehavior('close_widget');
          onClose?.();
        }}
      />
      
      {/* 系统状态指示器（调试模式） */}
      {process.env.NODE_ENV === 'development' && (
        <div 
          className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-3 rounded-lg z-[60] max-w-xs"
        >
          <div className="font-bold mb-2">增强AI系统状态</div>
          <div className="space-y-1">
            <div>引擎: {systemStatus.engineStatus}</div>
            <div>模型: {systemStatus.activeModels.join(', ') || '无'}</div>
            <div>行为样本: {systemStatus.learningMetrics.behavioralSamples}</div>
            <div>策略样本: {systemStatus.learningMetrics.strategicSamples}</div>
            <div>知识条目: {systemStatus.learningMetrics.knowledgeEntries}</div>
            <div>学习精度: {(systemStatus.learningMetrics.overallAccuracy * 100).toFixed(1)}%</div>
          </div>
        </div>
      )}
    </>
  );
};
