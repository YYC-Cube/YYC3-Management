/**
 * @fileoverview advanced-timer.tsx
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, Square, Clock, Target, BarChart3, Calendar } from "lucide-react"

interface TimeEntry {
  id: string
  taskId: string
  taskTitle: string
  startTime: string
  endTime?: string
  duration: number
  description: string
  date: string
}

interface TimerSession {
  taskId: string
  taskTitle: string
  startTime: Date
  elapsedTime: number
}

export function AdvancedTimer() {
  const [currentSession, setCurrentSession] = useState<TimerSession | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [timeEntries] = useState<TimeEntry[]>([
    {
      id: "1",
      taskId: "task-1",
      taskTitle: "产品原型设计",
      startTime: "09:00",
      endTime: "11:30",
      duration: 150, // 分钟
      description: "完成用户界面原型设计",
      date: "2025-06-19",
    },
    {
      id: "2",
      taskId: "task-1",
      taskTitle: "产品原型设计",
      startTime: "14:00",
      endTime: "16:00",
      duration: 120,
      description: "优化交互流程",
      date: "2025-06-19",
    },
  ])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && currentSession) {
      interval = setInterval(() => {
        setCurrentSession((prev) =>
          prev
            ? {
                ...prev,
                elapsedTime: Date.now() - prev.startTime.getTime(),
              }
            : null,
        )
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, currentSession])

  const startTimer = (taskId: string, taskTitle: string) => {
    setCurrentSession({
      taskId,
      taskTitle,
      startTime: new Date(),
      elapsedTime: 0,
    })
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const stopTimer = () => {
    setIsRunning(false)
    setCurrentSession(null)
    // 这里可以保存时间记录
  }

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getTotalTimeToday = () => {
    const today = new Date().toISOString().split("T")[0]
    return timeEntries.filter((entry) => entry.date === today).reduce((total, entry) => total + entry.duration, 0)
  }

  const getTaskTimeToday = (taskId: string) => {
    const today = new Date().toISOString().split("T")[0]
    return timeEntries
      .filter((entry) => entry.taskId === taskId && entry.date === today)
      .reduce((total, entry) => total + entry.duration, 0)
  }

  return (
    <div className="space-y-6">
      {/* 当前计时器 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>时间跟踪器</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentSession ? (
            <div className="text-center space-y-4">
              <div>
                <h3 className="font-medium text-lg">{currentSession.taskTitle}</h3>
                <div className="text-3xl font-bold text-blue-600 mt-2">{formatTime(currentSession.elapsedTime)}</div>
              </div>

              <div className="flex justify-center space-x-2">
                {isRunning ? (
                  <Button onClick={pauseTimer} variant="outline">
                    <Pause className="w-4 h-4 mr-2" />
                    暂停
                  </Button>
                ) : (
                  <Button onClick={() => setIsRunning(true)}>
                    <Play className="w-4 h-4 mr-2" />
                    继续
                  </Button>
                )}
                <Button onClick={stopTimer} variant="destructive">
                  <Square className="w-4 h-4 mr-2" />
                  停止
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">选择任务开始计时</p>
              <Button onClick={() => startTimer("task-1", "产品原型设计")}>
                <Play className="w-4 h-4 mr-2" />
                开始计时
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 今日统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日总工时</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(getTotalTimeToday() / 60)}h {getTotalTimeToday() % 60}m
            </div>
            <p className="text-xs text-muted-foreground">目标: 8小时</p>
            <Progress value={(getTotalTimeToday() / 480) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃任务</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">正在进行的任务</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均专注时间</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45m</div>
            <p className="text-xs text-muted-foreground">单次专注时长</p>
          </CardContent>
        </Card>
      </div>

      {/* 时间记录 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>今日时间记录</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{entry.taskTitle}</h4>
                  <p className="text-xs text-muted-foreground">{entry.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {Math.floor(entry.duration / 60)}h {entry.duration % 60}m
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {entry.startTime} - {entry.endTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
