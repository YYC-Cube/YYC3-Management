import { query } from '../client'
import type {
  Customer,
  CreateCustomerData,
  UpdateCustomerData,
  CustomerSearchParams,
  CustomerListResponse,
} from '../models/customer'

export class CustomerRepository {
  async findAll(params: CustomerSearchParams = {}): Promise<CustomerListResponse> {
    const {
      page = 1,
      limit = 10,
      search = '',
      level = '',
      status = '',
    } = params

    const offset = (page - 1) * limit

    let whereClauses: string[] = []
    let queryParams: any[] = []
    let paramIndex = 1

    if (search) {
      whereClauses.push(`(
        name ILIKE $${paramIndex} OR
        company ILIKE $${paramIndex} OR
        phone ILIKE $${paramIndex} OR
        email ILIKE $${paramIndex}
      )`)
      queryParams.push(`%${search}%`)
      paramIndex++
    }

    if (level) {
      whereClauses.push(`level = $${paramIndex}`)
      queryParams.push(level)
      paramIndex++
    }

    if (status) {
      whereClauses.push(`status = $${paramIndex}`)
      queryParams.push(status)
      paramIndex++
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const countQuery = `
      SELECT COUNT(*) as total
      FROM customers
      ${whereClause}
    `

    const dataQuery = `
      SELECT * FROM customers
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
      data: dataResult as Customer[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }

  async findById(id: number): Promise<Customer | null> {
    const result = await query(
      'SELECT * FROM customers WHERE id = $1',
      [id]
    )
    return result[0] as Customer || null
  }

  async create(data: CreateCustomerData): Promise<Customer> {
    const result = await query(
      `INSERT INTO customers (
        name, company, phone, email, level, status, address, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        data.name,
        data.company,
        data.phone,
        data.email,
        data.level || '普通',
        data.status || '活跃',
        data.address,
        data.notes,
      ]
    )
    return result[0] as Customer
  }

  async update(id: number, data: UpdateCustomerData): Promise<Customer | null> {
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
      `UPDATE customers SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )

    return result[0] as Customer || null
  }

  async delete(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM customers WHERE id = $1 RETURNING id',
      [id]
    )
    return result.length > 0
  }

  async getStats(): Promise<{
    total: number
    active: number
    vip: number
    newToday: number
  }> {
    const result = await query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = '活跃') as active,
        COUNT(*) FILTER (WHERE level = 'VIP') as vip,
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as new_today
      FROM customers
    `)

    return {
      total: parseInt(result[0].total),
      active: parseInt(result[0].active),
      vip: parseInt(result[0].vip),
      newToday: parseInt(result[0].new_today),
    }
  }
}
