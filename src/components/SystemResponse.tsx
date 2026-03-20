import { useEffect, useState, useRef } from "react";
import { AlertTriangle, ShieldAlert, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemResponseData {
  risk_level: "low" | "medium" | "high";
  risk_explanation: string;
  system_actions: string[];
  if_continues: string;
  if_shifts: string;
}

interface SystemResponseProps {
  data: SystemResponseData | null;
  isLoading: boolean;
}

const riskConfig = {
  low: {
    icon: ShieldCheck,
    label: "LOW RISK",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_12px_hsl(150_60%_40%/0.15)]",
  },
  medium: {
    icon: AlertTriangle,
    label: "MEDIUM RISK",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    glow: "shadow-[0_0_12px_hsl(38_90%_50%/0.15)]",
  },
  high: {
    icon: ShieldAlert,
    label: "HIGH RISK",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    glow: "shadow-[0_0_12px_hsl(0_70%_50%/0.15)]",
  },
};

const SystemResponse = ({ data, isLoading }: SystemResponseProps) => {
  const [revealStep, setRevealStep] = useState(0);
  const [visibleActions, setVisibleActions] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data) {
      setRevealStep(0);
      setVisibleActions(0);
      return;
    }

    // Step 1: Banner
    const t1 = setTimeout(() => setRevealStep(1), 300);
    // Step 2: Risk level
    const t2 = setTimeout(() => setRevealStep(2), 900);
    // Step 3: System actions (staggered)
    const t3 = setTimeout(() => setRevealStep(3), 1500);
    const actionTimers = data.system_actions.map((_, i) =>
      setTimeout(() => setVisibleActions(i + 1), 1800 + i * 400)
    );
    // Step 4: Correction projection
    const t4 = setTimeout(() => setRevealStep(4), 1800 + data.system_actions.length * 400 + 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      actionTimers.forEach(clearTimeout);
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="mt-8 space-y-4">
        <div className="h-12 bg-muted/20 animate-pulse rounded" />
        <div className="h-24 bg-muted/20 animate-pulse rounded" />
      </div>
    );
  }

  if (!data) return null;

  const risk = riskConfig[data.risk_level];
  const RiskIcon = risk.icon;

  return (
    <div ref={containerRef} className="mt-8 space-y-4">
      {/* Step A: Banner */}
      <div
        className={cn(
          "border border-border/30 bg-card/30 p-4 transition-all duration-600",
          revealStep >= 1 ? "opacity-100 animate-system-reveal" : "opacity-0"
        )}
      >
        <div className="flex items-center gap-3">
          <Activity className={cn("w-4 h-4", risk.color)} />
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground animate-status-pulse">
            SYSTEM RESPONSE ACTIVATED
          </p>
        </div>
      </div>

      {/* Step B: Risk Detection */}
      <div
        className={cn(
          "border p-5 transition-all duration-600",
          risk.border, risk.bg, risk.glow,
          revealStep >= 2 ? "opacity-100 animate-system-reveal" : "opacity-0"
        )}
      >
        <div className="flex items-center gap-3 mb-2">
          <RiskIcon className={cn("w-5 h-5", risk.color)} />
          <span className={cn("font-mono text-[10px] tracking-[0.3em] font-semibold", risk.color)}>
            {risk.label}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.risk_explanation}</p>
      </div>

      {/* Step C: System Actions */}
      <div
        className={cn(
          "border border-border/30 bg-card/20 p-5 transition-all duration-600",
          revealStep >= 3 ? "opacity-100 animate-system-reveal" : "opacity-0"
        )}
      >
        <p className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground/70 mb-4">
          SYSTEM IS RESPONDING TO THIS PATTERN
        </p>
        <div className="space-y-2.5">
          {data.system_actions.map((action, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-3 text-sm transition-all duration-500",
                i < visibleActions ? "opacity-100 animate-line-reveal" : "opacity-0"
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", risk.color.replace("text-", "bg-"))} />
              <span className="text-muted-foreground">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step D: Correction Projection */}
      <div
        className={cn(
          "grid md:grid-cols-2 gap-4 transition-all duration-600",
          revealStep >= 4 ? "opacity-100 animate-system-reveal" : "opacity-0"
        )}
      >
        <div className="border border-destructive/20 bg-destructive/5 p-5">
          <p className="font-mono text-[9px] tracking-[0.2em] text-destructive/70 mb-2">IF PATTERN CONTINUES</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{data.if_continues}</p>
        </div>
        <div className="border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="font-mono text-[9px] tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-2">IF 10% SHIFT BEHAVIOR</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{data.if_shifts}</p>
        </div>
      </div>
    </div>
  );
};

export default SystemResponse;
