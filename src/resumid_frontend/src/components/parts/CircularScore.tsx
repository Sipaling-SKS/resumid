import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const easeInOutCubic = (t: number): number => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

interface CircularProgressProps {
  value: number;
  duration?: number;
  className?: string;
  showScoreText?: boolean;
}

function CircularProgress({ 
  value, 
  duration = 1000, 
  className,
  showScoreText = true 
}: CircularProgressProps) {
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      const currentScore = easedProgress * value;      
      
      setAnimatedScore(currentScore);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  return (
    <div className={cn(
      "relative flex flex-col justify-center items-center font-semibold font-outfit h-20 lg:h-28 aspect-square",
      className
    )}>
      {showScoreText && (
        <h3 className="text-paragraph leading-none" style={{ fontSize: 'clamp(0.75rem, 6vw, 1rem)' }}>Score</h3>
      )}
      <p className="text-primary-500 leading-none" style={{ fontSize: 'clamp(1rem, 6vw, 1.75rem)' }}>
        {Math.floor(animatedScore)}
        <span className="font-bold" style={{ fontSize: 'clamp(0.625rem, 5vw, 1.25rem)' }}>%</span>
      </p>
      <svg className="absolute top-0 left-0 w-full h-full text-primary-500" viewBox="0 0 36 36">
        <path
          fill="none"
          stroke="#F0F5FF"
          strokeWidth="3.8"
          d="M18 2.0845
       a 15.9155 15.9155 0 1 1 -0.00001 0"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="3.8"
          strokeLinecap="round"
          d="M18 2.0845
          a 15.9155 15.9155 0 1 1 -0.00001 0"
          strokeDasharray={`${animatedScore}, 100`}
        />
      </svg>
    </div>
  )
}

export default CircularProgress