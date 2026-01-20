// 测试性能基准脚本 - 用于测量和分析测试执行时间
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @status: published
// @tags: 测试,性能,基准,优化

import { performance } from 'perf_hooks';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface TestSuiteResult {
  name: string;
  duration: number;
  testCount: number;
  passCount: number;
  failCount: number;
}

interface BenchmarkResult {
  timestamp: string;
  totalDuration: number;
  suites: TestSuiteResult[];
  summary: {
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    avgDurationPerTest: number;
    slowestSuite: string;
    fastestSuite: string;
  };
}

class TestPerformanceBenchmark {
  private results: BenchmarkResult[] = [];
  private resultsPath: string;

  constructor() {
    this.resultsPath = path.join(process.cwd(), 'test-performance-results.json');
    this.loadResults();
  }

  private loadResults(): void {
    if (fs.existsSync(this.resultsPath)) {
      const data = fs.readFileSync(this.resultsPath, 'utf-8');
      this.results = JSON.parse(data);
    }
  }

  private saveResults(): void {
    fs.writeFileSync(this.resultsPath, JSON.stringify(this.results, null, 2));
  }

  public async runBenchmark(): Promise<BenchmarkResult> {
    console.log('🚀 开始测试性能基准测试...\n');

    const startTime = performance.now();
    const suites: TestSuiteResult[] = [];

    const testFiles = [
      {
        name: '数据导入导出功能测试',
        path: '__tests__/lib/utils/data-import-export.test.ts',
      },
      {
        name: '高级搜索功能测试',
        path: '__tests__/lib/utils/advanced-search.test.ts',
      },
      {
        name: '批量操作功能测试',
        path: '__tests__/lib/utils/batch-operations.test.ts',
      },
      {
        name: '虚拟滚动组件测试',
        path: '__tests__/components/ui/virtual-scroll.test.tsx',
      },
      {
        name: '数据分片加载测试',
        path: '__tests__/lib/utils/chunked-data-loader.test.ts',
      },
      {
        name: '数据预加载测试',
        path: '__tests__/lib/utils/data-preloader.test.ts',
      },
      {
        name: '拖拽排序功能测试',
        path: '__tests__/lib/utils/drag-drop.test.ts',
      },
      {
        name: '快捷键功能测试',
        path: '__tests__/lib/utils/keyboard-shortcuts.test.ts',
      },
      {
        name: '离线支持功能测试',
        path: '__tests__/lib/utils/offline-support.test.ts',
      },
    ];

    for (const testFile of testFiles) {
      console.log(`📊 运行: ${testFile.name}`);
      const suiteStartTime = performance.now();

      try {
        const output = execSync(
          `npx vitest run ${testFile.path} --reporter=json`,
          { encoding: 'utf-8', stdio: 'pipe' }
        );

        const suiteEndTime = performance.now();
        const duration = suiteEndTime - suiteStartTime;

        const result = JSON.parse(output);
        const testResults = result.testResults[0];

        suites.push({
          name: testFile.name,
          duration,
          testCount: testResults.assertionResults?.length || 0,
          passCount: testResults.assertionResults?.filter((r: any) => r.status === 'passed').length || 0,
          failCount: testResults.assertionResults?.filter((r: any) => r.status === 'failed').length || 0,
        });

        console.log(`  ✅ 完成: ${(duration / 1000).toFixed(2)}秒\n`);
      } catch (error) {
        console.error(`  ❌ 失败: ${error}\n`);
      }
    }

    const totalEndTime = performance.now();
    const totalDuration = totalEndTime - startTime;

    const totalTests = suites.reduce((sum, suite) => sum + suite.testCount, 0);
    const totalPassed = suites.reduce((sum, suite) => sum + suite.passCount, 0);
    const totalFailed = suites.reduce((sum, suite) => sum + suite.failCount, 0);

    const sortedByDuration = [...suites].sort((a, b) => b.duration - a.duration);

    const result: BenchmarkResult = {
      timestamp: new Date().toISOString(),
      totalDuration,
      suites,
      summary: {
        totalTests,
        totalPassed,
        totalFailed,
        avgDurationPerTest: totalDuration / totalTests,
        slowestSuite: sortedByDuration[0]?.name || 'N/A',
        fastestSuite: sortedByDuration[sortedByDuration.length - 1]?.name || 'N/A',
      },
    };

    this.results.push(result);
    this.saveResults();

    return result;
  }

