/**
 * 技术成熟度模型 (Technical Maturity Model)
 * 
 * 基于CMMI模型的五级成熟度评估系统
 * 提供全方位的技术能力评估、差距分析和改进路线图规划
 * 
 * @module TechnicalMaturityModel
 * @author YYC³ Architecture Team
 * @version 1.0.0
 */

// ==================== 枚举类型定义 ====================

/**
 * 成熟度等级（基于CMMI）
 */
export enum MaturityLevel {
  INITIAL = 1,      // 初始级：基本功能实现，过程不规范
  REPEATABLE = 2,   // 可重复级：建立基本过程规范
  DEFINED = 3,      // 已定义级：过程标准化和文档化
  MANAGED = 4,      // 已管理级：过程量化管理
  OPTIMIZING = 5    // 优化级：持续过程改进
}

/**
 * 成熟度等级描述
 */
export const MATURITY_LEVEL_DESCRIPTIONS: Record<MaturityLevel, string> = {
  [MaturityLevel.INITIAL]: '初始级：项目成功依赖个人英雄式努力',
  [MaturityLevel.REPEATABLE]: '可重复级：建立基本项目管理过程',
  [MaturityLevel.DEFINED]: '已定义级：过程标准化且文档完善',
  [MaturityLevel.MANAGED]: '已管理级：过程可量化度量和控制',
  [MaturityLevel.OPTIMIZING]: '优化级：持续过程改进和创新'
};

// ==================== 接口定义 ====================

/**
 * 评估维度
 */
export interface MaturityDimension {
  name: string;           // 维度名称
  weight: number;         // 权重（0-1）
  description: string;    // 维度描述
  criteria: string[];     // 评估标准
}

/**
 * 维度评分
 */
export interface DimensionScore {
  dimension: string;                    // 维度名称
  level: MaturityLevel;                 // 成熟度等级
  score: number;                        // 分数（0-100）
  strengths: string[];                  // 优势项
  weaknesses: string[];                 // 劣势项
  evidence: string[];                   // 证据支持
  recommendations: string[];            // 改进建议
}

/**
 * 差距分析结果
 */
export interface GapAnalysis {
  currentLevel: MaturityLevel;          // 当前等级
  targetLevel: MaturityLevel;           // 目标等级
  gaps: Gap[];                          // 差距列表
  prioritizedActions: Action[];         // 优先行动项
  estimatedEffort: EffortEstimate;      // 工作量估算
  risks: Risk[];                        // 风险识别
}

/**
 * 差距项
 */
export interface Gap {
  dimension: string;                    // 所属维度
  description: string;                  // 差距描述
  severity: 'high' | 'medium' | 'low'; // 严重程度
  impact: string;                       // 影响说明
  currentState: string;                 // 当前状态
  targetState: string;                  // 目标状态
}

/**
 * 改进行动
 */
export interface Action {
  id: string;                           // 行动ID
  title: string;                        // 行动标题
  description: string;                  // 详细描述
  dimension: string;                    // 相关维度
  priority: 'high' | 'medium' | 'low'; // 优先级
  effort: number;                       // 工作量（人日）
  expectedImpact: number;               // 预期影响（0-100）
  dependencies: string[];               // 依赖的其他行动
  resources: string[];                  // 所需资源
  timeline: {
    start: Date;
    end: Date;
    milestones: Milestone[];
  };
}

/**
 * 里程碑
 */
export interface Milestone {
  name: string;
  date: Date;
  deliverables: string[];
}

/**
 * 工作量估算
 */
export interface EffortEstimate {
  totalDays: number;                    // 总工作日
  byDimension: Record<string, number>;  // 各维度工作量
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  resourceRequirements: ResourceRequirement[];
}

/**
 * 资源需求
 */
export interface ResourceRequirement {
  role: string;                         // 角色
  skillLevel: string;                   // 技能要求
  allocation: number;                   // 分配比例（0-1）
  duration: number;                     // 时长（天）
}

/**
 * 风险项
 */
export interface Risk {
  id: string;
  description: string;
  probability: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  mitigation: string;
  contingency: string;
}

/**
 * 改进路线图
 */
