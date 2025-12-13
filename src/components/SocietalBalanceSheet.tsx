const assets = [
  {
    title: "Human Capital",
    description: "Education, skills, and health that increase productivity and earning potential across generations.",
  },
  {
    title: "Social Trust",
    description: "Institutional credibility, civic engagement, and interpersonal reliability that enable cooperation at scale.",
  },
  {
    title: "Infrastructure",
    description: "Physical and digital systems that reduce friction in commerce, communication, and daily life.",
  },
  {
    title: "Financial Reserves",
    description: "Household savings, pension funds, and sovereign wealth that provide resilience against shocks.",
  },
];

const liabilities = [
  {
    title: "Household Debt",
    description: "Consumer credit, mortgages, and informal borrowing that constrains future spending and risk-taking capacity.",
  },
  {
    title: "Deferred Obligations",
    description: "Unfunded pensions, healthcare promises, and environmental remediation costs transferred to future taxpayers.",
  },
  {
    title: "Inequality Accumulation",
    description: "Wealth concentration that reduces social mobility and creates systemic fragility through demand suppression.",
  },
  {
    title: "Institutional Erosion",
    description: "Declining trust in governance, finance, and media that increases transaction costs across all domains.",
  },
];

const SocietalBalanceSheet = () => {
  return (
    <section id="balance-sheet" className="py-24 px-6 md:px-12 lg:px-24 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-sm tracking-widest text-muted-foreground mb-4">
          THE PUBLIC BALANCE SHEET
        </p>
        
        <h2 className="font-serif text-3xl md:text-4xl mb-6">
          A conceptual inventory
        </h2>
        
        <p className="text-muted-foreground mb-16 max-w-2xl">
          Every society maintains an invisible ledger. Understanding what we build versus what we borrow helps clarify the true cost of normalized behaviors.
        </p>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h3 className="font-mono text-sm tracking-widest text-muted-foreground mb-8 pb-4 border-b border-border">
              ASSETS WE BUILD
            </h3>
            <div className="space-y-8">
              {assets.map((item, index) => (
                <div key={index}>
                  <h4 className="font-serif text-xl mb-2">{item.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-sm tracking-widest text-muted-foreground mb-8 pb-4 border-b border-border">
              LIABILITIES WE ACCUMULATE
            </h3>
            <div className="space-y-8">
              {liabilities.map((item, index) => (
                <div key={index}>
                  <h4 className="font-serif text-xl mb-2">{item.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocietalBalanceSheet;
