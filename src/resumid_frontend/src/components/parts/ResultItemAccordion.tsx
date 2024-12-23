import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { capitalize } from "@/lib/utils";

function ResultItemAccordion({ title, data }: { title: string, data: string[] | null }) {
  return (
    <>
      {data && data.length > 0 && (
        <Card className="p-0 font-inter text-paragraph">
          <AccordionItem className="border-0" value={title}>
            <CardHeader>
              <AccordionTrigger className="px-8 py-6 font-semibold">{capitalize(title)}</AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent className="px-8 pb-4">
                <ul className="text-sm list-disc pl-4 pr-1 max-h-64 overflow-y-scroll scrollbar">
                  {data.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Card>
      )}
    </>
  )
}

export default ResultItemAccordion