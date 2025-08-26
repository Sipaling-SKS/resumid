import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileEducationSkeletonProps {
  isOwner?: boolean;
}

export default function ProfileEducationSkeleton({ isOwner = false }: ProfileEducationSkeletonProps) {
  return (
    <Card className="p-0 overflow-hidden space-y-0">
      {/* Header */}
      <CardTitle className="relative inline-flex gap-3 justify-between items-center px-6 py-5 w-full border-b border-neutral-200">
        <Skeleton className="h-5 w-28 rounded" />
        {isOwner && (
          <Skeleton className="h-6 w-6 rounded-md" />
        )}
      </CardTitle>

      <CardContent className="flex flex-col gap-4 p-6">
        {/* Highlight Banner */}
        {isOwner && (
          <div className="w-full border border-neutral-200 p-3 rounded-lg bg-neutral-100 flex gap-2 items-center">
            <Skeleton className="h-4 w-4 rounded-full bg-neutral-200" />
            <Skeleton className="h-3 w-[80%] bg-neutral-200" />
          </div>
        )}

        {/* Education List */}
        <div className="flex flex-col gap-4 font-inter">
          {Array.from({ length: 2 }).map((_, idx) => (
            <Card key={idx} className="border rounded-lg p-0 shadow-sm">
              <div className="flex justify-between">
                <div className="w-full p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-3 w-32" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-[90%]" />
                    <Skeleton className="h-3 w-[75%]" />
                  </div>
                </div>
                {isOwner && (
                  <div className="flex flex-col items-center justify-center p-2 border-l border-neutral-200 self-stretch">
                    <Skeleton className="h-6 w-6 rounded-md" />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
