// 混沌工程测试框架 - 用于测试系统在故障情况下的表现
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,混沌工程,故障注入

export interface ChaosExperiment {
  name: string
  description: string
  hypothesis: string
  steadyState: () => Promise<any>
  method: () => Promise<void>
  rollback: () => Promise<void>
  metrics: ChaosMetric[]
}

export interface ChaosMetric {
  name: string
  type: "counter" | "gauge" | "histogram"
  value: number
  threshold?: number
}

export interface ChaosResult {
  experimentName: string
  passed: boolean
  duration: number
  metrics: ChaosMetric[]
  violations: string[]
  errors: string[]
}

export interface FaultInjectionOptions {
  delay?: number
  errorRate?: number
  timeout?: number
  cpuLoad?: number
  memoryLimit?: number
}

export class ChaosEngine {
  private experiments: Map<string, ChaosExperiment> = new Map()
  private results: ChaosResult[] = []
  private isRunning: boolean = false

  public registerExperiment(experiment: ChaosExperiment): void {
    this.experiments.set(experiment.name, experiment)
  }

  public async runExperiment(name: string): Promise<ChaosResult> {
    const experiment = this.experiments.get(name)
    if (!experiment) {
      throw new Error(`Experiment not found: ${name}`)
    }

    const startTime = Date.now()
    const result: ChaosResult = {
      experimentName: name,
      passed: true,
      duration: 0,
      metrics: [],
      violations: [],
      errors: [],
    }

    try {
      this.isRunning = true

      const steadyState = await experiment.steadyState()

      await experiment.method()

      const newState = await experiment.steadyState()

      experiment.metrics.forEach(metric => {
        const metricValue = this.measureMetric(metric, steadyState, newState)
        result.metrics.push(metricValue)

        if (metric.threshold !== undefined && metricValue.value > metric.threshold) {
          result.violations.push(
            `${metric.name} exceeded threshold: ${metricValue.value} > ${metric.threshold}`
          )
          result.passed = false
        }
      })

      await experiment.rollback()

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : String(error))
      result.passed = false
    } finally {
      this.isRunning = false
      result.duration = Date.now() - startTime
      this.results.push(result)
    }

    return result
  }

  public async runAllExperiments(): Promise<ChaosResult[]> {
    const results: ChaosResult[] = []

    for (const name of this.experiments.keys()) {
      const result = await this.runExperiment(name)
      results.push(result)
    }

    return results
  }

  public getResults(): ChaosResult[] {
    return this.results
  }

  public getFailedResults(): ChaosResult[] {
    return this.results.filter(result => !result.passed)
  }

  public getPassedResults(): ChaosResult[] {
    return this.results.filter(result => result.passed)
  }

  public clearResults(): void {
    this.results = []
  }

  public generateReport(): string {
    const passed = this.getPassedResults().length
    const failed = this.getFailedResults().length
    const total = this.results.length

    let report = `Chaos Engineering Test Report\n`
    report += `==============================\n\n`
    report += `Total Experiments: ${total}\n`
    report += `Passed: ${passed}\n`
    report += `Failed: ${failed}\n`
    report += `Success Rate: ${((passed / total) * 100).toFixed(2)}%\n\n`

    if (failed > 0) {
      report += `Failed Experiments:\n`
      report += `-------------------\n`
      this.getFailedResults().forEach(result => {
        report += `\n${result.experimentName}:\n`
        report += `  Duration: ${result.duration}ms\n`
        result.violations.forEach(violation => {
          report += `  - ${violation}\n`
        })
        result.errors.forEach(error => {
          report += `  Error: ${error}\n`
        })
      })
    }

    return report
  }

  private measureMetric(
    metric: ChaosMetric,
    steadyState: any,
    newState: any
  ): ChaosMetric {
    const value = this.calculateMetricValue(metric, steadyState, newState)
    return {
      ...metric,
      value,
    }
  }

  private calculateMetricValue(
    metric: ChaosMetric,
    steadyState: any,
    newState: any
  ): number {
    switch (metric.type) {
      case "counter":
        return (newState[metric.name] || 0) - (steadyState[metric.name] || 0)
      case "gauge":
        return newState[metric.name] || 0
      case "histogram":
        return newState[metric.name] || 0
      default:
        return 0
    }
  }
}

export class FaultInjector {
  private injectedFaults: Map<string, () => void> = new Map()

