import { useEffect, useState } from "react";

const easeInOutCubic = (t: number): number => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

interface CircularProgressProps {
  value: number,
  duration?: number,
}

function CircularProgress({ value, duration = 1000 }: CircularProgressProps) {
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
    <div className="relative flex flex-col justify-center items-center font-semibold font-outfit h-20 lg:h-28 aspect-square">
      <h3 className="text-paragraph text-base lg:text-lg leading-none">Score</h3>
      <p className="text-primary-500 text-xl lg:text-[32px] leading-none">{Math.floor(animatedScore)}<span className="font-bold text-lg lg:text-2xl">%</span></p>
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