import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const easeInOutCubic = (t: number): number => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Color scheme function that returns color based on score
const getScoreColor = (score: number): { color: string; textColor: string } => {
  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score));
  
  if (clampedScore >= 85) {
    // Excellent: Original Blue
    return { color: '#3B82F6', textColor: '#3B82F6' }; // blue-500
  } else if (clampedScore >= 70) {
    // Good: Green
    return { color: '#10B981', textColor: '#10B981' }; // emerald-500
  } else if (clampedScore >= 50) {
    // Average: Yellow
    return { color: '#EAB308', textColor: '#EAB308' }; // yellow-500
  } else {
    // Poor: Red
    return { color: '#EF4444', textColor: '#EF4444' }; // red-500
  }
};

// Background color for the track (lighter version of the main color)
const getTrackColor = (score: number): string => {
  const clampedScore = Math.max(0, Math.min(100, score));
  
  if (clampedScore >= 85) {
    return '#DBEAFE'; // blue-100
  } else if (clampedScore >= 70) {
    return '#D1FAE5'; // emerald-100
  } else if (clampedScore >= 50) {
    return '#FEF3C7'; // yellow-100
  } else {
    return '#FEE2E2'; // red-100
  }
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
  const [currentColors, setCurrentColors] = useState(getScoreColor(0));
  const [currentTrackColor, setCurrentTrackColor] = useState(getTrackColor(0));

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      const currentScore = easedProgress * value;      
      
      setAnimatedScore(currentScore);
      
      // Update colors based on current animated score
      setCurrentColors(getScoreColor(currentScore));
      setCurrentTrackColor(getTrackColor(currentScore));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return (
    <div className={cn(
      "relative flex flex-col justify-center items-center font-semibold font-outfit h-20 lg:h-28 aspect-square",
      className
    )}>
      {showScoreText && (
        <h3 className="text-paragraph leading-none" style={{ fontSize: 'clamp(0.75rem, 6vw, 1rem)' }}>Score</h3>
      )}
      <p className="leading-none" style={{ fontSize: 'clamp(1rem, 6vw, 1.75rem)', color: currentColors.textColor }}>
        {Math.floor(animatedScore)}
        <span className="font-bold" style={{ fontSize: 'clamp(0.625rem, 5vw, 1.25rem)' }}>%</span>
      </p>
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
        {/* Background track */}
        <path
          fill="none"
          stroke={currentTrackColor}
          strokeWidth="3.8"
          d="M18 2.0845
       a 15.9155 15.9155 0 1 1 -0.00001 0"
        />
        {/* Progress arc */}
        <path
          fill="none"
          stroke={currentColors.color}
          strokeWidth="3.8"
          strokeLinecap="round"
          d="M18 2.0845
          a 15.9155 15.9155 0 1 1 -0.00001 0"
          strokeDasharray={`${animatedScore}, 100`}
          style={{
            filter: `drop-shadow(0 0 6px ${currentColors.color}40)`, // Add subtle glow effect
            transition: 'stroke 0.3s ease-in-out'
          }}
        />
      </svg>
    </div>
  )
}

export default CircularProgress