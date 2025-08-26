import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function ProfileHeaderSkeleton() {
  return (
    <Card className="p-0 overflow-hidden space-y-0 rounded-none border-none">
      {/* Top banner */}
      <div className="relative w-full h-36 sm:h-56">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      {/* Profile Section */}
      <div className="responsive-container">
        <CardContent className="relative py-6 sm:pt-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start">
            {/* Avatar - left column */}
            <div className="flex-shrink-0 w-32 sm:min-w-[180px] sm:max-w-[280px] sm:w-full flex flex-col items-center">
              <Skeleton className="w-32 sm:w-full h-32 sm:h-full aspect-square rounded-full border-2 sm:border-4 border-white -mt-16 sm:-mt-32" />
            </div>

            {/* Info - right column */}
            <div className="w-full flex-1 flex flex-col gap-2">
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
              <div className="flex gap-4 mt-2 items-center">
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
