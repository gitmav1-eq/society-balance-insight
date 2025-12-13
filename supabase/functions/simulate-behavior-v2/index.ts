import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are SOCIETY.EXE, a public financial intelligence system. Analyze normalized financial behaviors and project their impact.

For each behavior, provide EXACTLY 4 sections:

1. INDIVIDUAL IMPACT: Short-term effects on a single person/household (2-3 sentences)
2. COLLECTIVE IMPACT: How this scales across millions of people over 10-30 years (2-3 sentences)  
3. SYSTEM PRESSURE POINTS: Where stress accumulates - households, institutions, governments, or future generations (2-3 sentences)
4. LEVER FOR CHANGE: One realistic intervention - policy, education, technology, or cultural shift (2-3 sentences)

Your tone:
- Clear and direct
- No blame or judgment
- No fear language
- Educational, not advisory

Return ONLY a JSON object with keys: individual, collective, pressure, lever`;

const MAX_INPUT_LENGTH = 500;

function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, MAX_INPUT_LENGTH)
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ''); // Remove control characters
}

function validateInput(input: unknown): { valid: boolean; error?: string; sanitized?: string } {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: "Behavior required" };
  }
  
  const sanitized = sanitizeInput(input);
  
  if (sanitized.length < 3) {
    return { valid: false, error: "Input too short" };
  }
  
  if (sanitized.length > MAX_INPUT_LENGTH) {
    return { valid: false, error: `Input exceeds ${MAX_INPUT_LENGTH} characters` };
  }
  
  return { valid: true, sanitized };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { behavior } = await req.json();
    
    const validation = validateInput(behavior);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const sanitizedBehavior = validation.sanitized!;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "System not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Simulating v2:", sanitizedBehavior);

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
          { role: "user", content: `Analyze this normalized financial behavior: "${sanitizedBehavior}"` }
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI error:", response.status);
      return new Response(
        JSON.stringify({ error: "Simulation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Handle case where AI nests all fields under one key
        const source = typeof parsed.individual === 'object' && parsed.individual !== null 
          ? parsed.individual 
          : parsed;
        
        // Normalize and ensure all values are strings
        const individual = String(source.individual || source.impact || "").trim();
        const collective = String(source.collective || "").trim();
        const pressure = String(source.pressure || "").trim();
        const lever = String(source.lever || "").trim();
        
        // Check if we got valid content
        if (individual && collective && pressure && lever) {
          const result = { individual, collective, pressure, lever };
          console.log("Parsed result:", JSON.stringify(result));
          return new Response(
            JSON.stringify({ result }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        console.log("Incomplete JSON response, using fallback");
      } catch (e) {
        console.error("JSON parse error:", e);
      }
    }

    // Fallback: parse sections manually or use defaults
    console.log("Using fallback extraction for:", sanitizedBehavior);
    const result = {
      individual: extractSection(content, "individual") || 
        `When individuals ${sanitizedBehavior.toLowerCase()}, it creates immediate convenience but may reduce financial flexibility over time. Short-term benefits often mask long-term costs.`,
      collective: extractSection(content, "collective") || 
        `When millions adopt this pattern over 10-30 years, it reshapes credit markets, alters institutional risk calculations, and shifts how society values immediate versus delayed gratification.`,
      pressure: extractSection(content, "pressure") || 
        `Pressure accumulates on household debt capacity, banking system stability, and social safety nets as more people become dependent on this financial pattern.`,
      lever: extractSection(content, "lever") || 
        `Financial literacy programs, transparent pricing regulations, and cultural conversations about deferred costs can help individuals make more informed choices.`
    };

    console.log("Fallback result:", JSON.stringify(result));
    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "System error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function extractSection(content: string, key: string): string | null {
  const patterns = [
    new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`, 'i'),
    new RegExp(`${key}[:\\s]+([^\\n]+)`, 'i'),
  ];
  
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) return match[1].trim();
  }
  return null;
}
