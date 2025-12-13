import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SocietyScene from "./three/SocietyScene";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";

interface HeroProps {
  onSimulateClick: () => void;
  onWhyClick: () => void;
}

const Hero = ({ onSimulateClick, onWhyClick }: HeroProps) => {
  const { theme } = useTheme();

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 overflow-hidden">
      <SocietyScene theme={theme} />
      
      <nav className="absolute top-0 left-0 right-0 py-6 px-6 md:px-12 lg:px-24 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="font-mono text-sm tracking-widest text-muted-foreground">
            SOCIETY.EXE
          </p>
          <div className="flex items-center gap-6">
            <Link 
              to="/library" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Library
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl">
        <p className="font-mono text-sm tracking-widest text-muted-foreground mb-8 animate-fade-in">
          THE PUBLIC BALANCE SHEET
        </p>
        
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          What we normalize today shapes the society we inherit.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
          SOCIETY.EXE simulates the long-term collective impact of everyday financial behaviors — before they become irreversible.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button
            onClick={onSimulateClick}
            className="px-8 py-6 text-base"
          >
            Run a Societal Simulation
          </Button>
          
          <Button
            variant="ghost"
            onClick={onWhyClick}
            className="px-8 py-6 text-base text-muted-foreground"
          >
            Why This Matters
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
          <span className="text-xs font-mono">SCROLL</span>
          <div className="w-px h-8 bg-border" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
