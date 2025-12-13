import { useState } from "react";
import { X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface AIGuideProps {
  context?: string;
}

const AIGuide = ({ context }: AIGuideProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAskWhy = async () => {
    if (!context) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-guide", {
        body: { context },
      });

      if (error) throw error;
      setExplanation(data?.explanation || "Unable to generate explanation.");
    } catch (err) {
      console.error("AI Guide error:", err);
      setExplanation("Unable to connect to the guide system at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => {
          setIsOpen(true);
          if (context && !explanation) {
            handleAskWhy();
          }
        }}
        variant="ghost"
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full border border-border bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
      >
        <HelpCircle className="h-5 w-5" />
        <span className="sr-only">Open AI Guide</span>
      </Button>
    );
  }

  return (
    <aside className="fixed right-6 bottom-6 z-50 w-80 md:w-96 max-h-[70vh] bg-card/95 backdrop-blur-md border border-border shadow-2xl overflow-hidden animate-fade-in">
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted-foreground">
            AI GUIDE
          </p>
          <p className="text-sm text-foreground">Understanding the System</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </header>

      <div className="p-4 overflow-y-auto max-h-[50vh]">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-muted/50 animate-pulse rounded" />
            <div className="h-4 bg-muted/50 animate-pulse rounded w-5/6" />
            <div className="h-4 bg-muted/50 animate-pulse rounded w-4/6" />
          </div>
        ) : explanation ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {explanation}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              This guide helps you understand the deeper implications of societal patterns. 
              When viewing simulation results, click "Why?" to receive contextual explanations 
              about the systemic forces at play.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The goal is not to advise, but to illuminate — to make visible the 
              connections between individual behaviors and collective outcomes.
            </p>
          </div>
        )}
      </div>

      {context && (
        <footer className="p-4 border-t border-border">
          <Button
            onClick={handleAskWhy}
            disabled={isLoading}
            variant="secondary"
            className="w-full"
          >
            {isLoading ? "Analyzing..." : "Ask: Why does this matter?"}
          </Button>
        </footer>
      )}
    </aside>
  );
};

export default AIGuide;
