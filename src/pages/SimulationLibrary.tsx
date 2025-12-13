import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const simulations = [
  {
    id: "emi-dependence",
    behavior: "Widespread EMI dependence for everyday purchases",
    trajectory: "Over the next two decades, normalized EMI usage transforms consumption patterns fundamentally. Households allocate increasing portions of future income to past purchases, reducing financial flexibility. As EMI becomes the default rather than exception, debt-to-income ratios rise across demographics, creating structural vulnerability to economic shocks.",
    systemicCost: "The burden falls disproportionately on middle-income households who use EMI to maintain lifestyle standards. Financial institutions absorb short-term risk but transfer long-term costs through interest accumulation. When economic contractions occur, the cascade of defaults concentrates losses on those least able to absorb them.",
    forkUnchanged: "By 2045, household debt reaches unprecedented levels. Consumer spending becomes increasingly volatile as EMI obligations consume discretionary income. Economic growth becomes debt-dependent, creating fragility that amplifies normal business cycle fluctuations.",
    forkCorrected: "With modest shifts toward savings-first consumption, households build resilience. EMI becomes a tool for major purchases rather than routine spending. Economic stability improves as consumption reflects actual income rather than borrowed future earnings.",
    lever: "Mandatory waiting periods for non-essential EMI purchases, combined with simplified savings instruments that offer comparable convenience to credit products."
  },
  {
    id: "delayed-retirement",
    behavior: "Delaying retirement savings until age 40",
    trajectory: "The normalization of delayed retirement savings creates a generation gap in financial security. Those who begin saving at 40 must save 3-4x the percentage of income to achieve comparable retirement outcomes. This mathematical reality compounds across society, creating systemic underfunding of retirement needs.",
    systemicCost: "The cost transfers across generations. Inadequate retirement savings force extended working years, reducing opportunities for younger workers. Public pension systems face increased strain. Healthcare systems absorb costs as financial stress affects health outcomes in later life.",
    forkUnchanged: "By 2050, a significant portion of the population faces retirement insecurity. Extended working lives become necessity rather than choice. Social safety nets strain under pressure they were not designed to bear.",
    forkCorrected: "Early savings normalization, even at modest rates, dramatically improves outcomes. Starting at 25 instead of 40, even with lower contribution rates, yields superior results through compounding. Retirement security becomes achievable for broader segments of society.",
    lever: "Automatic enrollment in retirement savings at first employment with opt-out rather than opt-in design, combined with employer matching incentives scaled to income level."
  },
  {
    id: "gig-economy",
    behavior: "Gig economy work without social protection",
    trajectory: "As gig work expands without corresponding social protections, a growing segment of the workforce operates outside traditional safety nets. This creates a two-tier labor market: those with employment protections and those without. The gap widens as gig work becomes not just supplementary but primary income for many.",
    systemicCost: "Workers bear immediate risks that were historically distributed across employers and society. When illness, injury, or economic downturn occurs, costs concentrate on individuals least equipped to absorb them. Public systems eventually absorb these costs through emergency services and poverty programs—a less efficient transfer than designed insurance mechanisms.",
    forkUnchanged: "Labor market fragmentation accelerates. A significant portion of workers reach retirement age without adequate savings or pension coverage. Social cohesion strains as economic experiences diverge dramatically based on employment classification.",
    forkCorrected: "Portable benefits systems that follow workers rather than jobs create protection without limiting flexibility. Gig platforms contribute to social insurance proportional to worker earnings. The flexibility of gig work combines with the security of traditional employment.",
    lever: "Universal portable benefits accounts funded through platform fees, providing healthcare, retirement, and income protection that transfers seamlessly between gig engagements."
  },
  {
    id: "lifestyle-inflation",
    behavior: "Lifestyle inflation matching income growth",
    trajectory: "When lifestyle expenses rise in lockstep with income, wealth accumulation stalls despite rising earnings. This pattern, normalized across professional classes, creates a paradox: higher incomes produce no greater financial security. The hedonic treadmill becomes an economic trap.",
    systemicCost: "High earners who save minimally create less capital for productive investment. The wealth gap widens not between income levels but between those who save and those who spend. Economic resilience decreases as even high-income households lack buffers against disruption.",
    forkUnchanged: "A society of high earners with minimal savings emerges. Economic shocks create widespread distress across income levels. Retirement becomes a luxury rather than an expectation, even for professionals.",
    forkCorrected: "Normalization of 'lifestyle lag'—allowing expenses to rise more slowly than income—creates automatic savings. Small percentage differences in savings rates compound dramatically over careers. Financial security becomes correlated with behavior rather than income level.",
    lever: "Automatic savings escalation programs that capture a portion of each raise before lifestyle adjustment occurs, making wealth building the default rather than the exception."
  },
  {
    id: "credit-consumption",
    behavior: "Credit-led consumption culture",
    trajectory: "When credit becomes the primary mechanism for consumption, present desires are systematically funded by future earnings. This temporal shift transforms economic relationships: spending precedes earning, and debt becomes the normal state rather than an exception to be resolved.",
    systemicCost: "Financial institutions profit from the spread between borrowing and lending rates, extracting value from the consumption cycle. Households transfer wealth to creditors through interest payments. The aggregate effect reduces consumer purchasing power over time, even as nominal spending increases.",
    forkUnchanged: "Consumer debt becomes structural rather than cyclical. Interest payments consume growing shares of income. Economic growth becomes dependent on credit expansion, creating inherent instability as debt levels approach sustainability limits.",
    forkCorrected: "A shift toward savings-funded consumption rebuilds household balance sheets. Credit remains available for major investments but ceases to fund routine consumption. Economic growth becomes more stable as it reflects actual productivity gains rather than debt accumulation.",
    lever: "Progressive interest rate structures that make small, short-term credit affordable while discouraging long-term consumer debt accumulation, combined with friction-free savings instruments."
  }
];

