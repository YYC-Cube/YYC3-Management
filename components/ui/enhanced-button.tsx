"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

interface EnhancedButtonProps {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost" | "outline"
  size?: "sm" | "md" | "lg"
  icon?: LucideIcon
  iconPosition?: "left" | "right"
  loading?: boolean
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function EnhancedButton({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  className,
  onClick,
  disabled,
  type = "button",
}: EnhancedButtonProps) {
  const buttonVariants = {
    primary:
      "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg",
    secondary:
      "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg",
    ghost:
      "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg",
    outline:
      "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg border-0",
  }

  const sizeVariants = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
  }

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        buttonVariants[variant],
        sizeVariants[size],
        "transition-all duration-200 font-medium",
        loading && "opacity-70 cursor-not-allowed",
        className,
      )}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        Icon && iconPosition === "left" && <Icon className="w-4 h-4 mr-2" />
      )}
      {children}
      {Icon && iconPosition === "right" && <Icon className="w-4 h-4 ml-2" />}
    </Button>
  )
}
