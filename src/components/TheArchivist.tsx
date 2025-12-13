import { useState, useRef, useEffect } from "react";
import { X, BookOpen, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "archivist";
  content: string;
}

const TheArchivist = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "archivist",
      content: "I am The Archivist. I provide context and explanation about systemic financial patterns. Ask me why something matters, and I will explain the deeper connections.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("archivist-chat", {
        body: { question: input, history: messages },
      });

      if (error) throw error;

      setMessages((prev) => [
        ...prev,
        { role: "archivist", content: data?.response || "I cannot process that inquiry at this time." },
      ]);
    } catch (err) {
      console.error("Archivist error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "archivist", content: "Connection to the archive temporarily unavailable." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 bg-card border border-border shadow-lg hover:shadow-xl transition-all group ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        aria-label="Open The Archivist"
      >
        <BookOpen className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
      </button>

      {/* Side Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-card border-l border-border z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-border bg-background">
          <div>
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
              INTELLIGENCE INTERFACE
            </p>
            <h2 className="font-serif text-lg">The Archivist</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </header>

        {/* Messages */}
        <div className="h-[calc(100vh-140px)] overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${msg.role === "user" ? "ml-8" : "mr-8"}`}
            >
              {msg.role === "archivist" && (
                <p className="font-mono text-[9px] tracking-widest text-primary mb-1">
                  ARCHIVIST
                </p>
              )}
              <div
                className={`p-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/30 border border-border text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="mr-8">
              <p className="font-mono text-[9px] tracking-widest text-primary mb-1">
                ARCHIVIST
              </p>
              <div className="bg-muted/30 border border-border p-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.15s" }} />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask why this matters..."
              className="flex-1 bg-muted/30 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="sm" className="px-3">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

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

export default TheArchivist;
