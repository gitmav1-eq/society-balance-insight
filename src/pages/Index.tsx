import { useRef, useState, useCallback, useMemo } from "react";
import DynamicHeader from "@/components/DynamicHeader";
import HeroSection from "@/components/HeroSection";
import NormalizationSimulator from "@/components/NormalizationSimulator";
import PerspectiveShift from "@/components/PerspectiveShift";
import PublicBalanceSheet from "@/components/PublicBalanceSheet";
import DailySignal from "@/components/DailySignal";
import DynamicFooter from "@/components/DynamicFooter";
import ArchivistChat from "@/components/ArchivistChat";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";
import CommandPalette from "@/components/CommandPalette";
import LiveSocietyPulse from "@/components/LiveSocietyPulse";
import DemoGuide from "@/components/DemoGuide";
import GuidedTour from "@/components/GuidedTour";
import { useKeyboardShortcuts, scrollToSection, ShortcutAction } from "@/hooks/useKeyboardShortcuts";
import { useAmbientSound } from "@/hooks/useAmbientSound";

const Index = () => {
  const simulatorRef = useRef<HTMLDivElement>(null);
  const [isArchivistOpen, setIsArchivistOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const { toggle: toggleSound, playTap } = useAmbientSound();

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      action: () => {
        scrollToSection("simulator");
        playTap();
      },
    },
    {
      key: "2",
      description: "Go to Perspective Shift",
      action: () => {
        scrollToSection("why");
        playTap();
      },
    },
    {
      key: "3",
      description: "Go to Balance Sheet",
      action: () => {
        scrollToSection("balance");
        playTap();
      },
    },
    {
      key: "0",
      description: "Scroll to top",
      action: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        playTap();
      },
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
    {
      key: "t",
      description: "Toggle theme",
      action: toggleTheme,
    },
    {
      key: "m",
      description: "Toggle sound",
      action: () => {
        toggleSound();
      },
    },
    {
      key: "a",
      description: "Open Archivist chat",
      action: () => {
        setIsArchivistOpen(true);
        playTap();
      },
    },
    {
      key: "Escape",
      description: "Close dialogs",
      action: () => {
        setIsArchivistOpen(false);
      },
    },
    {
      key: "f",
      description: "Toggle focus mode",
      action: () => {
        setFocusMode((prev) => !prev);
        playTap();
      },
    },
  ], [playTap, toggleSound, toggleTheme]);

  const { showHelp, setShowHelp } = useKeyboardShortcuts(shortcuts);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <DynamicHeader mode="landing" />
      
      <main>
        <HeroSection onSimulateClick={scrollToSimulator} />
        
        <div ref={simulatorRef}>
          <NormalizationSimulator />
        </div>
        
        <PerspectiveShift />
        
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
      <GuidedTour />
    </div>
  );
};

export default Index;
