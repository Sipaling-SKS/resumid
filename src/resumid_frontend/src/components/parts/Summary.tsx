import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import CircularProgress from "@/components/parts/CircularScore";
import { BadgeInfo } from "lucide-react";

interface SummaryProps {
  score: number
}

function Summary({ score }: SummaryProps) {
  const [isExtend, setExtend] = useState(false);

  return (
    <Card className="space-y-5 md:space-y-6 p-6 md:p-8">
      <CardHeader className="space-y-1">
        <CardTitle className="font-outfit font-semibold text-heading text-xl">
          Resume Analysis Results
        </CardTitle>
        <CardDescription className="font-inter text-md text-paragraph pb-2">
          Your resume insights and recommendations at a glance.
        </CardDescription>
        <div className="mt-3 inline-flex items-center w-fit gap-1 border border-accent-500 p-2 pr-3 rounded-lg text-[#333] font-medium font-inter text-xs bg-accent-950">
          <BadgeInfo className="text-accent-500" size={18} />
          Analyzed on 16 December 2024 - 6:28 PM
        </div>
      </CardHeader>
      <hr className="h-[1px] w-full bg-neutral-200" />
      <CardContent className="flex justify-between gap-4">
        <section className="text-paragraph font-inter space-y-1">
          <h2 className="font-semibold">Summary</h2>
          <p className="w-full text-sm">
            The resume highlights diverse technical expertise, leadership, and mentoring skills, with achievements in backend, frontend, and mobile technologies. However, it lacks specificity in programming <span className="text-primary-500 text-nowrap cursor-pointer" onClick={() => setExtend(!isExtend)} >{`read ${!isExtend ? "more" : "less"}...`}</span>
          </p>
        </section>
        <div className="py-2">
          <CircularProgress value={score} />
        </div>
      </CardContent>
    </Card>
  )
}

export default Summary;