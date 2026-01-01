import {
  IndustryConfiguration,
  AIWidgetInstance,
  AITool,
  PersonaConfiguration,
  OperationalConstraints,
  UIConfiguration,
  createAITool
} from './types';

export class IndustryAdapter {
  private industryConfigs: Map<string, IndustryConfiguration> = new Map();

  constructor() {
    this.initializeIndustryConfigs();
  }

  private initializeIndustryConfigs(): void {
    // 经 - 经营管理
    this.industryConfigs.set('business_management', createIndustryConfiguration({
      id: 'business_management',
      name: '经营管理',
      description: '企业战略、运营、财务、人力资源等管理场景',
      personas: ['ceo', 'cfo', 'coo', 'hr_director', 'project_manager'],
      capabilities: ['strategic_planning', 'financial_analysis', 'kpi_tracking', 'resource_optimization'],
      tools: this.getManagementTools(),
      dataSources: this.getManagementDataSources(),
      successMetrics: this.getManagementMetrics()
    }));

    // 管 - 运维分析
    this.industryConfigs.set('operations_analysis', createIndustryConfiguration({
      id: 'operations_analysis',
      name: '运维分析',
      description: '系统监控、性能分析、故障预测、容量规划',
      personas: ['devops_engineer', 'system_analyst', 'it_manager', 'security_analyst'],
      capabilities: ['monitoring', 'performance_analysis', 'anomaly_detection', 'capacity_planning'],
      tools: this.getOperationsTools(),
      dataSources: this.getOperationsDataSources(),
      successMetrics: this.getOperationsMetrics()
    }));
  }

  async createIndustryAI(industry: string, userPersona: string): Promise<AIWidgetInstance> {
    const config = this.industryConfigs.get(industry);
    if (!config) {
      throw new Error(`不支持的行业: ${industry}`);
    }

    const personaConfig = await this.getPersonaConfiguration(userPersona, config);

    return createAutonomousAIWidget({
      apiType: 'internal',
      modelName: 'yyc3-industry-specialized',
      enableLearning: true,
      enableMemory: true,
      businessContext: {
        industry: config.id,
        userRole: userPersona,
        domainKnowledge: config.capabilities,
        operationalConstraints: await this.getOperationalConstraints(industry)
      },
      customTools: config.tools,
      dataSources: config.dataSources,
      uiConfig: await this.getIndustryUIConfig(industry, userPersona)
    });
  }

  async getIndustryConfig(industry: string): Promise<any> {
    const config = this.industryConfigs.get(industry);
    if (!config) {
      throw new Error(`不支持的行业: ${industry}`);
    }
    return {
      businessContext: {
        industry: config.id,
        domainKnowledge: config.capabilities
      },
      customTools: config.tools,
      dataSources: config.dataSources
    };
  }

  private async getPersonaConfiguration(userPersona: string, config: IndustryConfiguration): Promise<PersonaConfiguration> {
    return {
      role: userPersona,
      capabilities: config.capabilities,
      constraints: [],
      preferences: []
    };
  }

  private async getOperationalConstraints(industry: string): Promise<OperationalConstraints> {
    return {
      maxConcurrentRequests: 10,
      rateLimitPerMinute: 60,
      allowedOperations: ['read', 'write', 'analyze'],
      restrictedOperations: ['delete', 'admin']
    };
  }

  private async getIndustryUIConfig(industry: string, userPersona: string): Promise<UIConfiguration> {
    return {
      theme: 'default',
      layout: 'standard',
      features: ['chat', 'analytics', 'tools'],
      customizations: {}
    };
  }

  private getManagementTools(): AITool[] {
    return [
      createAITool({
        name: 'strategic_planning',
        description: '战略规划和执行跟踪',
        execute: async () => ({ success: true, data: {} })
      }),
      createAITool({
        name: 'financial_analysis',
        description: '财务分析和报表生成',
        execute: async () => ({ success: true, data: {} })
      }),
      createAITool({
        name: 'kpi_tracking',
        description: '关键绩效指标跟踪',
        execute: async () => ({ success: true, data: {} })
      }),
      createAITool({
        name: 'resource_optimization',
        description: '资源优化和配置',
        execute: async () => ({ success: true, data: {} })
      })
    ];
  }

  private getManagementDataSources(): any[] {
    return [
      { type: 'database', name: 'financial_db' },
      { type: 'api', name: 'hr_system' },
      { type: 'file', name: 'kpi_reports' }
    ];
  }

  private getManagementMetrics(): any[] {
    return [
      { name: 'revenue_growth', target: 0.1 },
      { name: 'profit_margin', target: 0.15 },
      { name: 'customer_satisfaction', target: 0.9 },
      { name: 'employee_retention', target: 0.85 }
    ];
  }

  private getOperationsTools(): AITool[] {
    return [
      createAITool({
        name: 'system_monitoring',
        description: '系统监控和性能分析',
        execute: async () => ({ success: true, data: {} })
      }),
      createAITool({
        name: 'anomaly_detection',
        description: '异常检测和告警',
        execute: async () => ({ success: true, data: {} })
      }),
      createAITool({
        name: 'capacity_planning',
        description: '容量规划和资源预测',
        execute: async () => ({ success: true, data: {} })
      }),
      createAITool({
        name: 'incident_management',
        description: '事件管理和响应',
        execute: async () => ({ success: true, data: {} })
      })
    ];
  }

  private getOperationsDataSources(): any[] {
    return [
      { type: 'metrics', name: 'prometheus' },
      { type: 'logs', name: 'elasticsearch' },
      { type: 'traces', name: 'jaeger' }
    ];
  }

  private getOperationsMetrics(): any[] {
    return [
      { name: 'system_uptime', target: 0.999 },
      { name: 'response_time', target: 200 },
      { name: 'error_rate', target: 0.001 },
      { name: 'mttr', target: 30 }
    ];
  }
}

async function createAutonomousAIWidget(config: any): Promise<AIWidgetInstance> {
  return {
    sendMessage: async (message) => ({
      data: null,
      immediate_action_required: false
    }),
    registerTool: async (tool) => {}
  };
}

function createIndustryConfiguration(config: Partial<IndustryConfiguration>): IndustryConfiguration {
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
