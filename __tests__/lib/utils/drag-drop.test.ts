import { describe, it, expect, beforeEach, vi } from "vitest"
import { DragDropManager } from "@/lib/utils/drag-drop"

interface TestItem {
  id: number
  name: string
  value: number
}

describe("DragDropManager", () => {
  let manager: DragDropManager<TestItem>
  let testData: TestItem[]

  beforeEach(() => {
    testData = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: i + 1,
    }))
  })

  describe("initialization", () => {
    it("should initialize with default options", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      expect(manager).toBeDefined()
    })

    it("should initialize with custom options", () => {
      const onReorder = vi.fn()
      const onDragStart = vi.fn()
      const onDragEnd = vi.fn()

      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
        onDragStart,
        onDragEnd,
        disabled: false,
        crossList: true,
      })

      expect(manager).toBeDefined()
    })

    it("should initialize with disabled state", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
        disabled: true,
      })

      expect(manager).toBeDefined()
    })
  })

  describe("startDrag", () => {
    it("should start drag operation", () => {
      const onDragStart = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
        onDragStart,
      })

      manager.startDrag(testData[0], 0)

      expect(onDragStart).toHaveBeenCalledWith(testData[0])
    })

    it("should not start drag when disabled", () => {
      const onDragStart = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
        onDragStart,
        disabled: true,
      })

      manager.startDrag(testData[0], 0)

      expect(onDragStart).not.toHaveBeenCalled()
    })

    it("should set dragged item", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      manager.startDrag(testData[0], 0)

      const draggedItem = manager.getDraggedItem()
      expect(draggedItem).toBeDefined()
      expect(draggedItem!.data).toEqual(testData[0])
    })

    it("should handle drag start with callback", () => {
      const onDragStart = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
        onDragStart,
      })

      manager.startDrag(testData[2], 2)

      expect(onDragStart).toHaveBeenCalledWith(testData[2])
    })
  })

  describe("handleDragOver", () => {
    it("should handle drag over event", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")

      const dropTarget = manager.getDropTarget()
      expect(dropTarget).toBeDefined()
      expect(dropTarget!.index).toBe(5)
      expect(dropTarget!.position).toBe("after")
    })

    it("should not handle drag over when no drag in progress", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      manager.handleDragOver(5, "after")

      const dropTarget = manager.getDropTarget()
      expect(dropTarget).toBeNull()
    })

    it("should handle drag over with before position", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "before")

      const dropTarget = manager.getDropTarget()
      expect(dropTarget!.position).toBe("before")
    })

    it("should not handle drag over when disabled", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
        disabled: true,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")

      const dropTarget = manager.getDropTarget()
      expect(dropTarget).toBeNull()
    })
  })

  describe("handleDrop", () => {
    it("should handle drop and reorder items", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
      const reorderedItems = onReorder.mock.calls[0][0]
      expect(reorderedItems[0].id).toBe(2)
      expect(reorderedItems[4].id).toBe(6)
      expect(reorderedItems[5].id).toBe(1)
    })

    it("should not handle drop when no drag in progress", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.handleDrop()

      expect(onReorder).not.toHaveBeenCalled()
    })

    it("should not handle drop when no drop target", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDrop()

      expect(onReorder).not.toHaveBeenCalled()
    })

    it("should not handle drop when source and target are same", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(0, "after")
      manager.handleDrop()

      expect(onReorder).not.toHaveBeenCalled()
    })

    it("should call onDragEnd callback", () => {
      const onDragEnd = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
        onDragEnd,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      expect(onDragEnd).toHaveBeenCalledWith(testData[0])
    })

    it("should reset drag state after drop", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      const draggedItem = manager.getDraggedItem()
      const dropTarget = manager.getDropTarget()

      expect(draggedItem).toBeNull()
      expect(dropTarget).toBeNull()
    })
  })

  describe("cancelDrag", () => {
    it("should cancel drag operation", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      manager.startDrag(testData[0], 0)
      manager.cancelDrag()

      const draggedItem = manager.getDraggedItem()
      const dropTarget = manager.getDropTarget()

      expect(draggedItem).toBeNull()
      expect(dropTarget).toBeNull()
    })

    it("should call onDragEnd callback on cancel", () => {
      const onDragEnd = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
        onDragEnd,
      })

      manager.startDrag(testData[0], 0)
      manager.cancelDrag()

      expect(onDragEnd).toHaveBeenCalledWith(testData[0])
    })

    it("should handle cancel when no drag in progress", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      expect(() => manager.cancelDrag()).not.toThrow()
    })
  })

  describe("drag state management", () => {
    it("should return dragged item", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      manager.startDrag(testData[0], 0)

      const draggedItem = manager.getDraggedItem()
      expect(draggedItem).toBeDefined()
      expect(draggedItem!.data).toEqual(testData[0])
      expect(draggedItem!.index).toBe(0)
    })

    it("should return drop target", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")

      const dropTarget = manager.getDropTarget()
      expect(dropTarget).toBeDefined()
      expect(dropTarget!.index).toBe(5)
      expect(dropTarget!.position).toBe("after")
    })

    it("should return null for dragged item when no drag", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      const draggedItem = manager.getDraggedItem()
      expect(draggedItem).toBeNull()
    })

    it("should return null for drop target when no drag over", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      manager.startDrag(testData[0], 0)

      const dropTarget = manager.getDropTarget()
      expect(dropTarget).toBeNull()
    })
  })

  describe("reorder logic", () => {
    it("should reorder items correctly when moving down", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      const reorderedItems = onReorder.mock.calls[0][0]
      expect(reorderedItems[0].id).toBe(2)
      expect(reorderedItems[4].id).toBe(6)
      expect(reorderedItems[5].id).toBe(1)
    })

    it("should reorder items correctly when moving up", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[9], 9)
      manager.handleDragOver(2, "before")
      manager.handleDrop()

      const reorderedItems = onReorder.mock.calls[0][0]
      expect(reorderedItems[1].id).toBe(10)
      expect(reorderedItems[2].id).toBe(3)
      expect(reorderedItems[9].id).toBe(9)
    })

    it("should handle before position correctly", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "before")
      manager.handleDrop()

      const reorderedItems = onReorder.mock.calls[0][0]
      expect(reorderedItems[4].id).toBe(1)
      expect(reorderedItems[5].id).toBe(6)
    })

    it("should handle after position correctly", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      const reorderedItems = onReorder.mock.calls[0][0]
      expect(reorderedItems[5].id).toBe(1)
      expect(reorderedItems[6].id).toBe(7)
    })
  })

  describe("disabled state", () => {
    it("should not start drag when disabled", () => {
      const onDragStart = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
        onDragStart,
        disabled: true,
      })

      manager.startDrag(testData[0], 0)

      expect(onDragStart).not.toHaveBeenCalled()
    })

    it("should not handle drag over when disabled", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
        disabled: true,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")

      const dropTarget = manager.getDropTarget()
      expect(dropTarget).toBeNull()
    })

    it("should not handle drop when disabled", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
        disabled: true,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      expect(onReorder).not.toHaveBeenCalled()
    })

    it("should allow enabling after being disabled", () => {
      const onDragStart = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
        onDragStart,
        disabled: true,
      })

      manager.enable()
      manager.startDrag(testData[0], 0)

      expect(onDragStart).toHaveBeenCalled()
    })

    it("should allow disabling after being enabled", () => {
      const onDragStart = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
        onDragStart,
      })

      manager.disable()
      manager.startDrag(testData[0], 0)

      expect(onDragStart).not.toHaveBeenCalled()
    })
  })

  describe("cross list drag and drop", () => {
    it("should handle cross list drag and drop", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
        crossList: true,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
    })

    it("should handle cross list with different item types", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
        crossList: true,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
    })
  })

  describe("edge cases", () => {
    it("should handle empty items array", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: [],
        onReorder,
      })

      expect(() => manager.startDrag(testData[0], 0)).not.toThrow()
    })

    it("should handle single item", () => {
      const onReorder = vi.fn()
      const singleItem = [testData[0]]
      manager = new DragDropManager<TestItem>({
        items: singleItem,
        onReorder,
      })

      manager.startDrag(singleItem[0], 0)
      manager.handleDragOver(0, "after")
      manager.handleDrop()

      expect(onReorder).not.toHaveBeenCalled()
    })

    it("should handle drag to first position", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[9], 9)
      manager.handleDragOver(0, "before")
      manager.handleDrop()

      const reorderedItems = onReorder.mock.calls[0][0]
      expect(reorderedItems[0].id).toBe(10)
    })

    it("should handle drag to last position", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(9, "after")
      manager.handleDrop()

      const reorderedItems = onReorder.mock.calls[0][0]
      expect(reorderedItems[9].id).toBe(1)
    })

    it("should handle drag to same position", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[5], 5)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      expect(onReorder).not.toHaveBeenCalled()
    })
  })

  describe("performance", () => {
    it("should handle large number of items efficiently", () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: i + 1,
      }))
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: largeData,
        onReorder,
      })

      const startTime = Date.now()
      manager.startDrag(largeData[0], 0)
      manager.handleDragOver(500, "after")
      manager.handleDrop()
      const endTime = Date.now()

      expect(endTime - startTime).toBeLessThan(100)
      expect(onReorder).toHaveBeenCalled()
    })

    it("should handle rapid drag operations", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      for (let i = 0; i < 10; i++) {
        manager.startDrag(testData[i % testData.length], i % testData.length)
        manager.handleDragOver((i + 5) % testData.length, "after")
        manager.handleDrop()
      }

      expect(onReorder).toHaveBeenCalledTimes(10)
    })
  })
})
