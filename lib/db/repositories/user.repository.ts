import { PoolClient } from 'pg'
import { query } from '../client'
import type {
  User,
  CreateUserData,
  UpdateUserData,
  UserSearchParams,
  UserListResponse,
} from '../models/user'

export class UserRepository {
  async findAll(params: UserSearchParams = {}): Promise<UserListResponse> {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      department = '',
      role = '',
    } = params

    const offset = (page - 1) * limit

    let whereClauses: string[] = []
    let queryParams: any[] = []
    let paramIndex = 1

    if (search) {
      whereClauses.push(`(
        username ILIKE $${paramIndex} OR
        email ILIKE $${paramIndex} OR
        real_name ILIKE $${paramIndex} OR
        phone ILIKE $${paramIndex}
      )`)
      queryParams.push(`%${search}%`)
      paramIndex++
    }

    if (status) {
      whereClauses.push(`status = $${paramIndex}`)
      queryParams.push(status)
      paramIndex++
    }

    if (department) {
      whereClauses.push(`department = $${paramIndex}`)
      queryParams.push(department)
      paramIndex++
    }

    if (role) {
      whereClauses.push(`role = $${paramIndex}`)
      queryParams.push(role)
      paramIndex++
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const countQuery = `
      SELECT COUNT(*) as total
      FROM users
      ${whereClause}
    `

    const dataQuery = `
      SELECT *
      FROM users
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
      data: dataResult as User[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }

  async findById(id: number): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )
    return result[0] as User || null
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return result[0] as User || null
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )
    return result[0] as User || null
  }

  async create(data: CreateUserData): Promise<User> {
    const result = await query(
      `INSERT INTO users (
        username, email, phone, real_name, avatar,
        status, role, department, position
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        data.username,
        data.email,
        data.phone,
        data.real_name,
        data.avatar,
        data.status || 'active',
        data.role,
        data.department,
        data.position,
      ]
    )
    return result[0] as User
  }

  async update(id: number, data: UpdateUserData): Promise<User | null> {
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
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )

    return result[0] as User || null
  }

  async delete(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    )
    return result.length > 0
  }

  async updateLastLogin(id: number): Promise<void> {
    await query(
      `UPDATE users 
       SET last_login = CURRENT_TIMESTAMP, 
           login_count = login_count + 1 
       WHERE id = $1`,
      [id]
    )
  }

  async updateOnlineStatus(id: number, isOnline: boolean): Promise<void> {
    await query(
      'UPDATE users SET is_online = $1 WHERE id = $2',
      [isOnline, id]
    )
  }

  async getStats(): Promise<{
    total: number
    active: number
    online: number
    newToday: number
  }> {
    const result = await query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'active') as active,
        COUNT(*) FILTER (WHERE is_online = true) as online,
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as new_today
      FROM users
    `)

    return {
      total: parseInt(result[0].total),
      active: parseInt(result[0].active),
      online: parseInt(result[0].online),
      newToday: parseInt(result[0].new_today),
    }
  }
}
