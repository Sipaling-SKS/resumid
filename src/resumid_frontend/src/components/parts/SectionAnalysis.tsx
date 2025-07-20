import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionAnalysisData } from "@/pages/History/Detail/HistoryDetail";

interface SectionAnalysisProps {
  title: string;
  analysis: SectionAnalysisData;
  score?: number;
}

function SectionAnalysis({ 
  title, 
  analysis,
  score 
}: SectionAnalysisProps) {
  const sections = [
    { 
      key: 'strengths', 
      label: 'Strengths', 
      color: 'bg-green-500'
    },
    { 
      key: 'weaknesses', 
      label: 'Weaknesses', 
      color: 'bg-red-500'
    },
    { 
      key: 'pointers', 
      label: 'Pointers for Improvement', 
      color: 'bg-yellow-500'
    },
    { 
      key: 'feedback', 
      label: 'Feedback', 
      color: 'bg-blue-500'
    }
  ];

  return (
    <Card className="mb-6 border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="font-outfit text-lg font-semibold text-heading capitalize">
            {title.replace('_', ' ')}
          </CardTitle>
          {score && (
            <div className="text-right">
              <span className="text-2xl font-bold text-primary-500">{score}%</span>
              <p className="text-xs text-gray-500">Score</p>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {sections.map((section) => {
            const sectionData = analysis[section.key as keyof SectionAnalysisData];
            if (!sectionData || sectionData.length === 0) return null;
            
            return (
              <div key={section.key} className="rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-1 h-5 rounded-r-sm ${section.color}`}></div>
                  <h4 className={`text-sm font-semibold`}>
                    {section.label}
                  </h4>
                </div>
                <div className="ml-3">
                  {sectionData.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 mb-2 last:mb-0">
                      <span className="text-sm leading-relaxed mt-0 flex-shrink-0">•</span>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default SectionAnalysis;