import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Choice {
  label: string;
  effect: number;
}

interface Round {
  question: string;
  choiceA: Choice;
  choiceB: Choice;
}

const rounds: Round[] = [
  {
    question: "A windfall arrives unexpectedly. You...",
    choiceA: { label: "Save most of it", effect: 15 },
    choiceB: { label: "Spend it now", effect: -10 },
  },
  {
    question: "A new subscription seems useful. You...",
    choiceA: { label: "Wait and evaluate", effect: 10 },
    choiceB: { label: "Sign up immediately", effect: -5 },
  },
  {
    question: "Income increases. Lifestyle...",
    choiceA: { label: "Stays mostly the same", effect: 20 },
    choiceB: { label: "Expands to match", effect: -15 },
  },
];

const StabilityBuilder = () => {
  const [currentRound, setCurrentRound] = useState(0);
  const [stability, setStability] = useState(50);
  const [isComplete, setIsComplete] = useState(false);

  const handleChoice = (effect: number) => {
    const newStability = Math.max(0, Math.min(100, stability + effect));
    setStability(newStability);

    if (currentRound < rounds.length - 1) {
      setCurrentRound(currentRound + 1);
    } else {
      setIsComplete(true);
    }
  };

  const reset = () => {
    setCurrentRound(0);
    setStability(50);
    setIsComplete(false);
  };

  const getOrbitState = () => {
    if (stability >= 65) return { label: "Orbit stable", color: "text-green-400/80", ringColor: "border-green-400/30" };
    if (stability >= 40) return { label: "Orbit drifting", color: "text-yellow-400/80", ringColor: "border-yellow-400/30" };
    return { label: "Orbit unstable", color: "text-red-400/80", ringColor: "border-red-400/30" };
  };

  const orbitState = getOrbitState();

  return (
    <div className="p-6 border border-border/20 bg-card/10 rounded-sm">
      <p className="font-mono text-[9px] tracking-[0.4em] text-muted-foreground/50 mb-4">
        STABILITY BUILDER
      </p>

      {/* Visual orbit indicator */}
      <div className="flex justify-center mb-6">
        <div className={`w-20 h-20 rounded-full border-2 ${orbitState.ringColor} flex items-center justify-center transition-all duration-700`}>
          <div 
            className="w-3 h-3 bg-foreground/60 rounded-full transition-all duration-500"
            style={{ 
              transform: `translate(${(50 - stability) * 0.3}px, ${(50 - stability) * 0.2}px)` 
            }}
          />
        </div>
      </div>

      {!isComplete ? (
        <>
          <p className="text-sm mb-5 leading-relaxed text-center">
            {rounds[currentRound].question}
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleChoice(rounds[currentRound].choiceA.effect)}
              className="p-3 text-xs border border-border/20 hover:border-border/40 hover:bg-card/20 transition-all duration-300 rounded-sm"
            >
              {rounds[currentRound].choiceA.label}
            </button>
            <button
              onClick={() => handleChoice(rounds[currentRound].choiceB.effect)}
              className="p-3 text-xs border border-border/20 hover:border-border/40 hover:bg-card/20 transition-all duration-300 rounded-sm"
            >
              {rounds[currentRound].choiceB.label}
            </button>
          </div>

          <p className="text-[10px] text-muted-foreground/40 text-center mt-4">
            {currentRound + 1} of {rounds.length}
          </p>
        </>
      ) : (
        <div className="text-center animate-fade-in">
          <p className={`text-sm font-medium mb-2 ${orbitState.color}`}>
            {orbitState.label}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Small choices shaped the trajectory. This is how systems work.
          </p>
          <Button variant="ghost" size="sm" onClick={reset} className="text-xs">
            Try again
          </Button>
        </div>
      )}
    </div>
  );
};

export default StabilityBuilder;