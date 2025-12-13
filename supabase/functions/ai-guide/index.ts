import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are ORBIT, a calm and helpful guide for SOCIETY.EXE — a platform that helps people understand how everyday behaviors shape society over decades.

Your role:
- Explain concepts in ONE simple sentence when possible
- Use plain language, no finance jargon
- Be calm, thoughtful, and non-judgmental
- Use the orbit/space metaphor when helpful (e.g., "stability" = "staying in orbit", "pressure" = "gravitational pull")
- Never give financial advice
- Keep responses under 50 words unless more context is truly needed

Key concepts to explain simply:
- "Orbit" = the trajectory society is on based on collective behaviors
- "Drift" = when small choices slowly change direction
- "Stability" = having flexibility and resilience over time
- "Pressure" = when burdens accumulate

Always be helpful, brief, and encouraging of curiosity.`;

const fallbacks: Record<string, string> = {
  "what does orbit mean here?": "Orbit represents society's trajectory — the direction we're heading based on the choices millions of people make every day.",
  "how do small choices matter?": "Like gravity, small repeated choices pull society in a direction. One person buying on credit is nothing. Millions doing it reshapes the economy.",
  "why think long-term?": "Short-term thinking feels easier, but consequences compound. What's comfortable today can become tomorrow's pressure.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const question = body.question || body.context;

    if (!question) {
      return new Response(JSON.stringify({ error: "Question is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    // Check fallbacks first
    const lowerQ = question.toLowerCase().trim();
    if (fallbacks[lowerQ]) {
      return new Response(JSON.stringify({ answer: fallbacks[lowerQ], explanation: fallbacks[lowerQ] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!LOVABLE_API_KEY) {
      const defaultAnswer = "Every choice creates a ripple. Small actions, repeated by many, shape the future we all inherit.";
      return new Response(JSON.stringify({ answer: defaultAnswer, explanation: defaultAnswer }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      console.error("AI error:", response.status);
      const fallbackAnswer = "Every choice creates a ripple. Small actions, repeated by many, shape the future we all inherit.";
      return new Response(JSON.stringify({ answer: fallbackAnswer, explanation: fallbackAnswer }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "I'm here to help you understand. Try asking in a different way.";

    return new Response(JSON.stringify({ answer, explanation: answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("ai-guide error:", error);
    const fallbackAnswer = "Every choice creates a ripple. Small actions, repeated by many, shape the future we all inherit.";
    return new Response(JSON.stringify({ answer: fallbackAnswer, explanation: fallbackAnswer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
