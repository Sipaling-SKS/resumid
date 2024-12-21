import AnalysisDetail from "@/components/parts/AnalysisDetail";
import Summary from "@/components/parts/Summary";
import { Helmet } from "react-helmet";
import { useParams } from "react-router";
import useWindowSize from "@/hooks/useMediaQuery"
import HistoryThumbnail from "@/components/parts/HistoryThumbnail";
import { useState, useEffect } from "react";
import { resumid_backend } from "../../../../declarations/resumid_backend";
import { History } from "../../../../declarations/resumid_backend/resumid_backend.did";

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
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  useEffect(() => {
    async function fetchHistories() {
      setLoadingHistories(true);
      try {
        const response = await resumid_backend.getHistories();
        if ("ok" in response) {
          const backendHistories = response.ok.map((history: History) => ({
            id: history.historyId,
            filename: history.fileName,
            jobTitle: "",
            score: parseFloat(history.score),
            date: new Date(history.createdAt).toISOString(),
            summary: history.summary,
            suggestions: history.suggestions.length ? history.suggestions : null,
            strengths: history.strengths.length ? history.strengths : null,
            gaps: history.gaps.length ? history.gaps : null,
            weakness: history.weaknesses.length ? history.weaknesses : null,
          }));
          setHistories(backendHistories);
          setSelectedId(backendHistories[0]?.id || null);
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

  useEffect(() => {
    if (selectedId) {
      setLoadingDetails(true);
      async function fetchHistoryDetails() {
        try {
          const response = await resumid_backend.getHistoryById({ historyId: selectedId! });
          if ("ok" in response) {
            const history = response.ok;
            setSelectedIdData({
              id: history.historyId,
              filename: history.fileName,
              jobTitle: "",
              score: parseFloat(history.score),
              date: new Date(history.createdAt).toISOString(),
              summary: history.summary,
              suggestions: history.suggestions.length ? history.suggestions : null,
              strengths: history.strengths.length ? history.strengths : null,
              gaps: history.gaps.length ? history.gaps : null,
              weakness: history.weaknesses.length ? history.weaknesses : null,
            });
          } else {
            console.error("Failed to fetch history details:", response.err);
          }
        } catch (error) {
          console.error("Error fetching history details:", error);
        } finally {
          setLoadingDetails(false);
        }
      }
      fetchHistoryDetails();
    }
  }, [selectedId]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Resume Summary 15/12/2024 - Resumid</title>
      </Helmet>
      <main className="bg-background-950 min-h-screen responsive-container py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <section className="flex flex-col gap-4 md:gap-6 w-full max-w-md lg:w-1/3 xl:w-full xl:max-w-sm mx-auto">
            {loadingHistories ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <p>Sabar lee lagi Loading...</p>
              </div>
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
                  onSelect={(val) => {
                    if (selectedId !== val) {
                      setSelectedId(val);
                    }
                  }}
                />
              ))
            )}
          </section>
          {!isTablet && !isMobile && selectedData && (
            <section className="lg:w-2/3 xl:w-full">
              {loadingDetails ? (
                <div className="flex items-center justify-center min-h-[200px]">
                  <p>Bisa diganti loading indicatornya pls..</p>
                </div>
              ) : (
                selectedData && <AnalysisDetail data={selectedData} />
              )}
            </section>
          )}
        </div>
      </main>
    </>
  )
}

export default Result;