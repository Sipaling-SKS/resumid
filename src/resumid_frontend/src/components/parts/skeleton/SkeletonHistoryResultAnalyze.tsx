import { Card, CardHeader } from "@/components/ui/card";

function SkeletonHistoryResultAnalyze() {
  return (
    <Card className="mb-6 border border-gray-200 shadow-sm animate-pulse">
      <CardHeader>
        <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>
        
        {/* Desktop version */}
        <div className="hidden md:block">
          <div className="flex gap-6 overflow-x-auto pb-2" style={{cursor: 'grab'}}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="text-center flex-shrink-0 w-24">
                <div className="mb-2 flex justify-center">
                  <div className="h-20 w-20 rounded-full bg-gray-200"></div>
                </div>
                <div className="h-4 w-16 bg-gray-300 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile version */}
        <div className="md:hidden space-y-4">
          {[...Array(2)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 justify-between">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center flex-shrink-0 w-20">
                  <div className="mb-2 flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                  </div>
                  <div className="h-3 w-12 bg-gray-300 rounded mx-auto"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardHeader>
    </Card>
  );
}

export default SkeletonHistoryResultAnalyze;