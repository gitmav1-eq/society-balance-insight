import { Sun, Moon, Zap } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "cyber" as const, icon: Zap, label: "Cyber" },
  ];

  return (
    <div className="flex items-center gap-1 p-1 border border-border bg-card/50 backdrop-blur-sm">
      {themes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant={theme === value ? "default" : "ghost"}
          size="sm"
          onClick={() => setTheme(value)}
          className="px-2 py-1 h-7"
          title={label}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="sr-only">{label}</span>
        </Button>
      ))}
    </div>
  );
};

export default ThemeToggle;
