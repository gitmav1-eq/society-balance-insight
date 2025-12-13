import { useState, useEffect } from "react";

const insights = [
  "Small habits compound into structural change over decades.",
  "What one generation normalizes, the next inherits as baseline.",
  "Financial resilience is built in boring years, tested in crisis ones.",
  "Collective delay creates individual consequence.",
  "Systems remember what individuals forget.",
  "The cost of normalization is paid by those who didn't choose it.",
  "30 years is long enough to change everything, short enough to ignore.",
  "Leverage exists in awareness before it exists in action.",
];

const DynamicFooter = () => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentInsight((prev) => (prev + 1) % insights.length);
        setIsAnimating(false);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-border">
      {/* Rotating Insight */}
      <div className="py-16 px-6 md:px-12 lg:px-24 border-b border-border bg-card/20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-[9px] tracking-[0.4em] text-primary mb-6">
            SOCIETAL INSIGHT #{String(currentInsight + 1).padStart(2, '0')}
          </p>
          <p
            className={`font-serif text-xl md:text-2xl lg:text-3xl leading-relaxed transition-all duration-400 ${
              isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            {insights[currentInsight]}
          </p>
        </div>
      </div>

      {/* System Message */}
      <div className="py-12 px-6 md:px-12 lg:px-24 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-4">
            This system provides understanding, not advice. 
            Awareness precedes change.
          </p>
          <button 
            onClick={() => document.querySelector("#simulator")?.scrollIntoView({ behavior: "smooth" })}
            className="text-xs font-mono tracking-widest text-primary hover:underline"
          >
            EXPLORE ANOTHER SCENARIO →
          </button>
        </div>
      </div>

      {/* Identity Bar */}
      <div className="py-6 px-6 md:px-12 lg:px-24 bg-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm tracking-widest font-bold">SOCIETY.EXE</span>
            <span className="hidden md:inline text-border">|</span>
            <span className="hidden md:inline text-xs text-muted-foreground">Public Financial Intelligence</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-mono text-muted-foreground">
              SYSTEM v1.0
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              © 2024
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DynamicFooter;
