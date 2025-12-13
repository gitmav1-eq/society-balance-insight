import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { AnimatedOption } from "@/components/ui/AnimatedOption";
import CosmicParticles from "@/components/ui/CosmicParticles";
import AmbientNebula from "@/components/ui/AmbientNebula";

interface Scenario {
  question: string;
  options: { label: string; outcome: string }[];
}

const scenarios: Scenario[] = [
  {
    question: "If 1 out of 10 people started saving 10% of income, what improves first?",
    options: [
      { label: "Personal security", outcome: "Fewer people need emergency credit, reducing collective debt cycles." },
      { label: "Healthcare access", outcome: "Savings buffers reduce healthcare-related bankruptcies over time." },
      { label: "Retirement stability", outcome: "Compound growth means smaller savings now outperform larger savings later." },
    ],
  },
  {
    question: "If credit card use dropped by 20%, what shifts first?",
    options: [
      { label: "Consumer spending", outcome: "Short-term dip in spending, but long-term increase in sustainable consumption." },
      { label: "Banking profits", outcome: "Banks adapt models toward savings products rather than debt products." },
      { label: "Mental health", outcome: "Financial anxiety decreases as people feel more in control of their money." },
    ],
  },
  {
    question: "If gig workers gained retirement benefits, what changes?",
    options: [
      { label: "Workforce stability", outcome: "People can plan longer-term, reducing economic volatility." },
      { label: "Government burden", outcome: "Less strain on social safety nets in 30 years." },
      { label: "Family security", outcome: "Intergenerational wealth transfer becomes possible for more families." },
    ],
  },
];

const PerspectiveShift = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const { playTap, playReveal } = useAmbientSound();

  const scenario = scenarios[currentScenario];

  const handleSelect = (index: number) => {
    setSelectedOption(index);
    setShowOutcome(true);
    playReveal();
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowOutcome(false);
    setCurrentScenario((prev) => (prev + 1) % scenarios.length);
    playTap();
  };

  return (
    <section id="why" className="py-24 px-6 relative overflow-hidden">
      {/* Ambient nebula glow */}
      <AmbientNebula intensity="subtle" colorScheme="mixed" />
      
      {/* Cosmic particle background */}
      <CosmicParticles particleCount={30} showShootingStars intensity="low" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <p className="font-mono text-[9px] tracking-[0.5em] text-muted-foreground/50 mb-4">
            PERSPECTIVE SHIFT
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            A moment of reflection.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
            Not a game. Not a test. Just a quiet way to explore cause and effect.
          </p>
        </div>

        <div className="border border-border/30 bg-card/10 backdrop-blur-sm p-8 md:p-10">
          <p className="text-lg md:text-xl text-foreground/90 mb-8 leading-relaxed">
            {scenario.question}
          </p>

          <div className="space-y-3">
            {scenario.options.map((option, index) => (
              <AnimatedOption
                key={index}
                onClick={() => handleSelect(index)}
                isSelected={selectedOption === index}
                isDisabled={showOutcome && selectedOption !== index}
              >
                {option.label}
              </AnimatedOption>
            ))}
          </div>

          {showOutcome && selectedOption !== null && (
            <div className="mt-8 pt-6 border-t border-border/20 animate-fade-in">
              <p className="font-mono text-[9px] tracking-widest text-muted-foreground/50 mb-3">
                ONE PERSPECTIVE
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {scenario.options[selectedOption].outcome}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                className="mt-6 text-xs text-muted-foreground/60"
              >
                Try another scenario →
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-[10px] text-muted-foreground/30 mt-8">
          No right answers. Only understanding.
        </p>
      </div>
    </section>
  );
};

export default PerspectiveShift;
