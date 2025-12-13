import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "./ThemeProvider";
import SystemVisualization from "./three/SystemVisualization";

gsap.registerPlugin(ScrollTrigger);

const ImpactVisualization = () => {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content animation
      gsap.fromTo(
        contentRef.current?.querySelectorAll(".impact-animate") || [],
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      // Cards animation
      gsap.fromTo(
        cardsRef.current?.querySelectorAll(".impact-card") || [],
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="learn" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <SystemVisualization theme={theme} />
      </div>

      <div ref={contentRef} className="relative z-10 max-w-3xl mx-auto text-center">
        <p className="impact-animate font-mono text-[9px] tracking-[0.5em] text-muted-foreground/60 mb-4">
          WHY THIS MATTERS
        </p>
        
        <h2 className="impact-animate text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
          Individual choices become
          <br />
          <span className="text-muted-foreground">collective patterns.</span>
        </h2>
        
        <p className="impact-animate text-muted-foreground max-w-lg mx-auto mb-12 leading-relaxed text-sm">
          When millions repeat the same behavior, it reshapes economies, 
          policies, and generations. Understanding this is the first step.
        </p>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="impact-card p-5 border border-border/30 bg-background/80 backdrop-blur-sm">
            <p className="font-mono text-[9px] tracking-widest text-primary/70 mb-2">TODAY</p>
            <p className="text-base font-medium mb-1">Individual</p>
            <p className="text-xs text-muted-foreground">One choice, one moment</p>
          </div>
          
          <div className="impact-card p-5 border border-border/30 bg-background/80 backdrop-blur-sm">
            <p className="font-mono text-[9px] tracking-widest text-primary/70 mb-2">10 YEARS</p>
            <p className="text-base font-medium mb-1">Pattern</p>
            <p className="text-xs text-muted-foreground">Habits become trends</p>
          </div>
          
          <div className="impact-card p-5 border border-border/30 bg-background/80 backdrop-blur-sm">
            <p className="font-mono text-[9px] tracking-widest text-primary/70 mb-2">30 YEARS</p>
            <p className="text-base font-medium mb-1">Structure</p>
            <p className="text-xs text-muted-foreground">Generations inherit</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactVisualization;
