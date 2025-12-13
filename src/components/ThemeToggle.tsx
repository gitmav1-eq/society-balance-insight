import { Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "future" as const, icon: Sparkles, label: "Future" },
  ];

  return (
    <div className="flex items-center gap-1 p-1 border border-border bg-card/50 backdrop-blur-sm">
      {themes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant={theme === value ? "default" : "ghost"}
          size="sm"
          onClick={() => setTheme(value)}
          className="px-3 py-1 h-8"
          title={label}
        >
          <Icon className="h-4 w-4" />
          <span className="sr-only">{label}</span>
        </Button>
      ))}
    </div>
  );
};

export default ThemeToggle;
