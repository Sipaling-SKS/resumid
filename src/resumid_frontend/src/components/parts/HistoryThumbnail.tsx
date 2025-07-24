import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar1 } from "lucide-react";
import { formatISOToDate, shorten } from "@/lib/utils";

interface HistoryThumbnailProps {
  onSelect: (val: string) => void;
  isSelected?: boolean;
  data: History;
}

type History = {
  id: string;
  summary: string;
  score: number;
  date: string;
  fileName: string;
  jobTitle: string;
}

function HistoryThumbnail({
  onSelect,
  isSelected,
  data,
}: HistoryThumbnailProps) {
  return (
    <Card
      className={`shadow-none space-y-4 md:space-y-5 p-4 cursor-pointer hover:outline hover:outline-2 hover:outline-primary-500 -outline-offset-2 border border-neutral-300 ${isSelected && "lg:outline outline-2 outline-primary-500"}`}
      onClick={() => onSelect(data.id)}
    >
      <div className="inline-flex items-center justify-between gap-2">
        <div className="flex flex-col gap-2">
          <CardTitle className="font-outfit font-semibold text-heading text-base">
            {data.fileName}
          </CardTitle>
          <CardDescription className="font-inter text-xs font-semibold text-white text-left bg-primary-500 w-fit px-3 py-2 rounded-md mt-1">
            {data.jobTitle}
          </CardDescription>
          <div className="flex flex-row items-center gap-1 text-paragraph text-sm font-medium mt-1">
            <Calendar1 className="text-accent-500 flex-shrink-0" size={16} />
            {formatISOToDate(data.date)}
          </div>
        </div>

        {!isNaN(data.score) && <div className="font-inter text-primary-500 text-sm font-semibold leading-tight self-start pt-1 text-right">
          Score:<br />{data.score}/100
        </div>}

      </div>
    </Card>
  )
}

export default HistoryThumbnail;