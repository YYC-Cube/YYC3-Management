// 性能测试框架 - 用于测试系统性能和响应时间
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,性能测试,框架

export interface PerformanceMetrics {
  name: string
  duration: number
  memoryUsage?: number
  cpuUsage?: number
  timestamp: number
}

export interface PerformanceThreshold {
  name: string
  maxDuration: number
  maxMemoryUsage?: number
  maxCpuUsage?: number
}

export interface PerformanceTestResult {
  testName: string
  passed: boolean
  metrics: PerformanceMetrics
  threshold: PerformanceThreshold
  violations: string[]
}

export class PerformanceTester {
  private results: PerformanceTestResult[] = []
  private thresholds: Map<string, PerformanceThreshold> = new Map()

  public setThreshold(threshold: PerformanceThreshold): void {
    this.thresholds.set(threshold.name, threshold)
  }

  public setThresholds(thresholds: PerformanceThreshold[]): void {
    thresholds.forEach(threshold => this.setThreshold(threshold))
  }

  public async measurePerformance<T>(
    name: string,
    fn: () => Promise<T> | T
  ): Promise<PerformanceMetrics & { result: T }> {
    const startTime = performance.now()
    const startMemory = this.getMemoryUsage()
    const startCpu = this.getCpuUsage()

    const result = await fn()

    const endTime = performance.now()
    const endMemory = this.getMemoryUsage()
    const endCpu = this.getCpuUsage()

    const metrics: PerformanceMetrics = {
      name,
      duration: endTime - startTime,
      memoryUsage: endMemory ? endMemory - startMemory : undefined,
      cpuUsage: endCpu ? endCpu - startCpu : undefined,
      timestamp: Date.now(),
    }

    return { ...metrics, result }
  }

  public async runPerformanceTest<T>(
    name: string,
    fn: () => Promise<T> | T
  ): Promise<PerformanceTestResult> {
    const metrics = await this.measurePerformance(name, fn)
    const threshold = this.thresholds.get(name)

    if (!threshold) {
      throw new Error(`No threshold defined for test: ${name}`)
    }

    const violations: string[] = []

    if (metrics.duration > threshold.maxDuration) {
      violations.push(
        `Duration ${metrics.duration}ms exceeds threshold ${threshold.maxDuration}ms`
      )
    }

    if (threshold.maxMemoryUsage && metrics.memoryUsage && metrics.memoryUsage > threshold.maxMemoryUsage) {
      violations.push(
        `Memory usage ${metrics.memoryUsage}MB exceeds threshold ${threshold.maxMemoryUsage}MB`
      )
    }

    if (threshold.maxCpuUsage && metrics.cpuUsage && metrics.cpuUsage > threshold.maxCpuUsage) {
      violations.push(
        `CPU usage ${metrics.cpuUsage}% exceeds threshold ${threshold.maxCpuUsage}%`
      )
    }

    const result: PerformanceTestResult = {
      testName: name,
      passed: violations.length === 0,
      metrics,
      threshold,
      violations,
    }

    this.results.push(result)
    return result
  }

  public getResults(): PerformanceTestResult[] {
    return this.results
  }

  public getFailedResults(): PerformanceTestResult[] {
    return this.results.filter(result => !result.passed)
  }

  public getPassedResults(): PerformanceTestResult[] {
    return this.results.filter(result => result.passed)
  }

  public clearResults(): void {
    this.results = []
  }

  public generateReport(): string {
    const passed = this.getPassedResults().length
    const failed = this.getFailedResults().length
    const total = this.results.length

    let report = `Performance Test Report\n`
    report += `====================\n\n`
    report += `Total Tests: ${total}\n`
    report += `Passed: ${passed}\n`
    report += `Failed: ${failed}\n`
    report += `Success Rate: ${((passed / total) * 100).toFixed(2)}%\n\n`

    if (failed > 0) {
      report += `Failed Tests:\n`
      report += `--------------\n`
      this.getFailedResults().forEach(result => {
        report += `\n${result.testName}:\n`
        report += `  Duration: ${result.metrics.duration}ms (threshold: ${result.threshold.maxDuration}ms)\n`
        result.violations.forEach(violation => {
          report += `  - ${violation}\n`
        })
      })
    }

    return report
  }

  private getMemoryUsage(): number | undefined {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed / 1024 / 1024
    }
    return undefined
  }

  private getCpuUsage(): number | undefined {
    return undefined
  }
}

export class LoadTester {
  private tester: PerformanceTester

  constructor(tester: PerformanceTester) {
    this.tester = tester
  }

