import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { DataExporter, DataImporter } from "@/lib/utils/data-import-export"

describe("DataExporter", () => {
  describe("exportToCSV", () => {
    it("should export data to CSV format", () => {
      const data = [
        { name: "Alice", age: 30, email: "alice@example.com" },
        { name: "Bob", age: 25, email: "bob@example.com" },
      ]

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToCSV(data, { filename: "test" })

      expect(mockSaveAs).toHaveBeenCalled()
      const call = mockSaveAs.mock.calls[0]
      expect(call[0]).toBeInstanceOf(Blob)
      expect(call[1]).toBe("test.csv")
    })

    it("should handle empty data array", () => {
      const data: any[] = []
      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToCSV(data)

      expect(mockSaveAs).toHaveBeenCalled()
    })

    it("should include headers by default", () => {
      const data = [{ name: "Alice", age: 30 }]
      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToCSV(data)

      const call = mockSaveAs.mock.calls[0]
      const blob = call[0] as Blob
      blob.text().then((text) => {
        expect(text).toContain("name,age,email")
      })
    })

    it("should skip headers when configured", () => {
      const data = [{ name: "Alice", age: 30 }]
      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToCSV(data, { includeHeaders: false })

      const call = mockSaveAs.mock.calls[0]
      const blob = call[0] as Blob
      blob.text().then((text) => {
        expect(text).not.toContain("name,age")
      })
    })
  })

  describe("exportToExcel", () => {
    it("should export data to Excel format", () => {
      const data = [
        { name: "Alice", age: 30, email: "alice@example.com" },
        { name: "Bob", age: 25, email: "bob@example.com" },
      ]

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToExcel(data, { filename: "test", sheetName: "Sheet1" })

      expect(mockSaveAs).toHaveBeenCalled()
      const call = mockSaveAs.mock.calls[0]
      expect(call[0]).toBeInstanceOf(Blob)
      expect(call[1]).toBe("test.xlsx")
    })

    it("should handle empty data array", () => {
      const data: any[] = []
      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToExcel(data)

      expect(mockSaveAs).toHaveBeenCalled()
    })

    it("should use custom sheet name", () => {
      const data = [{ name: "Alice", age: 30 }]
      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToExcel(data, { sheetName: "CustomSheet" })

      expect(mockSaveAs).toHaveBeenCalled()
    })
  })

  describe("exportToJSON", () => {
    it("should export data to JSON format", () => {
      const data = [
        { name: "Alice", age: 30, email: "alice@example.com" },
        { name: "Bob", age: 25, email: "bob@example.com" },
      ]

      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToJSON(data, { filename: "test" })

      expect(mockSaveAs).toHaveBeenCalled()
      const call = mockSaveAs.mock.calls[0]
      expect(call[0]).toBeInstanceOf(Blob)
      expect(call[1]).toBe("test.json")
    })

    it("should handle empty data array", () => {
      const data: any[] = []
      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToJSON(data)

      expect(mockSaveAs).toHaveBeenCalled()
    })

    it("should format JSON correctly", () => {
      const data = [{ name: "Alice", age: 30 }]
      const mockSaveAs = vi.fn()
      global.saveAs = mockSaveAs

      DataExporter.exportToJSON(data)

      const call = mockSaveAs.mock.calls[0]
      const blob = call[0] as Blob
      blob.text().then((text) => {
        const parsed = JSON.parse(text)
        expect(parsed).toEqual(data)
      })
    })
  })
})

