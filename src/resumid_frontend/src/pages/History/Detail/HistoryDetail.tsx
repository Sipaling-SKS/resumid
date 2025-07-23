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

import type { HistoryIdInput } from "../../../../../../src/declarations/resumid_backend/resumid_backend.did";
import summaryExample from "./summary_example.json";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { HistoryDataTransformer } from "@/utils/historyDataTransform";
import { HistoryDetailData } from "@/types/history.types";

async function handleGetHistoryDetail(resumidActor: any, historyId: string): Promise<HistoryDetailData> {
  if (!resumidActor) {
    throw new Error('Actor not available');
  }

  const input: HistoryIdInput = { historyId };
  const result = await resumidActor.getHistoryById(input);
  
  if ('err' in result) {
    throw new Error(result.err);
  }
  
  return HistoryDataTransformer.convertBackendToFrontend(result.ok);
}

function HistoryDetail() {
  const { id } = useParams();
  const { isTablet, isMobile } = useWindowSize();
  const { resumidActor } = useAuth();
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['historyDetail', id],
    queryFn: () => handleGetHistoryDetail(resumidActor, id!),
    enabled: !!id && !!resumidActor,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

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
          <p className="text-paragraph">{error?.message || 'Please try again later'}</p>
        </div>
      </div>
    );
  }

  const { categories, sections } = HistoryDataTransformer.transformForComponents(data);
  const thumbnailData = HistoryDataTransformer.transformForThumbnail(data);
  const sectionEntries = Object.entries(sections);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>History Detail - {data.fileName} | Resumid</title>
        <meta name="description" content={`Analysis details for ${data.fileName}`} />
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