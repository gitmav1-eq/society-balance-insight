import { useEffect, useRef, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

const SystemVisualization = lazy(() => import("./three/SystemVisualization"));

interface HeroSectionProps {
  onSimulateClick: () => void;
}

const HeroSection = ({ onSimulateClick }: HeroSectionProps) => {
  const { theme } = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (animatedRef.current) return;
    animatedRef.current = true;

    const elements = contentRef.current?.querySelectorAll(".hero-animate");
    if (elements) {
      elements.forEach((el, i) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.opacity = "0";
        htmlEl.style.transform = "translateY(30px)";
        
        requestAnimationFrame(() => {
          setTimeout(() => {
            htmlEl.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
            htmlEl.style.opacity = "1";
            htmlEl.style.transform = "translateY(0)";
          }, 200 + i * 100);
        });
      });
    }
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 -z-10 opacity-40">
        <Suspense fallback={<div className="w-full h-full" />}>
          <SystemVisualization theme={theme} />
        </Suspense>
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/5 via-background/30 to-background" />

      <div ref={contentRef} className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <h1 className="hero-animate text-3xl md:text-4xl lg:text-5xl leading-[1.15] mb-6 font-bold">
          Zoom out.
          <br />
          <span className="text-primary/90">See the consequences clearly.</span>
        </h1>
        
        <p className="hero-animate text-base md:text-lg text-muted-foreground/70 max-w-md mx-auto mb-12 leading-relaxed">
          Small everyday choices, when repeated by millions, quietly shape the future.
        </p>
        
        <div className="hero-animate">
          <Button onClick={onSimulateClick} size="lg" className="px-10 py-6 text-sm font-medium">
            Start a Simulation
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
