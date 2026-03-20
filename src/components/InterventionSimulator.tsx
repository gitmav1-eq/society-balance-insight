import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TrendingDown, TrendingUp, ArrowRight } from "lucide-react";
import AmbientNebula from "@/components/ui/AmbientNebula";

gsap.registerPlugin(ScrollTrigger);

const interventionExamples = [
  {
    label: "Savings Nudges Introduced",
    noChange: "Average savings rate falls below 5%. Emergency fund coverage drops to 2 weeks for most households.",
    intervention: "Behavioral nudges increase savings rate by 3.2%. Emergency fund coverage rises to 6 weeks within 5 years.",
  },
  {
    label: "Credit Usage Reduced",
    noChange: "Household debt-to-income ratio climbs past 45%. Credit defaults rise by 18% over the next decade.",
    intervention: "Credit awareness programs reduce revolving debt by 12%. Default rates stabilize within 4 years.",
  },
  {
    label: "Financial Awareness Increases",
    noChange: "67% of working adults remain financially illiterate. Retirement readiness continues to decline.",
    intervention: "Structured financial education reaches 30% of adults. Long-term investment participation rises by 22%.",
  },
];

const InterventionSimulator = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeExample, setActiveExample] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveExample((prev) => (prev + 1) % interventionExamples.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current?.querySelectorAll(".int-animate") || [],
        { opacity: 0, y: 30, filter: "blur(4px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 0.7, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
        }
      );
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const example = interventionExamples[activeExample];

  return (
    <section ref={sectionRef} id="interventions" className="py-24 px-6 relative overflow-hidden">
      <AmbientNebula intensity="subtle" colorScheme="primary" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div ref={headerRef} className="text-center mb-14">
          <p className="int-animate font-mono text-[9px] tracking-[0.5em] text-muted-foreground/50 mb-6">
            INTERVENTION
          </p>
          <h2 className="int-animate text-2xl md:text-3xl font-bold mb-4 text-shadow-glow">
            What if the system intervenes?
          </h2>
          <p className="int-animate text-muted-foreground/70 max-w-md mx-auto text-sm leading-relaxed">
            Compare two futures: one where nothing changes, and one where small systemic shifts redirect the trajectory.
          </p>
        </div>

        <div ref={cardsRef}>
          {/* Scenario selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {interventionExamples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setActiveExample(i)}
                className={`text-[11px] px-3 py-1.5 border rounded-sm transition-all duration-300 ${
                  i === activeExample
                    ? "border-primary/50 bg-primary/10 text-foreground"
                    : "border-border/30 text-muted-foreground/60 hover:border-border/50 hover:text-foreground"
                }`}
              >
                {ex.label}
              </button>
            ))}
          </div>

          {/* Comparison cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-destructive/20 bg-destructive/5 p-6 transition-all duration-500">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-4 h-4 text-destructive/70" />
                <p className="font-mono text-[9px] tracking-[0.3em] text-destructive/70">SCENARIO A — NO CHANGE</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{example.noChange}</p>
            </div>

            <div className="border border-emerald-500/20 bg-emerald-500/5 p-6 transition-all duration-500">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-emerald-500/70" />
                <p className="font-mono text-[9px] tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
                  SCENARIO B — SMALL INTERVENTION
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{example.intervention}</p>
            </div>
          </div>

          {/* Insight footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted-foreground/50">
            <ArrowRight className="w-3 h-3" />
            <span>Small systemic shifts compound into measurable change</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterventionSimulator;
