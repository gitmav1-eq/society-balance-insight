import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CosmicParticles from "@/components/ui/CosmicParticles";
import AmbientNebula from "@/components/ui/AmbientNebula";

gsap.registerPlugin(ScrollTrigger);

interface BalanceMetric {
  label: string;
  positive: string;
  negative: string;
  ratio: number;
  trend: "improving" | "declining" | "stable";
}

interface GlobalStat {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  incrementRate: number;
  decimals?: number;
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

const globalStats: GlobalStat[] = [
  { label: "Global Consumer Debt", value: 58.3, suffix: "T", prefix: "$", incrementRate: 0.0001 },
  { label: "Avg Savings Rate", value: 7.2, suffix: "%", incrementRate: -0.00001, decimals: 1 },
  { label: "Households in Debt Stress", value: 142, suffix: "M", incrementRate: 0.002 },
  { label: "Years to Retirement Gap", value: 8.4, suffix: " yrs", incrementRate: 0.00002, decimals: 1 },
];

// Animated counter hook
const useAnimatedCounter = (targetValue: number, incrementRate: number, decimals = 0) => {
  const [value, setValue] = useState(targetValue);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setValue(prev => {
        const newValue = prev + incrementRate + (Math.random() - 0.5) * Math.abs(incrementRate) * 0.5;
        return Number(newValue.toFixed(decimals + 2));
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [incrementRate, decimals]);
  
  return value.toFixed(decimals);
};

// Counter component
const AnimatedStatCounter = ({ stat }: { stat: GlobalStat }) => {
  const displayValue = useAnimatedCounter(stat.value, stat.incrementRate, stat.decimals || 0);
  
  return (
    <div className="text-center p-4 border border-border/20 bg-card/5 backdrop-blur-sm rounded-sm group hover:border-primary/30 transition-all duration-300">
      <div className="font-mono text-2xl md:text-3xl font-bold text-foreground mb-1 tabular-nums">
        <span className="text-primary/70">{stat.prefix}</span>
        <span className="animate-pulse-glow inline-block">{displayValue}</span>
        <span className="text-muted-foreground text-lg">{stat.suffix}</span>
      </div>
      <p className="text-[10px] font-mono tracking-wider text-muted-foreground/60 uppercase">
        {stat.label}
      </p>
      {/* Live indicator */}
      <div className="flex items-center justify-center gap-1 mt-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[8px] text-muted-foreground/40 font-mono">LIVE</span>
      </div>
    </div>
  );
};

const PublicBalanceSheet = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleMetrics, setVisibleMetrics] = useState<number[]>([]);
  const [showStats, setShowStats] = useState(false);

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

      // Show stats when scrolled into view
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        onEnter: () => setShowStats(true),
      });

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

        {/* Live Global Stats */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16 animate-fade-in">
            {globalStats.map((stat) => (
              <AnimatedStatCounter key={stat.label} stat={stat} />
            ))}
          </div>
        )}

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
