import { AIProject, MaturityAssessment, CapabilityAssessment } from '../types';

export class TechnicalMaturityModel {
  private capabilityAreas = [
    'ai_capabilities',
    'system_architecture', 
    'development_process',
    'operational_excellence',
    'innovation_capacity'
  ];
  
  async assessMaturityLevel(project: AIProject): Promise<MaturityAssessment> {
    const assessments = await Promise.all(
      this.capabilityAreas.map(area => this.assessCapabilityArea(area, project))
    );
    
    return {
      currentLevel: this.calculateOverallLevel(assessments),
      capabilityBreakdown: assessments,
      maturityGaps: this.identifyMaturityGaps(assessments),
      evolutionPath: this.generateEvolutionPath(assessments),
      improvementPriorities: this.prioritizeImprovements(assessments)
    };
  }
  
  private async assessCapabilityArea(area: string, project: AIProject): Promise<CapabilityAssessment> {
    const indicators = await this.evaluateIndicators(area, project);
    const benchmarks = await this.getIndustryBenchmarks(area);
    
    return {
      area,
      currentLevel: this.calculateScore(indicators),
      targetLevel: benchmarks.industryAverage,
      gaps: this.identifyWeaknesses(indicators),
      improvementActions: this.generateRecommendations(area, indicators, benchmarks)
    };
  }
  
  private async evaluateIndicators(area: string, project: AIProject): Promise<Record<string, number>> {
    const indicators: Record<string, number> = {};
    
    switch (area) {
      case 'ai_capabilities':
        indicators.model_accuracy = await this.evaluateModelAccuracy(project);
        indicators.data_quality = await this.evaluateDataQuality(project);
        indicators.feature_coverage = await this.evaluateFeatureCoverage(project);
        break;
      case 'system_architecture':
        indicators.modularity = await this.evaluateModularity(project);
        indicators.scalability = await this.evaluateScalability(project);
        indicators.security = await this.evaluateSecurity(project);
        break;
      case 'development_process':
        indicators.automation = await this.evaluateAutomation(project);
        indicators.testing_coverage = await this.evaluateTestingCoverage(project);
        indicators.deployment_frequency = await this.evaluateDeploymentFrequency(project);
        break;
      case 'operational_excellence':
        indicators.reliability = await this.evaluateReliability(project);
        indicators.performance = await this.evaluatePerformance(project);
        indicators.monitoring = await this.evaluateMonitoring(project);
        break;
      case 'innovation_capacity':
        indicators.research_output = await this.evaluateResearchOutput(project);
        indicators.experimentation = await this.evaluateExperimentation(project);
        indicators.learning_rate = await this.evaluateLearningRate(project);
        break;
    }
    
    return indicators;
  }
  
  private async getIndustryBenchmarks(area: string): Promise<{ industryAverage: number; topQuartile: number }> {
    const benchmarks: Record<string, { industryAverage: number; topQuartile: number }> = {
      ai_capabilities: { industryAverage: 3.5, topQuartile: 4.5 },
      system_architecture: { industryAverage: 3.2, topQuartile: 4.3 },
      development_process: { industryAverage: 3.0, topQuartile: 4.2 },
      operational_excellence: { industryAverage: 3.3, topQuartile: 4.4 },
      innovation_capacity: { industryAverage: 2.8, topQuartile: 4.0 }
    };
    
    return benchmarks[area] || { industryAverage: 3.0, topQuartile: 4.0 };
  }
  
  private calculateScore(indicators: Record<string, number>): number {
    const values = Object.values(indicators);
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  }
  
  private calculateOverallLevel(assessments: CapabilityAssessment[]): number {
    return assessments.length > 0 
      ? assessments.reduce((sum, assessment) => sum + assessment.currentLevel, 0) / assessments.length 
      : 0;
  }
  
  private identifyStrengths(indicators: Record<string, number>): string[] {
    return Object.entries(indicators)
      .filter(([_, value]) => value >= 4.0)
      .map(([key, _]) => key);
  }
  
  private identifyWeaknesses(indicators: Record<string, number>): string[] {
    return Object.entries(indicators)
      .filter(([_, value]) => value < 3.0)
      .map(([key, _]) => key);
  }
  
  private generateRecommendations(area: string, indicators: Record<string, number>, benchmarks: any): string[] {
    const recommendations: string[] = [];
    const weaknesses = this.identifyWeaknesses(indicators);
    
    weaknesses.forEach(weakness => {
      recommendations.push(`Improve ${weakness} in ${area} to reach industry benchmark`);
    });
    
    return recommendations;
  }
  
  private identifyMaturityGaps(assessments: CapabilityAssessment[]): string[] {
    const gaps: string[] = [];
    
    assessments.forEach(assessment => {
      if (assessment.currentLevel < assessment.targetLevel) {
        gaps.push(`${assessment.area}: Level ${assessment.currentLevel} → ${assessment.targetLevel}`);
      }
    });
    
    return gaps;
  }
  
  private generateEvolutionPath(assessments: CapabilityAssessment[]): string[] {
    const path: string[] = [];
    const sortedAssessments = [...assessments].sort((a, b) => a.currentLevel - b.currentLevel);
    
    sortedAssessments.forEach((assessment, index) => {
      path.push(`Phase ${index + 1}: Improve ${assessment.area} to Level ${assessment.targetLevel}`);
    });
    
    return path;
  }
  
  private prioritizeImprovements(assessments: CapabilityAssessment[]): string[] {
    const priorities: string[] = [];
    
    assessments.forEach(assessment => {
      const gap = assessment.targetLevel - assessment.currentLevel;
      if (gap > 1.5) {
        priorities.push(`HIGH: ${assessment.area} - Gap of ${gap.toFixed(1)} levels`);
      } else if (gap > 0.5) {
        priorities.push(`MEDIUM: ${assessment.area} - Gap of ${gap.toFixed(1)} levels`);
      }
    });
    
    return priorities;
  }
  
  private async evaluateModelAccuracy(project: AIProject): Promise<number> {
    return 3.5;
  }
  
  private async evaluateDataQuality(project: AIProject): Promise<number> {
    return 3.8;
  }
  
  private async evaluateFeatureCoverage(project: AIProject): Promise<number> {
    return 3.2;
  }
  
  private async evaluateModularity(project: AIProject): Promise<number> {
    return 3.6;
  }
  
  private async evaluateScalability(project: AIProject): Promise<number> {
    return 3.4;
  }
  
  private async evaluateSecurity(project: AIProject): Promise<number> {
    return 3.7;
  }
  
  private async evaluateAutomation(project: AIProject): Promise<number> {
    return 3.1;
  }
  
  private async evaluateTestingCoverage(project: AIProject): Promise<number> {
    return 3.3;
  }
  
  private async evaluateDeploymentFrequency(project: AIProject): Promise<number> {
    return 3.0;
  }
  
  private async evaluateReliability(project: AIProject): Promise<number> {
    return 3.8;
  }
  
  private async evaluatePerformance(project: AIProject): Promise<number> {
    return 3.5;
  }
  
  private async evaluateMonitoring(project: AIProject): Promise<number> {
    return 3.4;
  }
  
  private async evaluateResearchOutput(project: AIProject): Promise<number> {
    return 2.9;
  }
  
  private async evaluateExperimentation(project: AIProject): Promise<number> {
    return 3.0;
  }
  
  private async evaluateLearningRate(project: AIProject): Promise<number> {
    return 3.2;
  }
}