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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { behavior } = await req.json();
    
    if (!behavior) {
      return new Response(
        JSON.stringify({ error: "Behavior required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "System not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Simulating v2:", behavior);

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
          { role: "user", content: `Analyze this normalized financial behavior: "${behavior}"` }
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
        const result = {
          individual: String(source.individual || source.impact || ""),
          collective: String(source.collective || ""),
          pressure: String(source.pressure || ""),
          lever: String(source.lever || "")
        };
        
        console.log("Parsed result:", JSON.stringify(result));
        
        return new Response(
          JSON.stringify({ result }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (e) {
        console.error("JSON parse error:", e);
      }
    }

    // Fallback: parse sections manually
    const result = {
      individual: extractSection(content, "individual") || "Impact on personal financial flexibility and short-term decision making.",
      collective: extractSection(content, "collective") || "Systemic effects emerge as millions adopt this pattern over decades.",
      pressure: extractSection(content, "pressure") || "Stress accumulates across households, institutions, and future generations.",
      lever: extractSection(content, "lever") || "Policy adjustments combined with cultural awareness can shift trajectories."
    };

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
