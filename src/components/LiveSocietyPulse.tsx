import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

const simulationTypes = [
  "EMI dependence patterns",
  "delayed savings behavior",
  "lifestyle inflation effects",
  "gig work futures",
  "credit-driven consumption",
  "subscription creep impact",
  "retirement delay scenarios",
  "housing affordability trends",
  "education debt trajectories",
  "healthcare cost projections",
];

const locations = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
  "Pune", "Singapore", "London", "New York", "Tokyo", "Berlin"
];

interface PulseItem {
  id: number;
  simulation: string;
  location: string;
  timestamp: Date;
  opacity: number;
}

const LiveSocietyPulse = () => {
  const [pulseItems, setPulseItems] = useState<PulseItem[]>([]);

  useEffect(() => {
    // Generate initial items
    const initial: PulseItem[] = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() - i * 1000,
      simulation: simulationTypes[Math.floor(Math.random() * simulationTypes.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      timestamp: new Date(Date.now() - Math.random() * 30000),
      opacity: 1 - i * 0.3,
    }));
    setPulseItems(initial);

    // Add new items periodically
    const interval = setInterval(() => {
      const newItem: PulseItem = {
        id: Date.now(),
        simulation: simulationTypes[Math.floor(Math.random() * simulationTypes.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        timestamp: new Date(),
        opacity: 1,
      };

      setPulseItems((prev) => {
        const updated = prev.map((item) => ({
          ...item,
          opacity: Math.max(0.2, item.opacity - 0.15),
        }));
        return [newItem, ...updated].slice(0, 4);
      });
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (seconds < 5) return "just now";
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  return (
    <div className="fixed bottom-24 left-4 z-40 max-w-xs">
      <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
        <Activity className="w-3 h-3 animate-pulse text-primary" />
        <span className="font-mono uppercase tracking-wider">Live Pulse</span>
      </div>
      
      <div className="space-y-1.5">
        {pulseItems.map((item) => (
          <div
            key={item.id}
            className="text-xs font-mono transition-all duration-700 ease-out"
            style={{ opacity: item.opacity }}
          >
            <span className="text-muted-foreground">Someone in </span>
            <span className="text-foreground">{item.location}</span>
            <span className="text-muted-foreground"> explored </span>
            <span className="text-primary">{item.simulation}</span>
            <span className="text-muted-foreground/60 ml-1.5">
              {getTimeAgo(item.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSocietyPulse;
