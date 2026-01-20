import { query } from '../client'
import type {
  SystemSetting,
  UpdateSystemSettingData,
  SystemLog,
  FinanceRecord,
  CreateFinanceRecordData,
} from '../models/system'

export class SystemRepository {
  async getSetting(key: string): Promise<SystemSetting | null> {
    const result = await query(
      'SELECT * FROM system_settings WHERE key = $1',
      [key]
    )
    return result[0] as SystemSetting || null
  }

  async getAllSettings(): Promise<SystemSetting[]> {
    const result = await query('SELECT * FROM system_settings ORDER BY category, key')
    return result as SystemSetting[]
  }

  async updateSetting(data: UpdateSystemSettingData): Promise<SystemSetting | null> {
    const result = await query(
      `INSERT INTO system_settings (key, value, category, description)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (key) DO UPDATE SET
         value = EXCLUDED.value,
         category = EXCLUDED.category,
         description = EXCLUDED.description,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [data.key, data.value, data.category, data.description]
    )
    return result[0] as SystemSetting || null
  }

  async getSettingsByCategory(category: string): Promise<SystemSetting[]> {
    const result = await query(
      'SELECT * FROM system_settings WHERE category = $1 ORDER BY key',
      [category]
    )
    return result as SystemSetting[]
  }

  async log(data: Omit<SystemLog, 'id' | 'created_at'>): Promise<void> {
    await query(
      `INSERT INTO system_logs (
        level, action, module, user_id, ip_address, user_agent,
        request_data, response_data, error_message, stack_trace, duration
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        data.level,
        data.action,
        data.module,
        data.user_id,
        data.ip_address,
        data.user_agent,
        JSON.stringify(data.request_data),
        JSON.stringify(data.response_data),
        data.error_message,
        data.stack_trace,
        data.duration,
      ]
    )
  }

  async findLogs(params: {
    page?: number
    limit?: number
    level?: string
    action?: string
    module?: string
    user_id?: number
  } = {}): Promise<{ data: SystemLog[]; pagination: any }> {
    const {
      page = 1,
      limit = 50,
      level,
      action,
      module,
      user_id,
    } = params

    const offset = (page - 1) * limit

    let whereClauses: string[] = []
    let queryParams: any[] = []
    let paramIndex = 1

    if (level) {
      whereClauses.push(`level = $${paramIndex}`)
      queryParams.push(level)
      paramIndex++
    }

    if (action) {
      whereClauses.push(`action = $${paramIndex}`)
      queryParams.push(action)
      paramIndex++
    }

    if (module) {
      whereClauses.push(`module = $${paramIndex}`)
      queryParams.push(module)
      paramIndex++
    }

    if (user_id) {
      whereClauses.push(`user_id = $${paramIndex}`)
      queryParams.push(user_id)
      paramIndex++
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const countQuery = `
      SELECT COUNT(*) as total
      FROM system_logs
      ${whereClause}
    `

    const dataQuery = `
      SELECT * FROM system_logs
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
      data: dataResult as SystemLog[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }

  async createFinanceRecord(data: CreateFinanceRecordData): Promise<FinanceRecord> {
    const result = await query(
      `INSERT INTO finance_records (
        type, category, amount, description, reference_id, reference_type
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        data.type,
        data.category,
        data.amount,
        data.description,
        data.reference_id,
        data.reference_type,
      ]
    )
    return result[0] as FinanceRecord
  }

  async getFinanceRecords(params: {
    page?: number
    limit?: number
    type?: string
    category?: string
  } = {}): Promise<{ data: FinanceRecord[]; pagination: any }> {
    const {
      page = 1,
      limit = 20,
      type,
      category,
    } = params

    const offset = (page - 1) * limit

    let whereClauses: string[] = []
    let queryParams: any[] = []
    let paramIndex = 1

    if (type) {
      whereClauses.push(`type = $${paramIndex}`)
      queryParams.push(type)
      paramIndex++
    }

    if (category) {
      whereClauses.push(`category = $${paramIndex}`)
      queryParams.push(category)
      paramIndex++
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const countQuery = `
      SELECT COUNT(*) as total
      FROM finance_records
      ${whereClause}
    `

    const dataQuery = `
      SELECT * FROM finance_records
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
      data: dataResult as FinanceRecord[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }
}
