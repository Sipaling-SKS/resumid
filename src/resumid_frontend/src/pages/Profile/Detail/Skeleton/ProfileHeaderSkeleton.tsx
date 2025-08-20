import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function ProfileHeaderSkeleton() {
  return (
    <Card className="p-0 overflow-hidden space-y-0 rounded-none border-none">
      {/* Top banner */}
      <div className="relative w-full h-56">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      {/* Profile Section */}
      <div className="responsive-container">
        <CardContent className="relative pt-6 pb-8">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Avatar - left column */}
            <div className="flex-shrink-0 min-w-[180px] max-w-[280px] w-full flex flex-col items-center">
              <Skeleton className="w-20 sm:w-full h-20 sm:h-full aspect-square rounded-full border-2 sm:border-4 border-white -mt-16 sm:-mt-32" />
            </div>

            {/* Info - right column */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex gap-2 justify-between items-start">
                <div className="flex flex-col flex-1 gap-2">
                  {/* Name */}
                  <Skeleton className="h-6 w-40" />

                  {/* Role Badge */}
                  <Skeleton className="h-6 w-32 rounded-full" />

                  {/* Description */}
                  <Skeleton className="h-4 w-full max-w-md" />
                  <Skeleton className="h-4 w-3/4 max-w-sm" />
                </div>

                {/* Analytics (endorsements, avatars, etc) */}
                <div className="flex flex-col items-end gap-2">
                  <div className="inline-flex mb-1 -mr-1">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        className={cn(
                          "w-8 h-8 rounded-full border-[2px] border-white",
                          index > 0 ? "-ml-3" : ""
                        )}
                      />
                    ))}
                  </div>
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 mt-2">
                <Skeleton className="h-8 w-40 rounded-md" />
                <Skeleton className="h-6 w-28 rounded-md" />
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
