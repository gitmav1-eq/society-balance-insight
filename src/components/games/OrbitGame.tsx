import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

interface Choice {
  id: string;
  label: string;
  effect: "stability" | "instability";
  description: string;
}

const choices: Choice[] = [
  { id: "1", label: "Normalize credit-first purchases", effect: "instability", description: "Debt becomes baseline expectation" },
  { id: "2", label: "Build emergency savings culture", effect: "stability", description: "Collective resilience increases" },
  { id: "3", label: "Delay retirement planning", effect: "instability", description: "Future burden shifts to fewer" },
  { id: "4", label: "Teach financial basics early", effect: "stability", description: "Next generation starts prepared" },
  { id: "5", label: "Expand gig work without safety nets", effect: "instability", description: "Individual risk increases" },
  { id: "6", label: "Create portable benefits", effect: "stability", description: "Worker protection scales" },
];

const OrbitGame = () => {
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">("intro");
  const [orbitRadius, setOrbitRadius] = useState(100);
  const [choicesMade, setChoicesMade] = useState<Choice[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const orbitRef = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLDivElement>(null);

  const maxRadius = 160;
  const minRadius = 40;
  const currentChoice = choices[currentIndex];

  useEffect(() => {
    if (gameState === "playing" && planetRef.current) {
      gsap.to(planetRef.current, {
        rotation: "+=360",
        duration: 8 - (orbitRadius / 40),
        repeat: -1,
        ease: "none",
      });
    }
  }, [gameState, orbitRadius]);

  const handleChoice = (effect: "stability" | "instability") => {
    const choice = choices[currentIndex];
    setChoicesMade([...choicesMade, choice]);

    const change = effect === "stability" ? -15 : 15;
    const newRadius = Math.max(minRadius, Math.min(maxRadius, orbitRadius + change));

    if (orbitRef.current) {
      gsap.to(orbitRef.current, {
        width: newRadius * 2,
        height: newRadius * 2,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    setOrbitRadius(newRadius);

    if (currentIndex < choices.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setGameState("result");
    }
  };

  const getOutcome = () => {
    if (orbitRadius <= 60) {
      return {
        title: "Stable Orbit Achieved",
        description: "Society moves closer to sustainability. Small collective choices created structural resilience.",
        color: "text-green-400",
      };
    } else if (orbitRadius <= 120) {
      return {
        title: "Orbit Uncertain",
        description: "Neither stable nor collapsing. The trajectory depends on what comes next.",
        color: "text-yellow-400",
      };
    } else {
      return {
        title: "Orbit Destabilizing",
        description: "Society drifts toward fragility. Convenience choices accumulated into systemic risk.",
        color: "text-red-400",
      };
    }
  };

  const reset = () => {
    setGameState("intro");
    setOrbitRadius(100);
    setChoicesMade([]);
    setCurrentIndex(0);
  };

  if (gameState === "intro") {
    return (
      <Card className="p-8 bg-card/30 backdrop-blur border-border/30">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center">
            <div className="w-3 h-3 bg-primary rounded-full" />
          </div>
          <h3 className="text-xl font-bold mb-2">ORBIT</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Push society's orbit closer to stability — or let it drift.
            <br />
            <span className="text-xs opacity-70">No winning. Only understanding.</span>
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
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-full border-2 flex items-center justify-center ${
              orbitRadius <= 60
                ? "border-green-400/50"
                : orbitRadius <= 120
                ? "border-yellow-400/50"
                : "border-red-400/50"
            }`}
          >
            <div className="w-3 h-3 bg-muted-foreground rounded-full" />
          </div>
          <h3 className={`text-lg font-bold mb-2 ${outcome.color}`}>{outcome.title}</h3>
          <p className="text-muted-foreground text-sm mb-6">{outcome.description}</p>
          <Button onClick={reset} variant="outline" size="sm">
            Reset Orbit
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-card/30 backdrop-blur border-border/30">
      <div className="text-center">
        <div className="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center">
          {/* Center point */}
          <div className="w-4 h-4 bg-primary/30 rounded-full absolute" />
          
          {/* Orbit path */}
          <div
            ref={orbitRef}
            className={`absolute rounded-full border transition-colors ${
              orbitRadius <= 60
                ? "border-green-400/40"
                : orbitRadius <= 120
                ? "border-yellow-400/40"
                : "border-red-400/40"
            }`}
            style={{ width: orbitRadius * 2, height: orbitRadius * 2 }}
          />
          
          {/* Planet */}
          <div
            ref={planetRef}
            className="absolute"
            style={{ width: orbitRadius * 2, height: orbitRadius * 2 }}
          >
            <div
              className="w-2.5 h-2.5 bg-foreground rounded-full absolute"
              style={{ top: 0, left: "50%", transform: "translateX(-50%)" }}
            />
          </div>
        </div>

        <p className="text-xs font-mono text-muted-foreground mb-4">
          {currentIndex + 1} / {choices.length}
        </p>

        <p className="text-sm mb-6">{currentChoice?.label}</p>

        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => handleChoice("stability")}
          >
            Resist
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => handleChoice("instability")}
          >
            Accept
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default OrbitGame;
