import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface TimelineData {
  year: number;
  title: string;
  description: string;
}

const timelineData: TimelineData[] = [
  {
    year: 0,
    title: "Present Day",
    description: "Current patterns are invisible. EMI culture is normal. Savings rates hover around 5-10%. Most assume things will stay manageable.",
  },
  {
    year: 10,
    title: "2034",
    description: "First-time homeownership drops 25%. Gig workers without safety nets reach 40% of workforce. Emergency fund culture remains rare.",
  },
  {
    year: 20,
    title: "2044",
    description: "Retirement age rises to 67+. Healthcare costs consume 30% of middle-class income. Those who saved early have options; others don't.",
  },
  {
    year: 30,
    title: "2054",
    description: "Generational wealth gap widens. Early financial education becomes standard — for those who can afford it. The cost of 'normalization' becomes clear.",
  },
];

const TimeShiftGame = () => {
  const [yearIndex, setYearIndex] = useState(0);
  const currentData = timelineData[yearIndex];

  return (
    <Card className="p-8 bg-card/30 backdrop-blur border-border/30">
      <div className="text-center mb-6">
        <p className="text-[10px] font-mono tracking-widest text-primary mb-2">TIME SHIFT</p>
        <h3 className="text-lg font-bold">Drag Through Time</h3>
      </div>

      <div className="mb-8">
        <Slider
          value={[yearIndex]}
          onValueChange={(value) => setYearIndex(value[0])}
          max={3}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground">
          <span>NOW</span>
          <span>+10</span>
          <span>+20</span>
          <span>+30 YRS</span>
        </div>
      </div>

      <div className="min-h-[140px] transition-all duration-300">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span className="font-mono text-sm font-bold">{currentData.title}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {currentData.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground text-center italic">
          "Civilizations don't fail suddenly. They normalize failure slowly."
        </p>
      </div>
    </Card>
  );
};

export default TimeShiftGame;
