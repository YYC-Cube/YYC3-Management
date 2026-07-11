export interface FinanceRecord {
  id: number
  type: 'income' | 'expense'
  category: string
  amount: number
  description: string | null
  reference_id: string | null
  reference_type: string | null
  created_by: number | null
  created_at: string
}

export interface CreateFinanceData {
  type: 'income' | 'expense'
  category: string
  amount: number
  description?: string
  reference_id?: string
  reference_type?: string
  created_by?: number
}

export interface UpdateFinanceData {
  type?: 'income' | 'expense'
  category?: string
  amount?: number
  description?: string
}

export interface FinanceSearchParams {
  page?: number
  limit?: number
  type?: string
  category?: string
  startDate?: string
  endDate?: string
}

export interface FinanceSummary {
  totalIncome: number
  totalExpense: number
  netProfit: number
  incomeByCategory: { category: string; amount: number }[]
  expenseByCategory: { category: string; amount: number }[]
}
