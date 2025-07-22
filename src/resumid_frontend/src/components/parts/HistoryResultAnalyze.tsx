import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import CircularProgress from "@/components/parts/CircularScore";
import { CategoryScore } from "@/pages/History/Detail/HistoryDetail";
import { useRef, useState } from "react";

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
          className={`flex gap-4 ${
            isLastRow && isIncompleteRow 
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
    <Card className="mb-6 sm:pb-0">
      <CardHeader>
        <CardTitle className="font-outfit text-xl font-semibold text-heading mb-6 sm:mx-8">
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
                    className={`text-center flex-shrink-0 w-28 ${
                      isFirst ? 'ml-8' : ''
                    } ${
                      isLast ? 'mr-9' : ''
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
      </CardHeader>
    </Card>
  );
}

export default HistoryResultAnalyze;