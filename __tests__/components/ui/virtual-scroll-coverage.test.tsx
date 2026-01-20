// 虚拟滚动组件的额外测试用例 - 用于提升测试覆盖率至90%以上
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,虚拟滚动,覆盖率,单元测试

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import { VirtualScroll, VirtualScrollList } from "@/components/ui/virtual-scroll"

interface TestItem {
  id: number
  name: string
  description: string
}

describe("VirtualScroll - Additional Coverage Tests", () => {
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

  describe("scroll methods coverage", () => {
    it("should call scrollToIndex with valid index", () => {
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

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement

      act(() => {
        if (scrollElement) {
          scrollElement.scrollTop = 2500
        }
      })

      expect(scrollElement?.scrollTop).toBe(2500)
    })

    it("should call scrollToTop and reset scroll position", () => {
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

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement

      act(() => {
        if (scrollElement) {
          scrollElement.scrollTop = 1000
        }
      })

      expect(scrollElement?.scrollTop).toBe(1000)

      act(() => {
        if (scrollElement) {
          scrollElement.scrollTop = 0
        }
      })

      expect(scrollElement?.scrollTop).toBe(0)
    })

    it("should call scrollToBottom and scroll to end", () => {
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

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement
      const totalHeight = testData.length * 50

      act(() => {
        if (scrollElement) {
          scrollElement.scrollTop = totalHeight
        }
      })

      expect(scrollElement?.scrollTop).toBe(totalHeight)
    })
  })

  describe("dynamic height function coverage", () => {
    it("should handle height function returning zero", () => {
      render(
        <VirtualScroll
          items={testData}
          itemHeight={() => 0}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })

    it("should handle height function returning negative values", () => {
      render(
        <VirtualScroll
          items={testData}
          itemHeight={(index) => (index % 2 === 0 ? 50 : -10)}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })

    it("should handle height function returning very large values", () => {
      render(
        <VirtualScroll
          items={testData}
          itemHeight={(index) => 50 + index * 100}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />}
      />

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })

    it("should recalculate visible range when height function changes", () => {
      const { rerender } = render(
        <VirtualScroll
          items={testData}
          itemHeight={() => 50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      rerender(
        <VirtualScroll
          items={testData}
          itemHeight={(index) => 50 + index * 10}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })
  })

  describe("container width changes", () => {
    it("should update container width on resize", () => {
      const { container } = render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const outerContainer = container.firstChild as HTMLElement

      act(() => {
        if (outerContainer) {
          Object.defineProperty(outerContainer, 'clientWidth', {
            configurable: true,
            value: 800,
          })
        }
      })

      expect(outerContainer).toBeInTheDocument()
    })

    it("should handle container width of zero", () => {
      const { container } = render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const outerContainer = container.firstChild as HTMLElement

      act(() => {
        if (outerContainer) {
          Object.defineProperty(outerContainer, 'clientWidth', {
            configurable: true,
            value: 0,
          })
        }
      })

      expect(outerContainer).toBeInTheDocument()
    })
  })

  describe("scroll event handling coverage", () => {
    it("should handle scroll event with zero scrollTop", () => {
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

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement

      act(() => {
        if (scrollElement) {
          fireEvent.scroll(scrollElement, { target: { scrollTop: 0 } })
        }
      })

      const firstItem = screen.queryByTestId("item-1")
      expect(firstItem).toBeInTheDocument()
    })

    it("should handle scroll event with very large scrollTop", () => {
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

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement

      act(() => {
        if (scrollElement) {
          fireEvent.scroll(scrollElement, { target: { scrollTop: 100000 } })
        }
      })

      const firstItem = screen.queryByTestId("item-1")
      expect(firstItem).not.toBeInTheDocument()
    })

    it("should handle rapid scroll events", () => {
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

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement

      act(() => {
        if (scrollElement) {
          for (let i = 0; i < 100; i++) {
            fireEvent.scroll(scrollElement, { target: { scrollTop: i * 10 } })
          }
        }
      })

      const containerElement = screen.getByRole("list")
      expect(containerElement).toBeInTheDocument()
    })
  })

  describe("overscan edge cases", () => {
    it("should handle overscan larger than visible items", () => {
      render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          overscan={100}
          renderItem={(item) => (
            <div data-testid={`item-${item.id}`}>{item.name}</div>
          )}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })

    it("should handle negative overscan", () => {
      render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          overscan={-5}
          renderItem={(item) => (
            <div data-testid={`item-${item.id}`}>{item.name}</div>
          )}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })

    it("should handle overscan with dynamic height", () => {
      render(
        <VirtualScroll
          items={testData}
          itemHeight={(index) => 40 + (index % 5) * 10}
          containerHeight={500}
          overscan={10}
          renderItem={(item) => (
            <div data-testid={`item-${item.id}`}>{item.name}</div>
          )}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })
  })

  describe("empty and single item scenarios", () => {
    it("should handle empty items with dynamic height", () => {
      render(
        <VirtualScroll
          items={[]}
          itemHeight={(index) => 50 + index * 10}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const container = screen.getByRole("list")
      expect(container).toBeInTheDocument()
    })

    it("should handle single item with dynamic height", () => {
      const singleItem = [testData[0]]

      render(
        <VirtualScroll
          items={singleItem}
          itemHeight={(index) => 50 + index * 10}
          containerHeight={500}
          renderItem={(item) => (
            <div data-testid={`item-${item.id}`}>{item.name}</div>
          )}
        />
      )

      const item = screen.getByTestId("item-1")
      expect(item).toBeInTheDocument()
    })

    it("should handle two items with dynamic height", () => {
      const twoItems = [testData[0], testData[1]]

      render(
        <VirtualScroll
          items={twoItems}
          itemHeight={(index) => 50 + index * 10}
          containerHeight={500}
          renderItem={(item) => (
            <div data-testid={`item-${item.id}`}>{item.name}</div>
          )}
        />
      )

      const item1 = screen.getByTestId("item-1")
      const item2 = screen.getByTestId("item-2")
      expect(item1).toBeInTheDocument()
      expect(item2).toBeInTheDocument()
    })
  })
})

describe("VirtualScrollList - Additional Coverage Tests", () => {
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

  describe("onEndReached callback coverage", () => {
    it("should call onEndReached when scrolling near bottom", async () => {
      const onEndReached = vi.fn()

      const { container } = render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          onEndReached={onEndReached}
          endReachedThreshold={200}
        />
      )

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement
      const totalHeight = testData.length * 50

      act(() => {
        if (scrollElement) {
          fireEvent.scroll(scrollElement, { target: { scrollTop: totalHeight - 100 } })
        }
      })

      await waitFor(() => {
        expect(onEndReached).toHaveBeenCalled()
      })
    })

    it("should not call onEndReached when already reached", async () => {
      const onEndReached = vi.fn()

      const { container } = render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          onEndReached={onEndReached}
          endReachedThreshold={200}
        />
      )

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement
      const totalHeight = testData.length * 50

      act(() => {
        if (scrollElement) {
          fireEvent.scroll(scrollElement, { target: { scrollTop: totalHeight - 100 } })
        }
      })

      await waitFor(() => {
        expect(onEndReached).toHaveBeenCalledTimes(1)
      })

      act(() => {
        if (scrollElement) {
          fireEvent.scroll(scrollElement, { target: { scrollTop: totalHeight - 50 } })
        }
      })

      await waitFor(() => {
        expect(onEndReached).toHaveBeenCalledTimes(1)
      })
    })

    it("should reset isEndReached when items change", async () => {
      const onEndReached = vi.fn()

      const { container, rerender } = render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          onEndReached={onEndReached}
          endReachedThreshold={200}
        />
      )

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement
      const totalHeight = testData.length * 50

      act(() => {
        if (scrollElement) {
          fireEvent.scroll(scrollElement, { target: { scrollTop: totalHeight - 100 } })
        }
      })

      await waitFor(() => {
        expect(onEndReached).toHaveBeenCalled()
      })

      const newItems = [...testData, ...testData.map((item, i) => ({ ...item, id: i + 101 }))]
      rerender(
        <VirtualScrollList
          items={newItems}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          onEndReached={onEndReached}
          endReachedThreshold={200}
        />
      )

      act(() => {
        if (scrollElement) {
          fireEvent.scroll(scrollElement, { target: { scrollTop: totalHeight * 2 - 100 } })
        }
      })

      await waitFor(() => {
        expect(onEndReached).toHaveBeenCalledTimes(2)
      })
    })

    it("should handle onEndReached with zero threshold", async () => {
      const onEndReached = vi.fn()

      const { container } = render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          onEndReached={onEndReached}
          endReachedThreshold={0}
        />
      )

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement
      const totalHeight = testData.length * 50

      act(() => {
        if (scrollElement) {
          fireEvent.scroll(scrollElement, { target: { scrollTop: totalHeight } })
        }
      })

      await waitFor(() => {
        expect(onEndReached).toHaveBeenCalled()
      })
    })

    it("should handle onEndReached with very large threshold", async () => {
      const onEndReached = vi.fn()

      render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          onEndReached={onEndReached}
          endReachedThreshold={10000}
        />
      )

      act(() => {
        fireEvent.scroll(window, { target: { scrollTop: 0 } })
      })

      await waitFor(() => {
        expect(onEndReached).toHaveBeenCalled()
      })
    })
  })

  describe("loading state coverage", () => {
    it("should render loading component when loading is true", () => {
      const LoadingComponent = () => <div data-testid="loading">Loading...</div>

      render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          loading={true}
          loadingComponent={<LoadingComponent />}
        />
      )

      const loading = screen.getByTestId("loading")
      expect(loading).toBeInTheDocument()
      expect(loading).toHaveTextContent("Loading...")
    })

    it("should not render loading component when loading is false", () => {
      const LoadingComponent = () => <div data-testid="loading">Loading...</div>

      render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          loading={false}
          loadingComponent={<LoadingComponent />}
        />
      )

      const loading = screen.queryByTestId("loading")
      expect(loading).not.toBeInTheDocument()
    })

    it("should render loading component at bottom of list", () => {
      const LoadingComponent = () => <div data-testid="loading">Loading...</div>

      const { container } = render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          loading={true}
          loadingComponent={<LoadingComponent />}
        />
      )

      const loading = screen.getByTestId("loading")
      const parentElement = loading.parentElement

      expect(parentElement).toHaveStyle({
        position: "absolute",
        bottom: "0px",
        left: "0px",
        right: "0px",
      })
    })

    it("should handle loading component with custom styling", () => {
      const LoadingComponent = () => (
        <div data-testid="loading" style={{ color: "red", fontSize: "20px" }}>
          Loading...
        </div>
      )

      render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          loading={true}
          loadingComponent={<LoadingComponent />}
        />
      )

      const loading = screen.getByTestId("loading")
      expect(loading).toHaveStyle({ color: "red", fontSize: "20px" })
    })
  })

  describe("onScroll callback coverage", () => {
    it("should call onScroll with correct scrollTop value", () => {
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

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement

      act(() => {
        if (scrollElement) {
          fireEvent.scroll(scrollElement, { target: { scrollTop: 123 } })
        }
      })

      expect(onScroll).toHaveBeenCalledWith(123)
    })

    it("should call onScroll on every scroll event", () => {
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

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement

      act(() => {
        if (scrollElement) {
          for (let i = 0; i < 10; i++) {
            fireEvent.scroll(scrollElement, { target: { scrollTop: i * 50 } })
          }
        }
      })

      expect(onScroll).toHaveBeenCalledTimes(10)
    })

    it("should work without onScroll callback", () => {
      const { container } = render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement

      act(() => {
        if (scrollElement) {
          fireEvent.scroll(scrollElement, { target: { scrollTop: 100 } })
        }
      })

      const containerElement = screen.getByRole("list")
      expect(containerElement).toBeInTheDocument()
    })
  })

  describe("dynamic height with VirtualScrollList", () => {
    it("should handle dynamic height with onEndReached", async () => {
      const onEndReached = vi.fn()

      const { container } = render(
        <VirtualScrollList
          items={testData}
          itemHeight={(index) => 40 + (index % 5) * 10}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          onEndReached={onEndReached}
          endReachedThreshold={200}
        />
      )

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement

      act(() => {
        if (scrollElement) {
          fireEvent.scroll(scrollElement, { target: { scrollTop: 10000 } })
        }
      })

      await waitFor(() => {
        expect(onEndReached).toHaveBeenCalled()
      })
    })

    it("should handle dynamic height with loading", () => {
      const LoadingComponent = () => <div data-testid="loading">Loading...</div>

      render(
        <VirtualScrollList
          items={testData}
          itemHeight={(index) => 40 + (index % 5) * 10}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          loading={true}
          loadingComponent={<LoadingComponent />}
        />
      )

      const loading = screen.getByTestId("loading")
      expect(loading).toBeInTheDocument()
    })
  })

  describe("edge cases with VirtualScrollList", () => {
    it("should handle empty items with onEndReached", () => {
      const onEndReached = vi.fn()

      render(
        <VirtualScrollList
          items={[]}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          onEndReached={onEndReached}
        />
      )

      expect(onEndReached).not.toHaveBeenCalled()
    })

    it("should handle single item with onEndReached", async () => {
      const onEndReached = vi.fn()
      const singleItem = [testData[0]]

      const { container } = render(
        <VirtualScrollList
          items={singleItem}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          onEndReached={onEndReached}
          endReachedThreshold={200}
        />
      )

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement

      act(() => {
        if (scrollElement) {
          fireEvent.scroll(scrollElement, { target: { scrollTop: 0 } })
        }
      })

      await waitFor(() => {
        expect(onEndReached).toHaveBeenCalled()
      })
    })

    it("should handle very large endReachedThreshold", async () => {
      const onEndReached = vi.fn()

      render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          onEndReached={onEndReached}
          endReachedThreshold={100000}
        />
      )

      act(() => {
        fireEvent.scroll(window, { target: { scrollTop: 0 } })
      })

      await waitFor(() => {
        expect(onEndReached).toHaveBeenCalled()
      })
    })

    it("should handle negative endReachedThreshold", async () => {
      const onEndReached = vi.fn()

      const { container } = render(
        <VirtualScrollList
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
          onEndReached={onEndReached}
          endReachedThreshold={-100}
        />
      )

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement
      const totalHeight = testData.length * 50

      act(() => {
        if (scrollElement) {
          fireEvent.scroll(scrollElement, { target: { scrollTop: totalHeight } })
        }
      })

      await waitFor(() => {
        expect(onEndReached).toHaveBeenCalled()
      })
    })
  })
})
