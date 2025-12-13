import * as React from "react";
import { cn } from "@/lib/utils";

interface AnimatedOptionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isSelected?: boolean;
  isDisabled?: boolean;
}

const AnimatedOption = React.forwardRef<HTMLButtonElement, AnimatedOptionProps>(
  ({ className, children, isSelected, isDisabled, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [stars, setStars] = React.useState<Array<{ id: number; x: number; y: number; opacity: number }>>([]);

    React.useEffect(() => {
      // Create initial stars
      const initialStars = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.2,
      }));
      setStars(initialStars);
    }, []);

    return (
      <button
        ref={ref}
        className={cn(
          "relative w-full text-left p-4 border transition-all duration-300 overflow-hidden group rounded-sm",
          "hover:scale-[1.01] active:scale-[0.99]",
          isSelected
            ? "border-primary/50 bg-primary/10 shadow-[0_0_30px_hsl(var(--primary)/0.15)]"
            : "border-border/30 hover:border-primary/40 bg-background/30 hover:bg-primary/5",
          isDisabled && "opacity-40 pointer-events-none hover:scale-100",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Starfield background */}
        <span className="absolute inset-0 overflow-hidden">
          {stars.map((star) => (
            <span
              key={star.id}
              className={cn(
                "absolute w-1 h-1 rounded-full transition-all duration-500",
                isHovered || isSelected ? "bg-primary/60" : "bg-muted-foreground/20"
              )}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                opacity: isHovered || isSelected ? star.opacity + 0.3 : star.opacity * 0.5,
                transform: isHovered ? `scale(${1 + Math.random()})` : "scale(0.5)",
                boxShadow: isHovered || isSelected ? `0 0 ${4 + Math.random() * 4}px hsl(var(--primary)/0.5)` : "none",
              }}
            />
          ))}
        </span>

        {/* Gradient sweep on hover */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

        {/* Glowing border effect */}
        <span className={cn(
          "absolute inset-0 rounded-sm transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )} style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--primary)/0.1), transparent)",
        }} />

        {/* Content */}
        <span className="relative z-10 text-sm flex items-center gap-2">
          {/* Animated dot indicator */}
          <span className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            isSelected 
              ? "bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.8)]" 
              : isHovered 
                ? "bg-primary/50 scale-110" 
                : "bg-muted-foreground/30 scale-75"
          )} />
          {children}
        </span>
      </button>
    );
  }
);

AnimatedOption.displayName = "AnimatedOption";

export { AnimatedOption };
