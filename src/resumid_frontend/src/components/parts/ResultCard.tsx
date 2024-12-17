import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Download, Info } from "lucide-react";

type ResultCardProps = {
  title: string;
  date: string;
  summary: string;
  score: number;
};

function ResultCard({ title, date, summary, score }: ResultCardProps) {
  return (
    <Card className="p-6 flex flex-col space-y-4 shadow-md border rounded-lg">
      <CardHeader className="p-0">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <CardDescription className="text-md text-gray-500">
          Your resume insights and recommendations at a glance.
        </CardDescription>
      </CardHeader>

      {/* Date Section */}
      <div className="flex items-center gap-2 bg-purple-100 text-purple-800 rounded-md py-2 px-4 w-fit text-sm">
        <CalendarCheck size={16} />
        <span>Analyzed on {date}</span>
      </div>

      <hr className="w-full border-t" />

      {/* Summary Section */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-semibold">Summary</h4>
          <p className="text-sm text-gray-600">{summary} <span className="text-blue-600 cursor-pointer hover:underline">Read more...</span></p>
        </div>

        {/* Score */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            <circle
              className="text-blue-500"
              strokeWidth="8"
              strokeDasharray={`${(score / 100) * 283}, 283`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
          </svg>
          <span className="text-lg font-semibold text-blue-500">{score}%</span>
        </div>
      </div>

      {/* Download Button */}
      <div>
        <Button className="w-full flex items-center gap-2" size="lg">
          <Download size={16} />
          Download Result
        </Button>
      </div>
    </Card>
  );
}

function ResultGrid() {
    const results = [
      {
        title: "Resume Analysis Results",
        date: "16 December 2024 - 6:28 PM",
        summary:
          "The resume highlights diverse technical expertise, leadership, and mentoring skills, with achievements in backend, frontend, and mobile technologies. However, it lacks specificity in programming.",
        score: 74,
      },
      {
        title: "Resume Analysis Results",
        date: "14 December 2024 - 5:15 PM",
        summary:
          "The resume showcases strong leadership and management skills with excellent technical depth. Improvement is needed in project details.",
        score: 82,
      },
      {
        title: "Resume Analysis Results",
        date: "10 December 2024 - 4:00 PM",
        summary:
          "Demonstrates strong teamwork and collaboration with solid technical experience, but lacks quantifiable achievements in programming.",
        score: 68,
      },
      {
        title: "Resume Analysis Results",
        date: "5 December 2024 - 2:45 PM",
        summary:
          "The resume highlights problem-solving and critical thinking skills with proven project results, but needs improvement in soft skills.",
        score: 77,
      },
    ];
  
    return (
      <section className="container mx-auto h-screen flex items-center justify-center px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center items-center">
          {results.map((result, index) => (
            <ResultCard
              key={index}
              title={result.title}
              date={result.date}
              summary={result.summary}
              score={result.score}
            />
          ))}
        </div>
      </section>
    );
  }
  

export default ResultGrid;
