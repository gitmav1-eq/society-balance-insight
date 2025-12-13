import { useRef, useState } from "react";
import Hero from "@/components/Hero";
import NormalizationSimulator from "@/components/NormalizationSimulator";
import SocietalBalanceSheet from "@/components/SocietalBalanceSheet";
import WhyThisMatters from "@/components/WhyThisMatters";
import InsightForm from "@/components/InsightForm";
import ClosingStatement from "@/components/ClosingStatement";
import Footer from "@/components/Footer";
import AIGuide from "@/components/AIGuide";

const Index = () => {
  const simulatorRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const [simulationContext, setSimulationContext] = useState<string>("");

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToWhy = () => {
    whyRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Hero onSimulateClick={scrollToSimulator} onWhyClick={scrollToWhy} />
      
      <div ref={simulatorRef}>
        <NormalizationSimulator onSimulationComplete={setSimulationContext} />
      </div>
      
      <div ref={whyRef}>
        <WhyThisMatters />
      </div>
      
      <SocietalBalanceSheet />
      
      <InsightForm />
      
      <ClosingStatement />
      
      <Footer />

      <AIGuide context={simulationContext} />
    </div>
  );
};

export default Index;
