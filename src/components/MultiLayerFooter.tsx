import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const weeklyInsights = [
  "Civilizations fail quietly, long before they fail suddenly.",
  "What one generation normalizes, the next inherits as baseline.",
  "The cost of convenience is always paid — just not always by you.",
  "Systems remember what individuals forget.",
  "Thirty years is long enough to change everything, short enough to ignore.",
];

const suggestedSimulations = [
  { label: "EMI Culture at Scale", id: "emi" },
  { label: "Retirement Gap 2050", id: "retirement" },
  { label: "Gig Economy Without Nets", id: "gig" },
];

const MultiLayerFooter = () => {
  const [currentInsight, setCurrentInsight] = useState(0);

  useEffect(() => {
    // Rotate weekly (simulated with longer interval for demo)
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % weeklyInsights.length);
    }, 30000); // 30 seconds for demo, would be weekly in production

    return () => clearInterval(interval);
  }, []);

  const scrollToSimulator = () => {
    document.querySelector("#simulator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/30">
      {/* Level 1: Engagement */}
      <div className="py-16 px-6 border-b border-border/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-[10px] tracking-[0.4em] text-primary mb-6">
            EXPLORE NEXT
          </p>
          <h3 className="text-xl md:text-2xl font-bold mb-8">
            What would you like to explore?
          </h3>
          
          <div className="flex flex-wrap justify-center gap-3">
            {suggestedSimulations.map((sim) => (
              <Button
                key={sim.id}
                variant="outline"
                size="sm"
                onClick={scrollToSimulator}
                className="text-xs"
              >
                {sim.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Level 2: Trust */}
      <div className="py-12 px-6 border-b border-border/30 bg-card/10">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <p className="font-mono text-[9px] tracking-widest text-primary mb-2">MISSION</p>
              <p className="text-sm text-muted-foreground">
                Make societal consequences visible. Help society think long-term again.
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] tracking-widest text-primary mb-2">ETHICS</p>
              <p className="text-sm text-muted-foreground">
                No manipulation. No addiction mechanics. No personal data collected.
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] tracking-widest text-primary mb-2">ACCESSIBILITY</p>
              <p className="text-sm text-muted-foreground">
                Designed for everyone. Plain language. Works on all devices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Level 3: Memory */}
      <div className="py-16 px-6 border-b border-border/30">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-[9px] tracking-widest text-muted-foreground mb-4">
            INSIGHT OF THE WEEK
          </p>
          <p className="font-serif text-xl md:text-2xl lg:text-3xl leading-relaxed italic text-foreground/90">
            "{weeklyInsights[currentInsight]}"
          </p>
        </div>
      </div>

      {/* Identity Bar */}
      <div className="py-6 px-6 bg-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm tracking-widest font-bold">SOCIETY.EXE</span>
            <span className="hidden md:inline text-border">|</span>
            <span className="hidden md:inline text-xs text-muted-foreground">
              Public Financial Intelligence
            </span>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-mono text-muted-foreground">
            <span>No tracking</span>
            <span>•</span>
            <span>No accounts</span>
            <span>•</span>
            <span>Open understanding</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MultiLayerFooter;
