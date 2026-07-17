"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import { BatchOperationResult, BatchOperations } from "@/lib/utils/batch-operations"
import { CheckCircle2, Download, Edit, Play, Trash2, XCircle } from "lucide-react"
import { useState } from "react"

interface BatchOperationsPanelProps<T> {
  items: T[]
  onCreate?: (items: T[]) => Promise<void>
  onUpdate?: (items: Array<{ id: number; data: Partial<T> }>) => Promise<void>
  onDelete?: (ids: number[]) => Promise<void>
  onUpdateStatus?: (ids: number[], status: string) => Promise<void>
  getItemId?: (item: T) => number
  disabled?: boolean
}

export function BatchOperationsPanel<T>({
  items,
  onCreate,
  onUpdate: _onUpdate,
  onDelete,
  onUpdateStatus,
  getItemId = (item) => (item as Record<string, unknown>).id as number,
  disabled = false,
}: BatchOperationsPanelProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeOperation, setActiveOperation] = useState<"create" | "update" | "delete" | "updateStatus" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState({ processed: 0, total: 0 })
  const [result, setResult] = useState<BatchOperationResult<T> | null>(null)
  const [selectedStatus, setSelectedStatus] = useState("active")

  const batchOps = new BatchOperations<T>()

  const handleBatchCreate = async () => {
    if (!onCreate || items.length === 0) return

    setIsProcessing(true)
    setActiveOperation("create")
    setProgress({ processed: 0, total: items.length })

    try {
      const createResult = await batchOps.batchCreate(
        items,
        async (item) => {
          await onCreate([item])
          return { success: true }
        },
        {
          batchSize: 10,
          delayBetweenBatches: 100,
          onProgress: (p) => setProgress(p),
        }
      )

      setResult(createResult)

      if (createResult.success) {
        toast({
          title: "批量创建成功",
          description: `成功创建 ${createResult.succeeded.length} 条数据`,
        })
      } else {
        toast({
          title: "批量创建完成",
          description: `成功 ${createResult.succeeded.length}，失败 ${createResult.failed.length}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "批量创建失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBatchDelete = async () => {
    if (!onDelete || items.length === 0) return

    setIsProcessing(true)
    setActiveOperation("delete")
    setProgress({ processed: 0, total: items.length })

    try {
      const ids = items.map(getItemId)
      const deleteResult = await batchOps.batchDelete(
        ids,
        async (id) => {
          await onDelete([id])
          return { success: true }
        },
        {
          batchSize: 10,
          delayBetweenBatches: 100,
          onProgress: (p) => setProgress(p),
        }
      )

      setResult(deleteResult)

      if (deleteResult.success) {
        toast({
          title: "批量删除成功",
          description: `成功删除 ${deleteResult.succeeded.length} 条数据`,
        })
      } else {
        toast({
          title: "批量删除完成",
          description: `成功 ${deleteResult.succeeded.length}，失败 ${deleteResult.failed.length}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "批量删除失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBatchUpdateStatus = async () => {
    if (!onUpdateStatus || items.length === 0) return

    setIsProcessing(true)
    setActiveOperation("updateStatus")
    setProgress({ processed: 0, total: items.length })

    try {
      const ids = items.map(getItemId)
      const updateResult = await batchOps.batchUpdateStatus(
        ids,
        selectedStatus,
        async (id, data) => {
          await onUpdateStatus([id], (data as any).status as string)
          return { success: true }
        },
        {
          batchSize: 10,
          delayBetweenBatches: 100,
          onProgress: (p) => setProgress(p),
        }
      )

      setResult(updateResult)

      if (updateResult.success) {
        toast({
          title: "批量更新成功",
          description: `成功更新 ${updateResult.succeeded.length} 条数据`,
        })
      } else {
        toast({
          title: "批量更新完成",
          description: `成功 ${updateResult.succeeded.length}，失败 ${updateResult.failed.length}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "批量更新失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExportResults = () => {
    if (!result) return
    batchOps.exportBatchResults(result, "batch-operations")
  }

  const handleReset = () => {
    setActiveOperation(null)
    setProgress({ processed: 0, total: 0 })
    setResult(null)
    setIsOpen(false)
  }

  const getOperationTitle = () => {
    switch (activeOperation) {
      case "create":
        return "批量创建"
      case "update":
        return "批量更新"
      case "delete":
        return "批量删除"
      case "updateStatus":
        return "批量更新状态"
      default:
        return "批量操作"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled || items.length === 0}>
          <Play className="w-4 h-4 mr-2" />
          批量操作
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getOperationTitle()}</DialogTitle>
          <DialogDescription>
            已选择 {items.length} 条数据，选择要执行的操作
          </DialogDescription>
        </DialogHeader>

        {!activeOperation ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onCreate && (
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-6"
                onClick={handleBatchCreate}
                disabled={isProcessing}
              >
                <Edit className="w-8 h-8 text-blue-600" />
                <div className="text-sm font-medium">批量创建</div>
                <div className="text-xs text-muted-foreground">创建新数据</div>
              </Button>
            )}

            {onUpdateStatus && (
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-6"
                onClick={() => setActiveOperation("updateStatus")}
                disabled={isProcessing}
              >
                <Edit className="w-8 h-8 text-success" />
                <div className="text-sm font-medium">批量更新状态</div>
                <div className="text-xs text-muted-foreground">更新数据状态</div>
              </Button>
            )}

            {onDelete && (
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-6"
                onClick={handleBatchDelete}
                disabled={isProcessing}
              >
                <Trash2 className="w-8 h-8 text-destructive" />
                <div className="text-sm font-medium">批量删除</div>
                <div className="text-xs text-muted-foreground">删除选中数据</div>
              </Button>
            )}
          </div>
        ) : activeOperation === "updateStatus" ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">选择状态</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="active">活跃</option>
                <option value="inactive">非活跃</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActiveOperation(null)} disabled={isProcessing}>
                返回
              </Button>
              <Button onClick={handleBatchUpdateStatus} disabled={isProcessing}>
                <Play className="w-4 h-4 mr-2" />
                开始执行
              </Button>
            </div>
          </div>
        ) : isProcessing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>处理进度</span>
              <span>
                {progress.processed} / {progress.total}
              </span>
            </div>
            <Progress value={(progress.processed / progress.total) * 100} />
            <div className="text-center text-sm text-muted-foreground">
              正在处理... 请稍候
            </div>
          </div>
        ) : result ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive" />
              )}
              <span className="font-medium">
                {result.success ? "操作成功" : "操作完成（有错误）"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-foreground">{result.processed}</div>
                <div className="text-sm text-muted-foreground">处理总数</div>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">{result.succeeded.length}</div>
                <div className="text-sm text-muted-foreground">成功</div>
              </div>
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <div className="text-2xl font-bold text-destructive">{result.failed.length}</div>
                <div className="text-sm text-muted-foreground">失败</div>
              </div>
            </div>

            {result.failed.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">错误详情</h4>
                <ScrollArea className="max-h-40">
                  <div className="space-y-1">
                    {result.failed.map(({ item, error }, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-destructive/10 rounded text-sm">
                        <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{JSON.stringify(item)}</div>
                          <div className="text-destructive">{error}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleExportResults}>
                <Download className="w-4 h-4 mr-2" />
                导出结果
              </Button>
              <Button onClick={handleReset}>
                完成
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
