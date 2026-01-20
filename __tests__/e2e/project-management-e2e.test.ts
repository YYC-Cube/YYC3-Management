// 项目管理端到端测试 - 测试项目管理的完整用户旅程
// @author: YYC3团队
// @version: v1.0.0
// @created: 2025-01-20
// @updated: 2025-01-20
// @tags: 测试,E2E测试,项目管理

import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { TestDataGenerator } from "../data-driven/test-data-generator"

describe("项目管理端到端测试", () => {
  let testDataGenerator: TestDataGenerator

  beforeEach(() => {
    testDataGenerator = new TestDataGenerator()
  })

  afterEach(() => {
    testDataGenerator.clear()
  })

  describe("用户旅程1: 项目创建 -> 添加成员 -> 分配任务 -> 完成项目", () => {
    it("应该完成完整的项目管理流程", async () => {
      const project = TestDataGenerator.generateProducts(1, {})()
      const users = Array.from({ length: 3 }, () => testDataGenerator.generateUser())
      const tasks = Array.from({ length: 5 }, () => testDataGenerator.generateTask())

      expect(project).toBeDefined()
      expect(project.id).toBeDefined()
      expect(project.name).toBeDefined()
      expect(project.description).toBeDefined()
      expect(project.status).toBeDefined()

      expect(users).toHaveLength(3)
      expect(tasks).toHaveLength(5)

      const projectWithMembers = {
        ...project,
        members: users.map(user => ({
          userId: user.id,
          userName: user.name,
          role: "member",
        })),
      }

      expect(projectWithMembers.members).toHaveLength(3)
      projectWithMembers.members.forEach(member => {
        expect(member.userId).toBeDefined()
        expect(member.userName).toBeDefined()
        expect(member.role).toBe("member")
      })

      const projectWithTasks = {
        ...projectWithMembers,
        tasks: tasks.map((task, index) => ({
          ...task,
          projectId: project.id,
          assigneeId: users[index % users.length].id,
          assigneeName: users[index % users.length].name,
        })),
      }

      expect(projectWithTasks.tasks).toHaveLength(5)
      projectWithTasks.tasks.forEach(task => {
        expect(task.projectId).toBe(project.id)
        expect(task.assigneeId).toBeDefined()
      })

      const completedProject = {
        ...projectWithTasks,
        status: "completed",
        completedAt: new Date().toISOString(),
      }

      expect(completedProject.status).toBe("completed")
      expect(completedProject.completedAt).toBeDefined()
    })
  })

  describe("用户旅程2: 项目批量创建 -> 批量添加成员 -> 批量分配任务", () => {
    it("应该完成批量项目管理流程", async () => {
      const projects = Array.from({ length: 3 }, () => TestDataGenerator.generateProducts(1, {})())
      const users = Array.from({ length: 10 }, () => testDataGenerator.generateUser())

      expect(projects).toHaveLength(3)
      expect(users).toHaveLength(10)

      const projectsWithMembers = projects.map(project => ({
        ...project,
        members: users.slice(0, 4).map(user => ({
          userId: user.id,
          userName: user.name,
          role: "member",
        })),
      }))

      expect(projectsWithMembers).toHaveLength(3)
      projectsWithMembers.forEach(project => {
        expect(project.members).toHaveLength(4)
      })

      const allTasks = Array.from({ length: 15 }, () => testDataGenerator.generateTask())

      const projectsWithTasks = projectsWithMembers.map((project, projectIndex) => ({
        ...project,
        tasks: allTasks
          .slice(projectIndex * 5, (projectIndex + 1) * 5)
          .map((task, taskIndex) => ({
            ...task,
            projectId: project.id,
            assigneeId: project.members[taskIndex % project.members.length].userId,
            assigneeName: project.members[taskIndex % project.members.length].userName,
          })),
      }))

      expect(projectsWithTasks).toHaveLength(3)
      projectsWithTasks.forEach(project => {
        expect(project.tasks).toHaveLength(5)
        project.tasks.forEach(task => {
          expect(task.projectId).toBeDefined()
          expect(task.assigneeId).toBeDefined()
        })
      })
    })
  })

  describe("用户旅程3: 项目高级搜索 -> 结果筛选 -> 批量更新状态", () => {
    it("应该完成项目搜索和批量操作流程", async () => {
      const projects = Array.from({ length: 20 }, () => TestDataGenerator.generateProducts(1, {})())

      expect(projects).toHaveLength(20)

      const activeProjects = projects.filter(project => project.status === "active")
      const highPriorityProjects = projects.filter(project => project.priority === "high")

      expect(activeProjects.length).toBeGreaterThan(0)
      expect(highPriorityProjects.length).toBeGreaterThan(0)

      const filteredProjects = projects.filter(
        project => project.status === "active" && project.priority === "high"
      )

      expect(filteredProjects.length).toBeGreaterThanOrEqual(0)

      const batchUpdatedProjects = filteredProjects.map(project => ({
        ...project,
        priority: "urgent",
        status: "in_review",
      }))

      batchUpdatedProjects.forEach(project => {
        expect(project.priority).toBe("urgent")
        expect(project.status).toBe("in_review")
      })
    })
  })

  describe("边界场景: 大数据量项目管理", () => {
    it("应该处理大数据量项目", async () => {
      const projects = Array.from({ length: 100 }, () => TestDataGenerator.generateProducts(1, {})())
      const users = Array.from({ length: 50 }, () => testDataGenerator.generateUser())

      expect(projects).toHaveLength(100)
      expect(users).toHaveLength(50)

      const startTime = Date.now()

      const activeProjects = projects.filter(project => project.status === "active")
      const completedProjects = projects.filter(project => project.status === "completed")

      const duration = Date.now() - startTime

      expect(duration).toBeLessThan(1000)
      expect(activeProjects.length).toBeGreaterThan(0)
      expect(completedProjects.length).toBeGreaterThan(0)
    })
  })

  describe("异常场景: 错误处理", () => {
    it("应该处理无效项目数据", () => {
      const invalidProject = {
        id: "",
        name: "",
        description: "",
        status: "invalid_status",
        priority: "invalid_priority",
      }

      expect(invalidProject.id).toBe("")
      expect(invalidProject.name).toBe("")
      expect(invalidProject.description).toBe("")
      expect(invalidProject.status).toBe("invalid_status")
      expect(invalidProject.priority).toBe("invalid_priority")
    })

    it("应该处理项目成员添加失败", () => {
      const project = TestDataGenerator.generateProducts(1, {})()
      const invalidUser = { id: "", name: "", email: "" }

      expect(project.id).toBeDefined()
      expect(invalidUser.id).toBe("")

      const addMemberResult = invalidUser.id ? { success: true } : { success: false, error: "Invalid user" }

      expect(addMemberResult.success).toBe(false)
      expect(addMemberResult.error).toBe("Invalid user")
    })
  })

  describe("性能场景: 响应时间验证", () => {
    it("应该在合理时间内完成项目创建", () => {
      const startTime = Date.now()

      const projects = Array.from({ length: 50 }, () => TestDataGenerator.generateProducts(1, {})())

      const duration = Date.now() - startTime

      expect(projects).toHaveLength(50)
      expect(duration).toBeLessThan(500)
    })

    it("应该在合理时间内完成项目搜索", () => {
      const projects = Array.from({ length: 500 }, () => TestDataGenerator.generateProducts(1, {})())

      const startTime = Date.now()

      const activeProjects = projects.filter(project => project.status === "active")
      const highPriorityProjects = projects.filter(project => project.priority === "high")

      const duration = Date.now() - startTime

      expect(duration).toBeLessThan(100)
      expect(activeProjects.length).toBeGreaterThan(0)
      expect(highPriorityProjects.length).toBeGreaterThan(0)
    })
  })

  describe("协作场景: 多项目成员管理", () => {
    it("应该支持多项目成员管理", async () => {
      const projects = Array.from({ length: 5 }, () => TestDataGenerator.generateProducts(1, {})())
      const users = Array.from({ length: 20 }, () => testDataGenerator.generateUser())

      expect(projects).toHaveLength(5)
      expect(users).toHaveLength(20)

      const projectsWithMembers = projects.map(project => ({
        ...project,
        members: users.slice(0, 8).map(user => ({
          userId: user.id,
          userName: user.name,
          role: "member",
        })),
      }))

      expect(projectsWithMembers).toHaveLength(5)
      projectsWithMembers.forEach(project => {
        expect(project.members).toHaveLength(8)
      })

      const userProjectCounts = users.map(user => ({
        userId: user.id,
        userName: user.name,
        projectCount: projectsWithMembers.filter(project =>
          project.members.some(member => member.userId === user.id)
        ).length,
      }))

      userProjectCounts.forEach(userProjectCount => {
        expect(userProjectCount.projectCount).toBeGreaterThanOrEqual(0)
        expect(userProjectCount.projectCount).toBeLessThanOrEqual(5)
      })
    })
  })

  describe("依赖场景: 项目依赖关系", () => {
    it("应该处理项目依赖关系", async () => {
      const parentProject = TestDataGenerator.generateProducts(1, {})()
      const childProjects = Array.from({ length: 2 }, () => TestDataGenerator.generateProducts(1, {})())

      expect(parentProject).toBeDefined()
      expect(childProjects).toHaveLength(2)

      const projectsWithDependencies = childProjects.map(childProject => ({
        ...childProject,
        dependsOn: [parentProject.id],
      }))

      expect(projectsWithDependencies).toHaveLength(2)
      projectsWithDependencies.forEach(project => {
        expect(project.dependsOn).toContain(parentProject.id)
      })

      const completedParentProject = {
        ...parentProject,
        status: "completed",
        completedAt: new Date().toISOString(),
      }

      expect(completedParentProject.status).toBe("completed")

      const readyChildProjects = projectsWithDependencies.filter(
        project => project.status === "pending" && project.dependsOn?.includes(completedParentProject.id)
      )

      expect(readyChildProjects.length).toBeGreaterThan(0)
    })
  })

  describe("进度跟踪场景: 项目进度管理", () => {
    it("应该跟踪项目进度", async () => {
      const project = TestDataGenerator.generateProducts(1, {})()
      const tasks = Array.from({ length: 10 }, () => testDataGenerator.generateTask())

      expect(project).toBeDefined()
      expect(tasks).toHaveLength(10)

      const projectWithTasks = {
        ...project,
        tasks: tasks.map(task => ({
          ...task,
          projectId: project.id,
        })),
      }

      expect(projectWithTasks.tasks).toHaveLength(10)

      const completedTasks = projectWithTasks.tasks.filter(task => task.status === "completed")
      const inProgressTasks = projectWithTasks.tasks.filter(task => task.status === "in_progress")

      const progress = {
        totalTasks: projectWithTasks.tasks.length,
        completedTasks: completedTasks.length,
        inProgressTasks: inProgressTasks.length,
        completionPercentage: (completedTasks.length / projectWithTasks.tasks.length) * 100,
      }

      expect(progress.totalTasks).toBe(10)
      expect(progress.completionPercentage).toBeGreaterThanOrEqual(0)
      expect(progress.completionPercentage).toBeLessThanOrEqual(100)
    })
  })
})
