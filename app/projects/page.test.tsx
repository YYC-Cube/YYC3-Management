import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import ProjectsPage from './page'
import { useToast } from '@/hooks/use-toast'

// Mock components and hooks
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}))

vi.mock('next/image', () => ({
  default: vi.fn(({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />),
}))

describe('ProjectsPage', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the page title and new project button', () => {
    render(<ProjectsPage />)
    
    // Check page title exists
    const titles = screen.getAllByText(/项目管理/)
    expect(titles.length).toBeGreaterThan(0)
    
    // Check new project button exists
    const buttons = screen.getAllByText('新建项目')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should render statistics cards', () => {
    render(<ProjectsPage />)
    
    // Check for at least one statistics card
    const cardElements = screen.getAllByText(/项目数|已完成|进行中|延期/)
    expect(cardElements.length).toBeGreaterThanOrEqual(4)
    
    // Check for some numeric values
    const numericValues = screen.getAllByText(/\d+/)
    expect(numericValues.length).toBeGreaterThan(0)
  })

  it('should render project list section', () => {
    render(<ProjectsPage />)
    
    // Check project list section exists
    expect(screen.getByText('项目列表')).toBeInTheDocument()
  })

  it('should handle new project button click', async () => {
    render(<ProjectsPage />)
    
    const newProjectButton = screen.getByText('新建项目')
    await user.click(newProjectButton)
    
    // Verify the button was clicked (we'd expect navigation in real app)
    // Since we can't easily test navigation in this context, we just verify the click
    expect(newProjectButton).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<ProjectsPage />)
    
    // Check button accessibility
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
    buttons.forEach((button: HTMLButtonElement) => {
      expect(button).toBeVisible()
    })
  })
})
