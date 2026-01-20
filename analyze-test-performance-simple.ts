import { execSync } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

interface TestSuiteResult {
  name: string;
  duration: number;
  testCount: number;
  passCount: number;
  failCount: number;
}

interface PerformanceReport {
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
  optimizationSuggestions: string[];
}

export class TestPerformanceAnalyzer {
  private resultsPath: string;

  constructor() {
    this.resultsPath = join(process.cwd(), 'test-performance-results.json');
  }

  public async analyzePerformance(): Promise<PerformanceReport> {
    console.log('🚀 开始测试性能分析...\n');

    const startTime = Date.now();
    const suites: TestSuiteResult[] = [];

    const testFiles = [
      { name: '数据导入导出功能测试', path: '__tests__/lib/utils/data-import-export.test.ts' },
      { name: '高级搜索功能测试', path: '__tests__/lib/utils/advanced-search.test.ts' },
      { name: '批量操作功能测试', path: '__tests__/lib/utils/batch-operations.test.ts' },
      { name: '虚拟滚动组件测试', path: '__tests__/components/ui/virtual-scroll.test.tsx' },
      { name: '拖拽排序功能测试', path: '__tests__/lib/utils/drag-drop.test.ts' },
      { name: '快捷键功能测试', path: '__tests__/lib/utils/keyboard-shortcuts.test.ts' },
    ];

    for (const testFile of testFiles) {
      console.log(`📊 运行: ${testFile.name}`);
      const suiteStartTime = Date.now();

      try {
        const output = execSync(
          `npx vitest run ${testFile.path} --reporter=json --no-coverage`,
          { encoding: 'utf-8', stdio: 'pipe', timeout: 60000 }
        );

        const suiteEndTime = Date.now();
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
      } catch (error: any) {
        const suiteEndTime = Date.now();
        const duration = suiteEndTime - suiteStartTime;

        console.error(`  ❌ 失败: ${error.message}\n`);

        suites.push({
          name: testFile.name,
          duration,
          testCount: 0,
          passCount: 0,
          failCount: 1,
        });
      }
    }

    const totalEndTime = Date.now();
    const totalDuration = totalEndTime - startTime;

    const totalTests = suites.reduce((sum, suite) => sum + suite.testCount, 0);
    const totalPassed = suites.reduce((sum, suite) => sum + suite.passCount, 0);
    const totalFailed = suites.reduce((sum, suite) => sum + suite.failCount, 0);
    const avgDurationPerTest = totalTests > 0 ? totalDuration / totalTests : 0;

    const sortedByDuration = [...suites].sort((a, b) => b.duration - a.duration);
    const sortedByDurationAsc = [...suites].sort((a, b) => a.duration - b.duration);

    const report: PerformanceReport = {
      timestamp: new Date().toISOString(),
      totalDuration,
      suites,
      summary: {
        totalTests,
        totalPassed,
        totalFailed,
        avgDurationPerTest,
        slowestSuite: sortedByDuration[0]?.name || 'N/A',
        fastestSuite: sortedByDurationAsc[0]?.name || 'N/A',
      },
      optimizationSuggestions: this.generateOptimizationSuggestions(suites, totalDuration),
    };

    this.saveResults(report);
    this.printReport(report);

    return report;
  }

  private generateOptimizationSuggestions(suites: TestSuiteResult[], totalDuration: number): string[] {
    const suggestions: string[] = [];

    const slowSuites = suites.filter(suite => suite.duration > 5000);
    const verySlowSuites = suites.filter(suite => suite.duration > 10000);

    if (slowSuites.length > 0) {
      suggestions.push(`\n🐌 发现 ${slowSuites.length} 个慢速测试套件（超过5秒）:`);
      slowSuites.forEach(suite => {
        const percentage = (suite.duration / totalDuration * 100).toFixed(1);
        suggestions.push(`  - ${suite.name}: ${(suite.duration / 1000).toFixed(2)}秒 (${percentage}%)`);
      });
    }

    if (verySlowSuites.length > 0) {
      suggestions.push(`\n🐌🐌 发现 ${verySlowSuites.length} 个超慢测试套件（超过10秒）:`);
      verySlowSuites.forEach(suite => {
        suggestions.push(`  - ${suite.name}: ${(suite.duration / 1000).toFixed(2)}秒`);
        suggestions.push(`    建议: 考虑拆分为多个小测试或使用mock优化`);
      });
    }

    if (totalDuration > 300000) {
      suggestions.push(`\n⚠️ 总测试执行时间超过5分钟 (${(totalDuration / 1000 / 60).toFixed(2)}分钟)`);
      suggestions.push(`  建议: 启用并行测试执行、优化测试用例、使用测试缓存`);
    } else if (totalDuration > 180000) {
      suggestions.push(`\n⚡ 总测试执行时间超过3分钟 (${(totalDuration / 1000 / 60).toFixed(2)}分钟)`);
      suggestions.push(`  建议: 仍有优化空间，可以考虑进一步优化`);
    } else {
      suggestions.push(`\n✅ 总测试执行时间在可接受范围内 (${(totalDuration / 1000 / 60).toFixed(2)}分钟)`);
    }

    return suggestions;
  }

