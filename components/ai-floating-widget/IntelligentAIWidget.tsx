/**
 * @fileoverview 智能AI浮窗组件
 * @description 可拖拽、可插拔的智能AI交互界面，支持多模型切换
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-09
 * @modified 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Maximize2, MessageSquare, Settings, Sparkles, ChevronDown, Mic, MicOff, ImagePlus, Send, HeadphonesIcon, ServerIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AIResponseTemplateRenderer } from './AIResponseTemplate';
import { AgenticCore, UserInput, AgentResponse, AgentState } from '@/lib/agentic-core/index';

// ====================================
// 类型定义
// ====================================

interface WidgetPosition {
  x: number;
  y: number;
}

interface WidgetSize {
  width: number;
  height: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'action' | 'tool_call' | 'error';
  data?: unknown;
  actions?: MessageAction[];
  sentiment?: SentimentAnalysis; // 情感分析结果
}
// 情感分析结果接口
export interface SentimentAnalysis {
  score: number; // 情感分数，范围从-1（消极）到1（积极）
  label: 'very-negative' | 'negative' | 'neutral' | 'positive' | 'very-positive';
  confidence: number; // 置信度，范围0-1
  keyPhrases: string[];
}

// 消息动作接口
export interface MessageAction {
  label: string;
  type: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  action: () => void;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  status: 'online' | 'offline' | 'busy';
}

type WidgetMode = 'customer' | 'operations';

interface QuickAction {
  label: string;
  icon: string;
  prompt: string;
}

// ====================================
// 常量定义
// ====================================

const DEFAULT_POSITION: WidgetPosition = { x: typeof window !== 'undefined' ? window.innerWidth - 420 : 100, y: 100 };
const DEFAULT_SIZE: WidgetSize = { width: 400, height: 600 };
const MIN_SIZE: WidgetSize = { width: 300, height: 400 };
const MAX_SIZE: WidgetSize = { width: 800, height: 800 };

const AI_MODELS: AIModel[] = [
  { id: 'glm-4-flash', name: 'GLM-4-Flash', provider: '智谱AI', capabilities: ['text', 'vision'], status: 'online' },
  { id: 'qwen-max', name: '通义千问Max', provider: '阿里云', capabilities: ['text', 'vision'], status: 'online' },
  { id: 'ernie-4.0', name: '文心一言4.0', provider: '百度', capabilities: ['text', 'vision'], status: 'online' },
  { id: 'ollama-llama3', name: 'Llama 3 (本地)', provider: 'Ollama', capabilities: ['text'], status: 'online' },
];

// 默认快捷操作
const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  { label: '如何使用这个功能？', icon: '❓', prompt: '请详细说明如何使用这个AI助手的各项功能' },
  { label: '常见问题', icon: '📋', prompt: '请列出这个AI助手的常见问题和解决方案' },
  { label: '联系客服', icon: '👩‍💼', prompt: '我需要联系人工客服，请提供联系方式' },
  { label: '反馈问题', icon: '📝', prompt: '我想反馈一个使用过程中遇到的问题' },
  { label: '产品介绍', icon: 'ℹ️', prompt: '请详细介绍这个AI助手的功能和特点' },
];

// 运维模式快捷操作
const OPERATIONS_QUICK_ACTIONS: QuickAction[] = [
  { label: '系统状态', icon: '📊', prompt: '请提供当前系统的运行状态和资源使用情况' },
  { label: '日志查询', icon: '📋', prompt: '请查询最近24小时的系统日志' },
  { label: '重启服务', icon: '🔄', prompt: '请重启AI服务并提供重启结果' },
  { label: '性能监控', icon: '📈', prompt: '请提供系统性能监控数据和分析' },
  { label: '错误统计', icon: '❌', prompt: '请提供最近的错误统计和分析' },
];

// 根据模式获取快捷操作
const getQuickActions = (mode: WidgetMode): QuickAction[] => {
  return mode === 'customer' ? DEFAULT_QUICK_ACTIONS : OPERATIONS_QUICK_ACTIONS;
};

// ====================================
// 组件实现
// ====================================

export const IntelligentAIWidget: React.FC<{
  agenticCore: AgenticCore;
  initialPosition?: WidgetPosition;
  initialSize?: WidgetSize;
  onClose?: () => void;
}> = ({
  agenticCore,
  initialPosition = DEFAULT_POSITION,
  initialSize = DEFAULT_SIZE,
  onClose
}) => {
  // 状态管理
  const [position, setPosition] = useState<WidgetPosition>(initialPosition);
  const [size, setSize] = useState<WidgetSize>(initialSize);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>(AI_MODELS[0].id);
  const [agentState, setAgentState] = useState<AgentState>(AgentState.IDLE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMode, setCurrentMode] = useState<WidgetMode>('customer');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [settingsVisible, setSettingsVisible] = useState(false);
  // 多模态输入状态
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');

  // 自主学习状态
  const [learningState, setLearningState] = useState({
    userPreferences: new Map<string, any>(),
    frequentlyAskedQuestions: new Map<string, number>(),
    successfulResponses: new Map<string, number>(),
    learnedContexts: new Map<string, any>()
  });

  // Refs
  const widgetRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // ====================================
  // 拖拽逻辑
  // ====================================

  const handleDragStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.no-drag')) return;

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;

    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;

    // 边界检查
    const maxX = window.innerWidth - size.width;
    const maxY = window.innerHeight - size.height;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // ====================================
  // 调整大小逻辑
  // ====================================

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    };
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizing || !resizeStartRef.current) return;

    const deltaX = e.clientX - resizeStartRef.current.x;
    const deltaY = e.clientY - resizeStartRef.current.y;

    const newWidth = resizeStartRef.current.width + deltaX;
    const newHeight = resizeStartRef.current.height + deltaY;

    setSize({
      width: Math.max(MIN_SIZE.width, Math.min(newWidth, MAX_SIZE.width)),
      height: Math.max(MIN_SIZE.height, Math.min(newHeight, MAX_SIZE.height))
    });
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    resizeStartRef.current = null;
  };

  // ====================================
  // 事件监听器
  // ====================================

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing]);

  // 监听AgenticCore状态
  useEffect(() => {
    const handleStateChange = (_oldState: AgentState, newState: AgentState) => {
      setAgentState(newState);
      setIsProcessing(newState !== AgentState.IDLE && newState !== AgentState.ERROR);
    };

    agenticCore.on('state:changed', handleStateChange);
    return () => {
      agenticCore.off('state:changed', handleStateChange);
    };
  }, [agenticCore]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ====================================
  // 辅助函数
  // ====================================

  // ====================================
  // 自主学习功能
  // ====================================

  // 从用户交互中学习
  const learnFromUserInteraction = async (userMessage: string, assistantResponse: string, success: boolean = true) => {
    setLearningState(prev => {
      const updated = { ...prev };

      // 更新常见问题
      if (userMessage) {
        const faqCount = updated.frequentlyAskedQuestions.get(userMessage) || 0;
        updated.frequentlyAskedQuestions.set(userMessage, faqCount + 1);
      }

      // 更新成功响应
      if (assistantResponse && success) {
        const responseCount = updated.successfulResponses.get(assistantResponse) || 0;
        updated.successfulResponses.set(assistantResponse, responseCount + 1);
      }

      return updated;
    });
  };

  // 更新用户偏好
  const updateUserPreferences = (preference: string, value: any) => {
    setLearningState(prev => {
      const updated = { ...prev };
      updated.userPreferences.set(preference, value);
      return updated;
    });
  };

  // 学习上下文关系
  const learnContext = (context: string, relatedContexts: string[]) => {
    setLearningState(prev => {
      const updated = { ...prev };
      updated.learnedContexts.set(context, relatedContexts);
      return updated;
    });
  };

  // 获取学习到的知识
  const getLearnedKnowledge = () => {
    return {
      userPreferences: Object.fromEntries(learningState.userPreferences),
      frequentlyAskedQuestions: Object.fromEntries(learningState.frequentlyAskedQuestions),
      successfulResponses: Object.fromEntries(learningState.successfulResponses),
      learnedContexts: Object.fromEntries(learningState.learnedContexts)
    };
  };

  // 模拟情感分析
  const analyzeSentiment = async (text: string): Promise<SentimentAnalysis> => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 300));

    // 简单的情感分析模拟
    const veryNegativeWords = ['失败', '错误', '崩溃', '无法', '不行', '糟透了', '垃圾'];
    const negativeWords = ['不好', '有问题', '困难', '麻烦', '失望', '慢'];
    const positiveWords = ['好', '不错', '成功', '谢谢', '帮助', '满意', '快'];
    const veryPositiveWords = ['非常好', '太棒了', '完美', '优秀', '谢谢', '感谢'];

    let score = 0;
    const keyPhrases: string[] = [];

    // 检查关键词
    const checkWords = (words: string[], value: number) => {
      for (const word of words) {
        if (text.includes(word)) {
          score += value;
          keyPhrases.push(word);
        }
      }
    };

    checkWords(veryNegativeWords, -0.8);
    checkWords(negativeWords, -0.4);
    checkWords(positiveWords, 0.4);
    checkWords(veryPositiveWords, 0.8);

    // 确保分数在-1到1之间
    score = Math.min(Math.max(score, -1), 1);

    // 确定情感标签
    let label: SentimentAnalysis['label'] = 'neutral';
    if (score <= -0.7) label = 'very-negative';
    else if (score <= -0.3) label = 'negative';
    else if (score >= 0.7) label = 'very-positive';
    else if (score >= 0.3) label = 'positive';

    return {
      score,
      label,
      confidence: 0.8 + Math.random() * 0.2, // 80-100%的置信度
      keyPhrases: [...new Set(keyPhrases)] // 去重
    };
  };

  // ====================================
  // 消息处理
  // ====================================

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      // 分析用户消息的情感
      const sentiment = await analyzeSentiment(userMessage.content);

      // 更新用户消息，添加情感分析结果
      setMessages(prev => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1].sentiment = sentiment;
        return updatedMessages;
      });

      // 构建用户输入
      const userInput: UserInput = {
        content: inputValue,
        type: 'text',
        context: {
          sessionId: `session-${Date.now()}`,
          userId: 'current-user',
          environment: 'web',
          permissions: ['read', 'write'],
          conversationHistory: messages.map(m => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: m.timestamp
          })),
          workingMemory: {
            selectedModel
          },
          userPreferences: {
            language: 'zh-CN',
            theme: 'auto',
            notifications: true,
            aiModel: selectedModel
          }
        },
        metadata: {
          model: selectedModel
        }
      };

      // 调用AgenticCore处理
      const response: AgentResponse = await agenticCore.processInput(userInput);

      // 添加助手回复
      const assistantMessage: ChatMessage = {
        id: response.id,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        type: response.type,
        data: response.data,
        actions: [
          {
            label: '重新生成',
            type: 'primary',
            action: () => {
              // 重新生成相同问题的回答
              handleSendMessage();
            }
          },
          {
            label: '复制',
            type: 'secondary',
            action: () => {
              // 复制消息内容到剪贴板
              navigator.clipboard.writeText(response.content)
                .then(() => {
                  // 可以添加复制成功的提示
                  console.log('消息内容已复制到剪贴板');
                })
                .catch(err => {
                  console.error('复制失败:', err);
                });
            }
          },
          {
            label: '反馈',
            type: 'warning',
            action: () => {
              // 打开反馈对话框
              setInputValue('我对这个回答有反馈: ');
              // 记录用户反馈
              learnFromUserInteraction(inputValue, response.content, false);
            }
          },
          {
            label: '收藏',
            type: 'success',
            action: () => {
              // 收藏该消息并记录为成功响应
              console.log('消息已收藏');
              learnFromUserInteraction(inputValue, response.content, true);
            }
          }
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);

      // 从用户交互中学习
      learnFromUserInteraction(inputValue, response.content, true);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'system',
        content: `处理失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ====================================
  // 多模态输入处理
  // ====================================

  // 语音输入处理
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // 这里可以添加语音转文本的逻辑
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('录音失败:', error);
    }
  };

  const handleStopRecording = () => {
    if (audioRecorderRef.current && audioRecorderRef.current.state === 'recording') {
      audioRecorderRef.current.stop();
    }
  };

  // 图片上传处理
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      // 这里可以添加图片预览和发送的逻辑
    }
  };

  const handleSendImage = async () => {
    if (!selectedImage) return;

    try {
      setIsProcessing(true);
      // 这里可以添加图片上传和处理的逻辑
      setSelectedImage(null);
    } catch (error) {
      console.error('图片发送失败:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // ====================================
  // 窗口控制
  // ====================================

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      setSize(initialSize);
      setPosition(initialPosition);
    } else {
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 40 });
      setPosition({ x: 20, y: 20 });
    }
    setIsMaximized(!isMaximized);
  };

  // ====================================
  // 设置功能
  // ====================================

  // 设置项状态
  const [settings, setSettings] = useState({
    language: 'zh-CN',
    theme: 'light',
    notifications: true,
    autoSave: true,
    showTimestamps: true,
    soundEffects: true
  });

  const toggleSettings = () => {
    setSettingsVisible(!settingsVisible);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // ====================================
  // 渲染
  // ====================================

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-4 right-4 z-50 cursor-pointer"
        onClick={toggleMinimize}
      >
        <Card className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow rounded-full">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden animate-spin-slow">
              <img
                src="/avatar/ai_avatar/ai_avatar_001.png"
                alt="AI Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <Badge variant="secondary" className="ml-1">
              {messages.length}
            </Badge>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      ref={widgetRef}
      className={cn(
        "fixed z-50",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
      style={{
        ['--widget-x' as any]: `${position.x}px`,
        ['--widget-y' as any]: `${position.y}px`,
        ['--widget-width' as any]: `${size.width}px`,
        ['--widget-height' as any]: `${size.height}px`,
        left: 'var(--widget-x)',
        top: 'var(--widget-y)',
        width: 'var(--widget-width)',
        height: 'var(--widget-height)',
      } as React.CSSProperties}
    >
      <Card className="h-full flex flex-col shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* 标题栏 */}
        <div
          className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-blue-500/10 to-purple-600/10"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <img
                src="/avatar/ai_avatar/ai_avatar_001.png"
                alt="AI Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-semibold">AI</span>
            <Badge variant={agentState === AgentState.IDLE ? 'secondary' : 'default'}>
              {agentState}
            </Badge>
            <div className="ml-2 flex items-center gap-1">
              {currentMode === 'customer' ? (
                <HeadphonesIcon className="w-4 h-4 text-blue-500" />
              ) : (
                <ServerIcon className="w-4 h-4 text-blue-500" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 no-drag">
            {/* 模式切换按钮 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMode(currentMode === 'customer' ? 'operations' : 'customer')}
              className="hover:bg-primary/10"
            >
              <Settings className="w-4 h-4 text-blue-500" />
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleMinimize}>
              <Minimize2 className="w-4 h-4 text-blue-500" />
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleMaximize}>
              <Maximize2 className="w-4 h-4 text-blue-500" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4 text-blue-500" />
            </Button>
          </div>
        </div>

        {/* 模型选择器 */}
        <div className="p-3 border-b no-drag bg-muted/30">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-500" />
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择AI模型" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{model.name}</span>
                      <Badge
                        variant={model.status === 'online' ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {model.provider}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 消息区域 */}
        <ScrollArea className="flex-1 p-4 relative">
          <div className="absolute inset-0 bg-[url('/yyc3-logo-gray.png')] bg-no-repeat bg-center bg-cover opacity-50 pointer-events-none" />
          <div className="relative z-10">
            {settingsVisible ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">设置</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSettings}
                >
                  <X className="w-4 h-4 text-blue-500" />
                </Button>
              </div>

              {/* 设置项 */}
              <div className="space-y-4">
                {/* 语言设置 */}
                <div>
                  <Label className="block text-sm font-medium mb-2">语言</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleSettingChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择语言" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh-CN">简体中文</SelectItem>
                      <SelectItem value="en-US">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 主题设置 */}
                <div>
                  <Label className="block text-sm font-medium mb-2">主题</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => handleSettingChange('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择主题" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">浅色</SelectItem>
                      <SelectItem value="dark">深色</SelectItem>
                      <SelectItem value="system">跟随系统</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 通知设置 */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">通知提醒</Label>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>

                {/* 自动保存设置 */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">自动保存对话</Label>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                  />
                </div>

                {/* 显示时间戳设置 */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">显示时间戳</Label>
                  <Switch
                    checked={settings.showTimestamps}
                    onCheckedChange={(checked) => handleSettingChange('showTimestamps', checked)}
                  />
                </div>

                {/* 音效设置 */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">音效</Label>
                  <Switch
                    checked={settings.soundEffects}
                    onCheckedChange={(checked) => handleSettingChange('soundEffects', checked)}
                  />
                </div>
              </div>

              {/* 重置按钮 */}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setSettings({
                    language: 'zh-CN',
                    theme: 'light',
                    notifications: true,
                    autoSave: true,
                    showTimestamps: true,
                    soundEffects: true
                  });
                }}
              >
                重置为默认设置
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-500 opacity-50" />
                  <p className="text-lg font-medium mb-4">AI</p>
                  <p className="text-sm text-muted-foreground mb-6">开始对话，体验智能交互</p>

                  {/* 快捷操作区域 */}
                  <div className="text-left">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">快捷操作</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowQuickActions(!showQuickActions)}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${!showQuickActions ? 'rotate-180' : ''}`}
                        />
                      </Button>
                    </div>

                    {showQuickActions && (
                      <div className="grid grid-cols-2 gap-2">
                        {getQuickActions(currentMode).map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="justify-start gap-2"
                            onClick={() => {
                              setInputValue(action.prompt);
                              handleSendMessage();
                            }}
                          >
                            <span>{action.icon}</span>
                            <span className="text-xs text-left truncate">{action.label}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : message.type === 'error'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-muted'
                      }`}
                    >
                      {message.role === 'assistant' && message.type && message.type !== 'error' ? (
                        <AIResponseTemplateRenderer template={{
                          type: message.type,
                          content: message.content,
                          data: message.data,
                          actions: message.actions?.map(a => ({
                            label: a.label,
                            type: a.type === 'primary' ? 'default' as const : a.type === 'danger' ? 'destructive' as const : a.type as 'secondary' | 'success' | 'warning',
                            action: a.action
                          })),
                          metadata: {
                            model: selectedModel,
                            timestamp: message.timestamp
                          }
                        }} />
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      )}
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>

                      {/* 情感分析结果 */}
                      {message.role === 'user' && message.sentiment && (
                        <div className="mt-1 flex items-center">
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded-full mr-1 ${message.sentiment.label === 'very-negative' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' : message.sentiment.label === 'negative' ? 'bg-red-50 text-red-700 dark:bg-red-800 dark:text-red-200' : message.sentiment.label === 'neutral' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : message.sentiment.label === 'positive' ? 'bg-green-50 text-green-700 dark:bg-green-800 dark:text-green-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'}`}
                          >
                            {message.sentiment.label === 'very-negative' ? '非常消极' : message.sentiment.label === 'negative' ? '消极' : message.sentiment.label === 'neutral' ? '中性' : message.sentiment.label === 'positive' ? '积极' : '非常积极'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            (信心: {Math.round(message.sentiment.confidence * 100)}%)
                          </span>
                        </div>
                      )}

                      {/* 消息动作按钮 */}
                      {message.actions && message.actions.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {message.actions.map((action, index) => (
                            <Button
                              key={index}
                              variant={action.type === 'primary' ? 'default' : action.type === 'danger' ? 'destructive' : action.type}
                              size="sm"
                              className="h-6 px-2"
                              onClick={action.action}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce-0" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce-150" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce-300" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
          </div>
        </ScrollArea>

        {/* 输入区域 */}
        <div className="p-3 border-t no-drag bg-muted/30">
          {/* 图片预览 */}
          {selectedImage && (
            <div className="flex items-center gap-2 p-2 mb-2 bg-primary/5 rounded-lg">
              <span className="text-sm text-muted-foreground truncate">
                {selectedImage.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImage(null)}
                className="h-6 w-6 p-0 text-destructive"
              >
                <X className="w-4 h-4 text-blue-500" />
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSendImage}
                disabled={isProcessing}
                className="h-6"
              >
                <Send className="w-3 h-3 text-blue-500" />
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入消息... (Enter发送)"
              disabled={isProcessing}
              className="flex-1"
            />

            {/* 图片上传按钮 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => imageInputRef.current?.click()}
              disabled={isProcessing}
              aria-label="上传图片"
            >
              <ImagePlus className="w-4 h-4 text-blue-500" />
            </Button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="ai-image-upload"
              aria-hidden="true"
              aria-label="上传图片"
              title="上传图片"
              tabIndex={-1}
            />

            {/* 语音输入按钮 */}
            <Button
              variant={isRecording ? "destructive" : "ghost"}
              size="icon"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={isProcessing}
              className={isRecording ? "animate-pulse" : ""}
            >
              {isRecording ? <MicOff className="w-4 h-4 text-blue-500" /> : <Mic className="w-4 h-4 text-blue-500" />}
            </Button>

            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
              size="icon"
            >
              <MessageSquare className="w-4 h-4 text-blue-500" />
            </Button>
          </div>
        </div>

        {/* 调整大小手柄 */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize no-drag resize-handle"
          onMouseDown={handleResizeStart}
        />
      </Card>
    </div>
  );
};

export default IntelligentAIWidget;
