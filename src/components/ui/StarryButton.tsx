import * as React from "react";
import { cn } from "@/lib/utils";

interface StarryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

const StarryButton = React.forwardRef<HTMLButtonElement, StarryButtonProps>(
  ({ className, children, variant = "default", size = "default", ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [sparkles, setSparkles] = React.useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

    React.useEffect(() => {
      if (isHovered) {
        const newSparkles = Array.from({ length: 8 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          delay: Math.random() * 0.3,
        }));
        setSparkles(newSparkles);
      }
    }, [isHovered]);

    const sizeClasses = {
      sm: "h-9 px-3 text-sm",
      default: "h-10 px-4 py-2 text-sm",
      lg: "h-11 px-8 text-base",
    };

    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-border/50 bg-background/50 hover:bg-primary hover:text-primary-foreground hover:border-primary",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-medium transition-all duration-300 overflow-hidden group",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "hover:scale-[1.02] hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] active:scale-[0.98]",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Background glow effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
        
        {/* Sparkle particles */}
        {isHovered && sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="absolute pointer-events-none animate-sparkle"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: sparkle.size,
              height: sparkle.size,
              animationDelay: `${sparkle.delay}s`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-primary-foreground/80">
              <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
            </svg>
          </span>
        ))}
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

StarryButton.displayName = "StarryButton";

export { StarryButton };
