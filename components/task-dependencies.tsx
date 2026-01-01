/**
 * @fileoverview task-dependencies.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GitBranch, ArrowRight, AlertTriangle, CheckCircle, Clock, Plus } from "lucide-react"

interface TaskDependency {
  id: string
  fromTask: string
  toTask: string
  type: "finish-to-start" | "start-to-start" | "finish-to-finish"
  status: "active" | "completed" | "blocked"
}

interface TaskNode {
  id: string
  title: string
  status: "todo" | "in-progress" | "completed"
  assignee: string
  dueDate: string
}

export function TaskDependencies() {
  const [dependencies] = useState<TaskDependency[]>([
    {
      id: "1",
      fromTask: "需求分析",
      toTask: "原型设计",
      type: "finish-to-start",
      status: "completed",
    },
    {
      id: "2",
      fromTask: "原型设计",
      toTask: "UI设计",
      type: "finish-to-start",
      status: "active",
    },
    {
      id: "3",
      fromTask: "UI设计",
      toTask: "前端开发",
      type: "finish-to-start",
      status: "blocked",
    },
  ])

  const [tasks] = useState<TaskNode[]>([
    {
      id: "1",
      title: "需求分析",
      status: "completed",
      assignee: "产品经理",
      dueDate: "2025-06-15",
    },
    {
      id: "2",
      title: "原型设计",
      status: "in-progress",
      assignee: "设计师",
      dueDate: "2025-06-25",
    },
    {
      id: "3",
      title: "UI设计",
      status: "todo",
      assignee: "UI设计师",
      dueDate: "2025-07-05",
    },
    {
      id: "4",
      title: "前端开发",
      status: "todo",
      assignee: "前端工程师",
      dueDate: "2025-07-15",
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "blocked":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">已完成</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">进行中</Badge>
      case "todo":
        return <Badge className="bg-gray-100 text-gray-800">待开始</Badge>
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  const getDependencyStatus = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">已完成</Badge>
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">进行中</Badge>
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">阻塞</Badge>
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5" />
              <span>任务依赖关系</span>
            </CardTitle>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              添加依赖
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dependencies.map((dep) => (
              <div key={dep.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="font-medium">{dep.fromTask}</span>
                    <ArrowRight className="w-4 h-4 inline mx-2 text-muted-foreground" />
                    <span className="font-medium">{dep.toTask}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {dep.type === "finish-to-start"
                      ? "完成后开始"
                      : dep.type === "start-to-start"
                        ? "同时开始"
                        : "同时完成"}
                  </Badge>
                  {getDependencyStatus(dep.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>任务流程图</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div key={task.id} className="relative">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(task.status)}
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        负责人: {task.assignee} • 截止: {task.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">{getStatusBadge(task.status)}</div>
                </div>
                {index < tasks.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
