import { useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import NormalizationSimulator from "@/components/NormalizationSimulator";
import ImpactVisualization from "@/components/ImpactVisualization";
import AskSocietyChatbot from "@/components/AskSocietyChatbot";
import SocialReflection from "@/components/SocialReflection";
import MultiFooter from "@/components/MultiFooter";

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
        
        <AskSocietyChatbot />
        
        <SocialReflection />
      </main>
      
      <MultiFooter />
    </div>
  );
};

export default Index;
