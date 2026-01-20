export interface BatchOperationResult<T> {
  success: boolean
  processed: number
  succeeded: number[]
  failed: Array<{ item: T; error: string }>
  errors: string[]
}

export interface BatchOperationOptions {
  batchSize?: number
  delayBetweenBatches?: number
  onProgress?: (progress: { processed: number; total: number }) => void
  onItemComplete?: (item: T, success: boolean, error?: string) => void
}

export class BatchOperations<T> {
  async batchCreate(
    items: T[],
    createFn: (item: T) => Promise<{ success: boolean; error?: string }>,
    options: BatchOperationOptions = {}
  ): Promise<BatchOperationResult<T>> {
    const { batchSize = 10, delayBetweenBatches = 100, onProgress, onItemComplete } = options

    const result: BatchOperationResult<T> = {
      success: true,
      processed: 0,
      succeeded: [],
      failed: [],
      errors: [],
    }

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)

      await Promise.all(
        batch.map(async (item) => {
          try {
            const createResult = await createFn(item)
            if (createResult.success) {
              result.succeeded.push(item as any)
            } else {
              result.failed.push({ item, error: createResult.error || "创建失败" })
              result.errors.push(createResult.error || "创建失败")
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "未知错误"
            result.failed.push({ item, error: errorMessage })
            result.errors.push(errorMessage)
          }

          result.processed++

          if (onItemComplete) {
            onItemComplete(item, result.failed.length === 0 || result.failed[result.failed.length - 1].item !== item)
          }

          if (onProgress) {
            onProgress({ processed: result.processed, total: items.length })
          }
        })
      )

      if (i + batchSize < items.length && delayBetweenBatches > 0) {
        await this.delay(delayBetweenBatches)
      }
    }

    result.success = result.failed.length === 0
    return result
  }

  async batchUpdate(
    items: Array<{ id: number; data: Partial<T> }>,
    updateFn: (id: number, data: Partial<T>) => Promise<{ success: boolean; error?: string }>,
    options: BatchOperationOptions = {}
  ): Promise<BatchOperationResult<T>> {
    const { batchSize = 10, delayBetweenBatches = 100, onProgress, onItemComplete } = options

    const result: BatchOperationResult<T> = {
      success: true,
      processed: 0,
      succeeded: [],
      failed: [],
      errors: [],
    }

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)

      await Promise.all(
        batch.map(async ({ id, data }) => {
          try {
            const updateResult = await updateFn(id, data)
            if (updateResult.success) {
              result.succeeded.push(data as any)
            } else {
              result.failed.push({ item: data as any, error: updateResult.error || "更新失败" })
              result.errors.push(updateResult.error || "更新失败")
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "未知错误"
            result.failed.push({ item: data as any, error: errorMessage })
            result.errors.push(errorMessage)
          }

          result.processed++

          if (onItemComplete) {
            onItemComplete(data as T, result.failed.length === 0 || result.failed[result.failed.length - 1].item !== data)
          }

          if (onProgress) {
            onProgress({ processed: result.processed, total: items.length })
          }
        })
      )

      if (i + batchSize < items.length && delayBetweenBatches > 0) {
        await this.delay(delayBetweenBatches)
      }
    }

    result.success = result.failed.length === 0
    return result
  }

  async batchDelete(
    ids: number[],
    deleteFn: (id: number) => Promise<{ success: boolean; error?: string }>,
    options: BatchOperationOptions = {}
  ): Promise<BatchOperationResult<T>> {
    const { batchSize = 10, delayBetweenBatches = 100, onProgress, onItemComplete } = options

    const result: BatchOperationResult<T> = {
      success: true,
      processed: 0,
      succeeded: [],
      failed: [],
      errors: [],
    }

    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize)

      await Promise.all(
        batch.map(async (id) => {
          try {
            const deleteResult = await deleteFn(id)
            if (deleteResult.success) {
              result.succeeded.push(id as any)
            } else {
              result.failed.push({ item: id as any, error: deleteResult.error || "删除失败" })
              result.errors.push(deleteResult.error || "删除失败")
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "未知错误"
            result.failed.push({ item: id as any, error: errorMessage })
            result.errors.push(errorMessage)
          }

          result.processed++

          if (onItemComplete) {
            onItemComplete(id as T, result.failed.length === 0 || result.failed[result.failed.length - 1].item !== id)
          }

          if (onProgress) {
            onProgress({ processed: result.processed, total: ids.length })
          }
        })
      )

      if (i + batchSize < ids.length && delayBetweenBatches > 0) {
        await this.delay(delayBetweenBatches)
      }
    }

    result.success = result.failed.length === 0
    return result
  }

  async batchUpdateStatus(
    ids: number[],
    status: string,
    updateFn: (id: number, data: Partial<T>) => Promise<{ success: boolean; error?: string }>,
    options: BatchOperationOptions = {}
  ): Promise<BatchOperationResult<T>> {
    const updates = ids.map((id) => ({ id, data: { status } as Partial<T> }))
    return this.batchUpdate(updates, updateFn, options)
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  validateBatch(items: T[], validator: (item: T) => { valid: boolean; error?: string }): Array<{ item: T; error: string }> {
    const invalidItems: Array<{ item: T; error: string }> = []

    items.forEach((item) => {
      const validation = validator(item)
      if (!validation.valid) {
        invalidItems.push({ item, error: validation.error || "验证失败" })
      }
    })

    return invalidItems
  }

  exportBatchResults(result: BatchOperationResult<T>, filename: string = "batch-results"): void {
    const csvContent = [
      ["状态", "错误信息", "数据"],
      ...result.succeeded.map((item) => ["成功", "", JSON.stringify(item)]),
      ...result.failed.map(({ item, error }) => ["失败", error, JSON.stringify(item)]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

export function createBatchOperations<T>(): BatchOperations<T> {
  return new BatchOperations<T>()
}
