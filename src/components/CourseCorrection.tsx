import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Scenario {
  question: string;
  optionA: { label: string; effect: number };
  optionB: { label: string; effect: number };
}

const scenarios: Scenario[] = [
  {
    question: "A new lending product makes borrowing easier. Society...",
    optionA: { label: "Embraces convenience", effect: -15 },
    optionB: { label: "Questions long-term cost", effect: 10 },
  },
  {
    question: "Financial education becomes optional in schools. We...",
    optionA: { label: "Accept the gap", effect: -20 },
    optionB: { label: "Fill it elsewhere", effect: 5 },
  },
  {
    question: "Gig platforms grow without worker protections. Workers...",
    optionA: { label: "Adapt individually", effect: -10 },
    optionB: { label: "Organize collectively", effect: 15 },
  },
];

const CourseCorrection = () => {
  const [state, setState] = useState<"intro" | "playing" | "result">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trajectory, setTrajectory] = useState(50);

  const handleChoice = (effect: number) => {
    const newTrajectory = Math.max(0, Math.min(100, trajectory + effect));
    setTrajectory(newTrajectory);

    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setState("result");
    }
  };

  const getOutcome = () => {
    if (trajectory >= 60) {
      return {
        title: "Trajectory improving",
        message: "Collective awareness shifted society toward resilience. Small corrections compound.",
      };
    } else if (trajectory >= 40) {
      return {
        title: "Trajectory uncertain",
        message: "Mixed signals. The path ahead depends on consistent small choices.",
      };
    } else {
      return {
        title: "Trajectory concerning",
        message: "Convenience won over caution. The cost shows up later, carried by many.",
      };
    }
  };

  const reset = () => {
    setState("intro");
    setCurrentIndex(0);
    setTrajectory(50);
  };

  if (state === "intro") {
    return (
      <section id="play" className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="font-mono text-[9px] tracking-[0.5em] text-muted-foreground/60 mb-4">
            60-SECOND REFLECTION
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Course Correction</h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Three moments. Three choices. See how small shifts change trajectory.
          </p>
          <Button onClick={() => setState("playing")} variant="outline" size="lg">
            Begin
          </Button>
        </div>
      </section>
    );
  }

  if (state === "result") {
    const outcome = getOutcome();
    return (
      <section id="play" className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="mb-8">
            <div 
              className={`w-20 h-20 mx-auto rounded-full border-2 flex items-center justify-center mb-6 ${
                trajectory >= 60 ? "border-green-400/40" : trajectory >= 40 ? "border-yellow-400/40" : "border-red-400/40"
              }`}
            >
              <div className="w-3 h-3 bg-foreground/60 rounded-full" />
            </div>
            <h3 className={`text-lg font-medium mb-3 ${
              trajectory >= 60 ? "text-green-400" : trajectory >= 40 ? "text-yellow-400" : "text-red-400"
            }`}>
              {outcome.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
              {outcome.message}
            </p>
          </div>
          <Button onClick={reset} variant="outline" size="sm">
            Reflect again
          </Button>
        </div>
      </section>
    );
  }

  const scenario = scenarios[currentIndex];

  return (
    <section id="play" className="py-20 px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <p className="font-mono text-[9px] tracking-widest text-muted-foreground/60 mb-2">
            MOMENT {currentIndex + 1} OF {scenarios.length}
          </p>
          <div className="w-full h-1 bg-border/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary/50 transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / scenarios.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-8 bg-card/20 border-border/30 text-center">
          <p className="text-lg leading-relaxed mb-8">
            {scenario.question}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => handleChoice(scenario.optionA.effect)}
              className="text-sm px-6"
            >
              {scenario.optionA.label}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleChoice(scenario.optionB.effect)}
              className="text-sm px-6"
            >
              {scenario.optionB.label}
            </Button>
          </div>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground/40 mt-6">
          No right answers. Only trajectories.
        </p>
      </div>
    </section>
  );
};

export default CourseCorrection;