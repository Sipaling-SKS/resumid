import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import CircularProgress from "@/components/parts/CircularScore";
import { useRef, useState } from "react";
import { CategoryScore } from "@/types/history.types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { ChevronDown } from "lucide-react";

interface HistoryResultAnalyzeProps {
  categories: Record<string, CategoryScore>;
}

function HistoryResultAnalyze({ categories }: HistoryResultAnalyzeProps) {
  const categoryEntries = Object.entries(categories);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 0.75;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const renderMobileGrid = () => {
    const itemsPerRow = 3;
    const rows = [];

    for (let i = 0; i < categoryEntries.length; i += itemsPerRow) {
      const rowItems = categoryEntries.slice(i, i + itemsPerRow);
      const isLastRow = i + itemsPerRow >= categoryEntries.length;
      const isIncompleteRow = rowItems.length < itemsPerRow;

      rows.push(
        <div
          key={`row-${i}`}
          className={`flex gap-4 ${isLastRow && isIncompleteRow
            ? 'justify-center'
            : 'justify-between'
            }`}
        >
          {rowItems.map(([key, category]) => (
            <div key={key} className="text-center flex-shrink-0 w-20">
              <div className="mb-2 flex justify-center">
                <CircularProgress
                  value={category.score}
                  duration={1000}
                  className="h-16 w-16"
                  showScoreText={false}
                />
              </div>
              <p className="text-xs text-paragraph font-medium text-center break-words leading-tight">
                {category.label}
              </p>
            </div>
          ))}
        </div>
      );
    }

    return rows;
  };

  return (
    <Card className="mb-6 border p-0 border-gray-200 shadow-sm">
      <Accordion type="single" defaultValue="section-result-analyze" className="w-full p-0">
        <AccordionItem value="section-result-analyze" className="border-none">
          <AccordionTrigger className="hover:no-underline p-6 [&>svg]:hidden group">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-3">
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
                <CardTitle className="font-outfit text-lg font-semibold text-heading text-left">
                  Result Analyze
                </CardTitle>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-6 sm:px-0 pb-6 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="block sm:hidden">
              <div className="space-y-4">
                {renderMobileGrid()}
              </div>
            </div>

            <div className="hidden sm:block">
              <div
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide pb-4 cursor-grab select-none"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex gap-8 min-w-max">
                  {categoryEntries.map(([key, category], index) => {
                    const isFirst = index === 0;
                    const isLast = index === categoryEntries.length - 1;

                    return (
                      <div
                        key={key}
                        className={`text-center flex-shrink-0 w-28 ${isFirst ? 'ml-8' : ''
                          } ${isLast ? 'mr-8' : ''
                          }`}
                      >
                        <div className="mb-3 lg:mb-0 flex justify-center">
                          <CircularProgress
                            value={category.score}
                            duration={1000}
                            className="h-20 w-20"
                            showScoreText={false}
                          />
                        </div>
                        <p className="text-sm text-paragraph font-medium text-center break-words leading-tight">
                          {category.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* <CardHeader>
        <CardTitle className="font-outfit text-xl font-semibold text-heading mb-6 sm:mt-8 sm:mx-8">
          Result Analyze
        </CardTitle>

        <div className="block sm:hidden">
          <div className="space-y-4">
            {renderMobileGrid()}
          </div>
        </div>

        <div className="hidden sm:block">
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide pb-4 cursor-grab select-none"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-8 min-w-max">
              {categoryEntries.map(([key, category], index) => {
                const isFirst = index === 0;
                const isLast = index === categoryEntries.length - 1;

                return (
                  <div
                    key={key}
                    className={`text-center flex-shrink-0 w-28 ${isFirst ? 'ml-8' : ''
                      } ${isLast ? 'mr-9' : ''
                      }`}
                  >
                    <div className="mb-3 lg:mb-0 flex justify-center">
                      <CircularProgress
                        value={category.score}
                        duration={1000}
                        className="h-20 w-20"
                        showScoreText={false}
                      />
                    </div>
                    <p className="text-sm text-paragraph font-medium text-center break-words leading-tight">
                      {category.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardHeader> */}
    </Card>
  );
}

export default HistoryResultAnalyze;