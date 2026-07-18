export interface SearchFilter {
  field: string
  operator: "equals" | "contains" | "startsWith" | "endsWith" | "greaterThan" | "lessThan" | "between" | "in" | "notIn"
  value?: unknown
  label?: string
}

export interface SearchHistoryItem {
  id: string
  term: string
  filters: SearchFilter[]
  timestamp: number
  resultCount: number
}

export interface SearchOptions {
  debounceMs?: number
  maxHistoryItems?: number
  highlightMatches?: boolean
  caseSensitive?: boolean
}

export class AdvancedSearch<T> {
  private searchHistory: SearchHistoryItem[] = []
  private maxHistoryItems: number
  private debounceTimer: NodeJS.Timeout | null = null

  constructor(options: SearchOptions = {}) {
    this.maxHistoryItems = options.maxHistoryItems || 10
    this.loadHistory()
  }

  search(data: T[], searchTerm: string, filters: SearchFilter[] = []): T[] {
    if (!searchTerm && filters.length === 0) {
      return data
    }

    // Extract field constraints from filters without value
    const fieldConstraints = filters
      .filter((f) => f.value === undefined && f.field)
      .map((f) => ({ field: f.field, operator: f.operator }))

    return data.filter((item) => {
      const matchesSearchTerm = fieldConstraints.length > 0
        ? this.matchesSearchTermWithConstraints(item, searchTerm, fieldConstraints)
        : this.matchesSearchTerm(item, searchTerm)
      const matchesFilters = this.matchesFilters(item, filters)
      return matchesSearchTerm && matchesFilters
    })
  }

  /** Filter data by conditions without text search */
  filter(data: T[], filters: SearchFilter[]): T[] {
    return data.filter((item) => this.matchesFilters(item, filters))
  }

