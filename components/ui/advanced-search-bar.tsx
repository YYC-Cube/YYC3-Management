"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X, Filter, Clock, Plus, Trash2, ChevronDown } from "lucide-react"
import { AdvancedSearch, SearchFilter, SearchHistoryItem, createSearchFilter, getFilterValue } from "@/lib/utils/advanced-search"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdvancedSearchBarProps<T> {
  data: T[]
  onSearch: (results: T[]) => void
  fields: Array<{ value: string; label: string }>
  placeholder?: string
  debounceMs?: number
}

export function AdvancedSearchBar<T>({
  data,
  onSearch,
  fields,
  placeholder = "搜索...",
  debounceMs = 300,
}: AdvancedSearchBarProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<SearchFilter[]>([])
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [newFilter, setNewFilter] = useState<Partial<SearchFilter>>({
    field: fields[0]?.value,
    operator: "contains",
    value: "",
  })

  const advancedSearch = new AdvancedSearch<T>({ debounceMs, maxHistoryItems: 10 })

  useEffect(() => {
    setSearchHistory(advancedSearch.getSearchHistory())
  }, [])

  const handleSearch = () => {
    const results = advancedSearch.search(data, searchTerm, filters)
    onSearch(results)

    if (searchTerm || filters.length > 0) {
      advancedSearch.addToHistory(searchTerm, filters, results.length)
      setSearchHistory(advancedSearch.getSearchHistory())
    }

    setIsOpen(false)
    setShowHistory(false)
  }

  const handleQuickSearch = (term: string) => {
    setSearchTerm(term)
    const results = advancedSearch.search(data, term, [])
    onSearch(results)
    setShowHistory(false)
  }

  const handleAddFilter = () => {
    if (newFilter.field && newFilter.operator && newFilter.value !== "") {
      const filter = createSearchFilter(
        newFilter.field!,
        newFilter.operator!,
        newFilter.value,
        fields.find((f) => f.value === newFilter.field)?.label
      )
      setFilters([...filters, filter])
      setNewFilter({
        field: fields[0]?.value,
        operator: "contains",
        value: "",
      })
    }
  }

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index))
  }

  const handleClearAll = () => {
    setSearchTerm("")
    setFilters([])
    onSearch(data)
  }

  const handleClearHistory = () => {
    advancedSearch.clearHistory()
    setSearchHistory([])
  }

  const handleRemoveHistoryItem = (id: string) => {
    advancedSearch.removeFromHistory(id)
    setSearchHistory(advancedSearch.getSearchHistory())
  }

  const handleHistoryClick = (item: SearchHistoryItem) => {
    setSearchTerm(item.query)
    setFilters(item.filters)
    const results = advancedSearch.search(data, item.query, item.filters)
    onSearch(results)
    setIsOpen(false)
    setShowHistory(false)
  }

  const debouncedSearch = advancedSearch.debounce((term: string) => {
    const results = advancedSearch.search(data, term, filters)
    onSearch(results)
  }, debounceMs)

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    debouncedSearch(value)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setShowHistory(true)}
          onBlur={() => setTimeout(() => setShowHistory(false), 200)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => handleSearchChange("")}
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        {showHistory && searchHistory.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                <span>搜索历史</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClearHistory} className="h-6 text-xs">
                清除
              </Button>
            </div>
            <ScrollArea className="max-h-64">
              {searchHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleHistoryClick(item)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.query || "高级搜索"}</div>
                      {item.filters.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {item.filters.slice(0, 3).map((filter, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {filter.label || filter.field}
                            </Badge>
                          ))}
                          {item.filters.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.filters.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-xs text-slate-500">{item.resultCount} 条结果</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveHistoryItem(item.id)
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>高级搜索</DialogTitle>
            <DialogDescription>添加筛选条件以精确搜索数据</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">筛选条件</h4>
                {filters.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setFilters([])} className="h-6 text-xs">
                    清除全部
                  </Button>
                )}
              </div>

              {filters.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  暂无筛选条件，点击下方添加
                </div>
              ) : (
                <div className="space-y-2">
                  {filters.map((filter, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <Badge variant="outline">{filter.label || filter.field}</Badge>
                      <span className="text-sm">{getFilterValue(filter)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-6 w-6 p-0"
                        onClick={() => handleRemoveFilter(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3">添加筛选条件</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Select value={newFilter.field} onValueChange={(value) => setNewFilter({ ...newFilter, field: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择字段" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={newFilter.operator}
                  onValueChange={(value) => setNewFilter({ ...newFilter, operator: value as SearchFilter["operator"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择条件" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">等于</SelectItem>
                    <SelectItem value="contains">包含</SelectItem>
                    <SelectItem value="startsWith">开始于</SelectItem>
                    <SelectItem value="endsWith">结束于</SelectItem>
                    <SelectItem value="greaterThan">大于</SelectItem>
                    <SelectItem value="lessThan">小于</SelectItem>
                    <SelectItem value="between">介于</SelectItem>
                    <SelectItem value="in">在列表中</SelectItem>
                    <SelectItem value="notIn">不在列表中</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="值"
                  value={newFilter.value}
                  onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                  onKeyPress={(e) => e.key === "Enter" && handleAddFilter()}
                />

                <Button onClick={handleAddFilter} disabled={!newFilter.field || !newFilter.value}>
                  <Plus className="w-4 h-4 mr-2" />
                  添加
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                搜索
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {(searchTerm || filters.length > 0) && (
        <Button variant="ghost" size="sm" onClick={handleClearAll}>
          <X className="w-4 h-4 mr-2" />
          清除
        </Button>
      )}
    </div>
  )
}
