import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const OrbitGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    "What does orbit mean here?",
    "How do small choices matter?",
    "Why think long-term?",
  ];

  const handleAsk = async (question: string) => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    setResponse("");
    setInput("");

    try {
      const { data, error } = await supabase.functions.invoke("ai-guide", {
        body: { question },
      });

      if (error) throw error;
      setResponse(data?.answer || "I'm not sure how to answer that. Try rephrasing?");
    } catch {
      setResponse("Unable to connect right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-card/80 backdrop-blur-md border border-border/30 rounded-full shadow-lg hover:bg-card transition-all duration-300 group"
      >
        <MessageCircle size={16} className="text-primary/70" />
        <span className="text-xs font-mono tracking-wide">Ask ORBIT</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] bg-card/95 backdrop-blur-md border border-border/30 rounded-lg shadow-2xl animate-fade-in">
      <div className="p-4 border-b border-border/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
          <span className="text-xs font-mono tracking-wide">ORBIT</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-muted-foreground/50 hover:text-foreground transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="p-4 min-h-[120px]">
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-pulse" />
            Thinking...
          </div>
        ) : response ? (
          <div className="animate-fade-in">
            <p className="text-sm text-foreground/90 leading-relaxed mb-4">
              {response}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setResponse("")}
              className="text-[10px] text-muted-foreground/50"
            >
              Ask something else
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground/60 mb-3">
              Quick questions:
            </p>
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleAsk(q)}
                className="block w-full text-left text-xs p-2 border border-border/20 rounded-sm hover:bg-card/50 hover:border-border/40 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {!response && !isLoading && (
        <div className="p-3 border-t border-border/20">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk(input)}
              placeholder="Or type your question..."
              className="flex-1 bg-transparent border border-border/20 rounded-sm px-3 py-1.5 text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:border-border/40"
            />
            <Button size="sm" onClick={() => handleAsk(input)} className="text-xs px-3">
              Ask
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrbitGuide;