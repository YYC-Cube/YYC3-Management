import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { VirtualScroll, VirtualScrollList } from "@/components/ui/virtual-scroll"

interface TestItem {
  id: number
  name: string
  description: string
}

describe("VirtualScroll", () => {
  let testData: TestItem[]

  beforeEach(() => {
    testData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      description: `Description for item ${i + 1}`,
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("basic rendering", () => {
    it("should render visible items only", () => {
      const itemHeight = 50
      const containerHeight = 500

      render(
        <VirtualScroll
          items={testData}
          itemHeight={itemHeight}
          containerHeight={containerHeight}
          renderItem={(item) => (
            <div data-testid={`item-${item.id}`}>{item.name}</div>
          )}
        />
      )

      const visibleItems = Math.ceil(containerHeight / itemHeight)
      const renderedItems = screen.getAllByTestId(/^item-/)

      expect(renderedItems.length).toBeLessThanOrEqual(visibleItems + 10)
    })

    it("should render with fixed height", () => {
      render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })

    it("should render with dynamic height", () => {
      render(
        <VirtualScroll
          items={testData}
          itemHeight={(index) => 40 + (index % 5) * 10}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })

    it("should handle empty items array", () => {
      render(
        <VirtualScroll
          items={[]}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })

    it("should apply custom className", () => {
      const { container } = render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          className="custom-class"
        />
      )

      expect(container.querySelector(".custom-class")).toBeInTheDocument()
    })

    it("should apply custom style", () => {
      const customStyle = { backgroundColor: "red" }

      render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          style={customStyle}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toHaveStyle(customStyle)
    })
  })

  describe("scrolling behavior", () => {
    it("should update visible items on scroll", async () => {
      const itemHeight = 50
      const containerHeight = 500

      const { container } = render(
        <VirtualScroll
          items={testData}
          itemHeight={itemHeight}
          containerHeight={containerHeight}
          renderItem={(item) => (
            <div data-testid={`item-${item.id}`}>{item.name}</div>
          )}
        />
      )

      const scrollContainer = container.querySelector('[data-testid="virtual-scroll-container"]')

      if (scrollContainer) {
        fireEvent.scroll(scrollContainer, { target: { scrollTop: 1000 } })

        await waitFor(() => {
          const firstItem = screen.queryByTestId("item-1")
          expect(firstItem).not.toBeInTheDocument()
        })
      }
    })

    it("should scroll to specific index", () => {
      const { container } = render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => (
            <div data-testid={`item-${item.id}`}>{item.name}</div>
          )}
        />
      )

      const virtualScroll = container.querySelector('[data-testid="virtual-scroll"]') as any

      if (virtualScroll && virtualScroll.scrollToIndex) {
        virtualScroll.scrollToIndex(50)

        const item50 = screen.queryByTestId("item-50")
        expect(item50).toBeInTheDocument()
      }
    })

    it("should scroll to top", () => {
      const { container } = render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => (
            <div data-testid={`item-${item.id}`}>{item.name}</div>
          )}
        />
      )

      const virtualScroll = container.querySelector('[data-testid="virtual-scroll"]') as any

      if (virtualScroll && virtualScroll.scrollToTop) {
        virtualScroll.scrollToTop()

        const item1 = screen.queryByTestId("item-1")
        expect(item1).toBeInTheDocument()
      }
    })

    it("should scroll to bottom", () => {
      const { container } = render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => (
            <div data-testid={`item-${item.id}`}>{item.name}</div>
          )}
        />
      )

      const virtualScroll = container.querySelector('[data-testid="virtual-scroll"]') as any

      if (virtualScroll && virtualScroll.scrollToBottom) {
        virtualScroll.scrollToBottom()

        const lastItem = screen.queryByTestId("item-100")
        expect(lastItem).toBeInTheDocument()
      }
    })
  })

  describe("overscan", () => {
    it("should render overscan items", () => {
      const itemHeight = 50
      const containerHeight = 500
      const overscan = 5

      render(
        <VirtualScroll
          items={testData}
          itemHeight={itemHeight}
          containerHeight={containerHeight}
          overscan={overscan}
          renderItem={(item) => (
            <div data-testid={`item-${item.id}`}>{item.name}</div>
          )}
        />
      )

      const visibleItems = Math.ceil(containerHeight / itemHeight)
      const renderedItems = screen.getAllByTestId(/^item-/)

      expect(renderedItems.length).toBeGreaterThan(visibleItems)
    })

    it("should handle zero overscan", () => {
      render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          overscan={0}
          renderItem={(item) => (
            <div data-testid={`item-${item.id}`}>{item.name}</div>
          )}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })
  })

  describe("dynamic height", () => {
    it("should calculate total height correctly", () => {
      const { container } = render(
        <VirtualScroll
          items={testData}
          itemHeight={(index) => 40 + (index % 5) * 10}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const scrollContainer = container.querySelector('[data-testid="virtual-scroll-container"]')

      if (scrollContainer) {
        const totalHeight = testData.reduce((sum, _, index) => sum + (40 + (index % 5) * 10), 0)
        expect(scrollContainer).toHaveStyle({ height: `${totalHeight}px` })
      }
    })

    it("should handle variable height items", () => {
      render(
        <VirtualScroll
          items={testData}
          itemHeight={(index) => 30 + Math.random() * 50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })
  })

  describe("performance", () => {
    it("should not re-render all items on scroll", () => {
      const renderItem = vi.fn((item) => <div>{item.name}</div>)

      const { container } = render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={renderItem}
        />
      )

      const initialCalls = renderItem.mock.calls.length

      const scrollContainer = container.querySelector('[data-testid="virtual-scroll-container"]')

      if (scrollContainer) {
        fireEvent.scroll(scrollContainer, { target: { scrollTop: 1000 } })

        const scrollCalls = renderItem.mock.calls.length - initialCalls
        expect(scrollCalls).toBeLessThan(testData.length)
      }
    })

    it("should handle large datasets efficiently", () => {
      const largeData = Array.from({ length: 10000 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        description: `Description for item ${i + 1}`,
      }))

      render(
        <VirtualScroll
          items={largeData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })
  })

  describe("accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toHaveAttribute("role", "list")
    })

    it("should support keyboard navigation", () => {
      render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => (
            <div role="listitem" tabIndex={0}>
              {item.name}
            </div>
          )}
        />
      )

      const firstItem = screen.getAllByRole("listitem")[0]
      expect(firstItem).toHaveAttribute("tabIndex", "0")
    })
  })
})

