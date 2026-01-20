/**
 * @fileoverview use-form-validation.ts
 * @description 表单验证自定义Hook
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { useState, useCallback } from "react"
import { z } from "zod"

interface UseFormValidationOptions<T extends z.ZodSchema> {
  schema: T
  onSubmit: (data: z.infer<T>) => Promise<void>
  onSuccess?: () => void
  onError?: (errors: Record<string, string>) => void
}

interface UseFormValidationReturn<T extends z.ZodSchema> {
  values: z.infer<T>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
  handleChange: (field: keyof z.infer<T>, value: any) => void
  handleBlur: (field: keyof z.infer<T>) => void
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  setFieldValue: (field: keyof z.infer<T>, value: any) => void
  setFieldError: (field: string, error: string) => void
  clearErrors: () => void
  resetForm: (values?: z.infer<T>) => void
  validateField: (field: keyof z.infer<T>) => boolean
  validateAll: () => boolean
}

export function useFormValidation<T extends z.ZodSchema>({
  schema,
  onSubmit,
  onSuccess,
  onError,
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> {
  const [values, setValues] = useState<z.infer<T>>({} as z.infer<T>)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback(
    (field: keyof z.infer<T>, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }))
      
      if (touched[field as string]) {
        const fieldSchema = schema.shape[field as string] as z.ZodTypeAny
        const result = fieldSchema.safeParse(value)
        
        if (!result.success) {
          setErrors((prev) => ({
            ...prev,
            [field as string]: result.error.errors[0]?.message || "验证失败",
          }))
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors[field as string]
            return newErrors
          })
        }
      }
    },
    [schema, touched]
  )

  const handleBlur = useCallback(
    (field: keyof z.infer<T>) => {
      setTouched((prev) => ({ ...prev, [field as string]: true }))
      validateField(field)
    },
    [schema]
  )

  const validateField = useCallback(
    (field: keyof z.infer<T>): boolean => {
      const fieldSchema = schema.shape[field as string] as z.ZodTypeAny
      const result = fieldSchema.safeParse(values[field])
      
      if (!result.success) {
        setErrors((prev) => ({
          ...prev,
          [field as string]: result.error.errors[0]?.message || "验证失败",
        }))
        return false
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field as string]
          return newErrors
        })
        return true
      }
    },
    [schema, values]
  )

  const validateAll = useCallback((): boolean => {
    const result = schema.safeParse(values)
    
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.errors.forEach((error) => {
        if (error.path.length > 0) {
          const field = error.path.join(".")
          newErrors[field] = error.message
        }
      })
      setErrors(newErrors)
      setTouched(
        Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<string, boolean>)
      )
      return false
    } else {
      setErrors({})
      return true
    }
  }, [schema, values])

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()
      
      if (!validateAll()) {
        onError?.(errors)
        return
      }

      setIsSubmitting(true)
      try {
        await onSubmit(values)
        onSuccess?.()
      } catch (error) {
        console.error("Form submission error:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, validateAll, onSubmit, onSuccess, onError, errors]
  )

  const setFieldValue = useCallback((field: keyof z.infer<T>, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const resetForm = useCallback((newValues?: z.infer<T>) => {
    setValues(newValues || ({} as z.infer<T>))
    setErrors({})
    setTouched({})
  }, [])

  const isValid = Object.keys(errors).length === 0

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    clearErrors,
    resetForm,
    validateField,
    validateAll,
  }
}
