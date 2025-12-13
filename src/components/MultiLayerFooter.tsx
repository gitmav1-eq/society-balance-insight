import { useState, useEffect } from "react";

const insights = [
  "Civilizations fail quietly, long before they fail suddenly.",
  "What one generation normalizes, the next inherits as baseline.",
  "The cost of convenience is always paid — just not always by you.",
  "Systems remember what individuals forget.",
  "Thirty years is long enough to change everything, short enough to ignore.",
];

const MultiLayerFooter = () => {
  const [currentInsight, setCurrentInsight] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-border/10">
      {/* About Section */}
      <section id="about" className="py-16 px-6 border-b border-border/10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-mono text-[9px] tracking-[0.5em] text-muted-foreground/40 mb-6">
            ABOUT THIS PROJECT
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            SOCIETY.EXE is a public intelligence platform designed to help people 
            understand how everyday behaviors shape society over decades.
          </p>
          <p className="text-sm text-muted-foreground/70 leading-relaxed">
            No financial advice. No tracking. No manipulation.
            <br />
            Just clarity for everyone.
          </p>
        </div>
      </section>

      {/* Insight */}
      <div className="py-10 px-6 border-b border-border/10">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-base leading-relaxed italic text-foreground/60">
            "{insights[currentInsight]}"
          </p>
        </div>
      </div>

      {/* Identity */}
      <div className="py-5 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs tracking-widest text-muted-foreground/60">SOCIETY.EXE</span>
          <div className="flex items-center gap-5 text-[9px] font-mono text-muted-foreground/40">
            <span>Built for public good</span>
            <span>•</span>
            <span>No accounts required</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MultiLayerFooter;
