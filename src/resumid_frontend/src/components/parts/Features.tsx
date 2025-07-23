import { Card, CardContent, CardHeader, CardTitle, CardDescription, NoticeCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Gambar1 from "@/assets/gambar1.svg";
import Gambar2 from "@/assets/gambar2.svg";
import Gambar3 from "@/assets/gambar3.svg";
import { BadgeInfo } from "lucide-react";
import { useNavigate } from "react-router";

type Feature = {
  title: string;
  description: string;
  imageUrl: string;
  buttonText?: string;
  href?: string;
};

interface FeatureCardProps extends Feature {
  className?: string;
}

function FeatureCard({
  title,
  description,
  imageUrl,
  buttonText,
  href,
  className,
}: FeatureCardProps) {
  const navigate = useNavigate();

  const handlePress = () => {
    if (href) navigate(href)
  };

  return (
    <Card className={cn("flex flex-col items-center p-6 space-y-6 bg-white", className)}>
      <img src={imageUrl} alt={title} className="w-auto h-32 object-contain" />
      <CardHeader className="space-y-4">
        <CardTitle className="font-outfit font-semibold text-heading">{title}</CardTitle>
        <CardDescription className="font-inter text-md text-paragraph mt-4">{description}</CardDescription>
      </CardHeader>
      <CardContent className="">
        {buttonText ? (
          <section className="flex justify-start w-full">
            <Button onClick={handlePress} className="" size="lg">
              {buttonText}
            </Button>
          </section>
        ) : (
          <div className="inline-flex items-center w-full gap-2 border border-accent-500 p-4 rounded-lg text-[#333] font-medium font-inter text-sm bg-accent-950">
            <BadgeInfo className="text-accent-500 flex-shrink-0" size={18} />
            Easy-to-understand progress reports for skill enhancement.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Features() {
  const featureList: Feature[] = [
    {
      title: "AI-Powered Resume Analyzer",
      description: "Upload your resume and receive tailored insights to boost your chances in your specific field.",
      imageUrl: Gambar1,
      buttonText: "Submit Resume",
      href: "/resume-analyzer",
    },
    {
      title: "Track Your Growth Over Time",
      description: "View your past resume analysis to measure progress and refine your resumes with confidence.",
      imageUrl: Gambar2,
    },
    {
      title: "Unlock Deeper Insights",
      description: "Go beyond the basics with premium unlimited analysis, detailed reports, and job specific recommendations — all at affordable pricing.",
      imageUrl: Gambar3,
      buttonText: "View Pricing",
    },
  ];

  return (
    <section id="features" className="responsive-container py-16 border-b border-neutral-200">
      <h2 className="text-balance font-outfit text-heading text-3xl md:text-4xl text-center md:text-left font-semibold md:mb-2">
        Why Choose Resumid
      </h2>
      <p className="font-inter text-[18px] text-paragraph mt-4 mb-8 md:mb-12 text-center md:text-left">
        Discover the powerful features that make Resumid the smarter choice for job seekers and professionals alike.
      </p>

      <div className="mx-auto max-w-lg lg:max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {featureList.map((feature, index) => (
          <FeatureCard
            className="h-fit"
            key={index}
            title={feature.title}
            description={feature.description}
            imageUrl={feature.imageUrl}
            buttonText={feature.buttonText}
            href={feature.href}
          />
        ))}
      </div>
    </section>
  );
}

export default Features;
