import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useRef, useEffect } from "react";

interface Scenario {
  id: string;
  situation: string;
  signalOption: { label: string; outcome: string };
  noiseOption: { label: string; outcome: string };
}

const scenarios: Scenario[] = [
  {
    id: "1",
    situation: "A new 'buy now, pay later' service launches. It's everywhere.",
    signalOption: {
      label: "Examine debt normalization patterns",
      outcome: "Society develops awareness of hidden costs before they compound.",
    },
    noiseOption: {
      label: "Follow the trend, it's convenient",
      outcome: "Debt becomes invisible until it's structural. Correction comes too late.",
    },
  },
  {
    id: "2",
    situation: "Housing prices rise 15% in a year. Everyone's buying.",
    signalOption: {
      label: "Question affordability sustainability",
      outcome: "Early warning allows policy adjustment. Bubble deflates slowly.",
    },
    noiseOption: {
      label: "Fear of missing out, buy now",
      outcome: "Overextension becomes normal. The correction is sudden.",
    },
  },
  {
    id: "3",
    situation: "Gig economy promises 'freedom'. Benefits disappear.",
    signalOption: {
      label: "Build portable safety nets",
      outcome: "Workers gain flexibility AND security. Innovation continues.",
    },
    noiseOption: {
      label: "Celebrate flexibility, ignore gaps",
      outcome: "A generation retires without coverage. The state inherits the cost.",
    },
  },
];

const SignalNoiseGame = () => {
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choices, setChoices] = useState<("signal" | "noise")[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentScenario = scenarios[currentIndex];
  const signalCount = choices.filter((c) => c === "signal").length;

  useEffect(() => {
    if (cardRef.current && gameState === "playing") {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4 }
      );
    }
  }, [currentIndex, gameState]);

  const handleChoice = (type: "signal" | "noise") => {
    const outcome = type === "signal" 
      ? currentScenario.signalOption.outcome 
      : currentScenario.noiseOption.outcome;

    setChoices([...choices, type]);

    if (currentIndex < scenarios.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 1500);
    } else {
      setTimeout(() => setGameState("result"), 1500);
    }
  };

  const reset = () => {
    setGameState("intro");
    setCurrentIndex(0);
    setChoices([]);
  };

  const getOutcome = () => {
    if (signalCount >= 2) {
      return {
        title: "Long-term Thinking Prevailed",
        description: "Society learned to distinguish signal from noise. Problems were addressed before they became crises.",
        color: "text-green-400",
      };
    } else {
      return {
        title: "Noise Won",
        description: "Short-term distractions overwhelmed long-term signals. Correction came suddenly instead of gradually.",
        color: "text-orange-400",
      };
    }
  };

  if (gameState === "intro") {
    return (
      <Card className="p-8 bg-card/30 backdrop-blur border-border/30">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <div className="relative">
              <div className="w-8 h-0.5 bg-primary absolute top-1/2 left-1/2 -translate-x-1/2" />
              <div className="w-0.5 h-8 bg-primary absolute top-1/2 left-1/2 -translate-y-1/2" />
              <div className="w-3 h-3 border-2 border-muted-foreground rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">SIGNAL VS NOISE</h3>
          <p className="text-muted-foreground text-sm mb-6">
            What should society focus on?
            <br />
            <span className="text-xs opacity-70">Choose signal. Ignore noise. See consequences.</span>
          </p>
          <Button onClick={() => setGameState("playing")} size="sm">
            Begin
          </Button>
        </div>
      </Card>
    );
  }

  if (gameState === "result") {
    const outcome = getOutcome();
    return (
      <Card className="p-8 bg-card/30 backdrop-blur border-border/30">
        <div className="text-center">
          <h3 className={`text-lg font-bold mb-2 ${outcome.color}`}>{outcome.title}</h3>
          <p className="text-muted-foreground text-sm mb-6">{outcome.description}</p>
          
          <div className="flex justify-center gap-2 mb-6">
            {choices.map((choice, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  choice === "signal" ? "bg-green-400" : "bg-orange-400"
                }`}
              />
            ))}
          </div>
          
          <Button onClick={reset} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  const showOutcome = choices.length > currentIndex;

  return (
    <Card ref={cardRef} className="p-8 bg-card/30 backdrop-blur border-border/30">
      <p className="text-xs font-mono text-muted-foreground mb-4 text-center">
        {currentIndex + 1} / {scenarios.length}
      </p>

      <p className="text-sm mb-6 text-center">{currentScenario.situation}</p>

      {!showOutcome ? (
        <div className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-left justify-start h-auto py-3 text-xs"
            onClick={() => handleChoice("signal")}
          >
            <span className="text-green-400 mr-2">SIGNAL:</span>
            {currentScenario.signalOption.label}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-left justify-start h-auto py-3 text-xs"
            onClick={() => handleChoice("noise")}
          >
            <span className="text-orange-400 mr-2">NOISE:</span>
            {currentScenario.noiseOption.label}
          </Button>
        </div>
      ) : (
        <div className="text-center text-sm text-muted-foreground animate-fade-in">
          {choices[currentIndex] === "signal"
            ? currentScenario.signalOption.outcome
            : currentScenario.noiseOption.outcome}
        </div>
      )}
    </Card>
  );
};

export default SignalNoiseGame;
