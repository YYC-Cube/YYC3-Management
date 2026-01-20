"use client"

import { useRef, useState, useEffect, useMemo, useCallback } from "react"

interface VirtualScrollProps<T> {
  items: T[]
  itemHeight: number | ((index: number) => number)
  containerHeight: number
  overscan?: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
  renderItem,
  className = "",
  style = {},
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  const getItemHeight = useCallback(
    (index: number): number => {
      return typeof itemHeight === "function" ? itemHeight(index) : itemHeight
    },
    [itemHeight]
  )

  const { visibleRange, totalHeight, offsetY } = useMemo(() => {
    let startIndex = 0
    let endIndex = items.length
    let offsetY = 0

    for (let i = 0; i < items.length; i++) {
      const height = getItemHeight(i)
      if (offsetY + height >= scrollTop - overscan * getItemHeight(0)) {
        startIndex = i
        break
      }
      offsetY += height
    }

    let currentOffset = offsetY
    let visibleCount = 0

    for (let i = startIndex; i < items.length; i++) {
      const height = getItemHeight(i)
      if (currentOffset + height > scrollTop + containerHeight + overscan * getItemHeight(0)) {
        endIndex = i
        break
      }
      currentOffset += height
      visibleCount++
    }

    return {
      visibleRange: { start: startIndex, end: endIndex },
      totalHeight: offsetY,
      offsetY,
    }
  }, [items.length, scrollTop, containerHeight, overscan, getItemHeight])

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end)
  }, [items, visibleRange])

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth)
    }
  }, [])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  const scrollToIndex = useCallback(
    (index: number) => {
      let offset = 0
      for (let i = 0; i < index; i++) {
        offset += getItemHeight(i)
      }

      if (scrollElementRef.current) {
        scrollElementRef.current.scrollTop = offset
      }
    },
    [getItemHeight]
  )

  const scrollToTop = useCallback(() => {
    if (scrollElementRef.current) {
      scrollElementRef.current.scrollTop = 0
    }
  }, [])

  const scrollToBottom = useCallback(() => {
    if (scrollElementRef.current) {
      scrollElementRef.current.scrollTop = totalHeight
    }
  }, [totalHeight])

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ height: containerHeight, width: "100%", ...style }}
    >
      <div
        ref={scrollElementRef}
        className="overflow-y-auto h-full"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map((item, index) => {
              const actualIndex = visibleRange.start + index
              return (
                <div
                  key={actualIndex}
                  style={{
                    height: getItemHeight(actualIndex),
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  {renderItem(item, actualIndex)}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export interface VirtualScrollListProps<T> {
  items: T[]
  itemHeight: number | ((index: number) => number)
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  onScroll?: (scrollTop: number) => void
  onEndReached?: () => void
  endReachedThreshold?: number
  loading?: boolean
  loadingComponent?: React.ReactNode
}

export function VirtualScrollList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = "",
  onScroll,
  onEndReached,
  endReachedThreshold = 200,
  loading = false,
  loadingComponent,
}: VirtualScrollListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const [isEndReached, setIsEndReached] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  const getItemHeight = useCallback(
    (index: number): number => {
      return typeof itemHeight === "function" ? itemHeight(index) : itemHeight
    },
    [itemHeight]
  )

  const { visibleRange, totalHeight, offsetY } = useMemo(() => {
    let startIndex = 0
    let endIndex = items.length
    let offsetY = 0

    for (let i = 0; i < items.length; i++) {
      const height = getItemHeight(i)
      if (offsetY + height >= scrollTop - 5 * getItemHeight(0)) {
        startIndex = i
        break
      }
      offsetY += height
    }

    let currentOffset = offsetY
    let visibleCount = 0

    for (let i = startIndex; i < items.length; i++) {
      const height = getItemHeight(i)
      if (currentOffset + height > scrollTop + containerHeight + 5 * getItemHeight(0)) {
        endIndex = i
        break
      }
      currentOffset += height
      visibleCount++
    }

    return {
      visibleRange: { start: startIndex, end: endIndex },
      totalHeight: offsetY,
      offsetY,
    }
  }, [items.length, scrollTop, containerHeight, getItemHeight])

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end)
  }, [items, visibleRange])

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const currentScrollTop = e.currentTarget.scrollTop
      setScrollTop(currentScrollTop)

      if (onScroll) {
        onScroll(currentScrollTop)
      }

      if (onEndReached && !isEndReached) {
        const distanceToBottom = totalHeight - currentScrollTop - containerHeight
        if (distanceToBottom < endReachedThreshold) {
          setIsEndReached(true)
          onEndReached()
        }
      }
    },
    [totalHeight, containerHeight, onScroll, onEndReached, isEndReached, endReachedThreshold]
  )

  useEffect(() => {
    setIsEndReached(false)
  }, [items])

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ height: containerHeight, width: "100%" }}
    >
      <div
        ref={scrollElementRef}
        className="overflow-y-auto h-full"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map((item, index) => {
              const actualIndex = visibleRange.start + index
              return (
                <div
                  key={actualIndex}
                  style={{
                    height: getItemHeight(actualIndex),
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  {renderItem(item, actualIndex)}
                </div>
              )
            })}
          </div>
          {loading && loadingComponent && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "20px",
                textAlign: "center",
              }}
            >
              {loadingComponent}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
