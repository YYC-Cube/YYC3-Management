export interface AIWidgetInstance {
  sendMessage(message: any): Promise<any>;
  initialize(config: any): Promise<void>;
}

export interface ProjectManagementSystem {
  getCapabilities(): Promise<any>;
  getActiveProjects(): Promise<any>;
  getResourceData(): Promise<any>;
  getProjectData(projectId: string): Promise<any>;
  on(event: string, callback: (data: any) => void): void;
}

export interface AITool {
  name: string;
  description: string;
  parameters?: any;
  execute: (params: any) => Promise<any>;
}

export function createAutonomousAIWidget(config: any): Promise<AIWidgetInstance> {
  return Promise.resolve({
    sendMessage: async (message) => ({
      data: null,
      immediate_action_required: false
    }),
    initialize: async (config) => {}
  });
}

export function createAITool(tool: AITool): AITool {
  return tool;
}

export function createProjectManagementSystem(systemUrl: string, apiKey: string): ProjectManagementSystem {
  return {
    getCapabilities: async () => {
      return {
        project_management: true,
        resource_tracking: true,
        time_tracking: true,
        reporting: true,
        integrations: ['jira', 'github', 'slack']
      };
    },
    getActiveProjects: async () => {
      return [
        { id: 'proj1', name: 'Project A', status: 'active', progress: 75 },
        { id: 'proj2', name: 'Project B', status: 'active', progress: 45 },
        { id: 'proj3', name: 'Project C', status: 'active', progress: 90 }
      ];
    },
    getResourceData: async () => {
      return {
        total_resources: 50,
        available: 15,
        allocated: 35,
        utilization_rate: 0.70
      };
    },
    getProjectData: async (projectId: string) => {
      return {
        id: projectId,
        name: 'Sample Project',
        status: 'active',
        progress: 75,
        team_size: 10,
        budget: 100000,
        spent: 75000
      };
    },
    on: (event: string, callback: (data: any) => void) => {
      console.log(`[ProjectManagementSystem] Listening for event: ${event}`);
    }
  };
}
