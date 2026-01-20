// 测试优化工具 - 识别和优化长时间运行的测试用例
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,优化,性能,分析

import { performance } from 'perf_hooks';

interface TestExecutionTime {
  testName: string;
  filePath: string;
  duration: number;
  timestamp: number;
}

interface OptimizationSuggestion {
  testName: string;
  filePath: string;
  currentDuration: number;
  targetDuration: number;
  suggestions: string[];
  priority: 'high' | 'medium' | 'low';
}

export class TestOptimizer {
  private executionTimes: TestExecutionTime[] = [];
  private slowTestThreshold: number = 5000; // 5秒
  private verySlowTestThreshold: number = 10000; // 10秒

  constructor(thresholds?: { slow?: number; verySlow?: number }) {
    if (thresholds) {
      this.slowTestThreshold = thresholds.slow || 5000;
      this.verySlowTestThreshold = thresholds.verySlow || 10000;
    }
  }

  public recordExecution(testName: string, filePath: string, duration: number): void {
    this.executionTimes.push({
      testName,
      filePath,
      duration,
      timestamp: Date.now(),
    });
  }

  public getSlowTests(): TestExecutionTime[] {
    return this.executionTimes
      .filter(test => test.duration > this.slowTestThreshold)
      .sort((a, b) => b.duration - a.duration);
  }

  public getVerySlowTests(): TestExecutionTime[] {
    return this.executionTimes
      .filter(test => test.duration > this.verySlowTestThreshold)
      .sort((a, b) => b.duration - a.duration);
  }

  public getAverageExecutionTime(): number {
    if (this.executionTimes.length === 0) {
      return 0;
    }
    const total = this.executionTimes.reduce((sum, test) => sum + test.duration, 0);
    return total / this.executionTimes.length;
  }

