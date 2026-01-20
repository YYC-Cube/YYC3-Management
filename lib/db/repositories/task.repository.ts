import { query } from '../client'
import type {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskSearchParams,
  TaskListResponse,
} from '../models/task'

export class TaskRepository {
  async findAll(params: TaskSearchParams = {}): Promise<TaskListResponse> {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      priority = '',
      assignee_id,
      created_by,
    } = params

    const offset = (page - 1) * limit

    let whereClauses: string[] = []
    let queryParams: any[] = []
    let paramIndex = 1

    if (search) {
      whereClauses.push(`(
        title ILIKE $${paramIndex} OR
        description ILIKE $${paramIndex}
      )`)
      queryParams.push(`%${search}%`)
      paramIndex++
    }

    if (status) {
      whereClauses.push(`status = $${paramIndex}`)
      queryParams.push(status)
      paramIndex++
    }

    if (priority) {
      whereClauses.push(`priority = $${paramIndex}`)
      queryParams.push(priority)
      paramIndex++
    }

    if (assignee_id) {
      whereClauses.push(`assignee_id = $${paramIndex}`)
      queryParams.push(assignee_id)
      paramIndex++
    }

    if (created_by) {
      whereClauses.push(`created_by = $${paramIndex}`)
      queryParams.push(created_by)
      paramIndex++
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const countQuery = `
      SELECT COUNT(*) as total
      FROM tasks
      ${whereClause}
    `

    const dataQuery = `
      SELECT * FROM tasks
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    queryParams.push(limit, offset)

    const [countResult, dataResult] = await Promise.all([
      query(countQuery, queryParams.slice(0, paramIndex - 1)),
      query(dataQuery, queryParams),
    ])

    const total = parseInt(countResult[0].total)
    const totalPages = Math.ceil(total / limit)

    return {
      data: dataResult as Task[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }

  async findById(id: number): Promise<Task | null> {
    const result = await query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    )
    return result[0] as Task || null
  }

  async create(data: CreateTaskData): Promise<Task> {
    const result = await query(
      `INSERT INTO tasks (
        title, description, assignee_id, priority, status, progress, due_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        data.title,
        data.description,
        data.assignee_id,
        data.priority || '中',
        data.status || '待处理',
        data.progress || 0,
        data.due_date,
      ]
    )
    return result[0] as Task
  }

  async update(id: number, data: UpdateTaskData): Promise<Task | null> {
    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    })

    if (updates.length === 0) {
      return this.findById(id)
    }

    values.push(id)

    const result = await query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )

    return result[0] as Task || null
  }

  async delete(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM tasks WHERE id = $1 RETURNING id',
      [id]
    )
    return result.length > 0
  }

  async updateStatus(id: number, status: string, progress?: number): Promise<Task | null> {
    const updates: string[] = ['status = $1']
    const values: any[] = [status]
    let paramIndex = 2

    if (progress !== undefined) {
      updates.push(`progress = $${paramIndex}`)
      values.push(progress)
      paramIndex++
    }

    if (status === '已完成') {
      updates.push(`completed_at = CURRENT_TIMESTAMP`)
    }

    values.push(id)

    const result = await query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )

    return result[0] as Task || null
  }

  async getStats(): Promise<{
    total: number
    completed: number
    inProgress: number
    overdue: number
  }> {
    const result = await query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = '已完成') as completed,
        COUNT(*) FILTER (WHERE status = '进行中') as in_progress,
        COUNT(*) FILTER (WHERE status = '逾期' OR (due_date < CURRENT_DATE AND status != '已完成')) as overdue
      FROM tasks
    `)

    return {
      total: parseInt(result[0].total),
      completed: parseInt(result[0].completed),
      inProgress: parseInt(result[0].in_progress),
      overdue: parseInt(result[0].overdue),
    }
  }
}
