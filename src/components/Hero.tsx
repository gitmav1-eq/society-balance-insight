import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onSimulateClick: () => void;
  onWhyClick: () => void;
}

const Hero = ({ onSimulateClick, onWhyClick }: HeroProps) => {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center px-6 md:px-12 lg:px-24">
      <nav className="absolute top-0 left-0 right-0 py-8 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="font-mono text-sm tracking-widest text-muted-foreground">
            SOCIETY.EXE
          </p>
          <Link 
            to="/library" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Simulation Library
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl">
        <p className="font-mono text-sm tracking-widest text-muted-foreground mb-8">
          THE PUBLIC BALANCE SHEET
        </p>
        
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
          What we normalize today shapes the society we inherit.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
          SOCIETY.EXE simulates the long-term collective impact of everyday financial behaviors — before they become irreversible.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onSimulateClick}
            className="px-8 py-6 text-base"
          >
            Simulate a Normalized Behavior
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
    </section>
  );
};

export default Hero;
