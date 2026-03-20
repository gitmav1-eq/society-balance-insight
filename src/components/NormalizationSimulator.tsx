import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SimulatorSkeleton from "@/components/ui/SimulatorSkeleton";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { StarryButton } from "@/components/ui/StarryButton";
import CosmicParticles from "@/components/ui/CosmicParticles";
import AmbientNebula from "@/components/ui/AmbientNebula";
import SystemResponse from "@/components/SystemResponse";

gsap.registerPlugin(ScrollTrigger);

const presetBehaviors = [
  "Buying on EMI",
  "Delaying savings",
  "Lifestyle inflation",
  "Gig work without protection",
  "Credit-based consumption",
];

// Keywords that indicate financial/economic behavior topics
const financialKeywords = [
  "money", "saving", "savings", "spend", "spending", "debt", "loan", "credit", "emi",
  "invest", "investment", "income", "salary", "wage", "rent", "mortgage", "insurance",
  "retirement", "pension", "tax", "budget", "expense", "buy", "purchase", "consume",
  "consumption", "inflation", "wealth", "financial", "finance", "bank", "payment",
  "afford", "cost", "price", "cheap", "expensive", "frugal", "splurge", "luxury",
  "gig", "freelance", "work", "job", "career", "earning", "profit", "loss",
  "stock", "crypto", "asset", "liability", "interest", "compound", "emergency fund",
  "side hustle", "passive income", "subscription", "lease", "installment"
];

const MAX_INPUT_LENGTH = 200;

const validateFinancialTopic = (input: string): { valid: boolean; message?: string } => {
  const trimmed = input.trim().toLowerCase();
  
  if (trimmed.length < 5) {
    return { valid: false, message: "Please describe a behavior in more detail" };
  }
  
  if (trimmed.length > MAX_INPUT_LENGTH) {
    return { valid: false, message: `Please keep your input under ${MAX_INPUT_LENGTH} characters` };
  }
  
  // Check if input contains any financial keywords
  const hasFinancialContext = financialKeywords.some(keyword => 
    trimmed.includes(keyword.toLowerCase())
  );
  
  if (!hasFinancialContext) {
    return { 
      valid: false, 
      message: "Try describing a financial behavior like spending habits, saving patterns, or economic choices" 
    };
  }
  
  return { valid: true };
};

interface SimulationResult {
  individual: string;
  collective: string;
  pressure: string;
  lever: string;
}

// Simple in-memory cache for simulation results
const simulationCache = new Map<string, SimulationResult>();

interface NormalizationSimulatorProps {
  onRiskLevelChange?: (level: "low" | "medium" | "high" | null) => void;
  triggerBehavior?: string | null;
}

