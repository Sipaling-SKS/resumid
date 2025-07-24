import { Card } from "@/components/ui/card";

function SkeletonSectionAnalysis() {
  return (
    <Card className="mb-6 border p-0 border-gray-200 shadow-sm animate-pulse">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
            <div className="h-6 w-32 bg-gray-300 rounded"></div>
          </div>
          <div className="text-right">
            <div className="h-8 w-12 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <div className="space-y-4">
          {/* Simulate 3 sections */}
          {[...Array(3)].map((_, sectionIndex) => (
            <div key={sectionIndex} className="rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-gray-300 rounded-r-sm"></div>
                <div className="h-5 w-24 bg-gray-300 rounded"></div>
              </div>
              <div className="ml-3 space-y-2">
                {/* Simulate bullet points */}
                {[...Array(2 + Math.floor(Math.random() * 2))].map((_, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="h-4 bg-gray-200 rounded" style={{width: `${200 + Math.random() * 200}px`}}></div>
                  </div>
                ))}
                {/* Simulate blockquote for feedback */}
                {sectionIndex === 2 && (
                  <div className="ml-4 mt-3">
                    <div className="bg-gray-100 border-l-4 border-gray-300 p-4 rounded-r-lg">
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default SkeletonSectionAnalysis;