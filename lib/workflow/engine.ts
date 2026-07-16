/**
 * @fileoverview 工作流引擎 — 审批流转核心逻辑
 * @description 支持多步骤审批流程，使用行锁 + 乐观锁防止并发冲突
 * @author YYC³
 * @version 3.1.0
 * @created 2025-12-08
 * @modified 2026-07-17
 * @updated 2026-07-17
 * @copyright Copyright (c) 2025-2026 YYC³
 * @license MIT
 */

import { getClient, query } from '@/lib/db/client'

export type WorkflowType = 'task_approval' | 'leave_request' | 'expense_report' | 'procurement'
export type WorkflowStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'
export type WorkflowStep = 'submit' | 'manager_review' | 'director_review' | 'complete'

export interface WorkflowInstance {
  id: number
  type: WorkflowType
  status: WorkflowStatus
  current_step: WorkflowStep
  title: string
  description: string
  submitted_by: number
  submitted_by_name: string
  data: Record<string, unknown>
  assigned_to: number | null
  assigned_to_name: string | null
  version: number
  created_at: string
  updated_at: string
}

// ---- 工作流可视化步骤定义 ----

const WORKFLOW_STEPS: Record<WorkflowType, WorkflowStep[]> = {
  task_approval: ['submit', 'manager_review', 'complete'],
  leave_request: ['submit', 'manager_review', 'director_review', 'complete'],
  expense_report: ['submit', 'manager_review', 'director_review', 'complete'],
  procurement: ['submit', 'manager_review', 'director_review', 'complete'],
}

/** 工作流步骤可视化配置（用于 UI 流程图渲染） */
export const WORKFLOW_VISUAL_CONFIG: Record<WorkflowType, {
  name: string
  steps: Array<{ key: WorkflowStep; label: string; icon: string; role: string }>
}> = {
  task_approval: {
    name: '任务审批',
    steps: [
      { key: 'submit', label: '提交申请', icon: 'FileText', role: 'user' },
      { key: 'manager_review', label: '主管审批', icon: 'UserCheck', role: 'manager' },
      { key: 'complete', label: '完成', icon: 'CheckCircle', role: 'admin' },
    ],
  },
  leave_request: {
    name: '请假申请',
    steps: [
      { key: 'submit', label: '提交申请', icon: 'FileText', role: 'user' },
      { key: 'manager_review', label: '主管审批', icon: 'UserCheck', role: 'manager' },
      { key: 'director_review', label: '总监审批', icon: 'Shield', role: 'admin' },
      { key: 'complete', label: '完成', icon: 'CheckCircle', role: 'admin' },
    ],
  },
  expense_report: {
    name: '费用报销',
    steps: [
      { key: 'submit', label: '提交报销', icon: 'Receipt', role: 'user' },
      { key: 'manager_review', label: '主管审批', icon: 'UserCheck', role: 'manager' },
      { key: 'director_review', label: '财务审批', icon: 'DollarSign', role: 'admin' },
      { key: 'complete', label: '完成', icon: 'CheckCircle', role: 'admin' },
    ],
  },
  procurement: {
    name: '采购申请',
    steps: [
      { key: 'submit', label: '提交采购', icon: 'ShoppingCart', role: 'user' },
      { key: 'manager_review', label: '主管审批', icon: 'UserCheck', role: 'manager' },
      { key: 'director_review', label: '总监审批', icon: 'Shield', role: 'admin' },
      { key: 'complete', label: '完成', icon: 'CheckCircle', role: 'admin' },
    ],
  },
}

export const STEP_ASSIGNEE_ROLE: Record<WorkflowStep, string> = {
  submit: 'user',
  manager_review: 'manager',
  director_review: 'admin',
  complete: 'admin',
}

// ---- 启动工作流 ----

export async function startWorkflow(params: {
  type: WorkflowType
  title: string
  description: string
  submittedBy: number
  submittedByName: string
  data: Record<string, unknown>
}): Promise<WorkflowInstance> {
  const steps = WORKFLOW_STEPS[params.type]
  const firstStep = steps[1] || 'complete'

  const result = await query(
    `INSERT INTO workflow_instances
       (type, status, current_step, title, description, submitted_by, submitted_by_name, data, version, created_at, updated_at)
     VALUES ($1, 'pending', $2, $3, $4, $5, $6, $7, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING *`,
    [
      params.type,
      firstStep,
      params.title,
      params.description,
      params.submittedBy,
      params.submittedByName,
      JSON.stringify(params.data),
    ]
  )

  return result[0] as WorkflowInstance
}

// ---- 审批通过（事务 + 行锁 + 乐观锁） ----

