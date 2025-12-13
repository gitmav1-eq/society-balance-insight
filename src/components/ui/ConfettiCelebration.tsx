import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
}

interface ConfettiCelebrationProps {
  isActive: boolean;
  onComplete?: () => void;
}

const colors = [
  "hsl(var(--primary))",
  "hsl(var(--primary) / 0.7)",
  "hsl(142 76% 36%)", // green
  "hsl(48 96% 53%)",  // gold
  "hsl(280 87% 65%)", // purple
  "hsl(199 89% 48%)", // blue
];

const ConfettiCelebration = ({ isActive, onComplete }: ConfettiCelebrationProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Generate confetti pieces
      const newPieces: ConfettiPiece[] = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
      }));
      setPieces(newPieces);
      setIsVisible(true);

      // Clean up after animation
      const timer = setTimeout(() => {
        setIsVisible(false);
        setPieces([]);
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isVisible || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: "-20px",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        >
          <div
            className="animate-confetti-spin"
            style={{
              width: piece.size,
              height: piece.size * 0.6,
              backgroundColor: piece.color,
              transform: `rotate(${piece.rotation}deg)`,
              borderRadius: "2px",
              boxShadow: `0 0 6px ${piece.color}`,
            }}
          />
        </div>
      ))}
      
      {/* Center celebration message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-scale-in bg-card/90 backdrop-blur-xl border border-primary/30 rounded-2xl p-8 shadow-2xl text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-xl font-bold mb-2">You're Ready!</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Start exploring how everyday decisions shape our collective future.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfettiCelebration;
