import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { commonStyles } from "@/lib/design-system"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface EnhancedCardProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  variant?: "default" | "gradient" | "glass"
}

export function EnhancedCard({
  title,
  description,
  children,
  className,
  headerClassName,
  contentClassName,
  variant = "default",
}: EnhancedCardProps) {
  const cardVariants = {
    default: commonStyles.card.base,
    gradient:
      "bg-gradient-to-br from-card to-primary/5 border border-primary/10 rounded-xl shadow-sm hover:shadow-md transition-all duration-200",
    glass:
      "bg-card/60 backdrop-blur-md border border-primary/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
  }

  return (
    <Card className={cn(cardVariants[variant], className)}>
      {(title || description) && (
        <CardHeader className={cn(commonStyles.card.header, "rounded-t-xl", headerClassName)}>
          {title && <CardTitle className="text-card-foreground font-semibold">{title}</CardTitle>}
          {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn("p-4 sm:p-6", contentClassName)}>{children}</CardContent>
    </Card>
  )
}