  public getMedianExecutionTime(): number {
    if (this.executionTimes.length === 0) {
      return 0;
    }
    const sorted = [...this.executionTimes].sort((a, b) => a.duration - b.duration);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1].duration + sorted[mid].duration) / 2
      : sorted[mid].duration;
  }

  public getTotalExecutionTime(): number {
    return this.executionTimes.reduce((sum, test) => sum + test.duration, 0);
  }

  public getOptimizationSuggestions(): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];

    const slowTests = this.getSlowTests();
    const averageTime = this.getAverageExecutionTime();
    const targetTime = Math.min(averageTime * 1.5, this.slowTestThreshold);

    slowTests.forEach(test => {
      const testSuggestions: string[] = [];

      if (test.duration > this.verySlowTestThreshold) {
        testSuggestions.push('⚠️ 测试执行时间超过10秒，需要立即优化');
        testSuggestions.push('- 考虑将测试拆分为多个小测试');
        testSuggestions.push('- 使用mock替代真实的异步操作');
        testSuggestions.push('- 减少测试数据量');
        testSuggestions.push('- 优化测试设置和清理逻辑');
      } else if (test.duration > this.slowTestThreshold) {
        testSuggestions.push('⚡ 测试执行时间较长，建议优化');
        testSuggestions.push('- 检查是否有不必要的等待时间');
        testSuggestions.push('- 使用更高效的断言方法');
        testSuggestions.push('- 考虑使用测试缓存');
      }

      if (test.filePath.includes('e2e')) {
        testSuggestions.push('- E2E测试通常较慢，考虑将部分测试降级为集成测试');
      }

      if (test.filePath.includes('data-driven')) {
        testSuggestions.push('- 数据驱动测试可能产生大量测试用例，考虑减少测试数据集大小');
      }

      suggestions.push({
        testName: test.testName,
        filePath: test.filePath,
        currentDuration: test.duration,
        targetDuration: targetTime,
        suggestions: testSuggestions,
        priority: test.duration > this.verySlowTestThreshold ? 'high' : 'medium',
      });
    });

    return suggestions;
  }

  public printReport(): void {
    console.log('\n' + '='.repeat(80));
    console.log('📊 测试执行时间分析报告');
    console.log('='.repeat(80) + '\n');

    const totalTests = this.executionTimes.length;
    const totalTime = this.getTotalExecutionTime();
    const averageTime = this.getAverageExecutionTime();
    const medianTime = this.getMedianExecutionTime();
    const slowTests = this.getSlowTests();
    const verySlowTests = this.getVerySlowTests();

    console.log(`⏱️  总测试数: ${totalTests}`);
    console.log(`⏱️  总执行时间: ${(totalTime / 1000).toFixed(2)}秒`);
    console.log(`📊 平均执行时间: ${(averageTime / 1000).toFixed(2)}秒`);
    console.log(`📊 中位数执行时间: ${(medianTime / 1000).toFixed(2)}秒`);
    console.log(`🐌 慢速测试数 (${this.slowTestThreshold}ms以上): ${slowTests.length}`);
    console.log(`🐌🐌 超慢测试数 (${this.verySlowTestThreshold}ms以上): ${verySlowTests.length}\n`);

    if (slowTests.length > 0) {
      console.log('-'.repeat(80));
      console.log('🐌 慢速测试列表 (Top 10):');
      console.log('-'.repeat(80) + '\n');

      slowTests.slice(0, 10).forEach((test, index) => {
        const percentage = (test.duration / totalTime * 100).toFixed(2);
        const bar = '█'.repeat(Math.floor(percentage / 2));
        console.log(`${index + 1}. ${test.testName}`);
        console.log(`   文件: ${test.filePath}`);
        console.log(`   ⏱️  ${(test.duration / 1000).toFixed(2)}秒 (${percentage}%) ${bar}\n`);
      });
    }

    const suggestions = this.getOptimizationSuggestions();
    if (suggestions.length > 0) {
      console.log('-'.repeat(80));
      console.log('💡 优化建议:');
      console.log('-'.repeat(80) + '\n');

      suggestions.slice(0, 5).forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion.testName}`);
        console.log(`   优先级: ${suggestion.priority === 'high' ? '🔴 高' : suggestion.priority === 'medium' ? '🟡 中' : '🟢 低'}`);
        console.log(`   当前: ${(suggestion.currentDuration / 1000).toFixed(2)}秒`);
        console.log(`   目标: ${(suggestion.targetDuration / 1000).toFixed(2)}秒`);
        console.log(`   建议:`);
        suggestion.suggestions.forEach(s => console.log(`     ${s}`));
        console.log('');
      });
    }

    console.log('='.repeat(80) + '\n');
  }

  public exportReport(): string {
    const report: any = {
      summary: {
        totalTests: this.executionTimes.length,
        totalTime: this.getTotalExecutionTime(),
        averageTime: this.getAverageExecutionTime(),
        medianTime: this.getMedianExecutionTime(),
        slowTests: this.getSlowTests().length,
        verySlowTests: this.getVerySlowTests().length,
      },
      slowTests: this.getSlowTests(),
      optimizationSuggestions: this.getOptimizationSuggestions(),
      timestamp: new Date().toISOString(),
    };

    return JSON.stringify(report, null, 2);
  }

  public clear(): void {
    this.executionTimes = [];
  }
}

export class TestPerformanceMonitor {
  private optimizer: TestOptimizer;
  private testStartTimes: Map<string, number> = new Map();

  constructor(optimizer: TestOptimizer) {
    this.optimizer = optimizer;
  }

  public startTest(testName: string, filePath: string): void {
    this.testStartTimes.set(`${filePath}:${testName}`, performance.now());
  }

  public endTest(testName: string, filePath: string): void {
    const key = `${filePath}:${testName}`;
    const startTime = this.testStartTimes.get(key);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.optimizer.recordExecution(testName, filePath, duration);
      this.testStartTimes.delete(key);
    }
  }

  public wrapTest<T>(
    testName: string,
    filePath: string,
    testFn: () => T
  ): T {
    this.startTest(testName, filePath);
    try {
      const result = testFn();
      this.endTest(testName, filePath);
      return result;
    } catch (error) {
      this.endTest(testName, filePath);
      throw error;
    }
  }

  public async wrapAsyncTest<T>(
    testName: string,
    filePath: string,
    testFn: () => Promise<T>
  ): Promise<T> {
    this.startTest(testName, filePath);
    try {
      const result = await testFn();
      this.endTest(testName, filePath);
      return result;
    } catch (error) {
      this.endTest(testName, filePath);
      throw error;
    }
  }
}

export function createTestOptimizer(thresholds?: {
  slow?: number;
  verySlow?: number;
}): TestOptimizer {
  return new TestOptimizer(thresholds);
}

export function createPerformanceMonitor(
  optimizer: TestOptimizer
): TestPerformanceMonitor {
  return new TestPerformanceMonitor(optimizer);
}
