import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Calendar } from "lucide-react";

interface ResumeCardProps {
  title: string;
  score: number;
  date: string;
  role: string;
  summary: string;
}

function ResumeCard({
  title,
  score,
  date,
  role,
  summary,
}: ResumeCardProps) {
  return (
    <Card className="w-full border border-gray-200 rounded-lg shadow-md p-4 space-y-3">
      {/* Header */}
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="font-semibold text-md text-gray-800">
            {title}
          </CardTitle>
          <p className="text-primary-500 font-semibold text-sm">
            Score: {score}/100
          </p>
        </div>
      </CardHeader>

      {/* Role Badge */}
      <div className="flex items-center">
        <BadgeCheck size={16} className="text-blue-500 mr-2" />
        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
          {role}
        </span>
      </div>

      {/* Description */}
      <CardDescription className="text-gray-600 text-sm leading-relaxed">
        {summary}{" "}
        <span className="text-blue-500 font-semibold cursor-pointer">
          Read more...
        </span>
      </CardDescription>

      {/* Footer */}
      <CardContent className="flex items-center text-xs text-gray-500 gap-1 mt-2">
        <Calendar size={14} />
        <span>Analyzed on {date}</span>
      </CardContent>
    </Card>
  );
}

export default function ResumeList() {
  return (
    <div className="space-y-4">
      <ResumeCard
        title="Muhammad Fadil Hisyam CV 2025.pdf"
        score={79}
        date="16 December 2024"
        role="Software Engineer"
        summary="The resume highlights diverse technical expertise, leadership, and mentoring skills, with achievements."
      />
      <ResumeCard
        title="Muhammad Fadil Hisyam CV 2025.pdf"
        score={79}
        date="16 December 2024"
        role="Software Engineer"
        summary="The resume highlights diverse technical expertise, leadership, and mentoring skills, with achievements."
      />
      <ResumeCard
        title="Muhammad Fadil Hisyam CV 2025.pdf"
        score={79}
        date="16 December 2024"
        role="Software Engineer"
        summary="The resume highlights diverse technical expertise, leadership, and mentoring skills, with achievements."
      />
    </div>
  );
}
