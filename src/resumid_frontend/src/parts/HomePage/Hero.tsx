import Highlight from "@/components/highlight";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import HeroIllustration from "@/assets/hero-illustration.svg";

function Hero() {
  return (
    <header className="responsive-container flex justify-between items-center md:py-16 border-b border-neutral-200 min-h-[70vh]">
      <div className="w-3/5">
        <h1 className="font-outfit font-semibold text-[40px] text-balance leading-tight text-heading">
          Unleash Your Resume’s Potential with <Highlight>AI-Powered</Highlight> Analysis
        </h1>
        <p className="font-inter text-[18px] text-paragraph mt-4">Decentralized, Insightful, and Ready to Elevate Your Career.</p>
        <Button className="mt-10 pr-5" variant="gradient" size="lg">
          Analyze Your Resume
        <ArrowRightIcon />
        </Button>
      </div>
      <div className="hidden md:block max-w-xl w-2/5 -mb-8 -mr-[2%] ml-8">
        <img src={HeroIllustration} alt="Resume Analysis Illustration" />
      </div>
    </header>
  )
}

export default Hero;