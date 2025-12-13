import { useState, useEffect, useCallback } from "react";
import { X, Globe, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAmbientSound } from "@/hooks/useAmbientSound";

// Simulated anonymous activity (no real user data)
const simulatedActivities = [
  { behavior: "EMI dependence", location: "Mumbai" },
  { behavior: "delayed savings", location: "Delhi" },
  { behavior: "lifestyle inflation", location: "Bangalore" },
  { behavior: "gig work patterns", location: "Hyderabad" },
  { behavior: "credit-based consumption", location: "Chennai" },
  { behavior: "subscription overload", location: "Pune" },
  { behavior: "emergency fund gaps", location: "Kolkata" },
  { behavior: "BNPL habits", location: "Ahmedabad" },
  { behavior: "retirement delays", location: "Jaipur" },
  { behavior: "insurance avoidance", location: "Lucknow" },
  { behavior: "side hustle burnout", location: "Chandigarh" },
  { behavior: "crypto speculation", location: "Gurgaon" },
  { behavior: "education loans", location: "Kochi" },
  { behavior: "rent vs buy dilemma", location: "Noida" },
  { behavior: "healthcare cost avoidance", location: "Indore" },
];

const actionVerbs = [
  "is exploring",
  "just simulated",
  "is analyzing",
  "started exploring",
  "is investigating",
];

interface Activity {
  id: number;
  message: string;
  timestamp: Date;
  isNew: boolean;
}

const generateActivity = (id: number): Activity => {
  const activity = simulatedActivities[Math.floor(Math.random() * simulatedActivities.length)];
  const verb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
  
  return {
    id,
    message: `Someone in ${activity.location} ${verb} ${activity.behavior}`,
    timestamp: new Date(),
    isNew: true,
  };
};

interface LiveSocietyPulseProps {
  focusMode?: boolean;
}

const LiveSocietyPulse = ({ focusMode = false }: LiveSocietyPulseProps) => {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("societyPulseVisible") !== "false";
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityCounter, setActivityCounter] = useState(0);
  const { playReveal } = useAmbientSound();

  // Generate initial activities
  useEffect(() => {
    const initial: Activity[] = [];
    for (let i = 0; i < 3; i++) {
      initial.push({ ...generateActivity(i), isNew: false });
    }
    setActivities(initial);
    setActivityCounter(3);
  }, []);

  // Add new activities periodically
  useEffect(() => {
    if (!isVisible || focusMode) return;

    const interval = setInterval(() => {
      setActivityCounter((prev) => prev + 1);
      setActivities((prev) => {
        const newActivity = generateActivity(activityCounter);
        playReveal();
        
        // Mark previous activities as not new
        const updated = prev.map((a) => ({ ...a, isNew: false }));
        
        // Add new activity and keep only last 5
        return [newActivity, ...updated].slice(0, 5);
      });
    }, 8000 + Math.random() * 7000); // Random interval between 8-15 seconds

    return () => clearInterval(interval);
  }, [isVisible, focusMode, activityCounter, playReveal]);

  // Persist visibility preference
  useEffect(() => {
    localStorage.setItem("societyPulseVisible", String(isVisible));
  }, [isVisible]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleToggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  // Don't show in focus mode or if closed
  if (!isVisible || focusMode) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm">
      {/* Minimized state */}
      {isMinimized ? (
        <button
          onClick={handleToggleMinimize}
          className="flex items-center gap-2 px-3 py-2 bg-background/80 backdrop-blur-md border border-border/30 rounded-full shadow-lg hover:bg-background/90 transition-colors group"
        >
          <div className="relative">
            <Globe className="w-4 h-4 text-primary/70" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
          <span className="text-[10px] font-mono tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
            SOCIETY PULSE
          </span>
          <Eye className="w-3 h-3 text-muted-foreground/50" />
        </button>
      ) : (
        /* Expanded state */
        <div className="bg-background/80 backdrop-blur-md border border-border/30 rounded-lg shadow-lg overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/20">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Globe className="w-4 h-4 text-primary/70" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              </div>
              <span className="text-[9px] font-mono tracking-widest text-muted-foreground/70">
                LIVE SOCIETY PULSE
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground/50 hover:text-foreground"
                onClick={handleToggleMinimize}
                aria-label="Minimize pulse feed"
              >
                <EyeOff className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground/50 hover:text-destructive"
                onClick={handleClose}
                aria-label="Close pulse feed"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Activity feed */}
          <div className="p-3 space-y-2 max-h-48 overflow-hidden">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-start gap-2 text-[11px] transition-all duration-500 ${
                  activity.isNew ? "animate-fade-in" : "opacity-60"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    activity.isNew ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
                  }`}
                />
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    {activity.message}
                  </p>
                  <p className="text-[9px] text-muted-foreground/40 mt-0.5">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-border/20 bg-muted/20">
            <p className="text-[9px] text-muted-foreground/40 text-center">
              Anonymous activity • No personal data collected
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper to format time ago
const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
};

export default LiveSocietyPulse;
