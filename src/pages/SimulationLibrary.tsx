import { Link } from "react-router-dom";
import Header from "@/components/Header";
import DynamicFooter from "@/components/DynamicFooter";

const simulations = [
  {
    id: "emi-dependence",
    behavior: "EMI culture",
    individual: "Monthly obligations reduce financial flexibility and increase stress around cash flow management.",
    collective: "Over 20 years, widespread EMI dependence shifts consumption from savings-funded to debt-funded, reducing household resilience across the economy.",
    pressure: "Stress accumulates in middle-income households, financial institutions during downturns, and future generations inheriting normalized debt.",
    lever: "Mandatory cooling-off periods for non-essential EMI purchases, combined with simplified savings products."
  },
  {
    id: "delayed-savings",
    behavior: "Delayed savings",
    individual: "Current consumption maximizes, but compound growth opportunity diminishes significantly with each year of delay.",
    collective: "A generation starting savings at 40 vs 25 faces 3-4x higher required savings rates, creating systemic retirement insecurity.",
    pressure: "Public pension systems, healthcare infrastructure, and younger workers competing for extended employment.",
    lever: "Automatic enrollment at first employment with opt-out design and employer matching scaled to income."
  },
  {
    id: "lifestyle-inflation",
    behavior: "Lifestyle inflation",
    individual: "Rising income produces no additional security as expenses expand to match, trapping high earners in financial fragility.",
    collective: "Professional classes with minimal savings create economic volatility and reduce productive investment capital.",
    pressure: "Retirement systems, emergency services during crises, and wealth concentration accelerating inequality.",
    lever: "Automatic savings escalation programs that capture raise percentages before lifestyle adjustment."
  },
  {
    id: "gig-work",
    behavior: "Gig work without safety nets",
    individual: "Flexibility gained at cost of insurance, retirement contributions, and income stability during disruptions.",
    collective: "Two-tier labor market emerges with protected and unprotected workers, widening economic security gaps.",
    pressure: "Emergency services, poverty programs, and social cohesion as economic experiences diverge dramatically.",
    lever: "Portable benefits accounts funded through platform fees, following workers across gig engagements."
  },
  {
    id: "credit-dependence",
    behavior: "Credit dependence",
    individual: "Present consumption funded by future earnings, with interest payments reducing long-term purchasing power.",
    collective: "Economic growth becomes debt-dependent, creating structural fragility as leverage approaches sustainability limits.",
    pressure: "Household balance sheets, creditor institutions during contractions, and monetary policy flexibility.",
    lever: "Progressive interest structures discouraging long-term consumer debt with friction-free savings alternatives."
  }
];

const SimulationLibrary = () => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />

      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-mono text-[10px] tracking-[0.4em] text-primary mb-4 animate-fade-in">
              SIMULATION ARCHIVE
            </p>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Curated Projections
            </h1>
            
            <p className="text-muted-foreground max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Pre-computed analyses of common normalized behaviors and their systemic trajectories.
            </p>
          </div>

          <div className="space-y-8">
            {simulations.map((sim, index) => (
              <article 
                key={sim.id} 
                className="border border-border bg-card/30 animate-fade-in"
                style={{ animationDelay: `${0.1 * (index + 3)}s` }}
              >
                <div className="p-6 border-b border-border">
                  <p className="font-mono text-[9px] tracking-widest text-primary mb-2">
                    BEHAVIOR #{String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="font-serif text-2xl md:text-3xl">{sim.behavior}</h2>
                </div>

                <div className="grid md:grid-cols-2">
                  <div className="p-6 border-b md:border-b-0 md:border-r border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      <p className="font-mono text-[9px] tracking-widest text-muted-foreground">
                        INDIVIDUAL
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{sim.individual}</p>
                  </div>

                  <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full" />
                      <p className="font-mono text-[9px] tracking-widest text-muted-foreground">
                        COLLECTIVE
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{sim.collective}</p>
                  </div>

                  <div className="p-6 border-b md:border-b-0 md:border-r border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full" />
                      <p className="font-mono text-[9px] tracking-widest text-muted-foreground">
                        PRESSURE POINTS
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{sim.pressure}</p>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-primary rounded-full" />
                      <p className="font-mono text-[9px] tracking-widest text-primary">
                        LEVER
                      </p>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{sim.lever}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-16 pt-16 border-t border-border">
            <p className="font-serif text-2xl mb-6">
              Run your own simulation
            </p>
            <Link 
              to="/" 
              className="inline-block px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Open Simulator
            </Link>
          </div>
        </div>
      </main>

      <DynamicFooter />
    </div>
  );
};

export default SimulationLibrary;
