import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export default function ExpandableHtml({ html, clamp = 3 }: { html: string; clamp?: number }) {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && !expanded) {
      const needsClamp = ref.current.scrollHeight > ref.current.clientHeight;
      setShowButton(needsClamp);
    }
  }, [html, expanded]);

  return (
    <div>
      <div
        ref={ref}
        className={cn(
          "pt-[6px] prose prose-sm max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:my-0 [&_ol]:my-0 [&_p]:text-paragraph [&_p]:my-0",
          !expanded && `line-clamp-${clamp}`,
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {showButton && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 text-sm font-medium mt-2 hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
