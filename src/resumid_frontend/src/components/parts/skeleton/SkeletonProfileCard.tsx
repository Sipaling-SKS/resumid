import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SkeletonProfileCardProps {
  className?: string;
}

export default function SkeletonProfileCard({ className }: SkeletonProfileCardProps) {
  return (
    <Card 
      className={cn(
        "p-5 relative overflow-hidden animate-pulse",
        className
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-start w-full">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gray-200 border-2 border-neutral-200"></div>
          </div>
          
          <div className="flex-1 mx-4 min-w-0">
            <div className="space-y-1">
              <div className="h-4 sm:h-5 bg-gray-200 rounded" style={{width: `${120 + Math.random() * 80}px`}}></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded" style={{width: `${100 + Math.random() * 60}px`}}></div>
              <div className="flex items-center space-x-1 mt-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-200 rounded" style={{width: `${60 + Math.random() * 40}px`}}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute -right-20 top-0 h-full flex items-center">
          <div className="bg-gray-300 h-full flex items-center px-4">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-gray-400 rounded mb-1"></div>
              <div className="space-y-1">
                <div className="h-2 w-8 bg-gray-400 rounded"></div>
                <div className="h-2 w-10 bg-gray-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}