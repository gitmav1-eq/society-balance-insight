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
  { label: "Credit-first lifestyle", id: "credit" },
  { label: "Delayed savings culture", id: "savings" },
  { label: "Gig work without safety nets", id: "gig" },
];

const MultiLayerFooter = () => {
  const [currentInsight, setCurrentInsight] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % weeklyInsights.length);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSimulator = () => {
    document.querySelector("#simulator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/20">
      {/* About Section */}
      <section id="about" className="py-14 px-6 border-b border-border/20">
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 text-center md:text-left">
            <div>
              <p className="font-mono text-[9px] tracking-widest text-muted-foreground/60 mb-2">BUILT FOR</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Public understanding. Helping people think longer-term about everyday decisions.
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] tracking-widest text-muted-foreground/60 mb-2">ACCESSIBILITY</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Plain language. No finance jargon. Designed for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Insight */}
      <div className="py-12 px-6 border-b border-border/20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-base md:text-lg leading-relaxed italic text-foreground/70">
            "{weeklyInsights[currentInsight]}"
          </p>
        </div>
      </div>

      {/* Identity */}
      <div className="py-5 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono text-sm tracking-widest font-medium">SOCIETY.EXE</span>
          <div className="flex items-center gap-6 text-[10px] font-mono text-muted-foreground/50">
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
