import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Scenario {
  id: string;
  question: string;
  context: string;
  outcome: string;
}

const scenarios: Scenario[] = [
  {
    id: "credit-normal",
    question: "What if buying on credit became the default for most purchases?",
    context: "When credit feels normal, spending exceeds earning. Debt becomes inherited, not chosen.",
    outcome: "Over 30 years, household debt doubles. Financial flexibility decreases. Stress becomes systemic.",
  },
  {
    id: "savings-optional",
    question: "What if saving money was seen as optional, not essential?",
    context: "When savings feel optional, emergencies become crises. The safety net shrinks for everyone.",
    outcome: "Retirement ages rise. Healthcare burdens shift to younger generations. Resilience fades.",
  },
  {
    id: "gig-unprotected",
    question: "What if gig work expanded without worker protections?",
    context: "Flexibility without security shifts all risk to individuals. The system benefits, workers absorb.",
    outcome: "Income volatility increases. Long-term planning becomes impossible. Collective bargaining disappears.",
  },
  {
    id: "education-delayed",
    question: "What if financial literacy was only taught after mistakes?",
    context: "Learning from failure is expensive. The cost compounds across generations.",
    outcome: "Inequality widens. Those with inherited knowledge pull ahead. Others catch up slowly, if ever.",
  },
];

const ExploreMode = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  return (
    <section id="ledger" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-[9px] tracking-[0.5em] text-muted-foreground/50 mb-4">
            SOCIETY LEDGER
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Explore what-if scenarios.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
            Select a question. See where it leads.
          </p>
        </div>

        {!selectedScenario ? (
          <div className="space-y-3">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario)}
                className="w-full text-left p-5 border border-border/20 bg-card/10 hover:bg-card/20 hover:border-border/40 transition-all duration-300 rounded-sm"
              >
                <p className="text-sm leading-relaxed">{scenario.question}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="p-6 border border-border/20 bg-card/10 mb-6">
              <p className="text-base font-medium mb-4 leading-relaxed">
                {selectedScenario.question}
              </p>
              
              <div className="space-y-4 pt-4 border-t border-border/10">
                <div>
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground/40 mb-2">
                    THE PATTERN
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedScenario.context}
                  </p>
                </div>
                
                <div>
                  <p className="font-mono text-[9px] tracking-widest text-muted-foreground/40 mb-2">
                    THE TRAJECTORY
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {selectedScenario.outcome}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedScenario(null)}
              className="text-xs text-muted-foreground/50"
            >
              ← Explore another question
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExploreMode;