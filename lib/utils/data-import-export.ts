import * as XLSX from "xlsx"
import Papa from "papaparse"
import { saveAs } from "file-saver"

export type ExportFormat = "csv" | "xlsx" | "json"

export interface ExportOptions {
  format: ExportFormat
  filename?: string
  sheetName?: string
  includeHeaders?: boolean
}

export interface ImportResult<T> {
  success: boolean
  data: T[]
  errors: string[]
  totalRows: number
  validRows: number
  invalidRows: number
}

export interface ImportOptions {
  skipEmptyRows?: boolean
  trimValues?: boolean
  validateRow?: (row: any) => boolean
  transformRow?: (row: any) => any
}

export class DataExporter {
  static exportToCSV<T>(data: T[], options: ExportOptions = {}): void {
    const { filename = "export", includeHeaders = true } = options

    const csv = Papa.unparse(data, {
      header: includeHeaders,
      skipEmptyLines: true,
    })

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    saveAs(blob, `${filename}.csv`)
  }

  static exportToExcel<T>(data: T[], options: ExportOptions = {}): void {
    const { filename = "export", sheetName = "Sheet1", includeHeaders = true } = options

    const worksheet = XLSX.utils.json_to_sheet(data, { skipHeader: !includeHeaders })
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(blob, `${filename}.xlsx`)
  }

  static exportToJSON<T>(data: T[], options: ExportOptions = {}): void {
    const { filename = "export" } = options

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json;charset=utf-8;" })
    saveAs(blob, `${filename}.json`)
  }

  static export<T>(data: T[], options: ExportOptions): void {
    switch (options.format) {
      case "csv":
        this.exportToCSV(data, options)
        break
      case "xlsx":
        this.exportToExcel(data, options)
        break
      case "json":
        this.exportToJSON(data, options)
        break
      default:
        throw new Error(`Unsupported export format: ${options.format}`)
    }
  }

  static exportMultipleSheets(data: { [sheetName: string]: any[] }, filename: string = "export"): void {
    const workbook = XLSX.utils.book_new()

    Object.entries(data).forEach(([sheetName, sheetData]) => {
      const worksheet = XLSX.utils.json_to_sheet(sheetData)
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    })

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(blob, `${filename}.xlsx`)
  }
}

export class DataImporter {
  static importFromCSV<T>(file: File, options: ImportOptions = {}): Promise<ImportResult<T>> {
    return new Promise((resolve) => {
      const { skipEmptyRows = true, trimValues = true, validateRow, transformRow } = options

      Papa.parse(file, {
        header: true,
        skipEmptyLines: skipEmptyRows,
        transform: trimValues ? (value) => value.trim() : undefined,
        complete: (results) => {
          const errors: string[] = []
          const validData: T[] = []

          results.data.forEach((row: any, index) => {
            if (validateRow && !validateRow(row)) {
              errors.push(`第 ${index + 1} 行数据验证失败`)
              return
            }

            try {
              const processedRow = transformRow ? transformRow(row) : row
              validData.push(processedRow)
            } catch (error) {
              errors.push(`第 ${index + 1} 行数据处理失败: ${error}`)
            }
          })

          resolve({
            success: errors.length === 0,
            data: validData,
            errors,
            totalRows: results.data.length,
            validRows: validData.length,
            invalidRows: errors.length,
          })
        },
        error: (error) => {
          resolve({
            success: false,
            data: [],
            errors: [error.message],
            totalRows: 0,
            validRows: 0,
            invalidRows: 0,
          })
        },
      })
    })
  }

