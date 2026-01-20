// 拖拽排序功能的额外测试用例 - 用于提升测试覆盖率至90%以上
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,拖拽排序,覆盖率,单元测试

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { DragDropManager, useDragDrop } from "@/lib/utils/drag-drop"

interface TestItem {
  id: number
  name: string
  value: number
}

describe("DragDropManager - Additional Coverage Tests", () => {
  let manager: DragDropManager<TestItem>
  let testData: TestItem[]

  beforeEach(() => {
    testData = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: i + 1,
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("disabled state coverage", () => {
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
      expect(manager.isDragging()).toBe(false)
    })

    it("should not handle drag over when disabled", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
        disabled: true,
      })

      manager.handleDragOver(5, "after")

      expect(manager.getDropTarget()).toBeNull()
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

    it("should not cancel drag when disabled", () => {
      const onDragEnd = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
        onDragEnd,
        disabled: true,
      })

      manager.startDrag(testData[0], 0)
      manager.cancelDrag()

      expect(onDragEnd).not.toHaveBeenCalled()
    })

    it("should return false for canDropAt when disabled", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
        disabled: true,
      })

      expect(manager.canDropAt(5)).toBe(false)
    })
  })

  describe("cross list drag and drop", () => {
    it("should enable cross list drag and drop", () => {
      const onDragStart = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
        onDragStart,
        crossList: true,
      })

      manager.startDrag(testData[0], 0)

      expect(onDragStart).toHaveBeenCalled()
      expect(manager.isDragging()).toBe(true)
    })

    it("should handle cross list drop", () => {
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

  describe("drag and drop with callbacks", () => {
    it("should call onDragStart callback", () => {
      const onDragStart = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
        onDragStart,
      })

      manager.startDrag(testData[0], 0)

      expect(onDragStart).toHaveBeenCalledWith(testData[0])
    })

    it("should call onDragEnd callback on successful drop", () => {
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

    it("should call onDragEnd callback on same index drop", () => {
      const onDragEnd = vi.fn()
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
        onDragEnd,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(0, "after")
      manager.handleDrop()

      expect(onReorder).not.toHaveBeenCalled()
      expect(onDragEnd).toHaveBeenCalledWith(testData[0])
    })
  })

  describe("drop position handling", () => {
    it("should handle drop before position", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[5], 5)
      manager.handleDragOver(2, "before")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
      const reorderedItems = onReorder.mock.calls[0][0]
      expect(reorderedItems[2].id).toBe(6)
    })

    it("should handle drop after position", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[2], 2)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
      const reorderedItems = onReorder.mock.calls[0][0]
      expect(reorderedItems[5].id).toBe(3)
    })

    it("should handle drop after position when moving forward", () => {
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
      expect(reorderedItems[4].id).toBe(1)
    })

    it("should handle drop before position when moving backward", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[5], 5)
      manager.handleDragOver(0, "before")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
      const reorderedItems = onReorder.mock.calls[0][0]
      expect(reorderedItems[0].id).toBe(6)
    })
  })

  describe("edge cases", () => {
    it("should handle dragging first item", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
    })

    it("should handle dragging last item", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[9], 9)
      manager.handleDragOver(0, "before")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
    })

    it("should handle dropping at first position", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[5], 5)
      manager.handleDragOver(0, "before")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
      const reorderedItems = onReorder.mock.calls[0][0]
      expect(reorderedItems[0].id).toBe(6)
    })

    it("should handle dropping at last position", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(9, "after")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
      const reorderedItems = onReorder.mock.calls[0][0]
      expect(reorderedItems[9].id).toBe(1)
    })

    it("should handle single item list", () => {
      const singleItem = [testData[0]]
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: singleItem,
        onReorder,
      })

      manager.startDrag(singleItem[0], 0)
      manager.handleDragOver(0, "after")
      manager.handleDrop()

      expect(onReorder).not.toHaveBeenCalled()
    })

    it("should handle two item list", () => {
      const twoItems = [testData[0], testData[1]]
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: twoItems,
        onReorder,
      })

      manager.startDrag(twoItems[0], 0)
      manager.handleDragOver(1, "after")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
      const reorderedItems = onReorder.mock.calls[0][0]
      expect(reorderedItems[1].id).toBe(1)
    })

    it("should handle empty list", () => {
      const emptyItems: TestItem[] = []
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: emptyItems,
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(0, "after")
      manager.handleDrop()

      expect(onReorder).not.toHaveBeenCalled()
    })
  })

  describe("update items", () => {
    it("should update items during drag", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      const newItems = [...testData.slice(1), testData[0]]
      manager.updateItems(newItems)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
    })

    it("should update items when not dragging", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      const newItems = [...testData.slice(1), testData[0]]
      manager.updateItems(newItems)

      expect(manager.isDragging()).toBe(false)
    })
  })

  describe("get methods coverage", () => {
    it("should return dragged item", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      manager.startDrag(testData[0], 0)

      const draggedItem = manager.getDraggedItem()
      expect(draggedItem).not.toBeNull()
      expect(draggedItem?.data).toEqual(testData[0])
    })

    it("should return null dragged item when not dragging", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      const draggedItem = manager.getDraggedItem()
      expect(draggedItem).toBeNull()
    })

    it("should return drop target", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")

      const dropTarget = manager.getDropTarget()
      expect(dropTarget).not.toBeNull()
      expect(dropTarget?.index).toBe(5)
      expect(dropTarget?.position).toBe("after")
    })

    it("should return null drop target when not set", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      const dropTarget = manager.getDropTarget()
      expect(dropTarget).toBeNull()
    })

    it("should return true for isDragging when dragging", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      manager.startDrag(testData[0], 0)

      expect(manager.isDragging()).toBe(true)
    })

    it("should return false for isDragging when not dragging", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      expect(manager.isDragging()).toBe(false)
    })

    it("should return false for canDropAt when same index", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      manager.startDrag(testData[0], 0)

      expect(manager.canDropAt(0)).toBe(false)
    })

    it("should return true for canDropAt when different index", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      manager.startDrag(testData[0], 0)

      expect(manager.canDropAt(5)).toBe(true)
    })

    it("should return false for canDropAt when not dragging", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      expect(manager.canDropAt(5)).toBe(false)
    })
  })

  describe("reset functionality", () => {
    it("should reset after successful drop", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      expect(manager.isDragging()).toBe(false)
      expect(manager.getDraggedItem()).toBeNull()
      expect(manager.getDropTarget()).toBeNull()
    })

    it("should reset after cancel", () => {
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder: vi.fn(),
      })

      manager.startDrag(testData[0], 0)
      manager.cancelDrag()

      expect(manager.isDragging()).toBe(false)
      expect(manager.getDraggedItem()).toBeNull()
      expect(manager.getDropTarget()).toBeNull()
    })

    it("should reset after same index drop", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(0, "after")
      manager.handleDrop()

      expect(manager.isDragging()).toBe(false)
      expect(manager.getDraggedItem()).toBeNull()
      expect(manager.getDropTarget()).toBeNull()
    })
  })

  describe("complex scenarios", () => {
    it("should handle multiple drag and drop operations", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDrop()

      manager.startDrag(testData[5], 5)
      manager.handleDragOver(0, "before")
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalledTimes(2)
    })

    it("should handle drag over without drop", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      manager.handleDragOver(5, "after")
      manager.handleDragOver(3, "before")
      manager.cancelDrag()

      expect(onReorder).not.toHaveBeenCalled()
    })

    it("should handle rapid drag over changes", () => {
      const onReorder = vi.fn()
      manager = new DragDropManager<TestItem>({
        items: testData,
        onReorder,
      })

      manager.startDrag(testData[0], 0)
      for (let i = 1; i < 10; i++) {
        manager.handleDragOver(i, i % 2 === 0 ? "before" : "after")
      }
      manager.handleDrop()

      expect(onReorder).toHaveBeenCalled()
    })
  })
})
