// 测试数据生成器 - 生成真实场景的测试数据
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,数据生成,数据驱动,真实数据

export interface TestUser {
  id: number
  name: string
  email: string
  age: number
  status: "active" | "inactive" | "pending"
  role: "admin" | "user" | "guest"
  createdAt: string
  updatedAt: string
}

export interface TestProduct {
  id: number
  name: string
  description: string
  price: number
  category: string
  stock: number
  status: "available" | "out_of_stock" | "discontinued"
  createdAt: string
}

export interface TestOrder {
  id: number
  userId: number
  productId: number
  quantity: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  updatedAt: string
}

export interface TestTask {
  id: number
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "todo" | "in_progress" | "review" | "done"
  assigneeId: number
  dueDate: string
  createdAt: string
  updatedAt: string
}

export class TestDataGenerator {
  private static readonly firstNames = [
    "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry",
    "Ivy", "Jack", "Karen", "Leo", "Mia", "Noah", "Olivia", "Peter", "Quinn",
    "Rachel", "Sam", "Tina", "Uma", "Victor", "Wendy", "Xander", "Yara", "Zack"
  ]

  private static readonly lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker"
  ]

  private static readonly domains = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "example.com",
    "company.com", "business.com", "tech.com", "digital.com", "online.com"
  ]

  private static readonly productCategories = [
    "Electronics", "Clothing", "Food", "Books", "Home & Garden", "Sports",
    "Toys", "Automotive", "Health", "Beauty", "Office", "Music"
  ]

  private static readonly productNames = [
    "Laptop", "Smartphone", "Tablet", "Headphones", "Keyboard", "Mouse",
    "Monitor", "Camera", "Speaker", "Charger", "Cable", "Case", "Stand",
    "Desk", "Chair", "Lamp", "Fan", "Heater", "Clock", "Calendar"
  ]

  private static readonly taskTitles = [
    "Review documentation", "Fix bug in login", "Update user interface",
    "Implement new feature", "Write unit tests", "Code review", "Deploy to staging",
    "Monitor performance", "Analyze metrics", "Create backup", "Update dependencies",
    "Refactor code", "Optimize database", "Write API documentation", "Test integration"
  ]

  private static readonly statuses = {
    user: ["active", "inactive", "pending"] as const,
    role: ["admin", "user", "guest"] as const,
    product: ["available", "out_of_stock", "discontinued"] as const,
    order: ["pending", "processing", "shipped", "delivered", "cancelled"] as const,
    task: ["todo", "in_progress", "review", "done"] as const,
    priority: ["low", "medium", "high", "urgent"] as const
  }

  private static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private static randomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  private static randomDate(start: Date, end: Date): string {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return date.toISOString().split('T')[0]
  }

  private static randomEmail(firstName: string, lastName: string): string {
    const domain = this.randomItem(this.domains)
    const separator = Math.random() > 0.5 ? '.' : ''
    const number = Math.random() > 0.7 ? this.randomInt(1, 999) : ''
    return `${firstName.toLowerCase()}${separator}${lastName.toLowerCase()}${number}@${domain}`
  }

  public static generateUsers(count: number, options: {
    minAge?: number
    maxAge?: number
    roles?: typeof this.statuses.role
    statuses?: typeof this.statuses.user
  } = {}): TestUser[] {
    const users: TestUser[] = []
    const { minAge = 18, maxAge = 80, roles, statuses } = options

    for (let i = 0; i < count; i++) {
      const firstName = this.randomItem(this.firstNames)
      const lastName = this.randomItem(this.lastNames)
      const createdAt = this.randomDate(
        new Date(2020, 0, 1),
        new Date()
      )
      const updatedAt = this.randomDate(
        new Date(createdAt),
        new Date()
      )

      users.push({
        id: i + 1,
        name: `${firstName} ${lastName}`,
        email: this.randomEmail(firstName, lastName),
        age: this.randomInt(minAge, maxAge),
        status: statuses ? this.randomItem(statuses) : this.randomItem(this.statuses.user),
        role: roles ? this.randomItem(roles) : this.randomItem(this.statuses.role),
        createdAt,
        updatedAt,
      })
    }

    return users
  }

  public static generateProducts(count: number, options: {
    minPrice?: number
    maxPrice?: number
    categories?: string[]
    statuses?: typeof this.statuses.product
  } = {}): TestProduct[] {
    const products: TestProduct[] = []
    const { minPrice = 1, maxPrice = 1000, categories, statuses } = options

    for (let i = 0; i < count; i++) {
      const name = this.randomItem(this.productNames)
      const category = categories ? this.randomItem(categories) : this.randomItem(this.productCategories)
      const createdAt = this.randomDate(
        new Date(2020, 0, 1),
        new Date()
      )

      products.push({
        id: i + 1,
        name: `${name} ${this.randomInt(1, 100)}`,
        description: `High quality ${name.toLowerCase()} for everyday use`,
        price: parseFloat((Math.random() * (maxPrice - minPrice) + minPrice).toFixed(2)),
        category,
        stock: this.randomInt(0, 100),
        status: statuses ? this.randomItem(statuses) : this.randomItem(this.statuses.product),
        createdAt,
      })
    }

    return products
  }

  public static generateOrders(count: number, users: TestUser[], products: TestProduct[], options: {
    statuses?: typeof this.statuses.order
  } = {}): TestOrder[] {
    const orders: TestOrder[] = []
    const { statuses } = options

    for (let i = 0; i < count; i++) {
      const user = this.randomItem(users)
      const product = this.randomItem(products)
      const quantity = this.randomInt(1, 10)
      const createdAt = this.randomDate(
        new Date(2020, 0, 1),
        new Date()
      )
      const updatedAt = this.randomDate(
        new Date(createdAt),
        new Date()
      )

      orders.push({
        id: i + 1,
        userId: user.id,
        productId: product.id,
        quantity,
        total: parseFloat((product.price * quantity).toFixed(2)),
        status: statuses ? this.randomItem(statuses) : this.randomItem(this.statuses.order),
        createdAt,
        updatedAt,
      })
    }

    return orders
  }

  public static generateTasks(count: number, users: TestUser[], options: {
    priorities?: typeof this.statuses.priority
    statuses?: typeof this.statuses.task
  } = {}): TestTask[] {
    const tasks: TestTask[] = []
    const { priorities, statuses } = options

    for (let i = 0; i < count; i++) {
      const assignee = this.randomItem(users)
      const createdAt = this.randomDate(
        new Date(2020, 0, 1),
        new Date()
      )
      const dueDate = this.randomDate(
        new Date(createdAt),
        new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
      )
      const updatedAt = this.randomDate(
        new Date(createdAt),
        new Date()
      )

      tasks.push({
        id: i + 1,
        title: this.randomItem(this.taskTitles),
        description: `Task ${i + 1} description`,
        priority: priorities ? this.randomItem(priorities) : this.randomItem(this.statuses.priority),
        status: statuses ? this.randomItem(statuses) : this.randomItem(this.statuses.task),
        assigneeId: assignee.id,
        dueDate,
        createdAt,
        updatedAt,
      })
    }

    return tasks
  }

  public static generateCSV<T>(data: T[], filename: string): File {
    if (data.length === 0) {
      throw new Error("Cannot generate CSV from empty data")
    }

    const headers = Object.keys(data[0] as object).join(',')
    const rows = data.map(item =>
      Object.values(item as object).map(value =>
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    )

    const csvContent = [headers, ...rows].join('\n')
    return new File([csvContent], filename, { type: 'text/csv' })
  }

  public static generateJSON<T>(data: T[], filename: string): File {
    const jsonContent = JSON.stringify(data, null, 2)
    return new File([jsonContent], filename, { type: 'application/json' })
  }

  public static generateCompleteDataset(options: {
    users?: number
    products?: number
    orders?: number
    tasks?: number
  } = {}) {
    const {
      users = 100,
      products = 50,
      orders = 200,
      tasks = 150
    } = options

    const userData = this.generateUsers(users)
    const productData = this.generateProducts(products)
    const orderData = this.generateOrders(orders, userData, productData)
    const taskData = this.generateTasks(tasks, userData)

    return {
      users: userData,
      products: productData,
      orders: orderData,
      tasks: taskData,
    }
  }

  public static generateEdgeCaseUsers(): TestUser[] {
    return [
      {
        id: 1,
        name: "Min Age User",
        email: "min@example.com",
        age: 18,
        status: "active",
        role: "user",
        createdAt: "2020-01-01",
        updatedAt: "2020-01-01",
      },
      {
        id: 2,
        name: "Max Age User",
        email: "max@example.com",
        age: 80,
        status: "inactive",
        role: "admin",
        createdAt: "2020-01-01",
        updatedAt: "2020-01-01",
      },
      {
        id: 3,
        name: "Special Characters User",
        email: "special@example.com",
        age: 30,
        status: "pending",
        role: "guest",
        createdAt: "2020-01-01",
        updatedAt: "2020-01-01",
      },
      {
        id: 4,
        name: "A",
        email: "a@example.com",
        age: 25,
        status: "active",
        role: "user",
        createdAt: "2020-01-01",
        updatedAt: "2020-01-01",
      },
      {
        id: 5,
        name: "Very Long Name User With Many Characters That Exceeds Normal Length",
        email: "verylongname@example.com",
        age: 35,
        status: "active",
        role: "user",
        createdAt: "2020-01-01",
        updatedAt: "2020-01-01",
      },
    ]
  }

  public static generateEdgeCaseProducts(): TestProduct[] {
    return [
      {
        id: 1,
        name: "Free Product",
        description: "Product with zero price",
        price: 0,
        category: "Electronics",
        stock: 100,
        status: "available",
        createdAt: "2020-01-01",
      },
      {
        id: 2,
        name: "Expensive Product",
        description: "Product with high price",
        price: 9999.99,
        category: "Electronics",
        stock: 1,
        status: "available",
        createdAt: "2020-01-01",
      },
      {
        id: 3,
        name: "Out of Stock Product",
        description: "Product with zero stock",
        price: 99.99,
        category: "Clothing",
        stock: 0,
        status: "out_of_stock",
        createdAt: "2020-01-01",
      },
      {
        id: 4,
        name: "High Stock Product",
        description: "Product with high stock",
        price: 49.99,
        category: "Food",
        stock: 10000,
        status: "available",
        createdAt: "2020-01-01",
      },
    ]
  }
}
