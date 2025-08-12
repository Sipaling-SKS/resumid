import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  className?: string;
  onSearch?: (query: string) => void;
  placeholderHints?: string[];
};

const DEFAULT_HINTS = [
  "Search for Awesome People",
  "There are many talented people to search",
  "Try: Frontend React Engineer",
  "Find: Mobile Enginner",
];

export default function SearchBar({
  className,
  onSearch,
  placeholderHints,
}: SearchBarProps) {
  const hints = useMemo(
    () => (placeholderHints && placeholderHints.length > 0 ? placeholderHints : DEFAULT_HINTS),
    [placeholderHints]
  );

  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = isFocused || value.length > 0;
  const hasValue = value.length > 0;

  useEffect(() => {
    if (!isActive) {
      intervalRef.current = window.setInterval(() => {
        setHintIndex((prev) => (prev + 1) % hints.length);
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, hints.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value.trim());
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const clear = () => {
    setValue("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      className={cn(
        "w-full",
        className
      )}
    >
      <form
        onSubmit={handleSubmit}
        className={cn(
          "group w-full h-10 sm:h-11 rounded-lg border-2 bg-white",
          hasValue ? "border-primary-500" : "border-neutral-300 focus-within:border-primary-500",
          "transition-colors inline-flex items-center cursor-text"
        )}
        onClick={handleContainerClick}
      >
        {!hasValue && (
         <button
            type="button"
            className="inline-flex items-center justify-center ml-3 text-neutral-500 hover:text-neutral-700 transition-colors flex-shrink-0"
            aria-label="Search"
            title="Search"
            onClick={(e) => {
              e.preventDefault();
              handleContainerClick();
            }}
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        <div className="flex-1 relative  min-w-0 mx-3">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type to search..."
            className={cn(
              "w-full bg-transparent outline-none text-sm text-paragraph font-inter placeholder:text-placeholder",
              !isActive && "opacity-0 pointer-events-none absolute inset-0"
            )}
            aria-label="Search"
          />
          
          {!isActive && (
            <div className="relative h-5 sm:h-6 flex items-center overflow-hidden">
              {hints.map((hint, i) => (
                <div
                  key={`${hint}-${i}`}
                  className={cn(
                    "absolute inset-0 flex items-center text-sm text-placeholder font-inter transition-opacity duration-850",
                    "truncate",
                    i === hintIndex ? "opacity-100" : "opacity-0"
                  )}
                >
                  {hint}
                </div>
              ))}
            </div>
          )}
        </div>

        {hasValue && (
          <div className="inline-flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clear();
              }}
              className="inline-flex items-center justify-center rounded-tr-md rounded-br-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              aria-label="Clear search"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
            
            <button
              type="submit"
              className="inline-flex items-center justify-center w-9 h-10 sm:h-11 rounded-md bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              aria-label="Search"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
}