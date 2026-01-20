#!/usr/bin/env bun

// 质量门禁脚本 - 验证测试结果是否满足质量标准
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,质量门禁,CI/CD

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"

interface QualityGateConfig {
  minSuccessRate: number
  minCoverage: {
    statements: number
    branches: number
    functions: number
    lines: number
  }
  maxTestDuration: number
  maxSlowTests: number
  maxViolations: number
}

interface QualityGateResult {
  passed: boolean
  timestamp: string
  config: QualityGateConfig
  metrics: {
    successRate: number
    coverage: {
      statements: number
      branches: number
      functions: number
      lines: number
    }
    totalDuration: number
    averageDuration: number
    slowTests: number
    violations: number
  }
  violations: {
    category: string
    metric: string
    actual: number
    expected: number
    severity: "error" | "warning"
  }[]
  summary: string
}

class QualityGate {
  private config: QualityGateConfig
  private reportPath: string
  private outputPath: string

  constructor(
    reportPath: string = "./test-report/report.json",
    outputPath: string = "./quality-gate-results",
    config?: Partial<QualityGateConfig>
  ) {
    this.reportPath = reportPath
    this.outputPath = outputPath
    this.config = {
      minSuccessRate: 80,
      minCoverage: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
      maxTestDuration: 5000,
      maxSlowTests: 5,
      maxViolations: 0,
      ...config,
    }
  }

  public async check(): Promise<QualityGateResult> {
    const result: QualityGateResult = {
      passed: true,
      timestamp: new Date().toISOString(),
      config: this.config,
      metrics: {
        successRate: 0,
        coverage: {
          statements: 0,
          branches: 0,
          functions: 0,
          lines: 0,
        },
        totalDuration: 0,
        averageDuration: 0,
        slowTests: 0,
        violations: 0,
      },
      violations: [],
      summary: "",
    }

    if (!existsSync(this.reportPath)) {
      result.passed = false
      result.violations.push({
        category: "报告",
        metric: "测试报告",
        actual: 0,
        expected: 1,
        severity: "error",
      })
      result.summary = "测试报告不存在，无法执行质量门禁检查"
      this.writeResult(result)
      return result
    }

    const report = JSON.parse(readFileSync(this.reportPath, "utf-8"))

    this.checkSuccessRate(report, result)
    this.checkCoverage(report, result)
    this.checkPerformance(report, result)
    this.checkViolations(report, result)

    result.passed = result.violations.filter(v => v.severity === "error").length === 0
    result.summary = this.generateSummary(result)

    this.writeResult(result)

    return result
  }

  private checkSuccessRate(report: any, result: QualityGateResult): void {
    const successRate = report.summary?.successRate ?? 0
    result.metrics.successRate = successRate

    if (successRate < this.config.minSuccessRate) {
      result.violations.push({
        category: "测试通过率",
        metric: "成功率",
        actual: successRate,
        expected: this.config.minSuccessRate,
        severity: "error",
      })
    }
  }

  private checkCoverage(report: any, result: QualityGateResult): void {
    const coverage = report.coverage ?? {}
    result.metrics.coverage = {
      statements: coverage.statements ?? 0,
      branches: coverage.branches ?? 0,
      functions: coverage.functions ?? 0,
      lines: coverage.lines ?? 0,
    }

    if (coverage.statements < this.config.minCoverage.statements) {
      result.violations.push({
        category: "代码覆盖率",
        metric: "语句覆盖率",
        actual: coverage.statements,
        expected: this.config.minCoverage.statements,
        severity: "error",
      })
    }

    if (coverage.branches < this.config.minCoverage.branches) {
      result.violations.push({
        category: "代码覆盖率",
        metric: "分支覆盖率",
        actual: coverage.branches,
        expected: this.config.minCoverage.branches,
        severity: "error",
      })
    }

    if (coverage.functions < this.config.minCoverage.functions) {
      result.violations.push({
        category: "代码覆盖率",
        metric: "函数覆盖率",
        actual: coverage.functions,
        expected: this.config.minCoverage.functions,
        severity: "error",
      })
    }

    if (coverage.lines < this.config.minCoverage.lines) {
      result.violations.push({
        category: "代码覆盖率",
        metric: "行覆盖率",
        actual: coverage.lines,
        expected: this.config.minCoverage.lines,
        severity: "error",
      })
    }
  }

  private checkPerformance(report: any, result: QualityGateResult): void {
    const totalDuration = report.summary?.totalDuration ?? 0
    const totalTests = report.summary?.totalTests ?? 0
    const averageDuration = totalTests > 0 ? totalDuration / totalTests : 0

    result.metrics.totalDuration = totalDuration
    result.metrics.averageDuration = averageDuration

    const slowTests = this.countSlowTests(report)
    result.metrics.slowTests = slowTests

    if (averageDuration > this.config.maxTestDuration) {
      result.violations.push({
        category: "性能",
        metric: "平均测试执行时间",
        actual: averageDuration,
        expected: this.config.maxTestDuration,
        severity: "warning",
      })
    }

    if (slowTests > this.config.maxSlowTests) {
      result.violations.push({
        category: "性能",
        metric: "慢速测试数量",
        actual: slowTests,
        expected: this.config.maxSlowTests,
        severity: "warning",
      })
    }
  }

  private countSlowTests(report: any): number {
    let count = 0

    const categories = Object.values(report.categories || {})
    categories.forEach((category: any) => {
      if (Array.isArray(category)) {
        category.forEach((test: any) => {
          if (test.duration > this.config.maxTestDuration) {
            count++
          }
        })
      }
    })

    return count
  }

