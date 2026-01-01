export interface Agent {
  id: string;
  name: string;
  role: string;
  availability: string[];
  currentLevel?: string;
  skills?: string[];
  industry?: string;
}

export interface SkillAssessment {
  communicationSkills: number;
  productKnowledge: number;
  objectionHandling: number;
  closingAbility: number;
  emotionalIntelligence: number;
  overallLevel: string;
  gaps: string[];
}

export interface LearningPath {
  modules: LearningModule[];
  timeline: string;
  milestones: Milestone[];
  assessmentCheckpoints: AssessmentCheckpoint[];
  sequence?: LearningModule[];
  pace?: string;
}

export interface LearningModule {
  id: string;
  name: string;
  description: string;
  duration: number;
  skills: string[];
  prerequisites?: string[];
}

export interface Milestone {
  id: string;
  name: string;
  targetDate: string;
  criteria: string[];
}

export interface AssessmentCheckpoint {
  id: string;
  moduleIds: string[];
  scheduledDate: string;
  assessmentType: string;
}

export interface AgentCoachingPlan {
  agentProfile: Agent;
  currentSkillLevel: string;
  skillGaps: string[];
  learningPath: LearningPath;
  trainingPlan: TrainingPlan;
  performancePredictions: PerformancePrediction[];
  successMetrics: SuccessMetric[];
}

export interface TrainingPlan {
  id: string;
  agentId: string;
  modules: TrainingModule[];
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'completed';
}

export interface TrainingModule {
  id: string;
  name: string;
  type: string;
  duration: number;
  completionDate?: string;
  score?: number;
}

export interface PerformancePrediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string;
}

export interface SuccessMetric {
  name: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
}

export interface CallSession {
  id: string;
  agentId: string;
  customerId: string;
  startTime: string;
  status: 'active' | 'completed' | 'paused';
  transcript?: string[];
}

export interface RealTimeCoaching {
  immediateFeedback: string[];
  suggestedImprovements: string[];
  skillReinforcement: string[];
  confidenceBoosters: string[];
}

export interface CallAnalysis {
  sentiment: number;
  keyPhrases: string[];
  potentialIssues: string[];
  strengths: string[];
}

export interface TrainingContent {
  id: string;
  title: string;
  type: 'video' | 'document' | 'interactive' | 'simulation';
  content: string;
  duration?: number;
  skills: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic?: string;
  complexity?: number;
  keyConcepts?: string[];
  theoreticalKnowledge?: string;
  practicalExercises?: string;
  caseStudies?: string;
  assessmentTests?: string;
  interactiveSimulations?: string;
}

export interface PersonalizedContent extends TrainingContent {
  adaptations: ContentAdaptation[];
  learningStyle: string;
  estimatedCompletionTime: number;
  examples?: string[];
  pacing?: string;
  reinforcementActivities?: string[];
}

export interface ContentAdaptation {
  type: string;
  description: string;
  applied: boolean;
}

export interface ContentAnalyzer {
  analyze(content: TrainingContent): Promise<ContentAnalysis>;
}

export interface ContentAnalysis {
  complexity: number;
  topics: string[];
  skills: string[];
  suggestedAdaptations: ContentAdaptation[];
}

export interface PersonalizationEngine {
  personalize(content: TrainingContent, agent: Agent): Promise<PersonalizedContent>;
  getLearningStyle(agent: Agent): Promise<string>;
  getKnowledgeLevel(agent: Agent): Promise<number>;
}

export class SkillAssessor {
  async assess(agent: Agent): Promise<SkillAssessment> {
    return {
      communicationSkills: 70,
      productKnowledge: 65,
      objectionHandling: 60,
      closingAbility: 55,
      emotionalIntelligence: 75,
      overallLevel: 'intermediate',
      gaps: ['closing_techniques', 'advanced_negotiation']
    };
  }
}

export class LearningPathGenerator {
  async generate(assessment: SkillAssessment, agent: Agent): Promise<LearningPath> {
    return {
      modules: [],
      timeline: '8 weeks',
      milestones: [],
      assessmentCheckpoints: []
    };
  }
}

export class PerformancePredictor {
  async predict(plan: TrainingPlan): Promise<PerformancePrediction[]> {
    return [];
  }
}

export interface LearningPlan {
  agent?: Agent;
  currentLevel?: string;
  targetLevel?: string;
  skillGaps?: SkillGap[];
  learningPath?: LearningPath;
  successMetrics?: SuccessMetric[];
  supportResources?: any;
  modules?: LearningModule[];
  sequence?: LearningModule[];
  pace?: string;
  assessments?: AssessmentCheckpoint[];
  adaptations?: any[];
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
}

export interface MicroLearningSystem {
  delivery: {
    biteSizedContent: boolean;
    mobileOptimized: boolean;
    justInTime: boolean;
  };
  reinforcement: {
    spacedRepetition: boolean;
    practiceExercises: boolean;
    realApplication: boolean;
  };
  engagement: {
    gamification: boolean;
    socialLearning: boolean;
    progressTracking: boolean;
  };
}

export interface CompetencyMapper {
  mapCompetencies(skills: string[]): Promise<Competency[]>;
  assessCompetencyLevel(skill: string, agent: Agent): Promise<number>;
}

export interface Competency {
  name: string;
  level: number;
  category: string;
}

export interface AdaptiveLearning {
  adaptContent(content: TrainingContent, agent: Agent): Promise<PersonalizedContent>;
  adjustPace(agent: Agent, performance: number): Promise<string>;
  recommendNextModule(agent: Agent, currentModule: LearningModule): Promise<LearningModule>;
}

