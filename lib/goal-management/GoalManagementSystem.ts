/**
 * YYC³ 目标管理系统
 * 
 * @description 完整的目标生命周期管理系统，支持目标创建、规划、执行、监控、调整、完成、评估和学习8个阶段
 * @version 1.1.0
 * @date 2025-01-XX
 * 
 * @features
 * - 目标生命周期管理（8阶段）
 * - OKR框架支持
 * - SMART目标验证
 * - 依赖关系分析
 * - 进度追踪与里程碑管理
 * - 风险识别与缓解
 * - 价值评估与ROI分析
 * - 协作与对齐检查
 * 
 * @author YYC³ Team
 */

import { EventEmitter } from 'events';

// ============ 类型定义 ============

export interface GoalInput {
  title: string;
  description: string;
  category: 'business' | 'technical' | 'operational' | 'strategic';
  priority: 1 | 2 | 3 | 4 | 5; // 1最低，5最高
  deadline?: Date;
  owner: string;
  stakeholders?: string[];
  kpis?: KPI[];
  resources?: ResourceRequirement[];
}

export interface KPI {
  name: string;
  target: number;
  current: number;
  unit: string;
  measurementMethod: string;
}

export interface ResourceRequirement {
  type: 'human' | 'budget' | 'time' | 'technology';
  amount: number;
  description: string;
}

export interface Goal {
  id: string;
  input: GoalInput;
  status: 'draft' | 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  
  // SMART验证
  smart: SMARTValidation;
  
  // OKR结构
  okr?: {
    objective: string;
    keyResults: KeyResult[];
  };
  
  // 执行计划
  plan?: ExecutionPlan;
  
  // 进度追踪
  progress: Progress;
  
  // 风险管理
  risks: Risk[];
  
  // 价值指标
  value: ValueMetrics;
}

export interface SMARTValidation {
  specific: { valid: boolean; score: number; feedback: string };
  measurable: { valid: boolean; score: number; feedback: string };
  achievable: { valid: boolean; score: number; feedback: string };
  relevant: { valid: boolean; score: number; feedback: string };
  timeBound: { valid: boolean; score: number; feedback: string };
  overallScore: number;
  isValid: boolean;
}

export interface KeyResult {
  id: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  weight: number; // 权重（0-1）
  status: 'not-started' | 'in-progress' | 'completed' | 'failed';
}

export interface ExecutionPlan {
  milestones: Milestone[];
  tasks: Task[];
  dependencies: Dependency[];
  timeline: Timeline;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  completed: boolean;
  completedDate?: Date;
  criteria: string[];
}

export interface Task {
  id: string;
  name: string;
  description: string;
  assignee: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: number;
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
  blockers?: string[];
}

export interface Dependency {
  from: string;
  to: string;
  type: 'blocks' | 'relates' | 'duplicates';
}

export interface Timeline {
  startDate: Date;
  endDate: Date;
  phases: Phase[];
}

export interface Phase {
  name: string;
  startDate: Date;
  endDate: Date;
  deliverables: string[];
}

export interface Progress {
  percentage: number;
  completedMilestones: number;
  totalMilestones: number;
  completedTasks: number;
  totalTasks: number;
  onTrack: boolean;
  delayDays?: number;
  velocity: number; // 任务完成速度（任务/天）
}

export interface Risk {
  id: string;
  description: string;
  probability: number; // 0-1
  impact: number; // 0-1
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
  status: 'identified' | 'mitigated' | 'occurred' | 'resolved';
}

export interface ValueMetrics {
  businessValue: number; // 0-100
  technicalValue: number; // 0-100
  userValue: number; // 0-100
  roi: number; // 投资回报率
  costSaved?: number;
  revenueGenerated?: number;
  efficiencyGain?: number;
}

export interface GoalLifecycle {
  creation: CreationResult;
  planning: PlanningResult;
  execution: ExecutionResult;
  monitoring: MonitoringResult;
  adjustment: AdjustmentResult;
  completion: CompletionResult;
  evaluation: EvaluationResult;
  learning: LearningResult;
}

