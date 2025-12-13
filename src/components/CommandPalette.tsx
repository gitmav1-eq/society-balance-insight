import { useEffect, useState, useCallback } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Zap,
  Lightbulb,
  Scale,
  ArrowUp,
  MessageSquare,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Keyboard,
  ExternalLink,
  Search,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { scrollToSection } from "@/hooks/useKeyboardShortcuts";

interface CommandPaletteProps {
  onOpenArchivist: () => void;
  onShowShortcuts: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
  group: "navigation" | "actions" | "settings";
}

const CommandPalette = ({ onOpenArchivist, onShowShortcuts }: CommandPaletteProps) => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isEnabled: isSoundEnabled, toggle: toggleSound, playTap } = useAmbientSound();

  // Open with Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    playTap();
    command();
  }, [playTap]);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: "simulator",
      label: "Go to Simulator",
      shortcut: "1",
      icon: <Zap className="h-4 w-4" />,
      action: () => scrollToSection("simulator"),
      group: "navigation",
    },
    {
      id: "perspective",
      label: "Go to Perspective Shift",
      shortcut: "2",
      icon: <Lightbulb className="h-4 w-4" />,
      action: () => scrollToSection("why"),
      group: "navigation",
    },
    {
      id: "balance",
      label: "Go to Balance Sheet",
      shortcut: "3",
      icon: <Scale className="h-4 w-4" />,
      action: () => scrollToSection("balance"),
      group: "navigation",
    },
    {
      id: "top",
      label: "Scroll to Top",
      shortcut: "0",
      icon: <ArrowUp className="h-4 w-4" />,
      action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      group: "navigation",
    },
    // Actions
    {
      id: "simulate",
      label: "Start a Simulation",
      shortcut: "S",
      icon: <Search className="h-4 w-4" />,
      action: () => {
        scrollToSection("simulator");
        setTimeout(() => {
          const textarea = document.querySelector("#simulator textarea") as HTMLTextAreaElement;
          if (textarea) textarea.focus();
        }, 500);
      },
      group: "actions",
    },
    {
      id: "archivist",
      label: "Open The Archivist",
      shortcut: "A",
      icon: <MessageSquare className="h-4 w-4" />,
      action: onOpenArchivist,
      group: "actions",
    },
    {
      id: "shortcuts",
      label: "View Keyboard Shortcuts",
      shortcut: "?",
      icon: <Keyboard className="h-4 w-4" />,
      action: onShowShortcuts,
      group: "actions",
    },
    {
      id: "library",
      label: "Open Simulation Library",
      icon: <ExternalLink className="h-4 w-4" />,
      action: () => window.location.href = "/library",
      group: "actions",
    },
    // Settings
    {
      id: "theme",
      label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      shortcut: "T",
      icon: theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
      action: () => setTheme(theme === "dark" ? "light" : "dark"),
      group: "settings",
    },
    {
      id: "sound",
      label: isSoundEnabled ? "Mute Ambient Sounds" : "Enable Ambient Sounds",
      shortcut: "M",
      icon: isSoundEnabled ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />,
      action: toggleSound,
      group: "settings",
    },
  ];

  const navigationCommands = commands.filter((c) => c.group === "navigation");
  const actionCommands = commands.filter((c) => c.group === "actions");
  const settingsCommands = commands.filter((c) => c.group === "settings");

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          {navigationCommands.map((command) => (
            <CommandItem
              key={command.id}
              onSelect={() => runCommand(command.action)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {command.icon}
                <span>{command.label}</span>
              </div>
              {command.shortcut && (
                <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  {command.shortcut}
                </kbd>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          {actionCommands.map((command) => (
            <CommandItem
              key={command.id}
              onSelect={() => runCommand(command.action)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {command.icon}
                <span>{command.label}</span>
              </div>
              {command.shortcut && (
                <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  {command.shortcut}
                </kbd>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          {settingsCommands.map((command) => (
            <CommandItem
              key={command.id}
              onSelect={() => runCommand(command.action)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {command.icon}
                <span>{command.label}</span>
              </div>
              {command.shortcut && (
                <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  {command.shortcut}
                </kbd>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>

      <div className="border-t border-border/30 p-2">
        <p className="text-[10px] text-muted-foreground/50 text-center">
          Press <kbd className="px-1 py-0.5 bg-muted/30 rounded text-[10px]">⌘K</kbd> or{" "}
          <kbd className="px-1 py-0.5 bg-muted/30 rounded text-[10px]">Ctrl+K</kbd> to toggle
        </p>
      </div>
    </CommandDialog>
  );
};

export default CommandPalette;
