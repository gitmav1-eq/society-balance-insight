import { useState, useEffect } from "react";

const signals = [
  {
    insight: "Small delays in saving can delay retirement by years.",
    behavior: "Treating savings as optional, not essential",
    question: "What happens when convenience becomes a culture?",
  },
  {
    insight: "Debt normalized in one generation becomes inherited burden in the next.",
    behavior: "Credit-first purchasing as lifestyle baseline",
    question: "Who pays when we borrow from the future?",
  },
  {
    insight: "Gig work without safety nets shifts risk from systems to individuals.",
    behavior: "Flexibility without security",
    question: "Is independence worth the trade-off?",
  },
  {
    insight: "Financial literacy taught early compounds like interest.",
    behavior: "Learning money skills after mistakes, not before",
    question: "What if we prepared the next generation differently?",
  },
  {
    insight: "Healthcare costs rising faster than wages reshape life choices.",
    behavior: "Ignoring long-term health economics",
    question: "What gets sacrificed when health becomes unaffordable?",
  },
];

const DailySignal = () => {
  const [signal, setSignal] = useState(signals[0]);

  useEffect(() => {
    // Use day of year to select signal (changes daily)
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setSignal(signals[dayOfYear % signals.length]);
  }, []);

  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-mono text-[9px] tracking-[0.5em] text-muted-foreground/60 mb-8">
          DAILY SIGNAL
        </p>

        <div className="space-y-8">
          <div>
            <p className="text-lg md:text-xl leading-relaxed text-foreground/90 mb-2">
              {signal.insight}
            </p>
          </div>

          <div className="py-6 border-y border-border/20">
            <p className="font-mono text-[9px] tracking-widest text-muted-foreground/50 mb-2">
              NORMALIZED BEHAVIOR
            </p>
            <p className="text-sm text-muted-foreground">
              {signal.behavior}
            </p>
          </div>

          <div>
            <p className="font-mono text-[9px] tracking-widest text-muted-foreground/50 mb-3">
              QUESTION TO CONSIDER
            </p>
            <p className="text-lg italic text-primary/80">
              "{signal.question}"
            </p>
          </div>
        </div>

        <p className="mt-10 text-[10px] text-muted-foreground/40">
          Refreshes daily. No notifications. No manipulation.
        </p>
      </div>
    </section>
  );
};

export default DailySignal;