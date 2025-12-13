import { useRef } from "react";
import Hero from "@/components/Hero";
import NormalizationSimulator from "@/components/NormalizationSimulator";
import SocietalBalanceSheet from "@/components/SocietalBalanceSheet";
import WhyThisMatters from "@/components/WhyThisMatters";
import ClosingStatement from "@/components/ClosingStatement";
import Footer from "@/components/Footer";

const Index = () => {
  const simulatorRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToWhy = () => {
    whyRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero onSimulateClick={scrollToSimulator} onWhyClick={scrollToWhy} />
      
      <div ref={simulatorRef}>
        <NormalizationSimulator />
      </div>
      
      <div ref={whyRef}>
        <WhyThisMatters />
      </div>
      
      <SocietalBalanceSheet />
      
      <ClosingStatement />
      
      <Footer />
    </div>
  );
};

export default Index;
