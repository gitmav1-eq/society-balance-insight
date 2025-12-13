import { Link } from "react-router-dom";
import Header from "@/components/Header";
import MultiFooter from "@/components/MultiFooter";

const simulations = [
  {
    id: "emi-dependence",
    behavior: "Buying everything on EMI",
    trajectory: "Over the next two decades, normalized EMI usage transforms consumption patterns fundamentally. Households allocate increasing portions of future income to past purchases, reducing financial flexibility.",
    systemicCost: "The burden falls disproportionately on middle-income households who use EMI to maintain lifestyle standards. Financial institutions absorb short-term risk but transfer long-term costs through interest accumulation.",
    forkUnchanged: "By 2045, household debt reaches unprecedented levels. Consumer spending becomes increasingly volatile as EMI obligations consume discretionary income.",
    forkCorrected: "With modest shifts toward savings-first consumption, households build resilience. EMI becomes a tool for major purchases rather than routine spending.",
    lever: "Mandatory waiting periods for non-essential EMI purchases, combined with simplified savings instruments."
  },
  {
    id: "delayed-retirement",
    behavior: "Delaying savings until 40",
    trajectory: "The normalization of delayed retirement savings creates a generation gap in financial security. Those who begin saving at 40 must save 3-4x the percentage of income to achieve comparable outcomes.",
    systemicCost: "The cost transfers across generations. Inadequate retirement savings force extended working years, reducing opportunities for younger workers.",
    forkUnchanged: "By 2050, a significant portion of the population faces retirement insecurity. Extended working lives become necessity rather than choice.",
    forkCorrected: "Early savings normalization, even at modest rates, dramatically improves outcomes through compounding.",
    lever: "Automatic enrollment in retirement savings at first employment with opt-out rather than opt-in design."
  },
  {
    id: "gig-economy",
    behavior: "Gig work without safety nets",
    trajectory: "As gig work expands without corresponding social protections, a growing segment of the workforce operates outside traditional safety nets. This creates a two-tier labor market.",
    systemicCost: "Workers bear immediate risks that were historically distributed across employers and society. Public systems eventually absorb these costs through emergency services.",
    forkUnchanged: "Labor market fragmentation accelerates. A significant portion of workers reach retirement age without adequate savings or pension coverage.",
    forkCorrected: "Portable benefits systems that follow workers rather than jobs create protection without limiting flexibility.",
    lever: "Universal portable benefits accounts funded through platform fees."
  },
  {
    id: "lifestyle-inflation",
    behavior: "Lifestyle inflation",
    trajectory: "When lifestyle expenses rise in lockstep with income, wealth accumulation stalls despite rising earnings. Higher incomes produce no greater financial security.",
    systemicCost: "High earners who save minimally create less capital for productive investment. Economic resilience decreases across income levels.",
    forkUnchanged: "A society of high earners with minimal savings emerges. Economic shocks create widespread distress across income levels.",
    forkCorrected: "Normalization of 'lifestyle lag' creates automatic savings. Financial security becomes correlated with behavior rather than income level.",
    lever: "Automatic savings escalation programs that capture a portion of each raise before lifestyle adjustment."
  },
  {
    id: "credit-consumption",
    behavior: "Credit-first living",
    trajectory: "When credit becomes the primary mechanism for consumption, present desires are systematically funded by future earnings. Spending precedes earning.",
    systemicCost: "Households transfer wealth to creditors through interest payments. The aggregate effect reduces consumer purchasing power over time.",
    forkUnchanged: "Consumer debt becomes structural. Interest payments consume growing shares of income. Economic growth becomes dependent on credit expansion.",
    forkCorrected: "A shift toward savings-funded consumption rebuilds household balance sheets. Economic growth becomes more stable.",
    lever: "Progressive interest rate structures that discourage long-term consumer debt accumulation."
  }
];

const SimulationLibrary = () => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />

      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4 animate-fade-in">
              SIMULATION LIBRARY
            </p>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Curated Projections
            </h1>
            
            <p className="text-muted-foreground max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Pre-generated analyses of common normalized behaviors and their long-term societal trajectories.
            </p>
          </div>

          <div className="space-y-12">
            {simulations.map((sim, index) => (
              <article 
                key={sim.id} 
                className="border border-border bg-card/30 p-8 animate-fade-in"
                style={{ animationDelay: `${0.1 * (index + 3)}s` }}
              >
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
                  BEHAVIOR #{String(index + 1).padStart(2, '0')}
                </p>
                <h2 className="font-serif text-2xl md:text-3xl mb-6">{sim.behavior}</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
                      TRAJECTORY
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{sim.trajectory}</p>
                  </div>

                  <div>
                    <h3 className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
                      SYSTEMIC COST
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{sim.systemicCost}</p>
                  </div>

                  <div>
                    <h3 className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
                      IF UNCHANGED
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{sim.forkUnchanged}</p>
                  </div>

                  <div>
                    <h3 className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
                      WITH CORRECTION
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{sim.forkCorrected}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
                    LEVER FOR CHANGE
                  </h3>
                  <p className="text-sm text-foreground">{sim.lever}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-16 pt-16 border-t border-border">
            <p className="font-serif text-2xl mb-6">
              Want to explore a different behavior?
            </p>
            <Link 
              to="/" 
              className="inline-block px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Run Your Own Simulation
            </Link>
          </div>
        </div>
      </main>

      <MultiFooter />
    </div>
  );
};

export default SimulationLibrary;
