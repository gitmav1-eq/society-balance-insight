import { useRef } from "react";
import DynamicHeader from "@/components/DynamicHeader";
import HeroSection from "@/components/HeroSection";
import NormalizationSimulator from "@/components/NormalizationSimulator";
import PerspectiveShift from "@/components/PerspectiveShift";
import DailySignal from "@/components/DailySignal";
import DynamicFooter from "@/components/DynamicFooter";

const Index = () => {
  const simulatorRef = useRef<HTMLDivElement>(null);

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <DynamicHeader mode="landing" />
      
      <main>
        <HeroSection onSimulateClick={scrollToSimulator} />
        
        <div ref={simulatorRef}>
          <NormalizationSimulator />
        </div>
        
        <PerspectiveShift />
        
        <DailySignal />
      </main>
      
      <DynamicFooter />
    </div>
  );
};

export default Index;
