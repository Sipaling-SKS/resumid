import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileAnalyticsSkeleton() {
  return (
    <Card className="p-0 overflow-hidden space-y-0">
      <CardTitle className="relative inline-flex gap-3 justify-between items-center px-4 py-4 w-full border-b border-neutral-200">
        <Skeleton className="h-5 w-24 rounded" />
      </CardTitle>
      <CardContent className="relative flex flex-col gap-4 p-4">
        {[...Array(3)].map((_, idx) => (
          <Card key={idx} className="p-4 flex flex-row items-center gap-3 w-full space-y-0">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