  private checkViolations(report: any, result: QualityGateResult): void {
    const violations = report.violations ?? []
    result.metrics.violations = violations.length

    if (violations.length > this.config.maxViolations) {
      result.violations.push({
        category: "质量",
        metric: "违规项数量",
        actual: violations.length,
        expected: this.config.maxViolations,
        severity: "error",
      })
    }
  }

  private generateSummary(result: QualityGateResult): string {
    if (result.passed) {
      return "✅ 质量门禁检查通过"
    }

    const errorViolations = result.violations.filter(v => v.severity === "error")
    const warningViolations = result.violations.filter(v => v.severity === "warning")

    let summary = "❌ 质量门禁检查失败\n\n"

    if (errorViolations.length > 0) {
      summary += "错误:\n"
      errorViolations.forEach(violation => {
        summary += `  - ${violation.category}: ${violation.metric} (${violation.actual.toFixed(2)} < ${violation.expected})\n`
      })
      summary += "\n"
    }

    if (warningViolations.length > 0) {
      summary += "警告:\n"
      warningViolations.forEach(violation => {
        summary += `  - ${violation.category}: ${violation.metric} (${violation.actual.toFixed(2)} > ${violation.expected})\n`
      })
      summary += "\n"
    }

    summary += "请修复以上问题后重新提交"

    return summary
  }

  private writeResult(result: QualityGateResult): void {
    if (!existsSync(this.outputPath)) {
      mkdirSync(this.outputPath, { recursive: true })
    }

    const jsonPath = join(this.outputPath, "result.json")
    const markdownPath = join(this.outputPath, "summary.md")

    writeFileSync(jsonPath, JSON.stringify(result, null, 2), "utf-8")
    writeFileSync(markdownPath, this.generateMarkdownReport(result), "utf-8")

    console.log(`Quality gate result generated:`)
    console.log(`  JSON: ${jsonPath}`)
    console.log(`  Markdown: ${markdownPath}`)
    console.log(`\n${result.summary}`)
  }

  private generateMarkdownReport(result: QualityGateResult): string {
    let markdown = `# 质量门禁检查结果\n\n`
    markdown += `**检查时间**: ${result.timestamp}\n\n`

    markdown += `## 检查状态\n\n`
    markdown += result.passed ? "✅ **通过**" : "❌ **失败**\n\n"

    markdown += `## 质量指标\n\n`
    markdown += `| 指标 | 实际值 | 期望值 | 状态 |\n`
    markdown += `|------|--------|--------|------|\n`
    markdown += `| 测试通过率 | ${result.metrics.successRate.toFixed(2)}% | ${this.config.minSuccessRate}% | ${result.metrics.successRate >= this.config.minSuccessRate ? "✅" : "❌"} |\n`
    markdown += `| 语句覆盖率 | ${result.metrics.coverage.statements.toFixed(2)}% | ${this.config.minCoverage.statements}% | ${result.metrics.coverage.statements >= this.config.minCoverage.statements ? "✅" : "❌"} |\n`
    markdown += `| 分支覆盖率 | ${result.metrics.coverage.branches.toFixed(2)}% | ${this.config.minCoverage.branches}% | ${result.metrics.coverage.branches >= this.config.minCoverage.branches ? "✅" : "❌"} |\n`
    markdown += `| 函数覆盖率 | ${result.metrics.coverage.functions.toFixed(2)}% | ${this.config.minCoverage.functions}% | ${result.metrics.coverage.functions >= this.config.minCoverage.functions ? "✅" : "❌"} |\n`
    markdown += `| 行覆盖率 | ${result.metrics.coverage.lines.toFixed(2)}% | ${this.config.minCoverage.lines}% | ${result.metrics.coverage.lines >= this.config.minCoverage.lines ? "✅" : "❌"} |\n`
    markdown += `| 平均测试执行时间 | ${result.metrics.averageDuration.toFixed(2)}ms | ${this.config.maxTestDuration}ms | ${result.metrics.averageDuration <= this.config.maxTestDuration ? "✅" : "⚠️"} |\n`
    markdown += `| 慢速测试数量 | ${result.metrics.slowTests} | ${this.config.maxSlowTests} | ${result.metrics.slowTests <= this.config.maxSlowTests ? "✅" : "⚠️"} |\n`
    markdown += `| 违规项数量 | ${result.metrics.violations} | ${this.config.maxViolations} | ${result.metrics.violations <= this.config.maxViolations ? "✅" : "❌"} |\n\n`

    if (result.violations.length > 0) {
      markdown += `## 违规项\n\n`

      const errorViolations = result.violations.filter(v => v.severity === "error")
      const warningViolations = result.violations.filter(v => v.severity === "warning")

      if (errorViolations.length > 0) {
        markdown += `### 错误\n\n`
        errorViolations.forEach(violation => {
          markdown += `- **${violation.category}**: ${violation.metric} (${violation.actual.toFixed(2)} < ${violation.expected})\n`
        })
        markdown += `\n`
      }

      if (warningViolations.length > 0) {
        markdown += `### 警告\n\n`
        warningViolations.forEach(violation => {
          markdown += `- **${violation.category}**: ${violation.metric} (${violation.actual.toFixed(2)} > ${violation.expected})\n`
        })
        markdown += `\n`
      }
    }

    markdown += `## 总结\n\n`
    markdown += result.summary

    return markdown
  }
}

async function main() {
  const gate = new QualityGate()
  const result = await gate.check()

  if (!result.passed) {
    process.exit(1)
  }
}

main().catch(console.error)
