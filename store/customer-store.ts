import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Customer {
  id: number
  name: string
  company: string
  email: string
  phone: string
  level: 'VIP' | '普通' | '潜在'
  status: 'active' | 'inactive'
  total_spent: number
  last_contact: string
  created_at: string
  updated_at: string
}

interface CustomerState {
  customers: Customer[]
  loading: boolean
  error: string | null
  setCustomers: (customers: Customer[]) => void
  addCustomer: (customer: Customer) => void
  updateCustomer: (id: number, customer: Partial<Customer>) => void
  deleteCustomer: (id: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customers: [],
      loading: false,
      error: null,
      setCustomers: (customers) => set({ customers }),
      addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),
      updateCustomer: (id, updatedCustomer) =>
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id ? { ...customer, ...updatedCustomer } : customer
          ),
        })),
      deleteCustomer: (id) =>
        set((state) => ({
          customers: state.customers.filter((customer) => customer.id !== id),
        })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'customer-storage',
    }
  )
)