export interface CreationResult {
  goal: Goal;
  validation: SMARTValidation;
  suggestions: string[];
}

export interface PlanningResult {
  plan: ExecutionPlan;
  feasibility: number; // 0-1
  recommendations: string[];
}

export interface ExecutionResult {
  tasksStarted: number;
  progressMade: number;
  issues: string[];
}

export interface MonitoringResult {
  currentProgress: Progress;
  alerts: Alert[];
  recommendations: string[];
}

export interface Alert {
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

export interface AdjustmentResult {
  adjustmentsMade: Adjustment[];
  updatedPlan: ExecutionPlan;
}

export interface Adjustment {
  type: 'scope' | 'timeline' | 'resources' | 'priority';
  reason: string;
  impact: string;
}

export interface CompletionResult {
  completedAt: Date;
  finalProgress: Progress;
  achievements: string[];
}

export interface EvaluationResult {
  valueDelivered: ValueMetrics;
  lessonsLearned: string[];
  successRate: number;
}

export interface LearningResult {
  patterns: Pattern[];
  bestPractices: string[];
  improvements: string[];
}

export interface Pattern {
  name: string;
  description: string;
  frequency: number;
  effectiveness: number;
}

export interface GoalManagementConfig {
  enableAutoAdjustment?: boolean;
  riskThreshold?: number;
  progressCheckInterval?: number; // 毫秒
  enableCollaboration?: boolean;
}

// ============ 核心实现 ============

export class GoalManagementSystem extends EventEmitter {
  private goals: Map<string, Goal> = new Map();
  private config: Required<GoalManagementConfig>;
  private progressCheckTimer?: NodeJS.Timeout;
  
  // 统计数据
  private stats = {
    totalGoals: 0,
    completedGoals: 0,
    activeGoals: 0,
    averageCompletionTime: 0,
    successRate: 0,
  };

  constructor(config: GoalManagementConfig = {}) {
    super();
    
    this.config = {
      enableAutoAdjustment: config.enableAutoAdjustment ?? true,
      riskThreshold: config.riskThreshold ?? 0.7,
      progressCheckInterval: config.progressCheckInterval ?? 3600000, // 1小时
      enableCollaboration: config.enableCollaboration ?? true,
    };
  }

  /**
   * 完整的目标生命周期管理
   */
  async manageGoalLifecycle(goalInput: GoalInput): Promise<GoalLifecycle> {
    console.log(`[GoalManagement] 开始管理目标生命周期: ${goalInput.title}`);

    // 1. 目标创建阶段
    const creation = await this.createGoal(goalInput);
    this.emit('goal:created', { goalId: creation.goal.id, goal: creation.goal });

    // 2. 规划阶段
    const planning = await this.planGoalExecution(creation.goal);
    this.emit('goal:planned', { goalId: creation.goal.id, plan: planning.plan });

    // 3. 执行阶段
    const execution = await this.executeGoal(creation.goal);
    this.emit('goal:executing', { goalId: creation.goal.id, progress: execution.progressMade });

    // 4. 监控阶段
    const monitoring = await this.monitorGoalProgress(creation.goal);
    this.emit('goal:monitored', { goalId: creation.goal.id, status: monitoring.currentProgress });

    // 5. 调整阶段
    const adjustment = await this.adjustGoalStrategy(creation.goal, monitoring);
    if (adjustment.adjustmentsMade.length > 0) {
      this.emit('goal:adjusted', { goalId: creation.goal.id, adjustments: adjustment.adjustmentsMade });
    }

    // 6. 完成阶段
    const completion = await this.completeGoal(creation.goal);
    this.emit('goal:completed', { goalId: creation.goal.id, result: completion });

    // 7. 评估阶段
    const evaluation = await this.evaluateGoalValue(creation.goal);
    this.emit('goal:evaluated', { goalId: creation.goal.id, evaluation });

    // 8. 学习阶段
    const learning = await this.learnFromGoal(creation.goal, evaluation);
    this.emit('goal:learned', { goalId: creation.goal.id, learning });

    return {
      creation,
      planning,
      execution,
      monitoring,
      adjustment,
      completion,
      evaluation,
      learning,
    };
  }

