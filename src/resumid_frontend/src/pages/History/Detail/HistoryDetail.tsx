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
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import HistoryResultAnalyze from "@/components/parts/HistoryResultAnalyze";
import SectionAnalysis from "@/components/parts/SectionAnalysis";

import summaryExample from "./summary_example.json";

export type CategoryScore = {
  score: number;
  label: string;
};

export type SectionAnalysisData = {
  strengths: string[];
  weaknesses: string[];
  pointers: string[];
  feedback: {
    message: string;
    example?: string;
  }[];
};

export type ContentSection = {
  title: string;
  value: {
    score: number;
    strength: string;
    weaknesess: string;
    pointer: string[];
    feedback: {
      feedback_message: string;
      revision_example: string;
    }[];
  };
};

export type HistoryDetailData = {
  id: string;
  filename: string;
  jobTitle: string;
  score: number;
  date: string;
  summary: {
    content: ContentSection[];
    summary: {
      score: number;
      value: string;
    };
    conclusion: {
      career_recomendation: string[];
      keyword_matching: string[];
      section_to_add: string[];
      section_to_remove: string[];
    };
  };
};

// Function to transform data for components
function transformDataForComponents(data: HistoryDetailData) {
  const categories: Record<string, CategoryScore> = {};
  const sections: Record<string, SectionAnalysisData> = {};
  
  data.summary.content.forEach((section) => {
    const key = section.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    // Transform for categories (scores)
    categories[key] = {
      score: section.value.score * 10, // Convert 0-10 scale to 0-100
      label: section.title
    };
    
    // Transform for sections (analysis data)
    sections[key] = {
      strengths: section.value.strength ? [section.value.strength] : [],
      weaknesses: section.value.weaknesess ? [section.value.weaknesess] : [], // Note: keeping original typo
      pointers: section.value.pointer || [],
      feedback: section.value.feedback?.map(f => ({
        message: f.feedback_message,
        example: f.revision_example
      })) || []
    };
  });

  return { categories, sections };
}

function transformDataForThumbnail(data: HistoryDetailData) {
  return {
    id: data.id,
    filename: data.filename,
    jobTitle: data.jobTitle,
    score: data.score,
    date: data.date,
    summary: data.summary.summary.value // Extract the summary description
  };
}

function HistoryDetail() {
  const { id } = useParams();
  const { isTablet, isMobile } = useWindowSize();
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [data, setData] = useState<HistoryDetailData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const summaryArray = summaryExample as HistoryDetailData[];
        
        if (!summaryArray || summaryArray.length === 0) {
          throw new Error('No history data available');
        }
        
        // Use first item from array as sample data
        setData(summaryArray[0]);
      } catch (err) {
        console.error('Error loading history detail:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-paragraph">Loading history details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading history details</p>
          <p className="text-paragraph">{error || 'Please try again later'}</p>
        </div>
      </div>
    );
  }

  const { categories, sections } = transformDataForComponents(data);
  const thumbnailData = transformDataForThumbnail(data);
  const sectionEntries = Object.entries(sections);

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
            <div className="lg:col-span-4">
              <HistoryDetailThumbnail data={thumbnailData} />
            </div>
            <div className="lg:col-span-8">
              <HistoryResultAnalyze categories={categories} />
              {sectionEntries.map(([sectionKey, sectionAnalysis]) => {
                const score = categories[sectionKey]?.score || 0;
                return (
                  <SectionAnalysis
                    key={sectionKey}
                    title={sectionKey}
                    analysis={sectionAnalysis}
                    score={score}
                  />
                );
              })}
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
              
              {sectionEntries.map(([sectionKey, sectionAnalysis]) => {
                const score = categories[sectionKey]?.score || 0;
                return (
                  <SectionAnalysis
                    key={sectionKey}
                    title={sectionKey}
                    analysis={sectionAnalysis}
                    score={score}
                  />
                );
              })}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}

export default HistoryDetail;