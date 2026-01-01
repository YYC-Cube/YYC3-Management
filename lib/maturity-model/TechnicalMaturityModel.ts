/**
 * YYC³ 技术成熟度模型
 * 
 * @description 五级成熟度评估系统，支持8个维度的全面技术能力评估
 * @version 1.1.0
 * @date 2025-01-XX
 * 
 * @features
 * - 五级成熟度模型（CMMI风格）
 * - 8维度评估体系
 * - 自动化评分引擎
 * - 差距分析
 * - 改进路线图规划
 * - 行业基准对比
 * - 趋势分析
 * 
 * @author YYC³ Team
 */

import { EventEmitter } from 'events';

// ============ 类型定义 ============

export enum MaturityLevel {
  INITIAL = 1,      // 初始级：基本功能，过程混乱
  REPEATABLE = 2,   // 可重复级：过程规范，部分自动化
  DEFINED = 3,      // 已定义级：标准过程，文档完整
  MANAGED = 4,      // 已管理级：量化管理，数据驱动
  OPTIMIZING = 5    // 优化级：持续改进，自动优化
}

export interface MaturityDimension {
  name: string;
  weight: number; // 权重（总和为1）
  description: string;
}

export interface DimensionScore {
  dimension: string;
  score: number; // 0-100
  level: MaturityLevel;
  evidence: string[];
  gaps: string[];
}

export interface MaturityAssessment {
  timestamp: Date;
  overallScore: number; // 0-100
  maturityLevel: MaturityLevel;
  dimensionScores: DimensionScore[];
  gapAnalysis: GapAnalysis;
  recommendations: Recommendation[];
  roadmap: ImprovementRoadmap;
  benchmarking: BenchmarkingResult;
  trends: TrendAnalysis;
}

