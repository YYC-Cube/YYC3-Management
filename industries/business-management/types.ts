export interface AIWidgetInstance {
  sendMessage(message: any): Promise<any>;
  registerTool(tool: AITool): Promise<void>;
}

export interface StrategicContext {
  goals: string[];
  vision: string;
  mission: string;
  values: string[];
  current_challenges: string[];
  strategic_priorities: string[];
}

export interface AITool {
  name: string;
  description: string;
  category?: string;
  parameters?: any;
  execute: (params: any) => Promise<any>;
}

export interface BusinessPerformanceReport {
  id: string;
  generated_at: Date;
  report_period: string;
  metrics: {
    revenue: number;
    growth_rate: number;
    profit_margin: number;
    customer_satisfaction: number;
    employee_satisfaction: number;
  };
  performance_trends: any[];
  insights: string[];
  recommendations: string[];
}

export interface StrategicInsight {
  id: string;
  category: string;
  title: string;
  description: string;
  impact_level: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  data_sources: string[];
  actionable_recommendations: string[];
  created_at: Date;
}

export interface BusinessManagementAI {
  getInstance(): BusinessManagementAI;
  createManagerAI(role: string): Promise<AIWidgetInstance>;
  fetchKPIData(kpiType: string, timePeriod?: string): Promise<any>;
  analyzeKPI(kpiData: any): Promise<any>;
  generateKPIRecommendations(analysis: any): Promise<string[]>;
  createKPIVisualization(kpiData: any): Promise<any>;
}

export function createAITool(tool: AITool): AITool {
  return tool;
}

export function createBusinessManagementAI(): BusinessManagementAI {
  return {
    getInstance: () => createBusinessManagementAI(),
    createManagerAI: async (role: string) => {
      return {
        sendMessage: async (message) => ({
          data: null,
          immediate_action_required: false
        }),
        registerTool: async (tool) => {}
      };
    },
    fetchKPIData: async (kpiType: string, timePeriod?: string) => {
      return {
        kpi_type: kpiType,
        time_period: timePeriod || 'monthly',
        value: 100,
        change: 5.2,
        trend: 'up'
      };
    },
    analyzeKPI: async (kpiData: any) => {
      return {
        status: 'on_track',
        trend: 'positive',
        insights: []
      };
    },
    generateKPIRecommendations: async (analysis: any) => {
      return ['Continue current strategy', 'Monitor closely'];
    },
    createKPIVisualization: async (kpiData: any) => {
      return {
        type: 'chart',
        data: kpiData
      };
    }
  };
}
