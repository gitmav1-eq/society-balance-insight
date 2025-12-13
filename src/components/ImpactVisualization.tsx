import { useTheme } from "./ThemeProvider";
import SocietyVisualization from "./three/SocietyVisualization";

const ImpactVisualization = () => {
  const { theme } = useTheme();

  return (
    <section id="impact" className="relative py-32 px-6 md:px-12 lg:px-24 border-t border-border overflow-hidden">
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0">
        <SocietyVisualization theme={theme} intensity={0.7} />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">
          SOCIETY IMPACT
        </p>
        
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-8">
          The sphere represents society.
          <br />
          <span className="text-muted-foreground">Each node, a normalized behavior.</span>
        </h2>
        
        <p className="text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          As behaviors scale across millions of people and decades of time, 
          the system transforms. Small normalizations compound into structural change.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 border border-border bg-background/80 backdrop-blur-sm">
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
              TIME HORIZON
            </p>
            <p className="font-serif text-2xl mb-1">10-30 Years</p>
            <p className="text-xs text-muted-foreground">Projection window</p>
          </div>
          
          <div className="p-6 border border-border bg-background/80 backdrop-blur-sm">
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
              SCALE FACTOR
            </p>
            <p className="font-serif text-2xl mb-1">Millions</p>
            <p className="text-xs text-muted-foreground">Individual → Collective</p>
          </div>
          
          <div className="p-6 border border-border bg-background/80 backdrop-blur-sm">
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
              COMPOUND EFFECT
            </p>
            <p className="font-serif text-2xl mb-1">Exponential</p>
            <p className="text-xs text-muted-foreground">Small → Systemic</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactVisualization;
