// integrations/project-management/ProjectManagementIntegration.ts
import {
  AIWidgetInstance,
  ProjectManagementSystem,
  AITool,
  createAutonomousAIWidget,
  createAITool,
  createProjectManagementSystem
} from './types';

export class ProjectManagementIntegration {
  private aiWidget: AIWidgetInstance | null = null;
  private projectSystem: ProjectManagementSystem | null = null;

  async integrateWithProjectSystem(systemUrl: string, apiKey: string): Promise<void> {
    this.projectSystem = createProjectManagementSystem(systemUrl, apiKey);

    const capabilities = await this.projectSystem.getCapabilities();

    this.aiWidget = await createAutonomousAIWidget({
      apiType: 'internal',
      modelName: 'yyc3-project-management',
      businessContext: {
        industry: 'project_management',
        userRole: 'project_manager',
        systemIntegration: {
          type: 'project_management',
          url: systemUrl,
          capabilities: capabilities
        }
      },
      customTools: await this.createProjectManagementTools()
    });

    await this.setupRealTimeUpdates();
  }

  private async createProjectManagementTools(): Promise<AITool[]> {
    const projectSystem = this.projectSystem;

    return [
      createAITool({
        name: 'project_health_monitoring',
        description: '监控项目健康度和风险',
        execute: async () => {
          if (!projectSystem) {
            throw new Error('ProjectManagementSystem not initialized');
          }
          const projects = await projectSystem.getActiveProjects();
          const healthScores = await this.calculateProjectHealth(projects);
          const risks = await this.identifyProjectRisks(projects);

          return {
            success: true,
            project_health: healthScores,
            identified_risks: risks,
            recommendations: await this.generateRiskMitigation(risks)
          };
        }
      }),

      createAITool({
        name: 'resource_optimization',
        description: '优化项目资源分配',
        parameters: {
          type: 'object',
          properties: {
            optimization_goal: {
              type: 'string',
              enum: ['cost_reduction', 'time_optimization', 'quality_improvement'],
              description: '优化目标'
            },
            constraints: { type: 'object', description: '约束条件' }
          },
          required: ['optimization_goal']
        },
        execute: async (params) => {
          if (!projectSystem) {
            throw new Error('ProjectManagementSystem not initialized');
          }
          const resourceData = await projectSystem.getResourceData();
          const allocation = await this.optimizeResourceAllocation(resourceData, params);

          return {
            success: true,
            optimized_allocation: allocation,
            expected_benefits: await this.calculateBenefits(allocation),
            implementation_plan: await this.createImplementationPlan(allocation)
          };
        }
      }),

      createAITool({
        name: 'progress_prediction',
        description: '预测项目进度和交付日期',
        parameters: {
          type: 'object',
          properties: {
            project_id: { type: 'string', description: '项目ID' },
            confidence_level: { type: 'number', description: '置信水平', default: 0.95 }
          },
          required: ['project_id']
        },
        execute: async (params) => {
          if (!projectSystem) {
            throw new Error('ProjectManagementSystem not initialized');
          }
          const projectData = await projectSystem.getProjectData(params.project_id);
          const historicalData = await this.getHistoricalPerformance();

          const prediction = await this.predictProjectProgress(projectData, historicalData, params.confidence_level);

          return {
            success: true,
            predicted_completion: prediction.completionDate,
            confidence_interval: prediction.confidenceInterval,
            critical_path: prediction.criticalPath,
            risk_factors: prediction.riskFactors
          };
        }
      })
    ];
  }

  async setupRealTimeUpdates(): Promise<void> {
    if (!this.projectSystem || !this.aiWidget) {
      throw new Error('ProjectManagementIntegration not initialized');
    }

    const aiWidget = this.aiWidget;

    this.projectSystem.on('project_updated', async (project) => {
      await aiWidget.sendMessage({
        type: 'system_event',
        event: 'project_updated',
        data: project,
        action_required: await this.requiresAction(project)
      });
    });

    this.projectSystem.on('risk_identified', async (risk) => {
      const analysis = await this.analyzeRiskImpact(risk);
      await aiWidget.sendMessage({
        type: 'alert',
        severity: analysis.severity,
        message: `识别到项目风险: ${risk.description}`,
        recommended_actions: analysis.mitigationStrategies
      });
    });
  }

  private async calculateProjectHealth(projects: any[]): Promise<any> {
    return projects.map(project => ({
      project_id: project.id,
      health_score: 85,
      status: 'on_track',
      metrics: {
        progress: 0.75,
        budget_utilization: 0.80,
        resource_utilization: 0.85
      }
    }));
  }

  private async identifyProjectRisks(projects: any[]): Promise<any[]> {
    return [];
  }

  private async generateRiskMitigation(risks: any[]): Promise<string[]> {
    return [];
  }

  private async optimizeResourceAllocation(resourceData: any, params: any): Promise<any> {
    return {
      allocation: [],
      efficiency_improvement: 0.15,
      cost_savings: 5000
    };
  }

  private async calculateBenefits(allocation: any): Promise<any> {
    return {
      time_savings: 20,
      cost_savings: 10000,
      quality_improvement: 0.10
    };
  }

  private async createImplementationPlan(allocation: any): Promise<any> {
    return {
      phases: [],
      timeline: '30 days',
      resources_required: []
    };
  }

  private async getHistoricalPerformance(): Promise<any> {
    return {
      average_completion_rate: 0.85,
      average_budget_variance: 0.05,
      average_time_variance: 0.10
    };
  }

  private async predictProjectProgress(projectData: any, historicalData: any, confidenceLevel: number): Promise<any> {
    return {
      completionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      confidenceInterval: {
        lower: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        upper: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
      },
      criticalPath: [],
      riskFactors: []
    };
  }

  private async requiresAction(project: any): Promise<boolean> {
    return false;
  }

  private async analyzeRiskImpact(risk: any): Promise<any> {
    return {
      severity: 'medium',
      probability: 0.5,
      impact: 'moderate',
      mitigationStrategies: []
    };
  }
}
