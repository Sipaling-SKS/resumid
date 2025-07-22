import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar1, Briefcase } from "lucide-react";
import { formatISOToDate, shorten } from "@/lib/utils";
import CircularProgress from "@/components/parts/CircularScore";
import { useState } from "react";

interface HistoryDetailThumbnailProps {
  data: {
    id: string;
    filename: string;
    jobTitle: string;
    score: number;
    date: string;
    summary: string;
  };
}

function JobRoleBadge({ role }: { role: string }) {
  return (
    <div className="mt-2 inline-flex items-center gap-2 border border-accent-500 py-2 px-3 rounded-lg text-[#333] font-medium font-inter text-sm bg-accent-950">
      <Briefcase className="w-4 h-4 text-purple-600" />
      <span className="font-inter text-sm font-semibold text-purple-700">
        {role}
      </span>
    </div>
  );
}

function HistoryDetailThumbnail({ data }: HistoryDetailThumbnailProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <Card className="h-fit border-2 border-primary-500 bg-white shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <CardTitle className="font-outfit font-semibold text-heading text-lg leading-tight">
              {data.filename}
            </CardTitle>
            <div className="space-y-2">
              <JobRoleBadge role={data.jobTitle} />
              <p className="font-inter text-xs text-muted-foreground italic">
                Analyzed on {formatISOToDate(data.date)}
              </p>
            </div>
          </div>
          <div className="flex justify-center sm:justify-end flex-shrink-0">
            <CircularProgress 
                value={data.score} 
                duration={1000}
                className="h-28 w-28"
              />
          </div>
        </div>
      </CardHeader>
      
      <hr className="border-gray-200" />
      
      <CardContent className="pt-2">
        <div className="space-y-2">
          <h4 className="font-outfit font-semibold text-heading text-base">
            Summary
          </h4>
          <p className="font-inter text-sm text-paragraph leading-relaxed">
             {isExpanded ? data.summary : shorten(data.summary, 300)}{' '}
             {
               isExpanded ? (
                 <span className="font-inter text-sm font-semibold text-purple-700 cursor-pointer" onClick={() => setIsExpanded(false)}>
                   Read less
                 </span>
               ) : (
                 <span className="font-inter text-sm font-semibold text-purple-700 cursor-pointer" onClick={() => setIsExpanded(true)}>
                   Read more
                 </span>
               )
             }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default HistoryDetailThumbnail;