export interface SearchFilter {
  field: string
  operator: "equals" | "contains" | "startsWith" | "endsWith" | "greaterThan" | "lessThan" | "between" | "in" | "notIn"
  value: any
  label?: string
}

export interface SearchHistoryItem {
  id: string
  query: string
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

    return data.filter((item) => {
      const matchesSearchTerm = this.matchesSearchTerm(item, searchTerm)
      const matchesFilters = this.matchesFilters(item, filters)
      return matchesSearchTerm && matchesFilters
    })
  }

  private matchesSearchTerm(item: T, searchTerm: string): boolean {
    if (!searchTerm) return true

    const term = searchTerm.toLowerCase()
    const itemValues = Object.values(item as any)

    return itemValues.some((value) => {
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(term)
    })
  }

  private matchesFilters(item: T, filters: SearchFilter[]): boolean {
    if (filters.length === 0) return true

    return filters.every((filter) => {
      const itemValue = (item as any)[filter.field]
      return this.applyFilter(itemValue, filter)
    })
  }

  private applyFilter(value: any, filter: SearchFilter): boolean {
    const filterValue = filter.value

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
        return Number(value) > Number(filterValue)
      case "lessThan":
        return Number(value) < Number(filterValue)
      case "between":
        return Number(value) >= Number(filterValue[0]) && Number(value) <= Number(filterValue[1])
      case "in":
        return Array.isArray(filterValue) && filterValue.includes(value)
      case "notIn":
        return Array.isArray(filterValue) && !filterValue.includes(value)
      default:
        return true
    }
  }

  highlightMatches(text: string, searchTerm: string): string {
    if (!searchTerm) return text

    const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, "gi")
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
  }

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  addToHistory(query: string, filters: SearchFilter[], resultCount: number): void {
    const historyItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query,
      filters,
      timestamp: Date.now(),
      resultCount,
    }

    this.searchHistory = [historyItem, ...this.searchHistory].slice(0, this.maxHistoryItems)
    this.saveHistory()
  }

  getSearchHistory(): SearchHistoryItem[] {
    return this.searchHistory
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

  debounce(func: Function, wait: number): (...args: any[]) => void {
    return (...args: any[]) => {
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
      const value = String((item as any)[field] || "")
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

export function createSearchFilter(field: string, operator: SearchFilter["operator"], value: any, label?: string): SearchFilter {
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
