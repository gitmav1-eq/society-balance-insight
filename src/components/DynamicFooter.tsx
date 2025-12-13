const DynamicFooter = () => {
  return (
    <footer className="border-t border-border/10">
      {/* About Section */}
      <section id="about" className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">
            <div>
              <h3 className="font-mono text-[10px] tracking-widest text-muted-foreground/50 mb-4">
                ABOUT THE PROJECT
              </h3>
              <p className="text-sm text-muted-foreground/70 leading-relaxed">
                A public-thinking experiment that makes invisible consequences visible.
              </p>
            </div>
            
            <div>
              <h3 className="font-mono text-[10px] tracking-widest text-muted-foreground/50 mb-4">
                WHY THIS EXISTS
              </h3>
              <p className="text-sm text-muted-foreground/70 leading-relaxed">
                To help society think long-term in a world designed for short-term thinking.
              </p>
            </div>
            
            <div>
              <h3 className="font-mono text-[10px] tracking-widest text-muted-foreground/50 mb-4">
                FOR STUDENTS & CITIZENS
              </h3>
              <p className="text-sm text-muted-foreground/70 leading-relaxed">
                No finance background needed. Clear perspective for everyone.
              </p>
            </div>
            
            <div>
              <h3 className="font-mono text-[10px] tracking-widest text-muted-foreground/50 mb-4">
                BUILT FOR THE FUTURE
              </h3>
              <p className="text-sm text-muted-foreground/70 leading-relaxed">
                Understanding today's choices shapes tomorrow's reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Line */}
      <div className="py-6 px-6 border-t border-border/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground/50 italic">
            "This is a public-thinking experiment."
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-5 px-6 border-t border-border/10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs tracking-widest text-muted-foreground/40">
            SOCIETY.EXE
          </span>
          <div className="flex items-center gap-6 text-[10px] text-muted-foreground/30">
            <span>Built for public good</span>
            <span>•</span>
            <span>Not financial advice</span>
            <span>•</span>
            <span>No tracking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DynamicFooter;