export async function approveWorkflow(
  instanceId: number,
  approverId: number,
  approverName: string,
  comment?: string
): Promise<WorkflowInstance> {
  const client = await getClient()

  try {
    await client.query('BEGIN')

    // 使用 SELECT ... FOR UPDATE 行锁防止并发审批
    const current = await client.query(
      'SELECT * FROM workflow_instances WHERE id = $1 FOR UPDATE',
      [instanceId]
    )

    if (current.rows.length === 0) {
      await client.query('ROLLBACK')
      throw new Error('工作流实例不存在')
    }

    const instance = current.rows[0] as WorkflowInstance

    if (instance.status !== 'pending') {
      await client.query('ROLLBACK')
      throw new Error(`工作流状态为 ${instance.status}，无法审批`)
    }

    const steps = WORKFLOW_STEPS[instance.type]
    const currentStepIndex = steps.indexOf(instance.current_step)
    const nextStep = steps[currentStepIndex + 1]

    // 记录审批日志
    await client.query(
      `INSERT INTO workflow_logs (instance_id, action, user_id, user_name, comment, created_at)
       VALUES ($1, 'approved', $2, $3, $4, CURRENT_TIMESTAMP)`,
      [instanceId, approverId, approverName, comment ?? null]
    )

    let result
    if (!nextStep || nextStep === 'complete') {
      // 最终审批通过
      result = await client.query(
        `UPDATE workflow_instances
         SET status = 'approved', current_step = 'complete', version = version + 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND version = $2
         RETURNING *`,
        [instanceId, instance.version]
      )
    } else {
      // 流转到下一步
      result = await client.query(
        `UPDATE workflow_instances
         SET current_step = $1, version = version + 1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND version = $3
         RETURNING *`,
        [nextStep, instanceId, instance.version]
      )
    }

    if (result.rows.length === 0) {
      await client.query('ROLLBACK')
      throw new Error('审批冲突：工作流已被其他操作修改，请刷新后重试')
    }

    await client.query('COMMIT')
    return result.rows[0] as WorkflowInstance
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// ---- 审批拒绝（事务 + 行锁 + 乐观锁） ----

export async function rejectWorkflow(
  instanceId: number,
  rejecterId: number,
  rejecterName: string,
  reason: string
): Promise<WorkflowInstance> {
  const client = await getClient()

  try {
    await client.query('BEGIN')

    // 行锁读取
    const current = await client.query(
      'SELECT * FROM workflow_instances WHERE id = $1 FOR UPDATE',
      [instanceId]
    )

    if (current.rows.length === 0) {
      await client.query('ROLLBACK')
      throw new Error('工作流实例不存在')
    }

    const instance = current.rows[0] as WorkflowInstance

    if (instance.status !== 'pending') {
      await client.query('ROLLBACK')
      throw new Error(`工作流状态为 ${instance.status}，无法拒绝`)
    }

    // 记录拒绝日志
    await client.query(
      `INSERT INTO workflow_logs (instance_id, action, user_id, user_name, comment, created_at)
       VALUES ($1, 'rejected', $2, $3, $4, CURRENT_TIMESTAMP)`,
      [instanceId, rejecterId, rejecterName, reason]
    )

    const result = await client.query(
      `UPDATE workflow_instances
       SET status = 'rejected', version = version + 1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND version = $2
       RETURNING *`,
      [instanceId, instance.version]
    )

    if (result.rows.length === 0) {
      await client.query('ROLLBACK')
      throw new Error('拒绝冲突：工作流已被其他操作修改，请刷新后重试')
    }

    await client.query('COMMIT')
    return result.rows[0] as WorkflowInstance
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function getWorkflowList(params: {
  status?: string
  type?: string
  submittedBy?: number
  page?: number
  limit?: number
}): Promise<{ data: WorkflowInstance[]; total: number }> {
  const { status, type, submittedBy, page = 1, limit = 20 } = params
  const offset = (page - 1) * limit

  let whereClauses: string[] = []
  let queryParams: unknown[] = []
  let paramIndex = 1

  if (status) {
    whereClauses.push(`status = $${paramIndex++}`)
    queryParams.push(status)
  }
  if (type) {
    whereClauses.push(`type = $${paramIndex++}`)
    queryParams.push(type)
  }
  if (submittedBy) {
    whereClauses.push(`submitted_by = $${paramIndex++}`)
    queryParams.push(submittedBy)
  }

  const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

  const [countResult, dataResult] = await Promise.all([
    query(`SELECT COUNT(*) as total FROM workflow_instances ${whereClause}`, queryParams),
    query(
      `SELECT * FROM workflow_instances ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...queryParams, limit, offset]
    ),
  ])

  return {
    data: dataResult as WorkflowInstance[],
    total: parseInt(countResult[0]?.total ?? '0'),
  }
}
