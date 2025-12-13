import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const presetBehaviors = [
  "EMI culture",
  "Delayed savings",
  "Lifestyle inflation",
  "Gig work without safety nets",
  "Credit dependence",
];

interface SimulationResult {
  individual: string;
  collective: string;
  pressure: string;
  lever: string;
}

const NormalizationSimulator = () => {
  const [behavior, setBehavior] = useState("");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = async (behaviorToSimulate: string) => {
    if (!behaviorToSimulate.trim()) {
      toast.error("Select or enter a behavior");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setBehavior(behaviorToSimulate);

    try {
      const { data, error } = await supabase.functions.invoke("simulate-behavior-v2", {
        body: { behavior: behaviorToSimulate },
      });

      if (error) throw error;

      if (data?.result) {
        setResult(data.result);
      } else {
        toast.error("Simulation failed");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("System error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setBehavior("");
  };

  return (
    <section id="simulator" className="py-24 px-6 md:px-12 lg:px-24 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-[10px] tracking-[0.4em] text-primary mb-4">
            THE NORMALIZATION SIMULATOR
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
            Project the trajectory
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Select a normalized behavior. See its individual and collective impact unfold over decades.
          </p>
        </div>

        {!result ? (
          <div className="border border-border bg-card/30 backdrop-blur-sm p-8 md:p-12">
            <p className="font-mono text-[9px] tracking-widest text-muted-foreground mb-6">
              SELECT BEHAVIOR TO SIMULATE
            </p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {presetBehaviors.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handleSimulate(preset)}
                  disabled={isLoading}
                  className="px-5 py-3 text-sm border border-border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="border-t border-border pt-6">
              <p className="font-mono text-[9px] tracking-widest text-muted-foreground mb-4">
                OR DESCRIBE CUSTOM BEHAVIOR
              </p>
              <Textarea
                placeholder="Enter a financial behavior to simulate..."
                value={behavior}
                onChange={(e) => setBehavior(e.target.value)}
                className="min-h-[80px] resize-none bg-background border-border mb-4"
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
                    Processing...
                  </span>
                ) : (
                  "Run Simulation"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Behavior Label */}
            <div className="p-4 bg-primary/10 border border-primary/30">
              <p className="font-mono text-[9px] tracking-widest text-primary mb-1">
                SIMULATING
              </p>
              <p className="text-lg font-medium">{behavior}</p>
            </div>

            {/* Results Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Individual Impact */}
              <div className="p-6 border border-border bg-card/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground">
                    INDIVIDUAL IMPACT
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.individual}
                </p>
              </div>

              {/* Collective Impact */}
              <div className="p-6 border border-border bg-card/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full" />
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground">
                    COLLECTIVE IMPACT (10-30 YEARS)
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.collective}
                </p>
              </div>

              {/* System Pressure */}
              <div className="p-6 border border-border bg-card/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-orange-500 rounded-full" />
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground">
                    SYSTEM PRESSURE POINTS
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.pressure}
                </p>
              </div>

              {/* Lever for Change */}
              <div className="p-6 border border-primary/30 bg-primary/5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  <p className="font-mono text-[9px] tracking-widest text-primary">
                    LEVER FOR CHANGE
                  </p>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {result.lever}
                </p>
              </div>
            </div>

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
