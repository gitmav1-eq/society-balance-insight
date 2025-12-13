import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SimulationResult from "./SimulationResult";

const presetBehaviors = [
  "Widespread EMI dependence for everyday purchases",
  "Delaying retirement savings until age 40",
  "Gig economy work without social protection",
  "Lifestyle inflation matching income growth",
  "Credit-led consumption culture",
];

const NormalizationSimulator = () => {
  const [behavior, setBehavior] = useState("");
  const [simulation, setSimulation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async (behaviorToSimulate: string) => {
    if (!behaviorToSimulate.trim()) {
      toast.error("Please enter a behavior to simulate");
      return;
    }

    setIsLoading(true);
    setSimulation(null);
    setBehavior(behaviorToSimulate);

    try {
      const { data, error } = await supabase.functions.invoke("simulate-behavior", {
        body: { behavior: behaviorToSimulate },
      });

      if (error) {
        console.error("Simulation error:", error);
        toast.error(error.message || "Failed to generate simulation");
        return;
      }

      if (data?.simulation) {
        setSimulation(data.simulation);
      } else {
        toast.error("No simulation was generated");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSimulation(null);
    setBehavior("");
  };

  return (
    <section id="simulator" className="py-24 px-6 md:px-12 lg:px-24 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-sm tracking-widest text-muted-foreground mb-4">
          NORMALIZATION SIMULATOR
        </p>
        
        <h2 className="font-serif text-3xl md:text-4xl mb-6">
          Project the collective trajectory
        </h2>
        
        <p className="text-muted-foreground mb-12 max-w-2xl">
          Select a normalized behavior or describe your own. The system will project its long-term societal impact across financial resilience, inequality, stability, and opportunity.
        </p>

        {!simulation ? (
          <>
            <div className="flex flex-wrap gap-3 mb-8">
              {presetBehaviors.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handleSimulate(preset)}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm border border-border bg-card hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder="Or describe a normalized behavior..."
                value={behavior}
                onChange={(e) => setBehavior(e.target.value)}
                className="min-h-[120px] resize-none bg-card border-border"
                disabled={isLoading}
              />
              
              <Button
                onClick={() => handleSimulate(behavior)}
                disabled={isLoading || !behavior.trim()}
                className="px-8 py-6"
              >
                {isLoading ? "Simulating..." : "Run Simulation"}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-8">
            <div className="p-4 bg-card border border-border">
              <p className="font-mono text-xs text-muted-foreground mb-2">SIMULATING</p>
              <p className="text-foreground">{behavior}</p>
            </div>
            
            <SimulationResult content={simulation} />
            
            <Button
              variant="ghost"
              onClick={handleReset}
              className="text-muted-foreground"
            >
              ← Run Another Simulation
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NormalizationSimulator;
