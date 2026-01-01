import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { commonStyles } from "@/lib/design-system"
import { cn } from "@/lib/utils"

export default function HelpLoading() {
  return (
    <div className={commonStyles.layout.container}>
      {/* 页面头部骨架 */}
      <div className={commonStyles.layout.pageHeader}>
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* 搜索框骨架 */}
      <Card className={cn(commonStyles.card.base, "mb-6")}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-16" />
          </div>
        </CardContent>
      </Card>

      {/* 快速链接骨架 */}
      <div className={cn(commonStyles.layout.grid, "grid-cols-4", "mb-8")}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className={commonStyles.card.base}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 标签页骨架 */}
      <div className="space-y-6">
        <Skeleton className="h-12 w-full rounded-lg" />

        <Card className={commonStyles.card.base}>
          <CardHeader className={commonStyles.card.header}>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className={commonStyles.card.content}>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className={cn(commonStyles.card.base, "border-sky-100")}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
