/**
 * @fileoverview components.d.ts
 * @description 统一的组件类型声明文件
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import React from 'react'

// React 类型声明
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

declare module 'lucide-react' {
  export const Search: React.FC<React.SVGProps<SVGSVGElement>>
  export const Plus: React.FC<React.SVGProps<SVGSVGElement>>
  export const Edit: React.FC<React.SVGProps<SVGSVGElement>>
  export const Trash: React.FC<React.SVGProps<SVGSVGElement>>
  export const Trash2: React.FC<React.SVGProps<SVGSVGElement>>
  export const Download: React.FC<React.SVGProps<SVGSVGElement>>
  export const Upload: React.FC<React.SVGProps<SVGSVGElement>>
  export const UserPlus: React.FC<React.SVGProps<SVGSVGElement>>
  export const UserCheck: React.FC<React.SVGProps<SVGSVGElement>>
  export const UserX: React.FC<React.SVGProps<SVGSVGElement>>
  export const Filter: React.FC<React.SVGProps<SVGSVGElement>>
  export const RefreshCw: React.FC<React.SVGProps<SVGSVGElement>>
  export const ChevronLeft: React.FC<React.SVGProps<SVGSVGElement>>
  export const ChevronRight: React.FC<React.SVGProps<SVGSVGElement>>
  export const MoreHorizontal: React.FC<React.SVGProps<SVGSVGElement>>
  export const Eye: React.FC<React.SVGProps<SVGSVGElement>>
  export const EyeOff: React.FC<React.SVGProps<SVGSVGElement>>
  export const Users: React.FC<React.SVGProps<SVGSVGElement>>
  export const Settings: React.FC<React.SVGProps<SVGSVGElement>>
  export const X: React.FC<React.SVGProps<SVGSVGElement>>
  export const Check: React.FC<React.SVGProps<SVGSVGElement>>
  export const CheckCircle: React.FC<React.SVGProps<SVGSVGElement>>
  export const XCircle: React.FC<React.SVGProps<SVGSVGElement>>
  export const AlertCircle: React.FC<React.SVGProps<SVGSVGElement>>
  export const AlertTriangle: React.FC<React.SVGProps<SVGSVGElement>>
  export const HelpCircle: React.FC<React.SVGProps<SVGSVGElement>>
  export const Info: React.FC<React.SVGProps<SVGSVGElement>>
  export const ChevronDown: React.FC<React.SVGProps<SVGSVGElement>>
  export const ChevronUp: React.FC<React.SVGProps<SVGSVGElement>>
  export const MoreVertical: React.FC<React.SVGProps<SVGSVGElement>>
  export const Calendar: React.FC<React.SVGProps<SVGSVGElement>>
  export const Clock: React.FC<React.SVGProps<SVGSVGElement>>
  export const FileText: React.FC<React.SVGProps<SVGSVGElement>>
  export const Mail: React.FC<React.SVGProps<SVGSVGElement>>
  export const Phone: React.FC<React.SVGProps<SVGSVGElement>>
  export const MapPin: React.FC<React.SVGProps<SVGSVGElement>>
  export const Building: React.FC<React.SVGProps<SVGSVGElement>>
  export const Shield: React.FC<React.SVGProps<SVGSVGElement>>
  export const Key: React.FC<React.SVGProps<SVGSVGElement>>
  export const Lock: React.FC<React.SVGProps<SVGSVGElement>>
  export const Unlock: React.FC<React.SVGProps<SVGSVGElement>>
  export const Copy: React.FC<React.SVGProps<SVGSVGElement>>
  export const ExternalLink: React.FC<React.SVGProps<SVGSVGElement>>
  export const Link: React.FC<React.SVGProps<SVGSVGElement>>
  export const Unlink: React.FC<React.SVGProps<SVGSVGElement>>
  export const Save: React.FC<React.SVGProps<SVGSVGElement>>
  export const Printer: React.FC<React.SVGProps<SVGSVGElement>>
  export const Share: React.FC<React.SVGProps<SVGSVGElement>>
  export const Facebook: React.FC<React.SVGProps<SVGSVGElement>>
  export const Twitter: React.FC<React.SVGProps<SVGSVGElement>>
  export const Linkedin: React.FC<React.SVGProps<SVGSVGElement>>
  export const Github: React.FC<React.SVGProps<SVGSVGElement>>
  export const Youtube: React.FC<React.SVGProps<SVGSVGElement>>
  export const Instagram: React.FC<React.SVGProps<SVGSVGElement>>
  export const Activity: React.FC<React.SVGProps<SVGSVGElement>>
  export const Crown: React.FC<React.SVGProps<SVGSVGElement>>
  export const Star: React.FC<React.SVGProps<SVGSVGElement>>
  export const Award: React.FC<React.SVGProps<SVGSVGElement>>
  export const TrendingUp: React.FC<React.SVGProps<SVGSVGElement>>
  export const Loader2: React.FC<React.SVGProps<SVGSVGElement>>
}

declare module '@/components/ui/card' {
  export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>>
  export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>>
  export const CardDescription: React.FC<React.HTMLAttributes<HTMLDivElement>>
  export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>
  export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>>
}

declare module '@/components/ui/button' {
  export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>>
}

declare module '@/components/ui/badge' {
  export const Badge: React.FC<React.HTMLAttributes<HTMLDivElement>>
}

declare module '@/components/ui/progress' {
  export const Progress: React.FC<{ value?: number; className?: string }>
}

declare module '@/components/ui/tabs' {
  export const Tabs: React.FC<{ defaultValue?: string; className?: string }>
  export const TabsList: React.FC<{ children: React.ReactNode; className?: string }>
  export const TabsTrigger: React.FC<{ value: string; children: React.ReactNode; className?: string }>
  export const TabsContent: React.FC<{ value: string; children: React.ReactNode; className?: string }>
}

declare module '@/components/ui/input' {
  export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>>
}

declare module '@/components/ui/label' {
  export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>>
}

declare module '@/components/ui/dialog' {
  export const Dialog: React.FC<{
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
  }>
  export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>>
  export const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>>
  export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>
  export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>
  export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>>
}

declare module '@/components/ui/select' {
  export const Select: React.FC<{
    value?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
    className?: string
  }>
  export const SelectContent: React.FC<React.HTMLAttributes<HTMLDivElement>>
  export const SelectItem: React.FC<{
    value: string
    children: React.ReactNode
    className?: string
  }>
  export const SelectTrigger: React.FC<React.HTMLAttributes<HTMLButtonElement>>
  export const SelectValue: React.FC<React.HTMLAttributes<HTMLSpanElement>>
}

declare module '@/components/ui/form-error' {
  export const FormFieldError: React.FC<{
    fieldName: string
    errors: Record<string, string>
  }>
}

declare module '@/components/ui/data-import-export' {
  export const DataImportExport: React.FC<{
    data: any[]
    onImport: (data: any[]) => void
    exportOptions?: {
      filename?: string
      sheetName?: string
    }
    importOptions?: {
      validateRow?: (row: any) => boolean
      transformRow?: (row: any) => any
    }
  }>
}

declare module '@/components/ui/advanced-search-bar' {
  export const AdvancedSearchBar: React.FC<{
    data: any[]
    onSearch: (results: any[]) => any[]
    fields: Array<{ value: string; label: string }>
    placeholder?: string
  }>
}

declare module '@/components/ui/batch-operations-panel' {
  export const BatchOperationsPanel: React.FC<{
    items: any[]
    onCreate?: (items: any[]) => void
    onUpdateStatus?: (ids: number[], status: string) => Promise<boolean>
    onDelete?: (ids: number[]) => Promise<boolean>
    getItemId?: (item: any) => number
    disabled?: boolean
  }>
}

declare module '@/components/ui/virtual-scroll' {
  export const VirtualScroll: React.FC<{
    items: any[]
    itemHeight: number
    containerHeight: number
    renderItem: (item: any, index: number) => React.ReactNode
  }>
}

declare module '@/hooks/use-toast' {
  export function toast(options: {
    title: string
    description?: string
    variant?: 'default' | 'destructive'
  }): void
}

declare module '@/hooks/use-users' {
  export function useUsers(params?: {
    page?: number
    limit?: number
    search?: string
  }): {
    users: any[]
    loading: boolean
    fetchUsers: () => Promise<void>
    createUser: (userData: any) => Promise<{ success: boolean; error?: string }>
    updateUser: (id: number, userData: any) => Promise<{ success: boolean; error?: string }>
    deleteUser: (id: number) => Promise<{ success: boolean; error?: string }>
  }
}

declare module '@/hooks/use-form-validation' {
  export function useFormValidation<T extends any>(options: {
    schema: T
    onSubmit: (data: any) => Promise<void>
    onSuccess?: () => void
    onError?: (errors: any) => void
  }): {
    values: any
    errors: Record<string, string>
    touched: Record<string, boolean>
    isSubmitting: boolean
    isValid: boolean
    handleChange: (field: string, value: any) => void
    handleBlur: (field: string) => void
    handleSubmit: (e?: React.FormEvent) => Promise<void>
    setFieldValue: (field: string, value: any) => void
    setFieldError: (field: string, error: string) => void
    clearErrors: () => void
    resetForm: (values?: any) => void
    validateField: (field: string) => boolean
    validateAll: () => boolean
  }
}

declare module '@/lib/utils/form-validation' {
  export const userFormSchema: any
}

declare module '@/store/user-store' {
  export interface User {
    id: number
    username: string
    email: string
    real_name: string
    role: 'admin' | 'manager' | 'user'
    department: string
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
  }
}