  public async runLoadTest<T>(
    name: string,
    fn: () => Promise<T> | T,
    options: {
      concurrency: number
      iterations: number
      rampUpTime?: number
    }
  ): Promise<PerformanceTestResult[]> {
    const { concurrency, iterations, rampUpTime = 0 } = options
    const results: PerformanceTestResult[] = []

    const batchSize = Math.ceil(iterations / concurrency)
    const delay = rampUpTime > 0 ? rampUpTime / concurrency : 0

    for (let i = 0; i < concurrency; i++) {
      if (delay > 0 && i > 0) {
        await this.sleep(delay)
      }

      for (let j = 0; j < batchSize; j++) {
        const testName = `${name} [${i * batchSize + j + 1}]`
        const result = await this.tester.runPerformanceTest(testName, fn)
        results.push(result)
      }
    }

    return results
  }

  public async runStressTest<T>(
    name: string,
    fn: () => Promise<T> | T,
    options: {
      maxConcurrency: number
      duration: number
      rampUpTime?: number
    }
  ): Promise<PerformanceTestResult[]> {
    const { maxConcurrency, duration, rampUpTime = 0 } = options
    const results: PerformanceTestResult[] = []
    const startTime = Date.now()

    let currentConcurrency = 1
    const rampUpInterval = rampUpTime > 0 ? rampUpTime / maxConcurrency : 0

    while (Date.now() - startTime < duration) {
      const promises: Promise<PerformanceTestResult>[] = []

      for (let i = 0; i < currentConcurrency; i++) {
        const testName = `${name} [concurrency:${currentConcurrency}]`
        promises.push(this.tester.runPerformanceTest(testName, fn))
      }

      const batchResults = await Promise.all(promises)
      results.push(...batchResults)

      if (currentConcurrency < maxConcurrency && rampUpInterval > 0) {
        await this.sleep(rampUpInterval)
        currentConcurrency++
      }
    }

    return results
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export class PerformanceBenchmark {
  private benchmarks: Map<string, PerformanceMetrics[]> = new Map()

  public recordBenchmark(name: string, metrics: PerformanceMetrics): void {
    if (!this.benchmarks.has(name)) {
      this.benchmarks.set(name, [])
    }
    this.benchmarks.get(name)!.push(metrics)
  }

  public getBenchmark(name: string): PerformanceMetrics[] {
    return this.benchmarks.get(name) || []
  }

  public getAverageDuration(name: string): number {
    const metrics = this.getBenchmark(name)
    if (metrics.length === 0) return 0

    const total = metrics.reduce((sum, m) => sum + m.duration, 0)
    return total / metrics.length
  }

  public getMinDuration(name: string): number {
    const metrics = this.getBenchmark(name)
    if (metrics.length === 0) return 0

    return Math.min(...metrics.map(m => m.duration))
  }

  public getMaxDuration(name: string): number {
    const metrics = this.getBenchmark(name)
    if (metrics.length === 0) return 0

    return Math.max(...metrics.map(m => m.duration))
  }

  public getPercentile(name: string, percentile: number): number {
    const metrics = this.getBenchmark(name)
    if (metrics.length === 0) return 0

    const sorted = metrics.map(m => m.duration).sort((a, b) => a - b)
    const index = Math.ceil((percentile / 100) * sorted.length) - 1
    return sorted[index]
  }

  public compareBenchmarks(name1: string, name2: string): {
    name1: string
    name2: string
    average1: number
    average2: number
    improvement: number
    improvementPercent: number
  } {
    const average1 = this.getAverageDuration(name1)
    const average2 = this.getAverageDuration(name2)
    const improvement = average1 - average2
    const improvementPercent = (improvement / average1) * 100

    return {
      name1,
      name2,
      average1,
      average2,
      improvement,
      improvementPercent,
    }
  }

  public generateBenchmarkReport(): string {
    let report = `Performance Benchmark Report\n`
    report += `==========================\n\n`

    this.benchmarks.forEach((metrics, name) => {
      report += `${name}:\n`
      report += `  Average: ${this.getAverageDuration(name).toFixed(2)}ms\n`
      report += `  Min: ${this.getMinDuration(name).toFixed(2)}ms\n`
      report += `  Max: ${this.getMaxDuration(name).toFixed(2)}ms\n`
      report += `  P50: ${this.getPercentile(name, 50).toFixed(2)}ms\n`
      report += `  P90: ${this.getPercentile(name, 90).toFixed(2)}ms\n`
      report += `  P95: ${this.getPercentile(name, 95).toFixed(2)}ms\n`
      report += `  P99: ${this.getPercentile(name, 99).toFixed(2)}ms\n`
      report += `  Samples: ${metrics.length}\n\n`
    })

    return report
  }
}
