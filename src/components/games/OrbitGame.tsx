import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const OrbitGame = () => {
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">("intro");
  const [balance, setBalance] = useState(50);
  const [orbitStability, setOrbitStability] = useState(50);
  const [rounds, setRounds] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameState === "playing") {
      // Orbit stability drifts based on balance
      const interval = setInterval(() => {
        setOrbitStability((prev) => {
          const idealBalance = 50;
          const deviation = Math.abs(balance - idealBalance);
          const drift = deviation > 30 ? -2 : deviation > 15 ? -0.5 : 0.5;
          return Math.max(0, Math.min(100, prev + drift));
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [gameState, balance]);

  useEffect(() => {
    if (gameState === "playing" && rounds >= 5) {
      setGameState("result");
    }
  }, [rounds, gameState]);

  const handleBalanceChange = (value: number[]) => {
    setBalance(value[0]);
  };

  const confirmChoice = () => {
    setRounds((prev) => prev + 1);
  };

  const getOutcome = () => {
    if (orbitStability >= 70) {
      return {
        title: "Orbit Stabilized",
        description: "Patience and balance created resilience. Small, consistent choices compound into systemic strength.",
        color: "text-green-400",
      };
    } else if (orbitStability >= 40) {
      return {
        title: "Orbit Uncertain",
        description: "Neither stable nor collapsing. The trajectory depends on what comes next.",
        color: "text-yellow-400",
      };
    } else {
      return {
        title: "Orbit Destabilizing",
        description: "Impulse over patience pushed the system toward fragility. Small imbalances accumulated.",
        color: "text-red-400",
      };
    }
  };

  const reset = () => {
    setGameState("intro");
    setBalance(50);
    setOrbitStability(50);
    setRounds(0);
  };

  const getStabilityColor = () => {
    if (orbitStability >= 70) return "border-green-400/40";
    if (orbitStability >= 40) return "border-yellow-400/40";
    return "border-red-400/40";
  };

  if (gameState === "intro") {
    return (
      <Card className="p-8 bg-card/30 backdrop-blur border-border/30">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center">
            <div className="w-3 h-3 bg-primary rounded-full" />
          </div>
          <h3 className="text-lg font-bold mb-2">Stabilize the Orbit</h3>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Balance impulse vs patience.
            <br />
            <span className="text-xs opacity-70">Watch how small shifts compound.</span>
          </p>
          <Button onClick={() => setGameState("playing")} size="sm" variant="outline">
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
            className={`w-20 h-20 mx-auto mb-6 rounded-full border-2 flex items-center justify-center ${getStabilityColor()}`}
          >
            <div className="w-3 h-3 bg-muted-foreground rounded-full" />
          </div>
          <h3 className={`text-base font-bold mb-2 ${outcome.color}`}>{outcome.title}</h3>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{outcome.description}</p>
          <Button onClick={reset} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-card/30 backdrop-blur border-border/30">
      <div className="text-center">
        <div ref={canvasRef} className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          {/* Central point */}
          <div className="w-4 h-4 bg-primary/40 rounded-full absolute" />
          
          {/* Orbit ring */}
          <div
            className={`absolute rounded-full border-2 transition-all duration-500 ${getStabilityColor()}`}
            style={{ 
              width: 80 + (100 - orbitStability) * 0.4, 
              height: 80 + (100 - orbitStability) * 0.4 
            }}
          />
          
          {/* Orbiting dot */}
          <div
            className="absolute w-2.5 h-2.5 bg-foreground rounded-full animate-spin"
            style={{ 
              animationDuration: `${3 + (100 - orbitStability) / 20}s`,
              top: 10,
              left: "50%",
              transformOrigin: "0 50px"
            }}
          />
        </div>

        <p className="text-xs font-mono text-muted-foreground mb-2">
          Round {rounds + 1} of 5
        </p>
        
        <p className="text-xs text-muted-foreground mb-4">
          Stability: {Math.round(orbitStability)}%
        </p>

        <div className="mb-6">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-2">
            <span>Impulse</span>
            <span>Patience</span>
          </div>
          <Slider
            value={[balance]}
            onValueChange={handleBalanceChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <Button variant="outline" size="sm" onClick={confirmChoice} className="text-xs">
          Confirm Choice
        </Button>
      </div>
    </Card>
  );
};

export default OrbitGame;
