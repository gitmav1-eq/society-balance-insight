import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Shortcut {
  key: string;
  description: string;
  modifiers?: string[];
}

interface ShortcutGroup {
  title: string;
  shortcuts: Shortcut[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Navigation",
    shortcuts: [
      { key: "1", description: "Go to Simulator" },
      { key: "2", description: "Go to Perspective Shift" },
      { key: "3", description: "Go to Balance Sheet" },
      { key: "0", description: "Scroll to top" },
    ],
  },
  {
    title: "Actions",
    shortcuts: [
      { key: "S", description: "Focus simulator input" },
      { key: "Esc", description: "Reset / Close" },
      { key: "Enter", description: "Submit (when focused)" },
    ],
  },
  {
    title: "Interface",
    shortcuts: [
      { key: "T", description: "Toggle theme" },
      { key: "M", description: "Toggle sound" },
      { key: "A", description: "Open Archivist chat" },
      { key: "F", description: "Toggle focus mode" },
      { key: "?", description: "Show this help" },
    ],
  },
];

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KeyboardShortcutsHelp = ({ open, onOpenChange }: KeyboardShortcutsHelpProps) => {
  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
              KEYBOARD SHORTCUTS
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <p className="text-[10px] font-mono tracking-widest text-muted-foreground/60 mb-2">
                {group.title.toUpperCase()}
              </p>
              <div className="space-y-1.5">
                {group.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-0.5 bg-muted/50 border border-border/50 rounded text-xs font-mono">
                      {shortcut.modifiers?.map((m) => (
                        <span key={m} className="mr-1">
                          {m === "ctrl" ? "⌘/" : m === "alt" ? "⌥" : m === "shift" ? "⇧" : ""}
                        </span>
                      ))}
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border/20 mt-4">
          <p className="text-[10px] text-muted-foreground/50 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-muted/30 rounded text-[10px]">?</kbd> anytime to toggle this help
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsHelp;
