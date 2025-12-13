import { useState } from "react";
import { Play, X, ChevronRight, Sparkles, MessageCircle, TrendingUp, Eye, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
}

const features: Feature[] = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Normalization Simulator",
    description: "See how everyday financial behaviors scale into societal outcomes over 10-30 years.",
    action: "Select a behavior → Watch how it compounds across society",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "Perspective Shift",
    description: "Explore cause and effect through reflective scenarios.",
    action: "Choose an option → Discover unexpected outcomes",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Public Balance Sheet",
    description: "Live global financial statistics updating in real-time.",
    action: "Observe → Hover over the world map for regional insights",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: "The Archivist",
    description: "AI-powered guide to help you understand systemic concepts.",
    action: "Press 'A' or click the chat icon → Ask any question",
  },
];

interface DemoGuideProps {
  className?: string;
  onRestartTour?: () => void;
}

const DemoGuide = ({ className, onRestartTour }: DemoGuideProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [hasSeenDemo, setHasSeenDemo] = useState(() => {
    return localStorage.getItem("society-exe-demo-seen") === "true";
  });

  const handleOpen = () => {
    setIsOpen(true);
    setActiveFeature(0);
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("society-exe-demo-seen", "true");
    setHasSeenDemo(true);
  };

  const handleNext = () => {
    if (activeFeature < features.length - 1) {
      setActiveFeature((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={handleOpen}
        className={cn(
          "fixed bottom-6 left-6 z-50 group",
          "w-12 h-12 rounded-full",
          "bg-primary/10 border border-primary/30 backdrop-blur-sm",
          "flex items-center justify-center",
          "transition-all duration-300",
          "hover:bg-primary/20 hover:border-primary/50 hover:scale-110",
          "shadow-[0_0_20px_hsl(var(--primary)/0.2)]",
          className
        )}
        aria-label="How to use this site"
      >
        <HelpCircle className="w-5 h-5 text-primary" />
        
        {/* Pulse indicator for first-time users */}
        {!hasSeenDemo && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
        )}
        
        {/* Tooltip */}
        <span className="absolute left-full ml-3 px-3 py-1.5 bg-card/90 backdrop-blur-sm border border-border/50 rounded text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          How does this work?
        </span>
      </button>

      {/* Demo Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl bg-background/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Play className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="block">Quick Guide</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Understand society in 60 seconds
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === activeFeature
                      ? "w-6 bg-primary"
                      : index < activeFeature
                      ? "bg-primary/50"
                      : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>

            {/* Feature Card */}
            <div className="relative overflow-hidden rounded-lg border border-border/30 bg-card/30 p-6 min-h-[200px]">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute inset-0 p-6 transition-all duration-500",
                    index === activeFeature
                      ? "opacity-100 translate-x-0"
                      : index < activeFeature
                      ? "opacity-0 -translate-x-full"
                      : "opacity-0 translate-x-full"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-primary/80 bg-primary/5 border border-primary/20 rounded px-3 py-2">
                        <ChevronRight className="w-3 h-3" />
                        <span>{feature.action}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handleClose}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip guide
              </button>
              
              <Button
                onClick={handleNext}
                className="gap-2"
              >
                {activeFeature < features.length - 1 ? (
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

          {/* Restart Tour Button */}
          {onRestartTour && (
            <button
              onClick={() => {
                handleClose();
                onRestartTour();
              }}
              className="w-full mt-4 py-2 text-xs text-primary/70 hover:text-primary border border-primary/20 hover:border-primary/40 rounded transition-colors"
            >
              🎯 Take the Interactive Tour
            </button>
          )}

          {/* Keyboard hint */}
          <p className="text-center text-[10px] text-muted-foreground/50 mt-4">
            Press <kbd className="px-1.5 py-0.5 bg-muted/50 rounded text-[9px]">?</kbd> anytime for keyboard shortcuts
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DemoGuide;
