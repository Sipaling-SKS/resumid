import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonWallet() {
  return (
    <div className="space-y-6">
      {/* Wallet Card Skeleton */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          {/* User Information Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-6 w-48 bg-white/20 mb-2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-64 bg-white/20" />
              <Skeleton className="h-4 w-4 bg-white/20 rounded" />
            </div>
          </div>

          {/* Total Tokens Skeleton */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-10 w-20 bg-white/20" />
              <Skeleton className="h-5 w-5 bg-white/20 rounded" />
            </div>
            <Skeleton className="h-4 w-24 bg-white/20" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-4">
            <Skeleton className="h-16 w-full bg-white/20 rounded-full" />
            <Skeleton className="h-16 w-full bg-white/20 rounded-full" />
          </div>
        </CardContent>
      </Card>

      {/* History Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-32" />
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-5 w-5 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

