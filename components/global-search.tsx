/**
 * @fileoverview global-search.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Users, CheckSquare, DollarSign, Target, Calendar, FileText, Zap } from "lucide-react"

interface SearchResult {
  id: string
  title: string
  description: string
  type: "customer" | "task" | "finance" | "okr" | "schedule" | "document" | "feature"
  category: string
  url?: string
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])

  // 模拟搜索数据
  const searchData: SearchResult[] = [
    {
      id: "1",
      title: "张三",
      description: "高级客户 - 上海科技有限公司",
      type: "customer",
      category: "客户管理",
      url: "/customers/1",
    },
    {
      id: "2",
      title: "系统升级任务",
      description: "计划于本周完成系统升级工作",
      type: "task",
      category: "任务管理",
      url: "/tasks/2",
    },
    {
      id: "3",
      title: "Q1财务报告",
      description: "第一季度财务分析报告",
      type: "finance",
      category: "财务管理",
      url: "/finance/reports/q1",
    },
    {
      id: "4",
      title: "提升客户满意度",
      description: "2024年度关键目标",
      type: "okr",
      category: "OKR管理",
      url: "/okr/4",
    },
    {
      id: "5",
      title: "团队会议",
      description: "每周例会 - 周一上午10:00",
      type: "schedule",
      category: "日程安排",
      url: "/calendar/5",
    },
  ]

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()),
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [query])

  const getIcon = (type: string) => {
    switch (type) {
      case "customer":
        return <Users className="w-4 h-4" />
      case "task":
        return <CheckSquare className="w-4 h-4" />
      case "finance":
        return <DollarSign className="w-4 h-4" />
      case "okr":
        return <Target className="w-4 h-4" />
      case "schedule":
        return <Calendar className="w-4 h-4" />
      case "document":
        return <FileText className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "customer":
        return "bg-blue-100 text-blue-700"
      case "task":
        return "bg-green-100 text-green-700"
      case "finance":
        return "bg-yellow-100 text-yellow-700"
      case "okr":
        return "bg-purple-100 text-purple-700"
      case "schedule":
        return "bg-pink-100 text-pink-700"
      case "document":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-sky-100 text-sky-700"
    }
  }

  return (
    <>
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-400 w-4 h-4" />
        <Input
          placeholder="搜索功能、客户、任务... (Ctrl+K)"
          className="pl-10 border-sky-200 focus:border-sky-400 focus:ring-sky-400 bg-sky-50/50 transition-all duration-200 cursor-pointer"
          onClick={() => setOpen(true)}
          readOnly
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 overflow-hidden">
          <Command className="w-full max-w-2xl">
            <CommandInput placeholder="搜索功能、客户、任务..." value={query} onValueChange={setQuery} />
            <CommandList>
              <CommandEmpty>
                <div className="py-6 text-center text-sm">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  {query ? "未找到相关结果" : "输入关键词开始搜索"}
                </div>
              </CommandEmpty>

              {results.length > 0 && (
                <>
                  <CommandGroup heading="搜索结果">
                    {results.map((result) => (
                      <CommandItem
                        key={result.id}
                        value={result.title}
                        onSelect={() => {
                          setOpen(false)
                          // 这里可以添加导航逻辑
                          console.log("Navigate to:", result.url)
                        }}
                        className="flex items-center gap-3 p-3"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-100 text-sky-600">
                          {getIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{result.title}</span>
                            <Badge variant="secondary" className={`text-xs ${getTypeColor(result.type)}`}>
                              {result.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              <CommandGroup heading="快速操作">
                <CommandItem onSelect={() => setOpen(false)}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>客户管理</span>
                </CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  <span>任务管理</span>
                </CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>财务管理</span>
                </CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>
                  <Target className="mr-2 h-4 w-4" />
                  <span>OKR管理</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
