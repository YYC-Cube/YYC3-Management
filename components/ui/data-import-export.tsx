"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormError, FormErrors } from "@/components/ui/form-error"
import { Download, Upload, FileSpreadsheet, FileJson, FileText, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { DataExporter, DataImporter, validateFile, ImportResult, ExportFormat } from "@/lib/utils/data-import-export"
import { toast } from "sonner"

interface DataImportExportProps<T> {
  data?: T[]
  onImport?: (data: T[]) => Promise<void>
  exportOptions?: {
    filename?: string
    sheetName?: string
  }
  importOptions?: {
    validateRow?: (row: any) => boolean
    transformRow?: (row: any) => any
  }
  disabled?: boolean
  title?: string
}

export function DataImportExport<T>({
  data = [],
  onImport,
  exportOptions,
  importOptions,
  disabled = false,
  title = "数据导入导出",
}: DataImportExportProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"import" | "export">("import")
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<ImportResult<T> | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateFile(file)
    if (!validation.valid) {
      toast({
        title: "文件验证失败",
        description: validation.error,
        variant: "destructive",
      })
      return
    }

    setImportFile(file)
    setImportResult(null)
  }

  const handleImport = async () => {
    if (!importFile) return

    setIsImporting(true)
    setImportProgress(0)

    try {
      const format = DataImporter.detectFileFormat(importFile)
      if (!format) {
        throw new Error("不支持的文件格式")
      }

      setImportProgress(30)

      const result = await DataImporter.import<T>(importFile, format, {
        skipEmptyRows: true,
        trimValues: true,
        ...importOptions,
      })

      setImportProgress(70)

      if (result.success && result.validRows > 0) {
        if (onImport) {
          await onImport(result.data)
        }

        toast({
          title: "导入成功",
          description: `成功导入 ${result.validRows} 条数据`,
        })
      } else {
        toast({
          title: "导入完成",
          description: `导入 ${result.validRows} 条数据，${result.invalidRows} 条失败`,
          variant: result.invalidRows > 0 ? "destructive" : "default",
        })
      }

      setImportResult(result)
      setImportProgress(100)
    } catch (error) {
      toast({
        title: "导入失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleExport = (format: ExportFormat) => {
    if (data.length === 0) {
      toast({
        title: "导出失败",
        description: "没有可导出的数据",
        variant: "destructive",
      })
      return
    }

    try {
      DataExporter.export(data, {
        format,
        filename: exportOptions?.filename || "export",
        sheetName: exportOptions?.sheetName || "Sheet1",
      })

      toast({
        title: "导出成功",
        description: `已导出 ${data.length} 条数据`,
      })
    } catch (error) {
      toast({
        title: "导出失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    }
  }

  const resetImport = () => {
    setImportFile(null)
    setImportResult(null)
    setImportProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <Upload className="w-4 h-4 mr-2" />
          导入/导出
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>导入或导出数据，支持 CSV、Excel 和 JSON 格式</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "import" | "export")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">
              <Upload className="w-4 h-4 mr-2" />
              导入数据
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="w-4 h-4 mr-2" />
              导出数据
            </TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4">
            {!importResult ? (
              <>
                <div className="space-y-4">
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls,.json"
                      onChange={handleFileSelect}
                      disabled={isImporting}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                    />
                  </div>

                  {importFile && (
                    <Alert>
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        已选择文件: {importFile.name} ({(importFile.size / 1024).toFixed(2)} KB)
                      </AlertDescription>
                    </Alert>
                  )}

                  {isImporting && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>导入进度</span>
                        <span>{importProgress}%</span>
                      </div>
                      <Progress value={importProgress} />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isImporting}>
                    取消
                  </Button>
                  <Button onClick={handleImport} disabled={!importFile || isImporting}>
                    {isImporting ? "导入中..." : "开始导入"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {importResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    {importResult.success ? "导入成功" : "导入完成（有错误）"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{importResult.totalRows}</div>
                    <div className="text-sm text-slate-600">总行数</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{importResult.validRows}</div>
                    <div className="text-sm text-slate-600">成功</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{importResult.invalidRows}</div>
                    <div className="text-sm text-slate-600">失败</div>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">错误详情</h4>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {importResult.errors.map((error, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-red-700">{error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={resetImport}>
                    重新导入
                  </Button>
                  <Button onClick={() => setIsOpen(false)}>
                    完成
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <div className="text-center py-8">
              <div className="text-sm text-slate-600 mb-4">
                当前可导出数据: <span className="font-semibold">{data.length}</span> 条
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-6"
                  onClick={() => handleExport("csv")}
                >
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div className="text-sm font-medium">CSV 格式</div>
                  <div className="text-xs text-slate-500">逗号分隔值</div>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-6"
                  onClick={() => handleExport("xlsx")}
                >
                  <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                  <div className="text-sm font-medium">Excel 格式</div>
                  <div className="text-xs text-slate-500">.xlsx 文件</div>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-6"
                  onClick={() => handleExport("json")}
                >
                  <FileJson className="w-8 h-8 text-purple-600" />
                  <div className="text-sm font-medium">JSON 格式</div>
                  <div className="text-xs text-slate-500">JavaScript 对象</div>
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                关闭
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
