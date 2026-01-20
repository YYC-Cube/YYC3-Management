"use client"

import { useState, useRef, useCallback, useEffect } from "react"

export interface DragItem<T> {
  id: string
  data: T
  index: number
}

export interface DropTarget {
  index: number
  position: "before" | "after"
}

export interface DragDropOptions<T> {
  items: T[]
  onReorder: (newItems: T[]) => void
  onDragStart?: (item: T) => void
  onDragEnd?: (item: T) => void
  disabled?: boolean
  crossList?: boolean
}

export class DragDropManager<T> {
  private draggedItem: DragItem<T> | null = null
  private dropTarget: DropTarget | null = null
  private items: T[]
  private onReorder: (newItems: T[]) => void
  private onDragStart?: (item: T) => void
  private onDragEnd?: (item: T) => void
  private disabled: boolean
  private crossList: boolean

  constructor(options: DragDropOptions<T>) {
    this.items = options.items
    this.onReorder = options.onReorder
    this.onDragStart = options.onDragStart
    this.onDragEnd = options.onDragEnd
    this.disabled = options.disabled || false
    this.crossList = options.crossList || false
  }

  startDrag(item: T, index: number): void {
    if (this.disabled) {
      return
    }

    this.draggedItem = {
      id: `drag-${Date.now()}`,
      data: item,
      index,
    }

    this.onDragStart?.(item)
  }

  handleDragOver(index: number, position: "before" | "after" = "after"): void {
    if (!this.draggedItem || this.disabled) {
      return
    }

    this.dropTarget = { index, position }
  }

  handleDrop(): void {
    if (!this.draggedItem || !this.dropTarget || this.disabled) {
      return
    }

    const { index: fromIndex } = this.draggedItem
    const { index: toIndex, position } = this.dropTarget

    if (fromIndex === toIndex) {
      return
    }

    const newItems = [...this.items]
    const removed = newItems.splice(fromIndex, 1)[0]

    let insertIndex = toIndex
    if (fromIndex < toIndex && position === "after") {
      insertIndex = toIndex - 1
    } else if (fromIndex > toIndex && position === "before") {
      insertIndex = toIndex
    } else if (position === "after") {
      insertIndex = toIndex + 1
    }

    newItems.splice(insertIndex, 0, removed)
    this.onReorder(newItems)

    this.onDragEnd?.(removed)
    this.reset()
  }

  cancelDrag(): void {
    if (this.draggedItem) {
      this.onDragEnd?.(this.draggedItem.data)
    }
    this.reset()
  }

  private reset(): void {
    this.draggedItem = null
    this.dropTarget = null
  }

  isDragging(): boolean {
    return this.draggedItem !== null
  }

  getDraggedItem(): DragItem<T> | null {
    return this.draggedItem
  }

  getDropTarget(): DropTarget | null {
    return this.dropTarget
  }

  canDropAt(index: number): boolean {
    if (!this.draggedItem || this.disabled) {
      return false
    }

    return this.draggedItem.index !== index
  }

  updateItems(newItems: T[]): void {
    this.items = newItems
  }
}

export interface UseDragDropOptions<T> extends DragDropOptions<T> {
  getItemId?: (item: T) => string
}

export function useDragDrop<T>(options: UseDragDropOptions<T>) {
  const {
    items,
    onReorder,
    onDragStart,
    onDragEnd,
    disabled = false,
    crossList = false,
    getItemId = (item) => JSON.stringify(item),
  } = options

  const [draggedItem, setDraggedItem] = useState<DragItem<T> | null>(null)
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null)
  const managerRef = useRef<DragDropManager<T> | null>(null)

  useEffect(() => {
    managerRef.current = new DragDropManager<T>({
      items,
      onReorder,
      onDragStart,
      onDragEnd,
      disabled,
      crossList,
    })

    return () => {
      managerRef.current?.cancelDrag()
    }
  }, [items, onReorder, onDragStart, onDragEnd, disabled, crossList])

  useEffect(() => {
    managerRef.current?.updateItems(items)
  }, [items])

  const handleDragStart = useCallback(
    (item: T, index: number) => {
      if (disabled) {
        return
      }

      const dragItem: DragItem<T> = {
        id: getItemId(item),
        data: item,
        index,
      }

      setDraggedItem(dragItem)
      managerRef.current?.startDrag(item, index)
    },
    [disabled, getItemId]
  )

  const handleDragOver = useCallback(
    (index: number, position: "before" | "after" = "after") => {
      if (disabled || !draggedItem) {
        return
      }

      setDropTarget({ index, position })
      managerRef.current?.handleDragOver(index, position)
    },
    [disabled, draggedItem]
  )

  const handleDrop = useCallback(() => {
    if (disabled || !draggedItem) {
      return
    }

    managerRef.current?.handleDrop()
    setDraggedItem(null)
    setDropTarget(null)
  }, [disabled, draggedItem])

  const handleDragEnd = useCallback(() => {
    managerRef.current?.cancelDrag()
    setDraggedItem(null)
    setDropTarget(null)
  }, [])

  const canDropAt = useCallback(
    (index: number) => {
      if (!draggedItem) {
        return false
      }

      return draggedItem.index !== index
    },
    [draggedItem]
  )

  return {
    draggedItem,
    dropTarget,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    canDropAt,
    isDragging: draggedItem !== null,
  }
}
