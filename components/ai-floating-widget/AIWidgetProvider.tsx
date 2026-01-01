/**
 * @fileoverview AI浮窗全局提供者
 * @description 在应用全局提供AI智能浮窗功能
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-09
 * @modified 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AgenticCore, type AgentConfig } from '@/lib/agentic-core/index';
import { IntelligentAIWidget } from '@/components/ai-floating-widget/IntelligentAIWidget';

// ====================================
// 上下文类型
// ====================================

interface AIWidgetContextType {
  agenticCore: AgenticCore | null;
  isWidgetVisible: boolean;
  showWidget: () => void;
  hideWidget: () => void;
  toggleWidget: () => void;
}

// ====================================
// 创建上下文
// ====================================

const AIWidgetContext = createContext<AIWidgetContextType | undefined>(undefined);

// ====================================
// Provider组件
// ====================================

export const AIWidgetProvider: React.FC<{
  children: ReactNode;
  config?: Partial<AgentConfig>;
  autoInit?: boolean;
}> = ({ children, config, autoInit = true }) => {
  const [agenticCore, setAgenticCore] = useState<AgenticCore | null>(null);
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);

  // 初始化AgenticCore
  useEffect(() => {
    if (!autoInit) return;

    const defaultConfig: AgentConfig = {
      agentId: config?.agentId || 'global-ai-assistant',
      name: config?.name || 'YYC³ AI助手',
      goalConfig: config?.goalConfig || {
        maxGoalDepth: 5,
        goalTimeout: 30000,
        priorityWeights: { urgency: 0.4, importance: 0.3, complexity: 0.3 }
      },
      planningConfig: config?.planningConfig || {
        maxPlanSteps: 10,
        planningStrategy: 'astar',
        replanningThreshold: 0.7
      },
      toolConfig: config?.toolConfig || {
        enabledTools: ['search', 'calculator', 'weather', 'translator'],
        toolTimeout: 10000,
        maxConcurrentTools: 3
      },
      reflectionConfig: config?.reflectionConfig || {
        enableReflection: true,
        reflectionInterval: 5000,
        learningRate: 0.01
      },
      knowledgeConfig: config?.knowledgeConfig || {
        enableKnowledgeBase: true,
        vectorDbUrl: process.env.NEXT_PUBLIC_VECTOR_DB_URL,
        embeddingModel: 'text-embedding-ada-002'
      },
      contextConfig: config?.contextConfig || {
        maxHistoryLength: 50,
        contextWindow: 4096,
        persistContext: true
      },
      learningConfig: config?.learningConfig || {
        enableLearning: true,
        learningStrategy: 'hybrid',
        feedbackThreshold: 0.8
      }
    };

    const core = new AgenticCore(defaultConfig);
    setAgenticCore(core);

    // 清理
    return () => {
      core.destroy();
    };
  }, [autoInit, config]);

  // 控制方法
  const showWidget = () => setIsWidgetVisible(true);
  const hideWidget = () => setIsWidgetVisible(false);
  const toggleWidget = () => setIsWidgetVisible(prev => !prev);

  // 快捷键支持 (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleWidget();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AIWidgetContext.Provider
      value={{
        agenticCore,
        isWidgetVisible,
        showWidget,
        hideWidget,
        toggleWidget
      }}
    >
      {children}
      {isWidgetVisible && agenticCore && (
        <IntelligentAIWidget 
          agenticCore={agenticCore}
          onClose={hideWidget}
        />
      )}
    </AIWidgetContext.Provider>
  );
};

// ====================================
// Hook
// ====================================

export const useAIWidget = (): AIWidgetContextType => {
  const context = useContext(AIWidgetContext);
  if (!context) {
    throw new Error('useAIWidget must be used within AIWidgetProvider');
  }
  return context;
};

// ====================================
// 工具组件 - 触发按钮
// ====================================

export const AIWidgetTrigger: React.FC<{
  className?: string;
}> = ({ className }) => {
  const { toggleWidget } = useAIWidget();

  return (
    <button
      onClick={toggleWidget}
      className={className}
      aria-label="打开AI助手"
      title="打开AI助手 (Ctrl/Cmd + K)"
    >
      AI助手
    </button>
  );
};

export default AIWidgetProvider;
