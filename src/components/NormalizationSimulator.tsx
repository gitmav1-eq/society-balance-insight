import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SimulatorSkeleton from "@/components/ui/SimulatorSkeleton";

gsap.registerPlugin(ScrollTrigger);

const presetBehaviors = [
  "EMI culture",
  "Delayed savings",
  "Lifestyle inflation",
  "Gig work without safety nets",
  "Credit dependence",
];

interface SimulationResult {
  individual: string;
  collective: string;
  pressure: string;
  lever: string;
}

const NormalizationSimulator = () => {
  const [behavior, setBehavior] = useState("");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current?.querySelectorAll(".sim-animate") || [],
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
        formRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSimulate = async (behaviorToSimulate: string) => {
    if (!behaviorToSimulate.trim()) {
      toast.error("Select or enter a behavior");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setBehavior(behaviorToSimulate);

    try {
      const { data, error } = await supabase.functions.invoke("simulate-behavior-v2", {
        body: { behavior: behaviorToSimulate },
      });

      if (error) throw error;
      if (data?.result) setResult(data.result);
      else toast.error("Simulation failed");
    } catch {
      toast.error("System error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setBehavior("");
  };

  return (
    <section ref={sectionRef} id="simulator" className="py-24 px-6 md:px-12 lg:px-24 border-t border-border/30">
      <div className="max-w-5xl mx-auto">
        <div ref={headerRef} className="text-center mb-16">
          <p className="sim-animate font-mono text-[9px] tracking-[0.4em] text-muted-foreground mb-3">BEHAVIOR SIMULATOR</p>
          <h2 className="sim-animate text-2xl md:text-3xl lg:text-4xl font-bold mb-3">What should we explore?</h2>
          <p className="sim-animate text-muted-foreground max-w-lg mx-auto text-sm">
            Select a behavior. See how it ripples across decades.
          </p>
        </div>

        {!result && !isLoading ? (
          <div ref={formRef} className="border border-border/30 bg-card/20 backdrop-blur-sm p-8 md:p-10">
            <p className="font-mono text-[9px] tracking-widest text-muted-foreground mb-5">SELECT A BEHAVIOR</p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {presetBehaviors.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handleSimulate(preset)}
                  disabled={isLoading}
                  className="px-4 py-2.5 text-sm border border-border/50 bg-background/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all disabled:opacity-50 rounded-sm"
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="border-t border-border/30 pt-6">
              <p className="font-mono text-[9px] tracking-widest text-muted-foreground mb-4">OR DESCRIBE YOUR OWN</p>
              <Textarea
                placeholder="Enter a behavior to explore..."
                value={behavior}
                onChange={(e) => setBehavior(e.target.value)}
                className="min-h-[80px] resize-none bg-background/50 border-border/50 mb-4"
                disabled={isLoading}
              />
              <Button onClick={() => handleSimulate(behavior)} disabled={isLoading || !behavior.trim()} className="w-full md:w-auto px-8">
                Explore
              </Button>
            </div>
          </div>
        ) : isLoading ? (
          <SimulatorSkeleton />
        ) : result ? (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 bg-primary/10 border border-primary/30">
              <p className="font-mono text-[9px] tracking-widest text-primary mb-1">EXPLORING</p>
              <p className="text-lg font-medium">{behavior}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 border border-border/30 bg-card/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground">INDIVIDUAL IMPACT</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.individual}</p>
              </div>

              <div className="p-6 border border-border/30 bg-card/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full" />
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground">COLLECTIVE IMPACT (10-30 YEARS)</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.collective}</p>
              </div>

              <div className="p-6 border border-border/30 bg-card/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-orange-500 rounded-full" />
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground">PRESSURE POINTS</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.pressure}</p>
              </div>

              <div className="p-6 border border-primary/30 bg-primary/5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  <p className="font-mono text-[9px] tracking-widest text-primary">LEVER FOR CHANGE</p>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{result.lever}</p>
              </div>
            </div>

            <Button variant="outline" onClick={handleReset} size="sm" className="text-muted-foreground">
              ← Explore another
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default NormalizationSimulator;
