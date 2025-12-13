import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are SOCIETY.EXE, an analytical system that projects the long-term societal impact of normalized financial behaviors. Your tone is:
- Calm and measured
- Intelligent and analytical
- Non-alarmist and non-judgmental
- Clear and educational

When given a normalized behavior, respond with EXACTLY this structure using markdown headers:

## Collective Trajectory
Explain how this behavior affects society over 10-30 years across four dimensions:
- Financial resilience
- Inequality
- Stability
- Opportunity

Write 2-3 thoughtful paragraphs.

## Systemic Cost
Identify who bears the long-term burden: households, institutions, governments, or future generations. Explain the transfer of risk and cost. Write 1-2 paragraphs.

## The Fork
Present two futures in clear contrast:

**If unchanged:** Describe the trajectory if behavior continues at current rates.

**With correction:** Describe the outcome if society makes a modest corrective shift.

## Lever for Change
Propose ONE realistic intervention that could improve outcomes. This could be:
- A policy adjustment
- An educational initiative
- A cultural shift
- A technological solution

Be specific and pragmatic.

Remember: No fear language. No blame. No personal advice. Only clarity about collective consequences.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { behavior } = await req.json();
    
    if (!behavior || typeof behavior !== "string") {
      return new Response(
        JSON.stringify({ error: "Please provide a behavior to simulate" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Simulating behavior:", behavior);

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
          { role: "user", content: `Analyze this normalized societal behavior and project its long-term collective impact: "${behavior}"` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Service is temporarily busy. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to generate simulation" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const simulation = data.choices?.[0]?.message?.content;

    if (!simulation) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "No simulation generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Simulation generated successfully");

    return new Response(
      JSON.stringify({ simulation }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in simulate-behavior:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
