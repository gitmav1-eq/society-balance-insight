import { useRef } from "react";
import DynamicHeader from "@/components/DynamicHeader";
import HeroSection from "@/components/HeroSection";
import FutureDrift from "@/components/FutureDrift";
import NormalizationSimulator from "@/components/NormalizationSimulator";
import IdleOrbit from "@/components/IdleOrbit";
import DailySignal from "@/components/DailySignal";
import DynamicFooter from "@/components/DynamicFooter";
import OrbitGuide from "@/components/OrbitGuide";

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
        
        <FutureDrift />
        
        <div ref={simulatorRef}>
          <NormalizationSimulator />
        </div>
        
        <IdleOrbit />
        
        <DailySignal />
      </main>
      
      <DynamicFooter mode="educational" />
      <OrbitGuide />
    </div>
  );
};

export default Index;
