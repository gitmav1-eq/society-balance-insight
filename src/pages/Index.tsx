import { useRef, useState, useEffect } from "react";
import Header from "@/components/Header";
import ContextHeader from "@/components/ContextHeader";
import HeroSection from "@/components/HeroSection";
import NormalizationSimulator from "@/components/NormalizationSimulator";
import CompoundingGame from "@/components/CompoundingGame";
import ImpactVisualization from "@/components/ImpactVisualization";
import AskSocietyChatbot from "@/components/AskSocietyChatbot";
import SocialReflection from "@/components/SocialReflection";
import DynamicFooter from "@/components/DynamicFooter";
import TheArchivist from "@/components/TheArchivist";
import LiveSocietyPulse from "@/components/LiveSocietyPulse";

const Index = () => {
  const simulatorRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id || "hero");
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      <ContextHeader activeSection={activeSection} />
      
      <main>
        <HeroSection onSimulateClick={scrollToSimulator} />
        
        <div ref={simulatorRef}>
          <NormalizationSimulator />
        </div>
        
        <CompoundingGame />
        
        <ImpactVisualization />
        
        <AskSocietyChatbot />
        
        <SocialReflection />
      </main>
      
      <DynamicFooter />
      <TheArchivist />
      <LiveSocietyPulse />
    </div>
  );
};

export default Index;