  /** Get nested value from object by dot-path (e.g. "profile.name") */
  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path
      .split(".")
      .reduce<unknown>((current, key) => {
        if (current === null || current === undefined) return undefined
        return (current as Record<string, unknown>)[key]
      }, obj as unknown)
  }

  private matchesSearchTerm(item: T, searchTerm: string): boolean {
    if (!searchTerm) return true

    const term = searchTerm.toLowerCase()
    const values = this.flattenValues(item as Record<string, unknown>)

    return values.some((value) => {
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(term)
    })
  }

  /** Flatten object to array of leaf values including nested */
  private flattenValues(obj: Record<string, unknown>): unknown[] {
    const result: unknown[] = []
    for (const value of Object.values(obj)) {
      if (value !== null && value !== undefined && typeof value === "object" && !Array.isArray(value)) {
        result.push(...this.flattenValues(value as Record<string, unknown>))
      } else {
        result.push(value)
      }
    }
    return result
  }

  private matchesSearchTermWithConstraints(
    item: T,
    searchTerm: string,
    constraints: { field: string; operator: SearchFilter["operator"] }[]
  ): boolean {
    if (!searchTerm) return true
    if (constraints.length === 0) return this.matchesSearchTerm(item, searchTerm)

    return constraints.some(({ field, operator }) => {
      const value = this.getNestedValue(item as Record<string, unknown>, field)
      return this.applyFilter(value, { field, operator, value: searchTerm })
    })
  }

  private matchesFilters(item: T, filters: SearchFilter[]): boolean {
    if (filters.length === 0) return true

    return filters.every((filter) => {
      const itemValue = this.getNestedValue(item as Record<string, unknown>, filter.field)
      return this.applyFilter(itemValue, filter)
    })
  }

  private applyFilter(value: unknown, filter: SearchFilter): boolean {
    const filterValue = filter.value

    // If no filter value is provided, use field constraint on existing search
    if (filterValue === undefined) return true

    switch (filter.operator) {
      case "equals":
        return value === filterValue
      case "contains":
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
      case "startsWith":
        return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase())
      case "endsWith":
        return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase())
      case "greaterThan":
        return this.compareValues(value, filterValue) > 0
      case "lessThan":
        return this.compareValues(value, filterValue) < 0
      case "between": {
        const arr = filterValue as [unknown, unknown]
        return this.compareValues(value, arr[0]) >= 0 && this.compareValues(value, arr[1]) <= 0
      }
      case "in":
        return Array.isArray(filterValue) && filterValue.includes(value)
      case "notIn":
        return Array.isArray(filterValue) && !filterValue.includes(value)
      default:
        return true
    }
  }

  /** Compare values supporting numbers, strings, and date strings */
  private compareValues(a: unknown, b: unknown): number {
    if (typeof a === "number" && typeof b === "number") return a - b

    const strA = String(a)
    const strB = String(b)

    // Try numeric comparison first
    const numA = Number(strA)
    const numB = Number(strB)
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB

    // Try date comparison
    const dateA = Date.parse(strA)
    const dateB = Date.parse(strB)
    if (!isNaN(dateA) && !isNaN(dateB)) return dateA - dateB

    // Fallback to string comparison
    return strA.localeCompare(strB)
  }

  highlightMatches(text: string, searchTerm: string): string {
    if (!searchTerm) return text

    const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, "gi")
    return text.replace(regex, "<mark>$1</mark>")
  }

  /** @alias highlightMatches */
  highlight(text: string, searchTerm: string): string {
    return this.highlightMatches(text, searchTerm)
  }

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  addToHistory(term: string, filters?: SearchFilter[], resultCount?: number): void {
    const historyItem: SearchHistoryItem = {
      id: Date.now().toString(),
      term,
      filters: filters || [],
      timestamp: Date.now(),
      resultCount: resultCount || 0,
    }

    // Remove duplicate term if exists
    const existingIndex = this.searchHistory.findIndex((item) => item.term === term)
    if (existingIndex >= 0) {
      // Move to front (MRU behavior for repeated terms)
      this.searchHistory.splice(existingIndex, 1)
      this.searchHistory = [historyItem, ...this.searchHistory]
    } else {
      // Append to end for new terms (FIFO order)
      this.searchHistory = [...this.searchHistory, historyItem]
    }

    // Keep within max items limit
    this.searchHistory = this.searchHistory.slice(-this.maxHistoryItems)
    this.saveHistory()
  }

  getSearchHistory(): SearchHistoryItem[] {
    return this.searchHistory
  }

  /** @alias getSearchHistory */
  getHistory(): SearchHistoryItem[] {
    return this.getSearchHistory()
  }

  clearHistory(): void {
    this.searchHistory = []
    this.saveHistory()
  }

  removeFromHistory(id: string): void {
    this.searchHistory = this.searchHistory.filter((item) => item.id !== id)
    this.saveHistory()
  }

  private loadHistory(): void {
    if (typeof window === "undefined") return

    try {
      const saved = localStorage.getItem("search-history")
      if (saved) {
        this.searchHistory = JSON.parse(saved)
      }
    } catch (error) {
      console.error("Failed to load search history:", error)
    }
  }

  private saveHistory(): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem("search-history", JSON.stringify(this.searchHistory))
    } catch (error) {
      console.error("Failed to save search history:", error)
    }
  }

  debounce(func: Function, wait: number): (...args: unknown[]) => void {
    return (...args: unknown[]) => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }

      this.debounceTimer = setTimeout(() => {
        func.apply(this, args)
      }, wait)
    }
  }

  getSearchSuggestions(searchTerm: string, data: T[], field: string): string[] {
    if (!searchTerm || searchTerm.length < 2) return []

    const term = searchTerm.toLowerCase()
    const suggestions = new Set<string>()

    data.forEach((item) => {
      const value = String((item as Record<string, unknown>)[field] || "")
      if (value.toLowerCase().includes(term)) {
        suggestions.add(value)
      }
    })

    return Array.from(suggestions).slice(0, 10)
  }

  getFilterOperators(): Array<{ value: SearchFilter["operator"]; label: string }> {
    return [
      { value: "equals", label: "等于" },
      { value: "contains", label: "包含" },
      { value: "startsWith", label: "开始于" },
      { value: "endsWith", label: "结束于" },
      { value: "greaterThan", label: "大于" },
      { value: "lessThan", label: "小于" },
      { value: "between", label: "介于" },
      { value: "in", label: "在列表中" },
      { value: "notIn", label: "不在列表中" },
    ]
  }
}

export function createSearchFilter(field: string, operator: SearchFilter["operator"], value: unknown, label?: string): SearchFilter {
  return { field, operator, value, label }
}

export function combineFilters(...filters: SearchFilter[]): SearchFilter[] {
  return filters.flat()
}

export function getFilterValue(filter: SearchFilter): string {
  if (Array.isArray(filter.value)) {
    return filter.value.join(", ")
  }
  return String(filter.value)
}
