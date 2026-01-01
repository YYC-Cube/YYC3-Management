import { IndustryAdapter } from '../industries/IndustryAdapter';
import { ProjectManagementIntegration } from '../industries/project-management/ProjectManagementIntegration';
import { NotificationIntegration } from '../industries/notification-system/NotificationIntegration';
import { DevOpsAIAssistant } from '../industries/operations-analysis/DevOpsAIAssistant';
import {
  QuickStartConfig,
  AIWidgetInstance,
  IntegrationResult,
  PersonaConfig,
  AutonomousAIWidgetConfig
} from './types';

export class QuickStartTemplate {
  static async createIndustryAI(industry: string, config: QuickStartConfig): Promise<AIWidgetInstance> {
    const industryAdapter = new IndustryAdapter();
    
    const baseConfig: AutonomousAIWidgetConfig = {
      apiType: config.apiType || 'internal',
      modelName: config.modelName || 'yyc3-default',
      enableLearning: true,
      enableMemory: true
    };
    
    const industryConfig = await industryAdapter.getIndustryConfig(industry);
    
    const personaConfig = await this.getPersonaConfig(config.userRole);
    
    return createAutonomousAIWidget({
      ...baseConfig,
      businessContext: {
        ...industryConfig.businessContext,
        ...personaConfig.businessContext,
        deploymentEnvironment: config.environment,
        integrationPoints: config.integrations
      }
    });
  }
  
  static async getPersonaConfig(userRole?: string): Promise<PersonaConfig> {
    return {
      role: userRole || 'user',
      capabilities: [],
      preferences: [],
      businessContext: {
        userRole: userRole || 'user'
      }
    };
  }
  
  static async integrateWithExistingSystem(systemType: string, connectionConfig: any): Promise<IntegrationResult> {
    try {
      switch (systemType) {
        case 'project_management':
          const pmIntegration = new ProjectManagementIntegration();
          await pmIntegration.integrateWithProjectSystem(
            connectionConfig.url, 
            connectionConfig.apiKey
          );
          return {
            success: true,
            message: '项目管理系统集成成功',
            data: { systemType, url: connectionConfig.url }
          };
          
        case 'notification_system':
          const notificationIntegration = new NotificationIntegration();
          await notificationIntegration.integrateWithNotificationSystem(
            connectionConfig.url
          );
          return {
            success: true,
            message: '通知系统集成成功',
            data: { systemType, url: connectionConfig.url }
          };
          
        case 'monitoring_system':
          const devopsAI = new DevOpsAIAssistant();
          await devopsAI.initialize(connectionConfig);
          return {
            success: true,
            message: '监控系统集成成功',
            data: { systemType, config: connectionConfig }
          };
          
        default:
          throw new Error(`不支持的集成类型: ${systemType}`);
      }
    } catch (error) {
      return {
        success: false,
        message: `集成失败: ${error instanceof Error ? error.message : String(error)}`,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

async function createAutonomousAIWidget(config: AutonomousAIWidgetConfig): Promise<AIWidgetInstance> {
  return {
    sendMessage: async (message) => ({
      data: null,
      immediate_action_required: false
    }),
    registerTool: async (tool) => {}
  };
}