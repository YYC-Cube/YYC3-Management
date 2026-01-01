/**
 * @fileoverview AI智能浮窗演示页面
 * @description 展示智能插拔式可移动AI系统的使用方法
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-09
 * @modified 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Code, Zap, Brain, MessageSquare } from 'lucide-react';
import { IntelligentAIWidget } from '@/components/ai-floating-widget/IntelligentAIWidget';
import { AgenticCore, type AgentConfig } from '@/lib/agentic-core/AgenticCore';

export default function AIFloatingDemoPage() {
  const [showWidget, setShowWidget] = useState(false);
  const [agenticCore, setAgenticCore] = useState<AgenticCore | null>(null);
  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    averageDuration: 0
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
    
    // 监听事件以更新指标
    const updateMetrics = () => {
      setMetrics(core.getMetrics());
    };

    core.on('task:completed', updateMetrics);
    core.on('task:failed', updateMetrics);

    setAgenticCore(core);

    return () => {
      core.destroy();
    };
  }, []);

  const handleOpenWidget = () => {
    setShowWidget(true);
  };

  const handleCloseWidget = () => {
    setShowWidget(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            YYC³ AI智能浮窗系统
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            智能插拔式可移动AI系统 · 基于五标五高五化设计原则
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <Badge variant="secondary">React + TypeScript</Badge>
            <Badge variant="secondary">AgenticCore引擎</Badge>
            <Badge variant="secondary">多模型支持</Badge>
            <Badge variant="secondary">可拖拽UI</Badge>
          </div>
        </div>

        {/* 功能特性 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-500" />
              </div>
              <CardTitle className="text-lg">智能自治引擎</CardTitle>
              <CardDescription>
                AgenticCore提供目标驱动、自主规划、反思学习能力
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-purple-500" />
              </div>
              <CardTitle className="text-lg">多模型支持</CardTitle>
              <CardDescription>
                集成智谱GLM、通义千问、文心一言、Ollama等10+模型
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle className="text-lg">可插拔架构</CardTitle>
              <CardDescription>
                支持工具动态注册、知识库接入、能力扩展
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-orange-500" />
              </div>
              <CardTitle className="text-lg">企业级标准</CardTitle>
              <CardDescription>
                遵循YYC³标准化规范，TypeScript全栈开发
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* 系统指标 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>系统运行指标</CardTitle>
            <CardDescription>实时展示AgenticCore引擎的运行状态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {metrics.totalTasks}
                </div>
                <div className="text-sm text-muted-foreground">总任务数</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {metrics.completedTasks}
                </div>
                <div className="text-sm text-muted-foreground">已完成</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {metrics.failedTasks}
                </div>
                <div className="text-sm text-muted-foreground">失败数</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {metrics.averageDuration}ms
                </div>
                <div className="text-sm text-muted-foreground">平均耗时</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 快速开始 */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>快速开始</CardTitle>
            <CardDescription>点击按钮打开AI智能浮窗，体验智能交互功能</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleOpenWidget}
                  disabled={!agenticCore || showWidget}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  打开AI助手浮窗
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="flex-1"
                  onClick={() => window.open('/docs/AI智能浮窗系统/00-智能插拔式移动AI系统设计.md', '_blank')}
                >
                  <Code className="w-5 h-5 mr-2" />
                  查看技术文档
                </Button>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-3">功能演示：</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>拖拽移动：</strong>点击标题栏可拖动窗口到任意位置</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>调整大小：</strong>拖动右下角可调整窗口尺寸</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>最小化/最大化：</strong>使用窗口控制按钮管理显示状态</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>模型切换：</strong>支持GLM-4、通义千问、文心一言等多个AI模型</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>智能对话：</strong>AgenticCore自动规划、执行、反思、学习</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 代码示例 */}
        <Card>
          <CardHeader>
            <CardTitle>代码示例</CardTitle>
            <CardDescription>如何在你的项目中集成AI智能浮窗</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm">
{`import { AgenticCore, type AgentConfig } from '@/lib/agentic-core/AgenticCore';
import { IntelligentAIWidget } from '@/components/ai-floating-widget/IntelligentAIWidget';

// 1. 创建配置
const config: AgentConfig = {
  agentId: 'my-agent-001',
  name: 'My AI Assistant',
  goalConfig: { maxGoalDepth: 5, goalTimeout: 30000, priorityWeights: {} },
  planningConfig: { maxPlanSteps: 10, planningStrategy: 'astar', replanningThreshold: 0.7 },
  toolConfig: { enabledTools: ['search', 'calculator'], toolTimeout: 10000, maxConcurrentTools: 3 },
  reflectionConfig: { enableReflection: true, reflectionInterval: 5000, learningRate: 0.01 },
  knowledgeConfig: { enableKnowledgeBase: true },
  contextConfig: { maxHistoryLength: 50, contextWindow: 4096, persistContext: true },
  learningConfig: { enableLearning: true, learningStrategy: 'hybrid', feedbackThreshold: 0.8 }
};

// 2. 初始化AgenticCore
const agenticCore = new AgenticCore(config);

// 3. 渲染AI浮窗
<IntelligentAIWidget 
  agenticCore={agenticCore}
  onClose={() => setShowWidget(false)}
/>`}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* AI浮窗 */}
      {showWidget && agenticCore && (
        <IntelligentAIWidget 
          agenticCore={agenticCore}
          onClose={handleCloseWidget}
        />
      )}
    </div>
  );
}