  private printReport(report: PerformanceReport): void {
    console.log('\n' + '='.repeat(80));
    console.log('📊 测试性能分析报告');
    console.log('='.repeat(80) + '\n');

    console.log(`⏱️  总执行时间: ${(report.totalDuration / 1000 / 60).toFixed(2)}分钟`);
    console.log(`📊 总测试数: ${report.summary.totalTests}`);
    console.log(`✅ 通过: ${report.summary.totalPassed}`);
    console.log(`❌ 失败: ${report.summary.totalFailed}`);
    console.log(`📊 平均每个测试: ${(report.summary.avgDurationPerTest / 1000).toFixed(2)}秒`);
    console.log(`🐌 最慢套件: ${report.summary.slowestSuite}`);
    console.log(`⚡ 最快套件: ${report.summary.fastestSuite}\n`);

    console.log('-'.repeat(80));
    console.log('📋 测试套件详情:');
    console.log('-'.repeat(80) + '\n');

    const sortedSuites = [...report.suites].sort((a, b) => b.duration - a.duration);

    sortedSuites.forEach((suite, index) => {
      const percentage = (suite.duration / report.totalDuration * 100).toFixed(1);
      const bar = '█'.repeat(Math.floor(percentage / 2));
      console.log(`${index + 1}. ${suite.name}`);
      console.log(`   ⏱️  ${(suite.duration / 1000).toFixed(2)}秒 (${percentage}%) ${bar}`);
      console.log(`   📊 ${suite.testCount}个测试 | ✅ ${suite.passCount}通过 | ❌ ${suite.failCount}失败\n`);
    });

    if (report.optimizationSuggestions.length > 0) {
      console.log('-'.repeat(80));
      console.log('💡 优化建议:');
      console.log('-'.repeat(80));
      report.optimizationSuggestions.forEach(suggestion => {
        console.log(suggestion);
      });
      console.log('');
    }

    console.log('='.repeat(80) + '\n');
  }

  private saveResults(report: PerformanceReport): void {
    const results = this.loadResults();
    results.push(report);
    writeFileSync(this.resultsPath, JSON.stringify(results, null, 2));
    console.log(`💾 结果已保存到: ${this.resultsPath}\n`);
  }

  private loadResults(): PerformanceReport[] {
    try {
      const data = readFileSync(this.resultsPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  public compareWithPrevious(current: PerformanceReport): void {
    const results = this.loadResults();
    if (results.length < 2) {
      console.log('⚠️ 没有足够的历史数据进行对比\n');
      return;
    }

    const previous = results[results.length - 2];
    const durationDiff = current.totalDuration - previous.totalDuration;
    const durationPercent = (durationDiff / previous.totalDuration * 100).toFixed(1);

    console.log('📈 与上次运行对比:');
    console.log('='.repeat(80) + '\n');

    if (durationDiff < 0) {
      console.log(`✅ 执行时间减少了 ${(Math.abs(durationDiff) / 1000).toFixed(2)}秒 (${Math.abs(parseFloat(durationPercent))}%)`);
    } else {
      console.log(`⚠️ 执行时间增加了 ${(durationDiff / 1000).toFixed(2)}秒 (${durationPercent}%)`);
    }

    console.log(`上次: ${(previous.totalDuration / 1000 / 60).toFixed(2)}分钟`);
    console.log(`本次: ${(current.totalDuration / 1000 / 60).toFixed(2)}分钟\n`);

    const previousSlowSuites = previous.suites.filter(s => s.duration > 5000);
    const currentSlowSuites = current.suites.filter(s => s.duration > 5000);

    console.log(`慢速测试套件:`);
    console.log(`上次: ${previousSlowSuites.length}个`);
    console.log(`本次: ${currentSlowSuites.length}个\n`);

    console.log('='.repeat(80) + '\n');
  }
}

async function main() {
  const analyzer = new TestPerformanceAnalyzer();
  const report = await analyzer.analyzePerformance();
  analyzer.compareWithPrevious(report);
}

if (require.main === module) {
  main().catch(console.error);
}

export { TestPerformanceAnalyzer };