  /**
   * 阶段1: 创建目标
   */
  private async createGoal(input: GoalInput): Promise<CreationResult> {
    const goal: Goal = {
      id: this.generateGoalId(),
      input,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      smart: this.validateSMART(input),
      progress: {
        percentage: 0,
        completedMilestones: 0,
        totalMilestones: 0,
        completedTasks: 0,
        totalTasks: 0,
        onTrack: true,
        velocity: 0,
      },
      risks: [],
      value: {
        businessValue: 0,
        technicalValue: 0,
        userValue: 0,
        roi: 0,
      },
    };

    // 生成OKR结构
    if (input.kpis && input.kpis.length > 0) {
      goal.okr = {
        objective: input.title,
        keyResults: input.kpis.map((kpi, index) => ({
          id: `kr-${index + 1}`,
          description: kpi.name,
          target: kpi.target,
          current: kpi.current,
          unit: kpi.unit,
          weight: 1 / (input.kpis?.length || 1),
          status: 'not-started',
        })),
      };
    }

    this.goals.set(goal.id, goal);
    this.stats.totalGoals++;
    this.stats.activeGoals++;

    const suggestions = this.generateGoalSuggestions(goal);

    return {
      goal,
      validation: goal.smart,
      suggestions,
    };
  }

  /**
   * 阶段2: 规划执行
   */
  private async planGoalExecution(goal: Goal): Promise<PlanningResult> {
    const plan: ExecutionPlan = {
      milestones: this.generateMilestones(goal),
      tasks: this.decomposeTasks(goal),
      dependencies: this.analyzeDependencies(goal),
      timeline: this.createTimeline(goal),
    };

    goal.plan = plan;
    goal.status = 'planned';
    goal.updatedAt = new Date();
    
    // 更新进度统计
    goal.progress.totalMilestones = plan.milestones.length;
    goal.progress.totalTasks = plan.tasks.length;

    const feasibility = this.assessFeasibility(goal, plan);
    const recommendations = this.generatePlanningRecommendations(goal, plan, feasibility);

    return {
      plan,
      feasibility,
      recommendations,
    };
  }

  /**
   * 阶段3: 执行目标
   */
  private async executeGoal(goal: Goal): Promise<ExecutionResult> {
    goal.status = 'active';
    goal.updatedAt = new Date();

    // 启动任务
    const tasksStarted = goal.plan?.tasks.filter(t => t.status === 'pending').length || 0;
    
    // 模拟进度
    const progressMade = Math.random() * 20 + 10; // 10-30%
    goal.progress.percentage = progressMade;

    // 识别风险
    goal.risks = await this.identifyRisks(goal);

    const issues: string[] = [];
    if (goal.risks.some(r => r.severity === 'critical')) {
      issues.push('检测到关键风险，需要立即关注');
    }

    return {
      tasksStarted,
      progressMade,
      issues,
    };
  }

  /**
   * 阶段4: 监控进度
   */
  private async monitorGoalProgress(goal: Goal): Promise<MonitoringResult> {
    // 更新进度
    const progress = this.calculateProgress(goal);
    goal.progress = progress;

    // 生成告警
    const alerts: Alert[] = [];
    
    if (!progress.onTrack && progress.delayDays && progress.delayDays > 3) {
      alerts.push({
        level: 'warning',
        message: `目标进度落后${progress.delayDays}天`,
        timestamp: new Date(),
      });
    }

    if (goal.risks.some(r => r.severity === 'critical' && r.status === 'identified')) {
      alerts.push({
        level: 'error',
        message: '存在未缓解的关键风险',
        timestamp: new Date(),
      });
    }

    const recommendations = this.generateMonitoringRecommendations(goal, progress, alerts);

    return {
      currentProgress: progress,
      alerts,
      recommendations,
    };
  }

