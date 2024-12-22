import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar1 } from "lucide-react";
import { formatISOToDate, shorten } from "@/lib/utils";

interface HistoryThumbnailProps {
  onSelect: (val: string) => void;
  isSelected: boolean;
  data: History;
}

type History = {
  id: string;
  summary: string;
  score: number;
  date: string;
  filename: string;
  jobTitle: string;
}

function HistoryThumbnail({
  onSelect,
  isSelected,
  data,
}: HistoryThumbnailProps) {
  return (
    <Card
      className={`space-y-4 md:space-y-5 p-6 cursor-pointer hover:outline hover:outline-2 hover:outline-primary-500 -outline-offset-2 border border-neutral-300 ${isSelected && "lg:outline outline-2 outline-primary-500"}`}
      onClick={() => onSelect(data.id)}
    >
      <CardHeader className="">
        <div className="inline-flex items-center justify-between gap-2">
          <div className="flex flex-col gap-2">
            <CardTitle className="font-outfit font-semibold text-heading text-lg">
              {data.filename}
            </CardTitle>
            <CardDescription className="font-inter text-xs font-semibold text-white text-left bg-primary-500 w-fit px-3 py-2 rounded-md mt-1">
              {data.jobTitle}
            </CardDescription>
          </div>

          <div className="font-inter text-primary-500 text-sm font-semibold leading-tight self-start pt-1 text-right">
            Score:<br/>{data.score}/100
          </div>

        </div>
      </CardHeader>
      <CardContent>
        <p className="w-full text-sm text-paragraph font-inter">
          {shorten(data.summary, 100)}
        </p>
      </CardContent>
      <hr className="h-[1px] w-full bg-neutral-200" />
      <div className="mt-3 inline-flex items-center w-full gap-2 border border-accent-500 py-2 px-3 rounded-lg text-[#333] font-medium font-inter text-sm bg-accent-950">
        <Calendar1 className="text-accent-500 flex-shrink-0" size={18} />
        Analyzed on {formatISOToDate(data.date)}
      </div>
    </Card>
  )
}

export default HistoryThumbnail;