  public printReport(result: BenchmarkResult): void {
    console.log('\n' + '='.repeat(80));
    console.log('📊 测试性能基准报告');
    console.log('='.repeat(80) + '\n');

    console.log(`⏱️  总执行时间: ${(result.totalDuration / 1000).toFixed(2)}秒`);
    console.log(`📈 测试总数: ${result.summary.totalTests}`);
    console.log(`✅ 通过: ${result.summary.totalPassed}`);
    console.log(`❌ 失败: ${result.summary.totalFailed}`);
    console.log(`📊 平均每个测试: ${result.summary.avgDurationPerTest.toFixed(2)}ms`);
    console.log(`🐌 最慢套件: ${result.summary.slowestSuite}`);
    console.log(`🚀 最快套件: ${result.summary.fastestSuite}`);

    console.log('\n' + '-'.repeat(80));
    console.log('📋 各测试套件详情:');
    console.log('-'.repeat(80) + '\n');

    const sortedSuites = [...result.suites].sort((a, b) => b.duration - a.duration);

    sortedSuites.forEach((suite, index) => {
      const percentage = (suite.duration / result.totalDuration * 100).toFixed(1);
      const bar = '█'.repeat(Math.floor(percentage / 2));

      console.log(`${index + 1}. ${suite.name}`);
      console.log(`   ⏱️  ${(suite.duration / 1000).toFixed(2)}秒 (${percentage}%) ${bar}`);
      console.log(`   📊 测试: ${suite.testCount} | ✅ ${suite.passCount} | ❌ ${suite.failCount}`);
      console.log('');
    });

    console.log('='.repeat(80) + '\n');
  }

  public compareWithPrevious(current: BenchmarkResult): void {
    if (this.results.length < 2) {
      console.log('⚠️  没有历史数据进行对比\n');
      return;
    }

    const previous = this.results[this.results.length - 2];
    const timeDiff = current.totalDuration - previous.totalDuration;
    const percentageChange = (timeDiff / previous.totalDuration * 100).toFixed(2);

    console.log('📊 与上次运行对比:');
    console.log(`   上次: ${(previous.totalDuration / 1000).toFixed(2)}秒`);
    console.log(`   本次: ${(current.totalDuration / 1000).toFixed(2)}秒`);
    console.log(`   差异: ${timeDiff > 0 ? '+' : ''}${(timeDiff / 1000).toFixed(2)}秒 (${percentageChange}%)`);

    if (timeDiff > 0) {
      console.log('   ⚠️  性能下降\n');
    } else if (timeDiff < 0) {
      console.log('   ✅ 性能提升\n');
    } else {
      console.log('   ➡️  性能持平\n');
    }
  }

  public getSlowTests(threshold: number = 1000): TestSuiteResult[] {
    const allResults = this.results[this.results.length - 1];
    return allResults.suites.filter(suite => suite.duration > threshold);
  }

  public getOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];
    const latestResult = this.results[this.results.length - 1];

    if (!latestResult) {
      return suggestions;
    }

    const slowTests = this.getSlowTests(2000);

    if (slowTests.length > 0) {
      suggestions.push('🐌 发现慢速测试套件:');
      slowTests.forEach(suite => {
        suggestions.push(`   - ${suite.name}: ${(suite.duration / 1000).toFixed(2)}秒`);
        suggestions.push(`     建议: 考虑使用mock、减少异步操作、优化测试数据`);
      });
      suggestions.push('');
    }

    if (latestResult.totalDuration > 300000) {
      suggestions.push('⚠️  总执行时间超过5分钟:');
      suggestions.push('   - 启用测试并行执行');
      suggestions.push('   - 实现测试结果缓存');
      suggestions.push('   - 优化长时间运行的测试用例');
      suggestions.push('');
    }

    const avgDuration = latestResult.summary.avgDurationPerTest;
    if (avgDuration > 100) {
      suggestions.push('⚠️  平均每个测试执行时间较长:');
      suggestions.push(`   - 当前: ${avgDuration.toFixed(2)}ms`);
      suggestions.push('   - 建议: 优化测试用例，减少不必要的操作');
      suggestions.push('');
    }

    return suggestions;
  }
}

export default TestPerformanceBenchmark;
