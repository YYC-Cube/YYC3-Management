/**
 * @fileoverview 增强版AI浮窗演示页面
 * @description 展示集成了AutonomousAIEngine、ModelAdapter、UnifiedLearningSystem的智能AI浮窗
 * @author YYC³
 * @version 2.0.0
 * @created 2025-12-28
 */

'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedAIWidget } from '@/components/ai-floating-widget';
import { AgenticCore, type AgentConfig } from '@/lib/agentic-core/AgenticCore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Cpu, Brain, Lightbulb, Activity } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { FloatingNavButtons } from '@/components/ui/floating-nav-buttons';

export default function EnhancedAIFloatingDemo() {
  const [agenticCore, setAgenticCore] = useState<AgenticCore | null>(null);
  const [showWidget, setShowWidget] = useState(false);
  const [systemStats, setSystemStats] = useState({
    totalInteractions: 0,
    learningProgress: 0,
    activeSessions: 0,
    modelAccuracy: 0
  });

  // 初始化AgenticCore
  useEffect(() => {
    const config: AgentConfig = {
      agentId: 'demo-agent-001',
      name: 'YYC³ AI助手',
      goalConfig: {
        maxGoalDepth: 5,
        goalTimeout: 30000,
        priorityWeights: {
          urgency: 0.4,
          importance: 0.3,
          complexity: 0.3
        }
      },
      planningConfig: {
        maxPlanSteps: 10,
        planningStrategy: 'astar',
        replanningThreshold: 0.7
      },
      toolConfig: {
        enabledTools: ['search', 'calculator', 'weather', 'translator'],
        toolTimeout: 10000,
        maxConcurrentTools: 3
      },
      reflectionConfig: {
        enableReflection: true,
        reflectionInterval: 5000,
        learningRate: 0.01
      },
      knowledgeConfig: {
        enableKnowledgeBase: true,
        vectorDbUrl: process.env.NEXT_PUBLIC_VECTOR_DB_URL,
        embeddingModel: 'text-embedding-ada-002'
      },
      contextConfig: {
        maxHistoryLength: 50,
        contextWindow: 4096,
        persistContext: true
      },
      learningConfig: {
        enableLearning: true,
        learningStrategy: 'hybrid',
        feedbackThreshold: 0.8
      }
    };

    const core = new AgenticCore(config);
    setAgenticCore(core);

    // 模拟实时统计更新
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        totalInteractions: prev.totalInteractions + Math.floor(Math.random() * 3),
        learningProgress: Math.min(prev.learningProgress + Math.random() * 2, 100),
        activeSessions: Math.max(0, prev.activeSessions + (Math.random() > 0.5 ? 1 : -1)),
        modelAccuracy: Math.min(Math.max(prev.modelAccuracy + (Math.random() - 0.5) * 5, 0), 100)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PageContainer 
      title="增强版AI浮窗系统" 
      description="集成自治AI引擎、模型适配器、三层学习系统的智能交互界面"
      className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-8"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* 标题区域 - 移除了手动h1，使用PageContainer提供的标题 */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Activity className="w-3 h-3 mr-1" />
              2.0.0
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              自治AI引擎
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              三层学习
            </Badge>
            <Badge variant="secondary" className="bg-pink-100 text-pink-800">
              模型适配器
            </Badge>
          </div>
        </div>

        {/* 核心功能展示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 自治AI引擎 */}
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 border-purple-200 dark:border-purple-800">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Cpu className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  自治AI引擎
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                实现"感知-思考-行动"闭环的中央指挥系统，支持任务规划、调度、执行和监控。
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
                <li>✓ 消息总线架构</li>
                <li>✓ 任务调度器</li>
                <li>✓ 状态持久化</li>
                <li>✓ 子系统注册</li>
              </ul>
            </div>
          </Card>

          {/* 模型适配器 */}
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 border-blue-200 dark:border-blue-800">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  模型适配器
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                统一AI模型接口，支持OpenAI、本地模型等多种提供商，实现一次编码多模型运行。
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
                <li>✓ 统一接口设计</li>
                <li>✓ 流式处理支持</li>
                <li>✓ 自动缓存优化</li>
                <li>✓ 健康检查机制</li>
              </ul>
            </div>
          </Card>

          {/* 三层学习系统 */}
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 border-pink-200 dark:border-pink-800">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-pink-600 dark:text-pink-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  三层学习系统
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                行为、策略、知识三层递进式学习架构，实现自适应智能优化。
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
                <li>✓ 行为模式识别</li>
                <li>✓ 策略自动优化</li>
                <li>✓ 知识图谱构建</li>
                <li>✓ 个性化推荐</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* 系统统计 */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            实时系统统计
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {systemStats.totalInteractions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                总交互次数
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {systemStats.learningProgress.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                学习进度
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                {systemStats.activeSessions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                活跃会话
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {systemStats.modelAccuracy.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                模型精度
              </div>
            </div>
          </div>
        </Card>

        {/* 控制按钮 */}
        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              体验增强版AI浮窗
            </h3>
            <Button
              onClick={() => setShowWidget(true)}
              disabled={!agenticCore || showWidget}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {showWidget ? '浮窗已打开' : '打开AI浮窗'}
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
              点击按钮体验集成了自治AI引擎、模型适配器和三层学习系统的智能交互界面。
              浮窗支持拖拽、调整大小，并能学习您的使用习惯进行个性化优化。
            </p>
          </div>
        </Card>

        {/* 技术特性说明 */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            架构特性
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">
                可插拔式设计
              </h4>
              <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                <li>• 所有核心模块都是独立的</li>
                <li>• 通过工厂模式创建实例</li>
                <li>• 易于替换和扩展</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                统一接口
              </h4>
              <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                <li>• ModelAdapter提供统一模型访问</li>
                <li>• 支持自动降级和重试</li>
                <li>• 内置性能监控和缓存</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-pink-600 dark:text-pink-400 mb-2">
                三层学习
              </h4>
              <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                <li>• 行为层：学习用户习惯</li>
                <li>• 策略层：优化决策流程</li>
                <li>• 知识层：构建知识图谱</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                自治能力
              </h4>
              <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                <li>• 完整的感知-思考-行动闭环</li>
                <li>• 任务规划、调度、执行</li>
                <li>• 状态持久化和恢复</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* 增强版AI浮窗 */}
      {showWidget && agenticCore && (
        <EnhancedAIWidget
          agenticCore={agenticCore}
          onClose={() => setShowWidget(false)}
          userId="demo-user"
        />
      )}
      <FloatingNavButtons />
    </PageContainer>
  );
}