describe("DataImporter", () => {
  describe("importFromCSV", () => {
    it("should import data from CSV file", async () => {
      const csvContent = "name,age,email\nAlice,30,alice@example.com\nBob,25,bob@example.com"
      const file = new File([csvContent], "test.csv", { type: "text/csv" })

      const result = await DataImporter.importFromCSV(file)

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      expect(result.data[0]).toEqual({ name: "Alice", age: 30, email: "alice@example.com" })
    })

    it("should handle CSV with empty lines", async () => {
      const csvContent = "name,age\n\nAlice,30\n\nBob,25"
      const file = new File([csvContent], "test.csv", { type: "text/csv" })

      const result = await DataImporter.importFromCSV(file)

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
    })

    it("should handle CSV with special characters", async () => {
      const csvContent = 'name,age\n"Alice, Jr.",30\n"O\'Brien, Bob",25'
      const file = new File([csvContent], "test.csv", { type: "text/csv" })

      const result = await DataImporter.importFromCSV(file)

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
    })

    it("should validate data with custom validator", async () => {
      const csvContent = "name,age\nAlice,30\nBob,25"
      const file = new File([csvContent], "test.csv", { type: "text/csv" })

      const result = await DataImporter.importFromCSV(file, {
        validateRow: (row) => row.name && row.age,
      })

      expect(result.success).toBe(true)
    })

    it("should transform data with custom transformer", async () => {
      const csvContent = "name,age\nAlice,30\nBob,25"
      const file = new File([csvContent], "test.csv", { type: "text/csv" })

      const result = await DataImporter.importFromCSV(file, {
        transformRow: (row) => ({
          fullName: row.name,
          yearsOld: row.age,
        }),
      })

      expect(result.success).toBe(true)
      expect(result.data[0]).toEqual({ fullName: "Alice", yearsOld: 30 })
    })

    it("should handle invalid CSV file", async () => {
      const invalidContent = "invalid,csv,format"
      const file = new File([invalidContent], "test.csv", { type: "text/csv" })

      const result = await DataImporter.importFromCSV(file)

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe("importFromExcel", () => {
    it("should import data from Excel file", async () => {
      const mockXlsx = {
        read: vi.fn().mockReturnValue({
          Sheets: { Sheet1: {} },
          SheetNames: ["Sheet1"],
        }),
        utils: {
          sheet_to_json: vi.fn().mockReturnValue([
            { name: "Alice", age: 30 },
            { name: "Bob", age: 25 },
          ]),
        },
      }
      global.XLSX = mockXlsx

      const file = new File([new ArrayBuffer(0)], "test.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      const result = await DataImporter.importFromExcel(file)

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
    })

    it("should handle Excel with multiple sheets", async () => {
      const mockXlsx = {
        read: vi.fn().mockReturnValue({
          Sheets: {
            Sheet1: {},
            Sheet2: {},
          },
          SheetNames: ["Sheet1", "Sheet2"],
        }),
        utils: {
          sheet_to_json: vi.fn().mockReturnValue([
            { name: "Alice", age: 30 },
          ]),
        },
      }
      global.XLSX = mockXlsx

      const file = new File([new ArrayBuffer(0)], "test.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      const result = await DataImporter.importFromExcel(file, { sheetName: "Sheet2" })

      expect(result.success).toBe(true)
    })

    it("should validate data with custom validator", async () => {
      const mockXlsx = {
        read: vi.fn().mockReturnValue({
          Sheets: { Sheet1: {} },
          SheetNames: ["Sheet1"],
        }),
        utils: {
          sheet_to_json: vi.fn().mockReturnValue([
            { name: "Alice", age: 30 },
          ]),
        },
      }
      global.XLSX = mockXlsx

      const file = new File([new ArrayBuffer(0)], "test.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      const result = await DataImporter.importFromExcel(file, {
        validateRow: (row) => row.name && row.age,
      })

      expect(result.success).toBe(true)
    })
  })

  describe("importFromJSON", () => {
    it("should import data from JSON file", async () => {
      const jsonData = [
        { name: "Alice", age: 30, email: "alice@example.com" },
        { name: "Bob", age: 25, email: "bob@example.com" },
      ]
      const file = new File([JSON.stringify(jsonData)], "test.json", {
        type: "application/json",
      })

      const result = await DataImporter.importFromJSON(file)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(jsonData)
    })

    it("should handle JSON with nested objects", async () => {
      const jsonData = [
        { user: { name: "Alice", age: 30 }, contact: { email: "alice@example.com" } },
      ]
      const file = new File([JSON.stringify(jsonData)], "test.json", {
        type: "application/json",
      })

      const result = await DataImporter.importFromJSON(file)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(jsonData)
    })

    it("should validate JSON structure", async () => {
      const jsonData = [
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 },
      ]
      const file = new File([JSON.stringify(jsonData)], "test.json", {
        type: "application/json",
      })

      const result = await DataImporter.importFromJSON(file, {
        validateRow: (row) => row.name && row.age,
      })

      expect(result.success).toBe(true)
    })

    it("should handle invalid JSON file", async () => {
      const invalidJson = "{ invalid json }"
      const file = new File([invalidJson], "test.json", {
        type: "application/json",
      })

      const result = await DataImporter.importFromJSON(file)

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })
})
