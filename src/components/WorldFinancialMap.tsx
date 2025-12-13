import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Region {
  id: string;
  name: string;
  x: number;
  y: number;
  healthScore: number;
  population: string;
  trend: "up" | "down" | "stable";
}

const regions: Region[] = [
  { id: "na", name: "North America", x: 22, y: 32, healthScore: 62, population: "380M", trend: "down" },
  { id: "sa", name: "South America", x: 30, y: 62, healthScore: 45, population: "430M", trend: "stable" },
  { id: "eu", name: "Europe", x: 52, y: 28, healthScore: 58, population: "750M", trend: "down" },
  { id: "af", name: "Africa", x: 52, y: 52, healthScore: 38, population: "1.4B", trend: "up" },
  { id: "me", name: "Middle East", x: 62, y: 40, healthScore: 55, population: "400M", trend: "stable" },
  { id: "sa2", name: "South Asia", x: 72, y: 45, healthScore: 42, population: "2B", trend: "up" },
  { id: "ea", name: "East Asia", x: 80, y: 32, healthScore: 68, population: "1.7B", trend: "stable" },
  { id: "sea", name: "Southeast Asia", x: 78, y: 52, healthScore: 52, population: "700M", trend: "up" },
  { id: "oc", name: "Oceania", x: 85, y: 68, healthScore: 65, population: "45M", trend: "down" },
];

const getHealthColor = (score: number) => {
  if (score >= 60) return "rgb(34, 197, 94)"; // green
  if (score >= 45) return "rgb(234, 179, 8)"; // amber
  return "rgb(239, 68, 68)"; // red
};

const getHealthGlow = (score: number, opacity: number) => {
  if (score >= 60) return `rgba(34, 197, 94, ${opacity})`;
  if (score >= 45) return `rgba(234, 179, 8, ${opacity})`;
  return `rgba(239, 68, 68, ${opacity})`;
};

