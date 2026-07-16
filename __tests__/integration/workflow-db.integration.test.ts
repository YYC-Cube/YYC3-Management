/**
 * @fileoverview 工作流 + 数据库集成测试 — 事务、行锁、乐观锁全链路
 * @author YYC³ @version 3.1.0 @license MIT
 */
/// <reference types="node" />

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock db/client — 模拟事务客户端
const mockClientQuery = vi.fn()
const mockClientRelease = vi.fn()
const mockPoolQuery = vi.fn()

vi.mock('../../lib/db/client', () => ({
  query: (...args: unknown[]) => mockPoolQuery(...args),
  getClient: vi.fn().mockResolvedValue({
    query: mockClientQuery,
    release: mockClientRelease,
  }),
}))

import * as engine from '../../lib/workflow/engine'

describe('Workflow + DB Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // === 完整审批流程：提交 → 主管审批 → 总监审批 → 完成 ===

  it('完整审批流程：leave_request 三步审批', async () => {
    // Step 1: 启动工作流
    mockPoolQuery.mockResolvedValueOnce({
      rows: [{
        id: 1, type: 'leave_request', status: 'pending', current_step: 'manager_review',
        version: 1, title: '年假', description: '3天', submitted_by: 100,
        submitted_by_name: '张三', data: {}, assigned_to: null, assigned_to_name: null,
        created_at: '2026-07-01', updated_at: '2026-07-01',
      }],
      rowCount: 1,
    })

    const instance = await engine.startWorkflow({
      type: 'leave_request',
      title: '年假',
      description: '3天',
      submittedBy: 100,
      submittedByName: '张三',
      data: {},
    })
    expect(instance.current_step).toBe('manager_review')

    // Step 2: 主管审批通过
    mockClientQuery
      .mockResolvedValueOnce({ rows: [instance], rowCount: 1 }) // SELECT FOR UPDATE
      .mockResolvedValueOnce({ rows: [], rowCount: 1 }) // INSERT log
      .mockResolvedValueOnce({ rows: [{ ...instance, current_step: 'director_review', version: 2 }], rowCount: 1 }) // UPDATE
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // COMMIT

    const afterManager = await engine.approveWorkflow(1, 200, '李经理', '同意')
    expect(afterManager.current_step).toBe('director_review')
    expect(afterManager.version).toBe(2)

    // Step 3: 总监审批通过（最终步骤）
    mockClientQuery
      .mockResolvedValueOnce({ rows: [afterManager], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [{ ...afterManager, status: 'approved', current_step: 'complete', version: 3 }], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })

    const afterDirector = await engine.approveWorkflow(1, 300, '王总监', '批准')
    expect(afterDirector.status).toBe('approved')
    expect(afterDirector.current_step).toBe('complete')
    expect(afterDirector.version).toBe(3)
  })

  // === 并发冲突场景 ===

  it('乐观锁冲突：version 不匹配时应回滚', async () => {
    const instance = {
      id: 1, type: 'task_approval', status: 'pending', current_step: 'manager_review',
      version: 1, title: '任务', description: '', submitted_by: 100,
      submitted_by_name: '张三', data: {}, assigned_to: null, assigned_to_name: null,
      created_at: '2026-07-01', updated_at: '2026-07-01',
    }

    mockClientQuery
      .mockResolvedValueOnce({ rows: [instance], rowCount: 1 }) // SELECT FOR UPDATE
      .mockResolvedValueOnce({ rows: [], rowCount: 1 }) // INSERT log
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // UPDATE 失败（version 不匹配）
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // ROLLBACK

    await expect(
      engine.approveWorkflow(1, 200, '李经理', '同意')
    ).rejects.toThrow('冲突')

    // 确保事务被回滚
    const rollbackCall = mockClientQuery.mock.calls.find(
      (call) => call[0] === 'ROLLBACK'
    )
    expect(rollbackCall).toBeDefined()
  })

  // === 拒绝流程 ===

  it('拒绝工作流应正确更新状态', async () => {
    const instance = {
      id: 1, type: 'expense_report', status: 'pending', current_step: 'manager_review',
      version: 1, title: '报销', description: '', submitted_by: 100,
      submitted_by_name: '张三', data: {}, assigned_to: null, assigned_to_name: null,
      created_at: '2026-07-01', updated_at: '2026-07-01',
    }

    mockClientQuery
      .mockResolvedValueOnce({ rows: [instance], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [{ ...instance, status: 'rejected', version: 2 }], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })

    const result = await engine.rejectWorkflow(1, 200, '李经理', '金额不符')
    expect(result.status).toBe('rejected')
    expect(result.version).toBe(2)
  })

  // === 事务回滚验证 ===

  it('审批过程中出错时应回滚事务', async () => {
    const instance = {
      id: 1, type: 'task_approval', status: 'pending', current_step: 'manager_review',
      version: 1, title: '任务', description: '', submitted_by: 100,
      submitted_by_name: '张三', data: {}, assigned_to: null, assigned_to_name: null,
      created_at: '2026-07-01', updated_at: '2026-07-01',
    }

    // SELECT FOR UPDATE 成功，但 INSERT log 失败
    mockClientQuery
      .mockResolvedValueOnce({ rows: [instance], rowCount: 1 })
      .mockRejectedValueOnce(new Error('INSERT failed: deadlock detected'))
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // ROLLBACK

    await expect(
      engine.approveWorkflow(1, 200, '李经理')
    ).rejects.toThrow('deadlock')

    expect(mockClientRelease).toHaveBeenCalled()
  })
})