import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import SystemVisualization from "./three/SystemVisualization";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onSimulateClick: () => void;
}

const HeroSection = ({ onSimulateClick }: HeroSectionProps) => {
  const { theme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = contentRef.current?.querySelectorAll(".hero-animate");
      if (elements) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out",
            delay: 0.2,
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 -z-10 opacity-50">
        <SystemVisualization theme={theme} />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/20 via-background/50 to-background" />

      <div ref={contentRef} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <p className="hero-animate font-mono text-[10px] tracking-[0.4em] text-primary mb-8">
          PUBLIC FINANCIAL INTELLIGENCE ENGINE
        </p>
        
        <h1 className="hero-animate font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-8 font-bold">
          What we repeat today becomes
          <br />
          tomorrow's <span className="text-primary">crisis</span> — or <span className="text-primary">strength</span>.
        </h1>
        
        <p className="hero-animate text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Simulate how everyday financial behaviors scale across society. 
          Understand before it's too late to change.
        </p>
        
        <div className="hero-animate flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onSimulateClick} size="lg" className="px-10 py-6 text-base font-medium">
            Run Simulation
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => document.querySelector("#explore")?.scrollIntoView({ behavior: "smooth" })}
            className="px-10 py-6 text-base"
          >
            Query System
          </Button>
        </div>

        <div className="hero-animate mt-16 flex items-center justify-center gap-6 text-[10px] font-mono text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            SYSTEM ACTIVE
          </span>
          <span>|</span>
          <span>PROJECTION RANGE: 10-30 YEARS</span>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-[9px] font-mono tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-border to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
