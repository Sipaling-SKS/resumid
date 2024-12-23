import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Calendar1 } from "lucide-react";

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
    <div className="flex flex-col gap-4 md:gap-6">
      {cardData.map((data, index) => (
        <Card
          key={index}
          className={`space-y-4 md:space-y-5 p-6 md:p-8 cursor-pointer hover:outline hover:outline-2 hover:outline-primary-500 ${
            selectedCard === index ? "outline outline-2 outline-primary-500" : "border border-neutral-300"
          }`}
          onClick={() => handleCardClick(index)}
        >
          <CardHeader className="">
            <div className="inline-flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <CardTitle className="font-outfit font-semibold text-heading text-lg">
                    {data.title}
                  </CardTitle>
                  <CardDescription className="font-inter text-sm font-semibold text-white text-left bg-primary-500 w-fit px-3 py-2 rounded-md mt-1">
                    {data.role}
                  </CardDescription>
                </div>

              <div className="font-inter text-primary-500 text-sm font-semibold leading-tight self-start pt-1 text-right">
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
          <div className="mt-3 inline-flex items-center w-full gap-2 border border-accent-500 py-2 px-3 rounded-lg text-[#333] font-medium font-inter text-sm bg-accent-950">
          <Calendar1 className="text-accent-500 flex-shrink-0" size={18} />
            Analyzed on {data.date}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default Summary;
