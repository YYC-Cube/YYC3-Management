export interface IndustryConfiguration {
  id: string;
  name: string;
  description: string;
  personas: string[];
  capabilities: string[];
  tools: AITool[];
  dataSources: any[];
  successMetrics: any[];
}

export interface AIWidgetInstance {
  sendMessage(message: any): Promise<any>;
  registerTool(tool: AITool): Promise<void>;
}

export interface AITool {
  name: string;
  description: string;
  category?: string;
  parameters?: any;
  execute: (params: any) => Promise<any>;
}

export interface PersonaConfiguration {
  role: string;
  capabilities: string[];
  constraints: string[];
  preferences: string[];
}

export interface OperationalConstraints {
  maxConcurrentRequests: number;
  rateLimitPerMinute: number;
  allowedOperations: string[];
  restrictedOperations: string[];
}

export interface UIConfiguration {
  theme: string;
  layout: string;
  features: string[];
  customizations: Record<string, any>;
}

export function createAITool(tool: AITool): AITool {
  return tool;
}

export function createIndustryConfiguration(config: Partial<IndustryConfiguration>): IndustryConfiguration {
  return {
    id: config.id || '',
    name: config.name || '',
    description: config.description || '',
    personas: config.personas || [],
    capabilities: config.capabilities || [],
    tools: config.tools || [],
    dataSources: config.dataSources || [],
    successMetrics: config.successMetrics || []
  };
}

export function createPersonaConfiguration(config: Partial<PersonaConfiguration>): PersonaConfiguration {
  return {
    role: config.role || '',
    capabilities: config.capabilities || [],
    constraints: config.constraints || [],
    preferences: config.preferences || []
  };
}

export function createOperationalConstraints(config: Partial<OperationalConstraints> = {}): OperationalConstraints {
  return {
    maxConcurrentRequests: config.maxConcurrentRequests || 10,
    rateLimitPerMinute: config.rateLimitPerMinute || 60,
    allowedOperations: config.allowedOperations || [],
    restrictedOperations: config.restrictedOperations || []
  };
}

export function createUIConfiguration(config: Partial<UIConfiguration> = {}): UIConfiguration {
  return {
    theme: config.theme || 'default',
    layout: config.layout || 'standard',
    features: config.features || [],
    customizations: config.customizations || {}
  };
}