  /**
   * 阶段5: 调整策略
   */
  private async adjustGoalStrategy(goal: Goal, monitoring: MonitoringResult): Promise<AdjustmentResult> {
    const adjustmentsMade: Adjustment[] = [];

    if (!this.config.enableAutoAdjustment) {
      return { adjustmentsMade, updatedPlan: goal.plan! };
    }

    // 根据进度调整
    if (!monitoring.currentProgress.onTrack) {
      adjustmentsMade.push({
        type: 'timeline',
        reason: '进度落后',
        impact: `延长${monitoring.currentProgress.delayDays}天`,
      });
    }

    // 根据风险调整
    const criticalRisks = goal.risks.filter(r => r.severity === 'critical');
    if (criticalRisks.length > 0) {
      adjustmentsMade.push({
        type: 'resources',
        reason: '关键风险需要额外资源',
        impact: '增加资源投入20%',
      });
    }

    // 更新计划
    const updatedPlan = goal.plan!;
    goal.updatedAt = new Date();

    return {
      adjustmentsMade,
      updatedPlan,
    };
  }

  /**
   * 阶段6: 完成目标
   */
  private async completeGoal(goal: Goal): Promise<CompletionResult> {
    goal.status = 'completed';
    goal.completedAt = new Date();
    goal.updatedAt = new Date();
    goal.progress.percentage = 100;

    this.stats.completedGoals++;
    this.stats.activeGoals--;

    const achievements = this.identifyAchievements(goal);

    return {
      completedAt: goal.completedAt,
      finalProgress: goal.progress,
      achievements,
    };
  }

  /**
   * 阶段7: 评估价值
   */
  private async evaluateGoalValue(goal: Goal): Promise<EvaluationResult> {
    const valueDelivered = this.calculateValueMetrics(goal);
    goal.value = valueDelivered;

    const lessonsLearned = this.extractLessonsLearned(goal);
    const successRate = this.calculateSuccessRate(goal);

    return {
      valueDelivered,
      lessonsLearned,
      successRate,
    };
  }

  /**
   * 阶段8: 学习总结
   */
  private async learnFromGoal(goal: Goal, evaluation: EvaluationResult): Promise<LearningResult> {
    const patterns = this.recognizePatterns(goal);
    const bestPractices = this.extractBestPractices(goal, evaluation);
    const improvements = this.suggestImprovements(goal, evaluation);

    return {
      patterns,
      bestPractices,
      improvements,
    };
  }

  // ============ 辅助方法 ============

  private validateSMART(input: GoalInput): SMARTValidation {
    const specific = {
      valid: input.description.length > 20,
      score: Math.min(input.description.length / 100, 1),
      feedback: input.description.length > 20 ? '目标描述清晰' : '目标描述需要更具体',
    };

    const measurable = {
      valid: (input.kpis?.length || 0) > 0,
      score: Math.min((input.kpis?.length || 0) / 3, 1),
      feedback: (input.kpis?.length || 0) > 0 ? '目标可量化' : '需要添加可量化的KPI',
    };

    const achievable = {
      valid: input.resources !== undefined && input.resources.length > 0,
      score: input.resources ? Math.min(input.resources.length / 3, 1) : 0,
      feedback: input.resources ? '资源需求明确' : '需要明确资源需求',
    };

    const relevant = {
      valid: input.category !== undefined,
      score: input.category ? 1 : 0,
      feedback: input.category ? '与业务相关' : '需要明确业务相关性',
    };

    const timeBound = {
      valid: input.deadline !== undefined,
      score: input.deadline ? 1 : 0,
      feedback: input.deadline ? '有明确时间限制' : '需要设置截止日期',
    };

    const overallScore =
      (specific.score + measurable.score + achievable.score + relevant.score + timeBound.score) / 5;

    return {
      specific,
      measurable,
      achievable,
      relevant,
      timeBound,
      overallScore,
      isValid: overallScore >= 0.6,
    };
  }

