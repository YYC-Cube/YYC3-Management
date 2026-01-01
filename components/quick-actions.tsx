/**
 * @fileoverview quick-actions.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Phone, Mail, Calendar, FileText, Users, CheckSquare, Zap } from "lucide-react"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  shortcut: string
  category: "customer" | "task" | "communication" | "general"
}

export function QuickActions() {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const quickActions: QuickAction[] = [
    {
      id: "add-customer",
      title: "添加客户",
      description: "快速添加新客户信息",
      icon: <Users className="w-4 h-4" />,
      shortcut: "Ctrl+Shift+C",
      category: "customer",
    },
    {
      id: "create-task",
      title: "创建任务",
      description: "新建任务并分配给团队成员",
      icon: <CheckSquare className="w-4 h-4" />,
      shortcut: "Ctrl+Shift+T",
      category: "task",
    },
    {
      id: "schedule-meeting",
      title: "安排会议",
      description: "快速安排客户或团队会议",
      icon: <Calendar className="w-4 h-4" />,
      shortcut: "Ctrl+Shift+M",
      category: "communication",
    },
    {
      id: "send-email",
      title: "发送邮件",
      description: "给客户或团队成员发送邮件",
      icon: <Mail className="w-4 h-4" />,
      shortcut: "Ctrl+Shift+E",
      category: "communication",
    },
    {
      id: "make-call",
      title: "拨打电话",
      description: "快速拨打客户电话",
      icon: <Phone className="w-4 h-4" />,
      shortcut: "Ctrl+Shift+P",
      category: "communication",
    },
    {
      id: "create-report",
      title: "生成报表",
      description: "创建销售或任务报表",
      icon: <FileText className="w-4 h-4" />,
      shortcut: "Ctrl+Shift+R",
      category: "general",
    },
  ]

  const filteredActions = quickActions.filter(
    (action) =>
      action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const groupedActions = filteredActions.reduce(
    (groups, action) => {
      const category = action.category
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(action)
      return groups
    },
    {} as Record<string, QuickAction[]>,
  )

  const categoryLabels = {
    customer: "客户管理",
    task: "任务管理",
    communication: "沟通协作",
    general: "通用功能",
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Zap className="w-4 h-4 mr-2" />
          快速操作
          <Badge variant="secondary" className="ml-2 text-xs">
            Ctrl+K
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <Command>
          <CommandInput placeholder="搜索操作..." value={searchTerm} onValueChange={setSearchTerm} />
          <CommandList>
            <CommandEmpty>未找到相关操作</CommandEmpty>
            {Object.entries(groupedActions).map(([category, actions]) => (
              <CommandGroup key={category} heading={categoryLabels[category as keyof typeof categoryLabels]}>
                {actions.map((action) => (
                  <CommandItem
                    key={action.id}
                    onSelect={() => {
                      // 执行对应的操作
                      console.log(`执行操作: ${action.title}`)
                      setOpen(false)
                    }}
                    className="flex items-center justify-between p-3"
                  >
                    <div className="flex items-center space-x-3">
                      {action.icon}
                      <div>
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-muted-foreground">{action.description}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {action.shortcut}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
