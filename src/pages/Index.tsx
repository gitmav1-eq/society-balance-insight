import { useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import NormalizationSimulator from "@/components/NormalizationSimulator";
import PlaySection from "@/components/PlaySection";
import ImpactVisualization from "@/components/ImpactVisualization";
import MultiLayerFooter from "@/components/MultiLayerFooter";
import LiveSocietyPulse from "@/components/LiveSocietyPulse";

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
        
        <section id="learn">
          <ImpactVisualization />
        </section>
        
        <PlaySection />
      </main>
      
      <MultiLayerFooter />
      <LiveSocietyPulse />
    </div>
  );
};

export default Index;
