import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface Variable {
  id: string;
  label: string;
  description: string;
  value: number;
}

const FutureDrift = () => {
  const [variables, setVariables] = useState<Variable[]>([
    { id: "savings", label: "Savings rate", description: "How much income goes to savings", value: 50 },
    { id: "credit", label: "Credit reliance", description: "How often credit is used for purchases", value: 50 },
    { id: "planning", label: "Long-term planning", description: "How far ahead people think", value: 50 },
  ]);

  const [showResult, setShowResult] = useState(false);

  const updateVariable = (id: string, newValue: number) => {
    setVariables((prev) =>
      prev.map((v) => (v.id === id ? { ...v, value: newValue } : v))
    );
  };

  const getTrajectory = () => {
    const savingsScore = variables.find((v) => v.id === "savings")?.value || 50;
    const creditScore = 100 - (variables.find((v) => v.id === "credit")?.value || 50);
    const planningScore = variables.find((v) => v.id === "planning")?.value || 50;
    
    const total = (savingsScore + creditScore + planningScore) / 3;
    
    if (total >= 60) {
      return {
        direction: "Toward stability",
        description: "Society builds collective resilience. Future generations inherit options, not burdens.",
        color: "text-green-400/80",
      };
    } else if (total >= 40) {
      return {
        direction: "Uncertain drift",
        description: "The trajectory could go either way. Small shifts now create large differences later.",
        color: "text-yellow-400/80",
      };
    } else {
      return {
        direction: "Toward fragility",
        description: "Short-term comfort accumulates into long-term strain. The cost appears slowly, then suddenly.",
        color: "text-red-400/80",
      };
    }
  };

  const trajectory = getTrajectory();

  const reset = () => {
    setVariables([
      { id: "savings", label: "Savings rate", description: "How much income goes to savings", value: 50 },
      { id: "credit", label: "Credit reliance", description: "How often credit is used for purchases", value: 50 },
      { id: "planning", label: "Long-term planning", description: "How far ahead people think", value: 50 },
    ]);
    setShowResult(false);
  };

  return (
    <section id="explore" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-[9px] tracking-[0.5em] text-muted-foreground/50 mb-4">
            FUTURE DRIFT
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Adjust the variables.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
            See how small shifts in behavior change where society drifts over time.
          </p>
        </div>

        <div className="space-y-8 mb-10">
          {variables.map((variable) => (
            <div key={variable.id} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{variable.label}</span>
                <span className="text-xs text-muted-foreground/60">{variable.value}%</span>
              </div>
              <Slider
                value={[variable.value]}
                onValueChange={(val) => updateVariable(variable.id, val[0])}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground/50">{variable.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center py-8 border-t border-border/20">
          <p className="font-mono text-[9px] tracking-widest text-muted-foreground/40 mb-3">
            30-YEAR TRAJECTORY
          </p>
          <p className={`text-lg font-medium mb-2 ${trajectory.color}`}>
            {trajectory.direction}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            {trajectory.description}
          </p>
        </div>

        <div className="text-center mt-6">
          <Button variant="ghost" size="sm" onClick={reset} className="text-xs text-muted-foreground/50">
            Reset to neutral
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FutureDrift;