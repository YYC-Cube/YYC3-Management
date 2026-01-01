export interface AIWidgetInstance {
  sendMessage(message: any): Promise<any>;
  initialize(config: any): Promise<void>;
}

export interface MonitoringSystem {
  on(event: string, callback: (data: any) => void): void;
}

export interface MonitoringConfig {
  systems: any[];
  refreshInterval?: number;
}

export interface AITool {
  name: string;
  description: string;
  parameters: any;
  execute: (params: any) => Promise<any>;
}

export interface Anomaly {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  metrics: any;
}

export interface SLAViolation {
  id: string;
  sla_id: string;
  violation_type: string;
  severity: 'minor' | 'major' | 'critical';
  timestamp: Date;
  actual_value: number;
  threshold: number;
}

export interface OperationsReport {
  id: string;
  generated_at: Date;
  report_type: string;
  data: {
    health: any;
    performance: any;
    incidents: any[];
  };
  summary: string;
  recommendations: string[];
}

export function createAutonomousAIWidget(config: any): Promise<AIWidgetInstance> {
  return Promise.resolve({
    sendMessage: async (message) => ({
      immediate_action_required: false,
      recommended_actions: [],
      data: null
    }),
    initialize: async (config) => {}
  });
}

export function createAITool(tool: AITool): AITool {
  return tool;
}
