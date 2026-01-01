/**
 * @fileoverview 模型路由器 - 智能模型选择与负载均衡
 * @description 根据请求特征自动选择最优模型，支持成本优化和故障转移
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-09
 * @modified 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { IModelAdapter, ModelInfo, ChatRequest, ChatResponse } from '../model-adapter/types';

// ====================================
// 类型定义
// ====================================

export interface RouterConfig {
  defaultModel?: string;
  enableCostOptimization: boolean;
  enableLoadBalancing: boolean;
  enableFallback: boolean;
  maxRetries: number;
  timeout: number;
}

export interface RoutingRequest {
  request: ChatRequest;
  requirements?: RoutingRequirements;
  userId?: string;
}

export interface RoutingRequirements {
  maxLatency?: number;
  maxCost?: number;
  requiredCapabilities?: string[];
  preferredProvider?: string;
  qualityThreshold?: number;
}

export interface RoutingResult {
  adapterId: string;
  adapter: IModelAdapter;
  model: ModelInfo;
  score: number;
  reason: string;
  response: ChatResponse;
  metrics: RoutingMetrics;
}

export interface RoutingMetrics {
  candidatesConsidered: number;
  selectionTime: number;
  executionTime: number;
  cost: number;
  fallbackAttempts: number;
}

export interface ScoringWeights {
  performance: number;
  cost: number;
  quality: number;
  latency: number;
  availability: number;
}

// ====================================
// 模型路由器实现
// ====================================

export class ModelRouter {
  private config: RouterConfig;
  private adapters: Map<string, IModelAdapter> = new Map();
  private modelInfo: Map<string, ModelInfo> = new Map();
  private performanceHistory: Map<string, PerformanceMetrics[]> = new Map();
  private costTracker: Map<string, CostMetrics> = new Map();
  private scoringWeights: ScoringWeights = {
    performance: 0.3,
    cost: 0.2,
    quality: 0.3,
    latency: 0.15,
    availability: 0.05
  };

  constructor(config: Partial<RouterConfig> = {}) {
    this.config = {
      defaultModel: undefined,
      enableCostOptimization: true,
      enableLoadBalancing: true,
      enableFallback: true,
      maxRetries: 3,
      timeout: 30000,
      ...config
    };
  }

  /**
   * 注册模型适配器
   */
  async registerAdapter(id: string, adapter: IModelAdapter): Promise<void> {
    this.adapters.set(id, adapter);
    
    // 获取模型信息
    const modelInfo = await adapter.getModelInfo();
    this.modelInfo.set(id, modelInfo);
    
    // 初始化性能历史
    this.performanceHistory.set(id, []);
    
    // 初始化成本追踪
    this.costTracker.set(id, {
      totalCost: 0,
      totalRequests: 0,
      averageCost: 0
    });
  }

  /**
   * 路由请求到最佳模型
   */
  async route(routingRequest: RoutingRequest): Promise<RoutingResult> {
    const startTime = Date.now();
    
    try {
      // 1. 筛选候选模型
      const candidates = await this.filterCandidates(routingRequest);
      
      if (candidates.length === 0) {
        throw new Error('No suitable model available for this request');
      }
      
      // 2. 评分排序
      const scored = await this.scoreCandidates(candidates, routingRequest);
      
      // 3. 选择最佳模型
      const selected = scored[0];
      
      // 4. 执行请求
      let response: ChatResponse;
      let fallbackAttempts = 0;
      
      try {
        response = await this.executeRequest(selected.adapterId, routingRequest.request);
      } catch (error) {
        // 故障转移
        if (this.config.enableFallback && scored.length > 1) {
          fallbackAttempts++;
          response = await this.fallbackExecution(scored.slice(1), routingRequest.request);
        } else {
          throw error;
        }
      }
      
      // 5. 记录性能指标
      const executionTime = Date.now() - startTime;
      await this.recordPerformance(selected.adapterId, {
        latency: executionTime,
        success: true,
        tokensUsed: response.usage.total_tokens,
        timestamp: new Date()
      });
      
      // 6. 计算成本
      const cost = this.calculateCost(selected.adapterId, response.usage.total_tokens);
      await this.recordCost(selected.adapterId, cost);
      
      return {
        adapterId: selected.adapterId,
        adapter: selected.adapter,
        model: selected.model,
        score: selected.score,
        reason: selected.reason,
        response,
        metrics: {
          candidatesConsidered: candidates.length,
          selectionTime: Date.now() - startTime - executionTime,
          executionTime,
          cost,
          fallbackAttempts
        }
      };
      
    } catch (error) {
      throw new Error(`Routing failed: ${(error as Error).message}`);
    }
  }

  /**
   * 筛选候选模型
   */
  private async filterCandidates(
    routingRequest: RoutingRequest
  ): Promise<CandidateAdapter[]> {
    const candidates: CandidateAdapter[] = [];
    
    for (const [id, adapter] of this.adapters.entries()) {
      // 检查可用性
      const modelInfo = this.modelInfo.get(id)!;
      if (modelInfo.status !== 'online') continue;
      
      // 检查能力要求
      if (routingRequest.requirements?.requiredCapabilities) {
        const hasCapabilities = routingRequest.requirements.requiredCapabilities.every(
          cap => modelInfo.capabilities.includes(cap as any)
        );
        if (!hasCapabilities) continue;
      }
      
      // 检查提供商偏好
      if (routingRequest.requirements?.preferredProvider) {
        if (modelInfo.provider !== routingRequest.requirements.preferredProvider) {
          continue;
        }
      }
      
      candidates.push({
        adapterId: id,
        adapter,
        model: modelInfo
      });
    }
    
    return candidates;
  }

  /**
   * 评分候选模型
   */
  private async scoreCandidates(
    candidates: CandidateAdapter[],
    routingRequest: RoutingRequest
  ): Promise<ScoredCandidate[]> {
    const scored = await Promise.all(
      candidates.map(async candidate => {
        const scores = await this.calculateScores(candidate, routingRequest);
        const totalScore = this.combineScores(scores);
        
        return {
          ...candidate,
          scores,
          score: totalScore,
          reason: this.generateReason(scores)
        };
      })
    );
    
    // 按分数降序排序
    return scored.sort((a, b) => b.score - a.score);
  }

  /**
   * 计算各维度分数
   */
  private async calculateScores(
    candidate: CandidateAdapter,
    routingRequest: RoutingRequest
  ): Promise<ScoreBreakdown> {
    const history = this.performanceHistory.get(candidate.adapterId) || [];
    const costMetrics = this.costTracker.get(candidate.adapterId)!;
    
    // 1. 性能分数（基于历史记录）
    const performance = history.length > 0
      ? history.reduce((sum, m) => sum + (m.success ? 1 : 0), 0) / history.length
      : 0.5;
    
    // 2. 成本分数（归一化）
    const avgCost = costMetrics.averageCost;
    const maxCost = Math.max(...Array.from(this.costTracker.values()).map(m => m.averageCost));
    const cost = maxCost > 0 ? 1 - (avgCost / maxCost) : 1;
    
    // 3. 质量分数（基于模型能力）
    const quality = candidate.model.capabilities.length / 8; // 假设最多8种能力
    
    // 4. 延迟分数（基于历史延迟）
    const avgLatency = history.length > 0
      ? history.reduce((sum, m) => sum + m.latency, 0) / history.length
      : 1000;
    const latency = Math.max(0, 1 - (avgLatency / 5000)); // 5秒为基准
    
    // 5. 可用性分数
    const availability = candidate.model.status === 'online' ? 1 : 0;
    
    return {
      performance,
      cost,
      quality,
      latency,
      availability
    };
  }

  /**
   * 组合分数
   */
  private combineScores(scores: ScoreBreakdown): number {
    return (
      scores.performance * this.scoringWeights.performance +
      scores.cost * this.scoringWeights.cost +
      scores.quality * this.scoringWeights.quality +
      scores.latency * this.scoringWeights.latency +
      scores.availability * this.scoringWeights.availability
    );
  }

  /**
   * 生成选择原因
   */
  private generateReason(scores: ScoreBreakdown): string {
    const reasons: string[] = [];
    
    if (scores.performance > 0.8) reasons.push('高性能表现');
    if (scores.cost > 0.8) reasons.push('成本优化');
    if (scores.quality > 0.8) reasons.push('高质量输出');
    if (scores.latency > 0.8) reasons.push('低延迟');
    
    return reasons.length > 0 ? reasons.join('、') : '综合评分最优';
  }

  /**
   * 执行请求
   */
  private async executeRequest(
    adapterId: string,
    request: ChatRequest
  ): Promise<ChatResponse> {
    const adapter = this.adapters.get(adapterId)!;
    return await adapter.chat(request);
  }

  /**
   * 故障转移执行
   */
  private async fallbackExecution(
    fallbackCandidates: ScoredCandidate[],
    request: ChatRequest
  ): Promise<ChatResponse> {
    for (const candidate of fallbackCandidates) {
      try {
        return await this.executeRequest(candidate.adapterId, request);
      } catch (error) {
        continue;
      }
    }
    
    throw new Error('All fallback attempts failed');
  }

  /**
   * 记录性能指标
   */
  private async recordPerformance(
    adapterId: string,
    metrics: PerformanceMetrics
  ): Promise<void> {
    const history = this.performanceHistory.get(adapterId) || [];
    history.push(metrics);
    
    // 保留最近100条记录
    if (history.length > 100) {
      history.shift();
    }
    
    this.performanceHistory.set(adapterId, history);
  }

  /**
   * 计算成本
   */
  private calculateCost(adapterId: string, tokens: number): number {
    const modelInfo = this.modelInfo.get(adapterId)!;
    const costPer1k = modelInfo.costPer1kTokens;
    
    // 简化计算：假设输入输出各占一半
    const avgCost = (costPer1k.input + costPer1k.output) / 2;
    return (tokens / 1000) * avgCost;
  }

  /**
   * 记录成本
   */
  private async recordCost(adapterId: string, cost: number): Promise<void> {
    const metrics = this.costTracker.get(adapterId)!;
    
    metrics.totalCost += cost;
    metrics.totalRequests += 1;
    metrics.averageCost = metrics.totalCost / metrics.totalRequests;
    
    this.costTracker.set(adapterId, metrics);
  }

  /**
   * 更新评分权重
   */
  updateScoringWeights(weights: Partial<ScoringWeights>): void {
    this.scoringWeights = { ...this.scoringWeights, ...weights };
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      adaptersCount: this.adapters.size,
      totalCost: Array.from(this.costTracker.values()).reduce((sum, m) => sum + m.totalCost, 0),
      totalRequests: Array.from(this.costTracker.values()).reduce((sum, m) => sum + m.totalRequests, 0),
      adapterStats: Object.fromEntries(
        Array.from(this.adapters.keys()).map(id => [
          id,
          {
            cost: this.costTracker.get(id),
            performanceHistory: this.performanceHistory.get(id)?.length || 0
          }
        ])
      )
    };
  }
}

// ====================================
// 辅助类型
// ====================================

interface CandidateAdapter {
  adapterId: string;
  adapter: IModelAdapter;
  model: ModelInfo;
}

interface ScoredCandidate extends CandidateAdapter {
  scores: ScoreBreakdown;
  score: number;
  reason: string;
}

interface ScoreBreakdown {
  performance: number;
  cost: number;
  quality: number;
  latency: number;
  availability: number;
}

interface PerformanceMetrics {
  latency: number;
  success: boolean;
  tokensUsed: number;
  timestamp: Date;
}

interface CostMetrics {
  totalCost: number;
  totalRequests: number;
  averageCost: number;
}

export default ModelRouter;