  public injectNetworkDelay(delay: number): () => void {
    const originalFetch = global.fetch

    const delayedFetch = async (...args: any[]) => {
      await new Promise(resolve => setTimeout(resolve, delay))
      return originalFetch(...args)
    }

    global.fetch = delayedFetch

    const cleanup = () => {
      global.fetch = originalFetch
    }

    this.injectedFaults.set("network-delay", cleanup)
    return cleanup
  }

  public injectNetworkError(errorRate: number): () => void {
    const originalFetch = global.fetch

    const errorFetch = async (...args: any[]) => {
      if (Math.random() < errorRate) {
        throw new Error("Network error injected")
      }
      return originalFetch(...args)
    }

    global.fetch = errorFetch

    const cleanup = () => {
      global.fetch = originalFetch
    }

    this.injectedFaults.set("network-error", cleanup)
    return cleanup
  }

  public injectTimeout(timeout: number): () => void {
    const originalFetch = global.fetch

    const timeoutFetch = async (...args: any[]) => {
      await Promise.race([
        originalFetch(...args),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout injected")), timeout)
        ),
      ])
    }

    global.fetch = timeoutFetch

    const cleanup = () => {
      global.fetch = originalFetch
    }

    this.injectedFaults.set("timeout", cleanup)
    return cleanup
  }

  public injectCpuLoad(load: number): () => void {
    const interval = setInterval(() => {
      const start = Date.now()
      while (Date.now() - start < load) {
        Math.sqrt(Math.random() * 10000)
      }
    }, 100)

    const cleanup = () => {
      clearInterval(interval)
    }

    this.injectedFaults.set("cpu-load", cleanup)
    return cleanup
  }

  public injectMemoryLimit(limit: number): () => void {
    const data: any[] = []
    const interval = setInterval(() => {
      const chunk = new Array(1024 * 1024).fill(0)
      data.push(chunk)

      if (data.length > limit) {
        data.shift()
      }
    }, 100)

    const cleanup = () => {
      clearInterval(interval)
      data.length = 0
    }

    this.injectedFaults.set("memory-limit", cleanup)
    return cleanup
  }

  public injectRandomFaults(options: FaultInjectionOptions): () => void {
    const cleanups: (() => void)[] = []

    if (options.delay) {
      cleanups.push(this.injectNetworkDelay(options.delay))
    }

    if (options.errorRate) {
      cleanups.push(this.injectNetworkError(options.errorRate))
    }

    if (options.timeout) {
      cleanups.push(this.injectTimeout(options.timeout))
    }

    if (options.cpuLoad) {
      cleanups.push(this.injectCpuLoad(options.cpuLoad))
    }

    if (options.memoryLimit) {
      cleanups.push(this.injectMemoryLimit(options.memoryLimit))
    }

    const cleanup = () => {
      cleanups.forEach(c => c())
    }

    this.injectedFaults.set("random-faults", cleanup)
    return cleanup
  }

  public clearAllFaults(): void {
    this.injectedFaults.forEach(cleanup => cleanup())
    this.injectedFaults.clear()
  }
}

export class ChaosTestBuilder {
  private experiment: Partial<ChaosExperiment> = {
    metrics: [],
  }

  public withName(name: string): ChaosTestBuilder {
    this.experiment.name = name
    return this
  }

  public withDescription(description: string): ChaosTestBuilder {
    this.experiment.description = description
    return this
  }

  public withHypothesis(hypothesis: string): ChaosTestBuilder {
    this.experiment.hypothesis = hypothesis
    return this
  }

  public withSteadyState(steadyState: () => Promise<any>): ChaosTestBuilder {
    this.experiment.steadyState = steadyState
    return this
  }

  public withMethod(method: () => Promise<void>): ChaosTestBuilder {
    this.experiment.method = method
    return this
  }

  public withRollback(rollback: () => Promise<void>): ChaosTestBuilder {
    this.experiment.rollback = rollback
    return this
  }

  public withMetric(metric: ChaosMetric): ChaosTestBuilder {
    if (!this.experiment.metrics) {
      this.experiment.metrics = []
    }
    this.experiment.metrics.push(metric)
    return this
  }

  public build(): ChaosExperiment {
    if (!this.experiment.name) {
      throw new Error("Experiment name is required")
    }
    if (!this.experiment.steadyState) {
      throw new Error("Steady state is required")
    }
    if (!this.experiment.method) {
      throw new Error("Method is required")
    }
    if (!this.experiment.rollback) {
      throw new Error("Rollback is required")
    }

    return this.experiment as ChaosExperiment
  }
}
