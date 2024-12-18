import { cn, shorten } from "@/lib/utils";
import { useState } from "react"

interface ParagraphExtendableProps { className?: string, text: string, length?: number }

function ParagraphExtendable({ className, text, length = 250 }: ParagraphExtendableProps) {
  const [isExtend, setExtend] = useState<boolean>(false);

  return (
    <p className={cn("text-paragraph text-sm", className)}>
      {isExtend ? text : shorten(text, length)}
      {text.length > length && (
        <>
          <br />
          <span onClick={() => setExtend(!isExtend)} className="text-primary-500 font-medium cursor-pointer">{`Read ${isExtend ? "less" : "more"}`}</span>
        </>
      )}
    </p>
  )
}

export default ParagraphExtendable;