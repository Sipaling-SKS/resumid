import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ResultData, DataKeys } from "@/pages/Analyzer/Result";
import { Calendar1 } from "lucide-react";
import CircularProgress from "@/components/parts/CircularScore";
import { capitalize } from "@/lib/utils";

interface AnaylsisDetailProps {
  data: ResultData
}

function AnalysisDetail({ data }: AnaylsisDetailProps) {
  const dataKeys: DataKeys[] = ["strengths", "weakness", "gaps", "suggestions"];

  function checkDefaultValue(data: ResultData, keys: DataKeys[]) {
    for (const key of keys) {
      if (data[key] !== null && data[key] !== undefined && data[key].length > 0) {
        return [key];
      }
    }
    return [];
  }
  

  return (
    <Card>
      <CardHeader className="flex flex-row gap-2 w-full justify-between">
        <section>
          <CardTitle className="font-outfit text-2xl text-heading">
            {data.filename}
          </CardTitle>
          <CardDescription className="space-y-3">
            <p className="font-inter font-semibold text-primary-500 text-lg">
              {data.jobTitle}
            </p>
            <div className="inline-flex items-center w-fit gap-2 border border-accent-500 py-2 px-3 rounded-lg text-[#333] font-medium font-inter text-sm bg-accent-950">
              <Calendar1 className="text-accent-500 flex-shrink-0" size={18} />
              Analyzed on 16 December 2024 - 6:28 PM
            </div>
          </CardDescription>
        </section>
        <div className="">
          <CircularProgress value={data.score} />
        </div>
      </CardHeader>
      <hr className="h-[1px] w-full bg-neutral-200" />
      <CardContent className="space-y-6">
        {data?.summary && (
          <section className="font-inter text-paragraph space-y-1">
            <h3 className="font-semibold">Summary</h3>
            <p className="text-sm">{data?.summary}</p>
          </section>
        )}
        <Accordion className="border-t border-neutral-200" type="multiple" defaultValue={checkDefaultValue(data, dataKeys)}>
          {dataKeys.map((key: DataKeys, index: number) => {
            if (data[key] && data[key].length > 0) {
              return (
                <AccordionItem key={index} value={key} >
                  <AccordionTrigger className="font-semibold">{capitalize(key)}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-sm list-disc pl-5 pr-1 max-h-64 overflow-y-scroll scrollbar">
                      {data[key].map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )
            }
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}

export default AnalysisDetail;