export interface GapAnalysis {
  currentLevel: MaturityLevel;
  targetLevel: MaturityLevel;
  gaps: Gap[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface Gap {
  dimension: string;
  currentScore: number;
  targetScore: number;
  difference: number;
  description: string;
  effort: 'low' | 'medium' | 'high';
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: number; // 1-5
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  category: string;
  dependencies: string[];
}

export interface ImprovementRoadmap {
  phases: RoadmapPhase[];
  totalDuration: number; // 天数
  estimatedCost: number;
  expectedBenefit: string;
}

export interface RoadmapPhase {
  name: string;
  duration: number; // 天数
  startDate: Date;
  endDate: Date;
  objectives: string[];
  deliverables: string[];
  recommendations: string[]; // recommendation IDs
}

export interface BenchmarkingResult {
  industryAverage: number;
  topPerformers: number;
  position: 'below' | 'average' | 'above' | 'top';
  percentile: number;
  comparison: DimensionComparison[];
}

export interface DimensionComparison {
  dimension: string;
  yourScore: number;
  industryAverage: number;
  gap: number;
}

export interface TrendAnalysis {
  historicalScores: HistoricalScore[];
  trend: 'declining' | 'stable' | 'improving';
  changeRate: number; // 每月变化率
  projection: number; // 3个月后预测分数
}

export interface HistoricalScore {
  timestamp: Date;
  overallScore: number;
  dimensionScores: Record<string, number>;
}

export interface AssessmentData {
  codeMetrics: CodeMetrics;
  testMetrics: TestMetrics;
  deploymentMetrics: DeploymentMetrics;
  monitoringMetrics: MonitoringMetrics;
  securityMetrics: SecurityMetrics;
  documentationMetrics: DocumentationMetrics;
  teamMetrics: TeamMetrics;
}

export interface CodeMetrics {
  linesOfCode: number;
  codeComplexity: number; // 平均圈复杂度
  codeSmells: number;
  duplicateRate: number; // 0-1
  maintainabilityIndex: number; // 0-100
  technicalDebt: number; // 小时
}

export interface TestMetrics {
  unitTestCoverage: number; // 0-1
  integrationTestCoverage: number; // 0-1
  e2eTestCoverage: number; // 0-1
  testExecutionTime: number; // 秒
  flakyTestRate: number; // 0-1
  bugDetectionRate: number; // 0-1
}

export interface DeploymentMetrics {
  deploymentFrequency: number; // 每周次数
  leadTime: number; // 小时
  changeFailureRate: number; // 0-1
  mttr: number; // 平均恢复时间（分钟）
  rollbackRate: number; // 0-1
}

export interface MonitoringMetrics {
  availabilityRate: number; // 0-1
  alertsCoverage: number; // 0-1
  meanTimeToDetect: number; // 分钟
  falsePositiveRate: number; // 0-1
  dashboardsCount: number;
}

export interface SecurityMetrics {
  vulnerabilityCount: number;
  criticalVulnerabilities: number;
  securityScanCoverage: number; // 0-1
  incidentResponseTime: number; // 小时
  complianceScore: number; // 0-100
}

export interface DocumentationMetrics {
  apiDocumentationCoverage: number; // 0-1
  codeDocumentationCoverage: number; // 0-1
  architectureDocUpdated: boolean;
  runbookExists: boolean;
  onboardingDocsQuality: number; // 0-10
}

export interface TeamMetrics {
  teamSize: number;
  seniorityRatio: number; // 高级工程师比例
  trainingHoursPerYear: number;
  knowledgeSharingFrequency: number; // 每月次数
  collaborationScore: number; // 0-10
}

export interface MaturityModelConfig {
  targetLevel?: MaturityLevel;
  dimensions?: MaturityDimension[];
  industryBenchmark?: BenchmarkingResult;
}

// ============ 核心实现 ============

export class TechnicalMaturityModel extends EventEmitter {
  private readonly defaultDimensions: MaturityDimension[] = [
    { name: '架构设计', weight: 0.2, description: '系统架构的合理性和可扩展性' },
    { name: '代码质量', weight: 0.15, description: '代码的可维护性和技术债务水平' },
    { name: '测试覆盖', weight: 0.15, description: '测试的完整性和有效性' },
    { name: '部署运维', weight: 0.15, description: 'CI/CD流程和部署效率' },
    { name: '监控告警', weight: 0.1, description: '系统可观测性和问题响应' },
    { name: '安全合规', weight: 0.1, description: '安全防护和合规性要求' },
    { name: '文档完整', weight: 0.05, description: '文档的完整性和时效性' },
    { name: '团队能力', weight: 0.1, description: '团队技能和协作水平' },
  ];

  private dimensions: MaturityDimension[];
  private assessmentHistory: MaturityAssessment[] = [];
  private config: Required<MaturityModelConfig>;

  constructor(config: MaturityModelConfig = {}) {
    super();
    
    this.dimensions = config.dimensions || this.defaultDimensions;
    this.config = {
      targetLevel: config.targetLevel || MaturityLevel.MANAGED,
      dimensions: this.dimensions,
      industryBenchmark: config.industryBenchmark || this.getDefaultBenchmark(),
    };
  }

  /**
   * 完整成熟度评估流程
   */
  async assessMaturity(data?: AssessmentData): Promise<MaturityAssessment> {
    console.log('[MaturityModel] 开始成熟度评估');

    // 1. 数据收集
    const assessmentData = data || await this.collectAssessmentData();
    this.emit('data:collected', { data: assessmentData });

    // 2. 维度评分
    const dimensionScores = await this.scoreDimensions(assessmentData);
    this.emit('dimensions:scored', { scores: dimensionScores });

    // 3. 总体评分
    const overallScore = this.calculateOverallScore(dimensionScores);
    this.emit('overall:scored', { score: overallScore });

    // 4. 成熟度定级
    const maturityLevel = this.determineMaturityLevel(overallScore);
    this.emit('level:determined', { level: maturityLevel });

    // 5. 差距分析
    const gapAnalysis = await this.analyzeGaps(maturityLevel, dimensionScores);
    this.emit('gaps:analyzed', { gaps: gapAnalysis });

    // 6. 改进建议
    const recommendations = await this.generateRecommendations(gapAnalysis);
    this.emit('recommendations:generated', { count: recommendations.length });

    // 7. 路线图规划
    const roadmap = await this.createImprovementRoadmap(recommendations);
    this.emit('roadmap:created', { phases: roadmap.phases.length });

    // 8. 基准比较
    const benchmarking = await this.benchmarkAgainstIndustry(maturityLevel, dimensionScores);
    this.emit('benchmark:completed', { position: benchmarking.position });

    // 9. 趋势分析
    const trends = await this.analyzeTrends();
    this.emit('trends:analyzed', { trend: trends.trend });

    const assessment: MaturityAssessment = {
      timestamp: new Date(),
      overallScore,
      maturityLevel,
      dimensionScores,
      gapAnalysis,
      recommendations,
      roadmap,
      benchmarking,
      trends,
    };

    // 保存历史记录
    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > 12) {
      this.assessmentHistory.shift(); // 只保留最近12次
    }

    this.emit('assessment:completed', { assessment });

    return assessment;
  }

  /**
   * 收集评估数据
   */
  private async collectAssessmentData(): Promise<AssessmentData> {
    // 模拟数据收集（实际应该从各个系统采集）
    return {
      codeMetrics: {
        linesOfCode: 50000,
        codeComplexity: 8.5,
        codeSmells: 23,
        duplicateRate: 0.05,
        maintainabilityIndex: 75,
        technicalDebt: 120,
      },
      testMetrics: {
        unitTestCoverage: 0.75,
        integrationTestCoverage: 0.6,
        e2eTestCoverage: 0.4,
        testExecutionTime: 180,
        flakyTestRate: 0.05,
        bugDetectionRate: 0.8,
      },
      deploymentMetrics: {
        deploymentFrequency: 5,
        leadTime: 4,
        changeFailureRate: 0.1,
        mttr: 30,
        rollbackRate: 0.05,
      },
      monitoringMetrics: {
        availabilityRate: 0.995,
        alertsCoverage: 0.85,
        meanTimeToDetect: 5,
        falsePositiveRate: 0.1,
        dashboardsCount: 8,
      },
      securityMetrics: {
        vulnerabilityCount: 12,
        criticalVulnerabilities: 1,
        securityScanCoverage: 0.9,
        incidentResponseTime: 2,
        complianceScore: 85,
      },
      documentationMetrics: {
        apiDocumentationCoverage: 0.8,
        codeDocumentationCoverage: 0.7,
        architectureDocUpdated: true,
        runbookExists: true,
        onboardingDocsQuality: 7,
      },
      teamMetrics: {
        teamSize: 12,
        seniorityRatio: 0.4,
        trainingHoursPerYear: 40,
        knowledgeSharingFrequency: 4,
        collaborationScore: 8,
      },
    };
  }

  /**
   * 维度评分
   */
  private async scoreDimensions(data: AssessmentData): Promise<DimensionScore[]> {
    const scores: DimensionScore[] = [];

    for (const dimension of this.dimensions) {
      const score = await this.scoreDimension(dimension, data);
      scores.push(score);
    }

    return scores;
  }

  /**
   * 单个维度评分
   */
  private async scoreDimension(dimension: MaturityDimension, data: AssessmentData): Promise<DimensionScore> {
    let score = 0;
    const evidence: string[] = [];
    const gaps: string[] = [];

    switch (dimension.name) {
      case '架构设计':
        score = this.scoreArchitecture(data);
        evidence.push('代码可维护性指数: ' + data.codeMetrics.maintainabilityIndex);
        if (score < 80) gaps.push('需要优化架构设计，降低复杂度');
        break;

      case '代码质量':
        score = this.scoreCodeQuality(data);
        evidence.push('代码重复率: ' + (data.codeMetrics.duplicateRate * 100).toFixed(1) + '%');
        evidence.push('技术债务: ' + data.codeMetrics.technicalDebt + '小时');
        if (score < 70) gaps.push('需要重构代码，偿还技术债务');
        break;

      case '测试覆盖':
        score = this.scoreTestCoverage(data);
        evidence.push('单元测试覆盖率: ' + (data.testMetrics.unitTestCoverage * 100).toFixed(1) + '%');
        if (score < 80) gaps.push('需要提升测试覆盖率，特别是E2E测试');
        break;

      case '部署运维':
        score = this.scoreDeployment(data);
        evidence.push('部署频率: 每周' + data.deploymentMetrics.deploymentFrequency + '次');
        evidence.push('变更失败率: ' + (data.deploymentMetrics.changeFailureRate * 100).toFixed(1) + '%');
        if (score < 75) gaps.push('需要优化CI/CD流程，提高部署可靠性');
        break;

      case '监控告警':
        score = this.scoreMonitoring(data);
        evidence.push('系统可用率: ' + (data.monitoringMetrics.availabilityRate * 100).toFixed(2) + '%');
        if (score < 80) gaps.push('需要完善监控告警体系');
        break;

      case '安全合规':
        score = this.scoreSecurity(data);
        evidence.push('严重漏洞: ' + data.securityMetrics.criticalVulnerabilities + '个');
        evidence.push('合规评分: ' + data.securityMetrics.complianceScore);
        if (score < 85) gaps.push('需要加强安全防护，修复已知漏洞');
        break;

      case '文档完整':
        score = this.scoreDocumentation(data);
        evidence.push('API文档覆盖: ' + (data.documentationMetrics.apiDocumentationCoverage * 100).toFixed(1) + '%');
        if (score < 70) gaps.push('需要补充和更新文档');
        break;

      case '团队能力':
        score = this.scoreTeam(data);
        evidence.push('高级工程师比例: ' + (data.teamMetrics.seniorityRatio * 100).toFixed(1) + '%');
        evidence.push('协作评分: ' + data.teamMetrics.collaborationScore + '/10');
        if (score < 75) gaps.push('需要加强团队培训和知识分享');
        break;

      default:
        score = 50;
    }

    const level = this.determineMaturityLevel(score);

    return {
      dimension: dimension.name,
      score,
      level,
      evidence,
      gaps,
    };
  }

  // 各维度评分算法
  private scoreArchitecture(data: AssessmentData): number {
    const maintainability = data.codeMetrics.maintainabilityIndex;
    const complexity = Math.max(0, 100 - data.codeMetrics.codeComplexity * 5);
    return (maintainability * 0.6 + complexity * 0.4);
  }

  private scoreCodeQuality(data: AssessmentData): number {
    const duplicateScore = (1 - data.codeMetrics.duplicateRate) * 100;
    const smellScore = Math.max(0, 100 - data.codeMetrics.codeSmells * 2);
    const debtScore = Math.max(0, 100 - data.codeMetrics.technicalDebt / 5);
    return (duplicateScore * 0.3 + smellScore * 0.3 + debtScore * 0.4);
  }

  private scoreTestCoverage(data: AssessmentData): number {
    const unit = data.testMetrics.unitTestCoverage * 100;
    const integration = data.testMetrics.integrationTestCoverage * 100;
    const e2e = data.testMetrics.e2eTestCoverage * 100;
    const flakyPenalty = data.testMetrics.flakyTestRate * 20;
    return (unit * 0.5 + integration * 0.3 + e2e * 0.2) - flakyPenalty;
  }

  private scoreDeployment(data: AssessmentData): number {
    const frequencyScore = Math.min(data.deploymentMetrics.deploymentFrequency * 10, 100);
    const leadTimeScore = Math.max(0, 100 - data.deploymentMetrics.leadTime * 5);
    const failureScore = (1 - data.deploymentMetrics.changeFailureRate) * 100;
    const mttrScore = Math.max(0, 100 - data.deploymentMetrics.mttr);
    return (frequencyScore * 0.3 + leadTimeScore * 0.2 + failureScore * 0.3 + mttrScore * 0.2);
  }

  private scoreMonitoring(data: AssessmentData): number {
    const availability = data.monitoringMetrics.availabilityRate * 100;
    const coverage = data.monitoringMetrics.alertsCoverage * 100;
    const detectionScore = Math.max(0, 100 - data.monitoringMetrics.meanTimeToDetect * 2);
    return (availability * 0.4 + coverage * 0.3 + detectionScore * 0.3);
  }

  private scoreSecurity(data: AssessmentData): number {
    const vulnScore = Math.max(0, 100 - data.securityMetrics.vulnerabilityCount * 2);
    const criticalPenalty = data.securityMetrics.criticalVulnerabilities * 10;
    const scanScore = data.securityMetrics.securityScanCoverage * 100;
    const compliance = data.securityMetrics.complianceScore;
    return Math.max(0, (vulnScore * 0.3 + scanScore * 0.2 + compliance * 0.5) - criticalPenalty);
  }

  private scoreDocumentation(data: AssessmentData): number {
    const apiDoc = data.documentationMetrics.apiDocumentationCoverage * 100;
    const codeDoc = data.documentationMetrics.codeDocumentationCoverage * 100;
    const archBonus = data.documentationMetrics.architectureDocUpdated ? 10 : 0;
    const runbookBonus = data.documentationMetrics.runbookExists ? 10 : 0;
    const onboarding = data.documentationMetrics.onboardingDocsQuality * 10;
    return Math.min(100, apiDoc * 0.3 + codeDoc * 0.2 + onboarding * 0.3 + archBonus + runbookBonus);
  }

  private scoreTeam(data: AssessmentData): number {
    const seniorityScore = data.teamMetrics.seniorityRatio * 100;
    const trainingScore = Math.min(data.teamMetrics.trainingHoursPerYear / 80 * 100, 100);
    const sharingScore = Math.min(data.teamMetrics.knowledgeSharingFrequency * 10, 100);
    const collaborationScore = data.teamMetrics.collaborationScore * 10;
    return (seniorityScore * 0.3 + trainingScore * 0.2 + sharingScore * 0.2 + collaborationScore * 0.3);
  }

  /**
   * 计算总体评分
   */
  private calculateOverallScore(dimensionScores: DimensionScore[]): number {
    let weightedSum = 0;
    
    for (const score of dimensionScores) {
      const dimension = this.dimensions.find(d => d.name === score.dimension);
      if (dimension) {
        weightedSum += score.score * dimension.weight;
      }
    }

    return Math.round(weightedSum);
  }

  /**
   * 确定成熟度等级
   */
  private determineMaturityLevel(score: number): MaturityLevel {
    if (score >= 90) return MaturityLevel.OPTIMIZING;
    if (score >= 75) return MaturityLevel.MANAGED;
    if (score >= 60) return MaturityLevel.DEFINED;
    if (score >= 40) return MaturityLevel.REPEATABLE;
    return MaturityLevel.INITIAL;
  }

  /**
   * 差距分析
   */
  private async analyzeGaps(
    currentLevel: MaturityLevel,
    dimensionScores: DimensionScore[]
  ): Promise<GapAnalysis> {
    const targetLevel = this.config.targetLevel;
    const targetScore = this.getLevelMinScore(targetLevel);

    const gaps: Gap[] = [];

    for (const score of dimensionScores) {
      const dimension = this.dimensions.find(d => d.name === score.dimension);
      if (!dimension) continue;

      const difference = targetScore - score.score;
      if (difference > 0) {
        gaps.push({
          dimension: score.dimension,
          currentScore: score.score,
          targetScore,
          difference,
          description: `${score.dimension}需要提升${difference.toFixed(1)}分`,
          effort: difference > 30 ? 'high' : difference > 15 ? 'medium' : 'low',
        });
      }
    }

    // 按差距大小排序
    gaps.sort((a, b) => b.difference - a.difference);

    const priority = this.determinePriority(currentLevel, targetLevel, gaps);

    return {
      currentLevel,
      targetLevel,
      gaps,
      priority,
    };
  }

  /**
   * 生成改进建议
   */
  private async generateRecommendations(gapAnalysis: GapAnalysis): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    let id = 1;

    for (const gap of gapAnalysis.gaps) {
      const recs = this.getRecommendationsForGap(gap);
      recs.forEach(rec => {
        recommendations.push({
          ...rec,
          id: `rec-${id++}`,
        });
      });
    }

    // 按优先级和影响排序
    recommendations.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return this.getImpactValue(b.impact) - this.getImpactValue(a.impact);
    });

    return recommendations;
  }

  private getRecommendationsForGap(gap: Gap): Omit<Recommendation, 'id'>[] {
    const recs: Omit<Recommendation, 'id'>[] = [];

    switch (gap.dimension) {
      case '代码质量':
        recs.push({
          title: '代码重构计划',
          description: '制定系统性的代码重构计划，逐步偿还技术债务',
          priority: 4,
          impact: 'high',
          effort: 'high',
          category: '代码质量',
          dependencies: [],
        });
        recs.push({
          title: '启用代码质量门禁',
          description: '在CI中集成代码质量检查，不达标不允许合并',
          priority: 5,
          impact: 'high',
          effort: 'low',
          category: '代码质量',
          dependencies: [],
        });
        break;

      case '测试覆盖':
        recs.push({
          title: '提升测试覆盖率',
          description: '为核心模块补充单元测试和集成测试',
          priority: 4,
          impact: 'high',
          effort: 'medium',
          category: '测试覆盖',
          dependencies: [],
        });
        break;

      case '部署运维':
        recs.push({
          title: '完善CI/CD流程',
          description: '优化构建流程，实现全自动化部署',
          priority: 3,
          impact: 'medium',
          effort: 'medium',
          category: '部署运维',
          dependencies: [],
        });
        break;

      case '监控告警':
        recs.push({
          title: '建立完整监控体系',
          description: '部署Prometheus+Grafana，建立全链路监控',
          priority: 4,
          impact: 'high',
          effort: 'medium',
          category: '监控告警',
          dependencies: [],
        });
        break;

      case '安全合规':
        recs.push({
          title: '修复安全漏洞',
          description: '优先修复所有严重和高危漏洞',
          priority: 5,
          impact: 'high',
          effort: 'high',
          category: '安全合规',
          dependencies: [],
        });
        break;
    }

    return recs;
  }

  /**
   * 创建改进路线图
   */
  private async createImprovementRoadmap(recommendations: Recommendation[]): Promise<ImprovementRoadmap> {
    // 按优先级和依赖关系分组为阶段
    const phases: RoadmapPhase[] = [];
    
    // 第一阶段：高优先级、低工作量的快速胜利
    const quickWins = recommendations.filter(r => r.priority >= 4 && r.effort === 'low');
    if (quickWins.length > 0) {
      const startDate = new Date();
      const duration = 30; // 30天
      phases.push({
        name: '第一阶段：快速改进',
        duration,
        startDate,
        endDate: new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000),
        objectives: ['快速提升关键指标', '建立基础设施'],
        deliverables: ['代码质量门禁', '基础监控系统'],
        recommendations: quickWins.map(r => r.id),
      });
    }

    // 第二阶段：中等工作量的重要改进
    const mediumEffort = recommendations.filter(r => r.priority >= 3 && r.effort === 'medium');
    if (mediumEffort.length > 0) {
      const startDate = phases.length > 0 ? phases[phases.length - 1].endDate : new Date();
      const duration = 60; // 60天
      phases.push({
        name: '第二阶段：系统性优化',
        duration,
        startDate,
        endDate: new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000),
        objectives: ['完善核心流程', '提升自动化水平'],
        deliverables: ['完整测试套件', 'CI/CD流水线'],
        recommendations: mediumEffort.map(r => r.id),
      });
    }

    // 第三阶段：高工作量的深度改进
    const highEffort = recommendations.filter(r => r.effort === 'high');
    if (highEffort.length > 0) {
      const startDate = phases.length > 0 ? phases[phases.length - 1].endDate : new Date();
      const duration = 90; // 90天
      phases.push({
        name: '第三阶段：深度重构',
        duration,
        startDate,
        endDate: new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000),
        objectives: ['架构升级', '技术债务清零'],
        deliverables: ['重构核心模块', '技术文档更新'],
        recommendations: highEffort.map(r => r.id),
      });
    }

    const totalDuration = phases.reduce((sum, p) => sum + p.duration, 0);
    const estimatedCost = recommendations.length * 10000; // 简化估算
    const expectedBenefit = '预计整体成熟度提升1-2个等级';

    return {
      phases,
      totalDuration,
      estimatedCost,
      expectedBenefit,
    };
  }

  /**
   * 行业基准对比
   */
  private async benchmarkAgainstIndustry(
    level: MaturityLevel,
    dimensionScores: DimensionScore[]
  ): Promise<BenchmarkingResult> {
    const industryAverage = 65; // 行业平均分
    const topPerformers = 85; // 优秀企业分数
    
    const overallScore = this.calculateOverallScore(dimensionScores);
    
    let position: 'below' | 'average' | 'above' | 'top';
    if (overallScore >= topPerformers) position = 'top';
    else if (overallScore >= industryAverage + 10) position = 'above';
    else if (overallScore >= industryAverage - 10) position = 'average';
    else position = 'below';

    const percentile = Math.min(99, Math.round((overallScore / topPerformers) * 100));

    const comparison: DimensionComparison[] = dimensionScores.map(score => ({
      dimension: score.dimension,
      yourScore: score.score,
      industryAverage: industryAverage + (Math.random() * 10 - 5), // 模拟行业数据
      gap: score.score - industryAverage,
    }));

    return {
      industryAverage,
      topPerformers,
      position,
      percentile,
      comparison,
    };
  }

  /**
   * 趋势分析
   */
  private async analyzeTrends(): Promise<TrendAnalysis> {
    if (this.assessmentHistory.length < 2) {
      return {
        historicalScores: [],
        trend: 'stable',
        changeRate: 0,
        projection: 0,
      };
    }

    const historicalScores: HistoricalScore[] = this.assessmentHistory.map(a => ({
      timestamp: a.timestamp,
      overallScore: a.overallScore,
      dimensionScores: Object.fromEntries(
        a.dimensionScores.map(d => [d.dimension, d.score])
      ),
    }));

    // 计算变化趋势
    const first = this.assessmentHistory[0].overallScore;
    const last = this.assessmentHistory[this.assessmentHistory.length - 1].overallScore;
    const change = last - first;
    
    let trend: 'declining' | 'stable' | 'improving';
    if (change > 5) trend = 'improving';
    else if (change < -5) trend = 'declining';
    else trend = 'stable';

    // 计算变化率（每月）
    const monthsElapsed = this.assessmentHistory.length; // 假设每月评估一次
    const changeRate = monthsElapsed > 0 ? change / monthsElapsed : 0;

    // 预测3个月后分数（线性预测）
    const projection = Math.max(0, Math.min(100, last + changeRate * 3));

    return {
      historicalScores,
      trend,
      changeRate,
      projection,
    };
  }

  // ============ 辅助方法 ============

  private getLevelMinScore(level: MaturityLevel): number {
    switch (level) {
      case MaturityLevel.OPTIMIZING: return 90;
      case MaturityLevel.MANAGED: return 75;
      case MaturityLevel.DEFINED: return 60;
      case MaturityLevel.REPEATABLE: return 40;
      case MaturityLevel.INITIAL: return 0;
    }
  }

  private determinePriority(
    current: MaturityLevel,
    target: MaturityLevel,
    gaps: Gap[]
  ): 'low' | 'medium' | 'high' | 'critical' {
    const levelGap = target - current;
    const avgGap = gaps.reduce((sum, g) => sum + g.difference, 0) / gaps.length;

    if (levelGap >= 2 || avgGap > 30) return 'critical';
    if (levelGap === 1 || avgGap > 20) return 'high';
    if (avgGap > 10) return 'medium';
    return 'low';
  }

  private getImpactValue(impact: 'low' | 'medium' | 'high'): number {
    switch (impact) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
    }
  }

  private getDefaultBenchmark(): BenchmarkingResult {
    return {
      industryAverage: 65,
      topPerformers: 85,
      position: 'average',
      percentile: 50,
      comparison: [],
    };
  }

  // ============ 公开API ============

  /**
   * 获取最新评估结果
   */
  getLatestAssessment(): MaturityAssessment | undefined {
    return this.assessmentHistory[this.assessmentHistory.length - 1];
  }

  /**
   * 获取评估历史
   */
  getAssessmentHistory(): MaturityAssessment[] {
    return [...this.assessmentHistory];
  }

  /**
   * 导出评估报告
   */
  exportReport(format: 'json' | 'markdown' = 'json'): string {
    const latest = this.getLatestAssessment();
    if (!latest) {
      return format === 'json' ? '{}' : '# 暂无评估数据';
    }

    if (format === 'json') {
      return JSON.stringify(latest, null, 2);
    }

    // Markdown格式
    let report = `# 技术成熟度评估报告\n\n`;
    report += `**评估时间**: ${latest.timestamp.toLocaleString()}\n`;
    report += `**成熟度等级**: ${MaturityLevel[latest.maturityLevel]}\n`;
    report += `**总体评分**: ${latest.overallScore}/100\n\n`;
    
    report += `## 维度评分\n\n`;
    latest.dimensionScores.forEach(score => {
      report += `### ${score.dimension}: ${score.score.toFixed(1)}/100\n`;
      report += `**等级**: ${MaturityLevel[score.level]}\n`;
      if (score.gaps.length > 0) {
        report += `**改进建议**: ${score.gaps.join(', ')}\n`;
      }
      report += `\n`;
    });

    report += `## 改进路线图\n\n`;
    latest.roadmap.phases.forEach((phase, index) => {
      report += `### ${phase.name}\n`;
      report += `- 持续时间: ${phase.duration}天\n`;
      report += `- 目标: ${phase.objectives.join(', ')}\n`;
      report += `- 交付物: ${phase.deliverables.join(', ')}\n`;
      report += `\n`;
    });

    return report;
  }

  /**
   * 清除历史记录
   */
  clearHistory(): void {
    this.assessmentHistory = [];
  }

  /**
   * 销毁实例
   */
  destroy(): void {
    this.clearHistory();
    this.removeAllListeners();
  }
}
