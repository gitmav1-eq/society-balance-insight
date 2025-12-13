import { useTheme } from "./ThemeProvider";
import SystemVisualization from "./three/SystemVisualization";

const ImpactVisualization = () => {
  const { theme } = useTheme();

  return (
    <section id="impact" className="relative py-32 px-6 md:px-12 lg:px-24 border-t border-border overflow-hidden">
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0">
        <SystemVisualization theme={theme} />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="font-mono text-[10px] tracking-[0.4em] text-primary mb-4">
          SYSTEM VISUALIZATION
        </p>
        
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
          Nodes become systems.
          <br />
          <span className="text-muted-foreground">Systems become societies.</span>
        </h2>
        
        <p className="text-muted-foreground max-w-xl mx-auto mb-16 leading-relaxed">
          Each point represents an individual. Lines form as behaviors scale. 
          The ring represents time — 30 years of compounding change.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-6 border border-border bg-background/90 backdrop-blur-sm">
            <p className="font-mono text-[9px] tracking-widest text-primary mb-2">
              NODES
            </p>
            <p className="font-serif text-xl mb-1">Individuals</p>
            <p className="text-xs text-muted-foreground">Each making daily choices</p>
          </div>
          
          <div className="p-6 border border-border bg-background/90 backdrop-blur-sm">
            <p className="font-mono text-[9px] tracking-widest text-primary mb-2">
              LINES
            </p>
            <p className="font-serif text-xl mb-1">Systems</p>
            <p className="text-xs text-muted-foreground">Connections create patterns</p>
          </div>
          
          <div className="p-6 border border-border bg-background/90 backdrop-blur-sm">
            <p className="font-mono text-[9px] tracking-widest text-primary mb-2">
              RING
            </p>
            <p className="font-serif text-xl mb-1">Time</p>
            <p className="text-xs text-muted-foreground">Decades of accumulation</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactVisualization;
