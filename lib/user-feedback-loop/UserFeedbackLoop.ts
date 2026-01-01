/**
 * UserFeedbackLoop - 用户反馈循环系统
 * 
 * 收集、分析和响应用户反馈:
 * - 反馈收集
 * - 情感分析
 * - 优先级排序
 * - 闭环跟踪
 * 
 * @author YYC³ AI开发团队
 * @version 1.0.0
 */

import { EventEmitter } from 'events';

export enum FeedbackType {
  BUG = 'bug',
  FEATURE_REQUEST = 'feature_request',
  IMPROVEMENT = 'improvement',
  COMPLAINT = 'complaint',
  PRAISE = 'praise'
}

export enum FeedbackStatus {
  NEW = 'new',
  REVIEWED = 'reviewed',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export interface Feedback {
  id: string;
  userId: string;
  type: FeedbackType;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  priority: number;
  status: FeedbackStatus;
  createdAt: Date;
  resolvedAt?: Date;
  metadata?: Record<string, any>;
}

export interface FeedbackAnalysis {
  totalFeedback: number;
  byType: Record<FeedbackType, number>;
  bySentiment: Record<string, number>;
  averageResponseTime: number;
  resolutionRate: number;
  topIssues: string[];
}

export class UserFeedbackLoop extends EventEmitter {
  private feedbackCollection: Feedback[];
  private responseQueue: Feedback[];

  constructor() {
    super();
    this.feedbackCollection = [];
    this.responseQueue = [];
  }

  submitFeedback(feedback: Omit<Feedback, 'id' | 'sentiment' | 'priority' | 'status' | 'createdAt'>): Feedback {
    const newFeedback: Feedback = {
      id: `feedback_${Date.now()}`,
      sentiment: this.analyzeSentiment(feedback.content),
      priority: this.calculatePriority(feedback.type, feedback.content),
      status: FeedbackStatus.NEW,
      createdAt: new Date(),
      ...feedback
    };

    this.feedbackCollection.push(newFeedback);
    this.responseQueue.push(newFeedback);
    this.emit('feedbackSubmitted', newFeedback);

    if (newFeedback.priority > 80) {
      this.emit('highPriorityFeedback', newFeedback);
    }

    return newFeedback;
  }

  private analyzeSentiment(content: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['good', 'great', 'excellent', 'love', 'amazing'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'poor'];

    const lowerContent = content.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private calculatePriority(type: FeedbackType, content: string): number {
    let basePriority = 50;

    switch (type) {
      case FeedbackType.BUG:
        basePriority = 80;
        break;
      case FeedbackType.COMPLAINT:
        basePriority = 70;
        break;
      case FeedbackType.FEATURE_REQUEST:
        basePriority = 60;
        break;
      case FeedbackType.IMPROVEMENT:
        basePriority = 50;
        break;
      case FeedbackType.PRAISE:
        basePriority = 30;
        break;
    }

    if (content.toLowerCase().includes('urgent') || content.toLowerCase().includes('critical')) {
      basePriority += 20;
    }

    return Math.min(100, basePriority);
  }

  updateFeedbackStatus(feedbackId: string, status: FeedbackStatus): void {
    const feedback = this.feedbackCollection.find(f => f.id === feedbackId);
    if (feedback) {
      feedback.status = status;
      if (status === FeedbackStatus.RESOLVED || status === FeedbackStatus.CLOSED) {
        feedback.resolvedAt = new Date();
        this.responseQueue = this.responseQueue.filter(f => f.id !== feedbackId);
      }
      this.emit('feedbackUpdated', feedback);
    }
  }

  getPendingFeedback(limit?: number): Feedback[] {
    const pending = this.responseQueue
      .filter(f => f.status === FeedbackStatus.NEW || f.status === FeedbackStatus.REVIEWED)
      .sort((a, b) => b.priority - a.priority);

    return limit ? pending.slice(0, limit) : pending;
  }

  getFeedbackAnalysis(): FeedbackAnalysis {
    const total = this.feedbackCollection.length;
    const byType: Record<FeedbackType, number> = {
      [FeedbackType.BUG]: 0,
      [FeedbackType.FEATURE_REQUEST]: 0,
      [FeedbackType.IMPROVEMENT]: 0,
      [FeedbackType.COMPLAINT]: 0,
      [FeedbackType.PRAISE]: 0
    };
    const bySentiment: Record<string, number> = {
      positive: 0,
      neutral: 0,
      negative: 0
    };

    let totalResponseTime = 0;
    let resolvedCount = 0;

    for (const feedback of this.feedbackCollection) {
      byType[feedback.type]++;
      bySentiment[feedback.sentiment]++;

      if (feedback.resolvedAt) {
        resolvedCount++;
        totalResponseTime += feedback.resolvedAt.getTime() - feedback.createdAt.getTime();
      }
    }

    const averageResponseTime = resolvedCount > 0 ? totalResponseTime / resolvedCount : 0;
    const resolutionRate = total > 0 ? resolvedCount / total : 0;

    const topIssues = this.identifyTopIssues();

    return {
      totalFeedback: total,
      byType,
      bySentiment,
      averageResponseTime,
      resolutionRate,
      topIssues
    };
  }

  private identifyTopIssues(): string[] {
    const issueFrequency = new Map<string, number>();

    for (const feedback of this.feedbackCollection) {
      if (feedback.type === FeedbackType.BUG || feedback.type === FeedbackType.COMPLAINT) {
        const keywords = this.extractKeywords(feedback.content);
        for (const keyword of keywords) {
          issueFrequency.set(keyword, (issueFrequency.get(keyword) || 0) + 1);
        }
      }
    }

    return Array.from(issueFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([keyword]) => keyword);
  }

  private extractKeywords(content: string): string[] {
    return content
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3);
  }

  destroy(): void {
    this.feedbackCollection = [];
    this.responseQueue = [];
    this.removeAllListeners();
  }
}