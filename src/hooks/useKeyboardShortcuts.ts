import { useEffect, useCallback, useState } from "react";

export interface ShortcutAction {
  key: string;
  description: string;
  action: () => void;
  modifiers?: ("ctrl" | "alt" | "shift" | "meta")[];
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
}

export const useKeyboardShortcuts = (
  shortcuts: ShortcutAction[],
  options: UseKeyboardShortcutsOptions = {}
) => {
  const { enabled = true } = options;
  const [showHelp, setShowHelp] = useState(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Only allow Escape in inputs
        if (event.key !== "Escape") return;
      }

      // ? key shows help
      if (event.key === "?" && !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.modifiers?.includes("ctrl")
          ? event.ctrlKey || event.metaKey
          : !event.ctrlKey && !event.metaKey;
        const altMatch = shortcut.modifiers?.includes("alt")
          ? event.altKey
          : !event.altKey;
        const shiftMatch = shortcut.modifiers?.includes("shift")
          ? event.shiftKey
          : !event.shiftKey;

        if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { showHelp, setShowHelp };
};

// Scroll to section helper
export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

// Focus element helper
export const focusElement = (selector: string) => {
  const element = document.querySelector(selector) as HTMLElement;
  if (element) {
    element.focus();
  }
};