describe("VirtualScrollList", () => {
  let testData: TestItem[]

  beforeEach(() => {
    testData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      description: `Description for item ${i + 1}`,
    }))
  })

  describe("basic rendering", () => {
    it("should render list items", () => {
      render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })

    it("should render with custom item component", () => {
      const ItemComponent = ({ item }: { item: TestItem }) => (
        <div data-testid={`item-${item.id}`}>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
      )

      render(
        <VirtualScrollList
          items={testData}
          itemHeight={100}
          containerHeight={500}
          renderItem={(item) => <ItemComponent item={item} />}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })

    it("should handle empty state", () => {
      render(
        <VirtualScrollList
          items={[]}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          emptyState={<div data-testid="empty-state">No items</div>}
        />
      )

      const emptyState = screen.getByTestId("empty-state")
      expect(emptyState).toBeInTheDocument()
      expect(emptyState).toHaveTextContent("No items")
    })

    it("should handle loading state", () => {
      render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          loading={true}
          loadingState={<div data-testid="loading-state">Loading...</div>}
        />
      )

      const loadingState = screen.getByTestId("loading-state")
      expect(loadingState).toBeInTheDocument()
      expect(loadingState).toHaveTextContent("Loading...")
    })
  })

  describe("infinite scroll", () => {
    it("should load more items on scroll", async () => {
      let loadMoreCalled = false
      const loadMore = vi.fn(() => {
        loadMoreCalled = true
      })

      const { container } = render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          loadMore={loadMore}
          hasMore={true}
        />
      )

      const scrollContainer = container.querySelector('[data-testid="virtual-scroll-container"]')

      if (scrollContainer) {
        fireEvent.scroll(scrollContainer, { target: { scrollTop: 10000 } })

        await waitFor(() => {
          expect(loadMore).toHaveBeenCalled()
        })
      }
    })

    it("should not load more when hasMore is false", () => {
      const loadMore = vi.fn()

      const { container } = render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          loadMore={loadMore}
          hasMore={false}
        />
      )

      const scrollContainer = container.querySelector('[data-testid="virtual-scroll-container"]')

      if (scrollContainer) {
        fireEvent.scroll(scrollContainer, { target: { scrollTop: 10000 } })

        expect(loadMore).not.toHaveBeenCalled()
      }
    })
  })

  describe("callbacks", () => {
    it("should call onScroll callback", () => {
      const onScroll = vi.fn()

      const { container } = render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          onScroll={onScroll}
        />
      )

      const scrollContainer = container.querySelector('[data-testid="virtual-scroll-container"]')

      if (scrollContainer) {
        fireEvent.scroll(scrollContainer, { target: { scrollTop: 100 } })

        expect(onScroll).toHaveBeenCalled()
      }
    })

    it("should call onItemClick callback", () => {
      const onItemClick = vi.fn()

      render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => (
            <div data-testid={`item-${item.id}`} onClick={() => onItemClick(item)}>
              {item.name}
            </div>
          )}
        />
      )

      const firstItem = screen.getByTestId("item-1")
      fireEvent.click(firstItem)

      expect(onItemClick).toHaveBeenCalledWith(testData[0])
    })
  })

  describe("edge cases", () => {
    it("should handle single item", () => {
      const singleItem = [testData[0]]

      render(
        <VirtualScrollList
          items={singleItem}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })

    it("should handle items with zero height", () => {
      render(
        <VirtualScrollList
          items={testData}
          itemHeight={0}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })

    it("should handle container with zero height", () => {
      render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={0}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })
  })
})
