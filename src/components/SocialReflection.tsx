import { useState, useEffect } from "react";

const reflections = [
  "I never thought small habits scale like this.",
  "This explains so much about generational wealth gaps.",
  "Compound consequences are terrifying and beautiful.",
  "This should be taught in every school.",
  "The 30-year view changed everything for me.",
  "Systems thinking finally clicked.",
  "Individual choices, collective outcomes.",
  "The fork metaphor is powerful.",
  "Understanding beats advice every time.",
  "Time is the ultimate leverage.",
];

const SocialReflection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % reflections.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">
            COLLECTIVE INSIGHT
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
            What surprised you most?
          </h2>
          <p className="text-muted-foreground">
            Anonymous reflections from system users
          </p>
        </div>

        {/* Rotating Reflection */}
        <div className="text-center py-16 border-y border-border">
          <p
            className={`font-serif text-2xl md:text-3xl italic text-muted-foreground transition-all duration-300 ${
              isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            "{reflections[currentIndex]}"
          </p>
        </div>

        {/* Reflection Grid */}
        <div className="grid md:grid-cols-2 gap-4 mt-12">
          {reflections.slice(0, 4).map((reflection, index) => (
            <div
              key={index}
              className="p-6 border border-border bg-card/30 hover:bg-card/50 transition-colors"
            >
              <p className="text-sm text-muted-foreground italic">"{reflection}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialReflection;
