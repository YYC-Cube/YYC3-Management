// 数据驱动测试 - 使用真实测试数据验证功能
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,数据驱动,真实数据,验证

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { DataExporter, DataImporter } from "@/lib/utils/data-import-export"
import { AdvancedSearch } from "@/lib/utils/advanced-search"
import { BatchOperations } from "@/lib/utils/batch-operations"
import { ChunkedDataLoader } from "@/lib/utils/chunked-data-loader"
import { DataPreloader } from "@/lib/utils/data-preloader"
import { TestDataGenerator, TestUser, TestProduct, TestOrder, TestTask } from "./test-data-generator"

describe("Data Driven Tests - User Management", () => {
  let users: TestUser[]

  beforeEach(() => {
    users = TestDataGenerator.generateUsers(100)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("User data import and export", () => {
    it("should handle CSV import and export with real user data", async () => {
      const csvFile = TestDataGenerator.generateCSV(users, "users.csv")

      const importer = new DataImporter<TestUser>()
      const importResult = await importer.importFromCSV(csvFile)

      expect(importResult.success).toBe(true)
      expect(importResult.data).toHaveLength(100)
      expect(importResult.data[0]).toHaveProperty('id')
      expect(importResult.data[0]).toHaveProperty('name')
      expect(importResult.data[0]).toHaveProperty('email')
    })

    it("should handle JSON import and export with real user data", async () => {
      const jsonFile = TestDataGenerator.generateJSON(users, "users.json")

      const importer = new DataImporter<TestUser>()
      const importResult = await importer.importFromJSON(jsonFile)

      expect(importResult.success).toBe(true)
      expect(importResult.data).toHaveLength(100)
      expect(importResult.data[0]).toEqual(users[0])
    })

    it("should handle edge case user data", async () => {
      const edgeCaseUsers = TestDataGenerator.generateEdgeCaseUsers()
      const csvFile = TestDataGenerator.generateCSV(edgeCaseUsers, "edge-users.csv")

      const importer = new DataImporter<TestUser>()
      const importResult = await importer.importFromCSV(csvFile)

      expect(importResult.success).toBe(true)
      expect(importResult.data).toHaveLength(5)

      const minAgeUser = importResult.data.find(u => u.name === "Min Age User")
      expect(minAgeUser?.age).toBe(18)

      const maxAgeUser = importResult.data.find(u => u.name === "Max Age User")
      expect(maxAgeUser?.age).toBe(80)
    })
  })

  describe("User search with real data", () => {
    it("should search users by name", () => {
      const search = new AdvancedSearch<TestUser>()
      const results = search.search(users, "Alice", [
        { field: "name", operator: "contains" },
      ])

      expect(results.length).toBeGreaterThan(0)
      results.forEach(user => {
        expect(user.name).toContain("Alice")
      })
    })

    it("should search users by age range", () => {
      const search = new AdvancedSearch<TestUser>()
      const results = search.search(users, "", [
        { field: "age", operator: "gte", value: 30 },
        { field: "age", operator: "lte", value: 40 },
      ])

      expect(results.length).toBeGreaterThan(0)
      results.forEach(user => {
        expect(user.age).toBeGreaterThanOrEqual(30)
        expect(user.age).toBeLessThanOrEqual(40)
      })
    })

    it("should search users by status", () => {
      const search = new AdvancedSearch<TestUser>()
      const activeUsers = search.search(users, "", [
        { field: "status", operator: "eq", value: "active" },
      ])

      expect(activeUsers.length).toBeGreaterThan(0)
      activeUsers.forEach(user => {
        expect(user.status).toBe("active")
      })
    })

    it("should search users by role", () => {
      const search = new AdvancedSearch<TestUser>()
      const adminUsers = search.search(users, "", [
        { field: "role", operator: "eq", value: "admin" },
      ])

      expect(adminUsers.length).toBeGreaterThan(0)
      adminUsers.forEach(user => {
        expect(user.role).toBe("admin")
      })
    })

    it("should search users with multiple conditions", () => {
      const search = new AdvancedSearch<TestUser>()
      const results = search.search(users, "", [
        { field: "age", operator: "gte", value: 25 },
        { field: "status", operator: "eq", value: "active" },
        { field: "role", operator: "eq", value: "user" },
      ])

      expect(results.length).toBeGreaterThan(0)
      results.forEach(user => {
        expect(user.age).toBeGreaterThanOrEqual(25)
        expect(user.status).toBe("active")
        expect(user.role).toBe("user")
      })
    })
  })

  describe("User batch operations with real data", () => {
    it("should batch update user status", async () => {
      const batchOps = new BatchOperations<TestUser>()
      const selectedUsers = users.slice(0, 10)

      const updateFn = vi.fn().mockResolvedValue({ success: true })
      const result = await batchOps.batchUpdate(
        selectedUsers,
        { status: "inactive" },
        updateFn
      )

      expect(result.success).toBe(true)
      expect(result.updated).toHaveLength(10)
      expect(updateFn).toHaveBeenCalledTimes(10)
    })

    it("should batch update user role", async () => {
      const batchOps = new BatchOperations<TestUser>()
      const selectedUsers = users.slice(0, 5)

      const updateFn = vi.fn().mockResolvedValue({ success: true })
      const result = await batchOps.batchUpdate(
        selectedUsers,
        { role: "admin" },
        updateFn
      )

      expect(result.success).toBe(true)
      expect(result.updated).toHaveLength(5)
    })

    it("should batch delete users", async () => {
      const batchOps = new BatchOperations<TestUser>()
      const selectedUsers = users.slice(0, 5)

      const deleteFn = vi.fn().mockResolvedValue({ success: true })
      const result = await batchOps.batchDelete(selectedUsers, deleteFn)

      expect(result.success).toBe(true)
      expect(result.deleted).toHaveLength(5)
    })
  })
})

describe("Data Driven Tests - Product Management", () => {
  let products: TestProduct[]

  beforeEach(() => {
    products = TestDataGenerator.generateProducts(100)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("Product data import and export", () => {
    it("should handle CSV import and export with real product data", async () => {
      const csvFile = TestDataGenerator.generateCSV(products, "products.csv")

      const importer = new DataImporter<TestProduct>()
      const importResult = await importer.importFromCSV(csvFile)

      expect(importResult.success).toBe(true)
      expect(importResult.data).toHaveLength(100)
      expect(importResult.data[0]).toHaveProperty('id')
      expect(importResult.data[0]).toHaveProperty('name')
      expect(importResult.data[0]).toHaveProperty('price')
    })

    it("should handle edge case product data", async () => {
      const edgeCaseProducts = TestDataGenerator.generateEdgeCaseProducts()
      const csvFile = TestDataGenerator.generateCSV(edgeCaseProducts, "edge-products.csv")

      const importer = new DataImporter<TestProduct>()
      const importResult = await importer.importFromCSV(csvFile)

      expect(importResult.success).toBe(true)
      expect(importResult.data).toHaveLength(4)

      const freeProduct = importResult.data.find(p => p.name === "Free Product")
      expect(freeProduct?.price).toBe(0)

      const expensiveProduct = importResult.data.find(p => p.name === "Expensive Product")
      expect(expensiveProduct?.price).toBe(9999.99)
    })
  })

  describe("Product search with real data", () => {
    it("should search products by name", () => {
      const search = new AdvancedSearch<TestProduct>()
      const results = search.search(products, "Laptop", [
        { field: "name", operator: "contains" },
      ])

      expect(results.length).toBeGreaterThan(0)
      results.forEach(product => {
        expect(product.name).toContain("Laptop")
      })
    })

    it("should search products by price range", () => {
      const search = new AdvancedSearch<TestProduct>()
      const results = search.search(products, "", [
        { field: "price", operator: "gte", value: 50 },
        { field: "price", operator: "lte", value: 200 },
      ])

      expect(results.length).toBeGreaterThan(0)
      results.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(50)
        expect(product.price).toBeLessThanOrEqual(200)
      })
    })

    it("should search products by category", () => {
      const search = new AdvancedSearch<TestProduct>()
      const electronicsProducts = search.search(products, "", [
        { field: "category", operator: "eq", value: "Electronics" },
      ])

      expect(electronicsProducts.length).toBeGreaterThan(0)
      electronicsProducts.forEach(product => {
        expect(product.category).toBe("Electronics")
      })
    })

    it("should search products by stock", () => {
      const search = new AdvancedSearch<TestProduct>()
      const inStockProducts = search.search(products, "", [
        { field: "stock", operator: "gt", value: 0 },
      ])

      expect(inStockProducts.length).toBeGreaterThan(0)
      inStockProducts.forEach(product => {
        expect(product.stock).toBeGreaterThan(0)
      })
    })
  })
})

describe("Data Driven Tests - Order Management", () => {
  let users: TestUser[]
  let products: TestProduct[]
  let orders: TestOrder[]

  beforeEach(() => {
    users = TestDataGenerator.generateUsers(50)
    products = TestDataGenerator.generateProducts(50)
    orders = TestDataGenerator.generateOrders(200, users, products)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("Order data import and export", () => {
    it("should handle CSV import and export with real order data", async () => {
      const csvFile = TestDataGenerator.generateCSV(orders, "orders.csv")

      const importer = new DataImporter<TestOrder>()
      const importResult = await importer.importFromCSV(csvFile)

      expect(importResult.success).toBe(true)
      expect(importResult.data).toHaveLength(200)
      expect(importResult.data[0]).toHaveProperty('id')
      expect(importResult.data[0]).toHaveProperty('userId')
      expect(importResult.data[0]).toHaveProperty('productId')
      expect(importResult.data[0]).toHaveProperty('total')
    })
  })

  describe("Order search with real data", () => {
    it("should search orders by status", () => {
      const search = new AdvancedSearch<TestOrder>()
      const pendingOrders = search.search(orders, "", [
        { field: "status", operator: "eq", value: "pending" },
      ])

      expect(pendingOrders.length).toBeGreaterThan(0)
      pendingOrders.forEach(order => {
        expect(order.status).toBe("pending")
      })
    })

    it("should search orders by total amount", () => {
      const search = new AdvancedSearch<TestOrder>()
      const highValueOrders = search.search(orders, "", [
        { field: "total", operator: "gte", value: 500 },
      ])

      expect(highValueOrders.length).toBeGreaterThan(0)
      highValueOrders.forEach(order => {
        expect(order.total).toBeGreaterThanOrEqual(500)
      })
    })

    it("should search orders by user", () => {
      const search = new AdvancedSearch<TestOrder>()
      const userOrders = search.search(orders, "", [
        { field: "userId", operator: "eq", value: users[0].id },
      ])

      expect(userOrders.length).toBeGreaterThan(0)
      userOrders.forEach(order => {
        expect(order.userId).toBe(users[0].id)
      })
    })
  })
})

describe("Data Driven Tests - Task Management", () => {
  let users: TestUser[]
  let tasks: TestTask[]

  beforeEach(() => {
    users = TestDataGenerator.generateUsers(50)
    tasks = TestDataGenerator.generateTasks(150, users)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("Task data import and export", () => {
    it("should handle CSV import and export with real task data", async () => {
      const csvFile = TestDataGenerator.generateCSV(tasks, "tasks.csv")

      const importer = new DataImporter<TestTask>()
      const importResult = await importer.importFromCSV(csvFile)

      expect(importResult.success).toBe(true)
      expect(importResult.data).toHaveLength(150)
      expect(importResult.data[0]).toHaveProperty('id')
      expect(importResult.data[0]).toHaveProperty('title')
      expect(importResult.data[0]).toHaveProperty('priority')
      expect(importResult.data[0]).toHaveProperty('status')
    })
  })

  describe("Task search with real data", () => {
    it("should search tasks by priority", () => {
      const search = new AdvancedSearch<TestTask>()
      const highPriorityTasks = search.search(tasks, "", [
        { field: "priority", operator: "eq", value: "high" },
      ])

      expect(highPriorityTasks.length).toBeGreaterThan(0)
      highPriorityTasks.forEach(task => {
        expect(task.priority).toBe("high")
      })
    })

    it("should search tasks by status", () => {
      const search = new AdvancedSearch<TestTask>()
      const todoTasks = search.search(tasks, "", [
        { field: "status", operator: "eq", value: "todo" },
      ])

      expect(todoTasks.length).toBeGreaterThan(0)
      todoTasks.forEach(task => {
        expect(task.status).toBe("todo")
      })
    })

    it("should search tasks by assignee", () => {
      const search = new AdvancedSearch<TestTask>()
      const userTasks = search.search(tasks, "", [
        { field: "assigneeId", operator: "eq", value: users[0].id },
      ])

      expect(userTasks.length).toBeGreaterThan(0)
      userTasks.forEach(task => {
        expect(task.assigneeId).toBe(users[0].id)
      })
    })

    it("should search tasks by due date", () => {
      const search = new AdvancedSearch<TestTask>()
      const dueSoonTasks = search.search(tasks, "", [
        { field: "dueDate", operator: "lte", value: "2025-02-01" },
      ])

      expect(dueSoonTasks.length).toBeGreaterThan(0)
    })
  })
})

describe("Data Driven Tests - Large Dataset Performance", () => {
  let largeUsers: TestUser[]
  let largeProducts: TestProduct[]
  let largeOrders: TestOrder[]
  let largeTasks: TestTask[]

  beforeEach(() => {
    largeUsers = TestDataGenerator.generateUsers(1000)
    largeProducts = TestDataGenerator.generateProducts(500)
    largeOrders = TestDataGenerator.generateOrders(2000, largeUsers, largeProducts)
    largeTasks = TestDataGenerator.generateTasks(1500, largeUsers)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("Large dataset search performance", () => {
    it("should search large user dataset efficiently", () => {
      const search = new AdvancedSearch<TestUser>()
      const startTime = Date.now()

      const results = search.search(largeUsers, "", [
        { field: "age", operator: "gte", value: 30 },
        { field: "status", operator: "eq", value: "active" },
      ])

      const endTime = Date.now()
      const duration = endTime - startTime

      expect(results.length).toBeGreaterThan(0)
      expect(duration).toBeLessThan(1000)
    })

    it("should search large product dataset efficiently", () => {
      const search = new AdvancedSearch<TestProduct>()
      const startTime = Date.now()

      const results = search.search(largeProducts, "", [
        { field: "price", operator: "gte", value: 50 },
        { field: "stock", operator: "gt", value: 0 },
      ])

      const endTime = Date.now()
      const duration = endTime - startTime

      expect(results.length).toBeGreaterThan(0)
      expect(duration).toBeLessThan(1000)
    })

    it("should search large order dataset efficiently", () => {
      const search = new AdvancedSearch<TestOrder>()
      const startTime = Date.now()

      const results = search.search(largeOrders, "", [
        { field: "status", operator: "eq", value: "delivered" },
      ])

      const endTime = Date.now()
      const duration = endTime - startTime

      expect(results.length).toBeGreaterThan(0)
      expect(duration).toBeLessThan(1000)
    })
  })

  describe("Large dataset chunked loading", () => {
    it("should load large user dataset in chunks", async () => {
      const loader = new ChunkedDataLoader<TestUser>({
        chunkSize: 100,
        preloadCount: 2,
      })

      const loadFn = vi.fn((offset, limit) =>
        Promise.resolve(largeUsers.slice(offset, offset + limit))
      )

      const chunk1 = await loader.loadChunk("chunk-0", loadFn)
      expect(chunk1).toHaveLength(100)
      expect(chunk1[0].id).toBe(1)

      await loader.preloadChunks(0, loadFn)
      expect(loader.getChunk("chunk-0")?.loaded).toBe(true)
      expect(loader.getChunk("chunk-1")?.loaded).toBe(true)
      expect(loader.getChunk("chunk-2")?.loaded).toBe(true)
    })

    it("should load large product dataset in chunks", async () => {
      const loader = new ChunkedDataLoader<TestProduct>({
        chunkSize: 50,
        preloadCount: 3,
      })

      const loadFn = vi.fn((offset, limit) =>
        Promise.resolve(largeProducts.slice(offset, offset + limit))
      )

      const chunk1 = await loader.loadChunk("chunk-0", loadFn)
      expect(chunk1).toHaveLength(50)
      expect(chunk1[0].id).toBe(1)

      await loader.preloadChunks(0, loadFn)
      expect(loader.getChunk("chunk-0")?.loaded).toBe(true)
      expect(loader.getChunk("chunk-1")?.loaded).toBe(true)
      expect(loader.getChunk("chunk-2")?.loaded).toBe(true)
      expect(loader.getChunk("chunk-3")?.loaded).toBe(true)
    })
  })

  describe("Large dataset preloading", () => {
    it("should preload large user dataset", async () => {
      const preloader = new DataPreloader<TestUser>({
        enabled: true,
        prefetchCount: 10,
        prefetchDelay: 100,
      })

      const loadFn = vi.fn((id) =>
        Promise.resolve(largeUsers.find(u => u.id === id))
      )

      const userIds = largeUsers.slice(0, 20).map(u => u.id.toString())
      for (const userId of userIds) {
        await preloader.preload(`user-${userId}`, () => loadFn(parseInt(userId)))
      }

      expect(loadFn).toHaveBeenCalledTimes(20)

      const user1 = await preloader.get(`user-${userIds[0]}`, () => loadFn(parseInt(userIds[0])))
      expect(user1).toEqual(largeUsers[0])
      expect(loadFn).toHaveBeenCalledTimes(20)
    })
  })
})

describe("Data Driven Tests - Complete Workflow", () => {
  it("should handle complete user management workflow", async () => {
    const users = TestDataGenerator.generateUsers(50)
    const csvFile = TestDataGenerator.generateCSV(users, "users.csv")

    const importer = new DataImporter<TestUser>()
    const importResult = await importer.importFromCSV(csvFile)

    expect(importResult.success).toBe(true)
    expect(importResult.data).toHaveLength(50)

    const search = new AdvancedSearch<TestUser>()
    const activeUsers = search.search(importResult.data, "", [
      { field: "status", operator: "eq", value: "active" },
    ])

    expect(activeUsers.length).toBeGreaterThan(0)

    const batchOps = new BatchOperations<TestUser>()
    const updateFn = vi.fn().mockResolvedValue({ success: true })
    const batchResult = await batchOps.batchUpdate(
      activeUsers.slice(0, 10),
      { role: "admin" },
      updateFn
    )

    expect(batchResult.success).toBe(true)
    expect(batchResult.updated).toHaveLength(10)

    const mockSaveAs = vi.fn()
    global.saveAs = mockSaveAs

    DataExporter.exportToCSV(activeUsers, { filename: "active-users" })

    expect(mockSaveAs).toHaveBeenCalled()
  })

  it("should handle complete product management workflow", async () => {
    const products = TestDataGenerator.generateProducts(100)
    const csvFile = TestDataGenerator.generateCSV(products, "products.csv")

    const importer = new DataImporter<TestProduct>()
    const importResult = await importer.importFromCSV(csvFile)

    expect(importResult.success).toBe(true)
    expect(importResult.data).toHaveLength(100)

    const search = new AdvancedSearch<TestProduct>()
    const inStockProducts = search.search(importResult.data, "", [
      { field: "stock", operator: "gt", value: 0 },
      { field: "status", operator: "eq", value: "available" },
    ])

    expect(inStockProducts.length).toBeGreaterThan(0)

    const batchOps = new BatchOperations<TestProduct>()
    const updateFn = vi.fn().mockResolvedValue({ success: true })
    const batchResult = await batchOps.batchUpdate(
      inStockProducts.slice(0, 20),
      { status: "out_of_stock" },
      updateFn
    )

    expect(batchResult.success).toBe(true)
    expect(batchResult.updated).toHaveLength(20)
  })
})
