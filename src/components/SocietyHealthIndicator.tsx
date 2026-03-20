import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

export type HealthStatus = "stable" | "under-pressure" | "critical";

interface SocietyHealthIndicatorProps {
  status: HealthStatus;
}

const statusConfig = {
  stable: {
    label: "STABLE",
    color: "text-emerald-500",
    ringColor: "border-emerald-500/40",
    dotColor: "bg-emerald-500",
    bg: "bg-emerald-500/5",
    glowColor: "shadow-[0_0_16px_hsl(150_60%_40%/0.2)]",
  },
  "under-pressure": {
    label: "UNDER PRESSURE",
    color: "text-amber-500",
    ringColor: "border-amber-500/40",
    dotColor: "bg-amber-500",
    bg: "bg-amber-500/5",
    glowColor: "shadow-[0_0_16px_hsl(38_90%_50%/0.2)]",
  },
  critical: {
    label: "CRITICAL",
    color: "text-red-500",
    ringColor: "border-red-500/40",
    dotColor: "bg-red-500",
    bg: "bg-red-500/5",
    glowColor: "shadow-[0_0_16px_hsl(0_70%_50%/0.2)]",
  },
};

const SocietyHealthIndicator = ({ status }: SocietyHealthIndicatorProps) => {
  const config = statusConfig[status];

  return (
    <div className={cn("inline-flex items-center gap-3 border rounded-sm px-4 py-2.5 transition-all duration-500", config.ringColor, config.bg, config.glowColor)}>
      <div className="relative">
        <span className={cn("block w-2.5 h-2.5 rounded-full animate-ring-pulse", config.dotColor)} />
      </div>
      <div className="flex items-center gap-2">
        <Activity className={cn("w-3.5 h-3.5", config.color)} />
        <span className={cn("font-mono text-[9px] tracking-[0.3em] font-semibold", config.color)}>
          {config.label}
        </span>
      </div>
    </div>
  );
};

export default SocietyHealthIndicator;
