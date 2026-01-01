export interface ImplementationRoadmap {
  phase1: ImplementationPhase;
  phase2: ImplementationPhase;
  phase3: ImplementationPhase;
  optimization: ImplementationPhase;
}

export interface ImplementationPhase {
  name: string;
  duration: string;
  focus: string[];
  deliverables: string[];
  successCriteria: string[];
}

export interface ScalingStrategy {
  technicalScaling: TechnicalScaling;
  functionalScaling: FunctionalScaling;
  organizationalScaling: OrganizationalScaling;
}

export interface TechnicalScaling {
  infrastructure: any;
  performance: any;
  reliability: any;
}

export interface FunctionalScaling {
  userGrowth: any;
  featureExpansion: any;
  integrationExpansion: any;
}

export interface OrganizationalScaling {
  teamStructure: any;
  processes: any;
  training: any;
}
