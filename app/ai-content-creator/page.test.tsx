import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
  useToast: () => ({ toasts: [], toast: vi.fn(), dismiss: vi.fn() }),
}))

vi.mock('@/components/layout/page-container', () => ({
  PageContainer: ({ children, title, description }: { children: React.ReactNode; title?: string; description?: string }) => (
    <div>
      {title && <h1>{title}</h1>}
      {description && <p>{description}</p>}
      {children}
    </div>
  ),
}))

vi.mock('@/components/ui/floating-nav-buttons', () => ({
  FloatingNavButtons: () => null,
}))
import AIContentCreatorPage from './page'
import { toast } from '@/hooks/use-toast'

describe('AIContentCreatorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('初始渲染', () => {
    it('should render the page title', () => {
      render(<AIContentCreatorPage />)
      expect(screen.getByText('AI创作助手')).toBeInTheDocument()
    })

    it('should render tab navigation with at least 3 tabs', () => {
      render(<AIContentCreatorPage />)
      const tabs = screen.getAllByRole('tab')
      expect(tabs.length).toBeGreaterThanOrEqual(3)
    })

    it('should render title input on default (create) tab', () => {
      render(<AIContentCreatorPage />)
      expect(screen.getByPlaceholderText(/智能家居选购指南/)).toBeInTheDocument()
    })

    it('should render platform icons', () => {
      render(<AIContentCreatorPage />)
      const images = screen.getAllByRole('img')
      expect(images.length).toBeGreaterThanOrEqual(4)
    })
  })

  describe('内容生成', () => {
    it('should show error toast when generating without title', () => {
      render(<AIContentCreatorPage />)
      const buttons = screen.getAllByRole('button')
      const generateBtn = buttons.find((b) => b.textContent?.includes('开始创作') || b.textContent?.includes('生成'))
      expect(generateBtn).toBeDefined()
      if (generateBtn) {
        fireEvent.click(generateBtn)
        expect(toast).toHaveBeenCalledWith(
          expect.objectContaining({ variant: 'destructive' })
        )
      }
    })

    it('should generate content when title is provided', async () => {
      render(<AIContentCreatorPage />)
      fireEvent.change(screen.getByPlaceholderText(/智能家居选购指南/), {
        target: { value: '人工智能' },
      })

      const buttons = screen.getAllByRole('button')
      const generateBtn = buttons.find((b) => b.textContent?.includes('开始创作') || b.textContent?.includes('生成'))
      if (generateBtn) {
        fireEvent.click(generateBtn)
        await act(async () => {
          vi.advanceTimersByTime(2000)
        })
        await waitFor(() => {
          expect(toast).toHaveBeenCalledWith(
            expect.objectContaining({ title: '生成成功' })
          )
        })
      }
    })
  })

  describe('标签页切换', () => {
    it('should switch to history tab and show history items', async () => {
      render(<AIContentCreatorPage />)
      const historyTab = screen.getByRole('tab', { name: /创作历史/ })
      fireEvent.click(historyTab)

      await waitFor(() => {
        expect(screen.getByText('夏季防晒指南')).toBeInTheDocument()
      })
    })

    it('should show history view counts', async () => {
      render(<AIContentCreatorPage />)
      fireEvent.click(screen.getByRole('tab', { name: /创作历史/ }))
      await waitFor(() => {
        expect(screen.getByText(/2450/)).toBeInTheDocument()
      })
    })
  })

  describe('XSS防护', () => {
    it('should not render script tags after content generation', async () => {
      render(<AIContentCreatorPage />)
      fireEvent.change(screen.getByPlaceholderText(/智能家居选购指南/), {
        target: { value: '<script>alert(1)</script>' },
      })

      const buttons = screen.getAllByRole('button')
      const generateBtn = buttons.find((b) => b.textContent?.includes('开始创作') || b.textContent?.includes('生成'))
      if (generateBtn) {
        fireEvent.click(generateBtn)
        await act(async () => {
          vi.advanceTimersByTime(2000)
        })
        expect(document.querySelectorAll('script').length).toBe(0)
      }
    })
  })
})
