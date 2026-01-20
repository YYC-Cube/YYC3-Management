import { query } from '../client'
import type {
  Project,
  CreateProjectData,
  UpdateProjectData,
  ProjectSearchParams,
  ProjectListResponse,
} from '../models/project'

export class ProjectRepository {
  async findAll(params: ProjectSearchParams = {}): Promise<ProjectListResponse> {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      priority = '',
      manager_id,
      type,
    } = params

    const offset = (page - 1) * limit

    let whereClauses: string[] = []
    let queryParams: any[] = []
    let paramIndex = 1

    if (search) {
      whereClauses.push(`(
        name ILIKE $${paramIndex} OR
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

    if (manager_id) {
      whereClauses.push(`manager_id = $${paramIndex}`)
      queryParams.push(manager_id)
      paramIndex++
    }

    if (type) {
      whereClauses.push(`type = $${paramIndex}`)
      queryParams.push(type)
      paramIndex++
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const countQuery = `
      SELECT COUNT(*) as total
      FROM projects
      ${whereClause}
    `

    const dataQuery = `
      SELECT * FROM projects
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
      data: dataResult as Project[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }

  async findById(id: number): Promise<Project | null> {
    const result = await query(
      'SELECT * FROM projects WHERE id = $1',
      [id]
    )
    return result[0] as Project || null
  }

  async create(data: CreateProjectData): Promise<Project> {
    const result = await query(
      `INSERT INTO projects (
        name, description, manager_id, team_size, progress,
        status, priority, start_date, end_date, budget, type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        data.name,
        data.description,
        data.manager_id,
        data.team_size || 0,
        data.progress || 0,
        data.status || '进行中',
        data.priority || '中',
        data.start_date,
        data.end_date,
        data.budget,
        data.type,
      ]
    )
    return result[0] as Project
  }

  async update(id: number, data: UpdateProjectData): Promise<Project | null> {
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
      `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )

    return result[0] as Project || null
  }

  async delete(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM projects WHERE id = $1 RETURNING id',
      [id]
    )
    return result.length > 0
  }

  async getStats(): Promise<{
    total: number
    completed: number
    inProgress: number
    delayed: number
  }> {
    const result = await query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = '已完成') as completed,
        COUNT(*) FILTER (WHERE status = '进行中') as in_progress,
        COUNT(*) FILTER (WHERE status = '延期' OR (end_date < CURRENT_DATE AND status != '已完成')) as delayed
      FROM projects
    `)

    return {
      total: parseInt(result[0].total),
      completed: parseInt(result[0].completed),
      inProgress: parseInt(result[0].in_progress),
      delayed: parseInt(result[0].delayed),
    }
  }
}
