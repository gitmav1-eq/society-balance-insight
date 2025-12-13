import { useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import NormalizationSimulator from "@/components/NormalizationSimulator";
import ImpactVisualization from "@/components/ImpactVisualization";
import DailySignal from "@/components/DailySignal";
import CourseCorrection from "@/components/CourseCorrection";
import MultiLayerFooter from "@/components/MultiLayerFooter";

const Index = () => {
  const simulatorRef = useRef<HTMLDivElement>(null);

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      
      <main>
        <HeroSection onSimulateClick={scrollToSimulator} />
        
        <div ref={simulatorRef}>
          <NormalizationSimulator />
        </div>
        
        <ImpactVisualization />
        
        <DailySignal />
        
        <CourseCorrection />
      </main>
      
      <MultiLayerFooter />
    </div>
  );
};

export default Index;
