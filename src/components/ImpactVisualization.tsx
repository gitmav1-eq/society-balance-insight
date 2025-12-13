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
    <section ref={sectionRef} id="impact" className="relative py-32 px-6 md:px-12 lg:px-24 border-t border-border overflow-hidden">
      <div className="absolute inset-0 z-0">
        <SystemVisualization theme={theme} />
      </div>

      <div ref={contentRef} className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="impact-animate font-mono text-[10px] tracking-[0.4em] text-primary mb-4">
          SYSTEM VISUALIZATION
        </p>
        
        <h2 className="impact-animate font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
          Nodes become systems.
          <br />
          <span className="text-muted-foreground">Systems become societies.</span>
        </h2>
        
        <p className="impact-animate text-muted-foreground max-w-xl mx-auto mb-16 leading-relaxed">
          Each point represents an individual. Lines form as behaviors scale. 
          The ring represents time — 30 years of compounding change.
        </p>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-4">
          <div className="impact-card p-6 border border-border bg-background/90 backdrop-blur-sm">
            <p className="font-mono text-[9px] tracking-widest text-primary mb-2">NODES</p>
            <p className="font-serif text-xl mb-1">Individuals</p>
            <p className="text-xs text-muted-foreground">Each making daily choices</p>
          </div>
          
          <div className="impact-card p-6 border border-border bg-background/90 backdrop-blur-sm">
            <p className="font-mono text-[9px] tracking-widest text-primary mb-2">LINES</p>
            <p className="font-serif text-xl mb-1">Systems</p>
            <p className="text-xs text-muted-foreground">Connections create patterns</p>
          </div>
          
          <div className="impact-card p-6 border border-border bg-background/90 backdrop-blur-sm">
            <p className="font-mono text-[9px] tracking-widest text-primary mb-2">RING</p>
            <p className="font-serif text-xl mb-1">Time</p>
            <p className="text-xs text-muted-foreground">Decades of accumulation</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactVisualization;
