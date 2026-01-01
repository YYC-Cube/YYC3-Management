export interface ProcessAutomator {
  automateProcess(processId: string): Promise<any>;
  optimizeWorkflow(workflowId: string): Promise<any>;
  monitorProcessStatus(processId: string): Promise<any>;
}

export interface ApprovalOptimizer {
  optimizeRouting(approvalId: string): Promise<any>;
  managePriorities(approvalId: string): Promise<any>;
  monitorSLAs(approvalId: string): Promise<any>;
}

export interface IntelligentOA {
  smartApproval: {
    routingOptimization: any;
    priorityManagement: any;
    slaMonitoring: any;
  };
  processIntelligence: {
    bottleneckIdentification: any;
    efficiencyAnalysis: any;
    improvementRecommendations: any;
  };
  documentAI: {
    intelligentClassification: any;
    contentExtraction: any;
    validationAutomation: any;
  };
  mobileOA: {
    offlineCapabilities: any;
    pushOptimization: any;
    mobileWorkflow: any;
  };
}