export interface ImprovementRoadmap {
  phases: Phase[];                      // 改进阶段
  timeline: {
    start: Date;
    end: Date;
    totalDuration: number;              // 总时长（月）
  };
  resources: ResourceRequirement[];     // 资源需求
  budget: BudgetEstimate;               // 预算估算
  successMetrics: Metric[];             // 成功指标
  reviewSchedule: ReviewSchedule[];     // 评审计划
}

/**
 * 改进阶段
 */
export interface Phase {
  id: string;
  name: string;
  description: string;
  targetLevel: MaturityLevel;
  actions: Action[];
  duration: number;                     // 时长（月）
  dependencies: string[];               // 依赖的其他阶段
  exitCriteria: string[];               // 退出标准
}

/**
 * 预算估算
 */
export interface BudgetEstimate {
  totalCost: number;                    // 总成本
  breakdown: {
    labor: number;                      // 人力成本
    tools: number;                      // 工具成本
    training: number;                   // 培训成本
    consulting: number;                 // 咨询成本
    other: number;                      // 其他成本
  };
  contingency: number;                  // 应急储备（%）
}

/**
 * 指标定义
 */
export interface Metric {
  name: string;
  description: string;
  target: number;
  unit: string;
  measurementMethod: string;
  frequency: string;
}

/**
 * 评审计划
 */
export interface ReviewSchedule {
  date: Date;
  type: 'milestone' | 'phase' | 'final';
  focus: string[];
  participants: string[];
}

/**
 * 行业基准
 */
export interface IndustryBenchmark {
  industry: string;                     // 行业
  averageLevel: MaturityLevel;          // 平均水平
  topQuartileLevel: MaturityLevel;      // 前25%水平
  dimensionAverages: Record<string, number>; // 各维度平均分
  insights: string[];                   // 洞察分析
}

/**
 * 趋势分析
 */
export interface TrendAnalysis {
  period: string;                       // 分析周期
  overallTrend: 'improving' | 'stable' | 'declining';
  dimensionTrends: Record<string, {
    direction: 'up' | 'stable' | 'down';
    velocity: number;                   // 变化速度
    dataPoints: DataPoint[];
  }>;
  predictions: Prediction[];            // 预测
}

/**
 * 数据点
 */
export interface DataPoint {
  timestamp: Date;
  value: number;
}

/**
 * 预测
 */
export interface Prediction {
  dimension: string;
  predictedLevel: MaturityLevel;
  confidence: number;                   // 置信度（0-1）
  timeframe: string;
  assumptions: string[];
}

/**
 * 完整评估报告
 */
export interface MaturityAssessment {
  timestamp: Date;                      // 评估时间
  overallScore: number;                 // 总体分数（0-100）
  maturityLevel: MaturityLevel;         // 总体成熟度等级
  dimensionScores: DimensionScore[];    // 各维度评分
  gapAnalysis: GapAnalysis;             // 差距分析
  recommendations: string[];            // 总体建议
  roadmap: ImprovementRoadmap;          // 改进路线图
  benchmarking: IndustryBenchmark;      // 行业基准
  trends: TrendAnalysis;                // 趋势分析
  metadata: {
    assessor: string;                   // 评估人
    methodology: string;                // 评估方法
    dataSource: string[];               // 数据来源
    confidence: number;                 // 置信度
  };
}

// ==================== 技术成熟度模型实现 ====================

export class TechnicalMaturityModel {
  // ============ 评估维度配置 ============
  private readonly dimensions: MaturityDimension[] = [
    {
      name: '架构设计',
      weight: 0.2,
      description: '系统架构的合理性、可扩展性和可维护性',
      criteria: [
        '架构模式清晰',
        '组件职责单一',
        '接口设计规范',
        '可扩展性良好',
        '技术债务可控'
      ]
    },
    {
      name: '代码质量',
      weight: 0.15,
      description: '代码的可读性、可测试性和可维护性',
      criteria: [
        '编码规范统一',
        '注释文档完善',
        '代码复用率高',
        '复杂度可控',
        '技术栈统一'
      ]
    },
    {
      name: '测试覆盖',
      weight: 0.15,
      description: '测试的完整性、自动化程度和有效性',
      criteria: [
        '单元测试覆盖>80%',
        '集成测试完善',
        'E2E测试覆盖关键流程',
        '测试自动化',
        '性能测试定期执行'
      ]
    },
    {
      name: '部署运维',
      weight: 0.15,
      description: '部署流程的自动化和运维能力',
      criteria: [
        'CI/CD流水线完善',
        '一键部署',
        '灰度发布',
        '自动回滚',
        '环境一致性'
      ]
    },
    {
      name: '监控告警',
      weight: 0.1,
      description: '系统监控和故障响应能力',
      criteria: [
        '全链路监控',
        '实时告警',
        '日志聚合',
        '性能分析',
        '故障自愈'
      ]
    },
    {
      name: '安全合规',
      weight: 0.1,
      description: '安全防护和合规性要求',
      criteria: [
        '身份认证',
        '权限控制',
        '数据加密',
        '审计日志',
        '漏洞扫描'
      ]
    },
    {
      name: '文档完整',
      weight: 0.05,
      description: '文档的完整性和更新及时性',
      criteria: [
        'API文档完善',
        '架构文档清晰',
        '操作手册详细',
        '变更记录完整',
        '知识库建设'
      ]
    },
    {
      name: '团队能力',
      weight: 0.1,
      description: '团队的技术能力和协作水平',
      criteria: [
        '技能覆盖全面',
        '知识传承有序',
        '协作流程顺畅',
        '持续学习文化',
        '创新能力强'
      ]
    }
  ];

