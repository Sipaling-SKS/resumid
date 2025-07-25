import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar1 } from "lucide-react";
import { formatISOToDate, getTextSizeClass, shorten } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";

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

interface DynamicTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

function DynamicText({ text, maxLength = 100, className = "" }: DynamicTextProps) {
  const finalText = shorten(text, maxLength);
  const sizeClass = getTextSizeClass(finalText.length);

  return (
    <span className={`${sizeClass} ${className}`}>
      {finalText}
    </span>
  );
}

function HistoryThumbnail({
  onSelect,
  isSelected,
  data,
}: HistoryThumbnailProps) {
  return (
    <Card
      className={`inline-flex shadow-none overflow-hidden space-y-0 p-0 hover:outline hover:outline-2 hover:outline-primary-500 -outline-offset-2 border border-neutral-300 ${isSelected && "lg:outline outline-2 outline-primary-500"}`}
    >
      <div className="p-2 flex items-center border-r border-neutral-300 bg-neutral-50">
        <Checkbox
          className="data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500"
          aria-label="Select row"
        />

      </div>
      <div
        className="w-full h-full inline-flex items-center justify-between gap-2 p-4 cursor-pointer"
        onClick={() => onSelect(data.id)}
      >
        <div className="w-full h-full flex flex-col gap-2 justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle className="font-outfit font-semibold text-heading">
              <DynamicText text={data.fileName} maxLength={90} className="leading-none" />
            </CardTitle>
            <CardDescription className="w-fit inline-flex items-center gap-2 border border-accent-500 py-2 px-3 rounded-lg text-[#333] font-medium font-inter text-sm bg-accent-950 mt-1">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span className="font-inter text-sm font-semibold text-purple-700">
                {data.jobTitle}
              </span>
            </CardDescription>
          </div>
          <div className="text-paragraph text-xs font-medium mt-1 text-muted-foreground italic">
            Analyzed on {formatISOToDate(data.date)}
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