  static importFromExcel<T>(file: File, options: ImportOptions = {}): Promise<ImportResult<T>> {
    return new Promise((resolve) => {
      const { skipEmptyRows = true, trimValues = true, validateRow, transformRow } = options

      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: "array" })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" })

          const errors: string[] = []
          const validData: T[] = []

          jsonData.forEach((row: any, index) => {
            if (skipEmptyRows && Object.values(row).every((v) => v === "")) {
              return
            }

            if (trimValues) {
              Object.keys(row).forEach((key) => {
                if (typeof row[key] === "string") {
                  row[key] = row[key].trim()
                }
              })
            }

            if (validateRow && !validateRow(row)) {
              errors.push(`第 ${index + 1} 行数据验证失败`)
              return
            }

            try {
              const processedRow = transformRow ? transformRow(row) : row
              validData.push(processedRow)
            } catch (error) {
              errors.push(`第 ${index + 1} 行数据处理失败: ${error}`)
            }
          })

          resolve({
            success: errors.length === 0,
            data: validData,
            errors,
            totalRows: jsonData.length,
            validRows: validData.length,
            invalidRows: errors.length,
          })
        } catch (error) {
          resolve({
            success: false,
            data: [],
            errors: [`文件解析失败: ${error}`],
            totalRows: 0,
            validRows: 0,
            invalidRows: 0,
          })
        }
      }

      reader.onerror = () => {
        resolve({
          success: false,
          data: [],
          errors: ["文件读取失败"],
          totalRows: 0,
          validRows: 0,
          invalidRows: 0,
        })
      }

      reader.readAsArrayBuffer(file)
    })
  }

  static importFromJSON<T>(file: File, options: ImportOptions = {}): Promise<ImportResult<T>> {
    return new Promise((resolve) => {
      const { validateRow, transformRow } = options

      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const jsonData = JSON.parse(content)
          const data = Array.isArray(jsonData) ? jsonData : [jsonData]

          const errors: string[] = []
          const validData: T[] = []

          data.forEach((row: any, index) => {
            if (validateRow && !validateRow(row)) {
              errors.push(`第 ${index + 1} 行数据验证失败`)
              return
            }

            try {
              const processedRow = transformRow ? transformRow(row) : row
              validData.push(processedRow)
            } catch (error) {
              errors.push(`第 ${index + 1} 行数据处理失败: ${error}`)
            }
          })

          resolve({
            success: errors.length === 0,
            data: validData,
            errors,
            totalRows: data.length,
            validRows: validData.length,
            invalidRows: errors.length,
          })
        } catch (error) {
          resolve({
            success: false,
            data: [],
            errors: [`JSON解析失败: ${error}`],
            totalRows: 0,
            validRows: 0,
            invalidRows: 0,
          })
        }
      }

      reader.onerror = () => {
        resolve({
          success: false,
          data: [],
          errors: ["文件读取失败"],
          totalRows: 0,
          validRows: 0,
          invalidRows: 0,
        })
      }

      reader.readAsText(file)
    })
  }

  static import<T>(file: File, format: "csv" | "xlsx" | "json", options: ImportOptions = {}): Promise<ImportResult<T>> {
    switch (format) {
      case "csv":
        return this.importFromCSV<T>(file, options)
      case "xlsx":
        return this.importFromExcel<T>(file, options)
      case "json":
        return this.importFromJSON<T>(file, options)
      default:
        return Promise.resolve({
          success: false,
          data: [],
          errors: [`不支持的导入格式: ${format}`],
          totalRows: 0,
          validRows: 0,
          invalidRows: 0,
        })
    }
  }

  static detectFileFormat(file: File): "csv" | "xlsx" | "json" | null {
    const extension = file.name.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "csv":
        return "csv"
      case "xlsx":
      case "xls":
        return "xlsx"
      case "json":
        return "json"
      default:
        return null
    }
  }
}

export function validateFile(file: File, maxSize: number = 10 * 1024 * 1024): { valid: boolean; error?: string } {
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `文件大小超过限制 (${(maxSize / 1024 / 1024).toFixed(2)}MB)`,
    }
  }

  const format = DataImporter.detectFileFormat(file)
  if (!format) {
    return {
      valid: false,
      error: "不支持的文件格式，请使用 CSV、Excel 或 JSON 文件",
    }
  }

  return { valid: true }
}
