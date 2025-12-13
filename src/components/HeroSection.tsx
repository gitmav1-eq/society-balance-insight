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
      <div className="absolute inset-0 -z-10 opacity-60">
        <SystemVisualization theme={theme} />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/10 via-background/40 to-background" />

      <div ref={contentRef} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p className="hero-animate font-mono text-[10px] tracking-[0.5em] text-muted-foreground mb-6">
          UNDERSTAND HOW EVERYDAY DECISIONS MOVE SOCIETY
        </p>
        
        <h1 className="hero-animate text-4xl md:text-5xl lg:text-6xl leading-[1.15] mb-6 font-bold">
          Society is a shared spaceship.
          <br />
          <span className="text-primary">Small actions change its orbit.</span>
        </h1>
        
        <p className="hero-animate text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Explore how financial behaviors compound across decades.
          No jargon. No dashboards. Just clarity.
        </p>
        
        <div className="hero-animate flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onSimulateClick} size="lg" className="px-8 py-6 text-base font-medium">
            Explore a Behavior
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-[9px] font-mono tracking-widest opacity-60">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-border to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
