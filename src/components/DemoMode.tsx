import { useState } from "react";
import { Play, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoModeProps {
  onActivate: () => void;
  isRunning: boolean;
}

const DemoMode = ({ onActivate, isRunning }: DemoModeProps) => {
  return (
    <button
      onClick={onActivate}
      disabled={isRunning}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono tracking-wider",
        "border rounded-sm transition-all duration-300",
        isRunning
          ? "border-primary/50 bg-primary/10 text-primary cursor-wait"
          : "border-border/40 text-muted-foreground/70 hover:border-primary/40 hover:text-foreground hover:bg-primary/5"
      )}
    >
      {isRunning ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Play className="w-3 h-3" />
      )}
      {isRunning ? "DEMO RUNNING" : "DEMO"}
    </button>
  );
};

export default DemoMode;
