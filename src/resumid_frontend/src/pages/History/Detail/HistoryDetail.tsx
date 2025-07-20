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

// Import the dummy data
import summaryExample from "./summary_example.json";

// Enhanced types for the new structure
export type CategoryScore = {
  score: number;
  label: string;
};

export type SectionAnalysisData = {
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
    sections: Record<string, SectionAnalysisData>;
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
            <div className="lg:col-span-4">
              <HistoryDetailThumbnail data={thumbnailData} />
            </div>
            <div className="lg:col-span-8">
              <HistoryResultAnalyze categories={data.summary.categories} />
              {sectionEntries.map(([sectionKey, sectionAnalysis]) => (
                <SectionAnalysis
                  key={sectionKey}
                  title={sectionKey}
                  analysis={sectionAnalysis}
                  score={data.summary.categories[sectionKey].score}
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
              
              {sectionEntries.map(([sectionKey, sectionAnalysis]) => (
                <SectionAnalysis
                  key={sectionKey}
                  title={sectionKey}
                  analysis={sectionAnalysis}
                  score={data.summary.categories[sectionKey].score} // You can replace this with actual section scores
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