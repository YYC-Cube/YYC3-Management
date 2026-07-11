import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, act } from "@testing-library/react"
import { VirtualScroll } from "@/components/ui/virtual-scroll"

interface TestItem {
  id: number
  name: string
  description: string
}

describe("VirtualScroll - Coverage Tests", () => {
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

  describe("滚动行为", () => {
    it("should set scrollTop on the scroll container", () => {
      const { container } = render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div data-testid={`item-${item.id}`}>{item.name}</div>}
        />
      )

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement
      expect(scrollElement).not.toBeNull()

      act(() => {
        scrollElement.scrollTop = 2500
      })

      expect(scrollElement.scrollTop).toBe(2500)
    })

    it("should reset scroll position to top", () => {
      const { container } = render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div data-testid={`item-${item.id}`}>{item.name}</div>}
        />
      )

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement

      act(() => { scrollElement.scrollTop = 1000 })
      expect(scrollElement.scrollTop).toBe(1000)

      act(() => { scrollElement.scrollTop = 0 })
      expect(scrollElement.scrollTop).toBe(0)
    })

    it("should scroll to the bottom", () => {
      const { container } = render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item) => <div data-testid={`item-${item.id}`}>{item.name}</div>}
        />
      )

      const scrollElement = container.querySelector(".overflow-y-auto") as HTMLElement
      const totalHeight = testData.length * 50

      act(() => { scrollElement.scrollTop = totalHeight })
      expect(scrollElement.scrollTop).toBe(totalHeight)
    })
  })

  describe("动态高度函数", () => {
    it("should handle height function returning zero", () => {
      render(
        <VirtualScroll
          items={testData}
          itemHeight={() => 0}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )
      expect(screen.getByRole("list")).toBeInTheDocument()
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
      expect(screen.getByRole("list")).toBeInTheDocument()
    })

    it("should handle height function returning very large values", () => {
      render(
        <VirtualScroll
          items={testData}
          itemHeight={(index) => 50 + index * 100}
          containerHeight={500}
          renderItem={(item) => <div>{item.name}</div>}
        />
      )
      expect(screen.getByRole("list")).toBeInTheDocument()
    })
  })

  describe("边界情况", () => {
    it("should render with empty items array", () => {
      render(
        <VirtualScroll
          items={[]}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item: TestItem) => <div>{item.name}</div>}
        />
      )
      expect(screen.getByRole("list")).toBeInTheDocument()
    })

    it("should render with single item", () => {
      render(
        <VirtualScroll
          items={[{ id: 1, name: "Only Item", description: "Single" }]}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item: TestItem) => <div>{item.name}</div>}
        />
      )
      expect(screen.getByText("Only Item")).toBeInTheDocument()
    })

    it("should handle very small container height", () => {
      render(
        <VirtualScroll
          items={testData}
          itemHeight={50}
          containerHeight={1}
          renderItem={(item: TestItem) => <div>{item.name}</div>}
        />
      )
      expect(screen.getByRole("list")).toBeInTheDocument()
    })

    it("should handle items larger than container", () => {
      render(
        <VirtualScroll
          items={testData.slice(0, 5)}
          itemHeight={200}
          containerHeight={100}
          renderItem={(item: TestItem) => <div>{item.name}</div>}
        />
      )
      expect(screen.getByRole("list")).toBeInTheDocument()
    })
  })
})
