export interface QuickStartConfig {
  apiType?: 'internal' | 'openai' | 'anthropic' | 'ollama';
  modelName?: string;
  userRole?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  environment?: 'development' | 'staging' | 'production';
  integrations?: string[];
}

export interface IntegrationResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface PersonaConfig {
  role: string;
  capabilities: string[];
  preferences: string[];
  businessContext: {
    industry?: string;
    userRole?: string;
    deploymentEnvironment?: string;
    integrationPoints?: string[];
  };
}

export interface BusinessContext {
  industry?: string;
  userRole?: string;
  domainKnowledge?: string[];
  operationalConstraints?: any;
  deploymentEnvironment?: string;
  integrationPoints?: string[];
}

export interface AutonomousAIWidgetConfig {
  apiType?: string;
  modelName?: string;
  enableLearning?: boolean;
  enableMemory?: boolean;
  position?: string;
  businessContext?: BusinessContext;
  customTools?: any[];
  dataSources?: any[];
  uiConfig?: any;
}

export interface AIWidgetInstance {
  sendMessage(message: any): Promise<any>;
  registerTool(tool: any): Promise<void>;
  destroy?(): Promise<void>;
}
