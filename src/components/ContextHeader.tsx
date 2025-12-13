import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

interface ContextHeaderProps {
  activeSection: string;
}

const sectionData: Record<string, { title: string; insight: string }> = {
  hero: { title: "WELCOME", insight: "Understanding precedes change" },
  simulator: { title: "SIMULATE", insight: "Project collective trajectories" },
  impact: { title: "LEARN", insight: "Individual → Collective → Systemic" },
  play: { title: "PLAY", insight: "Reflective mini-experiences" },
  explore: { title: "WHY IT MATTERS", insight: "Query the intelligence system" },
  reflection: { title: "REFLECTION", insight: "Collective insights from users" },
};

const ContextHeader = ({ activeSection }: ContextHeaderProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY > 400);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const current = sectionData[activeSection] || sectionData.hero;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-40 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <div className="bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] tracking-widest text-primary">
              {current.title}
            </span>
            <span className="text-border hidden sm:inline">|</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {current.insight}
            </span>
          </div>
          <button
            onClick={scrollToTop}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContextHeader;
