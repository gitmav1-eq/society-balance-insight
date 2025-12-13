import { useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FutureDrift from "@/components/FutureDrift";
import NormalizationSimulator from "@/components/NormalizationSimulator";
import ExploreMode from "@/components/ExploreMode";
import DailySignal from "@/components/DailySignal";
import MultiLayerFooter from "@/components/MultiLayerFooter";

const Index = () => {
  const simulatorRef = useRef<HTMLDivElement>(null);

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header />
      
      <main>
        <HeroSection onSimulateClick={scrollToSimulator} />
        
        <FutureDrift />
        
        <div ref={simulatorRef}>
          <NormalizationSimulator />
        </div>
        
        <ExploreMode />
        
        <DailySignal />
      </main>
      
      <MultiLayerFooter />
    </div>
  );
};

export default Index;
