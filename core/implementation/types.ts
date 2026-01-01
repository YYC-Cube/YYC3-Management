export interface PhasedValueDelivery {
  phase1: ValuePhase;
  phase2: ValuePhase;
  phase3: ValuePhase;
  continuous: ValuePhase;
}

export interface ValuePhase {
  focus: string;
  timeline: string;
  valueDrivers: ValueDrivers;
  successMetrics: any[];
  deliverables?: any[];
  optimizationCycles?: any[];
}

export interface ValueDrivers {
  efficiency: Record<string, string>;
  quality: Record<string, string>;
  cost: Record<string, string>;
}
