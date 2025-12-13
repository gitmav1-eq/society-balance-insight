import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CosmicParticles from "@/components/ui/CosmicParticles";
import AmbientNebula from "@/components/ui/AmbientNebula";

gsap.registerPlugin(ScrollTrigger);

interface BalanceMetric {
  label: string;
  positive: string;
  negative: string;
  ratio: number; // 0-1, where 0.5 is balanced
  trend: "improving" | "declining" | "stable";
}

const metrics: BalanceMetric[] = [
  {
    label: "Collective Savings",
    positive: "Long-term security",
    negative: "Short-term consumption",
    ratio: 0.35,
    trend: "declining",
  },
  {
    label: "Debt Distribution",
    positive: "Investment debt",
    negative: "Consumption debt",
    ratio: 0.28,
    trend: "declining",
  },
  {
    label: "Generational Transfer",
    positive: "Wealth building",
    negative: "Wealth extraction",
    ratio: 0.42,
    trend: "stable",
  },
  {
    label: "Economic Resilience",
    positive: "Shock absorption",
    negative: "System fragility",
    ratio: 0.38,
    trend: "declining",
  },
];

const PublicBalanceSheet = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleMetrics, setVisibleMetrics] = useState<number[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".balance-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      // Animate metrics appearing one by one
      metrics.forEach((_, index) => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 60%",
          onEnter: () => {
            setTimeout(() => {
              setVisibleMetrics((prev) => [...prev, index]);
            }, index * 200);
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getTrendIcon = (trend: BalanceMetric["trend"]) => {
    switch (trend) {
      case "improving":
        return "↗";
      case "declining":
        return "↘";
      default:
        return "→";
    }
  };

  const getTrendColor = (trend: BalanceMetric["trend"]) => {
    switch (trend) {
      case "improving":
        return "text-emerald-500";
      case "declining":
        return "text-amber-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <section
      ref={sectionRef}
      id="balance"
      className="py-24 px-6 relative overflow-hidden"
    >
      <AmbientNebula intensity="subtle" colorScheme="mixed" />
      <CosmicParticles particleCount={25} showShootingStars intensity="low" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="balance-header font-mono text-[9px] tracking-[0.5em] text-muted-foreground/50 mb-4">
            COLLECTIVE LEDGER
          </p>
          <h2 className="balance-header text-2xl md:text-3xl font-bold mb-4">
            The Public Balance Sheet
          </h2>
          <p className="balance-header text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
            A real-time mirror of our collective financial choices. Not judgment—just visibility.
          </p>
        </div>

        {/* Balance Visualization */}
        <div className="space-y-8">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`transition-all duration-700 ${
                visibleMetrics.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground/70">
                  {metric.positive}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                    {getTrendIcon(metric.trend)}
                  </span>
                </div>
                <span className="text-xs font-mono text-muted-foreground/70">
                  {metric.negative}
                </span>
              </div>

              {/* Balance Bar */}
              <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
                {/* Center line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/50 z-10" />
                
                {/* Animated fill */}
                <div
                  className="absolute top-0 bottom-0 transition-all duration-1000 ease-out rounded-full"
                  style={{
                    left: metric.ratio < 0.5 ? `${metric.ratio * 100}%` : "50%",
                    right: metric.ratio > 0.5 ? `${(1 - metric.ratio) * 100}%` : "50%",
                    background:
                      metric.ratio < 0.5
                        ? `linear-gradient(90deg, hsl(var(--primary) / 0.8), hsl(var(--primary) / 0.4))`
                        : `linear-gradient(90deg, hsl(var(--secondary) / 0.4), hsl(var(--secondary) / 0.8))`,
                    boxShadow: `0 0 20px hsl(var(--primary) / 0.3)`,
                  }}
                />

                {/* Indicator dot */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-lg transition-all duration-1000 ease-out"
                  style={{
                    left: `calc(${metric.ratio * 100}% - 6px)`,
                    boxShadow: `0 0 10px hsl(var(--primary) / 0.6)`,
                  }}
                />
              </div>

              {/* Percentage labels */}
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground/40">
                  {Math.round(metric.ratio * 100)}%
                </span>
                <span className="text-[10px] text-muted-foreground/40">
                  {Math.round((1 - metric.ratio) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="mt-16 p-6 border border-border/30 bg-card/10 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">⚖️</span>
            </div>
            <div>
              <p className="font-mono text-[9px] tracking-widest text-muted-foreground/50 mb-2">
                SYSTEM OBSERVATION
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Current patterns show a tilt toward short-term consumption over long-term security. 
                This isn't about blame—it's about seeing the aggregate effect of normalized behaviors. 
                Small shifts in millions of choices can rebalance these scales over time.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/30 mt-8">
          Data represents behavioral patterns, not financial advice.
        </p>
      </div>
    </section>
  );
};

export default PublicBalanceSheet;
