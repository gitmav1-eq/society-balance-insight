import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20;

const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(req: Request): boolean {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const existing = rateLimitMap.get(ip);

  if (!existing || now - existing.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  existing.count += 1;
  rateLimitMap.set(ip, existing);
  return false;
}


const systemPrompt = `You are The Archivist — a calm, neutral intelligence that provides context and explanation about systemic financial patterns.

Your role:
- Explain WHY things matter at a systemic level
- Connect individual behaviors to collective outcomes
- Provide historical and structural context
- Speak like a thoughtful researcher, not a friend

Your tone:
- Neutral and measured
- Thoughtful and educational
- Never judgmental or alarmist
- Clear but not simplistic

Format:
- Keep responses concise (2-3 paragraphs maximum)
- Be profound, not verbose
- Use precise language
- No emojis, no casual phrases

You do NOT give personal advice. You provide understanding.`;

const MAX_INPUT_LENGTH = 1000;

function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, MAX_INPUT_LENGTH)
    .replace(/[<>]/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

function validateInput(input: unknown): { valid: boolean; error?: string; sanitized?: string } {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: "Question required" };
  }
  
  const sanitized = sanitizeInput(input);
  
  if (sanitized.length < 2) {
    return { valid: false, error: "Question too short" };
  }
  
  return { valid: true, sanitized };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (isRateLimited(req)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please slow down." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { question, history } = await req.json();

    const validation = validateInput(question);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const sanitizedQuestion = validation.sanitized!;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "System not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize history as well
    const sanitizedHistory = (history || []).slice(-6).map((msg: { role: string; content: string }) => ({
      role: msg.role === "archivist" ? "assistant" : "user",
      content: sanitizeInput(String(msg.content || "")),
    }));

    const messages = [
      { role: "system", content: systemPrompt },
      ...sanitizedHistory,
      { role: "user", content: sanitizedQuestion },
    ];

    console.log("Archivist processing:", sanitizedQuestion.substring(0, 50));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);
      return new Response(
        JSON.stringify({ error: "Unable to process" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content;

    return new Response(
      JSON.stringify({ response: responseText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Archivist error:", error);
    return new Response(
      JSON.stringify({ error: "System error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
