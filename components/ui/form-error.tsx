/**
 * @fileoverview form-error.tsx — 表单错误显示组件
 * @description 使用语义 token（destructive）的表单错误组件，自动适配深色模式
 * @author YYC³
 * @version 3.1.0
 * @created 2025-01-19
 * @modified 2026-07-17
 * @copyright Copyright (c) 2025-2026 YYC³
 * @license MIT
 *
 * @note 修复历史：
 *   - v3.0.0：硬编码 text-red-600/bg-red-50/border-red-200 等，深色模式不自适应
 *   - v3.1.0：全部改用语义 token（text-destructive/bg-destructive/10 等）
 */

import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface FormErrorProps {
  message?: string
  className?: string
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) {
    return null
  }

  return (
    <div className={cn("flex items-center gap-2 text-sm text-destructive mt-1", className)}>
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

interface FormErrorsProps {
  errors: Record<string, string>
  className?: string
}

export function FormErrors({ errors, className }: FormErrorsProps) {
  const errorMessages = Object.values(errors)

  if (errorMessages.length === 0) {
    return null
  }

  return (
    <div className={cn("bg-destructive/10 border border-destructive/20 rounded-lg p-4", className)}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-destructive mb-2">表单验证错误</h4>
          <ul className="space-y-1">
            {errorMessages.map((error, index) => (
              <li key={index} className="text-sm text-destructive">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

interface FormFieldErrorProps {
  fieldName: string
  errors: Record<string, string>
  className?: string
}

export function FormFieldError({ fieldName, errors, className }: FormFieldErrorProps) {
  const errorMessage = errors[fieldName]

  if (!errorMessage) {
    return null
  }

  return <FormError message={errorMessage} className={className} />
}
