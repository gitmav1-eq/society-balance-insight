import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import SocietyVisualization from "./three/SocietyVisualization";

interface HeroSectionProps {
  onSimulateClick: () => void;
}

const HeroSection = ({ onSimulateClick }: HeroSectionProps) => {
  const { theme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = heroRef.current?.querySelectorAll(".animate-on-load");
    elements?.forEach((el, index) => {
      (el as HTMLElement).style.animationDelay = `${index * 0.1}s`;
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Three.js Background */}
      <div className="absolute inset-0 -z-10 opacity-60">
        <SocietyVisualization theme={theme} intensity={0.3} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/30 via-background/60 to-background" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <p className="animate-on-load animate-fade-in font-mono text-xs tracking-[0.3em] text-muted-foreground mb-6">
          PUBLIC INTELLIGENCE SYSTEM
        </p>
        
        <h1 className="animate-on-load animate-fade-in font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6 font-bold">
          What we repeat today becomes tomorrow's{" "}
          <span className="text-primary">crisis</span> — or{" "}
          <span className="text-primary">strength</span>.
        </h1>
        
        <p className="animate-on-load animate-fade-in text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Simulate how everyday financial behaviors scale across society.
        </p>
        
        <div className="animate-on-load animate-fade-in flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onSimulateClick}
            size="lg"
            className="px-8 py-6 text-base font-medium"
          >
            Run Simulation
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => document.querySelector("#explore")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-6 text-base"
          >
            Explore System
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
