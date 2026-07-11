import { query } from '@/lib/db/client'

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
  created_at: string
  updated_at: string
}

const WORKFLOW_STEPS: Record<WorkflowType, WorkflowStep[]> = {
  task_approval: ['submit', 'manager_review', 'complete'],
  leave_request: ['submit', 'manager_review', 'director_review', 'complete'],
  expense_report: ['submit', 'manager_review', 'director_review', 'complete'],
  procurement: ['submit', 'manager_review', 'director_review', 'complete'],
}

const STEP_ASSIGNEE_ROLE: Record<WorkflowStep, string> = {
  submit: 'user',
  manager_review: 'manager',
  director_review: 'admin',
  complete: 'admin',
}

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
    `INSERT INTO workflow_instances (type, status, current_step, title, description, submitted_by, submitted_by_name, data, created_at, updated_at)
     VALUES ($1, 'pending', $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
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

export async function approveWorkflow(
  instanceId: number,
  approverId: number,
  approverName: string,
  comment?: string
): Promise<WorkflowInstance> {
  const current = await query('SELECT * FROM workflow_instances WHERE id = $1', [instanceId])
  if (current.length === 0) throw new Error('工作流实例不存在')

  const instance = current[0] as WorkflowInstance
  if (instance.status !== 'pending') throw new Error(`工作流状态为 ${instance.status}，无法审批`)

  const steps = WORKFLOW_STEPS[instance.type]
  const currentStepIndex = steps.indexOf(instance.current_step)
  const nextStep = steps[currentStepIndex + 1]

  await query(
    `INSERT INTO workflow_logs (instance_id, action, user_id, user_name, comment, created_at)
     VALUES ($1, 'approved', $2, $3, $4, CURRENT_TIMESTAMP)`,
    [instanceId, approverId, approverName, comment ?? null]
  )

  if (!nextStep || nextStep === 'complete') {
    const result = await query(
      `UPDATE workflow_instances
       SET status = 'approved', current_step = 'complete', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [instanceId]
    )
    return result[0] as WorkflowInstance
  }

  const result = await query(
    `UPDATE workflow_instances
     SET current_step = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 RETURNING *`,
    [nextStep, instanceId]
  )
  return result[0] as WorkflowInstance
}

export async function rejectWorkflow(
  instanceId: number,
  rejecterId: number,
  rejecterName: string,
  reason: string
): Promise<WorkflowInstance> {
  await query(
    `INSERT INTO workflow_logs (instance_id, action, user_id, user_name, comment, created_at)
     VALUES ($1, 'rejected', $2, $3, $4, CURRENT_TIMESTAMP)`,
    [instanceId, rejecterId, rejecterName, reason]
  )

  const result = await query(
    `UPDATE workflow_instances
     SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 RETURNING *`,
    [instanceId]
  )
  return result[0] as WorkflowInstance
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
