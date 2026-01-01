import { render, screen } from '@testing-library/react'
import { Header } from '@/components/header'

describe('Header', () => {
  test('renders search input with correct placeholder', () => {
    render(<Header />)
    expect(screen.getByPlaceholderText('搜索客户、任务、项目...')).toBeInTheDocument()
  })

  test('renders clock icon and actions', () => {
    render(<Header />)
    // basic presence checks to ensure layout renders
    expect(screen.getByText('日程')).toBeInTheDocument()
    expect(screen.getByText('消息')).toBeInTheDocument()
  })
})
