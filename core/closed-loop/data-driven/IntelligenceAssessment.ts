import {
  AIWidgetInstance,
  AICapabilityAssessment
} from '../types';

export class IntelligenceAssessment {
  async assessAICapabilities(widget: AIWidgetInstance): Promise<AICapabilityAssessment> {
    const cognitiveAbilities = await this.assessCognitiveAbilities(widget);
    const technicalCapabilities = await this.assessTechnicalCapabilities(widget);
    const businessImpact = await this.assessBusinessImpact(widget);
    
    return {
      overallIQ: this.calculateOverallIQ(cognitiveAbilities, technicalCapabilities),
      cognitiveDimensions: {
        understanding: cognitiveAbilities.comprehension,
        reasoning: cognitiveAbilities.logic,
        creativity: cognitiveAbilities.innovation,
        adaptation: cognitiveAbilities.learning
      },
      technicalDimensions: {
        accuracy: technicalCapabilities.precision,
        efficiency: technicalCapabilities.performance,
        reliability: technicalCapabilities.stability,
        scalability: technicalCapabilities.growth
      },
      impactDimensions: {
        productivity: businessImpact.efficiency,
        innovation: businessImpact.creativity,
        decisionQuality: businessImpact.insights,
        userSatisfaction: businessImpact.satisfaction
      },
      improvementRecommendations: this.generateImprovementRecommendations(
        cognitiveAbilities, 
        technicalCapabilities, 
        businessImpact
      )
    };
  }

  private async assessCognitiveAbilities(widget: AIWidgetInstance): Promise<{
    comprehension: number;
    logic: number;
    innovation: number;
    learning: number;
  }> {
    return {
      comprehension: widget.metrics.performance * 0.9,
      logic: widget.metrics.performance * 0.85,
      innovation: widget.metrics.performance * 0.8,
      learning: widget.metrics.performance * 0.75
    };
  }

  private async assessTechnicalCapabilities(widget: AIWidgetInstance): Promise<{
    precision: number;
    performance: number;
    stability: number;
    growth: number;
  }> {
    return {
      precision: widget.metrics.performance,
      performance: widget.metrics.performance,
      stability: widget.metrics.reliability,
      growth: widget.metrics.usage * 0.8
    };
  }

  private async assessBusinessImpact(widget: AIWidgetInstance): Promise<{
    efficiency: number;
    creativity: number;
    insights: number;
    satisfaction: number;
  }> {
    return {
      efficiency: widget.metrics.performance * 0.9,
      creativity: widget.metrics.performance * 0.8,
      insights: widget.metrics.performance * 0.85,
      satisfaction: widget.metrics.reliability * 0.9
    };
  }

  private calculateOverallIQ(
    cognitive: { comprehension: number; logic: number; innovation: number; learning: number },
    technical: { precision: number; performance: number; stability: number; growth: number }
  ): number {
    const cognitiveAvg = (cognitive.comprehension + cognitive.logic + cognitive.innovation + cognitive.learning) / 4;
    const technicalAvg = (technical.precision + technical.performance + technical.stability + technical.growth) / 4;
    return (cognitiveAvg + technicalAvg) / 2;
  }

  private generateImprovementRecommendations(
    cognitive: { comprehension: number; logic: number; innovation: number; learning: number },
    technical: { precision: number; performance: number; stability: number; growth: number },
    business: { efficiency: number; creativity: number; insights: number; satisfaction: number }
  ): string[] {
    const recommendations: string[] = [];
    
    if (cognitive.learning < 0.8) {
      recommendations.push('Improve learning capabilities through enhanced training data');
    }
    if (technical.precision < 0.9) {
      recommendations.push('Enhance precision with better model fine-tuning');
    }
    if (business.efficiency < 0.85) {
      recommendations.push('Optimize efficiency through process improvements');
    }
    
    return recommendations;
  }
}