import { Card, CardContent, CardHeader, CardTitle, CardDescription, NoticeCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Gambar1 from "@/assets/gambar1.svg";
import Gambar2 from "@/assets/gambar2.svg";
import Gambar3 from "@/assets/gambar3.svg";

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
    <Card className={cn("flex flex-col items-center p-6 space-y-6 bg-white rounded-lg shadow-md", className)}>
      <img src={imageUrl} alt={title} className="w-auto h-32 object-contain" />
      <CardHeader className="space-y-4">
        <CardTitle className="font-outfit font-semibold text-heading">{title}</CardTitle>
        <CardDescription className="text-neutral-600 mt-4">{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {buttonText ? (
          <section className="flex justify-start w-full">
            <Button onClick={handlePress} variant="blue" className="w-fit text-sm" size="lg">
              {buttonText}
            </Button>
          </section>
        ) : (
          <NoticeCard>
            <CardDescription className="text-neutral-600 text-xs text-left">
              Easy-to-understand progress reports for skill enhancement.
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
    <section className="responsive-container py-16">
      <h2 className="text-balance font-outfit text-heading text-4xl text-left font-semibold md:mb-2">
        Why Resumid is the Best Resume Analyzer Platform to Date
      </h2>
      <p className="font-inter text-[18px] text-paragraph mt-4 md:mb-8">
        Here are key features to help you decide using our product:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
