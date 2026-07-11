import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import DashboardLoading from './loading'

describe('DashboardLoading', () => {
  it('should render without crashing', () => {
    const { container } = render(<DashboardLoading />)
    expect(container.firstChild).not.toBeNull()
  })

  it('should render skeleton placeholders', () => {
    const { container } = render(<DashboardLoading />)
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should render card structures for loading state', () => {
    const { container } = render(<DashboardLoading />)
    const cards = container.querySelectorAll('[class*="rounded-lg border"]')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('should render the loading container with padding', () => {
    const { container } = render(<DashboardLoading />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toBeDefined()
    expect(wrapper.className).toContain('p-6')
  })

  it('should render enough skeleton elements for the dashboard layout', () => {
    const { container } = render(<DashboardLoading />)
    const allSkeletons = container.querySelectorAll('[class*="animate-pulse"]')
    expect(allSkeletons.length).toBeGreaterThanOrEqual(10)
  })
})
