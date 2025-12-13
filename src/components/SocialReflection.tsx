import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reflections = [
  "I never thought small habits scale like this.",
  "This explains generational wealth gaps.",
  "Compound consequences are real.",
  "This should be taught in every school.",
  "The 30-year view changed everything.",
  "Systems thinking finally makes sense.",
  "Individual choices, collective outcomes.",
  "Understanding beats advice.",
  "Time is the ultimate leverage.",
  "Awareness is the first step.",
];

const SocialReflection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current?.querySelectorAll(".reflect-animate") || [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        gridRef.current?.querySelectorAll(".reflect-card") || [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % reflections.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} id="reflection" className="py-24 px-6 md:px-12 lg:px-24 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div ref={contentRef} className="text-center mb-12">
          <p className="reflect-animate font-mono text-[10px] tracking-[0.4em] text-primary mb-4">COLLECTIVE INSIGHT</p>
          <h2 className="reflect-animate font-serif text-3xl md:text-4xl lg:text-5xl mb-4">What surprised you most?</h2>
          <p className="reflect-animate text-muted-foreground text-sm">Anonymous reflections from system users</p>
        </div>

        <div className="reflect-animate text-center py-12 border-y border-border bg-card/20">
          <p className={`font-serif text-xl md:text-2xl lg:text-3xl italic transition-all duration-300 ${isAnimating ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}>
            "{reflections[currentIndex]}"
          </p>
          <p className="mt-4 font-mono text-[9px] tracking-widest text-muted-foreground">
            — USER #{String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 gap-3 mt-8">
          {reflections.slice(0, 4).map((reflection, index) => (
            <div key={index} className="reflect-card p-4 border border-border bg-card/20 hover:bg-card/40 transition-colors">
              <p className="text-sm text-muted-foreground italic">"{reflection}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialReflection;
