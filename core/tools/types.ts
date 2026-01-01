export interface AITool {
  name: string;
  description: string;
  category?: string;
  parameters: ToolParameters;
  execute: (params: any) => Promise<ToolResult>;
}

export interface ToolParameters {
  type: string;
  properties: Record<string, ToolProperty>;
  required: string[];
}

export interface ToolProperty {
  type: string;
  description: string;
  default?: any;
  enum?: string[];
}

export interface ToolResult {
  success: boolean;
  data?: any;
  insights?: any;
  document?: any;
  error?: string;
}

export interface AIContext {
  query?: string;
  intent?: string;
  entities?: Record<string, any>;
  conversationHistory?: any[];
  userPreferences?: Record<string, any>;
  currentTask?: string;
  metadata?: Record<string, any>;
}

export interface ToolUsageRecord {
  toolName: string;
  timestamp: Date;
  parameters: any;
  result: ToolResult;
  executionTime: number;
}

export interface ToolRelevanceScore {
  toolName: string;
  score: number;
  reasons: string[];
}
