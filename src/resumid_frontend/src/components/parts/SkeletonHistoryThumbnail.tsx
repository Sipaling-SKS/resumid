import { Card, CardContent, CardHeader } from "@/components/ui/card";

function SkeletonHistoryThumbnail() {
  return (
    <Card className="space-y-4 md:space-y-5 p-6 border border-neutral-300 animate-pulse">
      <div className="inline-flex justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="w-48 h-6 bg-neutral-200 rounded"></div>
          <div className="w-32 h-8 bg-neutral-300 rounded mt-1"></div>
          <div className="w-36 h-4 bg-neutral-300 rounded mt-1"></div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="w-20 h-4 bg-neutral-200 rounded"></div>
          <div className="w-12 h-4 bg-neutral-200 rounded"></div>
        </div>

      </div>
    </Card>
  );
}

export default SkeletonHistoryThumbnail;