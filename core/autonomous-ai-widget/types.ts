// core/autonomous-ai-widget/types.ts

// ====================================
// 工具类型定义
// ====================================

export interface AITool {
  name: string;
  description: string;
  category?: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
  execute: (params: any) => Promise<ToolResult>;
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

// ====================================
// 模型响应类型定义
// ====================================

export interface ModelResponse {
  content: string;
  toolCalls?: any[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model?: string;
}

// ====================================
// 业务上下文类型定义
// ====================================

export interface BusinessContext {
  industry?: string;
  userRole?: string;
  availableFeatures?: string[];
  domain?: string;
  tone?: string;
  responseStyle?: string;
}

// ====================================
// 数据源类型定义
// ====================================

export interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'custom';
  config: Record<string, any>;
}

// ====================================
// AI状态和能力类型定义
// ====================================

export interface AIWidgetState {
  isActive: boolean;
  isProcessing: boolean;
  currentContext?: any;
  lastInteraction?: Date;
}

export interface AICapabilities {
  learning: boolean;
  memory: boolean;
  toolUse: boolean;
  contextAwareness: boolean;
  streaming: boolean;
  multimodal: boolean;
}

// ====================================
// 用户消息和AI响应类型定义
// ====================================

export interface UserMessage {
  id?: string;
  user: string;
  content: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface AIResponse {
  content: string;
  toolCalls?: any[];
  responseTime?: number;
  metadata?: Record<string, any>;
}

// ====================================
// AI上下文类型定义
// ====================================

export interface AIContext {
  timestamp: Date;
  user: string;
  conversationHistory: any[];
  userPreferences: any;
  businessContext?: BusinessContext;
  pageContext?: any;
  availableTools: AITool[];
}

// ====================================
// 模型信息类型定义
// ====================================

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  maxTokens: number;
  version?: string;
  description?: string;
}

// ====================================
// 自治AI配置类型定义
// ====================================

export interface AutonomousAIConfig {
  // 核心配置
  apiType: 'internal' | 'openai' | 'azure' | 'custom';
  modelName: string;
  maxTokens: number;
  temperature: number;
  apiKey?: string;
  baseURL?: string;

  // 自治能力配置
  enableLearning: boolean;
  enableMemory: boolean;
  enableToolUse: boolean;
  enableContextAwareness: boolean;

  // UI配置
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme: 'light' | 'dark' | 'auto';
  language: string;

  // 业务集成
  businessContext?: BusinessContext;
  customTools?: AITool[];
  dataSources?: DataSource[];
}

export interface AIWidgetInstance {
  id: string;
  config: AutonomousAIConfig;
  state: AIWidgetState;
  capabilities: AICapabilities;
  destroy: () => void;
  updateConfig: (config: Partial<AutonomousAIConfig>) => void;
}