  private generateMilestones(goal: Goal): Milestone[] {
    const milestones: Milestone[] = [];
    const duration = goal.input.deadline
      ? (goal.input.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      : 90;

    const phases = ['启动', '设计', '开发', '测试', '发布'];
    phases.forEach((phase, index) => {
      const dayOffset = (duration / phases.length) * (index + 1);
      milestones.push({
        id: `milestone-${index + 1}`,
        name: `${phase}阶段完成`,
        description: `${phase}阶段的所有工作完成`,
        targetDate: new Date(Date.now() + dayOffset * 24 * 60 * 60 * 1000),
        completed: false,
        criteria: [`${phase}阶段验收通过`, `${phase}阶段文档完成`],
      });
    });

    return milestones;
  }

  private decomposeTasks(goal: Goal): Task[] {
    // 简化版任务分解
    const tasks: Task[] = [];
    const baseTaskCount = 5;

    for (let i = 1; i <= baseTaskCount; i++) {
      tasks.push({
        id: `task-${i}`,
        name: `任务 ${i}`,
        description: `${goal.input.title} - 子任务 ${i}`,
        assignee: goal.input.owner,
        status: 'pending',
        priority: goal.input.priority,
        estimatedHours: 8,
        dependencies: i > 1 ? [`task-${i - 1}`] : [],
      });
    }

    return tasks;
  }

  private analyzeDependencies(goal: Goal): Dependency[] {
    const dependencies: Dependency[] = [];
    
    if (goal.plan) {
      goal.plan.tasks.forEach((task, index) => {
        if (index > 0) {
          dependencies.push({
            from: goal.plan!.tasks[index - 1].id,
            to: task.id,
            type: 'blocks',
          });
        }
      });
    }

    return dependencies;
  }

  private createTimeline(goal: Goal): Timeline {
    const startDate = new Date();
    const endDate = goal.input.deadline || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    return {
      startDate,
      endDate,
      phases: [
        {
          name: '规划阶段',
          startDate,
          endDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
          deliverables: ['需求文档', '技术方案'],
        },
        {
          name: '实施阶段',
          startDate: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(endDate.getTime() - 14 * 24 * 60 * 60 * 1000),
          deliverables: ['功能实现', '测试用例'],
        },
        {
          name: '验收阶段',
          startDate: new Date(endDate.getTime() - 14 * 24 * 60 * 60 * 1000),
          endDate,
          deliverables: ['验收报告', '上线文档'],
        },
      ],
    };
  }

  private async identifyRisks(goal: Goal): Promise<Risk[]> {
    const risks: Risk[] = [];

    // 时间风险
    if (goal.input.deadline) {
      const daysRemaining = (goal.input.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (daysRemaining < 30) {
        risks.push({
          id: 'risk-time',
          description: '时间紧迫，可能无法按期完成',
          probability: 0.7,
          impact: 0.8,
          severity: 'high',
          mitigation: '增加资源投入，优化关键路径',
          status: 'identified',
        });
      }
    }

    // 资源风险
    if (!goal.input.resources || goal.input.resources.length === 0) {
      risks.push({
        id: 'risk-resource',
        description: '资源不足',
        probability: 0.5,
        impact: 0.6,
        severity: 'medium',
        mitigation: '申请额外预算和人力',
        status: 'identified',
      });
    }

    return risks;
  }

  private calculateProgress(goal: Goal): Progress {
    if (!goal.plan) {
      return goal.progress;
    }

    const completedTasks = goal.plan.tasks.filter(t => t.status === 'completed').length;
    const totalTasks = goal.plan.tasks.length;
    const completedMilestones = goal.plan.milestones.filter(m => m.completed).length;
    const totalMilestones = goal.plan.milestones.length;

    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // 计算是否按进度进行
    const daysElapsed = (Date.now() - goal.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    const totalDays = goal.input.deadline
      ? (goal.input.deadline.getTime() - goal.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      : 90;
    const expectedProgress = (daysElapsed / totalDays) * 100;
    const onTrack = percentage >= expectedProgress * 0.9; // 容忍10%偏差
    const delayDays = onTrack ? 0 : Math.ceil((expectedProgress - percentage) * totalDays / 100);

    // 计算速度
    const velocity = daysElapsed > 0 ? completedTasks / daysElapsed : 0;

    return {
      percentage,
      completedMilestones,
      totalMilestones,
      completedTasks,
      totalTasks,
      onTrack,
      delayDays,
      velocity,
    };
  }

  private assessFeasibility(goal: Goal, plan: ExecutionPlan): number {
    let score = 1.0;

    // 评估时间可行性
    if (goal.input.deadline) {
      const totalHours = plan.tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
      const availableDays = (goal.input.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      const requiredDays = totalHours / 8;
      if (requiredDays > availableDays) {
        score *= 0.7;
      }
    }

    // 评估资源可行性
    if (!goal.input.resources || goal.input.resources.length < 2) {
      score *= 0.8;
    }

    return score;
  }

  private calculateValueMetrics(goal: Goal): ValueMetrics {
    // 简化的价值计算
    const businessValue = goal.input.priority * 20; // 优先级越高，业务价值越高
    const technicalValue = goal.smart.overallScore * 100;
    const userValue = goal.progress.percentage; // 完成度反映用户价值
    const roi = (businessValue + technicalValue + userValue) / 3 / 100;

    return {
      businessValue,
      technicalValue,
      userValue,
      roi,
      costSaved: Math.random() * 10000,
      revenueGenerated: Math.random() * 50000,
      efficiencyGain: Math.random() * 0.3,
    };
  }

  private calculateSuccessRate(goal: Goal): number {
    const factors = [
      goal.progress.percentage / 100,
      goal.smart.overallScore,
      goal.value.roi,
      goal.risks.filter(r => r.status === 'resolved').length / Math.max(goal.risks.length, 1),
    ];

    return factors.reduce((sum, f) => sum + f, 0) / factors.length;
  }

  private generateGoalSuggestions(goal: Goal): string[] {
    const suggestions: string[] = [];

    if (!goal.smart.isValid) {
      suggestions.push('建议优化目标定义，确保符合SMART原则');
    }

    if (goal.input.priority === 5 && !goal.input.deadline) {
      suggestions.push('高优先级目标建议设置明确的截止日期');
    }

    if (!goal.input.stakeholders || goal.input.stakeholders.length === 0) {
      suggestions.push('建议添加相关干系人，促进协作');
    }

    return suggestions;
  }

  private generatePlanningRecommendations(goal: Goal, plan: ExecutionPlan, feasibility: number): string[] {
    const recommendations: string[] = [];

    if (feasibility < 0.7) {
      recommendations.push('当前计划可行性较低，建议调整时间或资源');
    }

    if (plan.tasks.length > 20) {
      recommendations.push('任务数量较多，建议进一步细化里程碑');
    }

    return recommendations;
  }

  private generateMonitoringRecommendations(goal: Goal, progress: Progress, alerts: Alert[]): string[] {
    const recommendations: string[] = [];

    if (!progress.onTrack) {
      recommendations.push('目标进度落后，建议加快执行或调整计划');
    }

    if (progress.velocity < 0.5) {
      recommendations.push('任务完成速度较慢，建议分析阻塞原因');
    }

    if (alerts.some(a => a.level === 'error')) {
      recommendations.push('存在严重问题，需要立即采取行动');
    }

    return recommendations;
  }

  private identifyAchievements(goal: Goal): string[] {
    const achievements: string[] = [];

    if (goal.progress.percentage === 100) {
      achievements.push('目标100%完成');
    }

    if (goal.okr) {
      const completedKRs = goal.okr.keyResults.filter(kr => kr.status === 'completed').length;
      achievements.push(`完成${completedKRs}/${goal.okr.keyResults.length}个关键结果`);
    }

    if (goal.plan) {
      achievements.push(`完成${goal.progress.completedTasks}个任务`);
      achievements.push(`达成${goal.progress.completedMilestones}个里程碑`);
    }

    return achievements;
  }

  private extractLessonsLearned(goal: Goal): string[] {
    const lessons: string[] = [];

    if (!goal.progress.onTrack) {
      lessons.push('初始时间估算不足，未来需要更充分的评估');
    }

    if (goal.risks.some(r => r.status === 'occurred')) {
      lessons.push('风险管理需要更主动，提前制定应对措施');
    }

    if (goal.progress.velocity > 1.0) {
      lessons.push('团队执行力强，可以承担更多挑战性目标');
    }

    return lessons;
  }

  private recognizePatterns(goal: Goal): Pattern[] {
    return [
      {
        name: '高优先级目标',
        description: '优先级5的目标通常能获得更多资源支持',
        frequency: goal.input.priority === 5 ? 1 : 0,
        effectiveness: 0.85,
      },
      {
        name: '明确KPI',
        description: '有明确KPI的目标更容易跟踪和评估',
        frequency: goal.input.kpis && goal.input.kpis.length > 0 ? 1 : 0,
        effectiveness: 0.9,
      },
    ];
  }

  private extractBestPractices(goal: Goal, evaluation: EvaluationResult): string[] {
    const practices: string[] = [];

    if (evaluation.successRate > 0.8) {
      practices.push('目标设定清晰，SMART原则应用良好');
      practices.push('进度监控及时，风险管理到位');
    }

    if (goal.okr && goal.okr.keyResults.every(kr => kr.status === 'completed')) {
      practices.push('OKR拆解合理，关键结果定义明确');
    }

    return practices;
  }

  private suggestImprovements(goal: Goal, evaluation: EvaluationResult): string[] {
    const improvements: string[] = [];

    if (evaluation.successRate < 0.7) {
      improvements.push('加强目标可行性评估');
      improvements.push('提高风险识别和应对能力');
    }

    if (evaluation.valueDelivered.roi < 0.5) {
      improvements.push('优化价值交付策略，提高投资回报率');
    }

    return improvements;
  }

  private generateGoalId(): string {
    return `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============ 公开API ============

  /**
   * 创建新目标
   */
  async createGoalAsync(input: GoalInput): Promise<Goal> {
    const result = await this.createGoal(input);
    return result.goal;
  }

  /**
   * 获取目标
   */
  getGoal(goalId: string): Goal | undefined {
    return this.goals.get(goalId);
  }

  /**
   * 获取所有目标
   */
  getAllGoals(): Goal[] {
    return Array.from(this.goals.values());
  }

  /**
   * 获取活跃目标
   */
  getActiveGoals(): Goal[] {
    return Array.from(this.goals.values()).filter(g => g.status === 'active');
  }

  /**
   * 获取统计信息
   */
  getStats() {
    // 重新计算成功率
    const completed = Array.from(this.goals.values()).filter(g => g.status === 'completed');
    this.stats.successRate = completed.length > 0
      ? completed.reduce((sum, g) => sum + this.calculateSuccessRate(g), 0) / completed.length
      : 0;

    // 计算平均完成时间
    this.stats.averageCompletionTime = completed.length > 0
      ? completed.reduce((sum, g) => {
          if (g.completedAt) {
            return sum + (g.completedAt.getTime() - g.createdAt.getTime());
          }
          return sum;
        }, 0) / completed.length / (1000 * 60 * 60 * 24) // 转换为天
      : 0;

    return { ...this.stats };
  }

  /**
   * 启动自动监控
   */
  startAutoMonitoring(): void {
    if (this.progressCheckTimer) {
      return;
    }

    this.progressCheckTimer = setInterval(() => {
      const activeGoals = this.getActiveGoals();
      activeGoals.forEach(goal => {
        this.monitorGoalProgress(goal).then(monitoring => {
          if (monitoring.alerts.length > 0) {
            this.emit('goal:alert', { goalId: goal.id, alerts: monitoring.alerts });
          }
        });
      });
    }, this.config.progressCheckInterval);
  }

  /**
   * 停止自动监控
   */
  stopAutoMonitoring(): void {
    if (this.progressCheckTimer) {
      clearInterval(this.progressCheckTimer);
      this.progressCheckTimer = undefined;
    }
  }

  /**
   * 销毁实例
   */
  destroy(): void {
    this.stopAutoMonitoring();
    this.goals.clear();
    this.removeAllListeners();
  }
}
