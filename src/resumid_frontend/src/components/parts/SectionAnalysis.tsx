import { Card, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";

interface SectionAnalysisData {
  strengths: string[];
  weaknesses: string[];
  pointers: string[];
  feedback: {
    message: string;
    example?: string;
  }[];
}

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

  function isMeaningfulValue(value: string): boolean {
    const trimmedValue = value.trim().toLowerCase();
    return trimmedValue !== 'none' && 
           trimmedValue !== 'none.' && 
           trimmedValue !== 'n/a' && 
           trimmedValue !== 'n/a.' &&
           trimmedValue !== '' &&
           !trimmedValue.match(/^no\s+(revisions?|changes?)\s+needed\.?$/i);
  }

  function filterMeaningfulContent(items: string[]): string[] {
    return items.filter(item => isMeaningfulValue(item));
  }

  function filterMeaningfulFeedback(feedbackItems: { message: string; example?: string; }[]): { message: string; example?: string; }[] {
    return feedbackItems
      .filter(item => isMeaningfulValue(item.message))
      .map(item => ({
        message: item.message,
        example: item.example && isMeaningfulValue(item.example) ? item.example : undefined
      }));
  }

  function checkDefaultValue(analysis: SectionAnalysisData) {
    for (const section of sections) {
      const sectionData = analysis[section.key as keyof SectionAnalysisData];
      if (sectionData && sectionData.length > 0) {
        if (section.key === 'feedback') {
          const meaningfulFeedback = filterMeaningfulFeedback(sectionData as { message: string; example?: string; }[]);
          if (meaningfulFeedback.length > 0) {
            return ["section-analysis"];
          }
        } else {
          const meaningfulContent = filterMeaningfulContent(sectionData as string[]);
          if (meaningfulContent.length > 0) {
            return ["section-analysis"];
          }
        }
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
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
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

                let meaningfulData: any;
                if (section.key === 'feedback') {
                  meaningfulData = filterMeaningfulFeedback(sectionData as { message: string; example?: string; }[]);
                } else {
                  meaningfulData = filterMeaningfulContent(sectionData as string[]);
                }
                
                if (!meaningfulData || meaningfulData.length === 0) return null;
                
                return (
                  <div key={section.key} className="rounded-lg text-sm md:text-base">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-1 h-5 rounded-r-sm ${section.color}`}></div>
                      <h4 className={`font-semibold`}>
                        {section.label}
                      </h4>
                    </div>
                    <div className="ml-3">
                      {section.key === 'feedback' ? (
                        meaningfulData.map((item: { message: string; example?: string; }, index: number) => (
                          <div key={index} className="mb-4 last:mb-0">
                            <div className="flex items-start gap-2 mb-2">
                              <span className="leading-relaxed mt-0 flex-shrink-0">•</span>
                              <span className="leading-relaxed">{item.message}</span>
                            </div>
                            {item.example && (
                              <div className="ml-4 mt-3">
                                <blockquote className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                                  <p className="text-gray-700 italic leading-relaxed">
                                    {item.example}
                                  </p>
                                </blockquote>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        meaningfulData.map((item: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 mb-2 last:mb-0">
                            <span className="leading-relaxed mt-0 flex-shrink-0">•</span>
                            <span className="leading-relaxed">{item}</span>
                          </div>
                        ))
                      )}
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