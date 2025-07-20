import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Helmet } from "react-helmet";
import HistoryDetailThumbnail from "@/components/parts/HistoryDetailThumbnail";
import useWindowSize from "@/hooks/useMediaQuery";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Import the dummy data
import summaryExample from "./summary_example.json";

// Enhanced types for the new structure
export type CategoryScore = {
  score: number;
  label: string;
};

export type SectionAnalysis = {
  strengths: string[];
  weaknesses: string[];
  pointers: string[];
  feedback: string[];
};

export type HistoryDetailData = {
  id: string;
  filename: string;
  jobTitle: string;
  score: number;
  date: string;
  summary: {
    overall: {
      score: number;
      description: string;
    };
    categories: Record<string, CategoryScore>;
    sections: Record<string, SectionAnalysis>;
  };
};

function transformDataForThumbnail(data: HistoryDetailData) {
  return {
    id: data.id,
    filename: data.filename,
    jobTitle: data.jobTitle,
    score: data.score,
    date: data.date,
    summary: data.summary.overall.description // Extract the description string
  };
}

// Result Analyze Header component
function ResultAnalyzeHeader({ categories }: { categories: Record<string, CategoryScore> }) {
  const categoryEntries = Object.entries(categories);
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="font-outfit text-xl font-semibold text-heading mb-6">Result Analyze</CardTitle>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categoryEntries.map(([key, category]) => (
            <div key={key} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    stroke={category.score >= 80 ? "#10b981" : category.score >= 60 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    strokeDashoffset={`${2 * Math.PI * 35 * (1 - category.score / 100)}`}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-heading">{category.score}%</span>
                </div>
              </div>
              <p className="text-xs text-paragraph font-medium">{category.label}</p>
            </div>
          ))}
        </div>
      </CardHeader>
    </Card>
  );
}

// Section Analysis Container component
function SectionAnalysisContainer({ 
  title, 
  analysis 
}: { 
  title: string; 
  analysis: SectionAnalysis; 
}) {
  const sections = [
    { key: 'strengths', label: 'Strengths', color: 'bg-green-50 border-green-200', textColor: 'text-green-800', icon: '✓' },
    { key: 'weaknesses', label: 'Weaknesses', color: 'bg-red-50 border-red-200', textColor: 'text-red-800', icon: '✗' },
    { key: 'pointers', label: 'Pointers for Improvement', color: 'bg-yellow-50 border-yellow-200', textColor: 'text-yellow-800', icon: '→' },
    { key: 'feedback', label: 'Feedback', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-800', icon: '💬' }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="font-outfit text-lg font-semibold text-heading capitalize">
          {title.replace('_', ' ')}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section) => (
            <div key={section.key} className={`rounded-lg border p-4 ${section.color}`}>
              <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${section.textColor}`}>
                <span>{section.icon}</span>
                {section.label}
              </h4>
              <ul className="space-y-2">
                {analysis[section.key as keyof SectionAnalysis].map((item, index) => (
                  <li key={index} className={`text-sm leading-relaxed ${section.textColor}`}>
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function HistoryDetail() {
  const { id } = useParams();
  const { isTablet, isMobile } = useWindowSize();
  const [data, setData] = useState<HistoryDetailData | null>(null);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    setData(summaryExample as HistoryDetailData);
  }, [id]);

  const thumbnailData = transformDataForThumbnail(summaryExample);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-paragraph">Loading history details...</p>
        </div>
      </div>
    );
  }

  const sectionEntries = Object.entries(data.summary.sections);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>History Detail - {data.filename} | Resumid</title>
        <meta name="description" content={`Analysis details for ${data.filename}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="responsive-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Panel - Enhanced History Thumbnail */}
            <div className="lg:col-span-4">
              <HistoryDetailThumbnail data={thumbnailData} />
            </div>

            {/* Right Panel - Analysis Details */}
            <div className="lg:col-span-8">
              {/* Result Analyze Header */}
              <ResultAnalyzeHeader categories={data.summary.categories} />
              
              {/* Section Analysis Containers */}
              {sectionEntries.map(([sectionKey, sectionAnalysis]) => (
                <SectionAnalysisContainer
                  key={sectionKey}
                  title={sectionKey}
                  analysis={sectionAnalysis}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Dialog */}
        {(isTablet || isMobile) && (
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Analysis Details</h2>
                <DialogClose asChild>
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
              
              <ResultAnalyzeHeader categories={data.summary.categories} />
              
              {sectionEntries.map(([sectionKey, sectionAnalysis]) => (
                <SectionAnalysisContainer
                  key={sectionKey}
                  title={sectionKey}
                  analysis={sectionAnalysis}
                />
              ))}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}

export default HistoryDetail;