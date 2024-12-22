import { Card, CardContent, CardHeader, CardTitle, CardDescription, NoticeCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Gambar1 from "@/assets/gambar1.svg";
import Gambar2 from "@/assets/gambar2.svg";
import Gambar3 from "@/assets/gambar3.svg";
import { BadgeInfo } from "lucide-react";

type Feature = {
  title: string;
  description: string;
  imageUrl: string;
  buttonText?: string; 
  href: string;
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
  const handlePress = () => {
    // router.push(href); // Navigasi ke halaman yang ditentukan jgn lupa ing
  };

  return (
    <Card className={cn("flex flex-col items-center p-6 space-y-6 bg-white lg:mt-10 lg:mb-10 mt-2 mb-2", className)}>
      <img src={imageUrl} alt={title} className="w-auto h-32 object-contain" />
      <CardHeader className="space-y-4">
        <CardTitle className="font-outfit font-semibold text-heading">{title}</CardTitle>
        <CardDescription className="font-inter text-md text-paragraph mt-4">{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {buttonText ? (
          <section className="flex justify-start w-full">
            <Button onClick={handlePress} className="" size="lg">
              {buttonText}
            </Button>
          </section> 
        ) : (
          <NoticeCard className="p-4 max-w-lg rounded-lg shadow-md text-left">
            <CardDescription 
              className="font-inter  text-sm flex items-center"
            > 
              <BadgeInfo className="scale-150 bg-purple-100 w-6 h-6 rounded-full"/>
              <span className="pl-3 text-heading">Easy-to-understand progress reports for skill enhancement.</span>
            </CardDescription>
          </NoticeCard>

        )}
      </CardContent>
    </Card>
  );
}

function Features() {
  const featureList: Feature[] = [
    {
      title: "AI-Powered Resume Analyzer",
      description: "Get instant insights and recommendations tailored to your job field.",
      imageUrl: Gambar1,
      buttonText: "Submit Resume",
      href: "/analyze",
    },
    {
      title: "Track Your Progress",
      description: "Access your analysis history to track improvements over time.",
      imageUrl: Gambar2,
      href: "/history", //belum tau mau nampilin apa
    },
    {
      title: "Affordable Premium Insights",
      description: "Unlock detailed reports and additional features with our flexible paywall system.",
      imageUrl: Gambar3,
      buttonText: "Pricing",
      href: "/pricing",
    },
  ];

  return (
    <section id="features" className="responsive-container py-16 border-b border-neutral-200">
      <h2 className="text-balance font-outfit text-heading text-4xl text-left font-semibold md:mb-2">
        Why Resumid is the Best Resume Analyzer Platform to Date
      </h2>
      <p className="font-inter text-[18px] text-paragraph mt-4 mb-4 md:mb-8 text-center md:text-left">
        Here are key features to help you decide using our product:
      </p>
      <div className="mx-auto max-w-lg lg:max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {featureList.map((feature, index) => (
          <FeatureCard
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
