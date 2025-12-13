import GuessTheFuture from "./idle/GuessTheFuture";
import StabilityBuilder from "./idle/StabilityBuilder";

const IdleOrbit = () => {
  return (
    <section id="learn" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-[9px] tracking-[0.5em] text-muted-foreground/40 mb-4">
            IDLE ORBIT
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Learn while you drift.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
            No pressure. Just curiosity. Two quiet ways to understand cause and effect.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <GuessTheFuture />
          <StabilityBuilder />
        </div>

        <p className="text-center text-[10px] text-muted-foreground/30 mt-10">
          No scores. No competition. Only understanding.
        </p>
      </div>
    </section>
  );
};

export default IdleOrbit;