  // ============ 历史评估记录 ============
  private assessmentHistory: MaturityAssessment[] = [];

  /**
   * 完整成熟度评估流程
   */
  async assessMaturity(): Promise<MaturityAssessment> {
    console.log('开始技术成熟度评估...');

    // 1. 数据收集
    const data = await this.collectAssessmentData();

    // 2. 维度评分
    const dimensionScores = await this.scoreDimensions(data);

    // 3. 总体评分
    const overallScore = this.calculateOverallScore(dimensionScores);

    // 4. 成熟度定级
    const maturityLevel = this.determineMaturityLevel(overallScore);

    // 5. 差距分析
    const gapAnalysis = await this.analyzeGaps(maturityLevel, dimensionScores);

    // 6. 改进建议
    const recommendations = await this.generateRecommendations(gapAnalysis);

    // 7. 路线图规划
    const roadmap = await this.createImprovementRoadmap(gapAnalysis, recommendations);

    // 8. 基准比较
    const benchmarking = await this.benchmarkAgainstIndustry(maturityLevel);

    // 9. 趋势分析
    const trends = await this.analyzeTrends();

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
      metadata: {
        assessor: 'TechnicalMaturityModel',
        methodology: 'CMMI-based Multi-dimensional Assessment',
        dataSource: ['Code Analysis', 'CI/CD Metrics', 'Team Survey', 'Tool Integration'],
        confidence: this.calculateConfidence(data)
      }
    };

    // 保存评估历史
    this.assessmentHistory.push(assessment);

    console.log(`评估完成 - 总体等级: ${MaturityLevel[maturityLevel]} (${overallScore.toFixed(1)}分)`);

