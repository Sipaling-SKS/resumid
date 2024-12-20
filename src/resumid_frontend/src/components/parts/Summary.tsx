import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { BadgeInfo } from "lucide-react";

interface SummaryProps {
  score: number;
}

function Summary({ score }: SummaryProps) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const handleCardClick = (cardIndex: number) => {
    setSelectedCard(cardIndex);
  };

  const cardData = [
    { title: "Muhammad Fadil Hisyam CV 2025.pdf", role: "Software Engineer", date: "16 December 2024", time: "6:28 PM", score: 79 },
    { title: "Muhammad Fadil Hisyam CV 2024.pdf", role: "Web Developer", date: "10 November 2024", time: "3:12 PM", score: 85 },
    { title: "Muhammad Fadil Hisyam CV 2023.pdf", role: "Mobile Developer", date: "5 October 2024", time: "4:45 PM", score: 90 },
    { title: "Muhammad Fadil Hisyam CV 2022.pdf", role: "Backend Engineer", date: "22 September 2024", time: "8:15 AM", score: 88 },
  ];

  return (
    <div className="flex flex-col gap-4">
      {cardData.map((data, index) => (
        <Card
          key={index}
          className={`space-y-3 md:space-y-6 p-4 md:p-6 cursor-pointer ${
            selectedCard === index ? "border-2 border-blue-500" : "border border-neutral-300"
          }`}
          onClick={() => handleCardClick(index)}
        >
          <CardHeader className="">
            <div className="inline-flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <CardTitle className="font-outfit font-semibold text-heading text-lg">
                    {data.title} {/* Full file name in CardTitle */}
                  </CardTitle>
                  <CardDescription className="font-inter text-xs font-semibold text-white text-left bg-primary-500 w-fit px-3 py-1 rounded-md mt-1">
                    {data.role}
                    </CardDescription>
                </div>

              <div className="text-primary-500 text-sm leading-tight self-start pt-2 text-right">
                  {/* Score displayed next to the name with leading-tight */}
                  Score: {data.score}/100
                </div>

            </div>
          </CardHeader>
          <CardContent className="text-paragraph font-inter">
            <p className="w-full text-sm">
              The resume highlights diverse technical expertise, leadership, and mentoring skills, with achievements{" "}
              <span className="text-primary-500 text-nowrap cursor-pointer">{`read more...`}</span>
            </p>
          </CardContent>
          <hr className="h-[1px] w-full bg-neutral-200" />
          <div className="mt-3 inline-flex items-center w-full gap-1 border border-accent-500 p-2 pr-3 rounded-lg text-[#333] font-medium font-inter text-[11px] bg-accent-950">
            <BadgeInfo className="text-accent-500" size={18} />
            Analyzed on {data.date} - {data.time}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default Summary;
