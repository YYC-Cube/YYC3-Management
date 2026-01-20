// 性能测试示例 - 演示如何使用性能测试框架
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,性能测试,示例

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { PerformanceTester, LoadTester, PerformanceBenchmark } from "./helpers/performance-testing"

describe("Performance Testing Examples", () => {
  let tester: PerformanceTester
  let benchmark: PerformanceBenchmark

  beforeEach(() => {
    tester = new PerformanceTester()
    benchmark = new PerformanceBenchmark()

    tester.setThresholds([
      { name: "simple-addition", maxDuration: 1 },
      { name: "array-sort", maxDuration: 10 },
      { name: "data-processing", maxDuration: 100 },
      { name: "async-operation", maxDuration: 500 },
      { name: "complex-calculation", maxDuration: 1000 },
    ])
  })

  afterEach(() => {
    tester.clearResults()
  })

  describe("Simple Performance Tests", () => {
    it("should measure simple addition performance", async () => {
      const result = await tester.runPerformanceTest("simple-addition", () => {
        return 1 + 1
      })

      expect(result.passed).toBe(true)
      expect(result.metrics.duration).toBeLessThan(1)
    })

    it("should measure array sort performance", async () => {
      const data = Array.from({ length: 1000 }, (_, i) => Math.random())
      const result = await tester.runPerformanceTest("array-sort", () => {
        return data.sort((a, b) => a - b)
      })

      expect(result.passed).toBe(true)
      expect(result.metrics.duration).toBeLessThan(10)
    })

    it("should measure data processing performance", async () => {
      const data = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        value: Math.random(),
      }))

      const result = await tester.runPerformanceTest("data-processing", () => {
        return data.filter(item => item.value > 0.5).map(item => item.id)
      })

      expect(result.passed).toBe(true)
      expect(result.metrics.duration).toBeLessThan(100)
    })
  })

  describe("Async Performance Tests", () => {
    it("should measure async operation performance", async () => {
      const result = await tester.runPerformanceTest("async-operation", async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        return "done"
      })

      expect(result.passed).toBe(true)
      expect(result.metrics.duration).toBeGreaterThanOrEqual(100)
      expect(result.metrics.duration).toBeLessThan(500)
    })

    it("should measure multiple async operations", async () => {
      const result = await tester.runPerformanceTest("async-operation", async () => {
        const promises = Array.from({ length: 10 }, (_, i) =>
          new Promise(resolve => setTimeout(resolve, 10, i))
        )
        return await Promise.all(promises)
      })

      expect(result.passed).toBe(true)
      expect(result.metrics.duration).toBeLessThan(500)
    })
  })

  describe("Complex Performance Tests", () => {
    it("should measure complex calculation performance", async () => {
      const result = await tester.runPerformanceTest("complex-calculation", () => {
        let sum = 0
        for (let i = 0; i < 100000; i++) {
          sum += Math.sqrt(i)
        }
        return sum
      })

      expect(result.passed).toBe(true)
      expect(result.metrics.duration).toBeLessThan(1000)
    })

    it("should measure data transformation performance", async () => {
      const data = Array.from({ length: 5000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        value: Math.random() * 100,
      }))

      const result = await tester.runPerformanceTest("data-processing", () => {
        return data
          .filter(item => item.value > 50)
          .map(item => ({
            ...item,
            category: item.value > 75 ? "high" : "medium",
          }))
          .reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1
            return acc
          }, {} as Record<string, number>)
      })

      expect(result.passed).toBe(true)
      expect(result.metrics.duration).toBeLessThan(100)
    })
  })

  describe("Load Testing", () => {
    it("should run load test with multiple iterations", async () => {
      const loadTester = new LoadTester(tester)
      const results = await loadTester.runLoadTest(
        "simple-addition",
        () => 1 + 1,
        { concurrency: 10, iterations: 100 }
      )

      expect(results).toHaveLength(100)
      const failedResults = results.filter(r => !r.passed)
      expect(failedResults.length).toBe(0)
    })

    it("should run load test with ramp up", async () => {
      const loadTester = new LoadTester(tester)
      const results = await loadTester.runLoadTest(
        "async-operation",
        async () => {
          await new Promise(resolve => setTimeout(resolve, 10))
          return "done"
        },
        { concurrency: 5, iterations: 50, rampUpTime: 1000 }
      )

      expect(results).toHaveLength(50)
      const failedResults = results.filter(r => !r.passed)
      expect(failedResults.length).toBe(0)
    })
  })

  describe("Stress Testing", () => {
    it("should run stress test with increasing concurrency", async () => {
      const loadTester = new LoadTester(tester)
      const results = await loadTester.runStressTest(
        "simple-addition",
        () => 1 + 1,
        { maxConcurrency: 50, duration: 2000, rampUpTime: 1000 }
      )

      expect(results.length).toBeGreaterThan(0)
      const failedResults = results.filter(r => !r.passed)
      expect(failedResults.length).toBe(0)
    })

    it("should handle high concurrency stress test", async () => {
      const loadTester = new LoadTester(tester)
      const results = await loadTester.runStressTest(
        "data-processing",
        () => {
          const data = Array.from({ length: 100 }, (_, i) => ({
            id: i,
            value: Math.random(),
          }))
          return data.filter(item => item.value > 0.5)
        },
        { maxConcurrency: 20, duration: 1000, rampUpTime: 500 }
      )

      expect(results.length).toBeGreaterThan(0)
      const failedResults = results.filter(r => !r.passed)
      expect(failedResults.length).toBe(0)
    })
  })

  describe("Performance Benchmarking", () => {
    it("should record and compare benchmarks", async () => {
      const metrics1 = await tester.measurePerformance("benchmark-v1", () => {
        let sum = 0
        for (let i = 0; i < 10000; i++) {
          sum += i
        }
        return sum
      })

      benchmark.recordBenchmark("benchmark-v1", metrics1)

      const metrics2 = await tester.measurePerformance("benchmark-v2", () => {
        return (10000 * (10000 - 1)) / 2
      })

      benchmark.recordBenchmark("benchmark-v2", metrics2)

      const comparison = benchmark.compareBenchmarks("benchmark-v1", "benchmark-v2")

      expect(comparison.name1).toBe("benchmark-v1")
      expect(comparison.name2).toBe("benchmark-v2")
      expect(comparison.average1).toBeGreaterThan(0)
      expect(comparison.average2).toBeGreaterThan(0)
    })

    it("should calculate performance percentiles", async () => {
      for (let i = 0; i < 100; i++) {
        const metrics = await tester.measurePerformance("percentile-test", () => {
          const delay = Math.random() * 10
          let sum = 0
          for (let j = 0; j < delay * 1000; j++) {
            sum += j
          }
          return sum
        })
        benchmark.recordBenchmark("percentile-test", metrics)
      }

      const p50 = benchmark.getPercentile("percentile-test", 50)
      const p90 = benchmark.getPercentile("percentile-test", 90)
      const p95 = benchmark.getPercentile("percentile-test", 95)
      const p99 = benchmark.getPercentile("percentile-test", 99)

      expect(p50).toBeGreaterThan(0)
      expect(p90).toBeGreaterThanOrEqual(p50)
      expect(p95).toBeGreaterThanOrEqual(p90)
      expect(p99).toBeGreaterThanOrEqual(p95)
    })
  })

  describe("Performance Report Generation", () => {
    it("should generate performance test report", async () => {
      await tester.runPerformanceTest("simple-addition", () => 1 + 1)
      await tester.runPerformanceTest("array-sort", () => [1, 2, 3].sort((a, b) => a - b))

      const report = tester.generateReport()

      expect(report).toContain("Performance Test Report")
      expect(report).toContain("Total Tests:")
      expect(report).toContain("Passed:")
      expect(report).toContain("Failed:")
      expect(report).toContain("Success Rate:")
    })

    it("should generate benchmark report", async () => {
      for (let i = 0; i < 10; i++) {
        const metrics = await tester.measurePerformance("benchmark-test", () => {
          return Math.sqrt(i)
        })
        benchmark.recordBenchmark("benchmark-test", metrics)
      }

      const report = benchmark.generateBenchmarkReport()

      expect(report).toContain("Performance Benchmark Report")
      expect(report).toContain("benchmark-test:")
      expect(report).toContain("Average:")
      expect(report).toContain("Min:")
      expect(report).toContain("Max:")
      expect(report).toContain("P50:")
      expect(report).toContain("P90:")
      expect(report).toContain("P95:")
      expect(report).toContain("P99:")
    })
  })
})
