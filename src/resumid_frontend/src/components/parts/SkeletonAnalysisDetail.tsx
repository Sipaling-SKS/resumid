import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SkeletonAnalysisDetail() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="flex flex-row gap-4 w-full justify-between items-center lg:items-start">
        <section>
          <CardTitle className="h-6 w-48 bg-neutral-200 rounded"></CardTitle>
          <div className="space-y-3 mt-2">
            <div className="h-5 w-32 bg-neutral-300 rounded"></div>
            <div className="inline-flex items-center w-44 gap-2 border border-accent-500 py-2 px-3 rounded-lg bg-neutral-100">
              <div className="h-4 w-4 bg-neutral-300 rounded-full"></div>
              <div className="h-4 w-28 bg-neutral-300 rounded"></div>
            </div>
          </div>
        </section>
        <div className="h-16 w-16 rounded-full bg-neutral-200"></div>
      </CardHeader>
      <hr className="h-[1px] w-full bg-neutral-200" />
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="h-5 w-28 bg-neutral-300 rounded"></div>
          <div className="h-4 w-full bg-neutral-200 rounded"></div>
          <div className="h-4 w-full bg-neutral-200 rounded"></div>
          <div className="h-4 w-3/4 bg-neutral-200 rounded"></div>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 w-24 bg-neutral-300 rounded"></div>
              <div className="space-y-1">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-4 w-11/12 bg-neutral-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default SkeletonAnalysisDetail;
