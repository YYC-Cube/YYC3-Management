#!/usr/bin/env bun

// 测试报告生成脚本 - 生成综合测试报告
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,报告生成,CI/CD

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"

interface TestResult {
  name: string
  passed: boolean
  duration: number
  coverage?: number
  metrics?: Record<string, number>
}

interface TestReport {
  timestamp: string
  summary: {
    totalTests: number
    passedTests: number
    failedTests: number
    successRate: number
    totalDuration: number
    averageDuration: number
  }
  categories: {
    unit: TestResult[]
    integration: TestResult[]
    e2e: TestResult[]
    performance: TestResult[]
    mutation: TestResult[]
    chaos: TestResult[]
    visual: TestResult[]
  }
  coverage: {
    statements: number
    branches: number
    functions: number
    lines: number
  }
  violations: string[]
  recommendations: string[]
}

class TestReportGenerator {
  private resultsDir: string
  private outputDir: string

  constructor(resultsDir: string = "./test-results", outputDir: string = "./test-report") {
    this.resultsDir = resultsDir
    this.outputDir = outputDir
  }

  public async generateReport(): Promise<TestReport> {
    const report: TestReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        successRate: 0,
        totalDuration: 0,
        averageDuration: 0,
      },
      categories: {
        unit: [],
        integration: [],
        e2e: [],
        performance: [],
        mutation: [],
        chaos: [],
        visual: [],
      },
      coverage: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
      violations: [],
      recommendations: [],
    }

    this.collectTestResults(report)
    this.calculateSummary(report)
    this.collectCoverage(report)
    this.analyzeViolations(report)
    this.generateRecommendations(report)

    this.writeReport(report)

    return report
  }

  private collectTestResults(report: TestReport): void {
    const categories = ["unit", "integration", "e2e", "performance", "mutation", "chaos", "visual"]

    categories.forEach(category => {
      const categoryDir = join(this.resultsDir, category)
      if (existsSync(categoryDir)) {
        const files = this.readDirectory(categoryDir)
        files.forEach(file => {
          const result = this.parseTestResult(join(categoryDir, file))
          if (result) {
            report.categories[category as keyof typeof report.categories].push(result)
          }
        })
      }
    })
  }

  private parseTestResult(filePath: string): TestResult | null {
    try {
      const content = readFileSync(filePath, "utf-8")
      const data = JSON.parse(content)

      return {
        name: data.name || filePath,
        passed: data.passed ?? true,
        duration: data.duration ?? 0,
        coverage: data.coverage,
        metrics: data.metrics,
      }
    } catch (error) {
      console.error(`Failed to parse test result: ${filePath}`, error)
      return null
    }
  }

  private calculateSummary(report: TestReport): void {
    const allResults = Object.values(report.categories).flat()

    report.summary.totalTests = allResults.length
    report.summary.passedTests = allResults.filter(r => r.passed).length
    report.summary.failedTests = allResults.filter(r => !r.passed).length
    report.summary.successRate = report.summary.totalTests > 0
      ? (report.summary.passedTests / report.summary.totalTests) * 100
      : 0
    report.summary.totalDuration = allResults.reduce((sum, r) => sum + r.duration, 0)
    report.summary.averageDuration = report.summary.totalTests > 0
      ? report.summary.totalDuration / report.summary.totalTests
      : 0
  }

  private collectCoverage(report: TestReport): void {
    const coverageFile = join(this.resultsDir, "coverage", "coverage-summary.json")
    if (existsSync(coverageFile)) {
      try {
        const content = readFileSync(coverageFile, "utf-8")
        const data = JSON.parse(content)

        report.coverage.statements = data.total?.statements?.pct ?? 0
        report.coverage.branches = data.total?.branches?.pct ?? 0
        report.coverage.functions = data.total?.functions?.pct ?? 0
        report.coverage.lines = data.total?.lines?.pct ?? 0
      } catch (error) {
        console.error("Failed to parse coverage data", error)
      }
    }
  }

  private analyzeViolations(report: TestReport): void {
    if (report.summary.successRate < 80) {
      report.violations.push("测试通过率低于80%")
    }

    if (report.coverage.statements < 80) {
      report.violations.push("语句覆盖率低于80%")
    }

    if (report.coverage.branches < 80) {
      report.violations.push("分支覆盖率低于80%")
    }

    if (report.coverage.functions < 80) {
      report.violations.push("函数覆盖率低于80%")
    }

    if (report.coverage.lines < 80) {
      report.violations.push("行覆盖率低于80%")
    }

    const failedTests = Object.values(report.categories).flat().filter(r => !r.passed)
    if (failedTests.length > 0) {
      report.violations.push(`有${failedTests.length}个测试失败`)
    }
  }

  private generateRecommendations(report: TestReport): void {
    if (report.summary.successRate < 80) {
      report.recommendations.push("审查失败的测试用例，修复相关问题")
    }

    if (report.coverage.statements < 80) {
      report.recommendations.push("增加测试用例以提高语句覆盖率")
    }

    if (report.coverage.branches < 80) {
      report.recommendations.push("增加边界条件测试以提高分支覆盖率")
    }

    if (report.summary.averageDuration > 1000) {
      report.recommendations.push("优化测试执行时间，考虑并行执行")
    }

    if (report.categories.performance.length > 0) {
      const slowTests = report.categories.performance.filter(t => t.duration > 5000)
      if (slowTests.length > 0) {
        report.recommendations.push(`优化${slowTests.length}个慢速性能测试`)
      }
    }
  }

  private writeReport(report: TestReport): void {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true })
    }

    const summaryPath = join(this.outputDir, "summary.md")
    const jsonPath = join(this.outputDir, "report.json")

    writeFileSync(summaryPath, this.generateMarkdownReport(report), "utf-8")
    writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf-8")

    console.log(`Test report generated:`)
    console.log(`  Summary: ${summaryPath}`)
    console.log(`  JSON: ${jsonPath}`)
  }

  private generateMarkdownReport(report: TestReport): string {
    let markdown = `# 测试报告\n\n`
    markdown += `**生成时间**: ${report.timestamp}\n\n`

    markdown += `## 执行摘要\n\n`
    markdown += `| 指标 | 值 |\n`
    markdown += `|------|-----|\n`
    markdown += `| 总测试数 | ${report.summary.totalTests} |\n`
    markdown += `| 通过测试 | ${report.summary.passedTests} |\n`
    markdown += `| 失败测试 | ${report.summary.failedTests} |\n`
    markdown += `| 成功率 | ${report.summary.successRate.toFixed(2)}% |\n`
    markdown += `| 总执行时间 | ${report.summary.totalDuration.toFixed(2)}ms |\n`
    markdown += `| 平均执行时间 | ${report.summary.averageDuration.toFixed(2)}ms |\n\n`

    markdown += `## 代码覆盖率\n\n`
    markdown += `| 指标 | 覆盖率 |\n`
    markdown += `|------|--------|\n`
    markdown += `| 语句 | ${report.coverage.statements.toFixed(2)}% |\n`
    markdown += `| 分支 | ${report.coverage.branches.toFixed(2)}% |\n`
    markdown += `| 函数 | ${report.coverage.functions.toFixed(2)}% |\n`
    markdown += `| 行 | ${report.coverage.lines.toFixed(2)}% |\n\n`

    markdown += `## 测试分类\n\n`

    const categories = [
      { name: "单元测试", key: "unit" },
      { name: "集成测试", key: "integration" },
      { name: "端到端测试", key: "e2e" },
      { name: "性能测试", key: "performance" },
      { name: "变异测试", key: "mutation" },
      { name: "混沌测试", key: "chaos" },
      { name: "视觉回归测试", key: "visual" },
    ]

    categories.forEach(category => {
      const results = report.categories[category.key as keyof typeof report.categories]
      markdown += `### ${category.name}\n\n`
      markdown += `| 测试名称 | 状态 | 执行时间 | 覆盖率 |\n`
      markdown += `|----------|------|----------|--------|\n`

      results.forEach(result => {
        const status = result.passed ? "✅ 通过" : "❌ 失败"
        const coverage = result.coverage ? `${result.coverage.toFixed(2)}%` : "-"
        markdown += `| ${result.name} | ${status} | ${result.duration.toFixed(2)}ms | ${coverage} |\n`
      })

      markdown += `\n`
    })

    if (report.violations.length > 0) {
      markdown += `## 违规项\n\n`
      report.violations.forEach(violation => {
        markdown += `- ${violation}\n`
      })
      markdown += `\n`
    }

    if (report.recommendations.length > 0) {
      markdown += `## 改进建议\n\n`
      report.recommendations.forEach(recommendation => {
        markdown += `- ${recommendation}\n`
      })
      markdown += `\n`
    }

    return markdown
  }

  private readDirectory(dir: string): string[] {
    const fs = require("fs")
    if (!existsSync(dir)) {
      return []
    }
    return fs.readdirSync(dir)
  }
}

async function main() {
  const generator = new TestReportGenerator()
  await generator.generateReport()
}

main().catch(console.error)
