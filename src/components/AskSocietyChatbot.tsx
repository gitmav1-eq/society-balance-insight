import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "system";
  content: string;
}

const presetQuestions = [
  "Why is EMI culture dangerous at scale?",
  "How does delay compound over decades?",
  "What actually helps society long-term?",
  "Why don't people save more?",
];

const AskSocietyChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "I am the Society Intelligence System. Ask me about how financial behaviors scale across populations and time. I provide analysis, not advice.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("society-chat", {
        body: { question, history: messages },
      });

      if (error) throw error;

      const systemMessage: Message = {
        role: "system",
        content: data?.response || "Unable to process that query at this time.",
      };
      setMessages((prev) => [...prev, systemMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "System temporarily unavailable. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="explore" className="py-24 px-6 md:px-12 lg:px-24 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">
            EXPLORATION MODE
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
            Ask Society
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Query the intelligence system about systemic patterns, long-term trajectories, and collective consequences.
          </p>
        </div>

        {/* Chat Container */}
        <div className="border border-border bg-card/50 backdrop-blur-sm">
          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/30 text-foreground border border-border"
                  }`}
                >
                  {msg.role === "system" && (
                    <p className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
                      SYSTEM
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted/30 border border-border p-4">
                  <p className="font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
                    SYSTEM
                  </p>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset Questions */}
          <div className="border-t border-border p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {presetQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1.5 border border-border bg-background hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                placeholder="Ask about systemic patterns..."
                className="flex-1 bg-background border border-border px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSend(input)}
                disabled={isLoading || !input.trim()}
                size="sm"
                className="px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AskSocietyChatbot;
