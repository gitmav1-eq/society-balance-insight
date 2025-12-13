const MultiFooter = () => {
  return (
    <footer className="border-t border-border">
      {/* Footer 1: Insight */}
      <div className="py-16 px-6 md:px-12 lg:px-24 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground mb-4">
            INSIGHT
          </p>
          <p className="font-serif text-2xl md:text-3xl leading-relaxed">
            Societies don't collapse from one mistake.
            <br />
            <span className="text-muted-foreground">They collapse from normalized ones.</span>
          </p>
        </div>
      </div>

      {/* Footer 2: Education */}
      <div className="py-12 px-6 md:px-12 lg:px-24 border-b border-border bg-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground mb-3">
            PURPOSE
          </p>
          <p className="text-muted-foreground">
            Built for awareness, not advice. Understanding is the first correction.
          </p>
        </div>
      </div>

      {/* Footer 3: Share */}
      <div id="about" className="py-12 px-6 md:px-12 lg:px-24 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground mb-3">
            SHARE
          </p>
          <p className="text-muted-foreground mb-4">
            If one insight changed how you think, share it.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-4 py-2 text-xs border border-border hover:bg-accent transition-colors">
              Copy Link
            </button>
            <button className="px-4 py-2 text-xs border border-border hover:bg-accent transition-colors">
              Share Insight
            </button>
          </div>
        </div>
      </div>

      {/* Footer 4: Identity */}
      <div className="py-8 px-6 md:px-12 lg:px-24 bg-card/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm tracking-widest font-bold">SOCIETY.EXE</span>
            <span className="text-muted-foreground text-sm">—</span>
            <span className="text-muted-foreground text-sm">Public Intelligence for the Future</span>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            © 2024 — Built for collective understanding
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MultiFooter;
