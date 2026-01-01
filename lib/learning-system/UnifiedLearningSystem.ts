/**
 * @fileoverview 三层学习系统 - 自适应学习引擎
 * @description 实现行为学习、策略学习、知识学习三层递进式学习架构
 * @author YYC³
 * @version 2.0.0
 * @created 2025-12-28
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 * @architecture 分层学习 + 反馈闭环
 */

'use client';

// ================================================
// 类型定义
// ================================================

export interface UserBehavior {
  id: string;
  userId: string;
  action: string;
  context: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  metadata?: Record<string, any>;
}

export interface BehaviorPattern {
  id: string;
  patternType: string;
  frequency: number;
  confidence: number;
  description: string;
  examples: UserBehavior[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalizationProfile {
  userId: string;
  preferences: Record<string, any>;
  patterns: BehaviorPattern[];
  predictions: Record<string, number>;
  version: number;
  lastUpdated: Date;
}

export interface DecisionOutcome {
  id: string;
  decision: string;
  parameters: Record<string, any>;
  context: Record<string, any>;
  result: 'success' | 'failure' | 'partial';
  metrics: {
    executionTime: number;
    resourceUsage: number;
    userSatisfaction?: number;
  };
  timestamp: Date;
}

export interface OptimizationStrategy {
  id: string;
  name: string;
  description: string;
  rules: StrategyRule[];
  performance: {
    successRate: number;
    averageTime: number;
    resourceEfficiency: number;
  };
  lastEvaluated: Date;
}

export interface StrategyRule {
  condition: string;
  action: string;
  priority: number;
  confidence: number;
}

export interface KnowledgeEntry {
  id: string;
  type: 'fact' | 'rule' | 'example' | 'concept';
  content: string;
  tags: string[];
  confidence: number;
  source: string;
  createdAt: Date;
  updatedAt: Date;
  relations: Array<{ targetId: string; relationType: string }>;
}

export interface KnowledgeGraph {
  nodes: KnowledgeEntry[];
  edges: Array<{ from: string; to: string; type: string; weight: number }>;
  version: number;
  lastUpdated: Date;
}

export interface LearningMetrics {
  totalSamples: number;
  modelAccuracy: number;
  trainingTime: number;
  lastTrainingDate: Date;
  improvementRate: number;
}

export interface TrainingData {
  features: number[][];
  labels: number[];
  metadata: Record<string, any>;
}

export interface ModelEvaluation {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  timestamp: Date;
}

// ================================================
// 第一层：行为学习层
// ================================================

export class BehavioralLearningLayer {
  private behaviors: Map<string, UserBehavior[]> = new Map();
  private patterns: Map<string, BehaviorPattern[]> = new Map();
  private profiles: Map<string, PersonalizationProfile> = new Map();
  
  /**
   * 记录用户行为
   */
  recordBehavior(behavior: UserBehavior): void {
    const userId = behavior.userId;
    
    if (!this.behaviors.has(userId)) {
      this.behaviors.set(userId, []);
    }
    
    this.behaviors.get(userId)!.push(behavior);
    
    // 触发模式识别
    this.detectPatterns(userId);
  }
  
  /**
   * 检测行为模式
   */
  private detectPatterns(userId: string): void {
    const userBehaviors = this.behaviors.get(userId) || [];
    if (userBehaviors.length < 10) {
      return; // 需要足够的数据
    }
    
    // 简化的模式识别算法
    const actionFrequency = new Map<string, number>();
    
    userBehaviors.forEach(behavior => {
      const count = actionFrequency.get(behavior.action) || 0;
      actionFrequency.set(behavior.action, count + 1);
    });
    
    const patterns: BehaviorPattern[] = [];
    
    actionFrequency.forEach((frequency, action) => {
      if (frequency >= 3) {
        const examples = userBehaviors.filter(b => b.action === action).slice(0, 3);
        
        patterns.push({
          id: `pattern-${Date.now()}-${action}`,
          patternType: action,
          frequency,
          confidence: Math.min(frequency / userBehaviors.length, 1),
          description: `用户经常执行 ${action} 操作`,
          examples,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });
    
    this.patterns.set(userId, patterns);
    this.updateProfile(userId);
  }
  
  /**
   * 更新个性化配置
   */
  private updateProfile(userId: string): void {
    const existingProfile = this.profiles.get(userId);
    const patterns = this.patterns.get(userId) || [];
    
    // 生成偏好设置
    const preferences: Record<string, any> = {};
    patterns.forEach(pattern => {
      preferences[pattern.patternType] = {
        frequency: pattern.frequency,
        confidence: pattern.confidence
      };
    });
    
    // 生成预测
    const predictions: Record<string, number> = {};
    patterns.forEach(pattern => {
      predictions[`next_${pattern.patternType}`] = pattern.confidence;
    });
    
    const profile: PersonalizationProfile = {
      userId,
      preferences,
      patterns,
      predictions,
      version: (existingProfile?.version || 0) + 1,
      lastUpdated: new Date()
    };
    
    this.profiles.set(userId, profile);
  }
  
  /**
   * 获取用户配置
   */
  getUserProfile(userId: string): PersonalizationProfile | null {
    return this.profiles.get(userId) || null;
  }
  
  /**
   * 预测下一个可能的操作
   */
  predictNextAction(userId: string, context: Record<string, any>): string | null {
    const profile = this.profiles.get(userId);
    if (!profile) {
      return null;
    }
    
    // 简化的预测：返回最频繁的操作
    let maxConfidence = 0;
    let predictedAction: string | null = null;
    
    for (const [action, confidence] of Object.entries(profile.predictions)) {
      if (confidence > maxConfidence) {
        maxConfidence = confidence;
        predictedAction = action.replace('next_', '');
      }
    }
    
    return predictedAction;
  }
  
  /**
   * 获取学习指标
   */
  getMetrics(userId?: string): LearningMetrics {
    if (userId) {
      const behaviors = this.behaviors.get(userId) || [];
      const patterns = this.patterns.get(userId) || [];
      
      return {
        totalSamples: behaviors.length,
        modelAccuracy: patterns.length > 0 ? patterns[0].confidence : 0,
        trainingTime: 0,
        lastTrainingDate: new Date(),
        improvementRate: 0
      };
    }
    
    // 全局指标
    let totalBehaviors = 0;
    let totalPatterns = 0;
    let avgConfidence = 0;
    
    this.behaviors.forEach(behaviors => {
      totalBehaviors += behaviors.length;
    });
    
    this.patterns.forEach(patterns => {
      totalPatterns += patterns.length;
      patterns.forEach(p => {
        avgConfidence += p.confidence;
      });
    });
    
    return {
      totalSamples: totalBehaviors,
      modelAccuracy: totalPatterns > 0 ? avgConfidence / totalPatterns : 0,
      trainingTime: 0,
      lastTrainingDate: new Date(),
      improvementRate: 0
    };
  }
}

// ================================================
// 第二层：策略学习层
// ================================================

export class StrategicLearningLayer {
  private outcomes: DecisionOutcome[] = [];
  private strategies: Map<string, OptimizationStrategy> = new Map();
  
  /**
   * 记录决策结果
   */
  recordOutcome(outcome: DecisionOutcome): void {
    this.outcomes.push(outcome);
    
    // 触发策略优化
    this.optimizeStrategies();
  }
  
  /**
   * 优化策略
   */
  private optimizeStrategies(): void {
    if (this.outcomes.length < 20) {
      return; // 需要足够的数据
    }
    
    // 按决策类型分组
    const decisionGroups = new Map<string, DecisionOutcome[]>();
    
    this.outcomes.forEach(outcome => {
      if (!decisionGroups.has(outcome.decision)) {
        decisionGroups.set(outcome.decision, []);
      }
      decisionGroups.get(outcome.decision)!.push(outcome);
    });
    
    // 为每种决策类型生成策略
    decisionGroups.forEach((outcomes, decisionType) => {
      const successCount = outcomes.filter(o => o.result === 'success').length;
      const successRate = successCount / outcomes.length;
      
      const avgTime = outcomes.reduce((sum, o) => sum + o.metrics.executionTime, 0) / outcomes.length;
      const avgResource = outcomes.reduce((sum, o) => sum + o.metrics.resourceUsage, 0) / outcomes.length;
      
      // 提取成功案例的参数模式
      const successOutcomes = outcomes.filter(o => o.result === 'success');
      const rules: StrategyRule[] = [];
      
      if (successOutcomes.length > 0) {
        // 简化的规则提取
        rules.push({
          condition: `decision == "${decisionType}"`,
          action: 'apply_successful_parameters',
          priority: 1,
          confidence: successRate
        });
      }
      
      const strategy: OptimizationStrategy = {
        id: `strategy-${decisionType}`,
        name: `${decisionType}策略`,
        description: `基于${outcomes.length}个历史决策优化`,
        rules,
        performance: {
          successRate,
          averageTime: avgTime,
          resourceEfficiency: 1 / avgResource
        },
        lastEvaluated: new Date()
      };
      
      this.strategies.set(decisionType, strategy);
    });
  }
  
  /**
   * 获取最佳策略
   */
  getBestStrategy(decisionType: string, context: Record<string, any>): OptimizationStrategy | null {
    return this.strategies.get(decisionType) || null;
  }
  
  /**
   * 推荐参数
   */
  recommendParameters(decisionType: string, context: Record<string, any>): Record<string, any> {
    const strategy = this.strategies.get(decisionType);
    if (!strategy) {
      return {};
    }
    
    // 获取成功案例的平均参数
    const successOutcomes = this.outcomes.filter(
      o => o.decision === decisionType && o.result === 'success'
    );
    
    if (successOutcomes.length === 0) {
      return {};
    }
    
    // 简化实现：返回最近成功案例的参数
    return successOutcomes[successOutcomes.length - 1].parameters;
  }
  
  /**
   * 获取学习指标
   */
  getMetrics(): LearningMetrics {
    const successCount = this.outcomes.filter(o => o.result === 'success').length;
    
    return {
      totalSamples: this.outcomes.length,
      modelAccuracy: this.outcomes.length > 0 ? successCount / this.outcomes.length : 0,
      trainingTime: 0,
      lastTrainingDate: new Date(),
      improvementRate: 0
    };
  }
}

// ================================================
// 第三层：知识学习层
// ================================================

export class KnowledgeLearningLayer {
  private knowledgeBase: Map<string, KnowledgeEntry> = new Map();
  private graph: KnowledgeGraph = {
    nodes: [],
    edges: [],
    version: 1,
    lastUpdated: new Date()
  };
  
  /**
   * 添加知识条目
   */
  addKnowledge(entry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = `knowledge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const knowledgeEntry: KnowledgeEntry = {
      ...entry,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.knowledgeBase.set(id, knowledgeEntry);
    this.updateGraph();
    
    return id;
  }
  
  /**
   * 更新知识图谱
   */
  private updateGraph(): void {
    this.graph.nodes = Array.from(this.knowledgeBase.values());
    
    // 构建边：基于关系
    this.graph.edges = [];
    this.knowledgeBase.forEach(entry => {
      entry.relations.forEach(relation => {
        this.graph.edges.push({
          from: entry.id,
          to: relation.targetId,
          type: relation.relationType,
          weight: 1.0
        });
      });
    });
    
    this.graph.version++;
    this.graph.lastUpdated = new Date();
  }
  
  /**
   * 查询知识
   */
  queryKnowledge(query: string, options?: { type?: string; tags?: string[] }): KnowledgeEntry[] {
    const results: KnowledgeEntry[] = [];
    
    this.knowledgeBase.forEach(entry => {
      // 类型过滤
      if (options?.type && entry.type !== options.type) {
        return;
      }
      
      // 标签过滤
      if (options?.tags && !options.tags.some(tag => entry.tags.includes(tag))) {
        return;
      }
      
      // 内容搜索
      if (entry.content.toLowerCase().includes(query.toLowerCase())) {
        results.push(entry);
      }
    });
    
    // 按置信度排序
    return results.sort((a, b) => b.confidence - a.confidence);
  }
  
  /**
   * 获取相关知识
   */
  getRelatedKnowledge(entryId: string, maxDepth: number = 2): KnowledgeEntry[] {
    const related = new Set<string>();
    const queue: Array<{ id: string; depth: number }> = [{ id: entryId, depth: 0 }];
    const visited = new Set<string>();
    
    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      
      if (visited.has(id) || depth > maxDepth) {
        continue;
      }
      
      visited.add(id);
      
      if (depth > 0) {
        related.add(id);
      }
      
      // 查找相关节点
      const edges = this.graph.edges.filter(e => e.from === id);
      edges.forEach(edge => {
        queue.push({ id: edge.to, depth: depth + 1 });
      });
    }
    
    return Array.from(related)
      .map(id => this.knowledgeBase.get(id))
      .filter((entry): entry is KnowledgeEntry => entry !== undefined);
  }
  
  /**
   * 获取知识图谱
   */
  getKnowledgeGraph(): KnowledgeGraph {
    return { ...this.graph };
  }
  
  /**
   * 获取学习指标
   */
  getMetrics(): LearningMetrics {
    return {
      totalSamples: this.knowledgeBase.size,
      modelAccuracy: this.calculateGraphQuality(),
      trainingTime: 0,
      lastTrainingDate: this.graph.lastUpdated,
      improvementRate: 0
    };
  }
  
  /**
   * 计算图谱质量
   */
  private calculateGraphQuality(): number {
    if (this.graph.nodes.length === 0) {
      return 0;
    }
    
    // 简化的质量指标：平均置信度 × 连接密度
    const avgConfidence = this.graph.nodes.reduce((sum, node) => sum + node.confidence, 0) / this.graph.nodes.length;
    const connectionDensity = this.graph.edges.length / Math.max(this.graph.nodes.length, 1);
    
    return Math.min(avgConfidence * (1 + connectionDensity), 1);
  }
}

// ================================================
// 统一学习系统接口
// ================================================

export class UnifiedLearningSystem {
  private behavioralLayer: BehavioralLearningLayer;
  private strategicLayer: StrategicLearningLayer;
  private knowledgeLayer: KnowledgeLearningLayer;
  
  constructor() {
    this.behavioralLayer = new BehavioralLearningLayer();
    this.strategicLayer = new StrategicLearningLayer();
    this.knowledgeLayer = new KnowledgeLearningLayer();
  }
  
  /**
   * 获取行为学习层
   */
  getBehavioralLayer(): BehavioralLearningLayer {
    return this.behavioralLayer;
  }
  
  /**
   * 获取策略学习层
   */
  getStrategicLayer(): StrategicLearningLayer {
    return this.strategicLayer;
  }
  
  /**
   * 获取知识学习层
   */
  getKnowledgeLayer(): KnowledgeLearningLayer {
    return this.knowledgeLayer;
  }
  
  /**
   * 获取综合指标
   */
  getOverallMetrics(): {
    behavioral: LearningMetrics;
    strategic: LearningMetrics;
    knowledge: LearningMetrics;
    overall: number;
  } {
    const behavioral = this.behavioralLayer.getMetrics();
    const strategic = this.strategicLayer.getMetrics();
    const knowledge = this.knowledgeLayer.getMetrics();
    
    const overall = (
      behavioral.modelAccuracy +
      strategic.modelAccuracy +
      knowledge.modelAccuracy
    ) / 3;
    
    return {
      behavioral,
      strategic,
      knowledge,
      overall
    };
  }
}
