import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are SOCIETY.EXE, a public financial intelligence system that analyzes how everyday financial behaviors scale into societal outcomes.

CRITICAL INSTRUCTIONS FOR ACCURACY:
- ONLY analyze financial/economic behaviors. If the input is not about money, spending, saving, debt, income, or economic activity, respond with an error.
- Base your analysis on documented economic research and observable patterns, not speculation.
- Do NOT invent statistics or cite specific studies unless they are well-established facts.
- If a behavior's impact is uncertain, say "research suggests" or "patterns indicate" rather than stating as fact.
- Focus on mechanism and process, not predictions with specific numbers.

For each VALID financial behavior, provide EXACTLY 4 sections:

1. INDIVIDUAL IMPACT: Immediate effects on a single person/household over 1-5 years (2-3 factual sentences about observable consequences)
2. COLLECTIVE IMPACT: How this scales when millions adopt this pattern over 10-30 years (2-3 sentences about documented systemic effects)
3. SYSTEM PRESSURE POINTS: Which systems face strain - household finances, banking, social safety nets, or intergenerational wealth (2-3 sentences)
4. LEVER FOR CHANGE: One evidence-based intervention from policy, education, technology, or cultural norms (2-3 sentences)

TONE REQUIREMENTS:
- Clear, factual, and educational
- No blame, shame, or moral judgment
- No fear-based language or catastrophizing
- Acknowledge uncertainty where it exists

RESPONSE FORMAT:
Return ONLY a valid JSON object with these exact keys: individual, collective, pressure, lever
Each value must be a string with 2-3 sentences.

If the input is NOT a financial behavior (e.g., random text, questions, off-topic requests), return:
{"error": "Please describe a financial behavior or money-related pattern to analyze."}`;

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
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this financial behavior and its societal impact: "${sanitizedBehavior}"\n\nRemember: Only analyze if this is a genuine financial/economic behavior. Base your analysis on observable patterns and documented research, not speculation.` }
        ],
        temperature: 0.3,
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
