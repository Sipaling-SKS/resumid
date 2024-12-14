import Highlight from "@/components/highlight";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ChevronsDown } from "lucide-react";
import HeroIllustration from "@/assets/hero-illustration.svg";

function Hero() {
  return (
    <header className="relative responsive-container overflow-clip flex flex-col md:flex-row justify-center md:justify-between items-center md:py-16 border-b border-neutral-200 min-h-[calc(100vh-73px)] md:min-h-[70vh]">
      <div className="w-full md:w-3/5 pb-[12vh] md:pb-0">
        <h1 className="font-outfit font-semibold text-4xl md:text-[40px] text-balance leading-tight text-heading">
          Unleash Your Resume’s Potential with <Highlight>AI-Powered</Highlight> Analysis
        </h1>
        <p className="w-4/5 font-inter text-[18px] text-paragraph mt-4">Decentralized, Insightful, and Ready to Elevate Your Career.</p>
        <Button className="mt-10 pr-5 w-full sm:w-fit" variant="gradient" size="lg">
          Analyze Your Resume
        <ArrowRightIcon />
        </Button>
      </div>
      <div className="absolute md:relative -z-10 opacity-30 blur-[2px] md:blur-none bottom-24 md:bottom-0 -right-24 md:right-0 md:opacity-100 max-w-md md:max-w-xl w-full md:w-2/5 -mb-8 -mr-[2%] ml-8">
        <img src={HeroIllustration} alt="Resume Analysis Illustration" />
      </div>
      <ChevronsDown className="animate-bounce absolute block md:hidden inset-x-0 bottom-24 w-full text-accent-500" size={32} />
    </header>
  )
}

export default Hero;