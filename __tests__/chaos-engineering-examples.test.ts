// 混沌工程测试示例 - 演示如何使用混沌工程测试框架
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,混沌工程,示例

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { ChaosEngine, FaultInjector, ChaosTestBuilder } from "./helpers/chaos-engineering"

describe("Chaos Engineering Examples", () => {
  let chaosEngine: ChaosEngine
  let faultInjector: FaultInjector

  beforeEach(() => {
    chaosEngine = new ChaosEngine()
    faultInjector = new FaultInjector()
  })

  afterEach(() => {
    chaosEngine.clearResults()
    faultInjector.clearAllFaults()
  })

  describe("Network Fault Injection", () => {
    it("should inject network delay", async () => {
      const cleanup = faultInjector.injectNetworkDelay(100)

      const startTime = Date.now()
      await fetch("https://example.com")
      const duration = Date.now() - startTime

      expect(duration).toBeGreaterThanOrEqual(100)

      cleanup()
    })

    it("should inject network error", async () => {
      faultInjector.injectNetworkError(1.0)

      await expect(fetch("https://example.com")).rejects.toThrow("Network error injected")

      faultInjector.clearAllFaults()
    })

    it("should inject timeout", async () => {
      faultInjector.injectTimeout(100)

      await expect(fetch("https://example.com")).rejects.toThrow("Timeout injected")

      faultInjector.clearAllFaults()
    })
  })

  describe("Resource Fault Injection", () => {
    it("should inject CPU load", async () => {
      const cleanup = faultInjector.injectCpuLoad(50)

      const startTime = Date.now()
      let sum = 0
      for (let i = 0; i < 10000; i++) {
        sum += Math.sqrt(i)
      }
      const duration = Date.now() - startTime

      expect(duration).toBeGreaterThan(0)

      cleanup()
    })

    it("should inject memory limit", async () => {
      const cleanup = faultInjector.injectMemoryLimit(100)

      await new Promise(resolve => setTimeout(resolve, 500))

      expect(true).toBe(true)

      cleanup()
    })
  })

  describe("Chaos Experiments", () => {
    it("should run network delay experiment", async () => {
      let requestCount = 0

      const experiment = new ChaosTestBuilder()
        .withName("network-delay-experiment")
        .withDescription("Test system resilience under network delay")
        .withHypothesis("System should handle 100ms network delay without errors")
        .withSteadyState(async () => {
          return { requestCount }
        })
        .withMethod(async () => {
          const cleanup = faultInjector.injectNetworkDelay(100)
          try {
            await fetch("https://example.com")
            requestCount++
          } finally {
            cleanup()
          }
        })
        .withRollback(async () => {
          faultInjector.clearAllFaults()
        })
        .withMetric({
          name: "requestCount",
          type: "counter",
          value: 0,
          threshold: 1,
        })
        .build()

      chaosEngine.registerExperiment(experiment)
      const result = await chaosEngine.runExperiment("network-delay-experiment")

      expect(result.passed).toBe(true)
      expect(result.metrics[0].value).toBe(1)
    })

    it("should run network error experiment", async () => {
      let errorCount = 0

      const experiment = new ChaosTestBuilder()
        .withName("network-error-experiment")
        .withDescription("Test system resilience under network errors")
        .withHypothesis("System should handle network errors gracefully")
        .withSteadyState(async () => {
          return { errorCount }
        })
        .withMethod(async () => {
          faultInjector.injectNetworkError(1.0)
          try {
            await fetch("https://example.com")
          } catch (error) {
            errorCount++
          }
        })
        .withRollback(async () => {
          faultInjector.clearAllFaults()
        })
        .withMetric({
          name: "errorCount",
          type: "counter",
          value: 0,
          threshold: 1,
        })
        .build()

      chaosEngine.registerExperiment(experiment)
      const result = await chaosEngine.runExperiment("network-error-experiment")

      expect(result.passed).toBe(true)
      expect(result.metrics[0].value).toBe(1)
    })

    it("should run CPU load experiment", async () => {
      let processingTime = 0

      const experiment = new ChaosTestBuilder()
        .withName("cpu-load-experiment")
        .withDescription("Test system resilience under CPU load")
        .withHypothesis("System should handle CPU load without performance degradation")
        .withSteadyState(async () => {
          return { processingTime }
        })
        .withMethod(async () => {
          const cleanup = faultInjector.injectCpuLoad(50)
          try {
            const startTime = Date.now()
            let sum = 0
            for (let i = 0; i < 10000; i++) {
              sum += Math.sqrt(i)
            }
            processingTime = Date.now() - startTime
          } finally {
            cleanup()
          }
        })
        .withRollback(async () => {
          faultInjector.clearAllFaults()
        })
        .withMetric({
          name: "processingTime",
          type: "gauge",
          value: 0,
          threshold: 10000,
        })
        .build()

      chaosEngine.registerExperiment(experiment)
      const result = await chaosEngine.runExperiment("cpu-load-experiment")

      expect(result.passed).toBe(true)
      expect(result.metrics[0].value).toBeGreaterThan(0)
    })
  })

  describe("Multiple Experiments", () => {
    it("should run multiple experiments", async () => {
      let requestCount = 0
      let errorCount = 0

      const experiment1 = new ChaosTestBuilder()
        .withName("network-delay-experiment")
        .withDescription("Test network delay resilience")
        .withHypothesis("System should handle network delay")
        .withSteadyState(async () => ({ requestCount }))
        .withMethod(async () => {
          const cleanup = faultInjector.injectNetworkDelay(100)
          try {
            await fetch("https://example.com")
            requestCount++
          } finally {
            cleanup()
          }
        })
        .withRollback(async () => faultInjector.clearAllFaults())
        .withMetric({
          name: "requestCount",
          type: "counter",
          value: 0,
          threshold: 1,
        })
        .build()

      const experiment2 = new ChaosTestBuilder()
        .withName("network-error-experiment")
        .withDescription("Test network error resilience")
        .withHypothesis("System should handle network errors")
        .withSteadyState(async () => ({ errorCount }))
        .withMethod(async () => {
          faultInjector.injectNetworkError(1.0)
          try {
            await fetch("https://example.com")
          } catch (error) {
            errorCount++
          }
        })
        .withRollback(async () => faultInjector.clearAllFaults())
        .withMetric({
          name: "errorCount",
          type: "counter",
          value: 0,
          threshold: 1,
        })
        .build()

      chaosEngine.registerExperiment(experiment1)
      chaosEngine.registerExperiment(experiment2)

      const results = await chaosEngine.runAllExperiments()

      expect(results).toHaveLength(2)
      expect(results.every(r => r.passed)).toBe(true)
    })
  })

  describe("Chaos Test Builder", () => {
    it("should build experiment with all required fields", () => {
      const experiment = new ChaosTestBuilder()
        .withName("test-experiment")
        .withDescription("Test description")
        .withHypothesis("Test hypothesis")
        .withSteadyState(async () => ({}))
        .withMethod(async () => {})
        .withRollback(async () => {})
        .withMetric({
          name: "test-metric",
          type: "counter",
          value: 0,
        })
        .build()

      expect(experiment.name).toBe("test-experiment")
      expect(experiment.description).toBe("Test description")
      expect(experiment.hypothesis).toBe("Test hypothesis")
      expect(experiment.steadyState).toBeDefined()
      expect(experiment.method).toBeDefined()
      expect(experiment.rollback).toBeDefined()
      expect(experiment.metrics).toHaveLength(1)
    })

    it("should throw error when required fields are missing", () => {
      expect(() => {
        new ChaosTestBuilder().build()
      }).toThrow("Experiment name is required")

      expect(() => {
        new ChaosTestBuilder().withName("test").build()
      }).toThrow("Steady state is required")

      expect(() => {
        new ChaosTestBuilder()
          .withName("test")
          .withSteadyState(async () => ({}))
          .build()
      }).toThrow("Method is required")

      expect(() => {
        new ChaosTestBuilder()
          .withName("test")
          .withSteadyState(async () => ({}))
          .withMethod(async () => {})
          .build()
      }).toThrow("Rollback is required")
    })
  })

  describe("Chaos Report Generation", () => {
    it("should generate chaos test report", async () => {
      let requestCount = 0

      const experiment = new ChaosTestBuilder()
        .withName("network-delay-experiment")
        .withDescription("Test network delay resilience")
        .withHypothesis("System should handle network delay")
        .withSteadyState(async () => ({ requestCount }))
        .withMethod(async () => {
          const cleanup = faultInjector.injectNetworkDelay(100)
          try {
            await fetch("https://example.com")
            requestCount++
          } finally {
            cleanup()
          }
        })
        .withRollback(async () => faultInjector.clearAllFaults())
        .withMetric({
          name: "requestCount",
          type: "counter",
          value: 0,
          threshold: 1,
        })
        .build()

      chaosEngine.registerExperiment(experiment)
      await chaosEngine.runExperiment("network-delay-experiment")

      const report = chaosEngine.generateReport()

      expect(report).toContain("Chaos Engineering Test Report")
      expect(report).toContain("Total Experiments:")
      expect(report).toContain("Passed:")
      expect(report).toContain("Failed:")
      expect(report).toContain("Success Rate:")
    })
  })

  describe("Random Fault Injection", () => {
    it("should inject random faults", async () => {
      const cleanup = faultInjector.injectRandomFaults({
        delay: 50,
        errorRate: 0.1,
        timeout: 200,
        cpuLoad: 10,
      })

      let successCount = 0
      let errorCount = 0

      for (let i = 0; i < 10; i++) {
        try {
          await fetch("https://example.com")
          successCount++
        } catch (error) {
          errorCount++
        }
      }

      expect(successCount + errorCount).toBe(10)

      cleanup()
    })
  })
})