export interface SkillGapAnalyzer {
  analyzeGaps(current: Competency[], target: Competency[]): Promise<SkillGap[]>;
  prioritizeGaps(gaps: SkillGap[], agent: Agent): Promise<SkillGap[]>;
  suggestRemediation(gap: SkillGap): Promise<LearningModule[]>;
}

export interface PerformanceMonitor {
  monitorCall(session: CallSession): Promise<RealTimeAnalysis>;
  trackPerformance(agentId: string): Promise<PerformanceHistory>;
  identifyPatterns(history: PerformanceHistory): Promise<string[]>;
}

export interface FeedbackGenerator {
  generateFeedback(analysis: RealTimeAnalysis): Promise<CoachingFeedback>;
  determineTone(analysis: RealTimeAnalysis): Promise<string>;
  createActionableInsights(analysis: RealTimeAnalysis): Promise<string[]>;
}

export interface ImprovementPredictor {
  predictImprovement(agent: Agent, plan: ImprovementPlan): Promise<number>;
  estimateTimeToGoal(agent: Agent, goal: string): Promise<number>;
  identifyKeyDrivers(agent: Agent): Promise<string[]>;
}

export interface RealTimeCoachingSession {
  session: CallSession;
  analysis: RealTimeAnalysis;
  feedback: CoachingFeedback;
  development: SkillDevelopment;
  actions: RealTimeAction[];
}

export interface RealTimeAnalysis {
  sentiment: number;
  engagement: number;
  keyPhrases: string[];
  potentialIssues: string[];
  strengths: string[];
  skillIndicators: SkillIndicator[];
  performanceMetrics: PerformanceMetric[];
}

export interface SkillIndicator {
  skill: string;
  level: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  status: 'on_track' | 'needs_attention' | 'critical';
}

export interface CoachingFeedback {
  strengths: string[];
  improvements: string[];
  immediateActions: string[];
  longTermDevelopment: string[];
  tone?: string;
  actionableInsights?: string[];
}

export interface SkillDevelopment {
  currentSkills: string[];
  targetSkills: string[];
  skillGaps: string[];
  recommendedModules: LearningModule[];
  estimatedTimeframe: string;
}

export interface RealTimeAction {
  type: 'suggestion' | 'correction' | 'reinforcement';
  priority: 'high' | 'medium' | 'low';
  message: string;
  timing: 'immediate' | 'post_call';
}

export interface ImprovementPlan {
  agent: Agent;
  currentState: CurrentState;
  goals: ImprovementGoal[];
  actionPlan: ActionPlan;
  support: SupportResources;
  measurement: ProgressMeasurement;
}

export interface CurrentState {
  performance: PerformanceSnapshot;
  skills: SkillAssessment;
  challenges: string[];
}

export interface PerformanceSnapshot {
  overallScore: number;
  keyMetrics: Record<string, number>;
  trends: Record<string, string>;
  benchmarks: Record<string, number>;
}

export interface PerformanceHistory {
  current: PerformanceSnapshot;
  historical: PerformanceSnapshot[];
  trends: Record<string, 'improving' | 'stable' | 'declining'>;
  patterns: string[];
}

export interface ImprovementGoal {
  id: string;
  name: string;
  description: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface ActionPlan {
  shortTermActions: Action[];
  mediumTermActions: Action[];
  longTermActions: Action[];
  milestones: Milestone[];
}

export interface Action {
  id: string;
  description: string;
  type: string;
  deadline: string;
  responsible: string;
  status: 'not_started' | 'in_progress' | 'completed';
  dependencies?: string[];
}

export interface SupportResources {
  trainingModules: LearningModule[];
  coachingSessions: CoachingSession[];
  mentorship: MentorshipInfo;
  tools: string[];
}

export interface CoachingSession {
  id: string;
  type: string;
  scheduledDate: string;
  duration: number;
  topics: string[];
}

export interface MentorshipInfo {
  mentor?: Agent;
  schedule: string[];
  focusAreas: string[];
}

export interface ProgressMeasurement {
  metrics: PerformanceMetric[];
  assessmentSchedule: AssessmentSchedule[];
  successCriteria: SuccessCriteria;
}

export interface AssessmentSchedule {
  type: string;
  frequency: string;
  nextDate: string;
  criteria: string[];
}

export interface SuccessCriteria {
  quantitative: Record<string, number>;
  qualitative: string[];
  timeline: string;
}

export interface AdaptiveLearningExperience {
  startingPoint: AssessmentResult;
  learningPath: AdaptiveLearningPath;
  contentDelivery: ContentDeliveryConfig;
  progressTracking: ProgressTrackingConfig;
  dynamicAdjustment: DynamicAdjustmentConfig;
}

export interface AssessmentResult {
  currentLevel: number;
  strengths: string[];
  weaknesses: string[];
  recommendedStartingPoint: string;
}

export interface AdaptiveLearningPath {
  modules: LearningModule[];
  sequence: string[];
  adaptivePoints: string[];
  milestones: Milestone[];
}

export interface ContentDeliveryConfig {
  format: string;
  frequency: string;
  personalizationLevel: number;
  interactiveElements: boolean;
}

export interface ProgressTrackingConfig {
  metrics: string[];
  checkpoints: AssessmentCheckpoint[];
  feedbackFrequency: string;
  adaptationTriggers: string[];
}

export interface DynamicAdjustmentConfig {
  enabled: boolean;
  adjustmentCriteria: string[];
  adaptationThreshold: number;
  realTimeAdjustment: boolean;
}
