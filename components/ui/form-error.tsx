/**
 * @fileoverview form-error.tsx
 * @description 表单错误显示组件
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormErrorProps {
  message?: string
  className?: string
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) {
    return null
  }

  return (
    <div className={cn("flex items-center gap-2 text-sm text-red-600 mt-1", className)}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
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
    <div className={cn("bg-red-50 border border-red-200 rounded-lg p-4", className)}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-red-800 mb-2">表单验证错误</h4>
          <ul className="space-y-1">
            {errorMessages.map((error, index) => (
              <li key={index} className="text-sm text-red-700">
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
