import OrbitGame from "./games/OrbitGame";
import TimeShiftGame from "./games/TimeShiftGame";
import SignalNoiseGame from "./games/SignalNoiseGame";

const PlaySection = () => {
  return (
    <section id="play" className="py-24 px-6 border-t border-border/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-[10px] tracking-[0.4em] text-primary mb-4">
            MINI EXPERIENCES
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Play</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Short, reflective experiences. No scores. No pressure. 
            Just understanding how systems respond to choices.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <OrbitGame />
          <TimeShiftGame />
          <SignalNoiseGame />
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            Each experience takes 1-2 minutes. All are optional. None track you.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlaySection;
