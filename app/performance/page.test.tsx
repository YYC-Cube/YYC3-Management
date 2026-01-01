import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PerformancePage from './page'
import '@testing-library/jest-dom'

// 模拟子组件
vi.mock('@/components/performance-optimization', () => ({
  PerformanceOptimization: () => <div data-testid="performance-optimization" />
}))

vi.mock('@/components/charts/performance-chart', () => ({
  PerformanceChart: () => <div data-testid="performance-chart" />
}))

describe('PerformancePage', () => {
  beforeEach(() => {
    render(<PerformancePage />)
  })

  it('应该渲染页面标题和描述', () => {
    expect(screen.getByText('绩效管理')).toBeInTheDocument()
    expect(screen.getByText('员工绩效评估和跟踪管理')).toBeInTheDocument()
  })

  it('应该渲染性能优化组件', () => {
    expect(screen.getByTestId('performance-optimization')).toBeInTheDocument()
  })

  it('应该渲染所有操作按钮', () => {
    expect(screen.getByText('生成报告')).toBeInTheDocument()
    expect(screen.getByText('新建评估')).toBeInTheDocument()
  })

  it('应该渲染所有统计卡片', () => {
    // 先找到页面标题，然后找到统计卡片容器
    const pageTitle = screen.getByText('绩效管理')
    const pageContainer = pageTitle.closest('.space-y-6')
    expect(pageContainer).toBeInTheDocument()

    // 在页面容器内查找统计卡片
    const statCards = pageContainer?.querySelectorAll('.rounded-xl')
    // 减去其他非统计卡片的数量（绩效趋势分析、排行榜、部门绩效对比、绩效分布分析）
    const actualStatCards = statCards ? Array.from(statCards).filter(card => 
      card.textContent?.includes('平均绩效') ||
      card.textContent?.includes('优秀员工') ||
      card.textContent?.includes('目标达成率') ||
      card.textContent?.includes('参评人数')
    ) : []
    
    expect(actualStatCards.length).toBe(4)

    // 检查统计卡片内容
    expect(actualStatCards[0].textContent).toContain('平均绩效')
    expect(actualStatCards[0].textContent).toContain('4.2')
    expect(actualStatCards[1].textContent).toContain('优秀员工')
    expect(actualStatCards[1].textContent).toContain('12')
    expect(actualStatCards[2].textContent).toContain('目标达成率')
    expect(actualStatCards[2].textContent).toContain('87%')
    expect(actualStatCards[3].textContent).toContain('参评人数')
    expect(actualStatCards[3].textContent).toContain('45')
  })

  it('应该渲染绩效趋势分析部分', () => {
    expect(screen.getByText('绩效趋势分析')).toBeInTheDocument()
    expect(screen.getByTestId('performance-chart')).toBeInTheDocument()
  })

  it('应该渲染时间范围按钮', () => {
    expect(screen.getByText('月度')).toBeInTheDocument()
    expect(screen.getByText('季度')).toBeInTheDocument()
    expect(screen.getByText('年度')).toBeInTheDocument()
  })

  it('应该渲染绩效排行榜', () => {
    expect(screen.getByText('绩效排行榜')).toBeInTheDocument()
    expect(screen.getByText('查看全部')).toBeInTheDocument()

    // 检查排行榜数据
    expect(screen.getByText('张三')).toBeInTheDocument()
    expect(screen.getByText('李四')).toBeInTheDocument()
    
    // 使用更精确的选择器来避免重复文本匹配
    const rankingList = screen.getByText('绩效排行榜').closest('.rounded-xl')
    expect(rankingList).toBeInTheDocument()
    expect(rankingList?.textContent).toContain('产品部')
    expect(rankingList?.textContent).toContain('4.8')
    expect(rankingList?.textContent).toContain('技术部')
    expect(rankingList?.textContent).toContain('4.7')
  })

  it('应该渲染部门绩效对比', () => {
    // 先找到"部门绩效对比"文本，然后找到它的父容器（EnhancedCard）
    const deptPerformanceTitle = screen.getByText('部门绩效对比')
    const deptPerformanceCard = deptPerformanceTitle.closest('.rounded-xl')
    
    expect(deptPerformanceCard).toBeInTheDocument()
    
    // 在部门绩效对比卡片内查找部门数据
    if (deptPerformanceCard) {
      const deptItems = deptPerformanceCard.querySelectorAll('[class*="p-4 border border-slate-200 rounded-lg"]')
      expect(deptItems.length).toBe(5)
      expect(deptItems[0].textContent).toContain('产品部')
      expect(deptItems[0].textContent).toContain('4.5')
      expect(deptItems[1].textContent).toContain('技术部')
      expect(deptItems[1].textContent).toContain('4.3')
    }
  })

  it('应该渲染绩效分布分析', () => {
    expect(screen.getByText('绩效分布分析')).toBeInTheDocument()

    // 检查绩效等级
    expect(screen.getByText('优秀')).toBeInTheDocument()
    expect(screen.getByText('4.5-5.0')).toBeInTheDocument()
    expect(screen.getByText('良好')).toBeInTheDocument()
    expect(screen.getByText('4.0-4.4')).toBeInTheDocument()
    expect(screen.getByText('合格')).toBeInTheDocument()
    expect(screen.getByText('3.5-3.9')).toBeInTheDocument()
    expect(screen.getByText('待改进')).toBeInTheDocument()
    expect(screen.getByText('3.0-3.4')).toBeInTheDocument()
    expect(screen.getByText('不合格')).toBeInTheDocument()
    expect(screen.getByText('< 3.0')).toBeInTheDocument()

    // 使用更精确的选择器来查找计数
    const performanceDistributionCards = document.querySelectorAll('[class*="text-center p-4 border border-slate-200 rounded-lg"]')
    expect(performanceDistributionCards.length).toBe(5)
    expect(performanceDistributionCards[0].textContent).toContain('12')
    expect(performanceDistributionCards[1].textContent).toContain('18')
    expect(performanceDistributionCards[2].textContent).toContain('10')
    expect(performanceDistributionCards[3].textContent).toContain('4')
    expect(performanceDistributionCards[4].textContent).toContain('1')
  })

  it('应该响应时间范围按钮点击', () => {
    const monthlyButton = screen.getByText('月度')
    const quarterlyButton = screen.getByText('季度')
    const annualButton = screen.getByText('年度')

    fireEvent.click(monthlyButton)
    fireEvent.click(quarterlyButton)
    fireEvent.click(annualButton)

    // 按钮点击后应该保持存在
    expect(monthlyButton).toBeInTheDocument()
    expect(quarterlyButton).toBeInTheDocument()
    expect(annualButton).toBeInTheDocument()
  })

  it('应该响应操作按钮点击', () => {
    const generateReportButton = screen.getByText('生成报告')
    const createEvaluationButton = screen.getByText('新建评估')
    const viewAllButton = screen.getByText('查看全部')

    fireEvent.click(generateReportButton)
    fireEvent.click(createEvaluationButton)
    fireEvent.click(viewAllButton)

    // 按钮点击后应该保持存在
    expect(generateReportButton).toBeInTheDocument()
    expect(createEvaluationButton).toBeInTheDocument()
    expect(viewAllButton).toBeInTheDocument()
  })
})
