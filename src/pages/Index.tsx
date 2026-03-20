import { useRef, useState, useCallback, useMemo } from "react";
import DynamicHeader from "@/components/DynamicHeader";
import HeroSection from "@/components/HeroSection";
import NormalizationSimulator from "@/components/NormalizationSimulator";
import PerspectiveShift from "@/components/PerspectiveShift";
import InterventionSimulator from "@/components/InterventionSimulator";
import PublicBalanceSheet from "@/components/PublicBalanceSheet";
import DailySignal from "@/components/DailySignal";
import DynamicFooter from "@/components/DynamicFooter";
import ArchivistChat from "@/components/ArchivistChat";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";
import CommandPalette from "@/components/CommandPalette";
import LiveSocietyPulse from "@/components/LiveSocietyPulse";
import DemoGuide from "@/components/DemoGuide";
import DemoMode from "@/components/DemoMode";
import SocietyHealthIndicator, { type HealthStatus } from "@/components/SocietyHealthIndicator";
import { useKeyboardShortcuts, scrollToSection, ShortcutAction } from "@/hooks/useKeyboardShortcuts";
import { useAmbientSound } from "@/hooks/useAmbientSound";

const Index = () => {
  const simulatorRef = useRef<HTMLDivElement>(null);
  const [isArchivistOpen, setIsArchivistOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [societyHealth, setSocietyHealth] = useState<HealthStatus>("under-pressure");
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoBehavior, setDemoBehavior] = useState<string | null>(null);
  const { toggle: toggleSound, playTap } = useAmbientSound();

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRiskLevelChange = useCallback((level: "low" | "medium" | "high" | null) => {
    if (!level) {
      setSocietyHealth("under-pressure");
      return;
    }
    const map: Record<string, HealthStatus> = {
      low: "stable",
      medium: "under-pressure",
      high: "critical",
    };
    setSocietyHealth(map[level]);
  }, []);

  const handleDemoActivate = useCallback(() => {
    if (demoRunning) return;
    setDemoRunning(true);
    // Scroll to simulator
    simulatorRef.current?.scrollIntoView({ behavior: "smooth" });
    // Trigger preset after scroll settles
    setTimeout(() => {
      setDemoBehavior("Buying on EMI");
    }, 800);
    // Reset demo state after a while
    setTimeout(() => {
      setDemoRunning(false);
      setDemoBehavior(null);
    }, 15000);
  }, [demoRunning]);

  // Theme toggle helper
  const toggleTheme = useCallback(() => {
    const themeToggle = document.querySelector('[aria-label*="theme"], [aria-label*="Toggle"]') as HTMLButtonElement;
    if (themeToggle) {
      themeToggle.click();
      playTap();
    }
  }, [playTap]);

  // Define keyboard shortcuts
  const shortcuts: ShortcutAction[] = useMemo(() => [
    {
      key: "1",
      description: "Go to Simulator",
      action: () => { scrollToSection("simulator"); playTap(); },
    },
    {
      key: "2",
      description: "Go to Interventions",
      action: () => { scrollToSection("interventions"); playTap(); },
    },
    {
      key: "3",
      description: "Go to Balance Sheet",
      action: () => { scrollToSection("balance"); playTap(); },
    },
    {
      key: "0",
      description: "Scroll to top",
      action: () => { window.scrollTo({ top: 0, behavior: "smooth" }); playTap(); },
    },
    {
      key: "s",
      description: "Focus simulator input",
      action: () => {
        scrollToSection("simulator");
        setTimeout(() => {
          const textarea = document.querySelector("#simulator textarea") as HTMLTextAreaElement;
          if (textarea) textarea.focus();
        }, 500);
        playTap();
      },
    },
    { key: "t", description: "Toggle theme", action: toggleTheme },
    { key: "m", description: "Toggle sound", action: () => { toggleSound(); } },
    {
      key: "a",
      description: "Open Archivist chat",
      action: () => { setIsArchivistOpen(true); playTap(); },
    },
    {
      key: "Escape",
      description: "Close dialogs",
      action: () => { setIsArchivistOpen(false); },
    },
    {
      key: "f",
      description: "Toggle focus mode",
      action: () => { setFocusMode((prev) => !prev); playTap(); },
    },
    {
      key: "d",
      description: "Run demo",
      action: handleDemoActivate,
    },
  ], [playTap, toggleSound, toggleTheme, handleDemoActivate]);

  const { showHelp, setShowHelp } = useKeyboardShortcuts(shortcuts);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <DynamicHeader mode="landing" />
      
      {/* Demo mode + Society Health in a floating bar */}
      <div className="fixed top-[72px] right-6 z-40 flex items-center gap-3">
        <SocietyHealthIndicator status={societyHealth} />
        <DemoMode onActivate={handleDemoActivate} isRunning={demoRunning} />
      </div>
      
      <main>
        <HeroSection onSimulateClick={scrollToSimulator} />
        
        <div ref={simulatorRef}>
          <NormalizationSimulator
            onRiskLevelChange={handleRiskLevelChange}
            triggerBehavior={demoBehavior}
          />
        </div>
        
        <PerspectiveShift />
        
        <InterventionSimulator />
        
        <PublicBalanceSheet />
        
        <DailySignal />
      </main>
      
      <DynamicFooter />
      <ArchivistChat isOpenProp={isArchivistOpen} onOpenChange={setIsArchivistOpen} />
      <KeyboardShortcutsHelp open={showHelp} onOpenChange={setShowHelp} />
      <CommandPalette 
        onOpenArchivist={() => setIsArchivistOpen(true)} 
        onShowShortcuts={() => setShowHelp(true)} 
      />
      <LiveSocietyPulse focusMode={focusMode} />
      <DemoGuide />
    </div>
  );
};

export default Index;
