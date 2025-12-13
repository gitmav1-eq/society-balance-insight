import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { X, MessageSquare, Send } from "lucide-react";
import { useAmbientSound } from "@/hooks/useAmbientSound";

interface Message {
  role: "user" | "archivist";
  content: string;
}

const starterQuestions = [
  "Why does individual debt become a collective problem?",
  "What happens when a generation delays homeownership?",
  "How does gig work reshape social safety nets?",
  "Why do small habits compound into systemic change?",
];

const ArchivistChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { playTap, playMessage } = useAmbientSound();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (questionOverride?: string) => {
    const question = (questionOverride || input).trim();
    if (!question || isLoading) return;

    playTap();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("archivist-chat", {
        body: { question, history: messages },
      });

      if (error) throw error;

      if (data?.response) {
        setMessages((prev) => [...prev, { role: "archivist", content: data.response }]);
        playMessage();
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "archivist", content: "I was unable to process that. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "archivist", content: "A system error occurred. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-105 transition-transform ${
          isOpen ? "hidden" : ""
        }`}
        aria-label="Open The Archivist"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background border-l border-border/30 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <div>
            <p className="font-mono text-[9px] tracking-widest text-muted-foreground/50 mb-1">
              INTERFACE
            </p>
            <h3 className="font-semibold">The Archivist</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[calc(100%-140px)] p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground/60 mt-8">
              <p className="font-mono text-[9px] tracking-widest mb-3">ASK THE ARCHIVIST</p>
              <p className="text-sm leading-relaxed max-w-[280px] mx-auto mb-6">
                I provide context and understanding about systemic patterns. Ask me why things
                matter at scale.
              </p>
              <div className="space-y-2 text-left">
                <p className="font-mono text-[8px] tracking-widest text-muted-foreground/40 text-center mb-2">
                  SUGGESTED QUESTIONS
                </p>
                {starterQuestions.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(question)}
                    disabled={isLoading}
                    className="w-full text-left p-3 text-sm border border-border/30 bg-card/30 hover:bg-primary/10 hover:border-primary/30 transition-colors rounded-sm disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-sm text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary/10 border border-primary/20 ml-8"
                      : "bg-card/50 border border-border/30 mr-8"
                  }`}
                >
                  <p className="font-mono text-[8px] tracking-widest text-muted-foreground/50 mb-1">
                    {msg.role === "user" ? "YOU" : "ARCHIVIST"}
                  </p>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}
              {isLoading && (
                <div className="p-3 bg-card/50 border border-border/30 mr-8 rounded-sm">
                  <p className="font-mono text-[8px] tracking-widest text-muted-foreground/50 mb-2">
                    ARCHIVIST
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground/50">Consulting the archive...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/30 bg-background">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about systemic patterns..."
              className="min-h-[44px] max-h-[100px] resize-none bg-background/50 border-border/50"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ArchivistChat;
