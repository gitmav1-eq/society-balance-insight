import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AmbientNebulaProps {
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
  colorScheme?: "primary" | "secondary" | "mixed";
}

const AmbientNebula = ({ 
  className,
  intensity = "subtle",
  colorScheme = "primary"
}: AmbientNebulaProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const opacityMap = {
    subtle: "opacity-[0.15]",
    medium: "opacity-[0.25]",
    strong: "opacity-[0.35]",
  };

  if (!mounted) return null;

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Primary nebula blob - top left */}
      <div
        className={cn(
          "absolute -top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full blur-[100px]",
          "bg-primary/30 animate-nebula-pulse-1",
          opacityMap[intensity]
        )}
      />
      
      {/* Secondary nebula blob - bottom right */}
      <div
        className={cn(
          "absolute -bottom-1/4 -right-1/4 w-[50%] h-[50%] rounded-full blur-[120px]",
          colorScheme === "mixed" || colorScheme === "secondary" 
            ? "bg-secondary/30" 
            : "bg-primary/20",
          "animate-nebula-pulse-2",
          opacityMap[intensity]
        )}
      />
      
      {/* Center accent glow */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full blur-[80px]",
          "bg-accent/20 animate-nebula-pulse-3",
          opacityMap[intensity]
        )}
      />

      {/* Floating accent orb - moves slowly */}
      <div
        className={cn(
          "absolute w-[20%] h-[20%] rounded-full blur-[60px]",
          "bg-primary/25 animate-nebula-float",
          opacityMap[intensity]
        )}
        style={{
          top: "30%",
          left: "60%",
        }}
      />
    </div>
  );
};

export default AmbientNebula;
