import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";

type HeaderMode = "landing" | "simulation" | "drift";

interface DynamicHeaderProps {
  mode?: HeaderMode;
  breadcrumb?: string[];
}

const DynamicHeader = ({ mode = "landing", breadcrumb }: DynamicHeaderProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      }
      
      setIsScrolled(currentScrollY > 50);
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Simulate", href: "#simulator" },
    { label: "Why This Matters", href: "#why" },
    { label: "The Public Balance Sheet", href: "#balance" },
  ];

  const scrollToSection = (href: string) => {
    if (location.pathname !== "/") {
      window.location.href = "/" + href;
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  // Simulation mode - minimal header with breadcrumb
  if (mode === "simulation" && breadcrumb) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
              {breadcrumb.map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="opacity-40">→</span>}
                  <span className={i === breadcrumb.length - 1 ? "text-foreground/80" : ""}>
                    {item}
                  </span>
                </span>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  // Drift mode - minimal exploration indicator
  if (mode === "drift") {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="font-mono text-sm tracking-widest opacity-60">
                SOCIETY.EXE
              </Link>
              <span className="text-[9px] font-mono tracking-widest text-primary/50 border border-primary/20 px-2 py-0.5 rounded-full">
                DRIFT MODE
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  // Landing mode - full navigation with hide/show on scroll
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-mono text-sm tracking-widest font-medium">
            SOCIETY.EXE
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors duration-300"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-muted-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border/20 pt-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-sm text-muted-foreground/70 hover:text-foreground transition-colors text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default DynamicHeader;