import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileAboutSkeletonProps {
  isOwner?: boolean
}

export default function ProfileAboutSkeleton({ isOwner = false }: ProfileAboutSkeletonProps) {
  return (
    <Card className="p-0 overflow-hidden space-y-0">
      {/* Header */}
      <CardTitle className="relative inline-flex gap-3 justify-between items-center px-6 py-5 w-full border-b border-neutral-200">
        <Skeleton className="h-5 w-20 rounded-md" />
        {isOwner && (
          <Skeleton className="h-6 w-6 rounded-md" />
        )}
      </CardTitle>

      {/* Content */}
      <CardContent className="relative flex flex-col gap-4 p-6">
        {/* Paragraph lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[90%] rounded" />
          <Skeleton className="h-4 w-[85%] rounded" />
          <Skeleton className="h-4 w-[70%] rounded" />
        </div>

        {/* Info Box (only for owner) */}
        {isOwner && (
          <div className="w-full border border-neutral-200 p-3 rounded-lg bg-neutral-100 flex gap-2 items-center">
            <Skeleton className="h-4 w-4 rounded-full bg-neutral-200" />
            <Skeleton className="h-3 w-[80%] bg-neutral-200" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
