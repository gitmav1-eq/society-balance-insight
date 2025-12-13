import { useState, useEffect, useCallback } from "react";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ConfettiCelebration from "@/components/ui/ConfettiCelebration";

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const tourSteps: TourStep[] = [
  {
    target: "#hero",
    title: "Welcome to SOCIETY.EXE",
    description: "A public intelligence system to understand how everyday financial behaviors shape our collective future.",
    position: "bottom",
  },
  {
    target: "#simulator",
    title: "Normalization Simulator",
    description: "Enter any financial behavior and see how it compounds across society over 10-30 years.",
    position: "top",
  },
  {
    target: "#why",
    title: "Perspective Shift",
    description: "Explore cause and effect through reflective scenarios. No right answers—only understanding.",
    position: "top",
  },
  {
    target: "#balance",
    title: "Public Balance Sheet",
    description: "Live global financial statistics and a world map showing regional financial health.",
    position: "top",
  },
];

const GuidedTour = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  const [showConfetti, setShowConfetti] = useState(false);

  // Check if tour should auto-start
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("society-exe-tour-completed");
    if (!hasSeenTour) {
      // Delay start to let page load
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Position tooltip relative to target element
  const updatePosition = useCallback(() => {
    if (!isActive) return;

    const step = tourSteps[currentStep];
    const target = document.querySelector(step.target);

    if (!target) return;

    const rect = target.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Set highlight position
    setHighlightStyle({
      top: rect.top + scrollY - 8,
      left: rect.left + scrollX - 8,
      width: rect.width + 16,
      height: rect.height + 16,
    });

    // Calculate tooltip position
    const tooltipWidth = 320;
    const tooltipHeight = 150;
    const padding = 16;

    let top = 0;
    let left = 0;

    switch (step.position) {
      case "top":
        top = rect.top + scrollY - tooltipHeight - padding;
        left = rect.left + scrollX + rect.width / 2 - tooltipWidth / 2;
        break;
      case "bottom":
        top = rect.bottom + scrollY + padding;
        left = rect.left + scrollX + rect.width / 2 - tooltipWidth / 2;
        break;
      case "left":
        top = rect.top + scrollY + rect.height / 2 - tooltipHeight / 2;
        left = rect.left + scrollX - tooltipWidth - padding;
        break;
      case "right":
        top = rect.top + scrollY + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + scrollX + padding;
        break;
    }

    // Keep tooltip in viewport
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding));
    top = Math.max(padding + scrollY, top);

    setTooltipStyle({ top, left, width: tooltipWidth });
  }, [isActive, currentStep]);

  // Update position on step change and scroll
  useEffect(() => {
    if (!isActive) return;

    const step = tourSteps[currentStep];
    const target = document.querySelector(step.target);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(updatePosition, 500);
    }

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isActive, currentStep, updatePosition]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = (showCelebration: boolean = true) => {
    setIsActive(false);
    localStorage.setItem("society-exe-tour-completed", "true");
    if (showCelebration) {
      setShowConfetti(true);
    }
  };

  const handleSkip = () => {
    handleComplete(false);
  };

  if (!isActive && !showConfetti) return null;

  const step = tourSteps[currentStep];

  return (
    <>
      <ConfettiCelebration 
        isActive={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      {isActive && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Dark overlay with cutout */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-auto" />

      {/* Highlight box */}
      <div
        className="absolute rounded-lg pointer-events-none transition-all duration-500 ease-out"
        style={{
          ...highlightStyle,
          boxShadow: `
            0 0 0 4px hsl(var(--primary) / 0.3),
            0 0 0 9999px hsl(var(--background) / 0.85),
            0 0 40px hsl(var(--primary) / 0.4)
          `,
        }}
      />

      {/* Tooltip */}
      <div
        className={cn(
          "absolute z-10 pointer-events-auto",
          "bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-2xl",
          "animate-fade-in"
        )}
        style={tooltipStyle}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-mono text-[9px] tracking-widest text-muted-foreground/50">
                STEP {currentStep + 1} OF {tourSteps.length}
              </p>
              <h3 className="font-semibold text-sm">{step.title}</h3>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="p-1 hover:bg-muted/50 rounded transition-colors"
            aria-label="Skip tour"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 pt-0">
          <button
            onClick={handleSkip}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tour
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <Button size="sm" onClick={handleNext} className="gap-1">
              {currentStep < tourSteps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                "Start Exploring"
              )}
            </Button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 pb-4">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                index === currentStep
                  ? "w-4 bg-primary"
                  : index < currentStep
                  ? "bg-primary/50"
                  : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>
        </div>
      )}
    </>
  );
};

export default GuidedTour;
