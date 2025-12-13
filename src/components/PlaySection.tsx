import OrbitGame from "./games/OrbitGame";
import TimeShiftGame from "./games/TimeShiftGame";

const PlaySection = () => {
  return (
    <section id="play" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-[9px] tracking-[0.4em] text-muted-foreground mb-3">
            INTERACTIVE EXPERIENCES
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Play</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            Short, reflective experiences. No scores. Just understanding.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <OrbitGame />
          <TimeShiftGame />
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-muted-foreground/60">
            Each takes 1-2 minutes. All optional. None track you.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlaySection;
