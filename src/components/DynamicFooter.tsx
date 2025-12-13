type FooterMode = "educational" | "engagement";

interface DynamicFooterProps {
  mode?: FooterMode;
}

const DynamicFooter = ({ mode = "educational" }: DynamicFooterProps) => {
  if (mode === "engagement") {
    return (
      <footer className="border-t border-border/10 py-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-muted-foreground/70 mb-4">
            Return to explore another future.
          </p>
          <p className="text-[10px] text-muted-foreground/40">
            New scenarios added regularly.
          </p>
        </div>
        <div className="max-w-4xl mx-auto mt-8 pt-6 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs tracking-widest text-muted-foreground/50">SOCIETY.EXE</span>
          <span className="text-[9px] text-muted-foreground/30">Built for public good</span>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border/10">
      <section id="about" className="py-14 px-6 border-b border-border/10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-mono text-[9px] tracking-[0.5em] text-muted-foreground/30 mb-6">
            ABOUT
          </p>
          <p className="text-sm text-muted-foreground/80 leading-relaxed mb-4">
            SOCIETY.EXE helps people understand how everyday behaviors shape society over decades.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-[10px] text-muted-foreground/50">
            <span>Built for public good</span>
            <span>•</span>
            <span>Not financial advice</span>
            <span>•</span>
            <span>Made for everyone</span>
          </div>
        </div>
      </section>

      <div className="py-5 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs tracking-widest text-muted-foreground/40">SOCIETY.EXE</span>
          <span className="text-[9px] text-muted-foreground/25">No tracking · No accounts · Open understanding</span>
        </div>
      </div>
    </footer>
  );
};

export default DynamicFooter;