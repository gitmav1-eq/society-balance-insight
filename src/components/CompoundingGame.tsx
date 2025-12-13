import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, RotateCcw, TrendingUp, TrendingDown } from "lucide-react";
import gsap from "gsap";

interface Decision {
  year: number;
  choice: "convenience" | "discipline";
  description: string;
}

interface Scenario {
  year: number;
  situation: string;
  optionA: { label: string; type: "convenience" };
  optionB: { label: string; type: "discipline" };
}

const scenarios: Scenario[] = [
  {
    year: 1,
    situation: "Your first salary. ₹50,000/month. A new phone launches.",
    optionA: { label: "Upgrade on EMI", type: "convenience" },
    optionB: { label: "Keep current phone, save ₹5K/month", type: "discipline" },
  },
  {
    year: 2,
    situation: "Friends are moving to a premium apartment complex.",
    optionA: { label: "Move with them, 40% of salary on rent", type: "convenience" },
    optionB: { label: "Stay modest, invest the difference", type: "discipline" },
  },
  {
    year: 3,
    situation: "You got a 20% raise. Lifestyle expectations rise.",
    optionA: { label: "Upgrade lifestyle to match income", type: "convenience" },
    optionB: { label: "Keep lifestyle, bank the raise", type: "discipline" },
  },
  {
    year: 5,
    situation: "Car loan offer approved. Zero down payment.",
    optionA: { label: "Take the car, pay over 5 years", type: "convenience" },
    optionB: { label: "Use public transport, invest EMI amount", type: "discipline" },
  },
  {
    year: 7,
    situation: "Investment opportunity vs. vacation abroad.",
    optionA: { label: "Book the international trip", type: "convenience" },
    optionB: { label: "Invest now, travel later", type: "discipline" },
  },
  {
    year: 10,
    situation: "Emergency fund or premium health insurance?",
    optionA: { label: "Skip insurance, things will be fine", type: "convenience" },
    optionB: { label: "Build emergency fund + basic coverage", type: "discipline" },
  },
];

const CompoundingGame = () => {
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const currentScenario = scenarios[currentIndex];
  const convenienceCount = decisions.filter((d) => d.choice === "convenience").length;
  const disciplineCount = decisions.filter((d) => d.choice === "discipline").length;

  useEffect(() => {
    if (gameState === "result" && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [gameState]);

  const handleChoice = (type: "convenience" | "discipline", label: string) => {
    if (!currentScenario) return;

    const newDecision: Decision = {
      year: currentScenario.year,
      choice: type,
      description: label,
    };

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        x: type === "convenience" ? -100 : 100,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setDecisions([...decisions, newDecision]);
          
          if (currentIndex < scenarios.length - 1) {
            setCurrentIndex(currentIndex + 1);
            gsap.fromTo(
              cardRef.current,
              { x: type === "convenience" ? 100 : -100, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.3 }
            );
          } else {
            setGameState("result");
          }
        },
      });
    }
  };

  const getOutcome = () => {
    const ratio = disciplineCount / scenarios.length;
    
    if (ratio >= 0.8) {
      return {
        title: "Compounding Worked For You",
        description: "Small decisions stacked. By year 10, you likely have 6-12 months of runway, minimal debt, and options most don't have.",
        color: "text-green-500",
        icon: TrendingUp,
      };
    } else if (ratio >= 0.5) {
      return {
        title: "Mixed Signals",
        description: "Some discipline, some drift. You're neither fragile nor antifragile. One unexpected event could shift everything.",
        color: "text-yellow-500",
        icon: TrendingUp,
      };
    } else {
      return {
        title: "Compounding Worked Against You",
        description: "Convenience stacked. By year 10, likely living paycheck to paycheck despite income growth. The system designed it this way.",
        color: "text-red-500",
        icon: TrendingDown,
      };
    }
  };

  const resetGame = () => {
    setGameState("intro");
    setCurrentIndex(0);
    setDecisions([]);
  };

  if (gameState === "intro") {
    return (
      <section id="compounding-game" className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Compounding Game
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            10 years. 6 decisions. No scores, only outcomes.
            <br />
            <span className="text-sm opacity-70">See how small choices stack.</span>
          </p>
          
          <Button
            onClick={() => setGameState("playing")}
            size="lg"
            className="gap-2"
          >
            Begin Simulation
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    );
  }

  if (gameState === "result") {
    const outcome = getOutcome();
    const OutcomeIcon = outcome.icon;

    return (
      <section id="compounding-game" className="py-24 px-6">
        <div ref={resultRef} className="max-w-2xl mx-auto">
          <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
            <div className="text-center mb-8">
              <OutcomeIcon className={`w-12 h-12 mx-auto mb-4 ${outcome.color}`} />
              <h3 className={`text-2xl font-bold mb-2 ${outcome.color}`}>
                {outcome.title}
              </h3>
              <p className="text-muted-foreground">
                {outcome.description}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-2">
                Your Timeline
              </div>
              {decisions.map((decision, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 text-sm ${
                    decision.choice === "discipline" ? "text-green-400" : "text-orange-400"
                  }`}
                >
                  <span className="font-mono text-muted-foreground w-16">
                    Year {decision.year}
                  </span>
                  <span className="flex-1">{decision.description}</span>
                </div>
              ))}
            </div>

            <div className="text-center pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                "Small decisions compound faster than effort."
              </p>
              <Button onClick={resetGame} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Play Again
              </Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="compounding-game" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 text-sm font-mono text-muted-foreground">
          <span>YEAR {currentScenario?.year || 1}</span>
          <span>{currentIndex + 1} / {scenarios.length}</span>
        </div>

        <Card ref={cardRef} className="p-8 bg-card/50 backdrop-blur border-border/50">
          <p className="text-lg mb-8 leading-relaxed">
            {currentScenario?.situation}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Button
              variant="outline"
              className="h-auto py-4 px-6 text-left justify-start hover:border-orange-500/50 hover:bg-orange-500/5 transition-all"
              onClick={() => handleChoice("convenience", currentScenario?.optionA.label || "")}
            >
              <div>
                <div className="text-xs font-mono text-orange-400 mb-1">CONVENIENCE</div>
                <div className="text-sm">{currentScenario?.optionA.label}</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 px-6 text-left justify-start hover:border-green-500/50 hover:bg-green-500/5 transition-all"
              onClick={() => handleChoice("discipline", currentScenario?.optionB.label || "")}
            >
              <div>
                <div className="text-xs font-mono text-green-400 mb-1">DISCIPLINE</div>
                <div className="text-sm">{currentScenario?.optionB.label}</div>
              </div>
            </Button>
          </div>
        </Card>

        <div className="mt-6 flex justify-center gap-1">
          {scenarios.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < currentIndex
                  ? decisions[i]?.choice === "discipline"
                    ? "bg-green-500"
                    : "bg-orange-500"
                  : i === currentIndex
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompoundingGame;
