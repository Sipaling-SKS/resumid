import AnalysisDetail from "@/components/parts/AnalysisDetail";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog"
import { Helmet } from "react-helmet";
import { useParams } from "react-router";
import useWindowSize from "@/hooks/useMediaQuery"
import HistoryThumbnail from "@/components/parts/HistoryThumbnail";
import { useState, useEffect } from "react";
import { resumid_backend } from "../../../../declarations/resumid_backend";
import { History } from "../../../../declarations/resumid_backend/resumid_backend.did";
import { X } from "lucide-react";
import SkeletonHistoryThumbnail from "@/components/parts/SkeletonHistoryThumbnail";
import SkeletonAnalysisDetail from "@/components/parts/SkeletonAnalysisDetail";

export type ResultData = {
  id: string;
  filename: string;
  jobTitle: string;
  score: number;
  date: string;
  summary: string;
  suggestions: string[] | null;
  strengths: string[] | null;
  gaps: string[] | null;
  weakness: string[] | null;
};

export type DataKeys = "suggestions" | "strengths" | "gaps" | "weakness";

function Result() {
  const { id } = useParams();
  const { isTablet, isMobile } = useWindowSize();

  const [histories, setHistories] = useState<ResultData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedData, setSelectedIdData] = useState<ResultData | null>(null);
  const [loadingHistories, setLoadingHistories] = useState<boolean>(true);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchHistories() {
      setLoadingHistories(true);

      try {
        const response = await resumid_backend.getHistories();

        if ("ok" in response) {
          const backendHistories = response.ok.map((history: History) => ({
            id: history.historyId,
            filename: history.fileName,
            jobTitle: history.jobTitle,
            score: parseFloat(history.score),
            date: new Date(history.createdAt).toISOString(),
            summary: history.summary,
            suggestions: history.suggestions.length ? history.suggestions : null,
            strengths: history.strengths.length ? history.strengths : null,
            gaps: history.gaps.length ? history.gaps : null,
            weakness: history.weaknesses.length ? history.weaknesses : null,
          }));

          setHistories(backendHistories);
          const initialId = backendHistories[0]?.id || null;

          setSelectedId(initialId);
          if (initialId) {
            setSelectedIdData(backendHistories.find((item) => item.id === initialId) || null);
          }
        } else {
          console.error("Failed to fetch histories:", response.err);
        }
      } catch (error) {
        console.error("Error fetching histories:", error);
      } finally {
        setLoadingHistories(false);
      }
    }
    fetchHistories();
  }, []);

  const handleSelectHistory = (val: string) => {
    if (selectedId !== val) {
      setSelectedId(val)
      setSelectedIdData(histories.find((item) => item.id === val) || null)
    }

    console.log("INTERACTING WITH HISTORY")

    if (isTablet || isMobile) {
      console.log("INTERACTING WITH DIALOG")
      setDialogOpen(true)
    }
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Resume Summary 15/12/2024 - Resumid</title>
      </Helmet>
      <main className="bg-background-950 min-h-screen responsive-container py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <section className="flex flex-col gap-4 md:gap-6 w-full max-w-md lg:w-1/3 xl:w-full xl:max-w-sm mx-auto lg:mx-0">
            {loadingHistories ? (
              <>
                <SkeletonHistoryThumbnail />
                <SkeletonHistoryThumbnail />
              </>
            ) : histories.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[200px]">
                <p>Infokan keberadaan History dari hasil Analyze</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
                  Klik
                </button>
              </div>
            ) : (
              histories.map((history) => (
                <HistoryThumbnail
                  key={history.id}
                  isSelected={selectedId === history.id}
                  data={history}
                  onSelect={handleSelectHistory}
                />
              ))
            )}
          </section>
          {!isTablet && !isMobile ? (
            <section className="lg:w-2/3 xl:w-full">
              {!loadingHistories ? selectedData && (
                <AnalysisDetail data={selectedData}/>
              ) : (
                <SkeletonAnalysisDetail />
              )}
            </section>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogClose />
              <DialogContent className="">
                {selectedData && (
                  <div className="relative">
                    <AnalysisDetail data={selectedData} />
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-400">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close</span>
                    </DialogClose>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </main>
    </>
  )
}

export default Result;