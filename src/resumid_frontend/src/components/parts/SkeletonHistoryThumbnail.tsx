import { Card, CardContent, CardHeader } from "@/components/ui/card";

function SkeletonHistoryThumbnail() {
  return (
    <Card className="space-y-4 md:space-y-5 p-6 border border-neutral-300 animate-pulse">
      <CardHeader>
        <div className="inline-flex items-center justify-between gap-2">
          <div className="flex flex-col gap-2">
            <div className="w-48 h-4 bg-neutral-200 rounded"></div>
            <div className="w-24 h-6 bg-neutral-300 rounded mt-1"></div>
          </div>
          <div className="w-20 h-4 bg-neutral-200 rounded"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-12 bg-neutral-200 rounded"></div>
      </CardContent>
      <hr className="h-[1px] w-full bg-neutral-200" />
      <div className="mt-3 inline-flex items-center w-full gap-2 border border-accent-500 py-2 px-3 rounded-lg">
        <div className="w-6 h-6 bg-neutral-300 rounded-full"></div>
        <div className="w-32 h-4 bg-neutral-200 rounded"></div>
      </div>
    </Card>
  );
}

export default SkeletonHistoryThumbnail;