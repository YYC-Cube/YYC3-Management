/**
 * @fileoverview 工作流引擎单元测试 — 启动、审批、拒绝、并发、可视化配置
 * @author YYC³ @version 3.1.0 @license MIT
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock db/client
const mockQuery = vi.fn()
const mockRelease = vi.fn()

vi.mock('@/lib/db/client', () => ({
  query: (...args: unknown[]) => mockQuery(...args),
  getClient: vi.fn().mockResolvedValue({
    query: mockQuery,
    release: mockRelease,
  }),
}))

import * as engine from '../workflow/engine'

// 构建模拟工作流实例
function makeInstance(overrides: Partial<engine.WorkflowInstance> = {}): engine.WorkflowInstance {
  return {
    id: 1,
    type: 'leave_request',
    status: 'pending',
    current_step: 'manager_review',
    title: '请假申请',
    description: '年假3天',
    submitted_by: 100,
    submitted_by_name: '张三',
    data: { days: 3, reason: '家庭旅行' },
    assigned_to: null,
    assigned_to_name: null,
    version: 1,
    created_at: '2026-07-01T00:00:00Z',
    updated_at: '2026-07-01T00:00:00Z',
    ...overrides,
  }
}

describe('Workflow Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // === 可视化配置 ===

  describe('WORKFLOW_VISUAL_CONFIG', () => {
    it('所有工作流类型都应有可视化配置', () => {
      const types: engine.WorkflowType[] = ['task_approval', 'leave_request', 'expense_report', 'procurement']
      for (const type of types) {
        expect(engine.WORKFLOW_VISUAL_CONFIG[type]).toBeDefined()
        expect(engine.WORKFLOW_VISUAL_CONFIG[type].name).toBeTruthy()
        expect(engine.WORKFLOW_VISUAL_CONFIG[type].steps.length).toBeGreaterThan(1)
      }
    })

    it('每个步骤应有 key、label、icon、role', () => {
      for (const config of Object.values(engine.WORKFLOW_VISUAL_CONFIG)) {
        for (const step of config.steps) {
          expect(step.key).toBeTruthy()
          expect(step.label).toBeTruthy()
          expect(step.icon).toBeTruthy()
          expect(step.role).toBeTruthy()
        }
      }
    })

    it('task_approval 应有3个步骤', () => {
      expect(engine.WORKFLOW_VISUAL_CONFIG.task_approval.steps).toHaveLength(3)
    })

    it('leave_request 应有4个步骤', () => {
      expect(engine.WORKFLOW_VISUAL_CONFIG.leave_request.steps).toHaveLength(4)
    })
  })

  // === 启动工作流 ===

  describe('startWorkflow', () => {
    it('应成功启动工作流', async () => {
      const instance = makeInstance()
      mockQuery.mockResolvedValueOnce({ rows: [instance], rowCount: 1 })

      const result = await engine.startWorkflow({
        type: 'leave_request',
        title: '请假申请',
        description: '年假3天',
        submittedBy: 100,
        submittedByName: '张三',
        data: { days: 3 },
      })

      expect(result.status).toBe('pending')
      expect(result.current_step).toBe('manager_review')
      expect(result.version).toBe(1)
    })

    it('task_approval 第一步应为 manager_review', async () => {
      const instance = makeInstance({ type: 'task_approval', current_step: 'manager_review' })
      mockQuery.mockResolvedValueOnce({ rows: [instance], rowCount: 1 })

      const result = await engine.startWorkflow({
        type: 'task_approval',
        title: '任务',
        description: '描述',
        submittedBy: 100,
        submittedByName: '张三',
        data: {},
      })

      expect(result.current_step).toBe('manager_review')
    })
  })

  // === 审批通过 ===

  describe('approveWorkflow', () => {
    it('中间步骤审批通过后应流转到下一步', async () => {
      const instance = makeInstance()
      const updated = makeInstance({ current_step: 'director_review', version: 2 })

      // SELECT FOR UPDATE
      mockQuery.mockResolvedValueOnce({ rows: [instance], rowCount: 1 })
      // BEGIN
      // INSERT workflow_logs
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 1 })
      // UPDATE
      mockQuery.mockResolvedValueOnce({ rows: [updated], rowCount: 1 })
      // COMMIT
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })

      const result = await engine.approveWorkflow(1, 200, '李四', '同意')

      expect(result.current_step).toBe('director_review')
      expect(result.version).toBe(2)
    })

    it('最终步骤审批通过后 status 应为 approved', async () => {
      const instance = makeInstance({ current_step: 'director_review' })
      const updated = makeInstance({ status: 'approved', current_step: 'complete', version: 2 })

      mockQuery.mockResolvedValueOnce({ rows: [instance], rowCount: 1 })
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 1 })
      mockQuery.mockResolvedValueOnce({ rows: [updated], rowCount: 1 })
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })

      const result = await engine.approveWorkflow(1, 300, '王五', '批准')

      expect(result.status).toBe('approved')
      expect(result.current_step).toBe('complete')
    })

    it('工作流不存在时应抛出错误', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })

      await expect(
        engine.approveWorkflow(999, 200, '李四')
      ).rejects.toThrow('工作流实例不存在')
    })

    it('已审批的工作流不能重复审批', async () => {
      const instance = makeInstance({ status: 'approved' })
      mockQuery.mockResolvedValueOnce({ rows: [instance], rowCount: 1 })
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })

      await expect(
        engine.approveWorkflow(1, 200, '李四')
      ).rejects.toThrow('无法审批')
    })

    it('乐观锁冲突时应抛出错误', async () => {
      const instance = makeInstance()
      // SELECT FOR UPDATE 成功
      mockQuery.mockResolvedValueOnce({ rows: [instance], rowCount: 1 })
      // INSERT log
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 1 })
      // UPDATE 失败（version 不匹配）
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })
      // ROLLBACK
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })

      await expect(
        engine.approveWorkflow(1, 200, '李四')
      ).rejects.toThrow('冲突')
    })
  })

  // === 审批拒绝 ===

  describe('rejectWorkflow', () => {
    it('应成功拒绝工作流', async () => {
      const instance = makeInstance()
      const updated = makeInstance({ status: 'rejected', version: 2 })

      mockQuery.mockResolvedValueOnce({ rows: [instance], rowCount: 1 })
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 1 })
      mockQuery.mockResolvedValueOnce({ rows: [updated], rowCount: 1 })
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })

      const result = await engine.rejectWorkflow(1, 200, '李四', '不符合规定')

      expect(result.status).toBe('rejected')
      expect(result.version).toBe(2)
    })
  })

  // === 工作流列表 ===

  describe('getWorkflowList', () => {
    it('应返回分页列表', async () => {
      const instances = [makeInstance(), makeInstance({ id: 2 })]
      mockQuery.mockResolvedValueOnce({ rows: [{ total: '2' }], rowCount: 1 })
      mockQuery.mockResolvedValueOnce({ rows: instances, rowCount: 2 })

      const result = await engine.getWorkflowList({ page: 1, limit: 10 })

      expect(result.total).toBe(2)
      expect(result.data).toHaveLength(2)
    })

    it('应按状态过滤', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ total: '0' }], rowCount: 1 })
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })

      const result = await engine.getWorkflowList({ status: 'approved' })

      expect(result.total).toBe(0)
      expect(result.data).toEqual([])
    })

    it('应按类型过滤', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ total: '1' }], rowCount: 1 })
      mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })

      const result = await engine.getWorkflowList({ type: 'expense_report' })

      expect(result.total).toBe(1)
    })
  })
})
