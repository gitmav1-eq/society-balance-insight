import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Behavior {
  id: string;
  label: string;
  enabled: boolean;
  presentEffect: string;
  futureEffect: string;
}

const initialBehaviors: Behavior[] = [
  {
    id: "savings",
    label: "Emergency savings culture",
    enabled: false,
    presentEffect: "Feels optional, low urgency",
    futureEffect: "Collective resilience increases, crisis recovery faster",
  },
  {
    id: "emi",
    label: "Credit-first purchasing",
    enabled: true,
    presentEffect: "Access to goods feels easier",
    futureEffect: "Debt burden compounds, financial flexibility decreases",
  },
  {
    id: "education",
    label: "Early financial education",
    enabled: false,
    presentEffect: "Curriculum changes take time",
    futureEffect: "Next generation starts prepared, inequality narrows",
  },
];

const TimeShiftGame = () => {
  const [behaviors, setBehaviors] = useState<Behavior[]>(initialBehaviors);
  
  const toggleBehavior = (id: string) => {
    setBehaviors((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b))
    );
  };

  const enabledPositive = behaviors.filter(
    (b) => (b.id === "savings" || b.id === "education") && b.enabled
  ).length;
  const enabledNegative = behaviors.filter(
    (b) => b.id === "emi" && b.enabled
  ).length;

  const getOutlook = () => {
    const score = enabledPositive - enabledNegative;
    if (score >= 1) return { text: "Trajectory improving", color: "text-green-400" };
    if (score === 0) return { text: "Trajectory uncertain", color: "text-yellow-400" };
    return { text: "Trajectory concerning", color: "text-red-400" };
  };

  const outlook = getOutlook();

  return (
    <Card className="p-8 bg-card/30 backdrop-blur border-border/30">
      <div className="text-center mb-6">
        <p className="text-[9px] font-mono tracking-widest text-muted-foreground mb-2">FUTURE SWITCH</p>
        <h3 className="text-lg font-bold mb-1">Toggle Behaviors</h3>
        <p className="text-xs text-muted-foreground">See how changes ripple forward</p>
      </div>

      <div className="space-y-5 mb-6">
        {behaviors.map((behavior) => (
          <div key={behavior.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={behavior.id} className="text-sm cursor-pointer">
                {behavior.label}
              </Label>
              <Switch
                id={behavior.id}
                checked={behavior.enabled}
                onCheckedChange={() => toggleBehavior(behavior.id)}
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-0.5">
              {behavior.enabled ? behavior.futureEffect : behavior.presentEffect}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border/30 text-center">
        <p className="text-xs text-muted-foreground mb-1">30-year outlook</p>
        <p className={`text-sm font-medium ${outlook.color}`}>{outlook.text}</p>
      </div>
    </Card>
  );
};

export default TimeShiftGame;
