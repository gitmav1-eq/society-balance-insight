import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const loadingInsights = [
  "Small choices compound faster than effort.",
  "What's normalized today shapes tomorrow's systems.",
  "10 million people doing one thing reshapes markets.",
  "Debt moves faster than savings ever will.",
  "The future isn't predicted—it's practiced daily.",
  "Individual comfort can become collective pressure.",
  "Patterns don't ask permission to scale.",
];

const loadingPhases = [
  { label: "Analyzing behavior pattern", duration: 1500 },
  { label: "Modeling individual impact", duration: 2000 },
  { label: "Scaling across populations", duration: 2500 },
  { label: "Identifying pressure points", duration: 1500 },
];

const SimulatorSkeleton = () => {
  const [insightIndex, setInsightIndex] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Rotate insights
  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % loadingInsights.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Progress through phases
  useEffect(() => {
    const phaseTimer = setInterval(() => {
      setPhaseIndex((prev) => {
        if (prev < loadingPhases.length - 1) return prev + 1;
        return prev;
      });
    }, 2000);
    return () => clearInterval(phaseTimer);
  }, []);

  // Smooth progress bar
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) return prev + Math.random() * 3;
        return prev;
      });
    }, 200);
    return () => clearInterval(progressTimer);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Processing status */}
      <div className="p-5 bg-primary/5 border border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-[9px] tracking-widest text-primary/70">PROCESSING</p>
          <span className="text-[10px] text-muted-foreground/50">{Math.round(progress)}%</span>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-border/30 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-primary/60 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Current phase */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <p className="text-sm text-foreground/80">{loadingPhases[phaseIndex].label}...</p>
        </div>
      </div>

      {/* Skeleton cards with subtle pulse */}
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className={`p-6 border border-border/30 bg-card/20 transition-opacity duration-500 ${
              i <= phaseIndex + 1 ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${
                i === 1 ? 'bg-blue-500' : 
                i === 2 ? 'bg-purple-500' : 
                i === 3 ? 'bg-orange-500' : 'bg-primary'
              } ${i <= phaseIndex + 1 ? 'animate-pulse' : ''}`} />
              <Skeleton className="h-2 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </div>
          </div>
        ))}
      </div>

      {/* Rotating insight */}
      <div className="text-center pt-4 border-t border-border/20">
        <p className="font-mono text-[8px] tracking-widest text-muted-foreground/40 mb-2">
          DID YOU KNOW?
        </p>
        <p 
          key={insightIndex}
          className="text-sm text-muted-foreground/60 italic animate-fade-in"
        >
          "{loadingInsights[insightIndex]}"
        </p>
      </div>
    </div>
  );
};

export default SimulatorSkeleton;
