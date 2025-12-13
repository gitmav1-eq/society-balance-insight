import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { X, MessageSquare, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "archivist";
  content: string;
}

const ArchivistChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const question = input.trim();
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
            <div className="text-center text-muted-foreground/60 mt-12">
              <p className="font-mono text-[9px] tracking-widest mb-3">ASK THE ARCHIVIST</p>
              <p className="text-sm leading-relaxed max-w-[280px] mx-auto">
                I provide context and understanding about systemic patterns. Ask me why things
                matter at scale.
              </p>
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
                  <p className="font-mono text-[8px] tracking-widest text-muted-foreground/50 mb-1">
                    ARCHIVIST
                  </p>
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
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
              onClick={handleSend}
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