const NormalizationSimulator = ({ onRiskLevelChange, triggerBehavior }: NormalizationSimulatorProps) => {
  const [customInput, setCustomInput] = useState("");
  const [displayBehavior, setDisplayBehavior] = useState("");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [systemResponse, setSystemResponse] = useState<any>(null);
  const [systemResponseLoading, setSystemResponseLoading] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const { playTap, playStart, playComplete } = useAmbientSound();

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

  const handleSimulate = useCallback(async (behaviorToSimulate: string, skipValidation = false) => {
    if (!behaviorToSimulate.trim()) {
      toast.error("Select or enter a behavior");
      return;
    }

    // Validate custom inputs (skip for preset behaviors)
    if (!skipValidation) {
      const validation = validateFinancialTopic(behaviorToSimulate);
      if (!validation.valid) {
        setValidationError(validation.message || null);
        return;
      }
    }
    
    setValidationError(null);
    const cacheKey = behaviorToSimulate.toLowerCase().trim();
    setDisplayBehavior(behaviorToSimulate);
    setCustomInput("");

    // Check cache first
    if (simulationCache.has(cacheKey)) {
      setResult(simulationCache.get(cacheKey)!);
      playComplete();
      return;
    }

    setIsLoading(true);
    setResult(null);
    playStart();

    try {
      const { data, error } = await supabase.functions.invoke("simulate-behavior-v2", {
        body: { behavior: behaviorToSimulate },
      });

      if (error) throw error;
      if (data?.result && typeof data.result === 'object') {
        const rawResult = data.result;
        // Handle nested structure where AI puts all fields under 'individual'
        const source = typeof rawResult.individual === 'object' && rawResult.individual !== null
          ? rawResult.individual
          : rawResult;
        
        const normalizedResult: SimulationResult = {
          individual: String(source.individual || source.impact || ""),
          collective: String(source.collective || ""),
          pressure: String(source.pressure || ""),
          lever: String(source.lever || "")
        };
        // Cache the result
        simulationCache.set(cacheKey, normalizedResult);
        setResult(normalizedResult);
        playComplete();
      } else {
        toast.error("Simulation failed");
      }
    } catch {
      toast.error("System error");
    } finally {
      setIsLoading(false);
    }
  }, [playStart, playComplete]);

  const handleReset = useCallback(() => {
    setResult(null);
    setDisplayBehavior("");
    setCustomInput("");
    playTap();
  }, [playTap]);

  return (
    <section ref={sectionRef} id="simulator" className="py-24 px-6 relative overflow-hidden">
      {/* Ambient nebula glow */}
      <AmbientNebula intensity="subtle" colorScheme="primary" />
      
      {/* Cosmic particle background */}
      <CosmicParticles particleCount={35} showShootingStars intensity="low" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div ref={headerRef} className="text-center mb-14">
          <p className="sim-animate font-mono text-[9px] tracking-[0.5em] text-muted-foreground/50 mb-6">SIMULATION</p>
          <h2 className="sim-animate text-2xl md:text-3xl font-bold mb-4">
            What behavior should we zoom out on?
          </h2>
          <p className="sim-animate text-muted-foreground/70 max-w-md mx-auto text-sm leading-relaxed">
            Select a common behavior. See what happens when millions repeat it over decades.
          </p>
        </div>

        {!result && !isLoading ? (
          <div ref={formRef} className="border border-border/30 bg-card/20 backdrop-blur-sm p-8 md:p-10">
            <p className="font-mono text-[9px] tracking-widest text-muted-foreground mb-5">SELECT A BEHAVIOR</p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {presetBehaviors.map((preset, index) => (
                <StarryButton
                  key={index}
                  onClick={() => handleSimulate(preset, true)}
                  disabled={isLoading}
                  variant="outline"
                >
                  {preset}
                </StarryButton>
              ))}
            </div>

            <div className="border-t border-border/30 pt-6">
              <p className="font-mono text-[9px] tracking-widest text-muted-foreground mb-2">OR DESCRIBE YOUR OWN</p>
              <p className="text-[11px] text-muted-foreground/60 mb-3">
                Describe a financial behavior, spending habit, or economic choice
              </p>
              
              {/* Example prompts */}
              <div className="mb-4">
                <p className="text-[10px] text-muted-foreground/40 mb-2">Try something like:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Skipping health insurance to save money",
                    "Using BNPL for everyday purchases",
                    "Living paycheck to paycheck",
                    "Not building an emergency fund"
                  ].map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCustomInput(example)}
                      className="text-[10px] px-2 py-1 text-muted-foreground/60 hover:text-foreground border border-border/20 hover:border-border/50 rounded-sm transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="e.g., Taking multiple subscriptions, avoiding health insurance, relying on credit cards..."
                value={customInput}
                onChange={(e) => {
                  setCustomInput(e.target.value.slice(0, MAX_INPUT_LENGTH));
                  setValidationError(null);
                }}
                className={`min-h-[80px] resize-none bg-background/50 border-border/50 mb-2 ${
                  validationError ? 'border-destructive/50' : ''
                }`}
                disabled={isLoading}
              />
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-muted-foreground/50">
                  {customInput.length}/{MAX_INPUT_LENGTH}
                </span>
                {validationError && (
                  <span className="text-[11px] text-destructive">{validationError}</span>
                )}
              </div>
              <StarryButton onClick={() => handleSimulate(customInput)} disabled={isLoading || !customInput.trim()} className="w-full md:w-auto px-8">
                ✨ Explore
              </StarryButton>
            </div>
          </div>
        ) : isLoading ? (
          <SimulatorSkeleton />
        ) : result ? (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 bg-primary/10 border border-primary/30">
              <p className="font-mono text-[9px] tracking-widest text-primary mb-1">EXPLORING</p>
              <p className="text-lg font-medium">{displayBehavior}</p>
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

            {/* Related behaviors to keep users engaged */}
            <div className="pt-6 border-t border-border/20">
              <p className="font-mono text-[8px] tracking-widest text-muted-foreground/50 mb-3">
                EXPLORE RELATED PATTERNS
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {presetBehaviors
                  .filter(b => b.toLowerCase() !== displayBehavior.toLowerCase())
                  .slice(0, 3)
                  .map((behavior, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSimulate(behavior, true)}
                      className="text-[11px] px-3 py-1.5 text-muted-foreground/70 hover:text-foreground border border-border/30 hover:border-primary/50 hover:bg-primary/5 rounded-sm transition-colors"
                    >
                      {behavior}
                    </button>
                  ))}
              </div>
              <Button variant="outline" onClick={handleReset} size="sm" className="text-muted-foreground">
                ← Start fresh
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default NormalizationSimulator;
