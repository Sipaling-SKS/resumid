import { useEffect, useRef, useState } from "react";
import Highlight from "@/components/highlight";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ChevronsDown } from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";

const videoList = ["/videos/1.webm", "/videos/2.webm", "/videos/3.webm", "/videos/4.webm"];
const glowMobile = "drop-shadow-[0_0_96px_rgba(255,255,255,0.9)]";

function Hero() {
  const navigate = useNavigate();
  const videoRefA = useRef<HTMLVideoElement>(null);
  const videoRefB = useRef<HTMLVideoElement>(null);
  const [videoIndex, setVideoIndex] = useState(0);
  const [isAActive, setIsAActive] = useState(true);

  const getNextIndex = (index: number) => (index + 1) % videoList.length;

  useEffect(() => {
    const activeVideo = isAActive ? videoRefA.current : videoRefB.current;
    if (!activeVideo) return;

    const handleEnded = () => {
      const nextIndex = getNextIndex(videoIndex);
      const nextVideo = isAActive ? videoRefB.current : videoRefA.current;

      if (nextVideo) {
        nextVideo.src = videoList[nextIndex];
        nextVideo.load();
        nextVideo.play().catch(() => { });
      }

      setTimeout(() => {
        setVideoIndex(nextIndex);
        setIsAActive(!isAActive);
      }, 100); // small delay to allow preloading before switching
    };

    activeVideo.addEventListener("ended", handleEnded);
    return () => activeVideo.removeEventListener("ended", handleEnded);
  }, [videoIndex, isAActive]);

  useEffect(() => {
    const activeVideo = isAActive ? videoRefA.current : videoRefB.current;
    if (activeVideo) {
      activeVideo.src = videoList[videoIndex];
      activeVideo.load();
      activeVideo.play().catch(() => { });
    }
  }, [videoIndex, isAActive]);

  return (
    <header className="relative w-full h-[calc(100vh-73px)] md:h-[72vh] overflow-hidden border-b border-neutral-200 will-change-transform" style={{ transform: "translateZ(0)" }}>
      <video
        ref={videoRefA}
        className={cn(
          "absolute w-[110%] h-[110%] object-cover bg-white blur-sm transition-opacity duration-500",
          isAActive ? "opacity-100" : "opacity-0"
        )}
        autoPlay
        muted
        playsInline
        loop={false}
        preload="auto"
      />

      <video
        ref={videoRefB}
        className={cn(
          "absolute w-[110%] h-[110%] object-cover bg-white blur-sm transition-opacity duration-500",
          !isAActive ? "opacity-100" : "opacity-0"
        )}
        autoPlay
        muted
        playsInline
        loop={false}
        preload="auto"
      />

      {/* Gradient Tint Overlay (left to right) */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-800/70 to-accent-800/70 z-10 md:block hidden" />

      {/* Top White Gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 from-45% to-white/20 to-90% z-20 md:block hidden" />
      <div className="absolute inset-0 bg-white/80 z-20 md:hidden block" />

      {/* Content */}
      <div className="relative z-30 responsive-container flex flex-col md:flex-row justify-center md:justify-between items-center md:py-16 h-full">
        <div className="w-full md:w-3/5 pb-[12vh] md:pb-0">
          <h1 className={cn(
            "font-outfit font-semibold text-4xl md:text-[40px] text-balance leading-tight text-heading",
            "md:drop-shadow-none drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          )}>
            Unleash Your Resume’s Potential with <Highlight>AI-Powered</Highlight> Analysis
          </h1>

          <p className={cn(
            "w-4/5 font-inter text-[18px] text-paragraph mt-4",
            "md:drop-shadow-none drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]"
          )}>
            Decentralized, Insightful, and Ready to Elevate Your Career.
          </p>

          <Button
            onClick={() => navigate("/resume-analyzer")}
            className={cn(
              "mt-10 pr-5 w-full sm:w-fit",
              "md:drop-shadow-none drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]"
            )}
            variant="gradient"
            size="lg"
          >
            Analyze Your Resume
            <ArrowRightIcon />
          </Button>

        </div>
        <ChevronsDown
          className={cn(
            "animate-bounce absolute block md:hidden inset-x-0 bottom-24 w-full text-accent-500",
            "drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          )}
          size={32}
        />
      </div>
    </header>
  );
}

export default Hero;
