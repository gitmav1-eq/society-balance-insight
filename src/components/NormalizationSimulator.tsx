import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SimulationResult from "./SimulationResult";

const presetBehaviors = [
  "Buying everything on EMI",
  "Delaying savings until 40",
  "Lifestyle inflation",
  "Gig work without safety nets",
  "Credit-first living",
];

interface NormalizationSimulatorProps {
  onSimulationComplete?: (behavior: string) => void;
}

const NormalizationSimulator = ({ onSimulationComplete }: NormalizationSimulatorProps) => {
  const [behavior, setBehavior] = useState("");
  const [simulation, setSimulation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async (behaviorToSimulate: string) => {
    if (!behaviorToSimulate.trim()) {
      toast.error("Please select or enter a behavior");
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
        toast.error(error.message || "Simulation failed");
        return;
      }

      if (data?.simulation) {
        setSimulation(data.simulation);
        onSimulationComplete?.(behaviorToSimulate);
      } else {
        toast.error("No simulation generated");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("System error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSimulation(null);
    setBehavior("");
    onSimulationComplete?.("");
  };

  return (
    <section id="simulator" className="py-24 px-6 md:px-12 lg:px-24 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">
            NORMALIZATION SIMULATOR
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
            Project the collective trajectory
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Select a normalized behavior. See how it scales across society over decades.
          </p>
        </div>

        {!simulation ? (
          <div className="border border-border bg-card/30 backdrop-blur-sm p-8">
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground mb-6">
              SELECT BEHAVIOR
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {presetBehaviors.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handleSimulate(preset)}
                  disabled={isLoading}
                  className="p-4 text-sm text-left border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="block group-hover:translate-x-1 transition-transform">
                    {preset}
                  </span>
                </button>
              ))}
            </div>

            <div className="border-t border-border pt-6">
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground mb-4">
                OR DESCRIBE YOUR OWN
              </p>
              <Textarea
                placeholder="Describe a normalized financial behavior..."
                value={behavior}
                onChange={(e) => setBehavior(e.target.value)}
                className="min-h-[100px] resize-none bg-background border-border mb-4"
                disabled={isLoading}
              />
              
              <Button
                onClick={() => handleSimulate(behavior)}
                disabled={isLoading || !behavior.trim()}
                className="w-full md:w-auto px-8"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Simulating...
                  </span>
                ) : (
                  "Run Simulation"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="p-4 bg-primary/10 border border-primary/20">
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
                SIMULATING
              </p>
              <p className="text-foreground font-medium">{behavior}</p>
            </div>
            
            <SimulationResult content={simulation} />
            
            <Button
              variant="outline"
              onClick={handleReset}
              className="text-muted-foreground"
            >
              ← New Simulation
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NormalizationSimulator;
