import { query } from '../client'
import type {
  FinanceRecord,
  CreateFinanceData,
  UpdateFinanceData,
  FinanceSearchParams,
  FinanceSummary,
} from '../models/finance'

const ALLOWED_UPDATE_COLUMNS = [
  'type', 'category', 'amount', 'description',
] as const

export class FinanceRepository {
  async findAll(params: FinanceSearchParams = {}): Promise<{
    data: FinanceRecord[]
    pagination: { page: number; limit: number; total: number; totalPages: number }
  }> {
    const {
      page = 1,
      limit = 20,
      type = '',
      category = '',
      startDate = '',
      endDate = '',
    } = params

    const offset = (page - 1) * limit
    let whereClauses: string[] = []
    let queryParams: unknown[] = []
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

    if (startDate) {
      whereClauses.push(`created_at >= $${paramIndex}`)
      queryParams.push(startDate)
      paramIndex++
    }

    if (endDate) {
      whereClauses.push(`created_at <= $${paramIndex}`)
      queryParams.push(endDate)
      paramIndex++
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const countQuery = `SELECT COUNT(*) as total FROM finance_records ${whereClause}`
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

    const total = parseInt(countResult[0]?.total ?? '0')
    const totalPages = Math.ceil(total / limit)

    return {
      data: dataResult as FinanceRecord[],
      pagination: { page, limit, total, totalPages },
    }
  }

  async findById(id: number): Promise<FinanceRecord | null> {
    const result = await query('SELECT * FROM finance_records WHERE id = $1', [id])
    return (result[0] as FinanceRecord) || null
  }

  async create(data: CreateFinanceData): Promise<FinanceRecord> {
    const result = await query(
      `INSERT INTO finance_records (type, category, amount, description, reference_id, reference_type, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.type,
        data.category,
        data.amount,
        data.description ?? null,
        data.reference_id ?? null,
        data.reference_type ?? null,
        data.created_by ?? null,
      ]
    )
    return result[0] as FinanceRecord
  }

  async update(id: number, data: UpdateFinanceData): Promise<FinanceRecord | null> {
    const updates: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && (ALLOWED_UPDATE_COLUMNS as readonly string[]).includes(key)) {
        updates.push(`"${key}" = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    }

    if (updates.length === 0) return this.findById(id)

    values.push(id)
    const result = await query(
      `UPDATE finance_records SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )
    return (result[0] as FinanceRecord) || null
  }

  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM finance_records WHERE id = $1 RETURNING id', [id])
    return result.length > 0
  }

  async getSummary(startDate?: string, endDate?: string): Promise<FinanceSummary> {
    let whereClause = ''
    let params: unknown[] = []

    if (startDate && endDate) {
      whereClause = 'WHERE created_at >= $1 AND created_at <= $2'
      params = [startDate, endDate]
    } else if (startDate) {
      whereClause = 'WHERE created_at >= $1'
      params = [startDate]
    }

    const totalsResult = await query(
      `SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense
       FROM finance_records ${whereClause}`,
      params
    )

    const incomeByCategoryResult = await query(
      `SELECT category, SUM(amount) as amount
       FROM finance_records
       ${whereClause ? whereClause + ' AND' : 'WHERE'} type = 'income'
       GROUP BY category ORDER BY amount DESC`,
      params
    )

    const expenseByCategoryResult = await query(
      `SELECT category, SUM(amount) as amount
       FROM finance_records
       ${whereClause ? whereClause + ' AND' : 'WHERE'} type = 'expense'
       GROUP BY category ORDER BY amount DESC`,
      params
    )

    const totalIncome = parseFloat(totalsResult[0]?.total_income ?? '0')
    const totalExpense = parseFloat(totalsResult[0]?.total_expense ?? '0')

    return {
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      incomeByCategory: incomeByCategoryResult.map((r: Record<string, unknown>) => ({
        category: r.category as string,
        amount: parseFloat(r.amount as string),
      })),
      expenseByCategory: expenseByCategoryResult.map((r: Record<string, unknown>) => ({
        category: r.category as string,
        amount: parseFloat(r.amount as string),
      })),
    }
  }
}