const SimulationLibrary = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-8 px-6 md:px-12 lg:px-24 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-mono text-sm tracking-widest text-muted-foreground hover:text-foreground transition-colors">
            SOCIETY.EXE
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Simulator
          </Link>
        </div>
      </header>

      <main className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-sm tracking-widest text-muted-foreground mb-4">
            SIMULATION LIBRARY
          </p>
          
          <h1 className="font-serif text-4xl md:text-5xl mb-6">
            Curated Projections
          </h1>
          
          <p className="text-muted-foreground mb-16 max-w-2xl text-lg leading-relaxed">
            Pre-generated analyses of common normalized behaviors and their long-term societal trajectories. Each simulation represents the collective impact of millions of individual choices.
          </p>

          <div className="space-y-16">
            {simulations.map((sim) => (
              <article key={sim.id} className="border-t border-border pt-12">
                <div className="mb-8">
                  <p className="font-mono text-xs text-muted-foreground mb-3">NORMALIZED BEHAVIOR</p>
                  <h2 className="font-serif text-2xl md:text-3xl">{sim.behavior}</h2>
                </div>

                <div className="space-y-10">
                  <section>
                    <h3 className="font-serif text-xl mb-4">Collective Trajectory</h3>
                    <p className="text-muted-foreground leading-relaxed">{sim.trajectory}</p>
                  </section>

                  <section>
                    <h3 className="font-serif text-xl mb-4">Systemic Cost</h3>
                    <p className="text-muted-foreground leading-relaxed">{sim.systemicCost}</p>
                  </section>

                  <section>
                    <h3 className="font-serif text-xl mb-4">The Fork</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-foreground mb-2">If unchanged:</p>
                        <p className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-border">
                          {sim.forkUnchanged}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-2">With correction:</p>
                        <p className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-border">
                          {sim.forkCorrected}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-serif text-xl mb-4">Lever for Change</h3>
                    <p className="text-muted-foreground leading-relaxed">{sim.lever}</p>
                  </section>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <section className="py-24 px-6 md:px-12 lg:px-24 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-serif text-2xl md:text-3xl mb-8">
            Want to explore a different behavior?
          </p>
          <Link 
            to="/" 
            className="inline-block px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Run Your Own Simulation
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SimulationLibrary;
