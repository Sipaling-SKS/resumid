import { Card, CardContent, CardHeader } from "@/components/ui/card";

function SkeletonHistoryDetailThumbnail() {
  return (
    <Card className="h-fit border-2 border-gray-200 bg-white shadow-lg animate-pulse">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-1 flex-1">
            {/* Filename */}
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              {/* Job title badge */}
              <div className="inline-flex items-center gap-2 border border-gray-200 py-2 px-3 rounded-lg bg-gray-100 w-32">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
              </div>
              {/* Date */}
              <div className="h-3 w-36 bg-gray-200 rounded"></div>
            </div>
          </div>
          {/* Score circle */}
          <div className="flex justify-center sm:justify-end flex-shrink-0">
            <div className="h-28 w-28 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </CardHeader>
      
      <hr className="border-gray-200" />
      
      <CardContent>
        <div className="space-y-4">
          {/* Summary section */}
          <div className="space-y-2">
            <div className="h-5 w-20 bg-gray-300 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>
          </div>

          <hr className="border-gray-200" />
          
          {/* Keyword chips */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-full" style={{width: `${60 + Math.random() * 40}px`}}></div>
              ))}
              <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SkeletonHistoryDetailThumbnail;