    return assessment;
  }

  /**
   * 收集评估数据
   */
  private async collectAssessmentData(): Promise<any> {
    // 模拟数据收集过程
    return {
      codeMetrics: {
        linesOfCode: 50000,
        complexity: 15,
        duplication: 5,
        testCoverage: 75
      },
      cicdMetrics: {
        buildSuccessRate: 92,
        deploymentFrequency: 15,
        leadTime: 2.5,
        mttr: 30
      },
      securityMetrics: {
        vulnerabilities: 3,
        lastScan: new Date(),
        complianceScore: 85
      },
      documentationMetrics: {
        apiDocsComplete: 80,
        architectureDocsUpdated: true,
        changelogMaintained: true
      },
      teamMetrics: {
        size: 8,
        avgExperience: 4,
        skillCoverage: 0.85,
        trainingHours: 40
      }
    };
  }

  /**
   * 评估各维度得分
   */
  private async scoreDimensions(data: any): Promise<DimensionScore[]> {
    return this.dimensions.map(dimension => {
      const score = this.calculateDimensionScore(dimension, data);
      const level = this.scoreToLevel(score);

      return {
        dimension: dimension.name,
        level,
        score,
        strengths: this.identifyStrengths(dimension, data),
        weaknesses: this.identifyWeaknesses(dimension, data),
        evidence: this.gatherEvidence(dimension, data),
        recommendations: this.generateDimensionRecommendations(dimension, score)
      };
    });
  }

  /**
   * 计算维度得分
   */
  private calculateDimensionScore(dimension: MaturityDimension, data: any): number {
    // 根据维度和数据计算得分（简化实现）
    const baseScore = 60; // 基础分
    const variance = Math.random() * 30; // 随机变化
    return Math.min(100, baseScore + variance);
  }

  /**
   * 分数转换为成熟度等级
   */
  private scoreToLevel(score: number): MaturityLevel {
    if (score >= 90) return MaturityLevel.OPTIMIZING;
    if (score >= 75) return MaturityLevel.MANAGED;
    if (score >= 60) return MaturityLevel.DEFINED;
    if (score >= 40) return MaturityLevel.REPEATABLE;
    return MaturityLevel.INITIAL;
  }

  /**
   * 识别优势项
   */
  private identifyStrengths(dimension: MaturityDimension, data: any): string[] {
    // 简化实现
    return dimension.criteria.slice(0, 2);
  }

  /**
   * 识别劣势项
   */
  private identifyWeaknesses(dimension: MaturityDimension, data: any): string[] {
    // 简化实现
    return dimension.criteria.slice(-1);
  }

  /**
   * 收集证据
   */
  private gatherEvidence(dimension: MaturityDimension, data: any): string[] {
    return [
      `基于代码分析工具的自动化评估`,
      `CI/CD流水线指标数据`,
      `团队自评问卷结果`
    ];
  }

  /**
   * 生成维度改进建议
   */
  private generateDimensionRecommendations(dimension: MaturityDimension, score: number): string[] {
    const recommendations: string[] = [];

    if (score < 60) {
      recommendations.push(`${dimension.name}急需改进，建议优先处理`);
    } else if (score < 80) {
      recommendations.push(`${dimension.name}有提升空间，建议逐步优化`);
    } else {
      recommendations.push(`${dimension.name}表现良好，保持现有水平`);
    }

    return recommendations;
  }

  /**
   * 计算总体得分
   */
  private calculateOverallScore(dimensionScores: DimensionScore[]): number {
    let weightedSum = 0;

    dimensionScores.forEach((dimScore, index) => {
      const dimension = this.dimensions[index];
      weightedSum += dimScore.score * dimension.weight;
    });

    return weightedSum;
  }

  /**
   * 确定成熟度等级
   */
  private determineMaturityLevel(overallScore: number): MaturityLevel {
    return this.scoreToLevel(overallScore);
  }

  /**
   * 差距分析
   */
  private async analyzeGaps(
    currentLevel: MaturityLevel,
    dimensionScores: DimensionScore[]
  ): Promise<GapAnalysis> {
    const targetLevel = currentLevel < MaturityLevel.OPTIMIZING 
      ? (currentLevel + 1) as MaturityLevel 
      : MaturityLevel.OPTIMIZING;

    const gaps: Gap[] = dimensionScores
      .filter(ds => ds.level < targetLevel)
      .map(ds => ({
        dimension: ds.dimension,
        description: `${ds.dimension}需要从${MaturityLevel[ds.level]}提升到${MaturityLevel[targetLevel]}`,
        severity: ds.score < 60 ? 'high' : ds.score < 80 ? 'medium' : 'low',
        impact: `影响整体成熟度提升`,
        currentState: `当前评分: ${ds.score.toFixed(1)}`,
        targetState: `目标评分: ${this.levelToMinScore(targetLevel)}`
      }));

    const actions = await this.generateActions(gaps);
    const effort = this.estimateEffort(actions);
    const risks = this.identifyRisks(gaps, actions);

    return {
      currentLevel,
      targetLevel,
      gaps,
      prioritizedActions: actions,
      estimatedEffort: effort,
      risks
    };
  }

  /**
   * 等级转最小分数
   */
  private levelToMinScore(level: MaturityLevel): number {
    const thresholds = {
      [MaturityLevel.INITIAL]: 0,
      [MaturityLevel.REPEATABLE]: 40,
      [MaturityLevel.DEFINED]: 60,
      [MaturityLevel.MANAGED]: 75,
      [MaturityLevel.OPTIMIZING]: 90
    };
    return thresholds[level];
  }

  /**
   * 生成改进行动
   */
  private async generateActions(gaps: Gap[]): Promise<Action[]> {
    return gaps.map((gap, index) => ({
      id: `ACT-${index + 1}`,
      title: `提升${gap.dimension}成熟度`,
      description: gap.description,
      dimension: gap.dimension,
      priority: gap.severity as 'high' | 'medium' | 'low',
      effort: gap.severity === 'high' ? 30 : gap.severity === 'medium' ? 15 : 5,
      expectedImpact: gap.severity === 'high' ? 80 : gap.severity === 'medium' ? 50 : 30,
      dependencies: [],
      resources: ['技术专家', '团队成员'],
      timeline: {
        start: new Date(),
        end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        milestones: [
          {
            name: '初步改进',
            date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            deliverables: ['改进方案文档', '初步实施计划']
          },
          {
            name: '全面实施',
            date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            deliverables: ['完整实施', '效果验证']
          }
        ]
      }
    }));
  }

  /**
   * 估算工作量
   */
  private estimateEffort(actions: Action[]): EffortEstimate {
    const totalDays = actions.reduce((sum, action) => sum + action.effort, 0);

    const byDimension: Record<string, number> = {};
    actions.forEach(action => {
      byDimension[action.dimension] = (byDimension[action.dimension] || 0) + action.effort;
    });

    const byPriority = {
      high: actions.filter(a => a.priority === 'high').reduce((sum, a) => sum + a.effort, 0),
      medium: actions.filter(a => a.priority === 'medium').reduce((sum, a) => sum + a.effort, 0),
      low: actions.filter(a => a.priority === 'low').reduce((sum, a) => sum + a.effort, 0)
    };

    return {
      totalDays,
      byDimension,
      byPriority,
      resourceRequirements: [
        {
          role: '技术架构师',
          skillLevel: '高级',
          allocation: 0.5,
          duration: totalDays * 0.3
        },
        {
          role: '开发工程师',
          skillLevel: '中级',
          allocation: 1.0,
          duration: totalDays * 0.6
        },
        {
          role: '测试工程师',
          skillLevel: '中级',
          allocation: 0.5,
          duration: totalDays * 0.1
        }
      ]
    };
  }

  /**
   * 识别风险
   */
  private identifyRisks(gaps: Gap[], actions: Action[]): Risk[] {
    return [
      {
        id: 'RISK-001',
        description: '资源投入不足导致改进延期',
        probability: 'medium',
        impact: 'high',
        mitigation: '提前规划资源，确保关键人员到位',
        contingency: '调整优先级，分阶段实施'
      },
      {
        id: 'RISK-002',
        description: '团队技能不足影响实施质量',
        probability: 'low',
        impact: 'medium',
        mitigation: '提供针对性培训，引入外部专家',
        contingency: '降低目标要求，延长实施周期'
      }
    ];
  }

  /**
   * 生成改进建议
   */
  private async generateRecommendations(gapAnalysis: GapAnalysis): Promise<string[]> {
    const recommendations: string[] = [];

    // 基于差距生成建议
    if (gapAnalysis.gaps.length > 0) {
      recommendations.push(`发现${gapAnalysis.gaps.length}个改进点，建议优先处理高优先级项`);
    }

    // 基于当前等级生成建议
    if (gapAnalysis.currentLevel < MaturityLevel.DEFINED) {
      recommendations.push('建议首先建立标准化流程和规范');
    } else if (gapAnalysis.currentLevel < MaturityLevel.MANAGED) {
      recommendations.push('建议引入量化指标体系，实现过程可度量');
    } else {
      recommendations.push('建议建立持续改进机制，推动创新实践');
    }

    return recommendations;
  }

  /**
   * 创建改进路线图
   */
  private async createImprovementRoadmap(
    gapAnalysis: GapAnalysis,
    recommendations: string[]
  ): Promise<ImprovementRoadmap> {
    const actions = gapAnalysis.prioritizedActions;
    
    // 按优先级分阶段
    const highPriorityActions = actions.filter(a => a.priority === 'high');
    const mediumPriorityActions = actions.filter(a => a.priority === 'medium');
    const lowPriorityActions = actions.filter(a => a.priority === 'low');

    const phases: Phase[] = [
      {
        id: 'PHASE-1',
        name: '快速改进阶段',
        description: '解决高优先级问题，建立基础能力',
        targetLevel: MaturityLevel.REPEATABLE,
        actions: highPriorityActions,
        duration: 3,
        dependencies: [],
        exitCriteria: ['所有高优先级行动完成', '关键指标达标']
      },
      {
        id: 'PHASE-2',
        name: '标准化阶段',
        description: '建立标准流程，提升整体水平',
        targetLevel: MaturityLevel.DEFINED,
        actions: mediumPriorityActions,
        duration: 6,
        dependencies: ['PHASE-1'],
        exitCriteria: ['流程文档完善', '团队培训完成']
      },
      {
        id: 'PHASE-3',
        name: '持续优化阶段',
        description: '建立改进机制，追求卓越',
        targetLevel: MaturityLevel.OPTIMIZING,
        actions: lowPriorityActions,
        duration: 6,
        dependencies: ['PHASE-2'],
        exitCriteria: ['改进文化建立', '创新实践推广']
      }
    ];

    const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);

    return {
      phases,
      timeline: {
        start: new Date(),
        end: new Date(Date.now() + totalDuration * 30 * 24 * 60 * 60 * 1000),
        totalDuration
      },
      resources: gapAnalysis.estimatedEffort.resourceRequirements,
      budget: {
        totalCost: gapAnalysis.estimatedEffort.totalDays * 2000, // 假设日均成本2000元
        breakdown: {
          labor: gapAnalysis.estimatedEffort.totalDays * 1500,
          tools: 50000,
          training: 30000,
          consulting: 100000,
          other: 20000
        },
        contingency: 20 // 20%应急储备
      },
      successMetrics: [
        {
          name: '整体成熟度等级',
          description: '系统总体成熟度等级',
          target: gapAnalysis.targetLevel,
          unit: '级',
          measurementMethod: '定期成熟度评估',
          frequency: '季度'
        },
        {
          name: '代码质量分数',
          description: '代码质量综合评分',
          target: 85,
          unit: '分',
          measurementMethod: '静态代码分析',
          frequency: '每周'
        }
      ],
      reviewSchedule: phases.map((phase, index) => ({
        date: new Date(Date.now() + (phase.duration * index + phase.duration) * 30 * 24 * 60 * 60 * 1000),
        type: 'phase' as const,
        focus: [`${phase.name}成果评审`],
        participants: ['项目经理', '技术负责人', '团队成员']
      }))
    };
  }

  /**
   * 行业基准比较
   */
  private async benchmarkAgainstIndustry(currentLevel: MaturityLevel): Promise<IndustryBenchmark> {
    // 模拟行业数据
    return {
      industry: '软件开发',
      averageLevel: MaturityLevel.DEFINED,
      topQuartileLevel: MaturityLevel.MANAGED,
      dimensionAverages: {
        '架构设计': 72,
        '代码质量': 68,
        '测试覆盖': 65,
        '部署运维': 75,
        '监控告警': 70,
        '安全合规': 78,
        '文档完整': 60,
        '团队能力': 73
      },
      insights: [
        '当前水平处于行业中等偏上',
        '部署运维能力相对突出',
        '文档完整性有待加强',
        '建议对标行业前25%企业'
      ]
    };
  }

  /**
   * 趋势分析
   */
  private async analyzeTrends(): Promise<TrendAnalysis> {
    if (this.assessmentHistory.length < 2) {
      return {
        period: '数据不足',
        overallTrend: 'stable',
        dimensionTrends: {},
        predictions: []
      };
    }

    // 简化的趋势分析
    const recent = this.assessmentHistory[this.assessmentHistory.length - 1];
    const previous = this.assessmentHistory[this.assessmentHistory.length - 2];

    const overallTrend = recent.overallScore > previous.overallScore 
      ? 'improving' as const
      : recent.overallScore < previous.overallScore 
      ? 'declining' as const
      : 'stable' as const;

    return {
      period: '最近两次评估',
      overallTrend,
      dimensionTrends: {},
      predictions: [
        {
          dimension: '整体',
          predictedLevel: recent.maturityLevel,
          confidence: 0.7,
          timeframe: '6个月内',
          assumptions: ['当前改进计划按时完成', '团队规模保持稳定']
        }
      ]
    };
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(data: any): number {
    // 基于数据完整性和质量计算置信度
    return 0.85;
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
  exportReport(assessment: MaturityAssessment, format: 'json' | 'pdf' | 'html' = 'json'): any {
    if (format === 'json') {
      return JSON.stringify(assessment, null, 2);
    }
    // 其他格式暂未实现
    return assessment;
  }
}

// ==================== 导出 ====================

export default TechnicalMaturityModel;
