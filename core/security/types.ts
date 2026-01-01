export interface ThreatDetector {
  detectThreats(): Promise<ThreatDetectionResult>;
  analyzeThreatPatterns(): Promise<ThreatPattern[]>;
  assessThreatLevel(threat: Threat): Promise<number>;
  respondToThreat(threat: Threat): Promise<void>;
}

export interface ComplianceManager {
  ensureCompliance(): Promise<ComplianceStatus>;
  generateComplianceReport(): Promise<ComplianceReport>;
  auditCompliance(): Promise<AuditResult>;
  remediateComplianceIssues(issues: ComplianceIssue[]): Promise<void>;
}

export interface EnterpriseSecurity {
  dataSecurity: {
    encryption: EncryptionConfig;
    accessControl: AccessControlConfig;
    dataMasking: DataMaskingConfig;
    auditTrail: AuditConfig;
  };
  applicationSecurity: {
    vulnerabilityManagement: VulnerabilityManagement;
    secureDevelopment: SecureDevelopment;
    penetrationTesting: PenetrationTesting;
    securityMonitoring: SecurityMonitoring;
  };
  compliance: {
    regulatoryCompliance: RegulatoryCompliance;
    dataPrivacy: DataPrivacy;
    industryStandards: IndustryStandards;
    certificationManagement: CertificationManagement;
  };
  businessContinuity: {
    disasterRecovery: DisasterRecovery;
    backupStrategy: BackupStrategy;
    highAvailability: HighAvailability;
    incidentResponse: IncidentResponse;
  };
}

export interface ThreatDetectionResult {
  threats: Threat[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  timestamp: Date;
}

export interface Threat {
  id: string;
  type: string;
  severity: number;
  source: string;
  description: string;
  affectedAssets: string[];
  detectedAt: Date;
}

export interface ThreatPattern {
  pattern: string;
  frequency: number;
  riskLevel: number;
  mitigationStrategy: string;
}

export interface ComplianceStatus {
  compliant: boolean;
  complianceLevel: number;
  issues: ComplianceIssue[];
  lastAudit: Date;
}

export interface ComplianceIssue {
  id: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  remediationSteps: string[];
  dueDate: Date;
}

export interface ComplianceReport {
  reportId: string;
  generatedAt: Date;
  overallCompliance: number;
  categoryCompliance: Record<string, number>;
  findings: ComplianceIssue[];
  recommendations: string[];
}

export interface AuditResult {
  auditId: string;
  auditedAt: Date;
  auditor: string;
  findings: AuditFinding[];
  overallScore: number;
  recommendations: string[];
}

export interface AuditFinding {
  id: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: string[];
  remediationRequired: boolean;
}

export interface EncryptionConfig {
  enabled: boolean;
  algorithm: string;
  keyLength: number;
  encryptionAtRest: boolean;
  encryptionInTransit: boolean;
}

export interface AccessControlConfig {
  enabled: boolean;
  model: 'rbac' | 'abac' | 'pbac';
  roles: string[];
  permissions: Record<string, string[]>;
  mfaEnabled: boolean;
}

export interface DataMaskingConfig {
  enabled: boolean;
  maskingRules: MaskingRule[];
  exceptions: string[];
  auditLogging: boolean;
}

export interface MaskingRule {
  id: string;
  field: string;
  maskingType: 'partial' | 'full' | 'hash' | 'custom';
  pattern?: string;
  roles: string[];
}

export interface AuditConfig {
  enabled: boolean;
  logLevel: 'basic' | 'detailed' | 'comprehensive';
  retentionDays: number;
  alertThresholds: Record<string, number>;
  realTimeMonitoring: boolean;
}

export interface VulnerabilityManagement {
  scanningFrequency: string;
  severityThreshold: number;
  autoRemediation: boolean;
  vulnerabilityCount: number;
  lastScan: Date;
}

export interface SecureDevelopment {
  codeReviewRequired: boolean;
  securityTestingRequired: boolean;
  dependencyScanning: boolean;
  sastEnabled: boolean;
  dastEnabled: boolean;
}

export interface PenetrationTesting {
  frequency: string;
  lastTest: Date;
  nextTest: Date;
  coverage: string[];
  findingsCount: number;
}

export interface SecurityMonitoring {
  enabled: boolean;
  realTimeAlerts: boolean;
  monitoringScope: string[];
  alertChannels: string[];
  incidentResponseTime: number;
}

export interface RegulatoryCompliance {
  frameworks: string[];
  compliantFrameworks: string[];
  nonCompliantFrameworks: string[];
  lastAssessment: Date;
}

export interface DataPrivacy {
  gdprCompliant: boolean;
  ccpaCompliant: boolean;
  dataRetentionPolicy: string;
  dataBreachProtocol: string;
  consentManagement: boolean;
}

export interface IndustryStandards {
  standards: string[];
  certifications: string[];
  lastAudit: Date;
  nextAudit: Date;
}

export interface CertificationManagement {
  activeCertifications: Certification[];
  pendingCertifications: Certification[];
  expiredCertifications: Certification[];
  renewalReminders: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuedDate: Date;
  expiryDate: Date;
  status: 'active' | 'pending' | 'expired';
}

export interface DisasterRecovery {
  enabled: boolean;
  recoveryTimeObjective: number;
  recoveryPointObjective: number;
  disasterRecoveryPlan: string;
  lastTest: Date;
}

export interface BackupStrategy {
  enabled: boolean;
  backupFrequency: string;
  backupRetention: string;
  backupLocation: string;
  encryptionEnabled: boolean;
}

export interface HighAvailability {
  enabled: boolean;
  availabilityTarget: number;
  failoverMechanism: string;
  loadBalancing: boolean;
  redundancyLevel: string;
}

export interface IncidentResponse {
  enabled: boolean;
  responseTeam: string[];
  escalationPolicy: string;
  communicationPlan: string;
  averageResponseTime: number;
}
