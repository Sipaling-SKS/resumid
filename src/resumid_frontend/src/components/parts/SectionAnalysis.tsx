import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionAnalysisData } from "@/pages/History/Detail/HistoryDetail";
import { ChevronDown } from "lucide-react";

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

  function checkDefaultValue(analysis: SectionAnalysisData) {
    for (const section of sections) {
      const sectionData = analysis[section.key as keyof SectionAnalysisData];
      if (sectionData && sectionData.length > 0) {
        return ["section-analysis"];
      }
    }
    return [];
  }

  return (
    <Card className="mb-6 border p-0 border-gray-200 shadow-sm">
      <Accordion type="multiple" defaultValue={checkDefaultValue(analysis)} className="w-full p-0">
        <AccordionItem value="section-analysis" className="border-none">
          <AccordionTrigger className="hover:no-underline px-6 py-4 [&>svg]:hidden group">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-3">
                <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
                <CardTitle className="font-outfit text-lg font-semibold text-heading capitalize text-left">
                  {title.replace('_', ' ')}
                </CardTitle>
              </div>
              {score && (
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary-500">{score}%</span>
                  <p className="text-xs text-gray-500">Score</p>
                </div>
              )}
            </div>
          </AccordionTrigger>
          
          <AccordionContent className="px-6 pb-6 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="space-y-4">
              {sections.map((section) => {
                const sectionData = analysis[section.key as keyof SectionAnalysisData];
                if (!sectionData || sectionData.length === 0) return null;
                
                return (
                  <div key={section.key} className="rounded-lg text-sm md:text-base">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-1 h-5 rounded-r-sm ${section.color}`}></div>
                      <h4 className={`font-semibold`}>
                        {section.label}
                      </h4>
                    </div>
                    <div className="ml-3">
                      {sectionData.map((item, index) => (
                        <div key={index} className="flex items-start gap-2 mb-2 last:mb-0">
                          <span className="leading-relaxed mt-0 flex-shrink-0">•</span>
                          <span className="leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

export default SectionAnalysis;