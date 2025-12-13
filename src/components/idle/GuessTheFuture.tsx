import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Scenario {
  behavior: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    behavior: "Buying everything on credit becomes normal",
    options: ["Future flexibility increases", "Pressure builds over time", "No significant change"],
    correctIndex: 1,
    explanation: "When credit becomes default, small debts compound. What feels manageable today becomes weight tomorrow.",
  },
  {
    behavior: "Saving money is treated as optional",
    options: ["Emergencies become crises", "Life stays the same", "More spending power now"],
    correctIndex: 0,
    explanation: "Without savings, unexpected events become emergencies. The safety net shrinks for everyone.",
  },
  {
    behavior: "Retirement planning starts at 40 instead of 25",
    options: ["Plenty of time to catch up", "Work years extend significantly", "Same outcome, less stress early"],
    correctIndex: 1,
    explanation: "Delayed planning means less time for growth. Many work longer than expected, or retire with less.",
  },
];

const GuessTheFuture = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const scenario = scenarios[currentIndex];

  const handleSelect = (index: number) => {
    setSelectedOption(index);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setCurrentIndex(0);
      setSelectedOption(null);
      setShowResult(false);
    }
  };

  return (
    <div className="p-6 border border-border/20 bg-card/10 rounded-sm">
      <p className="font-mono text-[9px] tracking-[0.4em] text-muted-foreground/50 mb-4">
        GUESS THE FUTURE
      </p>

      <p className="text-sm mb-6 leading-relaxed">
        If <span className="text-foreground">{scenario.behavior.toLowerCase()}</span>, what happens over 30 years?
      </p>

      {!showResult ? (
        <div className="space-y-2">
          {scenario.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className="w-full text-left p-3 text-sm border border-border/20 hover:border-border/40 hover:bg-card/20 transition-all duration-300 rounded-sm"
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="mb-4">
            <p className={`text-sm font-medium mb-2 ${selectedOption === scenario.correctIndex ? "text-green-400/80" : "text-yellow-400/80"}`}>
              {selectedOption === scenario.correctIndex ? "You saw it clearly." : "Not quite — here's why:"}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {scenario.explanation}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleNext} className="text-xs">
            {currentIndex < scenarios.length - 1 ? "Next scenario" : "Start over"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default GuessTheFuture;