const WorldFinancialMap = () => {
  const [activeRegion, setActiveRegion] = useState<Region | null>(null);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-[2/1] max-w-4xl mx-auto">
      {/* SVG World Map Outline */}
      <svg
        viewBox="0 0 100 50"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 10px hsl(var(--primary) / 0.2))" }}
      >
        {/* Simplified continent outlines */}
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--muted) / 0.3)" />
            <stop offset="100%" stopColor="hsl(var(--muted) / 0.1)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {[...Array(9)].map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={(i + 1) * 5}
            x2="100"
            y2={(i + 1) * 5}
            stroke="hsl(var(--border) / 0.2)"
            strokeWidth="0.1"
          />
        ))}
        {[...Array(19)].map((_, i) => (
          <line
            key={`v-${i}`}
            x1={(i + 1) * 5}
            y1="0"
            x2={(i + 1) * 5}
            y2="50"
            stroke="hsl(var(--border) / 0.2)"
            strokeWidth="0.1"
          />
        ))}

        {/* Simplified continent shapes */}
        {/* North America */}
        <path
          d="M10,15 Q15,12 25,15 L30,20 Q32,28 28,35 L20,38 Q12,35 10,28 Z"
          fill="url(#mapGradient)"
          stroke="hsl(var(--border) / 0.3)"
          strokeWidth="0.2"
        />
        {/* South America */}
        <path
          d="M25,42 Q30,40 32,45 L35,55 Q34,68 28,75 L24,70 Q22,58 25,42 Z"
          fill="url(#mapGradient)"
          stroke="hsl(var(--border) / 0.3)"
          strokeWidth="0.2"
        />
        {/* Europe */}
        <path
          d="M45,18 Q52,15 58,18 L60,25 Q58,32 52,35 L46,32 Q44,25 45,18 Z"
          fill="url(#mapGradient)"
          stroke="hsl(var(--border) / 0.3)"
          strokeWidth="0.2"
        />
        {/* Africa */}
        <path
          d="M45,38 Q52,35 58,38 L60,50 Q58,65 52,70 L46,65 Q44,50 45,38 Z"
          fill="url(#mapGradient)"
          stroke="hsl(var(--border) / 0.3)"
          strokeWidth="0.2"
        />
        {/* Asia */}
        <path
          d="M58,15 Q72,12 88,18 L90,30 Q88,42 80,48 L68,50 Q60,45 58,35 Z"
          fill="url(#mapGradient)"
          stroke="hsl(var(--border) / 0.3)"
          strokeWidth="0.2"
        />
        {/* Oceania */}
        <path
          d="M82,58 Q88,55 92,58 L94,65 Q92,72 86,75 L82,72 Q80,65 82,58 Z"
          fill="url(#mapGradient)"
          stroke="hsl(var(--border) / 0.3)"
          strokeWidth="0.2"
        />

        {/* Hotspot markers */}
        {regions.map((region) => {
          const pulseSize = 1.5 + Math.sin((pulsePhase + regions.indexOf(region) * 20) * 0.1) * 0.5;
          const glowOpacity = 0.4 + Math.sin((pulsePhase + regions.indexOf(region) * 15) * 0.08) * 0.3;

          return (
            <g key={region.id}>
              {/* Outer glow ring */}
              <circle
                cx={region.x}
                cy={region.y}
                r={pulseSize * 2.5}
                fill="none"
                stroke={getHealthGlow(region.healthScore, glowOpacity * 0.5)}
                strokeWidth="0.3"
                opacity={1}
              />
              {/* Middle pulse ring */}
              <circle
                cx={region.x}
                cy={region.y}
                r={pulseSize * 1.5}
                fill={getHealthColor(region.healthScore)}
                opacity={glowOpacity * 0.3}
                filter="url(#glow)"
              />
              {/* Core dot */}
              <circle
                cx={region.x}
                cy={region.y}
                r={1}
                fill={getHealthColor(region.healthScore)}
                filter="url(#glow)"
                className="cursor-pointer"
                onMouseEnter={() => setActiveRegion(region)}
                onMouseLeave={() => setActiveRegion(null)}
                style={{ pointerEvents: "all" }}
              />
              {/* Interactive hit area */}
              <circle
                cx={region.x}
                cy={region.y}
                r={3}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setActiveRegion(region)}
                onMouseLeave={() => setActiveRegion(null)}
                style={{ pointerEvents: "all" }}
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {activeRegion && (
        <div
          className="absolute z-20 px-3 py-2 bg-card/95 backdrop-blur-sm border border-border/50 rounded-sm shadow-lg animate-fade-in pointer-events-none"
          style={{
            left: `${activeRegion.x}%`,
            top: `${activeRegion.y - 5}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="text-xs font-medium text-foreground">{activeRegion.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-lg font-bold"
              style={{ color: getHealthColor(activeRegion.healthScore) }}
            >
              {activeRegion.healthScore}
            </span>
            <span className="text-[10px] text-muted-foreground">/ 100</span>
            <span
              className={cn(
                "text-xs",
                activeRegion.trend === "up" && "text-emerald-500",
                activeRegion.trend === "down" && "text-amber-500",
                activeRegion.trend === "stable" && "text-muted-foreground"
              )}
            >
              {activeRegion.trend === "up" ? "↗" : activeRegion.trend === "down" ? "↘" : "→"}
            </span>
          </div>
          <p className="text-[9px] text-muted-foreground/60 mt-0.5">
            Pop: {activeRegion.population}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-4 text-[9px] text-muted-foreground/60">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "rgb(34, 197, 94)" }} />
          <span>Healthy (60+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "rgb(234, 179, 8)" }} />
          <span>Stressed (45-60)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "rgb(239, 68, 68)" }} />
          <span>Critical (&lt;45)</span>
        </div>
      </div>

      {/* Live indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[8px] text-muted-foreground/40 font-mono">GLOBAL VIEW</span>
      </div>
    </div>
  );
};

export default WorldFinancialMap;
